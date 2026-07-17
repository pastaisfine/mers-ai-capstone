import asyncio
from contextlib import asynccontextmanager
from async_context_managers import base

from fastapi import FastAPI

from async_context_managers.transcript_broadcast_consumer import transcript_broadcast_consumer
from async_context_managers.transcript_process_consumer import transcript_process_consumer
from modules.redis_module import redis_client

@asynccontextmanager
async def lifespan(app: FastAPI):
    process_consumer_task = asyncio.create_task(asyncio.to_thread(transcript_process_consumer))
    broadcast_consumer_task = asyncio.create_task(asyncio.to_thread(transcript_broadcast_consumer))

    yield

    base.keep_running = False
    async def wait_for_complete(task):
        try:
            await asyncio.wait_for(task, timeout=5.0)
        except asyncio.TimeoutError:
            task.cancel()

    await asyncio.gather(
        wait_for_complete(process_consumer_task),
        wait_for_complete(broadcast_consumer_task)
    )

    async def close_db():
        await base.db.close()
        print("[✓] DB connection closed. Shutdown complete.")

    async def close_redis():
        await redis_client.close()
        print("[✓] Redis connection closed. Shutdown complete.")

    await asyncio.gather(close_db(), close_redis())