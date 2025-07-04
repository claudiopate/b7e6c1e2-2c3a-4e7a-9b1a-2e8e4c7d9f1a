"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherServiceMock = void 0;
const weatherMocks_1 = require("./weatherMocks");
class WeatherServiceMock {
    static async getCurrentWeather(city) {
        // Simulate different responses based on city
        if (city === 'InvalidCityXYZ') {
            throw new Error('City not found');
        }
        // Return mock data with city name
        return {
            ...weatherMocks_1.mockCurrentWeatherResponse,
            name: city
        };
    }
    static async getStats(cities) {
        // Simulate stats calculation
        if (cities.length === 0) {
            throw new Error('No cities provided');
        }
        return weatherMocks_1.mockStatsResponse;
    }
    static async getFiveDayForecast(city) {
        // Simulate forecast response
        if (city === 'InvalidCityXYZ') {
            throw new Error('City not found');
        }
        return {
            city,
            data: weatherMocks_1.mockForecastResponse.data
        };
    }
}
exports.WeatherServiceMock = WeatherServiceMock;
//# sourceMappingURL=WeatherServiceMock.js.map