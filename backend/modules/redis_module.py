import redis


class RedisClient:

    def __init__(self):
        self.client = redis.Redis(host='localhost', port=6379, decode_responses=True)

    def hgetall(self, key):
        return self.client.hgetall(key)

    def hset(self, key, value):
        self.client.hset(key, value)
        self.client.expire(key, 300)