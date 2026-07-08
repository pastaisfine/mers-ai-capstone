import asyncio
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: MersAIBackendApp):
    loop = asyncio.get_event_loop()
    consumer_task = loop.create_task(app.pika_emotion_analyse_consumer.consume(loop))
    print("RabbitMQ emotion analyse consumer started in the background.")

    yield

    print("Shutting down RabbitMQ emotion analyse consumer consumer...")
    consumer_task.cancel()
    try:
        await consumer_task
    except asyncio.CancelledError:
        print("RabbitMQ emotion analyse consumer successfully stopped.")