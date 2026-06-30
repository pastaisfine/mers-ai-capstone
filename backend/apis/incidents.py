from fastapi import APIRouter

from models.database.incident import QueryIncidentPayload
from main import db_dependency
from modules import incident_module

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get('')
async def read_incidents(page: int, size: int, pattern: str | None, db: db_dependency):
    return incident_module.read_incidents(QueryIncidentPayload(page=page, pattern=pattern, size=size),db)

