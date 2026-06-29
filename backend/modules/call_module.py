import uuid

from main import db_dependency
from models.call import InitCallPayload, UpdateCallPayload
from models.schema import Call
import modules.db_module as db_module

def init_call(payload: InitCallPayload, db: db_dependency) -> Call:
    call_payload = (payload.model_dump() | {"id": uuid.uuid4()})
    new_call = db_module.init_data(call_payload, db, Call)
    return new_call

def update_call(call_id: uuid.UUID, payload: UpdateCallPayload, db: db_dependency ) -> Call:
    call_payload = payload.model_dump()
    updated_call = db_module.update_data_by_id(call_id,call_payload, db, Call)
    return updated_call