# AI-Powered Market Prediction Platform

A comprehensive data-driven platform designed to forecast trends across stocks, cryptocurrencies, commodities, e-commerce demand, and real estate using advanced machine learning models.

## 🚀 Features

- **Multi-Market Support**: Stocks, Cryptocurrencies, Commodities, Real Estate, and Forex
- **Advanced ML Models**: Linear Regression, LSTM Neural Networks, and Prophet Time Series
- **Real-Time Data Collection**: Integration with Yahoo Finance, Binance, NSE, and other APIs
- **Interactive Dashboard**: Modern React.js frontend with Plotly/Recharts visualizations
- **User Authentication**: Secure JWT-based authentication system
- **Background Processing**: Celery for asynchronous data collection and ML training
- **Scalable Architecture**: Docker containerization with PostgreSQL and Redis
- **Performance Monitoring**: Model accuracy tracking and performance metrics

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React.js      │    │   FastAPI       │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │     Redis       │              │
         │              │     Cache       │              │
         │              └─────────────────┘              │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data APIs     │    │   Celery        │    │   ML Models     │
│   (Yahoo,       │    │   Workers       │    │   (LSTM,        │
│   Binance,      │    │                 │    │   Prophet,      │
│   NSE, etc.)    │    │                 │    │   Regression)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework for APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Primary database
- **Redis**: Caching and message broker
- **Celery**: Distributed task queue
- **TensorFlow**: LSTM neural networks
- **Prophet**: Time series forecasting
- **Scikit-learn**: Machine learning algorithms

### Frontend
- **React.js**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Material-UI**: Component library
- **Plotly.js**: Interactive charts
- **Recharts**: Data visualization
- **Axios**: HTTP client

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Web server and reverse proxy

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd market-prediction-app
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your configuration
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database Setup**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d db redis
   
   # Run migrations (if any)
   alembic upgrade head
   ```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Markets
- `GET /api/markets/data/{symbol}` - Get market data
- `GET /api/markets/symbols` - Get available symbols
- `GET /api/markets/stats/{symbol}` - Get market statistics
- `POST /api/markets/refresh` - Refresh market data

### Predictions
- `POST /api/predictions/predict` - Generate prediction
- `GET /api/predictions/history/{symbol}` - Get prediction history
- `GET /api/predictions/latest/{symbol}` - Get latest predictions
- `GET /api/predictions/models/performance` - Get model performance

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview
- `GET /api/dashboard/portfolio` - User portfolio
- `GET /api/dashboard/market-trends` - Market trends
- `GET /api/dashboard/alerts` - User alerts

## 🤖 Machine Learning Models

### 1. Linear Regression
- **Use Case**: Simple trend analysis and short-term predictions
- **Features**: Price moving averages, volume indicators, volatility
- **Best For**: Stocks with stable trends

### 2. LSTM Neural Network
- **Use Case**: Complex pattern recognition in time series
- **Architecture**: 2-layer LSTM with dropout for regularization
- **Best For**: Cryptocurrencies and volatile markets

### 3. Prophet
- **Use Case**: Seasonal pattern detection and forecasting
- **Features**: Automatic seasonality detection, holiday effects
- **Best For**: Commodities and long-term predictions

## 📈 Data Sources

- **Yahoo Finance**: Stock and commodity data
- **Binance API**: Cryptocurrency data
- **NSE API**: Indian stock market data
- **Custom APIs**: Real estate and specialized market data

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/market_prediction
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-super-secret-key
YAHOO_FINANCE_API_KEY=your_api_key
BINANCE_API_KEY=your_api_key
BINANCE_SECRET_KEY=your_secret_key
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
```

## 📊 Usage Examples

### 1. Generate a Stock Prediction
```python
import requests

# Create prediction request
response = requests.post('http://localhost:8000/api/predictions/predict', json={
    'symbol': 'AAPL',
    'market_type': 'stock',
    'model_type': 'lstm',
    'prediction_horizon': 7
}, headers={'Authorization': 'Bearer your_token'})
```

### 2. Get Market Data
```javascript
// Frontend example
const marketData = await marketsAPI.getMarketData('BTC', 'crypto', 30);
console.log(marketData);
```

### 3. Dashboard Overview
```javascript
const dashboardData = await dashboardAPI.getOverview();
// Returns recent predictions, top markets, accuracy stats
```

## 🚀 Deployment

### Production Deployment

1. **Update environment variables** for production
2. **Configure reverse proxy** (Nginx)
3. **Set up SSL certificates**
4. **Configure monitoring** and logging
5. **Set up backup strategies**

### Cloud Deployment (AWS/GCP/Azure)

```bash
# Example for AWS ECS
aws ecs create-cluster --cluster-name market-prediction
aws ecs register-task-definition --cli-input-json file://task-definition.json
aws ecs create-service --cluster market-prediction --service-name api-service
```

## 📊 Monitoring and Performance

### Health Checks
- Backend: `GET /health`
- Database connectivity
- Redis connectivity
- Celery worker status

### Metrics to Monitor
- API response times
- Database query performance
- Model prediction accuracy
- Data collection success rates
- System resource usage

## 🔒 Security Considerations

- JWT token authentication
- API rate limiting
- Input validation and sanitization
- HTTPS in production
- Database connection encryption
- Environment variable security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps db
   # Check logs
   docker-compose logs db
   ```

2. **Redis Connection Error**
   ```bash
   # Check Redis status
   docker-compose ps redis
   # Test connection
   redis-cli ping
   ```

3. **Frontend Build Issues**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **ML Model Training Issues**
   ```bash
   # Check Celery worker logs
   docker-compose logs celery-worker
   # Verify data availability
   curl http://localhost:8000/api/markets/symbols
   ```

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation at `/docs`

## 🔮 Future Enhancements

- [ ] Additional ML models (ARIMA, Random Forest)
- [ ] Real-time WebSocket updates
- [ ] Advanced portfolio management
- [ ] Social sentiment analysis
- [ ] Mobile application
- [ ] Advanced risk assessment
- [ ] Multi-language support
- [ ] Advanced backtesting tools

---

**Built with ❤️ for the financial technology community**