from fastapi import APIRouter, Query

from database import db_dependency
from models.database.incident import QueryIncidentPayload
from modules import incident_module

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get('')
async def read_incidents(db: db_dependency, page: int = Query(1, ge=1, description="Page number"),
                         size: int = Query(10, ge=1, le=100, description="Page size"), pattern: str | None = Query(None, description="Search pattern")):
    return incident_module.read_incidents(QueryIncidentPayload(page=int(page), pattern=pattern, size=int(size)),db)

