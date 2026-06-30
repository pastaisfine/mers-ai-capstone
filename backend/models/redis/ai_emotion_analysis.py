import torch
from pydantic import BaseModel

class RedisEmotionAnalysisHash(BaseModel):
    start: float
    end: float
    emotion_logits: list[list[float]] | None