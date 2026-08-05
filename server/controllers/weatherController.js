const {
  getWeatherByCity,
  getForecastByCity,
  getAirQualityByCoords,
  getWeatherAlerts,
} = require('../utils/weatherApi');

/**
 * @desc    Get current weather for a city
 * @route   GET /api/weather?city=cityname
 * @access  Public
 */
const getWeather = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city || city.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name.',
      });
    }

    // Fetch weather data
    const weatherData = await getWeatherByCity(city.trim());

    res.status(200).json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    if (
      error.message.includes('not found') ||
      error.message.includes('API key') ||
      error.message.includes('rate limit')
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Get hourly + daily forecast for a city
 * @route   GET /api/weather/forecast?city=cityname
 * @access  Public
 */
const getForecast = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city || city.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name.',
      });
    }

    const forecastData = await getForecastByCity(city.trim());

    res.status(200).json({
      success: true,
      data: forecastData,
    });
  } catch (error) {
    if (
      error.message.includes('not found') ||
      error.message.includes('API key') ||
      error.message.includes('rate limit')
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Get air quality for a city
 * @route   GET /api/weather/air-quality?city=cityname
 * @access  Public
 */
const getAirQuality = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city || city.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name.',
      });
    }

    // First get the city's coordinates
    const weatherData = await getWeatherByCity(city.trim());
    const { lat, lon } = weatherData.coordinates || { lat: 0, lon: 0 };

    // If coordinates are 0,0 (generic mock), derive mock AQI
    const aqiData = await getAirQualityByCoords(lat, lon);

    res.status(200).json({
      success: true,
      data: {
        city: weatherData.city,
        country: weatherData.country,
        ...aqiData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get smart weather alerts for a city
 * @route   GET /api/weather/alerts?city=cityname
 * @access  Public
 */
const getAlerts = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city || city.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name.',
      });
    }

    const weatherData = await getWeatherByCity(city.trim());
    const alerts = getWeatherAlerts(weatherData);

    res.status(200).json({
      success: true,
      data: {
        city: weatherData.city,
        country: weatherData.country,
        alerts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeather,
  getForecast,
  getAirQuality,
  getAlerts,
};

