from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.models.market_data import MarketType


class MarketDataBase(BaseModel):
    symbol: str
    market_type: MarketType
    timestamp: datetime
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: Optional[float] = None


class MarketDataRequest(BaseModel):
    symbol: str
    market_type: MarketType
    days: int = 30


class MarketDataResponse(BaseModel):
    symbol: str
    market_type: MarketType
    data_points: int
    data: List[dict]
    
    class Config:
        from_attributes = True


class MarketStats(BaseModel):
    symbol: str
    current_price: float
    average_30d: float
    change_30d: float
    change_percent_30d: float
    volume: Optional[float]
    timestamp: datetime