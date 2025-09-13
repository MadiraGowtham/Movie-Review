const express = require('express');
const {
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  rateReview
} = require('../controllers/reviewController');
const { validateReview, validateObjectId } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/movie/:id
// @desc    Get reviews for a specific movie
// @access  Public
router.get('/movie/:id', validateObjectId('id'), getMovieReviews);

// @route   GET /api/reviews/user/:id
// @desc    Get reviews by a specific user
// @access  Public
router.get('/user/:id', validateObjectId('id'), getUserReviews);

// @route   POST /api/reviews/movie/:id
// @desc    Create a new review for a movie
// @access  Private
router.post('/movie/:id', auth, validateObjectId('id'), validateReview, createReview);

// @route   PUT /api/reviews/:reviewId
// @desc    Update a review
// @access  Private
router.put('/:reviewId', auth, validateObjectId('reviewId'), validateReview, updateReview);

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review
// @access  Private
router.delete('/:reviewId', auth, validateObjectId('reviewId'), deleteReview);

// @route   POST /api/reviews/:reviewId/rate
// @desc    Rate a review as helpful or not helpful
// @access  Private
router.post('/:reviewId/rate', auth, validateObjectId('reviewId'), rateReview);

module.exports = router;
