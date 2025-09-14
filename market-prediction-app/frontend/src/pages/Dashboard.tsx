import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Psychology,
  Assessment,
} from '@mui/icons-material';
import { dashboardAPI } from '../services/api';
import { DashboardOverview, TopMarket, Prediction } from '../types';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardAPI.getOverview();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!dashboardData) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No dashboard data available
      </Alert>
    );
  }

  const getTrendIcon = (change: number) => {
    return change >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? 'success' : 'error';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assessment color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Predictions
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.total_predictions}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Psychology color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Confidence
                  </Typography>
                  <Typography variant="h4">
                    {(dashboardData.accuracy_stats.average_confidence * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    High Confidence
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.accuracy_stats.high_confidence_predictions}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assessment color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Models Used
                  </Typography>
                  <Typography variant="h4">
                    {Object.keys(dashboardData.accuracy_stats.model_breakdown).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Predictions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Predictions
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Confidence</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recent_predictions.slice(0, 5).map((prediction: Prediction) => (
                      <TableRow key={prediction.id}>
                        <TableCell>
                          <Chip label={prediction.symbol} size="small" />
                        </TableCell>
                        <TableCell>${prediction.predicted_price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={prediction.model_type.replace('_', ' ').toUpperCase()} 
                            size="small" 
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${((prediction.confidence_score || 0) * 100).toFixed(1)}%`}
                            size="small"
                            color={prediction.confidence_score && prediction.confidence_score > 0.7 ? 'success' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Markets */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Markets
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Price Change</TableCell>
                      <TableCell>Avg Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.top_markets.slice(0, 5).map((market: TopMarket, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip label={market.symbol} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={market.market_type.toUpperCase()} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {getTrendIcon(market.price_change_percent)}
                            <Typography 
                              color={getTrendColor(market.price_change_percent)}
                              variant="body2"
                              sx={{ ml: 1 }}
                            >
                              {market.price_change_percent.toFixed(2)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>${market.average_price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Model Breakdown */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Model Usage Breakdown
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {Object.entries(dashboardData.accuracy_stats.model_breakdown).map(([model, count]) => (
                  <Chip
                    key={model}
                    label={`${model.replace('_', ' ').toUpperCase()}: ${count}`}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;