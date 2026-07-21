from pydantic import BaseModel, Field, field_validator

class SopMatch(BaseModel):
    rank: int
    distance_score: float | None
    sop_id: str
    skill_name: str
    emergency_type: str
    priority_level: str
    full_sop_ref: str
    summary: str

class RetrievalDecision(BaseModel):
    confidence: str
    accepted: bool
    reason: str
    reason_code: str

class RagQueryRequest(BaseModel):
    query: str = Field(
        min_length=2,
        max_length=4000,
        description="Emergency description or caller transcript.",
        examples=["Describe the emergency and immediate danger"],
    )
    k: int = Field(default=5, ge=2, le=10, description="Number of dense matches.")

    @field_validator("query")
    @classmethod
    def validate_query(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Query must not be blank.")
        return value

class RagQueryResponse(BaseModel):
    request_id: str
    normalized_query: str
    retrieval_path: str
    best_match: SopMatch | None
    decision: RetrievalDecision
    full_sop: str | None = Field(
        description="Full selected SOP Markdown. Omitted when retrieval is not accepted."
    )

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class ScoringConfig(BaseModel):
    high_signal_weight: int = Field(
        ..., description="Weight given to high signal phrase matches"
    )
    supporting_weight: int = Field(
        ..., description="Weight given to supporting phrase matches"
    )
    required_match_bonus: int = Field(
        ..., description="Bonus points awarded when a required match criteria is met"
    )


class SOPDefinition(BaseModel):
    high_signal_phrases: List[str] = Field(default_factory=list)
    supporting_phrases: List[str] = Field(default_factory=list)
    required_any: List[str] = Field(default_factory=list)
    ambiguity_phrases: List[str] = Field(default_factory=list)


class DispatchSOPConfig(BaseModel):
    scoring: ScoringConfig
    generic_queries: List[str] = Field(default_factory=list)
    aliases: Dict[str, str] = Field(
        default_factory=dict,
        description="Maps colloquial/misspelled phrases to standardized canonical forms",
    )
    sops: Dict[str, SOPDefinition] = Field(
        default_factory=dict,
        description="Maps SOP code identifiers (e.g., MED-004-STROKE) to their definition rules",
    )