from uuid import UUID

from pydantic import BaseModel


class CreateCallTranscriptPayload(BaseModel):
    start_duration: int
    end_duration: int
    call_id: UUID
    transcript: str
    role: str
