from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base
import enum


class MarketType(str, enum.Enum):
    STOCK = "stock"
    CRYPTO = "crypto"
    COMMODITY = "commodity"
    REAL_ESTATE = "real_estate"
    FOREX = "forex"


class MarketData(Base):
    __tablename__ = "market_data"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True, nullable=False)
    market_type = Column(Enum(MarketType), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    open_price = Column(Float, nullable=False)
    high_price = Column(Float, nullable=False)
    low_price = Column(Float, nullable=False)
    close_price = Column(Float, nullable=False)
    volume = Column(Float, nullable=True)
    adjusted_close = Column(Float, nullable=True)
    
    # Additional metadata
    source = Column(String, nullable=False)  # yahoo, binance, nse, etc.
    currency = Column(String, default="USD")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StockData(Base):
    __tablename__ = "stock_data"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True, nullable=False)
    company_name = Column(String, nullable=True)
    exchange = Column(String, nullable=True)
    sector = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    market_cap = Column(Float, nullable=True)
    pe_ratio = Column(Float, nullable=True)
    dividend_yield = Column(Float, nullable=True)
    beta = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CryptoData(Base):
    __tablename__ = "crypto_data"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True, nullable=False)
    name = Column(String, nullable=True)
    coin_id = Column(String, nullable=True)
    total_supply = Column(Float, nullable=True)
    circulating_supply = Column(Float, nullable=True)
    max_supply = Column(Float, nullable=True)
    market_cap = Column(Float, nullable=True)
    rank = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CommodityData(Base):
    __tablename__ = "commodity_data"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True, nullable=False)
    name = Column(String, nullable=True)
    category = Column(String, nullable=True)  # energy, metals, agriculture
    unit = Column(String, nullable=True)  # barrels, ounces, bushels
    contract_size = Column(Float, nullable=True)
    exchange = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class RealEstateData(Base):
    __tablename__ = "real_estate_data"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True, nullable=False)
    location = Column(String, nullable=True)
    property_type = Column(String, nullable=True)  # residential, commercial
    price_index = Column(Float, nullable=True)
    region = Column(String, nullable=True)
    country = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())