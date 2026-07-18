import asyncio

from sqlalchemy import event
from sqlalchemy.orm import Session

from async_context_managers import base
from async_context_managers.transcript_broadcast_consumer import job_queue
from database import db_dependency, get_db
from models.schema import CallTranscript
from modules.transcripts import call_transcript_module


@event.listens_for(CallTranscript, "after_insert")
def receive_after_insert(mapper, connection, target):
    print(f"sent sse event with whole transcript with {target.call_id}")
    try:
        session = Session(bind=connection)
        try:
            utterances = call_transcript_module.read_transcripts(target.call_id, session)
            print("utterances information getting")
            loop = base.main_loop
            if loop is not None and loop.is_running():
                loop.call_soon_threadsafe(job_queue.put_nowait, utterances)
                print("queued transcript broadcast")
            else:
                print("no running event loop available for transcript broadcast")
        finally:
            session.close()
    except RuntimeError:
        print("something went wrong")

