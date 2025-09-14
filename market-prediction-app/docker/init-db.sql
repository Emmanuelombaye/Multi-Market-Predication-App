-- Initialize the market prediction database
CREATE DATABASE market_prediction;

-- Create extensions
\c market_prediction;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance
-- These will be created by SQLAlchemy, but we can add custom ones here if needed