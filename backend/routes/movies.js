const express = require('express');
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getFeaturedMovies,
  getTrendingMovies,
  searchMovies
} = require('../controllers/movieController');
const { validateMovie, validateMovieQuery, validateObjectId } = require('../middleware/validation');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/movies
// @desc    Get all movies with filtering and pagination
// @access  Public
router.get('/', validateMovieQuery, optionalAuth, getAllMovies);

// @route   GET /api/movies/featured
// @desc    Get featured movies
// @access  Public
router.get('/featured', getFeaturedMovies);

// @route   GET /api/movies/trending
// @desc    Get trending movies
// @access  Public
router.get('/trending', getTrendingMovies);

// @route   GET /api/movies/search
// @desc    Search movies
// @access  Public
router.get('/search', searchMovies);

// @route   GET /api/movies/:id
// @desc    Get movie by ID with reviews
// @access  Public
router.get('/:id', validateObjectId('id'), optionalAuth, getMovieById);

// @route   POST /api/movies
// @desc    Create a new movie
// @access  Private (Admin only)
router.post('/', auth, adminAuth, validateMovie, createMovie);

// @route   PUT /api/movies/:id
// @desc    Update a movie
// @access  Private (Admin only)
router.put('/:id', auth, adminAuth, validateObjectId('id'), validateMovie, updateMovie);

// @route   DELETE /api/movies/:id
// @desc    Delete a movie
// @access  Private (Admin only)
router.delete('/:id', auth, adminAuth, validateObjectId('id'), deleteMovie);

module.exports = router;
