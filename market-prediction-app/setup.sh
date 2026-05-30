#!/bin/bash

# AI-Powered Market Prediction App Setup Script
# This script sets up the complete application environment

set -e

echo "🚀 Setting up AI-Powered Market Prediction App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_status "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if Node.js is installed (for local development)
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. You'll need it for local development."
        print_status "Visit: https://nodejs.org/"
    else
        print_success "Node.js is installed"
    fi
}

# Check if Python is installed (for local development)
check_python() {
    print_status "Checking Python installation..."
    if ! command -v python3 &> /dev/null; then
        print_warning "Python 3 is not installed. You'll need it for local development."
        print_status "Visit: https://python.org/"
    else
        print_success "Python 3 is installed"
    fi
}

# Create environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        print_success "Created backend/.env file"
        print_warning "Please edit backend/.env with your configuration"
    else
        print_status "backend/.env already exists"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        cp frontend/.env.example frontend/.env
        print_success "Created frontend/.env file"
        print_warning "Please edit frontend/.env with your configuration"
    else
        print_status "frontend/.env already exists"
    fi
}

# Build and start the application
start_application() {
    print_status "Building Docker images..."
    docker-compose build
    
    print_status "Starting the application..."
    docker-compose up -d
    
    print_status "Waiting for services to start..."
    sleep 30
    
    # Health checks
    print_status "Performing health checks..."
    
    # Check database
    if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
        print_success "Database is ready"
    else
        print_warning "Database is not ready yet"
    fi
    
    # Check Redis
    if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        print_success "Redis is ready"
    else
        print_warning "Redis is not ready yet"
    fi
    
    # Check backend
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend API is ready"
    else
        print_warning "Backend API is not ready yet"
    fi
    
    # Check frontend
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is ready"
    else
        print_warning "Frontend is not ready yet"
    fi
}

# Show final information
show_final_info() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📱 Application URLs:"
    echo "   Frontend:     http://localhost:3000"
    echo "   Backend API:  http://localhost:8000"
    echo "   API Docs:     http://localhost:8000/docs"
    echo ""
    echo "🔧 Useful commands:"
    echo "   View logs:    docker-compose logs -f"
    echo "   Stop app:     docker-compose down"
    echo "   Restart:      docker-compose restart"
    echo "   Clean up:     docker-compose down -v"
    echo ""
    echo "📚 Documentation:"
    echo "   README:       ./README.md"
    echo "   Makefile:     make help"
    echo ""
    echo "🔑 Next steps:"
    echo "   1. Edit backend/.env and frontend/.env with your configuration"
    echo "   2. Visit http://localhost:3000 to access the application"
    echo "   3. Register a new account or use the API"
    echo "   4. Check the logs if you encounter any issues"
    echo ""
    print_warning "Note: The application may take a few minutes to fully initialize."
    print_status "You can monitor the startup process with: docker-compose logs -f"
}

# Main setup process
main() {
    echo "🤖 AI-Powered Market Prediction App Setup"
    echo "========================================"
    echo ""
    
    check_docker
    check_node
    check_python
    setup_environment
    start_application
    show_final_info
}

# Run main function
main "$@"