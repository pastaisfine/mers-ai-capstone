
from uuid_v7.base import uuid7

from main import db_dependency
from models.database.incident import InitIncidentPayload, InitIncidentLogPayload
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

