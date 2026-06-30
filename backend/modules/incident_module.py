from sqlalchemy import select, or_
from uuid_v7.base import uuid7

from main import db_dependency
from models.database.incident import InitIncidentPayload, InitIncidentLogPayload, QueryIncidentPayload
from models.schema import Incident, IncidentLog
from modules import db_module


def init_incident(payload: InitIncidentPayload, db: db_dependency) -> Incident:
    incident_payload = (payload.model_dump() | {"id": uuid7()})
    new_incident = db_module.init_data(incident_payload, db, Incident)
    new_incident_id = new_incident.id
    init_incident_log_pydantic = InitIncidentLogPayload(incident_id=new_incident_id, payload=incident_payload)
    incident_log_payload = (init_incident_log_pydantic.model_dump() | {"id": uuid7()})
    db_module.init_data(incident_log_payload, db, IncidentLog)
    return new_incident

def read_incidents(payload:QueryIncidentPayload , db: db_dependency) -> list[Incident]:
    stmt = select(Incident).where(payload.pattern is not None
                                  or Incident.title.contains(payload.pattern)
                                  or Incident.location.contains(payload.pattern)
                                  or Incident.id.contains(payload.pattern)
                                  or Incident.ai_summary.contains(payload.pattern)).limit(payload.size).offset((payload.page - 1) * payload.size)
    incidents = db.scalars(stmt).all()
    return list(incidents)



