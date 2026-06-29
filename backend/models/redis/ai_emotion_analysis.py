import torch
from pydantic import BaseModel

class RedisEmotionAnalysisHash(BaseModel):
    start: float
    end: float
    emotion_logits: torch.FloatTensor | None