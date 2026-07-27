const express = require('express');
const router = express.Router();
const {
  getFavourites,
  addFavourite,
  removeFavourite,
} = require('../controllers/favouriteController');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/favourites
 * @desc    Get all favourite cities
 * @access  Private
 */
router.get('/', protect, getFavourites);

/**
 * @route   POST /api/favourites
 * @desc    Add a city to favourites
 * @access  Private
 */
router.post('/', protect, addFavourite);

/**
 * @route   DELETE /api/favourites/:id
 * @desc    Remove a city from favourites
 * @access  Private
 */
router.delete('/:id', protect, removeFavourite);

module.exports = router;

