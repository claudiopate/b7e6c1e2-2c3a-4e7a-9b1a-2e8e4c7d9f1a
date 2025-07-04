# Weather API Service

A Node.js/TypeScript Express API service that provides weather data using the OpenWeather API. The service offers three endpoints for current weather, weather statistics, and 5-day forecasts.

## Features

- **Current Weather**: Get current weather data for predefined cities (Milan, Rome, Florence)
- **Weather Statistics**: Calculate average temperature, max humidity, and max temperature across cities
- **5-Day Forecast**: Get detailed forecast data including temperature, pressure, and humidity
- **Swagger Documentation**: Interactive API documentation at `/api-docs`
- **Docker Support**: Containerized application
- **TypeScript**: Full TypeScript implementation
- **Testing**: Mocha test suite with supertest

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenWeather API key (get one at [OpenWeather](https://openweathermap.org/api))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-api-service
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your OpenWeather API key to `.env`:
```
OPENWEATHER_API_KEY=your_api_key_here
PORT=3000
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t weather-api .
docker run -p 3000:3000 -e OPENWEATHER_API_KEY=your_key weather-api
```

## API Endpoints

### 1. Current Weather
**GET** `/api/weather/current?city={city}`

Get current weather for a specific city.

**Query Parameters:**
- `city` (required): City name (Milan, Rome, Florence)

**Response:**
- `200`: Current weather data from OpenWeather API
- `400`: Missing city parameter
- `404`: City not in allowed list
- `500`: External service error

**Example:**
```bash
curl "http://localhost:3000/api/weather/current?city=Milan"
```

### 2. Weather Statistics
**GET** `/api/weather/stats?city={city}`

Get weather statistics for cities.

**Query Parameters:**
- `city` (optional): Specific city name. If not provided, uses `ALLOWED_CITIES` environment variable.

**Logic:**
- If `city` parameter is provided: calculates stats for that single city
- If no `city` parameter and `ALLOWED_CITIES` is set: calculates stats for all allowed cities
- If no `city` parameter and no `ALLOWED_CITIES`: returns 400 error

**Response:**
```json
{
  "avgTemperature": 15.2,
  "maxHumidity": {
    "city": "Milan",
    "value": 85
  },
  "maxTemperature": {
    "city": "Rome", 
    "value": 22.1
  }
}
```

**Examples:**
```bash
# Single city stats
curl "http://localhost:3000/api/weather/stats?city=Milan"

# Stats for all allowed cities (if ALLOWED_CITIES is configured)
curl "http://localhost:3000/api/weather/stats"
```

### 3. 5-Day Forecast
**GET** `/api/weather/forecast?city={city}`

Get 5-day weather forecast for a specific city.

**Query Parameters:**
- `city` (required): City name (Milan, Rome, Florence)

**Response:**
```json
{
  "city": "Milan",
  "data": [
    {
      "dt_txt": "2024-01-15 12:00:00",
      "temperature": 18.5,
      "pressure": 1013,
      "humidity": 65
    }
  ]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/weather/forecast?city=Rome"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENWEATHER_API_KEY` | OpenWeather API key | Required |
| `PORT` | Server port | 3000 |
| `ALLOWED_CITIES` | Comma-separated list of allowed cities | Optional |

## Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- **Endpoint Logic**: Single city vs multiple cities stats
- **Parameter Validation**: Missing city parameter (400)
- **Authorization**: City not in allowed list (404)
- **API Responses**: Successful responses (200)
- **Error Handling**: External service errors (500)
- **Performance**: Response time and concurrent requests
- **Data Consistency**: Mock data validation

## API Logic

### City Authorization
The service supports two modes for city authorization:

1. **Strict Mode** (when `ALLOWED_CITIES` is set):
   - Only cities in the `ALLOWED_CITIES` environment variable are allowed
   - Requests for unauthorized cities return 404

2. **Open Mode** (when `ALLOWED_CITIES` is not set):
   - Any city can be requested
   - The service relies on OpenWeather API validation

### Stats Endpoint Logic
The `/api/weather/stats` endpoint has flexible behavior:

- **Single City**: `GET /api/weather/stats?city=Milan`
  - Returns stats for Milan only
  - City must be in `ALLOWED_CITIES` (if configured)

- **Multiple Cities**: `GET /api/weather/stats` (no city parameter)
  - Uses all cities from `ALLOWED_CITIES` environment variable
  - Returns 400 if `ALLOWED_CITIES` is not configured

## API Documentation

Visit `/api-docs` in your browser to see the interactive Swagger documentation.

## Project Structure

```
├── src/
│   ├── index.ts              # Main server entry point
│   ├── routes/
│   │   └── weather.ts        # API route handlers
│   ├── services/
│   │   └── WeatherService.ts # OpenWeather API client
│   └── swagger.json          # API documentation
├── test/
│   ├── weather.test.ts       # API endpoint tests
│   ├── helpers.ts            # Test utilities
│   └── mocha.opts            # Mocha configuration
├── Dockerfile                # Docker configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Start production server
- `npm test`: Run test suite

## Docker

Build the image:
```bash
docker build -t weather-api .
```

Run with environment variables:
```bash
docker run -p 3000:3000 \
  -e OPENWEATHER_API_KEY=your_key \
  -e PORT=3000 \
  weather-api
```

## Usage Examples

### Development Setup
```bash
# Install dependencies
npm install

# Set environment variables
export OPENWEATHER_API_KEY=your_api_key_here
export ALLOWED_CITIES=Milan,Rome,Florence

# Start development server
npm run dev
```

### Production Setup
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Setup
```bash
# Build image
docker build -t weather-api .

# Run with environment variables
docker run -p 3000:3000 \
  -e OPENWEATHER_API_KEY=your_api_key_here \
  -e ALLOWED_CITIES=Milan,Rome,Florence \
  weather-api
```

### API Examples

**Get current weather for Milan:**
```bash
curl "http://localhost:3000/api/weather/current?city=Milan"
```

**Get stats for Milan only:**
```bash
curl "http://localhost:3000/api/weather/stats?city=Milan"
```

**Get stats for all allowed cities:**
```bash
curl "http://localhost:3000/api/weather/stats"
```

**Get 5-day forecast for Rome:**
```bash
curl "http://localhost:3000/api/weather/forecast?city=Rome"
```

**View API documentation:**
```bash
open http://localhost:3000/api-docs
```

## Troubleshooting

### Common Issues

**1. "Missing OpenWeather API key" error**
- Ensure `OPENWEATHER_API_KEY` is set in your environment
- Verify the API key is valid at [OpenWeather](https://openweathermap.org/api)

**2. "City not found" error**
- Check if the city name is spelled correctly
- Ensure the city is in the `ALLOWED_CITIES` list (if configured)

**3. Docker container fails to start**
- Verify the Dockerfile builds successfully
- Check that all environment variables are passed correctly

**4. Tests fail**
- Ensure all dependencies are installed: `npm install`
- Run tests with: `npm test`

### Environment Variables Checklist

Before starting the service, ensure these are set:

```bash
# Required
OPENWEATHER_API_KEY=your_api_key_here

# Optional
PORT=3000
ALLOWED_CITIES=Milan,Rome,Florence
```

### Health Check

Test if the service is running:
```bash
curl "http://localhost:3000/api/weather/current?city=Milan"
```

Expected response: Weather data or appropriate error message.
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Successful request
- `400`: Bad request (missing parameters)
- `404`: Not found (invalid city)
- `500`: Internal server error (external API issues)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT 