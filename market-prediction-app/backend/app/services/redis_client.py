import redis.asyncio as redis
from app.config import settings


class RedisClient:
    def __init__(self):
        self.redis = None
    
    async def connect(self):
        self.redis = redis.from_url(settings.redis_url)
    
    async def disconnect(self):
        if self.redis:
            await self.redis.close()
    
    async def get(self, key: str):
        if self.redis:
            return await self.redis.get(key)
        return None
    
    async def set(self, key: str, value: str, expire: int = None):
        if self.redis:
            await self.redis.set(key, value, ex=expire)
    
    async def delete(self, key: str):
        if self.redis:
            await self.redis.delete(key)


redis_client = RedisClient()


async def init_redis():
    """Initialize Redis connection"""
    await redis_client.connect()