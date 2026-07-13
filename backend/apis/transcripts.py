import json
from uuid import UUID

from fastapi.sse import EventSourceResponse
from pydantic import BaseModel
from fastapi.responses import StreamingResponse

from database import db_dependency
from main import app
from modules import call_transcript_module, job_queue_module


class Payload(BaseModel):
    call_id: UUID

@app.post("transcripts/stream", response_class=EventSourceResponse)
async def read_transcripts(db: db_dependency) -> StreamingResponse:
    async def event_stream():
        while True:
            call_id = job_queue_module.pop_job()
            if call_id is not None:
                print(f"SSE Event called: {call_id}")
                transcripts = call_transcript_module.read_transcripts(call_id=call_id, db=db)
                yield json.dumps(transcripts)

    return StreamingResponse(event_stream(), media_type="text/event-stream")


