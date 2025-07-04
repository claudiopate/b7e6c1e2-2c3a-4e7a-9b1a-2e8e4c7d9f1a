export const mockCurrentWeatherResponse = {
  coord: { lon: 9.1895, lat: 45.4643 },
  weather: [
    {
      id: 800,
      main: "Clear",
      description: "clear sky",
      icon: "01n"
    }
  ],
  base: "stations",
  main: {
    temp: 25.08,
    feels_like: 25.52,
    temp_min: 25.08,
    temp_max: 27.86,
    pressure: 1018,
    humidity: 72,
    sea_level: 1018,
    grnd_level: 1003
  },
  visibility: 10000,
  wind: {
    speed: 3.1,
    deg: 45,
    gust: 7.14
  },
  clouds: { all: 0 },
  dt: 1751663489,
  sys: {
    type: 2,
    id: 2093282,
    country: "IT",
    sunrise: 1751600416,
    sunset: 1751656482
  },
  timezone: 7200,
  id: 3173435,
  name: "Milan",
  cod: 200
};

export const mockForecastResponse = {
  city: "Rome",
  data: [
    {
      dt_txt: "2025-07-05 00:00:00",
      temperature: 25.08,
      pressure: 1018,
      humidity: 72
    },
    {
      dt_txt: "2025-07-05 03:00:00",
      temperature: 22.15,
      pressure: 1019,
      humidity: 78
    }
  ]
};

export const mockErrorResponse = {
  cod: "404",
  message: "city not found"
};

export const mockStatsResponse = {
  avgTemperature: 25.5,
  maxHumidity: {
    city: "Milan",
    value: 75
  },
  maxTemperature: {
    city: "Rome",
    value: 28.2
  }
}; 