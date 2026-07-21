import asyncio
import json

from fastapi.responses import StreamingResponse

from main import app
from modules.incidents.incident_update_broadcaster import incident_update_broadcaster


@app.get("/incidents/stream")
async def read_incident_updates() -> StreamingResponse:
    async def event_stream():
        client_queue = incident_update_broadcaster.subscribe()
        print(
            f"Client subscribed to incident stream; listeners={len(incident_update_broadcaster._listeners)}",
            flush=True,
        )
        try:
            while True:
                payload = await client_queue.get()
                yield f"data: {json.dumps(payload)}\n\n"
        except asyncio.CancelledError:
            print("Client disconnected from incident SSE", flush=True)
        finally:
            incident_update_broadcaster.unsubscribe(client_queue)

    return StreamingResponse(event_stream(), media_type="text/event-stream")
