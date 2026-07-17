import asyncio
import json
from uuid import UUID

from fastapi.sse import EventSourceResponse
from pydantic import BaseModel
from fastapi.responses import StreamingResponse

from main import app
from modules.transcripts.call_transcript_broadcaster import call_transcript_broadcaster

class Payload(BaseModel):
    call_id: UUID

@app.post("transcripts/stream", response_class=EventSourceResponse)
async def read_transcripts() -> StreamingResponse:
    async def event_stream():
        # Create a private queue just for this specific connected client
        client_queue = call_transcript_broadcaster.subscribe()
        try:
            while True:
                # Blocks until the background worker broadcasts a new call_id
                transcripts = await client_queue.get()

                yield json.dumps(transcripts)
        except asyncio.CancelledError:
            # Triggered automatically when the frontend client disconnects
            print("Client disconnected from SSE")
        finally:
            # Clean up so we don't leak memory
            call_transcript_broadcaster.unsubscribe(client_queue)

    return EventSourceResponse(event_stream())


