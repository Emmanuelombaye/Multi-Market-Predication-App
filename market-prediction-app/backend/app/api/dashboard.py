from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from models import get_db, MarketData, Prediction, User
from services.dashboard_service import DashboardService

router = APIRouter()


@router.get("/overview")
async def get_dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard overview data"""
    try:
        dashboard_service = DashboardService()
        
        # Get user's recent predictions
        recent_predictions = db.query(Prediction).filter(
            Prediction.user_id == current_user.id
        ).order_by(Prediction.created_at.desc()).limit(10).all()
        
        # Get top performing markets
        top_markets = await dashboard_service.get_top_performing_markets(db)
        
        # Get prediction accuracy stats
        accuracy_stats = await dashboard_service.get_prediction_accuracy_stats(
            current_user.id, db
        )
        
        return {
            "recent_predictions": [
                {
                    "symbol": pred.symbol,
                    "predicted_price": pred.predicted_price,
                    "model_type": pred.model_type,
                    "confidence_score": pred.confidence_score,
                    "created_at": pred.created_at
                }
                for pred in recent_predictions
            ],
            "top_markets": top_markets,
            "accuracy_stats": accuracy_stats,
            "total_predictions": len(recent_predictions)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/portfolio")
async def get_user_portfolio(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's prediction portfolio"""
    try:
        dashboard_service = DashboardService()
        
        # Get user's symbols being tracked
        user_symbols = db.query(Prediction.symbol, Prediction.market_type).filter(
            Prediction.user_id == current_user.id
        ).distinct().all()
        
        portfolio_data = []
        
        for symbol, market_type in user_symbols:
            # Get latest prediction for each symbol
            latest_prediction = db.query(Prediction).filter(
                Prediction.user_id == current_user.id,
                Prediction.symbol == symbol,
                Prediction.market_type == market_type
            ).order_by(Prediction.created_at.desc()).first()
            
            # Get current market data
            current_data = db.query(MarketData).filter(
                MarketData.symbol == symbol,
                MarketData.market_type == market_type
            ).order_by(MarketData.timestamp.desc()).first()
            
            if latest_prediction and current_data:
                portfolio_data.append({
                    "symbol": symbol,
                    "market_type": market_type,
                    "current_price": current_data.close_price,
                    "predicted_price": latest_prediction.predicted_price,
                    "price_difference": current_data.close_price - latest_prediction.predicted_price,
                    "confidence_score": latest_prediction.confidence_score,
                    "prediction_date": latest_prediction.prediction_date
                })
        
        return {
            "portfolio": portfolio_data,
            "total_symbols": len(portfolio_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market-trends")
async def get_market_trends(db: Session = Depends(get_db)):
    """Get overall market trends"""
    try:
        dashboard_service = DashboardService()
        
        # Get market trends for different asset classes
        trends = await dashboard_service.get_market_trends(db)
        
        return {
            "trends": trends,
            "last_updated": datetime.now()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/alerts")
async def get_user_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's price alerts and notifications"""
    try:
        # Get predictions that might need attention
        high_confidence_predictions = db.query(Prediction).filter(
            Prediction.user_id == current_user.id,
            Prediction.confidence_score >= 0.8
        ).order_by(Prediction.created_at.desc()).limit(5).all()
        
        alerts = []
        
        for pred in high_confidence_predictions:
            # Get current market data
            current_data = db.query(MarketData).filter(
                MarketData.symbol == pred.symbol,
                MarketData.market_type == pred.market_type
            ).order_by(MarketData.timestamp.desc()).first()
            
            if current_data:
                price_diff = current_data.close_price - pred.predicted_price
                if abs(price_diff) > pred.predicted_price * 0.05:  # 5% difference
                    alerts.append({
                        "type": "price_alert",
                        "symbol": pred.symbol,
                        "message": f"{pred.symbol} is {'above' if price_diff > 0 else 'below'} prediction by {abs(price_diff):.2f}",
                        "predicted_price": pred.predicted_price,
                        "current_price": current_data.close_price,
                        "confidence": pred.confidence_score
                    })
        
        return {
            "alerts": alerts,
            "total_alerts": len(alerts)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def get_current_user(db: Session = Depends(get_db)):
    """Placeholder for user authentication - implement based on your auth system"""
    # This should be implemented with proper JWT token validation
    # For now, returning a mock user
    return User(id=1, email="test@example.com", username="testuser")