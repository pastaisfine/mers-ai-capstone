from typing import Any

from sqlalchemy import select, or_
from sqlalchemy.orm import Session, joinedload
from uuid_v7.base import uuid7, UUID

from models.database.incident import InitIncidentPayload, InitIncidentLogPayload, QueryIncidentPayload, \
    UpdateIncidentPayload
from models.schema import Incident, IncidentLog, Call
from modules import db_module
from modules.transcripts import call_transcript_module


def init_incident(payload: InitIncidentPayload, db: Session) -> Incident:
    incident_payload = (payload.model_dump() | {"id": uuid7()})
    new_incident = db_module.init_data(incident_payload, db, Incident)
    new_incident_id = new_incident.id
    init_incident_log_pydantic = InitIncidentLogPayload(incident_id=new_incident_id, payload=incident_payload)
    incident_log_payload = (init_incident_log_pydantic.model_dump() | {"id": uuid7()})
    db_module.init_data(incident_log_payload, db, IncidentLog)
    return new_incident

def read_incidents(payload:QueryIncidentPayload , db: Session) -> list[Incident]:
    stmt = select(Incident).options(joinedload(Incident.call)).join(Call, Call.incident_id == Incident.id).order_by(Incident.created_at.desc())
    if payload.pattern:
        stmt = stmt.where(or_(Incident.title.contains(payload.pattern),
                              Incident.location.contains(payload.pattern),
                              Incident.id.contains(payload.pattern),
                              Incident.ai_summary.contains(payload.pattern)))
    stmt = stmt.limit(payload.size).offset((payload.page - 1) * payload.size)
    incidents = db.scalars(stmt).unique().all()
    formatted_incidents = []
    for incident in incidents:
        populated_incident = _convert_incident(incident, db)
        formatted_incidents.append(populated_incident)
    return formatted_incidents

def read_incident(incident_id: UUID, db: Session) -> dict | None:
    stmt = select(Incident).options(joinedload(Incident.call)).join(Call, Call.incident_id == Incident.id).where(Incident.id == incident_id)
    incident = db.scalars(stmt).unique().one_or_none()
    if not incident:
        return None
    return _convert_incident(incident, db)

def _convert_incident(incident: Any, db: Session):
    lat = incident.coordinates[0] if incident.coordinates and len(incident.coordinates) > 0 else 0
    lng = incident.coordinates[1] if incident.coordinates and len(incident.coordinates) > 1 else 0
    call_id = getattr(incident.call[0], "id", None)
    transcript = call_transcript_module.read_transcripts(incident.call[0].id, db) if call_id else []
    return {
        "id": str(incident.id),
        "type": incident.type.value if hasattr(incident.type, "value") else incident.type,
        "title": incident.title,
        "location": incident.location,
        "severity": incident.severity.value if hasattr(incident.severity, "value") else incident.severity,
        "priority": incident.priority,

        # Fields retrieved directly from the joined 'Call' record
        "lang": getattr(incident.call[0], "lang", ""),
        "caller": getattr(incident.call[0], "caller_name", ""),
        "callId": getattr(incident.call[0], "id", ""),
        # Date format converted to ISO-8601 string standard
        "occurDateTime": incident.occur_date_time.isoformat() + "Z" if incident.occur_date_time else None,

        "distressScore": incident.distress_score,
        "panicLevel": incident.panic_level,
        "entities": incident.entities or [],
        "reason": incident.reason or incident.ai_summary,
        "confidence": incident.ai_confidence or 0.0,
        "contradiction": incident.contradiction,
        "sopCitation": incident.sop_citation,
        "sopProcedure": incident.sop_procedure or [],
        "responder": incident.responder or {},
        "timeline": incident.timeline or [],
        "transcript": transcript,
        "coordinates": {"lat": lat, "lng": lng},
        "status": incident.status or {}
    }

def update_incident_by_id(incident_id: UUID, payload: UpdateIncidentPayload, db:Session)-> Incident:
    incident_payload = payload.model_dump()
    incident = db_module.update_data_by_id(incident_id, incident_payload, db, Incident)
    return incident

