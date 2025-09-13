const User = require('../models/User');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's review statistics
    const reviewStats = await Review.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    // Get recent reviews
    const recentReviews = await Review.find({ userId })
      .populate('movieId', 'title posterUrl releaseYear')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      user,
      stats: reviewStats[0] || { totalReviews: 0, averageRating: 0 },
      recentReviews
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const { username, email, bio, profilePicture } = req.body;

    // Check if user is trying to update another user's profile
    if (req.params.id && req.params.id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username or email is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    // Update user
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

const getUserWatchlist = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const { page = 1, limit = 12 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const watchlist = await Watchlist.find({ userId })
      .populate('movieId', 'title posterUrl releaseYear averageRating genre')
      .sort({ dateAdded: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Watchlist.countDocuments({ userId });
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      watchlist,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get user watchlist error:', error);
    res.status(500).json({ message: 'Server error while fetching watchlist' });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.id;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if already in watchlist
    const existingItem = await Watchlist.findOne({ userId, movieId });
    if (existingItem) {
      return res.status(400).json({ message: 'Movie is already in your watchlist' });
    }

    // Add to watchlist
    const watchlistItem = new Watchlist({
      userId,
      movieId
    });

    await watchlistItem.save();
    await watchlistItem.populate('movieId', 'title posterUrl releaseYear averageRating genre');

    res.status(201).json({
      message: 'Movie added to watchlist successfully',
      watchlistItem
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Server error while adding to watchlist' });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const watchlistItem = await Watchlist.findOneAndDelete({ userId, movieId });
    if (!watchlistItem) {
      return res.status(404).json({ message: 'Movie not found in watchlist' });
    }

    res.json({ message: 'Movie removed from watchlist successfully' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Server error while removing from watchlist' });
  }
};

const checkWatchlistStatus = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const watchlistItem = await Watchlist.findOne({ userId, movieId });
    
    res.json({
      inWatchlist: !!watchlistItem,
      dateAdded: watchlistItem?.dateAdded
    });
  } catch (error) {
    console.error('Check watchlist status error:', error);
    res.status(500).json({ message: 'Server error while checking watchlist status' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;

    // Get review statistics
    const reviewStats = await Review.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    // Get watchlist count
    const watchlistCount = await Watchlist.countDocuments({ userId });

    // Get favorite genres
    const favoriteGenres = await Review.aggregate([
      { $match: { userId: user._id } },
      { $lookup: { from: 'movies', localField: 'movieId', foreignField: '_id', as: 'movie' } },
      { $unwind: '$movie' },
      { $unwind: '$movie.genre' },
      {
        $group: {
          _id: '$movie.genre',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      reviewStats: reviewStats[0] || { totalReviews: 0, averageRating: 0, ratingDistribution: [] },
      watchlistCount,
      favoriteGenres
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error while fetching user stats' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus,
  getUserStats
};
