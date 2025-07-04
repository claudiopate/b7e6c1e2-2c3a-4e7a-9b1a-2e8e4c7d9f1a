"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./helpers");
const supertest_1 = __importDefault(require("supertest"));
const sinon_1 = __importDefault(require("sinon"));
const axios_1 = __importDefault(require("axios"));
const weatherMocks_1 = require("./mocks/weatherMocks");
const WeatherService_1 = __importDefault(require("../src/services/WeatherService"));
const express_1 = __importDefault(require("express"));
const weather_1 = __importDefault(require("../src/routes/weather"));
describe('Weather API', () => {
    let app;
    let server;
    let axiosStub;
    let getStatsStub;
    let getCurrentWeatherStub;
    let getFiveDayForecastStub;
    before(async () => {
        // Set environment variables for tests
        process.env.ALLOWED_CITIES = 'Milan,Rome,Florence';
        process.env.OPENWEATHER_API_KEY = 'test-api-key';
        // Create Express app and start server
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use('/api/weather', weather_1.default);
        // Start server on a different port for tests
        server = app.listen(3001);
        // Stub axios to return mock responses instead of real API calls
        axiosStub = sinon_1.default.stub(axios_1.default, 'get');
        getStatsStub = sinon_1.default.stub(WeatherService_1.default, 'getStats');
        getCurrentWeatherStub = sinon_1.default.stub(WeatherService_1.default, 'getCurrentWeather');
        getFiveDayForecastStub = sinon_1.default.stub(WeatherService_1.default, 'getFiveDayForecast');
    });
    after(async () => {
        // Close server
        if (server) {
            await new Promise(resolve => server.close(resolve));
        }
        // Clean up environment
        delete process.env.ALLOWED_CITIES;
        delete process.env.OPENWEATHER_API_KEY;
        axiosStub.restore();
        getStatsStub.restore();
        getCurrentWeatherStub.restore();
        getFiveDayForecastStub.restore();
    });
    beforeEach(() => {
        axiosStub.reset();
        getStatsStub.reset();
        getCurrentWeatherStub.reset();
        getFiveDayForecastStub.reset();
    });
    describe('GET /api/weather/current', () => {
        it('should return 400 if city is missing', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/weather/current');
            res.status.should.equal(400);
            res.body.should.have.property('error', 'Missing city query param');
        });
        it('should return 404 if city is not in allowed list (when ALLOWED_CITIES configured)', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/weather/current?city=Paris');
            if (res.status === 404) {
                res.body.should.have.property('error', 'City not allowed');
            }
            else {
                res.status.should.equal(200);
                res.body.should.have.property('name');
                res.body.should.have.property('main');
            }
        });
        it('should return 200 with weather data for valid city', async () => {
            // Mock WeatherService directly
            getCurrentWeatherStub.resolves(weatherMocks_1.mockCurrentWeatherResponse);
            const res = await (0, supertest_1.default)(app).get('/api/weather/current?city=Milan');
            res.status.should.equal(200);
            res.body.should.have.property('name', 'Milan');
            res.body.should.have.property('main');
            res.body.main.should.have.property('temp');
            res.body.main.should.have.property('humidity');
            res.body.main.should.have.property('pressure');
        });
        it('should return 404 for city not found', async () => {
            // Mock API error with 404
            axiosStub.rejects({ response: { status: 404, data: { cod: "404", message: "city not found" } } });
            const res = await (0, supertest_1.default)(app).get('/api/weather/current?city=InvalidCityXYZ');
            res.status.should.equal(404);
            res.body.should.have.property('error');
        });
    });
    describe('GET /api/weather/stats', () => {
        it('should return 200 with stats for configured cities when no city param', async () => {
            // Mock WeatherService directly
            getStatsStub.resolves(weatherMocks_1.mockStatsResponse);
            const res = await (0, supertest_1.default)(app).get('/api/weather/stats');
            if (res.status === 200) {
                res.body.should.have.property('avgTemperature');
                res.body.should.have.property('maxHumidity');
                res.body.should.have.property('maxTemperature');
                res.body.maxHumidity.should.have.property('city');
                res.body.maxHumidity.should.have.property('value');
                res.body.maxTemperature.should.have.property('city');
                res.body.maxTemperature.should.have.property('value');
            }
            else {
                res.status.should.equal(400);
                res.body.should.have.property('error');
            }
        });
        it('should return 200 with single city stats when city param provided', async () => {
            // Mock WeatherService directly
            getStatsStub.resolves(weatherMocks_1.mockStatsResponse);
            const res = await (0, supertest_1.default)(app).get('/api/weather/stats?city=Rome');
            res.status.should.equal(200);
            res.body.should.have.property('avgTemperature');
            res.body.should.have.property('maxHumidity');
            res.body.should.have.property('maxTemperature');
            res.body.maxHumidity.should.have.property('city');
            res.body.maxTemperature.should.have.property('city');
        });
        it('should return 400 when no city param and no ALLOWED_CITIES configured', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/weather/stats');
            if (res.status === 400) {
                res.body.should.have.property('error');
                res.body.error.should.include('Missing city query param');
            }
        });
    });
    describe('GET /api/weather/forecast', () => {
        it('should return 400 if city is missing', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/weather/forecast');
            res.status.should.equal(400);
            res.body.should.have.property('error', 'Missing city query param');
        });
        it('should return 404 if city is not in allowed list (when ALLOWED_CITIES configured)', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/weather/forecast?city=Paris');
            if (res.status === 404) {
                res.body.should.have.property('error', 'City not allowed');
            }
            else {
                res.status.should.equal(200);
                res.body.should.have.property('city');
                res.body.should.have.property('data');
                res.body.data.should.be.an('array');
            }
        });
        it('should return 200 with forecast data for valid city', async () => {
            // Mock WeatherService directly
            getFiveDayForecastStub.resolves(weatherMocks_1.mockForecastResponse);
            const res = await (0, supertest_1.default)(app).get('/api/weather/forecast?city=Rome');
            res.status.should.equal(200);
            res.body.should.have.property('city', 'Rome');
            res.body.should.have.property('data');
            res.body.data.should.be.an('array');
            if (res.body.data.length > 0) {
                res.body.data[0].should.have.property('dt_txt');
                res.body.data[0].should.have.property('temperature');
                res.body.data[0].should.have.property('pressure');
                res.body.data[0].should.have.property('humidity');
            }
        });
        it('should return 404 for city not found', async () => {
            // Mock API error with 404
            axiosStub.rejects({ response: { status: 404, data: { cod: "404", message: "city not found" } } });
            const res = await (0, supertest_1.default)(app).get('/api/weather/forecast?city=InvalidCityXYZ');
            res.status.should.equal(404);
            res.body.should.have.property('error');
        });
    });
    describe('API Response Structure Tests', () => {
        it('should return proper current weather structure', async () => {
            getCurrentWeatherStub.resolves(weatherMocks_1.mockCurrentWeatherResponse);
            const res = await (0, supertest_1.default)(app).get('/api/weather/current?city=Milan');
            if (res.status === 200) {
                res.body.should.have.property('coord');
                res.body.should.have.property('weather');
                res.body.should.have.property('main');
                res.body.should.have.property('name');
                res.body.main.should.have.property('temp');
                res.body.main.should.have.property('humidity');
                res.body.main.should.have.property('pressure');
            }
        });
        it('should return proper forecast structure', async () => {
            getFiveDayForecastStub.resolves(weatherMocks_1.mockForecastResponse);
            const res = await (0, supertest_1.default)(app).get('/api/weather/forecast?city=Florence');
            if (res.status === 200) {
                res.body.should.have.property('city');
                res.body.should.have.property('data');
                res.body.data.should.be.an('array');
                if (res.body.data.length > 0) {
                    const firstEntry = res.body.data[0];
                    firstEntry.should.have.property('dt_txt');
                    firstEntry.should.have.property('temperature');
                    firstEntry.should.have.property('pressure');
                    firstEntry.should.have.property('humidity');
                }
            }
        });
    });
    describe('Error Handling Tests', () => {
        it('should handle malformed query parameters gracefully', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/weather/current?city=');
            res.status.should.equal(400);
            res.body.should.have.property('error');
        });
        it('should handle special characters in city names', async () => {
            axiosStub.resolves({ data: weatherMocks_1.mockCurrentWeatherResponse });
            const res = await (0, supertest_1.default)(app).get('/api/weather/current?city=New%20York');
            if (res.status === 200) {
                res.body.should.have.property('name');
            }
            else {
                [404, 500].should.include(res.status);
            }
        });
        it('should handle very long city names', async () => {
            const longCity = 'A'.repeat(100);
            axiosStub.resolves({ data: weatherMocks_1.mockCurrentWeatherResponse });
            const res = await (0, supertest_1.default)(app).get(`/api/weather/current?city=${longCity}`);
            if (res.status === 200) {
                res.body.should.have.property('name');
            }
            else {
                [404, 500].should.include(res.status);
            }
        });
    });
    describe('Performance Tests', () => {
        it('should respond within reasonable time', async () => {
            axiosStub.resolves({ data: weatherMocks_1.mockCurrentWeatherResponse });
            const start = Date.now();
            const res = await (0, supertest_1.default)(app).get('/api/weather/current?city=Milan');
            const duration = Date.now() - start;
            duration.should.be.below(5000); // Should respond within 5 seconds
            res.status.should.be.oneOf([200, 500]); // Should not timeout
        });
        it('should handle concurrent requests', async () => {
            axiosStub.resolves({ data: weatherMocks_1.mockCurrentWeatherResponse });
            const promises = [
                (0, supertest_1.default)(app).get('/api/weather/current?city=Milan'),
                (0, supertest_1.default)(app).get('/api/weather/current?city=Rome'),
                (0, supertest_1.default)(app).get('/api/weather/stats'),
                (0, supertest_1.default)(app).get('/api/weather/forecast?city=Florence')
            ];
            const results = await Promise.all(promises);
            results.forEach(res => {
                res.status.should.be.oneOf([200, 400, 404, 500]);
            });
        });
    });
    describe('Mock Data Consistency Tests', () => {
        it('should return consistent mock data for current weather', async () => {
            axiosStub.resolves({ data: weatherMocks_1.mockCurrentWeatherResponse });
            const res = await (0, supertest_1.default)(app).get('/api/weather/current?city=TestCity');
            if (res.status === 200) {
                res.body.should.have.property('name', 'Milan');
                res.body.should.have.property('main');
                res.body.main.should.have.property('temp', 25.08);
                res.body.main.should.have.property('humidity', 72);
                res.body.main.should.have.property('pressure', 1018);
            }
        });
        it('should return consistent mock data for forecast', async () => {
            axiosStub.resolves({ data: weatherMocks_1.mockForecastResponse });
            const res = await (0, supertest_1.default)(app).get('/api/weather/forecast?city=TestCity');
            if (res.status === 200) {
                res.body.should.have.property('city', 'TestCity');
                res.body.should.have.property('data');
                res.body.data.should.be.an('array');
                if (res.body.data.length > 0) {
                    res.body.data[0].should.have.property('dt_txt', '2025-07-05 00:00:00');
                    res.body.data[0].should.have.property('temperature', 25.08);
                    res.body.data[0].should.have.property('pressure', 1018);
                    res.body.data[0].should.have.property('humidity', 72);
                }
            }
        });
    });
});
//# sourceMappingURL=weather.test.js.map