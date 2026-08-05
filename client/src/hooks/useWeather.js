import { useState, useCallback } from 'react';
import { weatherAPI, historyAPI } from '../services/api';

/**
 * Custom hook for weather data fetching
 * Manages loading, error, and data states
 */
const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Search weather by city name
   * @param {string} city - City name to search
   */
  const searchWeather = useCallback(async (city) => {
    if (!city || city.trim() === '') {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cityName = city.trim();

      // Fetch current weather first (critical path)
      const res = await weatherAPI.getWeather(cityName);
      const weatherData = res.data.data;
      setWeather(weatherData);

      // Fetch the rest in parallel, don't block the main weather display
      const cityForLookup = weatherData.city || cityName;

      try {
        const [forecastRes, aqiRes, alertsRes] = await Promise.allSettled([
          weatherAPI.getForecast(cityForLookup),
          weatherAPI.getAirQuality(cityForLookup),
          weatherAPI.getAlerts(cityForLookup),
        ]);

        if (forecastRes.status === 'fulfilled') {
          setForecast(forecastRes.value.data.data);
        } else {
          setForecast(null);
          console.warn('Failed to load forecast:', forecastRes.reason);
        }

        if (aqiRes.status === 'fulfilled') {
          setAirQuality(aqiRes.value.data.data);
        } else {
          setAirQuality(null);
          console.warn('Failed to load air quality:', aqiRes.reason);
        }

        if (alertsRes.status === 'fulfilled') {
          setAlerts(alertsRes.value.data.data);
        } else {
          setAlerts(null);
          console.warn('Failed to load alerts:', alertsRes.reason);
        }
      } catch (secondaryErr) {
        console.warn('Failed to load secondary weather data:', secondaryErr);
      }

      // Save to search history (fire-and-forget, don't block UI)
      try {
        await historyAPI.add({
          city: weatherData.city,
          country: weatherData.country,
          temperature: weatherData.temperature,
          weatherDescription: weatherData.description,
          weatherIcon: weatherData.icon,
        });
      } catch (historyErr) {
        // Silently fail - history saving is non-critical
        console.warn('Failed to save search history:', historyErr);
      }

      return weatherData;
    } catch (err) {
      const message = err.displayMessage || 'Failed to fetch weather data';
      setError(message);
      setWeather(null);
      setForecast(null);
      setAirQuality(null);
      setAlerts(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear weather data
   */
  const clearWeather = useCallback(() => {
    setWeather(null);
    setForecast(null);
    setAirQuality(null);
    setAlerts(null);
    setError(null);
  }, []);

  return {
    weather,
    forecast,
    airQuality,
    alerts,
    loading,
    error,
    searchWeather,
    clearWeather,
    setError,
  };
};

export default useWeather;

