import redis

from environment import REDIS_EXPIRE_DURATION_IN_SECONDS, REDIS_PASSWORD, REDIS_HOST


class RedisClient:

    def __init__(self):
        self.client = redis.Redis(host=REDIS_HOST, port=6379, password=REDIS_PASSWORD, decode_responses=True)

    def hexists(self, key, name) -> bool:
        return self.client.hexists(key, name)

    def hset(self, key, name, value):
        self.client.hset(key, name, value)
        self.client.hexpire(key, REDIS_EXPIRE_DURATION_IN_SECONDS, name, gt=True)

    def hdel(self, key, name):
        self.client.hdel(key, name)

    def hget(self, key, name):
        return self.client.hget(key, name)

    def hpop(self, key, name):
        result = self.hget(key, name)
        if result is not None:
            self.hdel(key, name)
        return result

    def zadd(self, key, values):
        self.client.zadd(key, values)
        self.client.expire(key, REDIS_EXPIRE_DURATION_IN_SECONDS, gt=True)

    def zpopmin(self, key):
        self.client.zpopmin(key, count=1)

    def sadd(self, key, value):
        self.client.sadd(key, value)
        self.client.expire(key, REDIS_EXPIRE_DURATION_IN_SECONDS)

    def close(self):
        self.client.close()

redis_client = RedisClient()