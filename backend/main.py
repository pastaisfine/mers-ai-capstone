from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apis.incidents import router as incident_router
from database import engine
from environment import ALLOW_ORIGINS
import models.schema as models

app = FastAPI()

def db_setup():
    models.Base.metadata.create_all(engine)

db_setup()

app.include_router(incident_router)
import apis.twilio_api
import apis.websocket

origins = ALLOW_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)