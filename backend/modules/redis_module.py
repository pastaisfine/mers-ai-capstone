import redis

from environment import REDIS_EXPIRE_DURATION_IN_SECONDS


class RedisClient:

    def __init__(self):
        self.client = redis.Redis(host='localhost', port=6379, decode_responses=True)

    def hexists(self, key, name) -> bool:
        return self.client.hexists(key, name)

    def hset(self, key, name, value):
        self.client.hset(key, name, value)
        self.client.hexpire(key, REDIS_EXPIRE_DURATION_IN_SECONDS, name, gt=True)

    def hdel(self, key, name):
        self.client.hdel(key, name)

    def zadd(self, key, values):
        self.client.zadd(key, values)
        self.client.expire(key, REDIS_EXPIRE_DURATION_IN_SECONDS, gt=True)

    def zpopmin(self, key):
        self.client.zpopmin(key, count=1)

    def sadd(self, key, value):
        self.client.sadd(key, value)
        self.client.expire(key, REDIS_EXPIRE_DURATION_IN_SECONDS)

redis_client = RedisClient()