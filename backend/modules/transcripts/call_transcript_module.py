from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid_v7.base import uuid7, UUID

from database import db_dependency
from models.database.call_transcript import CreateCallTranscriptPayload, UtteranceExistsPayload
from models.schema import CallTranscript
from modules import db_module

def create_call_transcript(payload: CreateCallTranscriptPayload, db: db_dependency) -> CallTranscript:
    call_transcript_payload = (payload.model_dump() | {"id": uuid7()})
    new_call_transcript = db_module.init_data(call_transcript_payload, db, CallTranscript)
    return new_call_transcript

def read_transcripts(call_id: UUID, db: Session) -> list[CallTranscript]:
    stmt = select(CallTranscript).where(CallTranscript.call_id == call_id).order_by(CallTranscript.start_duration)
    transcripts = db.scalars(stmt).unique().all()
    return list(transcripts)

def utterance_exists(payload: UtteranceExistsPayload, db: Session)-> bool:
    call_id = payload.call_id
    start_duration = payload.start_duration
    end_duration = payload.end_duration
    conditions = [
        CallTranscript.call_id == call_id,
        CallTranscript.start_duration == start_duration,
        CallTranscript.end_duration == end_duration,
    ]
    if payload.transcript is not None:
        conditions.append(CallTranscript.transcript == payload.transcript)
    if payload.role is not None:
        conditions.append(CallTranscript.role == payload.role)
    stmt = select(CallTranscript).where(*conditions)
    transcript = db.scalars(stmt).first()
    return transcript is not None