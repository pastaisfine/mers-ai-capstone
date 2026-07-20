import uuid

from sqlalchemy import select
from uuid_v7.base import uuid7

from database import db_dependency
from models.database.call import InitCallPayload, UpdateCallPayload
from models.schema import Call
import modules.db_module as db_module


def init_call(payload: InitCallPayload, db: db_dependency) -> Call:
    call_payload = (payload.model_dump() | {"id": uuid7()})
    new_call = db_module.init_data(call_payload, db, Call)
    return new_call

def get_call_id_by_sid(sid: str, db: db_dependency) -> uuid.UUID | None:
    stmt = select(Call.id).where(Call.provider_sid == sid)
    call_id = db.scalars(stmt).first()
    return call_id

def get_call_id_and_incident_id_by_sid(sid: str, db: db_dependency) -> tuple[uuid.UUID, uuid.UUID] | None:
    stmt = select(Call.id, Call.incident_id).where(Call.provider_sid == sid)
    row = db.scalars(stmt).first()
    return row.id, row.incident_id if row else None


def update_call(call_id: uuid.UUID, payload: UpdateCallPayload, db: db_dependency) -> Call:
    call_payload = payload.model_dump()
    updated_call = db_module.update_data_by_id(call_id, call_payload, db, Call)
    return updated_call
