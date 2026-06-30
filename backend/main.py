import asyncio
from contextlib import asynccontextmanager

import math
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import convertor
from apis.incidents import router as incident_router
from constants import file
from constants.queue import EMOTION_ANALYSIS_QUEUE
from constants.redis_key import get_redis_emotional_analysis_key
from database import SessionLocal, engine, get_db
from environment import ALLOW_ORIGINS
from ml_models import audio_classification_model
from models.database.ai_emotion_analysis import InitAiEmotionAnalysisPayload
from models.redis.ai_emotion_analysis import RedisEmotionAnalysisHash
from modules import storage_module, sound_module, db_module, ai_emotion_analysis_module
from modules.pika_module import PikaPublisher, PikaConsumer
from modules.redis_module import redis_client
import models.schema as models


def _perform_emotional_analysis(voice_bytes, start, end) -> RedisEmotionAnalysisHash:
    duration = 5
    clipped_voice_bytes = sound_module.get_audio_clip_part(voice_bytes, start=start, duration=duration)
    emotion_logits = audio_classification_model.generate_emotion_logits(clipped_voice_bytes)

    return RedisEmotionAnalysisHash(
        start=start,
        end=end,
        emotion_logits=emotion_logits.tolist() if emotion_logits is not None else None,
    )


def _set_redis(key: str, payload: RedisEmotionAnalysisHash):
    redis_client.hset(key, {
        "start": payload.start,
        "end": payload.end,
    })
    if payload.emotion_logits is not None:
        redis_client.hset(key, "emotion_logits", payload.emotion_logits.tolist()[0])

class MersAIBackendApp(FastAPI):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pika_emotion_analyse_publisher = PikaPublisher(EMOTION_ANALYSIS_QUEUE)
        self.pika_emotion_analyse_consumer = PikaConsumer(EMOTION_ANALYSIS_QUEUE, self.emotion_analyse_task)

    @classmethod
    def emotion_analyse_task(cls, message: dict):
        """ sid """
        # isDone
        call_id = message['call_id']
        is_done = message['is_done']
        file_url = file.to_voice_file_name(call_id)
        voice_bytes = storage_module.download_file(file_url)
        if voice_bytes is None:
            return
        key = get_redis_emotional_analysis_key(call_id)
        redis_result = redis_client.hgetall(key)
        total_length = sound_module.get_audio_length(voice_bytes)
        duration = 5
        if redis_result.get("analysis_result") is None:
            redis_payload = _perform_emotional_analysis(voice_bytes, start=0, end=min(total_length, duration))
            _set_redis(key, redis_payload)
        else:
            redis_result_start: float = redis_result.get("start")
            redis_result_end: float = redis_result.get("end")
            audio_chunk_end = math.ceil(redis_result_end / duration) * duration
            need_store_data = False
            if total_length > audio_chunk_end:
                new_end = audio_chunk_end
                need_store_data = True
            else:
                new_end = total_length
            clipped_voice_bytes = sound_module.get_audio_clip_part(voice_bytes, start=redis_result_start, duration=duration)

            def _execute_store_emotional_analysis():
                ai_emotion_analysis_module.init_ai_emotion_analysis(InitAiEmotionAnalysisPayload(
                    call_id=call_id,
                    model_used=audio_classification_model.model_id,
                    start_duration=redis_result_start,
                    end_duration=new_end,
                    emotion_embeddings=convertor.float_list_str_to_float_list(redis_emotion_logits),
                ), db=db)

            db = SessionLocal()
            if need_store_data:
                redis_emotion_logits = redis_result.get("emotion_logits")
                db_module.execute_table_operation(db=db, db_execute_operation=_execute_store_emotional_analysis)
                redis_payload = _perform_emotional_analysis(clipped_voice_bytes, start=new_end, end=total_length)
                _set_redis(key, redis_payload)
            else:
                redis_payload = _perform_emotional_analysis(clipped_voice_bytes, start=redis_result_start, end=new_end)
                if is_done:
                    db_module.execute_table_operation(db=db, db_execute_operation=_execute_store_emotional_analysis)
                    redis_client.hdel(key)
                else:
                    _set_redis(key, redis_payload)

app = MersAIBackendApp()
def db_setup():
    models.Base.metadata.create_all(engine)

db_setup()

@asynccontextmanager
async def lifespan(app: MersAIBackendApp):
    loop = asyncio.get_event_loop()
    consumer_task = loop.create_task(app.pika_emotion_analyse_consumer.consume(loop))
    print("RabbitMQ emotion analyse consumer started in the background.")

    yield

    print("Shutting down RabbitMQ emotion analyse consumer consumer...")
    consumer_task.cancel()
    try:
        await consumer_task
    except asyncio.CancelledError:
        print("RabbitMQ emotion analyse consumer successfully stopped.")

app.include_router(incident_router)
import apis.twilio_api
import apis.sse
import apis.websocket

origins = ALLOW_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)