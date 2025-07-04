"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const WeatherService_1 = __importDefault(require("../services/WeatherService"));
const router = express_1.default.Router();
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
        const weatherData = await WeatherService_1.default.getCurrentWeather(city);
        res.json(weatherData);
    }
    catch (error) {
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
    let citiesToCheck;
    if (city && typeof city === 'string') {
        // Single city provided
        citiesToCheck = [city];
    }
    else {
        if (allowedCities.length === 0) {
            return res.status(400).json({ error: 'Missing city query param and not Allowed Cities are set' });
        }
        citiesToCheck = allowedCities;
    }
    try {
        const stats = await WeatherService_1.default.getStats(citiesToCheck);
        res.json(stats);
    }
    catch (error) {
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
        const forecastData = await WeatherService_1.default.getFiveDayForecast(city);
        res.json(forecastData);
    }
    catch (error) {
        if (error.message === 'City not found') {
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(500).json({ error: 'External service error' });
    }
});
exports.default = router;
//# sourceMappingURL=weather.js.map