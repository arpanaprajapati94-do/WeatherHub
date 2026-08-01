const SearchHistory = require('../models/SearchHistory');

/**
 * @desc    Get search history for logged-in user
 * @route   GET /api/history
 * @access  Private
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 searches

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save a search to history
 * @route   POST /api/history
 * @access  Private
 */
const addToHistory = async (req, res, next) => {
  try {
    const { city, country, temperature, weatherDescription, weatherIcon } = req.body;

    if (!city || city.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name.',
      });
    }

    const historyEntry = await SearchHistory.create({
      user: req.user.id,
      city: city.trim(),
      country: country || '',
      // Use ?? so a valid temperature of 0°C is preserved
      temperature: temperature ?? null,
      weatherDescription: weatherDescription || '',
      weatherIcon: weatherIcon || '',
    });

    res.status(201).json({
      success: true,
      data: historyEntry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all search history for logged-in user
 * @route   DELETE /api/history
 * @access  Private
 */
const clearHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Search history cleared successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a single history entry
 * @route   DELETE /api/history/:id
 * @access  Private
 */
const deleteHistoryEntry = async (req, res, next) => {
  try {
    const entry = await SearchHistory.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'History entry not found.',
      });
    }

    // Ensure the entry belongs to the logged-in user
    if (entry.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this entry.',
      });
    }

    await entry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'History entry deleted.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistory,
  addToHistory,
  clearHistory,
  deleteHistoryEntry,
};

