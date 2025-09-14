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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { predictionsAPI, marketsAPI } from '../services/api';
import { Prediction, PredictionRequest, MarketType, ModelType } from '../types';

const Predictions: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedMarketType, setSelectedMarketType] = useState<MarketType>(MarketType.STOCK);
  const [selectedModelType, setSelectedModelType] = useState<ModelType>(ModelType.LINEAR_REGRESSION);
  const [predictionHorizon, setPredictionHorizon] = useState(7);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [predictionDialogOpen, setPredictionDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleCreatePrediction = async () => {
    if (!selectedSymbol) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const request: PredictionRequest = {
        symbol: selectedSymbol,
        market_type: selectedMarketType,
        model_type: selectedModelType,
        prediction_horizon: predictionHorizon,
      };

      await predictionsAPI.createPrediction(request);
      setSuccess('Prediction generation started! This may take a few minutes.');
      setPredictionDialogOpen(false);
      
      // Refresh predictions after a delay
      setTimeout(() => {
        fetchPredictions();
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create prediction');
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictions = async () => {
    if (!selectedSymbol) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await predictionsAPI.getPredictionHistory(
        selectedSymbol, 
        selectedMarketType, 
        undefined, 
        90
      );
      setPredictions(response.predictions);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch predictions');
    } finally {
      setLoading(false);
    }
  };

  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol);
    if (symbol) {
      fetchPredictions();
    }
  };

  useEffect(() => {
    if (selectedSymbol) {
      fetchPredictions();
    }
  }, [selectedSymbol, selectedMarketType]);

  const getConfidenceColor = (confidence: number | null) => {
    if (!confidence) return 'default';
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getModelColor = (modelType: string) => {
    switch (modelType) {
      case 'linear_regression':
        return 'primary';
      case 'lstm':
        return 'secondary';
      case 'prophet':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatChartData = () => {
    return predictions.map(pred => ({
      date: new Date(pred.prediction_date).toLocaleDateString(),
      predicted_price: pred.predicted_price,
      confidence: (pred.confidence_score || 0) * 100,
      model: pred.model_type.replace('_', ' ').toUpperCase(),
    }));
  };

  const steps = ['Select Parameters', 'Review & Generate'];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Predictions
      </Typography>

      {/* Prediction Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Symbol"
                value={selectedSymbol}
                onChange={(e) => handleSymbolChange(e.target.value.toUpperCase())}
                placeholder="e.g., AAPL, BTC, GOLD"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
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
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Model</InputLabel>
                <Select
                  value={selectedModelType}
                  label="Model"
                  onChange={(e) => setSelectedModelType(e.target.value as ModelType)}
                >
                  {Object.values(ModelType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Days Ahead"
                type="number"
                value={predictionHorizon}
                onChange={(e) => setPredictionHorizon(parseInt(e.target.value) || 7)}
                inputProps={{ min: 1, max: 30 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setPredictionDialogOpen(true)}
                disabled={loading || !selectedSymbol}
                sx={{ height: '56px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Prediction'}
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

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {predictions.length > 0 && (
        <Grid container spacing={3}>
          {/* Predictions Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Prediction History - {selectedSymbol}
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={formatChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin * 0.95', 'dataMax * 1.05']} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'predicted_price' ? `$${value.toFixed(2)}` : `${value.toFixed(1)}%`,
                        name === 'predicted_price' ? 'Predicted Price' : 'Confidence'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="predicted_price" 
                      stroke="#1976d2" 
                      strokeWidth={2}
                      name="predicted_price"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#ff9800" 
                      strokeWidth={2}
                      name="confidence"
                      yAxisId="confidence"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Predictions Table */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Predictions
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell align="right">Confidence</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {predictions.slice(0, 10).map((prediction) => (
                        <TableRow key={prediction.id}>
                          <TableCell>
                            {new Date(prediction.prediction_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            ${prediction.predicted_price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={prediction.model_type.replace('_', ' ').toUpperCase()} 
                              size="small"
                              color={getModelColor(prediction.model_type)}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={`${((prediction.confidence_score || 0) * 100).toFixed(1)}%`}
                              size="small"
                              color={getConfidenceColor(prediction.confidence_score)}
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
        </Grid>
      )}

      {/* Prediction Dialog */}
      <Dialog 
        open={predictionDialogOpen} 
        onClose={() => setPredictionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate Prediction</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Prediction Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Symbol"
                    value={selectedSymbol}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Market Type"
                    value={selectedMarketType.toUpperCase()}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Model"
                    value={selectedModelType.replace('_', ' ').toUpperCase()}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Prediction Horizon"
                    value={`${predictionHorizon} days ahead`}
                    disabled
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Ready to Generate Prediction
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                This will generate a prediction for {selectedSymbol} using the {selectedModelType.replace('_', ' ')} model.
                The process may take a few minutes depending on the amount of historical data available.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPredictionDialogOpen(false)}>
            Cancel
          </Button>
          {activeStep === 0 && (
            <Button onClick={() => setActiveStep(1)}>
              Next
            </Button>
          )}
          {activeStep === 1 && (
            <Button 
              onClick={handleCreatePrediction}
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Prediction'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Predictions;