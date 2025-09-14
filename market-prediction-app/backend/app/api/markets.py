from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from models import get_db, MarketData, MarketType
from services.data_collectors import DataCollectorService
from schemas.market import MarketDataResponse, MarketDataRequest

router = APIRouter()


@router.get("/data/{symbol}")
async def get_market_data(
    symbol: str,
    market_type: MarketType,
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """Get historical market data for a specific symbol"""
    try:
        # Calculate start date
        start_date = datetime.now() - timedelta(days=days)
        
        # Query database for market data
        market_data = db.query(MarketData).filter(
            MarketData.symbol == symbol.upper(),
            MarketData.market_type == market_type,
            MarketData.timestamp >= start_date
        ).order_by(MarketData.timestamp.desc()).all()
        
        if not market_data:
            raise HTTPException(status_code=404, detail="No market data found")
        
        return {
            "symbol": symbol,
            "market_type": market_type,
            "data_points": len(market_data),
            "data": [
                {
                    "timestamp": data.timestamp,
                    "open": data.open_price,
                    "high": data.high_price,
                    "low": data.low_price,
                    "close": data.close_price,
                    "volume": data.volume
                }
                for data in market_data
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/symbols")
async def get_available_symbols(
    market_type: Optional[MarketType] = None,
    db: Session = Depends(get_db)
):
    """Get list of available symbols for prediction"""
    try:
        query = db.query(MarketData.symbol, MarketData.market_type).distinct()
        
        if market_type:
            query = query.filter(MarketData.market_type == market_type)
        
        symbols = query.all()
        
        return {
            "symbols": [
                {"symbol": symbol, "market_type": market_type}
                for symbol, market_type in symbols
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh")
async def refresh_market_data(
    symbols: List[str],
    market_types: List[MarketType],
    db: Session = Depends(get_db)
):
    """Trigger data refresh for specific symbols"""
    try:
        data_service = DataCollectorService()
        
        for symbol in symbols:
            for market_type in market_types:
                await data_service.collect_data(symbol, market_type, db)
        
        return {"message": "Data refresh initiated", "symbols": symbols}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats/{symbol}")
async def get_market_stats(
    symbol: str,
    market_type: MarketType,
    db: Session = Depends(get_db)
):
    """Get market statistics for a symbol"""
    try:
        # Get latest data
        latest_data = db.query(MarketData).filter(
            MarketData.symbol == symbol.upper(),
            MarketData.market_type == market_type
        ).order_by(MarketData.timestamp.desc()).first()
        
        if not latest_data:
            raise HTTPException(status_code=404, detail="No data found")
        
        # Get 30-day average
        thirty_days_ago = datetime.now() - timedelta(days=30)
        avg_data = db.query(MarketData).filter(
            MarketData.symbol == symbol.upper(),
            MarketData.market_type == market_type,
            MarketData.timestamp >= thirty_days_ago
        ).all()
        
        if avg_data:
            avg_close = sum(data.close_price for data in avg_data) / len(avg_data)
            price_change = latest_data.close_price - avg_close
            price_change_percent = (price_change / avg_close) * 100
        else:
            avg_close = latest_data.close_price
            price_change = 0
            price_change_percent = 0
        
        return {
            "symbol": symbol,
            "current_price": latest_data.close_price,
            "average_30d": avg_close,
            "change_30d": price_change,
            "change_percent_30d": price_change_percent,
            "volume": latest_data.volume,
            "timestamp": latest_data.timestamp
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))