const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  genre: [{
    type: String,
    required: true,
    enum: [
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History',
      'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi',
      'Sport', 'Thriller', 'War', 'Western'
    ]
  }],
  releaseYear: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1888, 'Release year must be after 1888'],
    max: [new Date().getFullYear() + 5, 'Release year cannot be more than 5 years in the future']
  },
  director: {
    type: String,
    required: [true, 'Director is required'],
    trim: true,
    maxlength: [100, 'Director name cannot exceed 100 characters']
  },
  cast: [{
    type: String,
    trim: true,
    maxlength: [100, 'Cast member name cannot exceed 100 characters']
  }],
  synopsis: {
    type: String,
    required: [true, 'Synopsis is required'],
    maxlength: [2000, 'Synopsis cannot exceed 2000 characters']
  },
  posterUrl: {
    type: String,
    required: [true, 'Poster URL is required'],
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i, 'Please provide a valid image URL']
  },
  trailerUrl: {
    type: String,
    match: [/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/, 'Please provide a valid YouTube URL']
  },
  duration: {
    type: Number, // in minutes
    min: [1, 'Duration must be at least 1 minute'],
    max: [600, 'Duration cannot exceed 600 minutes']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search functionality
movieSchema.index({ title: 'text', synopsis: 'text', director: 'text', cast: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseYear: 1 });
movieSchema.index({ averageRating: -1 });
movieSchema.index({ featured: 1 });
movieSchema.index({ trending: 1 });

// Calculate average rating
movieSchema.methods.calculateAverageRating = async function() {
  const Review = mongoose.model('Review');
  const result = await Review.aggregate([
    { $match: { movieId: this._id } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, totalRatings: { $sum: 1 } } }
  ]);
  
  if (result.length > 0) {
    this.averageRating = Math.round(result[0].averageRating * 10) / 10;
    this.totalRatings = result[0].totalRatings;
  } else {
    this.averageRating = 0;
    this.totalRatings = 0;
  }
  
  await this.save();
  return this.averageRating;
};

module.exports = mongoose.model('Movie', movieSchema);
