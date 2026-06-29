import json
import uuid

import pika
from aio_pika import connect_robust

from environment import RABBIT_HOST


class PikaPublisher:
    def __init__(self, queue_name):
        self.publish_queue_name = queue_name
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=RABBIT_HOST)
        )
        self.channel = self.connection.channel()
        self.publish_queue = self.channel.queue_declare(queue=self.publish_queue_name)
        self.callback_queue = self.publish_queue.method.queue
        print('Pika publisher connection initialized')

    def publish(self, message: dict):
        """Method to publish message to RabbitMQ"""
        self.channel.basic_publish(exchange='', routing_key=self.publish_queue_name, properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=str(uuid.uuid4())
            ),
            body=json.dumps(message))

class PikaConsumer:
    def __init__(self, queue_name, process_callable):
        self.consume_queue = queue_name
        self.process_callable = process_callable
    async def consume(self, loop):
        connection = await connect_robust(
            host=RABBIT_HOST,
            port=5672,
            loop=loop,
        )
        channel = await connection.channel()
        queue = await channel.declare_queue(self.consume_queue)
        await queue.consume(self.process_incoming_message, no_ack=False)
        print("Established pika async listener")
        return connection

    async def process_incoming_message(self, message):
        """Processing incoming message from RabbitMQ"""
        message.ack()
        body = message.body
        print('Received message')
        if body:
            self.process_callable(json.loads(body))

