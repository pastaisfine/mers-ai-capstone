import json
import uuid
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uuid_v7.base import uuid7

from models.schema import Incident, Call


# --- Assuming these are your definitions from your models file ---
# from models import engine, Incident, Call, IncidentLog, IncidentType, SeverityType

# Basic string parser for ISO timestamps
def parse_datetime(dt_str: str | None) -> datetime | None:
    if not dt_str:
        return None
    # Handles trailing 'Z' replacing it for Python compatibility if needed
    if dt_str.endswith('Z'):
        dt_str = dt_str[:-1] + '+00:00'
    return datetime.fromisoformat(dt_str)


def seed_data_from_json(json_file_path: str, session):
    with open(json_file_path, 'r', encoding='utf-8') as f:
        incidents_data = json.load(f)

    for data in incidents_data:
        # 1. Standardize / Generate a clean UUID for the incident
        # Converts "INC-0042" into a consistent UUID structure, or use uuid.uuid4()
        incident_id = uuid7()

        # Format map for coordinates from JSON dict {"lat": 3.15, "lng": 101.7} to ARRAY [lat, lng]
        coords_dict = data.get("coordinates", {})
        coords_array = [coords_dict.get("lat"), coords_dict.get("lng")] if coords_dict else None

        # 2. Build the Incident instance
        incident = Incident(
            id=incident_id,
            type=data.get("type"),
            coordinates=coords_array,
            title=data.get("title"),
            location=data.get("location"),
            ai_confidence=data.get("confidence"),  # mapping 'confidence' -> 'ai_confidence'
            ai_summary=data.get("reason"),  # mapping 'reason' -> 'ai_summary'
            severity=data.get("severity"),
            priority=data.get("priority"),
            occur_date_time=parse_datetime(data.get("occurDateTime")),
            distress_score=data.get("distressScore"),
            panic_level=data.get("panicLevel"),
            entities=data.get("entities"),
            reason=data.get("reason"),
            contradiction=data.get("contradiction"),
            sop_citation=data.get("sopCitation"),
            sop_procedure=data.get("sopProcedure"),
            responder=data.get("responder"),
            timeline=data.get("timeline"),
            transcript=data.get("transcript"),
            status=data.get("status", {})
        )

        session.add(incident)
        session.flush()

        # 3. Build related Call entry based on the caller details inside the json object
        if data.get("caller"):
            call_entry = Call(
                id=uuid7(),
                incident_id=incident_id,  # Link relationship
                caller_number="UNKNOWN",  # Default placeholder since JSON lacks explicit digits
                caller_name=data.get("caller"),
                audio_url=None,
                received_at=parse_datetime(data.get("occurDateTime")) or datetime.utcnow(),
                lang=data.get("lang")
            )
            session.add(call_entry)

    # Commit all items into the database securely
    try:
        session.commit()
        print(f"Successfully imported {len(incidents_data)} incidents into the database.")
    except Exception as e:
        session.rollback()
        print(f"An error occurred during transaction submission: {e}")
        raise e


# --- Example Execution Block ---
if __name__ == "__main__":
    # Substitute with your actual database link uri
    DATABASE_URL = ""

    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    db_session = Session()

    try:
        seed_data_from_json("mock_data.json", db_session)
    finally:
        db_session.close()