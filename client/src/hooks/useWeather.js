import { useState, useCallback } from 'react';
import { weatherAPI, historyAPI } from '../services/api';

/**
 * Custom hook for weather data fetching
 * Manages loading, error, and data states
 */
const useWeather = () => {
  const [weather, setWeather] = useState(null);
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
      const res = await weatherAPI.getWeather(city.trim());
      const weatherData = res.data.data;
      setWeather(weatherData);

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
    setError(null);
  }, []);

  return {
    weather,
    loading,
    error,
    searchWeather,
    clearWeather,
    setError,
  };
};

export default useWeather;

