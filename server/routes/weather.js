const express = require('express');
const router = express.Router();
const {
  getWeather,
  getForecast,
  getAirQuality,
  getAlerts,
} = require('../controllers/weatherController');

/**
 * @route   GET /api/weather?city=cityname
 * @desc    Get current weather for a city
 * @access  Public
 */
router.get('/', getWeather);

/**
 * @route   GET /api/weather/forecast?city=cityname
 * @desc    Get hourly + daily forecast for a city
 * @access  Public
 */
router.get('/forecast', getForecast);

/**
 * @route   GET /api/weather/air-quality?city=cityname
 * @desc    Get air quality for a city
 * @access  Public
 */
router.get('/air-quality', getAirQuality);

/**
 * @route   GET /api/weather/alerts?city=cityname
 * @desc    Get smart weather alerts for a city
 * @access  Public
 */
router.get('/alerts', getAlerts);

module.exports = router;

