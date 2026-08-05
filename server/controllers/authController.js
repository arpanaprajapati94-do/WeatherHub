const User = require('../models/User');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Normalize inputs
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedName = (name || '').trim();

    console.log(`[AUTH] Register attempt received for email: ${normalizedEmail}`);

    // Validate required fields (Mongoose will also validate, but fail fast for better UX)
    if (!normalizedName || !normalizedEmail || !password) {
      console.log(`[AUTH] Register rejected: missing required fields (email=${normalizedEmail})`);
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log(`[AUTH] Register rejected: email already exists (${normalizedEmail})`);
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create new user
    const user = await User.create({ name: normalizedName, email: normalizedEmail, password });
    console.log(`[AUTH] User created successfully — ID: ${user._id}, email: ${normalizedEmail}`);

    // Generate token
    const token = user.generateToken();
    console.log(`[AUTH] JWT generated for user ID: ${user._id}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to WeatherHub.',
      data: {
        user: user.toProfileJSON(),
        token,
      },
    });
  } catch (error) {
    console.error(`[AUTH] Register error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Normalize email so "User@Example.com " matches a stored "user@example.com"
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Validate input
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate token
    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      data: {
        user: user.toProfileJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: user.toProfileJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: user.toProfileJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    // Set new password and save (triggers pre-save hook to hash)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/auth/me
 * @access  Private
 */
const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Delete user's favourites
    const Favourite = require('../models/Favourite');
    await Favourite.deleteMany({ user: req.user.id });

    // Delete user's search history
    const SearchHistory = require('../models/SearchHistory');
    await SearchHistory.deleteMany({ user: req.user.id });

    // Delete the user
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
};

