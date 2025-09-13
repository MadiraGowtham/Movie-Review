const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getUserStats
} = require('../controllers/userController');
const { validateUserUpdate, validateObjectId } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile and review history
// @access  Public
router.get('/:id', validateObjectId('id'), getUserProfile);

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', auth, validateObjectId('id'), validateUserUpdate, updateUserProfile);

// @route   GET /api/users/:id/stats
// @desc    Get user statistics
// @access  Public
router.get('/:id/stats', validateObjectId('id'), getUserStats);

module.exports = router;
