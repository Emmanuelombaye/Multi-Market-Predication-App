from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from models import get_db, Prediction, ModelType, User
from services.ml_service import MLPredictionService
from schemas.prediction import PredictionRequest, PredictionResponse

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
async def create_prediction(
    request: PredictionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate prediction for a market symbol"""
    try:
        ml_service = MLPredictionService()
        
        # Generate prediction in background
        background_tasks.add_task(
            ml_service.generate_prediction,
            request.symbol,
            request.market_type,
            request.model_type,
            request.prediction_horizon,
            current_user.id,
            db
        )
        
        return {
            "message": "Prediction generation started",
            "symbol": request.symbol,
            "model_type": request.model_type,
            "prediction_horizon": request.prediction_horizon
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{symbol}")
async def get_prediction_history(
    symbol: str,
    market_type: str,
    model_type: Optional[ModelType] = None,
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get prediction history for a symbol"""
    try:
        start_date = datetime.now() - timedelta(days=days)
        
        query = db.query(Prediction).filter(
            Prediction.symbol == symbol.upper(),
            Prediction.market_type == market_type,
            Prediction.user_id == current_user.id,
            Prediction.created_at >= start_date
        )
        
        if model_type:
            query = query.filter(Prediction.model_type == model_type)
        
        predictions = query.order_by(Prediction.created_at.desc()).all()
        
        return {
            "symbol": symbol,
            "predictions": [
                {
                    "id": pred.id,
                    "predicted_price": pred.predicted_price,
                    "prediction_date": pred.prediction_date,
                    "model_type": pred.model_type,
                    "confidence_score": pred.confidence_score,
                    "created_at": pred.created_at
                }
                for pred in predictions
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/models/performance")
async def get_model_performance(
    symbol: Optional[str] = None,
    model_type: Optional[ModelType] = None,
    db: Session = Depends(get_db)
):
    """Get model performance metrics"""
    try:
        from models import ModelPerformance
        
        query = db.query(ModelPerformance)
        
        if symbol:
            query = query.filter(ModelPerformance.symbol == symbol.upper())
        
        if model_type:
            query = query.filter(ModelPerformance.model_type == model_type)
        
        performances = query.order_by(ModelPerformance.evaluated_at.desc()).all()
        
        return {
            "performances": [
                {
                    "symbol": perf.symbol,
                    "model_type": perf.model_type,
                    "r2_score": perf.r2_score,
                    "rmse": perf.rmse,
                    "mae": perf.mae,
                    "accuracy": perf.accuracy,
                    "evaluated_at": perf.evaluated_at
                }
                for perf in performances
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/latest/{symbol}")
async def get_latest_predictions(
    symbol: str,
    market_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get latest predictions for a symbol across all models"""
    try:
        predictions = db.query(Prediction).filter(
            Prediction.symbol == symbol.upper(),
            Prediction.market_type == market_type,
            Prediction.user_id == current_user.id
        ).order_by(Prediction.created_at.desc()).limit(5).all()
        
        if not predictions:
            raise HTTPException(status_code=404, detail="No predictions found")
        
        return {
            "symbol": symbol,
            "latest_predictions": [
                {
                    "model_type": pred.model_type,
                    "predicted_price": pred.predicted_price,
                    "confidence_score": pred.confidence_score,
                    "prediction_date": pred.prediction_date,
                    "created_at": pred.created_at
                }
                for pred in predictions
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def get_current_user(db: Session = Depends(get_db)):
    """Placeholder for user authentication - implement based on your auth system"""
    # This should be implemented with proper JWT token validation
    # For now, returning a mock user
    return User(id=1, email="test@example.com", username="testuser")