const { getWeatherByCity } = require('../utils/weatherApi');

/**
 * @desc    Get current weather for a city
 * @route   GET /api/weather?city=cityname
 * @access  Private
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
    // Pass error to global handler
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

module.exports = {
  getWeather,
};

