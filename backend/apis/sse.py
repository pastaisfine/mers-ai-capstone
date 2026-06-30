import asyncio

from fastapi.sse import EventSourceResponse

from main import app
from fastapi import Request

from modules.connection_modules import CONNECTED_SSE_CLIENTS


async def event_generator(request: Request):
    # Create a unique queue for this specific client connection
    client_queue = asyncio.Queue()
    CONNECTED_SSE_CLIENTS.append(client_queue)

    try:
        while True:
            # Check if client disconnected abruptly
            if await request.is_disconnected():
                break

            # Wait until the database listener pushes data into our queue
            data = await client_queue.get()

            # Yield in the standard SSE format
            yield data
    except asyncio.CancelledError:
        pass
    finally:
        CONNECTED_SSE_CLIENTS.remove(client_queue)

@app.get("/stream")
async def stream_events(request: Request):
    return EventSourceResponse(event_generator(request))
