import axios from 'axios';
import { 
  MarketDataResponse, 
  Prediction, 
  PredictionRequest, 
  DashboardOverview, 
  MarketStats,
  Token,
  User
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username: string, password: string): Promise<Token> => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/api/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  register: async (userData: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }): Promise<User> => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  }
};

export const marketsAPI = {
  getMarketData: async (
    symbol: string, 
    marketType: string, 
    days: number = 30
  ): Promise<MarketDataResponse> => {
    const response = await api.get(`/api/markets/data/${symbol}`, {
      params: { market_type: marketType, days }
    });
    return response.data;
  },

  getAvailableSymbols: async (marketType?: string) => {
    const response = await api.get('/api/markets/symbols', {
      params: marketType ? { market_type: marketType } : {}
    });
    return response.data;
  },

  getMarketStats: async (symbol: string, marketType: string): Promise<MarketStats> => {
    const response = await api.get(`/api/markets/stats/${symbol}`, {
      params: { market_type: marketType }
    });
    return response.data;
  },

  refreshMarketData: async (symbols: string[], marketTypes: string[]) => {
    const response = await api.post('/api/markets/refresh', {
      symbols,
      market_types: marketTypes
    });
    return response.data;
  }
};

export const predictionsAPI = {
  createPrediction: async (request: PredictionRequest) => {
    const response = await api.post('/api/predictions/predict', request);
    return response.data;
  },

  getPredictionHistory: async (
    symbol: string, 
    marketType: string, 
    modelType?: string, 
    days: number = 30
  ): Promise<{ symbol: string; predictions: Prediction[] }> => {
    const response = await api.get(`/api/predictions/history/${symbol}`, {
      params: { 
        market_type: marketType, 
        model_type: modelType, 
        days 
      }
    });
    return response.data;
  },

  getLatestPredictions: async (
    symbol: string, 
    marketType: string
  ): Promise<{ symbol: string; latest_predictions: Prediction[] }> => {
    const response = await api.get(`/api/predictions/latest/${symbol}`, {
      params: { market_type: marketType }
    });
    return response.data;
  },

  getModelPerformance: async (symbol?: string, modelType?: string) => {
    const response = await api.get('/api/predictions/models/performance', {
      params: { symbol, model_type: modelType }
    });
    return response.data;
  }
};

export const dashboardAPI = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await api.get('/api/dashboard/overview');
    return response.data;
  },

  getPortfolio: async () => {
    const response = await api.get('/api/dashboard/portfolio');
    return response.data;
  },

  getMarketTrends: async () => {
    const response = await api.get('/api/dashboard/market-trends');
    return response.data;
  },

  getAlerts: async () => {
    const response = await api.get('/api/dashboard/alerts');
    return response.data;
  }
};

export default api;