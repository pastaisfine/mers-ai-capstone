import hashlib
import json
import os
import re
from functools import lru_cache
from typing import Any

from dotenv import load_dotenv

from environment import RETRIEVAL_SIGNALS_PATH, SKILL_CARDS_PATH, FULL_SOPS_PATH

load_dotenv()

EMBEDDING_MODEL = os.getenv(
    "GEMINI_EMBEDDING_MODEL", "models/gemini-embedding-001"
)
DOCUMENT_TASK_TYPE = "RETRIEVAL_DOCUMENT"
QUERY_TASK_TYPE = "RETRIEVAL_QUERY"
VECTOR_SCHEMA = os.getenv("RAG_VECTOR_SCHEMA", "public")
VECTOR_TABLE = os.getenv("RAG_VECTOR_TABLE", "rag_sop_embeddings")

for identifier in (VECTOR_SCHEMA, VECTOR_TABLE):
    if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", identifier):
        raise ValueError(f"Invalid PostgreSQL identifier: {identifier!r}")

@lru_cache(maxsize=1)
def load_retrieval_config() -> dict[str, Any]:
    return json.loads(RETRIEVAL_SIGNALS_PATH.read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def load_incident_skill_cards() -> tuple[dict[str, Any], ...]:
    rows: dict[str, dict[str, Any]] = {}
    for line_number, line in enumerate(
        SKILL_CARDS_PATH.read_text(encoding="utf-8").splitlines(), start=1
    ):
        if not line.strip():
            continue
        row = json.loads(line)
        sop_id = row.get("sop_id")
        if not sop_id:
            raise ValueError(f"Missing sop_id on skill-card line {line_number}")
        if sop_id in rows:
            raise ValueError(f"Duplicate skill-card SOP ID: {sop_id}")
        rows[sop_id] = row

    signals = load_retrieval_config().get("sops", {})
    if not signals:
        raise ValueError("Retrieval configuration does not contain any SOPs")
    missing_cards = sorted(set(signals) - set(rows))
    if missing_cards:
        raise ValueError(f"Retrieval signals reference missing cards: {missing_cards}")

    incident_cards = []
    required_fields = (
        "high_signal_phrases",
        "supporting_phrases",
        "required_any",
        "ambiguity_phrases",
    )
    required_card_fields = (
        "skill_name",
        "summary",
        "emergency_type",
        "priority_level",
        "full_sop_ref",
    )
    for sop_id, signal_config in signals.items():
        missing_fields = [field for field in required_fields if field not in signal_config]
        if missing_fields:
            raise ValueError(f"{sop_id} is missing retrieval fields: {missing_fields}")
        missing_card_fields = [field for field in required_card_fields if not rows[sop_id].get(field)]
        if missing_card_fields:
            raise ValueError(f"{sop_id} is missing skill-card fields: {missing_card_fields}")
        sop_path = (FULL_SOPS_PATH / rows[sop_id]["full_sop_ref"]).resolve()
        sop_root = FULL_SOPS_PATH.resolve()
        if sop_root not in sop_path.parents or not sop_path.is_file():
            raise ValueError(f"{sop_id} references an invalid full SOP file")
        incident_cards.append({**rows[sop_id], **signal_config, "retrieval_role": "incident"})

    return tuple(incident_cards)


def normalize_retrieval_query(query: str) -> str:
    normalized = query.lower().replace("’", "'")
    normalized = re.sub(r"[^a-z0-9+'-]+", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized).strip()
    aliases = load_retrieval_config().get("aliases", {})
    for source, replacement in sorted(aliases.items(), key=lambda item: -len(item[0])):
        normalized = re.sub(
            rf"(?<![a-z0-9]){re.escape(source.lower())}(?![a-z0-9])",
            replacement.lower(),
            normalized,
        )
    return normalized


def build_embedding_text(card: dict[str, Any]) -> str:
    phrases = list(
        dict.fromkeys(card["high_signal_phrases"] + card["supporting_phrases"])
    )
    return "\n".join(
        (
            f"SOP: {card['skill_name']}",
            f"Summary: {card['summary']}",
            f"Caller trigger phrases: {', '.join(phrases)}",
        )
    )


def embedding_source_payload() -> list[dict[str, str]]:
    return [
        {"sop_id": card["sop_id"], "text": build_embedding_text(card)}
        for card in sorted(load_incident_skill_cards(), key=lambda item: item["sop_id"])
    ]


def canonical_json_bytes(payload: Any) -> bytes:
    return json.dumps(
        payload,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
        allow_nan=False,
    ).encode("utf-8")


def embedding_source_sha256() -> str:
    return hashlib.sha256(canonical_json_bytes(embedding_source_payload())).hexdigest()
