from sqlalchemy import event

from models.schema import CallTranscript
from modules import job_queue_module


@event.listens_for(CallTranscript, "after_insert")
def receive_after_insert(mapper, connection, target):
    print(f"sent sse event with whole transcript with {target.call_id}")
    job_queue_module.add_job(target.call_id)
