const mongoose = require('mongoose');

const FavouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide a city name'],
      trim: true,
    },
    country: {
      type: String,
      default: '',
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can't add the same city twice
FavouriteSchema.index({ user: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('Favourite', FavouriteSchema);

