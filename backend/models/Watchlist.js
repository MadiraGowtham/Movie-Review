const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie ID is required']
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one entry per user per movie
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

// Index for user watchlist queries
watchlistSchema.index({ userId: 1, dateAdded: -1 });

module.exports = mongoose.model('Watchlist', watchlistSchema);
