import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

export default class WeatherService {
  static async getCurrentWeather(city: string): Promise<any> {
    if (!API_KEY) throw new Error('Missing OpenWeather API key');
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('City not found');
      }
      throw new Error('External service error');
    }
  }

  static async getStats(cities: string[]): Promise<any> {
    if (!API_KEY) throw new Error('Missing OpenWeather API key');
    try {
      
      const weatherData = await Promise.all(
        cities.map(city => this.getCurrentWeather(city))
      );

      
      const temperatures = weatherData.map(data => data.main.temp);
      const humidities = weatherData.map(data => data.main.humidity);
      const avgTemperature = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
      const maxTempIndex = temperatures.indexOf(Math.max(...temperatures));
      const maxHumidityIndex = humidities.indexOf(Math.max(...humidities));

      return {
        avgTemperature: Math.round(avgTemperature * 100) / 100,
        maxTemperature: {
          city: cities[maxTempIndex],
          value: Math.round(temperatures[maxTempIndex] * 100) / 100
        },
        maxHumidity: {
          city: cities[maxHumidityIndex],
          value: humidities[maxHumidityIndex]
        }
      };
    } catch (error: any) {
      if (error.message === 'City not found') {
        throw error;
      }
      throw new Error('External service error');
    }
  }

  static async getFiveDayForecast(city: string): Promise<any> {
    if (!API_KEY) throw new Error('Missing OpenWeather API key');
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });

      return {
        city,
        data: response.data.list.map((entry: any) => ({
          dt_txt: entry.dt_txt,
          temperature: entry.main.temp,
          pressure: entry.main.pressure,
          humidity: entry.main.humidity,
        }))
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('City not found');
      }
      throw new Error('External service error');
    }
  }
} 