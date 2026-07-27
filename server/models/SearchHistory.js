const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema(
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
    temperature: {
      type: Number,
    },
    weatherDescription: {
      type: String,
    },
    weatherIcon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying of user's history sorted by time
SearchHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);

