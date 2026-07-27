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

module.exports = {
  getWeatherByCity,
  getWeatherIconUrl,
};

