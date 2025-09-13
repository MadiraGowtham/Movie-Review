const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1 star'],
    max: [5, 'Rating cannot exceed 5 stars']
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    maxlength: [2000, 'Review text cannot exceed 2000 characters'],
    trim: true
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure one review per user per movie
reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

// Index for movie reviews
reviewSchema.index({ movieId: 1, createdAt: -1 });

// Index for user reviews
reviewSchema.index({ userId: 1, createdAt: -1 });

// Update movie average rating when review is saved
reviewSchema.post('save', async function() {
  const Movie = mongoose.model('Movie');
  const movie = await Movie.findById(this.movieId);
  if (movie) {
    await movie.calculateAverageRating();
  }
});

// Update movie average rating when review is deleted
reviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  const Movie = mongoose.model('Movie');
  const movie = await Movie.findById(this.movieId);
  if (movie) {
    await movie.calculateAverageRating();
  }
});

module.exports = mongoose.model('Review', reviewSchema);
