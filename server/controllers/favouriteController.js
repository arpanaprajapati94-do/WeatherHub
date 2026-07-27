const Favourite = require('../models/Favourite');

/**
 * @desc    Get all favourite cities for logged-in user
 * @route   GET /api/favourites
 * @access  Private
 */
const getFavourites = async (req, res, next) => {
  try {
    const favourites = await Favourite.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: favourites.length,
      data: favourites,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a city to favourites
 * @route   POST /api/favourites
 * @access  Private
 */
const addFavourite = async (req, res, next) => {
  try {
    const { city, country, latitude, longitude } = req.body;

    if (!city || city.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name.',
      });
    }

    // Check if already favourited (handled by unique index, but better UX with custom message)
    const existing = await Favourite.findOne({
      user: req.user.id,
      city: { $regex: new RegExp('^' + city.trim() + '$', 'i') },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `${city} is already in your favourites.`,
      });
    }

    const favourite = await Favourite.create({
      user: req.user.id,
      city: city.trim(),
      country: country || '',
      latitude: latitude || undefined,
      longitude: longitude || undefined,
    });

    res.status(201).json({
      success: true,
      message: `${favourite.city} added to favourites!`,
      data: favourite,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This city is already in your favourites.',
      });
    }
    next(error);
  }
};

/**
 * @desc    Remove a city from favourites
 * @route   DELETE /api/favourites/:id
 * @access  Private
 */
const removeFavourite = async (req, res, next) => {
  try {
    const favourite = await Favourite.findById(req.params.id);

    if (!favourite) {
      return res.status(404).json({
        success: false,
        message: 'Favourite city not found.',
      });
    }

    // Ensure the favourite belongs to the logged-in user
    if (favourite.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove this favourite.',
      });
    }

    await favourite.deleteOne();

    res.status(200).json({
      success: true,
      message: `${favourite.city} removed from favourites.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavourites,
  addFavourite,
  removeFavourite,
};

