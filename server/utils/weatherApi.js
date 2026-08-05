const axios = require('axios');

/**
 * Weather API utility functions
 * Uses OpenWeatherMap API (free tier)
 * Docs: https://openweathermap.org/current
 */

// Base URL for OpenWeatherMap API
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get current weather data for a city
 * @param {string} city - City name
 * @returns {object} - Formatted weather data
 */
const getWeatherByCity = async (city) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      // Return mock data for development/demo when no API key is set
      return getMockWeatherData(city);
    }

    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric', // Celsius
      },
    });

    return formatWeatherResponse(response.data);
  } catch (error) {
    // Handle API errors gracefully
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error('City not found. Please check the city name and try again.');
      }
      if (status === 401) {
        throw new Error('Invalid API key. Please configure a valid Weather API key.');
      }
      if (status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
    }
    console.error('Weather API error:', error.message);
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
};

/**
 * Format the raw API response into a clean structure
 */
const formatWeatherResponse = (data) => {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    main: data.weather[0].main,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    clouds: data.clouds.all,
    visibility: data.visibility,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
    coordinates: {
      lat: data.coord.lat,
      lon: data.coord.lon,
    },
  };
};

/**
 * Mock weather data for development/demo mode
 * This allows the app to run without a real API key
 */
const getMockWeatherData = (city) => {
  const mockCities = {
    london: {
      city: 'London',
      country: 'GB',
      temperature: 15,
      feelsLike: 13,
      tempMin: 12,
      tempMax: 18,
      humidity: 72,
      pressure: 1012,
      description: 'scattered clouds',
      icon: '03d',
      main: 'Clouds',
      windSpeed: 4.5,
      windDeg: 220,
      clouds: 40,
      visibility: 10000,
      sunrise: Math.floor(Date.now() / 1000) - 21600,
      sunset: Math.floor(Date.now() / 1000) + 21600,
      timezone: 0,
      coordinates: { lat: 51.5074, lon: -0.1278 },
    },
    'new york': {
      city: 'New York',
      country: 'US',
      temperature: 22,
      feelsLike: 21,
      tempMin: 19,
      tempMax: 25,
      humidity: 60,
      pressure: 1015,
      description: 'clear sky',
      icon: '01d',
      main: 'Clear',
      windSpeed: 3.2,
      windDeg: 180,
      clouds: 5,
      visibility: 10000,
      sunrise: Math.floor(Date.now() / 1000) - 19800,
      sunset: Math.floor(Date.now() / 1000) + 23400,
      timezone: -18000,
      coordinates: { lat: 40.7128, lon: -74.006 },
    },
    tokyo: {
      city: 'Tokyo',
      country: 'JP',
      temperature: 28,
      feelsLike: 30,
      tempMin: 26,
      tempMax: 31,
      humidity: 80,
      pressure: 1008,
      description: 'light rain',
      icon: '10d',
      main: 'Rain',
      windSpeed: 5.1,
      windDeg: 150,
      clouds: 75,
      visibility: 8000,
      sunrise: Math.floor(Date.now() / 1000) - 32400,
      sunset: Math.floor(Date.now() / 1000) + 10800,
      timezone: 32400,
      coordinates: { lat: 35.6762, lon: 139.6503 },
    },
    paris: {
      city: 'Paris',
      country: 'FR',
      temperature: 18,
      feelsLike: 17,
      tempMin: 15,
      tempMax: 21,
      humidity: 68,
      pressure: 1013,
      description: 'few clouds',
      icon: '02d',
      main: 'Clouds',
      windSpeed: 3.8,
      windDeg: 240,
      clouds: 20,
      visibility: 10000,
      sunrise: Math.floor(Date.now() / 1000) - 7200,
      sunset: Math.floor(Date.now() / 1000) + 18000,
      timezone: 3600,
      coordinates: { lat: 48.8566, lon: 2.3522 },
    },
    dubai: {
      city: 'Dubai',
      country: 'AE',
      temperature: 35,
      feelsLike: 38,
      tempMin: 32,
      tempMax: 38,
      humidity: 45,
      pressure: 1005,
      description: 'haze',
      icon: '50d',
      main: 'Haze',
      windSpeed: 2.5,
      windDeg: 310,
      clouds: 10,
      visibility: 6000,
      sunrise: Math.floor(Date.now() / 1000) - 14400,
      sunset: Math.floor(Date.now() / 1000) + 10800,
      timezone: 14400,
      coordinates: { lat: 25.2048, lon: 55.2708 },
    },
  };

  // Normalize city name for lookup
  const normalizedCity = city.toLowerCase().trim();

  // Return mock data for known cities, or generate generic mock data
  if (mockCities[normalizedCity]) {
    return mockCities[normalizedCity];
  }

  // Generic mock data for any city
  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: '--',
    temperature: 20,
    feelsLike: 19,
    tempMin: 17,
    tempMax: 23,
    humidity: 65,
    pressure: 1013,
    description: 'clear sky',
    icon: '01d',
    main: 'Clear',
    windSpeed: 3.0,
    windDeg: 180,
    clouds: 0,
    visibility: 10000,
    sunrise: Math.floor(Date.now() / 1000) - 21600,
    sunset: Math.floor(Date.now() / 1000) + 21600,
    timezone: 0,
    coordinates: { lat: 0, lon: 0 },
  };
};

/**
 * Get weather icon URL from OpenWeatherMap
 * @param {string} iconCode - Icon code from API
 * @returns {string} - Full icon URL
 */
const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Get 5-day / 3-hour forecast for a city
 * @param {string} city - City name
 * @returns {object} - Formatted forecast data (hourly + daily)
 */
const getForecastByCity = async (city) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      return getMockForecast(city);
    }

    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
        cnt: 40, // 5 days × 8 (3-hourly)
      },
    });

    return formatForecastResponse(response.data);
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error('City not found. Please check the city name and try again.');
      }
      if (status === 401) {
        throw new Error('Invalid API key. Please configure a valid Weather API key.');
      }
      if (status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
    }
    console.error('Forecast API error:', error.message);
    throw new Error('Failed to fetch forecast data. Please try again later.');
  }
};

/**
 * Format the raw forecast API response into a clean structure
 */
const formatForecastResponse = (data) => {
  const cityName = data.city?.name || 'Unknown';
  const timezone = data.city?.timezone || 0;

  // Group 3-hourly entries into daily buckets
  const dailyMap = new Map();

  const hourly = data.list.map((item) => ({
    dt: item.dt,
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    }),
    date: new Date(item.dt * 1000).toISOString().split('T')[0],
    temperature: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    pressure: item.main.pressure,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    main: item.weather[0].main,
    windSpeed: item.wind.speed,
    windDeg: item.wind.deg,
    clouds: item.clouds?.all ?? 0,
    visibility: item.visibility,
    pop: item.pop ?? 0, // Probability of precipitation
  }));

  hourly.forEach((h) => {
    if (!dailyMap.has(h.date)) {
      dailyMap.set(h.date, []);
    }
    dailyMap.get(h.date).push(h);
  });

  const daily = [];
  for (const [date, entries] of dailyMap) {
    const temps = entries.map((e) => e.temperature);
    daily.push({
      date,
      weekday: new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
        weekday: 'short',
        timeZone: 'UTC',
      }),
      tempMin: Math.min(...temps),
      tempMax: Math.max(...temps),
      humidity: Math.round(entries.reduce((a, e) => a + e.humidity, 0) / entries.length),
      description: entries[Math.floor(entries.length / 2)].description,
      icon: entries[Math.floor(entries.length / 2)].icon,
      main: entries[Math.floor(entries.length / 2)].main,
      windSpeed: Math.round(entries.reduce((a, e) => a + e.windSpeed, 0) / entries.length * 10) / 10,
      pop: Math.round(Math.max(...entries.map((e) => e.pop)) * 100),
    });
  }

  return {
    city: cityName,
    country: data.city?.country || '',
    timezone,
    hourly,
    daily,
  };
};

/**
 * Get air quality data for a city (requires coordinates)
 * @param {object} coordinates - { lat, lon }
 * @returns {object} - Formatted AQI data
 */
const getAirQualityByCoords = async (lat, lon) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      return getMockAirQuality(lat, lon);
    }

    const response = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: apiKey,
      },
    });

    return formatAirQualityResponse(response.data);
  } catch (error) {
    console.error('Air Quality API error:', error.message);
    // Fall back to mock data rather than failing the request
    return getMockAirQuality(lat, lon);
  }
};

/**
 * Format the raw air pollution API response
 */
const formatAirQualityResponse = (data) => {
  const [item] = data.list || [];
  if (!item) throw new Error('No air quality data available');

  const components = item.components || {};
  const aqiValue = item.main?.aqi || 1;

  const aqiLevels = [
    { level: 1, label: 'Good', color: 'green', recommendation: 'Air quality is satisfactory. Enjoy your usual outdoor activities.' },
    { level: 2, label: 'Fair', color: 'yellow', recommendation: 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.' },
    { level: 3, label: 'Moderate', color: 'orange', recommendation: 'Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.' },
    { level: 4, label: 'Poor', color: 'red', recommendation: 'Everyone may begin to experience health effects. Sensitive groups should avoid outdoor exertion.' },
    { level: 5, label: 'Very Poor', color: 'purple', recommendation: 'Health alert: everyone may experience more serious health effects. Avoid outdoor activities.' },
  ];

  const aqiInfo = aqiLevels.find((a) => a.level === aqiValue) || aqiLevels[0];

  return {
    aqi: aqiValue,
    level: aqiInfo.label,
    color: aqiInfo.color,
    recommendation: aqiInfo.recommendation,
    components: {
      pm25: components.pm2_5 ?? 0,
      pm10: components.pm10 ?? 0,
      o3: components.o3 ?? 0,
      no2: components.no2 ?? 0,
      so2: components.so2 ?? 0,
      co: components.co ?? 0,
    },
    timestamp: Date.now(),
  };
};

/**
 * Mock forecast data for demo mode
 */
const getMockForecast = (city) => {
  const seed = city.toLowerCase().trim();
  let seedNum = 0;
  for (let i = 0; i < seed.length; i++) seedNum += seed.charCodeAt(i);
  // Incrementing counter seeded deterministically per city (closure-safe).
  let i = 0;
  const rand = (n) => ((seedNum * 9301 + 49297 * (i = i + 1)) % 233280) / 233280 * n;

  const baseTemp = 18 + (seedNum % 20); // 18-38°C
  const icons = ['01d', '02d', '03d', '10d', '13d'];
  const mains = ['Clear', 'Clouds', 'Clouds', 'Rain', 'Snow'];
  const descs = ['clear sky', 'few clouds', 'scattered clouds', 'light rain', 'snow'];

  const now = new Date();
  const hourly = [];
  const daily = [];
  const seenDays = new Set();

  for (let h = 0; h < 24; h++) {
    const dt = Math.floor(now.getTime() / 1000) + h * 3600;
    const dateObj = new Date(dt * 1000);
    const date = dateObj.toISOString().split('T')[0];
    const idx = Math.floor(rand(5));

    hourly.push({
      dt,
      time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date,
      temperature: Math.round(baseTemp + Math.sin(h / 24 * Math.PI * 2) * 5 + rand(3)),
      feelsLike: 0,
      humidity: Math.round(50 + rand(35)),
      pressure: 1010 + Math.round(rand(8)),
      description: descs[idx],
      icon: icons[idx],
      main: mains[idx],
      windSpeed: Math.round((3 + rand(8)) * 10) / 10,
      windDeg: Math.round(rand(360)),
      clouds: Math.round(rand(100)),
      visibility: 8000 + Math.round(rand(2000)),
      pop: Math.round(rand(60)),
    });

    if (!seenDays.has(date) && daily.length < 7) {
      seenDays.add(date);
      daily.push({
        date,
        weekday: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        tempMin: Math.round(baseTemp + rand(3) - 4),
        tempMax: Math.round(baseTemp + rand(5) + 4),
        humidity: Math.round(50 + rand(35)),
        description: descs[idx],
        icon: icons[idx],
        main: mains[idx],
        windSpeed: Math.round((3 + rand(8)) * 10) / 10,
        pop: Math.round(rand(60)),
      });
    }
  }

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: '--',
    timezone: 0,
    hourly,
    daily,
  };
};

/**
 * Mock air quality data for demo mode
 */
const getMockAirQuality = (lat, lon) => {
  const seed = Math.round((Math.abs(lat) * 10 + Math.abs(lon)) * 100);
  const rand = (n) => ((seed * 9301 + 49297) % 233280) / 233280 * n;

  const aqiLevels = [
    { level: 1, label: 'Good', color: 'green', recommendation: 'Air quality is satisfactory. Enjoy your usual outdoor activities.' },
    { level: 2, label: 'Fair', color: 'yellow', recommendation: 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.' },
    { level: 3, label: 'Moderate', color: 'orange', recommendation: 'Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.' },
    { level: 4, label: 'Poor', color: 'red', recommendation: 'Everyone may begin to experience health effects. Sensitive groups should avoid outdoor exertion.' },
    { level: 5, label: 'Very Poor', color: 'purple', recommendation: 'Health alert: everyone may experience more serious health effects. Avoid outdoor activities.' },
  ];

  const aqiValue = 1 + Math.floor(rand(5));
  const aqiInfo = aqiLevels[aqiValue - 1];

  return {
    aqi: aqiValue,
    level: aqiInfo.label,
    color: aqiInfo.color,
    recommendation: aqiInfo.recommendation,
    components: {
      pm25: Math.round(rand(120) * 10) / 10,
      pm10: Math.round(rand(200) * 10) / 10,
      o3: Math.round(rand(150) * 10) / 10,
      no2: Math.round(rand(80) * 10) / 10,
      so2: Math.round(rand(60) * 10) / 10,
      co: Math.round(rand(1.5) * 100) / 100,
    },
    timestamp: Date.now(),
  };
};

/**
 * Generate smart weather alerts based on current weather conditions
 * @param {object} weather - Current weather data from getWeatherByCity
 * @returns {array} - Array of alert objects
 */
const getWeatherAlerts = (weather) => {
  const alerts = [];
  if (!weather) return alerts;

  const { main, temperature, windSpeed, humidity, description } = weather;
  const condition = (main || '').toLowerCase();
  const desc = (description || '').toLowerCase();

  // Thunderstorm alerts
  if (condition === 'thunderstorm' || desc.includes('thunder')) {
    alerts.push({
      type: 'warning',
      severity: 'high',
      title: 'Thunderstorm Warning',
      message: 'Lightning and thunder expected. Stay indoors and avoid open areas, tall trees, and water bodies.',
      icon: '⛈️',
    });
  }

  // Heavy rain alerts
  if ((condition === 'rain' || condition === 'drizzle') && (desc.includes('heavy') || desc.includes('extreme'))) {
    alerts.push({
      type: 'warning',
      severity: 'moderate',
      title: 'Heavy Rain Alert',
      message: 'Heavy rainfall expected. Avoid flooded areas and drive with caution. Carry an umbrella.',
      icon: '🌧️',
    });
  }

  // Heatwave alerts
  if (temperature >= 40) {
    alerts.push({
      type: 'warning',
      severity: 'high',
      title: 'Extreme Heat Warning',
      message: `Temperature is ${temperature}°C. Stay hydrated, avoid direct sunlight, and limit strenuous outdoor activities.`,
      icon: '🥵',
    });
  } else if (temperature >= 35) {
    alerts.push({
      type: 'info',
      severity: 'moderate',
      title: 'High Temperature Alert',
      message: `Temperature is ${temperature}°C. Keep cool, drink plenty of water, and use sun protection.`,
      icon: '☀️',
    });
  }

  // High wind alerts
  if (windSpeed >= 20) {
    alerts.push({
      type: 'warning',
      severity: 'high',
      title: 'High Wind Warning',
      message: `Wind speed is ${windSpeed} m/s. Secure loose objects and take care when driving high-sided vehicles.`,
      icon: '💨',
    });
  } else if (windSpeed >= 12) {
    alerts.push({
      type: 'info',
      severity: 'moderate',
      title: 'Windy Conditions',
      message: `Wind speed is ${windSpeed} m/s. A light jacket and caution near trees are recommended.`,
      icon: '🌬️',
    });
  }

  // Extreme cold
  if (temperature <= 0) {
    alerts.push({
      type: 'warning',
      severity: 'high',
      title: 'Freezing Temperatures',
      message: `Temperature is ${temperature}°C. Dress in layers, protect extremities, and watch for icy surfaces.`,
      icon: '🥶',
    });
  }

  // High humidity
  if (humidity >= 85 && temperature >= 25) {
    alerts.push({
      type: 'info',
      severity: 'low',
      title: 'High Humidity',
      message: `Humidity is ${humidity}% with warm temperatures. It may feel hotter than it is — stay hydrated.`,
      icon: '💧',
    });
  }

  return alerts;
};

module.exports = {
  getWeatherByCity,
  getForecastByCity,
  getAirQualityByCoords,
  getWeatherAlerts,
  getWeatherIconUrl,
};

