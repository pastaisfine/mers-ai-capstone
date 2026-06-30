import redis

class RedisClient:

    def __init__(self):
        self.client = redis.Redis(host='localhost', port=6379, decode_responses=True)

    def hgetall(self, key):
        return self.client.hgetall(key)

    def hset(self, key, values: dict):
        self.client.hset(key, mapping=values)
        self.client.expire(key, 300)

    def hdel(self, key):
        self.client.hdel(key)

redis_client = RedisClient()