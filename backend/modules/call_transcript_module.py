from uuid_v7.base import uuid7

from database import db_dependency
from models.database.call_transcript import CreateCallTranscriptPayload
from models.schema import CallTranscript
from modules import db_module


def create_call_transcript(payload: CreateCallTranscriptPayload, db: db_dependency) -> CallTranscript:
    call_transcript_payload = (payload.model_dump() | {"id": uuid7()})
    new_call = db_module.init_data(call_transcript_payload, db, CallTranscript)
    return new_call