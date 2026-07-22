from functools import lru_cache
from uuid import uuid4

from agents.tools.sop_rag.hybrid_retriever import retrieve_sop_bundle_hybrid, classify_hybrid_confidence
from environment import FULL_SOPS_PATH
from models.dto.sop_rag import RagQueryRequest, RagQueryResponse, RetrievalDecision
from modules.observability_modules import log_event

@lru_cache(maxsize=128)
def load_full_sop(full_sop_ref: str) -> str:
    """
    Load the full SOP markdown file linked from a retrieved skill card.

    The reference comes from the selected skill-card metadata.
    """
    if not full_sop_ref:
        raise ValueError("Missing full_sop_ref in retrieved skill card metadata.")

    sop_path = (FULL_SOPS_PATH / full_sop_ref).resolve()
    sop_root = FULL_SOPS_PATH.resolve()

    if sop_root not in sop_path.parents:
        raise ValueError("Full SOP reference must remain inside the SOP directory.")

    if not sop_path.exists():
        raise FileNotFoundError(f"Full SOP file not found: {sop_path}")

    return sop_path.read_text(encoding="utf-8")

def query_rag(request: RagQueryRequest) -> RagQueryResponse | None:
    request_id = str(uuid4())
    try:
        bundle = retrieve_sop_bundle_hybrid(
            request.query,
            k=request.k,
            request_id=request_id,
        )
        confidence = classify_hybrid_confidence(bundle, request.query)
        accepted = confidence["accepted"]
        full_sop = (
            load_full_sop(bundle["best_match"]["full_sop_ref"])
            if accepted and bundle["best_match"]
            else None
        )
    except Exception as exc:
        log_event(
            "rag_query_failed",
            request_id=request_id,
            error_type=type(exc).__name__,
        )
        # raise HTTPException(
        #     status_code=503,
        #     detail="SOP retrieval is temporarily unavailable.",
        # ) from exc
        # TODO: error handling when query_rag fails
        return None

    return RagQueryResponse(
        request_id=request_id,
        normalized_query=bundle["normalized_query"],
        retrieval_path=bundle["retrieval_path"],
        best_match=bundle["best_match"],
        decision=RetrievalDecision(
            confidence=confidence["confidence"],
            accepted=accepted,
            reason=confidence["reason"],
            reason_code=confidence["reason_code"],
        ),
        full_sop=full_sop,
    )