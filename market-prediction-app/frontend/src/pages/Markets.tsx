import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { marketsAPI } from '../services/api';
import { MarketDataResponse, MarketStats, MarketType } from '../types';

const Markets: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedMarketType, setSelectedMarketType] = useState<MarketType>(MarketType.STOCK);
  const [days, setDays] = useState(30);
  const [marketData, setMarketData] = useState<MarketDataResponse | null>(null);
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchData = async () => {
    if (!selectedSymbol) return;
    
    setLoading(true);
    setError('');

    try {
      const [dataResponse, statsResponse] = await Promise.all([
        marketsAPI.getMarketData(selectedSymbol, selectedMarketType, days),
        marketsAPI.getMarketStats(selectedSymbol, selectedMarketType)
      ]);
      
      setMarketData(dataResponse);
      setMarketStats(statsResponse);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (data: MarketDataResponse) => {
    return data.data.map(item => ({
      date: new Date(item.timestamp).toLocaleDateString(),
      close: item.close,
      high: item.high,
      low: item.low,
      volume: item.volume,
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Market Data Analysis
      </Typography>

      {/* Search Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Symbol"
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
                placeholder="e.g., AAPL, BTC, GOLD"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Market Type</InputLabel>
                <Select
                  value={selectedMarketType}
                  label="Market Type"
                  onChange={(e) => setSelectedMarketType(e.target.value as MarketType)}
                >
                  {Object.values(MarketType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Days"
                type="number"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 30)}
                inputProps={{ min: 1, max: 365 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleFetchData}
                disabled={loading || !selectedSymbol}
                sx={{ height: '56px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Fetch Data'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {marketStats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Current Price
                </Typography>
                <Typography variant="h5">
                  ${marketStats.current_price.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  30-Day Average
                </Typography>
                <Typography variant="h5">
                  ${marketStats.average_30d.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  30-Day Change
                </Typography>
                <Typography 
                  variant="h5" 
                  color={marketStats.change_30d >= 0 ? 'success.main' : 'error.main'}
                >
                  ${marketStats.change_30d.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Change %
                </Typography>
                <Typography 
                  variant="h5" 
                  color={marketStats.change_percent_30d >= 0 ? 'success.main' : 'error.main'}
                >
                  {marketStats.change_percent_30d.toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {marketData && (
        <Grid container spacing={3}>
          {/* Price Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Price Chart - {marketData.symbol}
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={formatChartData(marketData)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin * 0.95', 'dataMax * 1.05']} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `$${value.toFixed(2)}`, 
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#1976d2" 
                      strokeWidth={2}
                      name="Close Price"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="high" 
                      stroke="#4caf50" 
                      strokeWidth={1}
                      name="High"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="low" 
                      stroke="#f44336" 
                      strokeWidth={1}
                      name="Low"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Market Details */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Market Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={marketData.market_type.toUpperCase()} 
                    color="primary" 
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={`${marketData.data_points} data points`} 
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Latest Data Point:
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Date: {new Date(marketData.data[0]?.timestamp).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Close: ${marketData.data[0]?.close.toFixed(2)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Volume: {marketData.data[0]?.volume.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>

            {/* Recent Data Table */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Data
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Close</TableCell>
                        <TableCell align="right">Volume</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {marketData.data.slice(0, 10).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {new Date(item.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            ${item.close.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {item.volume.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Markets;