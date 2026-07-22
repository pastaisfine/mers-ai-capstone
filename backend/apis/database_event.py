from sqlalchemy import event
from sqlalchemy.orm import Session

from async_context_managers import base
from async_context_managers.transcript_broadcast_consumer import job_queue as transcript_job_queue
from async_context_managers.incident_broadcast_consumer import job_queue as incident_job_queue
from models.schema import CallTranscript, Incident
from modules import incident_module
from modules.transcripts import call_transcript_module


@event.listens_for(CallTranscript, "after_insert")
def receive_after_insert_call_transcript(mapper, connection, target):
    print(f"sent sse event with whole transcript with {target.call_id}")
    try:
        session = Session(bind=connection)
        try:
            utterances = call_transcript_module.read_transcripts(target.call_id, session)
            print("utterances information getting")
            loop = base.main_loop
            if loop is not None and loop.is_running():
                loop.call_soon_threadsafe(transcript_job_queue.put_nowait, utterances)
                print("queued transcript broadcast")
            else:
                print("no running event loop available for transcript broadcast")
        finally:
            session.close()
    except RuntimeError:
        print("something went wrong")

@event.listens_for(Incident, "after_insert")
def receive_after_insert_incident(mapper, connection, target):
    print(f"sent sse event with whole incident with {target.id}")
    try:
        session = Session(bind=connection)
        try:
            incident = incident_module.read_incident(target.id, session)
            loop = base.main_loop
            if loop is not None and loop.is_running():
                loop.call_soon_threadsafe(incident_job_queue.put_nowait, incident)
        finally:
            session.close()
    except RuntimeError:
        print("something went wrong")

@event.listens_for(Incident, "after_update")
def receive_after_update_incident(mapper, connection, target):
    print(f"sent sse event with whole incident with {target.id}")
    try:
        session = Session(bind=connection)
        try:
            incident = incident_module.read_incident(target.id, session)
            loop = base.main_loop
            if loop is not None and loop.is_running():
                loop.call_soon_threadsafe(incident_job_queue.put_nowait, incident)
        finally:
            session.close()
    except RuntimeError:
        print("something went wrong")