from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

from api import markets, predictions, auth, dashboard
from services.database import init_db
from services.redis_client import init_redis


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await init_redis()
    yield
    # Shutdown
    pass


app = FastAPI(
    title="AI-Powered Market Prediction API",
    description="A comprehensive platform for market trend forecasting across stocks, crypto, commodities, and more",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(markets.router, prefix="/api/markets", tags=["markets"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["predictions"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])


@app.get("/")
async def root():
    return {"message": "AI-Powered Market Prediction API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )