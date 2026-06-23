from sqlalchemy import null
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.orm import declarative_base

from models.enum.index import IncidentType

Base = declarative_base()
# --- Models ---

class Dispatcher(Base):
    __tablename__ = "dispatchers"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=False) # Marked as FK in schema, adjust target if you have a Users table
    name = Column(String, nullable=False)
    badge_number = Column(String, nullable=False)
    status = Column(String, nullable=False)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    type = Column(Enum(IncidentType), nullable=False)
    dispatcher_id = Column(UUID(as_uuid=True), ForeignKey("dispatchers.id"), nullable=True)
    created_at = Column(DateTime, nullable=False)
    resolved_at = Column(DateTime, nullable=True)


class Call(Base):
    __tablename__ = "calls"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False)
    caller_number = Column(String, nullable=False)
    transcript = Column(Text, nullable=True)
    audio_url = Column(String, nullable=True)
    received_at = Column(DateTime, nullable=False)
    lang = Column(String, nullable=True)


class CallTranscript(Base):
    __tablename__ = "call_transcripts"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    start_duration = Column(Integer, nullable=False) # In milliseconds
    end_duration = Column(Integer, nullable=False)   # In milliseconds
    call_id = Column(UUID(as_uuid=True), ForeignKey("calls.id"), nullable=False)
    transcript = Column(String, nullable=False)
    seq = Column(Integer, nullable=False)


class AITriageAssessment(Base):
    __tablename__ = "ai_triage_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False)
    severity_score = Column(Integer, nullable=False)
    priority_level = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime, nullable=False)


class AIEmotionAnalysis(Base):
    __tablename__ = "ai_emotion_analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    call_id = Column(UUID(as_uuid=True), ForeignKey("calls.id"), nullable=False)
    emotion_embeddings = Column(ARRAY(Float), nullable=False)
    created_at = Column(DateTime, nullable=False)


class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    contact = Column(String, nullable=False)
    specializations = Column(JSONB, nullable=True)


class AIDispatchRecommendation(Base):
    __tablename__ = "ai_dispatch_recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False)
    reasoning = Column(Text, nullable=False)
    status = Column(String, nullable=False)
    recommended_unit_ids = Column(JSONB, nullable=False)
    recommended_hospital_id = Column(UUID(as_uuid=True), ForeignKey("hospitals.id"), nullable=True)
    created_at = Column(DateTime, nullable=False)


class DispatcherAction(Base):
    __tablename__ = "dispatcher_actions"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False)
    dispatcher_id = Column(UUID(as_uuid=True), ForeignKey("dispatchers.id"), nullable=False)
    recommendation_id = Column(UUID(as_uuid=True), ForeignKey("ai_dispatch_recommendations.id"), nullable=False)
    action_type = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False)
    age = Column(String, nullable=False)


class ResponseUnit(Base):
    __tablename__ = "response_units"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    unit_number = Column(String, nullable=False)
    type = Column(String, nullable=False)
    status = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    last_updated = Column(DateTime, nullable=False)


class Dispatch(Base):
    __tablename__ = "dispatches"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False)
    unit_id = Column(UUID(as_uuid=True), ForeignKey("response_units.id"), nullable=False)
    hospital_id = Column(UUID(as_uuid=True), ForeignKey("hospitals.id"), nullable=True)
    dispatcher_id = Column(UUID(as_uuid=True), ForeignKey("dispatchers.id"), nullable=False)
    status = Column(String, nullable=False)
    dispatched_at = Column(DateTime, nullable=False)
    arrived_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)


class HospitalCapacity(Base):
    __tablename__ = "hospital_capacity"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    hospital_id = Column(UUID(as_uuid=True), ForeignKey("hospitals.id"), nullable=False)
    available_beds = Column(Integer, nullable=False)
    icu_beds = Column(Integer, nullable=False)
    er_status = Column(String, nullable=False)
    updated_at = Column(DateTime, nullable=False)