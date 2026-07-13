import json
from typing import Any, AsyncIterable
from uuid import UUID

from fastapi.sse import EventSourceResponse, ServerSentEvent
from pydantic import BaseModel

from database import db_dependency
from main import app
from modules import call_transcript_module


class Payload(BaseModel):
    call_id: UUID

@app.post("transcripts/stream", response_class=EventSourceResponse)
async def read_transcripts(payload: Payload, db: db_dependency) -> AsyncIterable[ServerSentEvent]:
    print(f"SSE Event called: {payload.call_id}")
    transcripts = call_transcript_module.read_transcripts(call_id=payload.call_id, db=db)
    yield ServerSentEvent(raw_data=json.dumps(transcripts))

