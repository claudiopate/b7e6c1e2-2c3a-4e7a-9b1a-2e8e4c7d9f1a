import express from 'express';
import WeatherService from '../services/WeatherService';

const router = express.Router();

// 1. Current Weather Forecast for a city
router.get('/current', async (req, res) => {
  const { city } = req.query;
  const allowedCities = process.env.ALLOWED_CITIES?.split(',') || [];

  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'Missing city query param' });
  }

  // Check if city is allowed (if ALLOWED_CITIES is configured)
  if (allowedCities && !allowedCities.includes(city)) {
    return res.status(404).json({ error: 'City not allowed' });
  }

  try {
    const weatherData = await WeatherService.getCurrentWeather(city);
    res.json(weatherData);
  } catch (error: any) {
    if (error.message === 'City not found') {
      return res.status(404).json({ error: 'City not found' });
    }
    res.status(500).json({ error: 'External service error' });
  }
});

// 2. Average temperature, max humidity, max temperature for the three cities
router.get('/stats', async (req, res) => {
  const { city } = req.query;
  const allowedCities = process.env.ALLOWED_CITIES?.split(',') || [];

  let citiesToCheck: string[];

  if (city && typeof city === 'string') {
    // Single city provided
    citiesToCheck = [city];
  } else {
    if (allowedCities.length === 0) {
      return res.status(400).json({ error: 'Missing city query param and not Allowed Cities are set' });
    }
    citiesToCheck = allowedCities;
  }

  try {
    const stats = await WeatherService.getStats(citiesToCheck);
    res.json(stats);
  } catch (error: any) {
    if (error.message === 'City not found') {
      return res.status(404).json({ error: 'City not found' });
    }
    res.status(500).json({ error: 'External service error' });
  }
});

// 3. Five Days Forecast for a city
router.get('/forecast', async (req, res) => {
  const { city } = req.query;
  const allowedCities = process.env.ALLOWED_CITIES?.split(',') || [];
  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'Missing city query param' });
  }

  // Check if city is allowed (if ALLOWED_CITIES is configured)
  if (allowedCities && !allowedCities.includes(city)) {
    return res.status(404).json({ error: 'City not allowed' });
  }

  try {
    const forecastData = await WeatherService.getFiveDayForecast(city);
    res.json(forecastData);
  } catch (error: any) {
    if (error.message === 'City not found') {
      return res.status(404).json({ error: 'City not found' });
    }
    res.status(500).json({ error: 'External service error' });
  }
});

export default router; 