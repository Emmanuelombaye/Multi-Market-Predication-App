from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.models.market_data import MarketData, MarketType
from app.models.predictions import Prediction, ModelPerformance


class DashboardService:
    def __init__(self):
        pass
    
    async def get_top_performing_markets(self, db: Session) -> List[Dict[str, Any]]:
        """Get top performing markets based on recent price changes"""
        try:
            # Get data from last 30 days
            thirty_days_ago = datetime.now() - timedelta(days=30)
            
            # Query for market performance
            performance_data = db.query(
                MarketData.symbol,
                MarketData.market_type,
                func.avg(MarketData.close_price).label('avg_price'),
                func.max(MarketData.close_price).label('max_price'),
                func.min(MarketData.close_price).label('min_price')
            ).filter(
                MarketData.timestamp >= thirty_days_ago
            ).group_by(
                MarketData.symbol,
                MarketData.market_type
            ).order_by(desc('avg_price')).limit(10).all()
            
            top_markets = []
            for data in performance_data:
                price_change = ((data.max_price - data.min_price) / data.min_price) * 100
                top_markets.append({
                    'symbol': data.symbol,
                    'market_type': data.market_type,
                    'average_price': float(data.avg_price),
                    'price_change_percent': float(price_change),
                    'max_price': float(data.max_price),
                    'min_price': float(data.min_price)
                })
            
            return top_markets
            
        except Exception as e:
            print(f"Error getting top performing markets: {str(e)}")
            return []
    
    async def get_prediction_accuracy_stats(self, user_id: int, db: Session) -> Dict[str, Any]:
        """Get prediction accuracy statistics for a user"""
        try:
            # Get user's predictions from last 90 days
            ninety_days_ago = datetime.now() - timedelta(days=90)
            
            predictions = db.query(Prediction).filter(
                Prediction.user_id == user_id,
                Prediction.created_at >= ninety_days_ago
            ).all()
            
            if not predictions:
                return {
                    'total_predictions': 0,
                    'average_confidence': 0,
                    'high_confidence_predictions': 0,
                    'model_breakdown': {}
                }
            
            # Calculate statistics
            total_predictions = len(predictions)
            confidences = [p.confidence_score for p in predictions if p.confidence_score is not None]
            average_confidence = sum(confidences) / len(confidences) if confidences else 0
            high_confidence_predictions = len([c for c in confidences if c >= 0.7])
            
            # Model breakdown
            model_breakdown = {}
            for pred in predictions:
                model_type = pred.model_type
                if model_type not in model_breakdown:
                    model_breakdown[model_type] = 0
                model_breakdown[model_type] += 1
            
            return {
                'total_predictions': total_predictions,
                'average_confidence': float(average_confidence),
                'high_confidence_predictions': high_confidence_predictions,
                'model_breakdown': model_breakdown
            }
            
        except Exception as e:
            print(f"Error getting prediction accuracy stats: {str(e)}")
            return {
                'total_predictions': 0,
                'average_confidence': 0,
                'high_confidence_predictions': 0,
                'model_breakdown': {}
            }
    
    async def get_market_trends(self, db: Session) -> Dict[str, Any]:
        """Get overall market trends across different asset classes"""
        try:
            trends = {}
            
            # Get trends for each market type
            for market_type in MarketType:
                # Get latest data for each market type
                latest_data = db.query(MarketData).filter(
                    MarketData.market_type == market_type
                ).order_by(desc(MarketData.timestamp)).limit(50).all()
                
                if latest_data:
                    prices = [data.close_price for data in latest_data]
                    avg_price = sum(prices) / len(prices)
                    
                    # Calculate trend (simplified)
                    if len(prices) >= 2:
                        trend_direction = "up" if prices[-1] > prices[0] else "down"
                        trend_percent = ((prices[-1] - prices[0]) / prices[0]) * 100
                    else:
                        trend_direction = "stable"
                        trend_percent = 0
                    
                    trends[market_type.value] = {
                        'average_price': float(avg_price),
                        'trend_direction': trend_direction,
                        'trend_percent': float(trend_percent),
                        'data_points': len(latest_data)
                    }
            
            return trends
            
        except Exception as e:
            print(f"Error getting market trends: {str(e)}")
            return {}