export interface MarketData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketDataResponse {
  symbol: string;
  market_type: string;
  data_points: number;
  data: MarketData[];
}

export interface Prediction {
  id: number;
  symbol: string;
  market_type: string;
  model_type: string;
  predicted_price: number;
  prediction_date: string;
  confidence_score: number | null;
  created_at: string;
}

export interface PredictionRequest {
  symbol: string;
  market_type: string;
  model_type: string;
  prediction_horizon: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: boolean;
  is_premium: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface DashboardOverview {
  recent_predictions: Prediction[];
  top_markets: TopMarket[];
  accuracy_stats: AccuracyStats;
  total_predictions: number;
}

export interface TopMarket {
  symbol: string;
  market_type: string;
  average_price: number;
  price_change_percent: number;
  max_price: number;
  min_price: number;
}

export interface AccuracyStats {
  total_predictions: number;
  average_confidence: number;
  high_confidence_predictions: number;
  model_breakdown: Record<string, number>;
}

export interface MarketStats {
  symbol: string;
  current_price: number;
  average_30d: number;
  change_30d: number;
  change_percent_30d: number;
  volume: number | null;
  timestamp: string;
}

export enum MarketType {
  STOCK = 'stock',
  CRYPTO = 'crypto',
  COMMODITY = 'commodity',
  REAL_ESTATE = 'real_estate',
  FOREX = 'forex'
}

export enum ModelType {
  LINEAR_REGRESSION = 'linear_regression',
  LSTM = 'lstm',
  PROPHET = 'prophet',
  ARIMA = 'arima',
  RANDOM_FOREST = 'random_forest'
}