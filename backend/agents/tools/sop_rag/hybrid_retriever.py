import os
import re
from time import perf_counter
from typing import Any, TypedDict

from dotenv import load_dotenv

from agents.tools.sop_rag.dense_retriever import dense_retrieve
from agents.tools.sop_rag.skill_cards import load_retrieval_config, normalize_retrieval_query, load_incident_skill_cards
from modules.observability_modules import log_event

load_dotenv()

STRONG_DISTANCE_THRESHOLD = float(os.getenv("RAG_STRONG_DISTANCE_THRESHOLD", "0.35"))
ACCEPTABLE_DISTANCE_THRESHOLD = float(
    os.getenv("RAG_ACCEPTABLE_DISTANCE_THRESHOLD", "0.60")
)
MIN_DISTANCE_MARGIN = float(os.getenv("RAG_MIN_DISTANCE_MARGIN", "0.005"))

if not 0 <= STRONG_DISTANCE_THRESHOLD <= ACCEPTABLE_DISTANCE_THRESHOLD <= 2:
    raise ValueError("RAG distance thresholds must satisfy 0 <= strong <= acceptable <= 2")
if not 0 <= MIN_DISTANCE_MARGIN <= 2:
    raise ValueError("RAG_MIN_DISTANCE_MARGIN must be between 0 and 2")

RETRIEVAL_CONFIG = load_retrieval_config()
SCORING_CONFIG = RETRIEVAL_CONFIG.get("scoring", {})
HIGH_SIGNAL_WEIGHT = SCORING_CONFIG.get("high_signal_weight")
SUPPORTING_WEIGHT = SCORING_CONFIG.get("supporting_weight")
REQUIRED_MATCH_BONUS = SCORING_CONFIG.get("required_match_bonus")
if not all(
    isinstance(value, (int, float)) and value >= 0
    for value in (HIGH_SIGNAL_WEIGHT, SUPPORTING_WEIGHT, REQUIRED_MATCH_BONUS)
):
    raise ValueError("Retrieval scoring weights must be non-negative numbers")
GENERIC_QUERIES = frozenset(RETRIEVAL_CONFIG.get("generic_queries", []))


class ConfidenceDecision(TypedDict):
    confidence: str
    accepted: bool
    reason: str
    reason_code: str


class RetrievalBundle(TypedDict):
    query: str
    normalized_query: str
    best_match: dict[str, Any] | None
    all_matches: list[dict[str, Any]]
    lexical_matches: list[dict[str, Any]]
    lexical_top_ids: list[str]
    retrieval_method: str
    retrieval_path: str
    retrieval_ms: float


def _contains_phrase(query: str, phrase: str) -> bool:
    normalized_phrase = normalize_retrieval_query(phrase)
    if not normalized_phrase:
        return False
    return bool(
        re.search(
            rf"(?<![a-z0-9]){re.escape(normalized_phrase)}(?![a-z0-9])",
            query,
        )
    )


def _matching_phrases(query: str, phrases: list[str]) -> list[str]:
    return [phrase for phrase in phrases if _contains_phrase(query, phrase)]


def lexical_retrieve(normalized_query: str) -> list[dict[str, Any]]:
    matches = []
    for card in load_incident_skill_cards():
        high_matches = _matching_phrases(
            normalized_query, card["high_signal_phrases"]
        )
        supporting_matches = _matching_phrases(
            normalized_query, card["supporting_phrases"]
        )
        required_matches = _matching_phrases(normalized_query, card["required_any"])
        ambiguity_matches = _matching_phrases(
            normalized_query, card["ambiguity_phrases"]
        )
        if not high_matches and not supporting_matches:
            continue

        required_satisfied = not card["required_any"] or bool(required_matches)
        trigger_score = (
            len(high_matches) * HIGH_SIGNAL_WEIGHT
            + len(supporting_matches) * SUPPORTING_WEIGHT
            + (REQUIRED_MATCH_BONUS if required_matches else 0)
        )
        matches.append(
            {
                "sop_id": card["sop_id"],
                "skill_name": card["skill_name"],
                "emergency_type": card["emergency_type"],
                "priority_level": card["priority_level"],
                "full_sop_ref": card["full_sop_ref"],
                "summary": card["summary"],
                "trigger_score": trigger_score,
                "high_signal_matches": high_matches,
                "supporting_matches": supporting_matches,
                "required_matches": required_matches,
                "required_satisfied": required_satisfied,
                "ambiguity_matches": ambiguity_matches,
            }
        )

    matches.sort(
        key=lambda match: (
            -match["trigger_score"],
            -len(match["high_signal_matches"]),
            match["sop_id"],
        )
    )
    for rank, match in enumerate(matches, start=1):
        match["lexical_rank"] = rank
    return matches


def transcript_has_actionable_context(
    transcript: str, lexical_matches: list[dict[str, Any]] | None = None
) -> bool:
    normalized = normalize_retrieval_query(transcript)
    if normalized in GENERIC_QUERIES:
        return False
    token_count = len(re.findall(r"[a-z0-9]+", normalized))
    return (token_count >= 2 and bool(lexical_matches)) or token_count >= 4


def _top_lexical_ids(matches: list[dict[str, Any]]) -> list[str]:
    if not matches:
        return []
    top_score = matches[0]["trigger_score"]
    top_high_signal_count = len(matches[0]["high_signal_matches"])
    return [
        match["sop_id"]
        for match in matches
        if match["trigger_score"] == top_score
        and len(match["high_signal_matches"]) == top_high_signal_count
    ]


def retrieve_sop_bundle_hybrid(
    query: str, k: int = 5, request_id: str | None = None
) -> RetrievalBundle:
    timer = perf_counter()
    normalized_query = normalize_retrieval_query(query)
    lexical_matches = lexical_retrieve(normalized_query)
    dense_matches = dense_retrieve(normalized_query, k=k, request_id=request_id)
    best_match = dense_matches[0] if dense_matches else None
    lexical_top_ids = _top_lexical_ids(lexical_matches)

    elapsed_ms = round((perf_counter() - timer) * 1000, 2)
    log_event(
        "hybrid_retrieval",
        request_id=request_id,
        duration_ms=elapsed_ms,
        normalized_query_changed=normalized_query != query.lower().strip(),
        dense_top_id=best_match.get("sop_id") if best_match else None,
        lexical_top_ids=lexical_top_ids,
        retrieval_path="pgvector_hybrid",
    )
    return {
        "query": query,
        "normalized_query": normalized_query,
        "best_match": best_match,
        "all_matches": dense_matches,
        "lexical_matches": lexical_matches,
        "lexical_top_ids": lexical_top_ids,
        "retrieval_method": "data_driven_hybrid",
        "retrieval_path": "pgvector_hybrid",
        "retrieval_ms": elapsed_ms,
    }


def classify_hybrid_confidence(
    bundle: RetrievalBundle, transcript: str = ""
) -> ConfidenceDecision:
    best_match = bundle.get("best_match")
    if not best_match:
        return {
            "confidence": "very_weak",
            "accepted": False,
            "reason": "No SOP match was found.",
            "reason_code": "no_match",
        }

    lexical_matches = bundle.get("lexical_matches", [])
    if not transcript_has_actionable_context(transcript, lexical_matches):
        return {
            "confidence": "weak",
            "accepted": False,
            "reason": "The transcript does not contain enough emergency context.",
            "reason_code": "not_actionable",
        }

    all_matches = bundle.get("all_matches", [])
    distance = best_match.get("distance_score")
    second_distance = all_matches[1].get("distance_score") if len(all_matches) > 1 else None
    margin = (
        second_distance - distance
        if distance is not None and second_distance is not None
        else None
    )
    if distance is None or distance > ACCEPTABLE_DISTANCE_THRESHOLD:
        return {
            "confidence": "weak",
            "accepted": False,
            "reason": f"Dense distance {distance!r} exceeds the acceptable threshold.",
            "reason_code": "dense_distance_too_high",
        }
    if margin is None or margin < MIN_DISTANCE_MARGIN:
        return {
            "confidence": "weak",
            "accepted": False,
            "reason": f"Dense top-two margin {margin!r} is too small.",
            "reason_code": "dense_margin_too_small",
        }

    dense_top_id = best_match.get("sop_id")
    lexical_top_ids = bundle.get("lexical_top_ids", [])
    dense_lexical_match = next(
        (match for match in lexical_matches if match["sop_id"] == dense_top_id), None
    )

    if lexical_top_ids and dense_top_id not in lexical_top_ids:
        return {
            "confidence": "weak",
            "accepted": False,
            "reason": (
                f"Dense selected {dense_top_id}, but trigger retrieval selected "
                f"{lexical_top_ids}."
            ),
            "reason_code": "source_disagreement",
        }
    if dense_lexical_match and dense_lexical_match["ambiguity_matches"]:
        return {
            "confidence": "weak",
            "accepted": False,
            "reason": "The transcript contains a competing emergency mechanism.",
            "reason_code": "mechanism_ambiguity",
        }
    if dense_lexical_match and not dense_lexical_match["required_satisfied"]:
        return {
            "confidence": "weak",
            "accepted": False,
            "reason": "Required SOP trigger evidence is missing.",
            "reason_code": "required_signal_missing",
        }

    if dense_top_id in lexical_top_ids:
        confidence = "strong" if distance <= STRONG_DISTANCE_THRESHOLD else "acceptable"
        tied = len(lexical_top_ids) > 1
        return {
            "confidence": confidence,
            "accepted": True,
            "reason": (
                f"Dense retrieval selected {dense_top_id} from the highest-scoring "
                f"trigger candidates; distance={distance:.4f}, margin={margin:.4f}."
            ),
            "reason_code": (
                "dense_resolved_lexical_tie" if tied else "source_agreement"
            ),
        }

    if not lexical_matches and distance <= STRONG_DISTANCE_THRESHOLD:
        return {
            "confidence": "acceptable",
            "accepted": True,
            "reason": (
                "No trigger phrase matched, but semantic retrieval is strong and "
                f"separated; distance={distance:.4f}, margin={margin:.4f}."
            ),
            "reason_code": "strong_dense_only",
        }

    return {
        "confidence": "weak",
        "accepted": False,
        "reason": "The hybrid signals are insufficient to lock an SOP.",
        "reason_code": "insufficient_hybrid_signal",
    }
