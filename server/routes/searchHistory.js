const express = require('express');
const router = express.Router();
const {
  getHistory,
  addToHistory,
  clearHistory,
  deleteHistoryEntry,
} = require('../controllers/searchHistoryController');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/history
 * @desc    Get search history
 * @access  Private
 */
router.get('/', protect, getHistory);

/**
 * @route   POST /api/history
 * @desc    Save a search to history
 * @access  Private
 */
router.post('/', protect, addToHistory);

/**
 * @route   DELETE /api/history
 * @desc    Clear all search history
 * @access  Private
 */
router.delete('/', protect, clearHistory);

/**
 * @route   DELETE /api/history/:id
 * @desc    Delete a single history entry
 * @access  Private
 */
router.delete('/:id', protect, deleteHistoryEntry);

module.exports = router;

