from celery import current_task
from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.services.data_collectors import DataCollectorService
from app.services.ml_service import MLPredictionService
from app.celery_app import celery_app
import asyncio
from datetime import datetime, timedelta


def get_db():
    """Get database session for Celery tasks"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@celery_app.task(bind=True)
def collect_market_data_task(self):
    """Background task to collect market data"""
    try:
        # Update task state
        self.update_state(state='PROGRESS', meta={'status': 'Collecting market data...'})
        
        # Common symbols to collect
        symbols_to_collect = {
            'stock': ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA'],
            'crypto': ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'MATIC'],
            'commodity': ['GOLD', 'SILVER', 'OIL', 'BRENT', 'NATURAL_GAS']
        }
        
        db = next(get_db())
        data_service = DataCollectorService()
        
        total_symbols = sum(len(symbols) for symbols in symbols_to_collect.values())
        processed = 0
        
        for market_type, symbols in symbols_to_collect.items():
            for symbol in symbols:
                try:
                    # Run async function in sync context
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    loop.run_until_complete(
                        data_service.collect_data(symbol, market_type, db)
                    )
                    loop.close()
                    
                    processed += 1
                    progress = (processed / total_symbols) * 100
                    
                    self.update_state(
                        state='PROGRESS',
                        meta={
                            'status': f'Collected data for {symbol}',
                            'progress': progress
                        }
                    )
                    
                except Exception as e:
                    print(f"Error collecting data for {symbol}: {str(e)}")
                    continue
        
        return {
            'status': 'Data collection completed',
            'processed_symbols': processed,
            'total_symbols': total_symbols
        }
        
    except Exception as e:
        self.update_state(
            state='FAILURE',
            meta={'status': f'Error: {str(e)}'}
        )
        raise e
    finally:
        db.close()


@celery_app.task(bind=True)
def evaluate_models_task(self):
    """Background task to evaluate model performance"""
    try:
        self.update_state(state='PROGRESS', meta={'status': 'Evaluating models...'})
        
        # Symbols to evaluate
        evaluation_symbols = {
            'stock': ['AAPL', 'GOOGL', 'MSFT'],
            'crypto': ['BTC', 'ETH'],
            'commodity': ['GOLD', 'OIL']
        }
        
        db = next(get_db())
        ml_service = MLPredictionService()
        
        total_evaluations = sum(len(symbols) for symbols in evaluation_symbols.values()) * 3  # 3 models each
        processed = 0
        
        from app.models.predictions import ModelType
        
        for market_type, symbols in evaluation_symbols.items():
            for symbol in symbols:
                for model_type in [ModelType.LINEAR_REGRESSION, ModelType.LSTM, ModelType.PROPHET]:
                    try:
                        # Run async function in sync context
                        loop = asyncio.new_event_loop()
                        asyncio.set_event_loop(loop)
                        result = loop.run_until_complete(
                            ml_service.evaluate_model_performance(symbol, market_type, model_type, db)
                        )
                        loop.close()
                        
                        processed += 1
                        progress = (processed / total_evaluations) * 100
                        
                        self.update_state(
                            state='PROGRESS',
                            meta={
                                'status': f'Evaluated {model_type} for {symbol}',
                                'progress': progress,
                                'r2_score': result.get('r2_score', 0)
                            }
                        )
                        
                    except Exception as e:
                        print(f"Error evaluating {model_type} for {symbol}: {str(e)}")
                        continue
        
        return {
            'status': 'Model evaluation completed',
            'evaluated_models': processed,
            'total_models': total_evaluations
        }
        
    except Exception as e:
        self.update_state(
            state='FAILURE',
            meta={'status': f'Error: {str(e)}'}
        )
        raise e
    finally:
        db.close()


@celery_app.task(bind=True)
def cleanup_old_data_task(self):
    """Background task to cleanup old data"""
    try:
        self.update_state(state='PROGRESS', meta={'status': 'Cleaning up old data...'})
        
        db = next(get_db())
        
        # Clean up old market data (keep last 2 years)
        cutoff_date = datetime.now() - timedelta(days=730)
        
        from app.models.market_data import MarketData
        from app.models.predictions import Prediction
        
        # Delete old market data
        old_market_data = db.query(MarketData).filter(
            MarketData.timestamp < cutoff_date
        ).delete()
        
        # Delete old predictions (keep last year)
        prediction_cutoff = datetime.now() - timedelta(days=365)
        old_predictions = db.query(Prediction).filter(
            Prediction.created_at < prediction_cutoff
        ).delete()
        
        db.commit()
        
        return {
            'status': 'Cleanup completed',
            'deleted_market_records': old_market_data,
            'deleted_prediction_records': old_predictions
        }
        
    except Exception as e:
        self.update_state(
            state='FAILURE',
            meta={'status': f'Error: {str(e)}'}
        )
        raise e
    finally:
        db.close()


@celery_app.task(bind=True)
def generate_prediction_task(self, symbol, market_type, model_type, prediction_horizon, user_id):
    """Background task to generate a prediction"""
    try:
        self.update_state(state='PROGRESS', meta={'status': 'Generating prediction...'})
        
        db = next(get_db())
        ml_service = MLPredictionService()
        
        # Run async function in sync context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        result = loop.run_until_complete(
            ml_service.generate_prediction(
                symbol, market_type, model_type, prediction_horizon, user_id, db
            )
        )
        loop.close()
        
        return {
            'status': 'Prediction generated successfully',
            'predicted_price': result['predicted_price'],
            'confidence_score': result['confidence_score']
        }
        
    except Exception as e:
        self.update_state(
            state='FAILURE',
            meta={'status': f'Error: {str(e)}'}
        )
        raise e
    finally:
        db.close()