import asyncio

from sqlalchemy import event
from torch import FloatTensor

from ml_models.audio_classification_model import predict_emotion_from_logits
from models.schema import AIEmotionAnalysis
from modules.connection_modules import CONNECTED_SSE_CLIENTS


@event.listens_for(AIEmotionAnalysis, "after_insert")
def after_insert_listener(mapper, connection, target):
    "send sse event"
    print(f"Notification: New emotion analysis result inserted with ID: {target.id}")
    emotion = predict_emotion_from_logits(FloatTensor([target.emotion_embeddings]))
    payload = {"event": "insert_emotion_analysis","id": target.id, "start": target.start_duration, "end": target.end_duration, "emotion": emotion}
    try:
        loop = asyncio.get_event_loop()
        for sse_client in CONNECTED_SSE_CLIENTS:
            loop.call_soon_threadsafe(sse_client.put_nowait, payload)
    except RuntimeError:
        pass