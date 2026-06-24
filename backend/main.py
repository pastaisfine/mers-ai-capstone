from typing import Annotated

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from database import engine, SessionLocal
import models.schema as models

app = FastAPI()
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