from typing import Annotated

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from database import engine, SessionLocal
# from database import db_setup, db_dependency
from models.schema import Dispatcher
import uuid
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
@app.get("/")
async def read_root(db: db_dependency):
    new_dispatcher = Dispatcher(id=uuid.uuid4(), user_id=uuid.uuid4(), name="Testing123", status="Test", badge_number="abc123")
    db.add(new_dispatcher)
    db.commit()
    db.refresh(new_dispatcher)
    return