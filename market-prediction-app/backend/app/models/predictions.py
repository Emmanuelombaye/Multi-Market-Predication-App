from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Enum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base
import enum


class ModelType(str, enum.Enum):
    LINEAR_REGRESSION = "linear_regression"
    LSTM = "lstm"
    PROPHET = "prophet"
    ARIMA = "arima"
    RANDOM_FOREST = "random_forest"


class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    symbol = Column(String, index=True, nullable=False)
    market_type = Column(String, nullable=False)
    model_type = Column(Enum(ModelType), nullable=False)
    
    # Prediction data
    prediction_date = Column(DateTime(timezone=True), nullable=False)
    predicted_price = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=True)
    prediction_horizon = Column(Integer, nullable=False)  # days ahead
    
    # Additional prediction metadata
    input_data_points = Column(Integer, nullable=True)
    model_parameters = Column(JSON, nullable=True)
    prediction_metadata = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="predictions")


class ModelPerformance(Base):
    __tablename__ = "model_performance"
    
    id = Column(Integer, primary_key=True, index=True)
    model_type = Column(Enum(ModelType), nullable=False)
    symbol = Column(String, index=True, nullable=False)
    market_type = Column(String, nullable=False)
    
    # Performance metrics
    mse = Column(Float, nullable=True)
    rmse = Column(Float, nullable=True)
    mae = Column(Float, nullable=True)
    r2_score = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=True)
    
    # Training details
    training_data_points = Column(Integer, nullable=True)
    validation_data_points = Column(Integer, nullable=True)
    training_duration = Column(Float, nullable=True)  # seconds
    
    # Model metadata
    model_version = Column(String, nullable=True)
    hyperparameters = Column(JSON, nullable=True)
    
    # Timestamps
    evaluated_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())