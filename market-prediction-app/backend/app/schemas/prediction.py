from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from app.models.predictions import ModelType
from app.models.market_data import MarketType


class PredictionRequest(BaseModel):
    symbol: str
    market_type: MarketType
    model_type: ModelType
    prediction_horizon: int = 7  # days ahead


class PredictionResponse(BaseModel):
    message: str
    symbol: str
    model_type: ModelType
    prediction_horizon: int


class PredictionData(BaseModel):
    id: int
    symbol: str
    market_type: str
    model_type: ModelType
    predicted_price: float
    prediction_date: datetime
    confidence_score: Optional[float]
    created_at: datetime


class ModelPerformanceMetrics(BaseModel):
    symbol: str
    model_type: ModelType
    r2_score: Optional[float]
    rmse: Optional[float]
    mae: Optional[float]
    accuracy: Optional[float]
    evaluated_at: datetime