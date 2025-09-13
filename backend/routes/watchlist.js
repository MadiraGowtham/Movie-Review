const express = require('express');
const {
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus
} = require('../controllers/userController');
const { validateObjectId } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/watchlist/:id
// @desc    Get user's watchlist
// @access  Private
router.get('/:id', auth, validateObjectId('id'), getUserWatchlist);

// @route   POST /api/watchlist
// @desc    Add movie to watchlist
// @access  Private
router.post('/', auth, addToWatchlist);

// @route   DELETE /api/watchlist/:movieId
// @desc    Remove movie from watchlist
// @access  Private
router.delete('/:movieId', auth, validateObjectId('movieId'), removeFromWatchlist);

// @route   GET /api/watchlist/check/:movieId
// @desc    Check if movie is in user's watchlist
// @access  Private
router.get('/check/:movieId', auth, validateObjectId('movieId'), checkWatchlistStatus);

module.exports = router;
