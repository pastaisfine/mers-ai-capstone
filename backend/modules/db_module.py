from typing import Type, Any, Callable
from uuid import UUID

from sqlalchemy.orm import Session
from models.schema import Base

def init_data(payload: dict[str, Any], db: Session, model: Type[Base]):
    new_model = model(**payload)
    db.add(new_model)
    db.flush()
    db.refresh(new_model)
    return new_model

def update_data_by_id(model_id: UUID, payload: dict[str, Any], db: Session, model: Type[Base]):
    model_result = db.get_one(model, model_id)
    for key, value in payload.items():
        setattr(model_result, key, value)
    db.add(model_result)
    db.flush()
    return model_result

def execute_table_operation(db: Session, db_execute_operation: Callable[[], None]):
    try:
        with db.begin():
            db_execute_operation()
    except Exception as e:
        print(f"Transaction failed and was safely rolled back. Reason: {e}")
        raise e