import { mockCurrentWeatherResponse, mockForecastResponse, mockStatsResponse } from './weatherMocks';

export class WeatherServiceMock {
  static async getCurrentWeather(city: string): Promise<any> {
    // Simulate different responses based on city
    if (city === 'InvalidCityXYZ') {
      throw new Error('City not found');
    }
    
    // Return mock data with city name
    return {
      ...mockCurrentWeatherResponse,
      name: city
    };
  }

  static async getStats(cities: string[]): Promise<any> {
    // Simulate stats calculation
    if (cities.length === 0) {
      throw new Error('No cities provided');
    }
    
    return mockStatsResponse;
  }

  static async getFiveDayForecast(city: string): Promise<any> {
    // Simulate forecast response
    if (city === 'InvalidCityXYZ') {
      throw new Error('City not found');
    }
    
    return {
      city,
      data: mockForecastResponse.data
    };
  }
} 