.PHONY: help install build start stop restart logs clean test lint format

# Default target
help:
	@echo "Available commands:"
	@echo "  install     - Install dependencies for both frontend and backend"
	@echo "  build       - Build Docker images"
	@echo "  start       - Start the application using Docker Compose"
	@echo "  stop        - Stop the application"
	@echo "  restart     - Restart the application"
	@echo "  logs        - Show logs from all services"
	@echo "  clean       - Clean up Docker containers and volumes"
	@echo "  test        - Run tests"
	@echo "  lint        - Run linting"
	@echo "  format      - Format code"
	@echo "  dev-backend - Start backend in development mode"
	@echo "  dev-frontend- Start frontend in development mode"

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build

# Start the application
start:
	@echo "Starting the application..."
	docker-compose up -d
	@echo "Application started! Access at:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend API: http://localhost:8000"
	@echo "  API Docs: http://localhost:8000/docs"

# Stop the application
stop:
	@echo "Stopping the application..."
	docker-compose down

# Restart the application
restart: stop start

# Show logs
logs:
	docker-compose logs -f

# Clean up
clean:
	@echo "Cleaning up Docker containers and volumes..."
	docker-compose down -v --remove-orphans
	docker system prune -f

# Run tests
test:
	@echo "Running backend tests..."
	cd backend && python -m pytest tests/ -v
	@echo "Running frontend tests..."
	cd frontend && npm test -- --coverage --watchAll=false

# Run linting
lint:
	@echo "Linting backend..."
	cd backend && flake8 app/
	@echo "Linting frontend..."
	cd frontend && npm run lint

# Format code
format:
	@echo "Formatting backend..."
	cd backend && black app/ && isort app/
	@echo "Formatting frontend..."
	cd frontend && npm run format

# Development mode - Backend only
dev-backend:
	@echo "Starting backend in development mode..."
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Development mode - Frontend only
dev-frontend:
	@echo "Starting frontend in development mode..."
	cd frontend && npm start

# Database operations
db-migrate:
	@echo "Running database migrations..."
	cd backend && alembic upgrade head

db-rollback:
	@echo "Rolling back database migration..."
	cd backend && alembic downgrade -1

db-reset:
	@echo "Resetting database..."
	docker-compose down -v
	docker-compose up -d db redis
	sleep 10
	$(MAKE) db-migrate

# Celery operations
celery-worker:
	@echo "Starting Celery worker..."
	cd backend && celery -A app.celery_app worker --loglevel=info

celery-beat:
	@echo "Starting Celery beat..."
	cd backend && celery -A app.celery_app beat --loglevel=info

# Production deployment
deploy-prod:
	@echo "Deploying to production..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Health checks
health:
	@echo "Checking application health..."
	@echo "Backend health:"
	@curl -s http://localhost:8000/health || echo "Backend not responding"
	@echo "Frontend health:"
	@curl -s http://localhost:3000 || echo "Frontend not responding"
	@echo "Database health:"
	@docker-compose exec db pg_isready -U postgres || echo "Database not responding"
	@echo "Redis health:"
	@docker-compose exec redis redis-cli ping || echo "Redis not responding"