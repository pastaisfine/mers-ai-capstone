import logging
from uuid import UUID

from sqlalchemy.orm import Session

from agents.transcript_incident_agent.chain import chain, format_utterances
from database import SessionLocal
from models.schema import Call, Incident
from modules import db_module
from modules.transcripts import call_transcript_module

logger = logging.getLogger(__name__)


def run_incident_extraction(call_id: UUID, db: Session) -> None:
    call = db.get(Call, call_id)
    if call is None:
        logger.error("Call %s not found", call_id)
        return

    incident = db.get(Incident, call.incident_id)
    if incident is None:
        logger.error("Incident for call %s not found", call_id)
        return

    if incident.title != "DRAFT INCIDENT":
        logger.info("Incident %s already processed, skipping", incident.id)
        return

    utterances = call_transcript_module.read_transcripts(call_id, db)
    if not utterances:
        logger.warning("No transcripts found for call %s", call_id)
        return

    transcript_str = format_utterances(utterances)

    try:
        extracted = chain.invoke({"transcript": transcript_str})
        payload = extracted.model_dump(exclude_none=True)
        db_module.update_data_by_id(incident.id, payload, db, Incident)
        db.commit()
        logger.info("Successfully extracted incident %s from call %s", incident.id, call_id)
    except Exception as e:
        logger.error("Extraction failed for call %s: %s", call_id, e)
        db_module.update_data_by_id(incident.id, {
            "status": {"stage": "draft", "extraction_error": str(e)},
            "reason": "Extraction failed, pending manual review",
        }, db, Incident)
        db.commit()
