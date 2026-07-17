import asyncio

from sqlalchemy import event

from async_context_managers.transcript_broadcast_consumer import job_queue
from database import db_dependency
from models.schema import CallTranscript
from modules.transcripts import call_transcript_module


@event.listens_for(CallTranscript, "after_insert")
def receive_after_insert(mapper, connection, target, db: db_dependency):
    print(f"sent sse event with whole transcript with {target.call_id}")
    loop = asyncio.get_running_loop()
    utterances = call_transcript_module.read_transcripts(target.call_id, db)
    try:
        loop.create_task(job_queue.put(utterances))
    except RuntimeError:
        # Fallback if the event is fired outside the main async event loop
        asyncio.run_coroutine_threadsafe(job_queue.put(utterances), loop)

