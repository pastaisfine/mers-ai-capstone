from typing import Annotated

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from constants.queue import EMOTION_ANALYSIS_QUEUE
from database import engine, SessionLocal
import models.schema as models
from modules.pika_module import PikaPublisher


class MersAIBackendApp(FastAPI):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pika_emotion_analyse_publisher = PikaPublisher(EMOTION_ANALYSIS_QUEUE)
        
app = MersAIBackendApp()
def db_setup():
    models.Base.metadata.create_all(engine)

db_setup()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


import apis.incidents
import websocket
import apis.twilio_api