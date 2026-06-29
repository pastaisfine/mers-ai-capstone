import uuid

from pydantic import BaseModel

class InitAiEmotionAnalysisPayload(BaseModel):
    call_id: uuid.UUID
    emotion_embeddings: list[float]
    start_duration: float
    end_duration: float
    model_used: str