import asyncio
import yfinance as yf
import ccxt
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.market_data import MarketData, MarketType
from app.config import settings


class DataCollectorService:
    def __init__(self):
        self.binance_exchange = None
        if settings.binance_api_key and settings.binance_secret_key:
            self.binance_exchange = ccxt.binance({
                'apiKey': settings.binance_api_key,
                'secret': settings.binance_secret_key,
                'sandbox': True,  # Use sandbox for testing
            })
    
    async def collect_data(self, symbol: str, market_type: MarketType, db: Session):
        """Collect data for a specific symbol and market type"""
        try:
            if market_type == MarketType.STOCK:
                await self._collect_stock_data(symbol, db)
            elif market_type == MarketType.CRYPTO:
                await self._collect_crypto_data(symbol, db)
            elif market_type == MarketType.COMMODITY:
                await self._collect_commodity_data(symbol, db)
            elif market_type == MarketType.REAL_ESTATE:
                await self._collect_real_estate_data(symbol, db)
        except Exception as e:
            print(f"Error collecting data for {symbol}: {str(e)}")
    
    async def _collect_stock_data(self, symbol: str, db: Session):
        """Collect stock data using Yahoo Finance"""
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="1y")
            
            for date, row in hist.iterrows():
                # Check if data already exists
                existing = db.query(MarketData).filter(
                    MarketData.symbol == symbol.upper(),
                    MarketData.market_type == MarketType.STOCK,
                    MarketData.timestamp == date
                ).first()
                
                if not existing:
                    market_data = MarketData(
                        symbol=symbol.upper(),
                        market_type=MarketType.STOCK,
                        timestamp=date,
                        open_price=float(row['Open']),
                        high_price=float(row['High']),
                        low_price=float(row['Low']),
                        close_price=float(row['Close']),
                        volume=float(row['Volume']) if pd.notna(row['Volume']) else None,
                        adjusted_close=float(row['Close']) if 'Adj Close' in row else None,
                        source="yahoo_finance"
                    )
                    db.add(market_data)
            
            db.commit()
        except Exception as e:
            db.rollback()
            raise e
    
    async def _collect_crypto_data(self, symbol: str, db: Session):
        """Collect cryptocurrency data using Binance API"""
        try:
            if not self.binance_exchange:
                # Fallback to yfinance for crypto
                await self._collect_crypto_yfinance(symbol, db)
                return
            
            # Get historical data from Binance
            ohlcv = self.binance_exchange.fetch_ohlcv(f"{symbol}/USDT", '1d', limit=365)
            
            for candle in ohlcv:
                timestamp = datetime.fromtimestamp(candle[0] / 1000)
                
                # Check if data already exists
                existing = db.query(MarketData).filter(
                    MarketData.symbol == symbol.upper(),
                    MarketData.market_type == MarketType.CRYPTO,
                    MarketData.timestamp == timestamp
                ).first()
                
                if not existing:
                    market_data = MarketData(
                        symbol=symbol.upper(),
                        market_type=MarketType.CRYPTO,
                        timestamp=timestamp,
                        open_price=float(candle[1]),
                        high_price=float(candle[2]),
                        low_price=float(candle[3]),
                        close_price=float(candle[4]),
                        volume=float(candle[5]),
                        source="binance"
                    )
                    db.add(market_data)
            
            db.commit()
        except Exception as e:
            db.rollback()
            raise e
    
    async def _collect_crypto_yfinance(self, symbol: str, db: Session):
        """Fallback crypto data collection using Yahoo Finance"""
        try:
            ticker = yf.Ticker(f"{symbol}-USD")
            hist = ticker.history(period="1y")
            
            for date, row in hist.iterrows():
                existing = db.query(MarketData).filter(
                    MarketData.symbol == symbol.upper(),
                    MarketData.market_type == MarketType.CRYPTO,
                    MarketData.timestamp == date
                ).first()
                
                if not existing:
                    market_data = MarketData(
                        symbol=symbol.upper(),
                        market_type=MarketType.CRYPTO,
                        timestamp=date,
                        open_price=float(row['Open']),
                        high_price=float(row['High']),
                        low_price=float(row['Low']),
                        close_price=float(row['Close']),
                        volume=float(row['Volume']) if pd.notna(row['Volume']) else None,
                        source="yahoo_finance"
                    )
                    db.add(market_data)
            
            db.commit()
        except Exception as e:
            db.rollback()
            raise e
    
    async def _collect_commodity_data(self, symbol: str, db: Session):
        """Collect commodity data using Yahoo Finance"""
        try:
            # Map common commodity symbols
            commodity_symbols = {
                'GOLD': 'GC=F',
                'SILVER': 'SI=F',
                'OIL': 'CL=F',
                'BRENT': 'BZ=F',
                'NATURAL_GAS': 'NG=F'
            }
            
            yahoo_symbol = commodity_symbols.get(symbol.upper(), f"{symbol}=F")
            ticker = yf.Ticker(yahoo_symbol)
            hist = ticker.history(period="1y")
            
            for date, row in hist.iterrows():
                existing = db.query(MarketData).filter(
                    MarketData.symbol == symbol.upper(),
                    MarketData.market_type == MarketType.COMMODITY,
                    MarketData.timestamp == date
                ).first()
                
                if not existing:
                    market_data = MarketData(
                        symbol=symbol.upper(),
                        market_type=MarketType.COMMODITY,
                        timestamp=date,
                        open_price=float(row['Open']),
                        high_price=float(row['High']),
                        low_price=float(row['Low']),
                        close_price=float(row['Close']),
                        volume=float(row['Volume']) if pd.notna(row['Volume']) else None,
                        source="yahoo_finance"
                    )
                    db.add(market_data)
            
            db.commit()
        except Exception as e:
            db.rollback()
            raise e
    
    async def _collect_real_estate_data(self, symbol: str, db: Session):
        """Collect real estate data - placeholder implementation"""
        # This would typically use specialized real estate APIs
        # For now, we'll create a placeholder
        try:
            # Placeholder data - in real implementation, this would fetch from real estate APIs
            print(f"Real estate data collection for {symbol} - placeholder implementation")
        except Exception as e:
            raise e