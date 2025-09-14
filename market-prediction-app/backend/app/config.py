from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://user:password@localhost:5432/market_prediction"
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # API Keys
    yahoo_finance_api_key: Optional[str] = None
    binance_api_key: Optional[str] = None
    binance_secret_key: Optional[str] = None
    nse_api_key: Optional[str] = None
    
    # JWT
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Celery
    celery_broker_url: str = "redis://localhost:6379/0"
    celery_result_backend: str = "redis://localhost:6379/0"
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()