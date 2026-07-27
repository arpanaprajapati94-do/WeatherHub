const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController');

/**
 * @route   GET /api/weather?city=cityname
 * @desc    Get current weather for a city
 * @access  Public
 */
router.get('/', getWeather);

module.exports = router;