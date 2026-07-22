import asyncio

class IncidentUpdateBroadcaster:
    def __init__(self):
        self._listeners = set()

    def subscribe(self):
        queue: asyncio.Queue = asyncio.Queue()
        self._listeners.add(queue)
        return queue

    def unsubscribe(self, queue):
        self._listeners.discard(queue)

    async def broadcast(self, payload: dict):
        for queue in list(self._listeners):
            await queue.put(payload)

incident_update_broadcaster = IncidentUpdateBroadcaster()
