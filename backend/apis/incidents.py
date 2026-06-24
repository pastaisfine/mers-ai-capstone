import uuid
from models.schema import Dispatcher
from main import db_dependency
from main import app

@app.get("/")
async def read_root(db: db_dependency):
    new_dispatcher = Dispatcher(id=uuid.uuid4(), user_id=uuid.uuid4(), name="Testing123", status="Test", badge_number="abc123")
    db.add(new_dispatcher)
    db.commit()
    db.refresh(new_dispatcher)
    return
