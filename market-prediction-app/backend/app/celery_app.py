from celery import Celery
from app.config import settings

# Create Celery instance
celery_app = Celery(
    "market_prediction",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=['app.tasks']
)

# Celery configuration
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Periodic tasks (using Celery Beat)
celery_app.conf.beat_schedule = {
    'collect-market-data-every-hour': {
        'task': 'app.tasks.collect_market_data_task',
        'schedule': 3600.0,  # Every hour
    },
    'evaluate-models-daily': {
        'task': 'app.tasks.evaluate_models_task',
        'schedule': 86400.0,  # Every day
    },
    'cleanup-old-data-weekly': {
        'task': 'app.tasks.cleanup_old_data_task',
        'schedule': 604800.0,  # Every week
    },
}