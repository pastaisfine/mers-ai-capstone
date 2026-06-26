from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class InitCallPayload(BaseModel):
    incident_id: UUID
    caller_number: str
    received_at: datetime

class UpdateCallPayload(BaseModel):
    incident_id: UUID | None
    caller_name: str | None
    audio_url: str | None
    lang: str | None