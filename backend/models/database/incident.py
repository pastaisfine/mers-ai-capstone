from uuid import UUID

from pydantic import BaseModel

class InitIncidentPayload(BaseModel):
    title: str

class InitIncidentLogPayload(BaseModel):
    incident_id: UUID
    payload: InitIncidentPayload

class QueryIncidentPayload(BaseModel):
    page: int
    size: int
    pattern: str | None