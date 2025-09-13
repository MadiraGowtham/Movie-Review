const Movie = require('../models/Movie');

const getAllMovies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      genre,
      year,
      minRating,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      trending
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (genre) {
      filter.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    }
    
    if (year) {
      filter.releaseYear = parseInt(year);
    }
    
    if (minRating) {
      filter.averageRating = { $gte: parseFloat(minRating) };
    }
    

    if (search && search.trim().length > 0) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { synopsis: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (trending === 'true') {
      filter.trending = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const movies = await Movie.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Movie.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      movies,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalMovies: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Server error while fetching movies', error: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Get reviews for this movie
    const Review = require('../models/Review');
    const reviews = await Review.find({ movieId: req.params.id })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json({ 
      movie: {
        ...movie.toObject(),
        reviews
      }
    });
  } catch (error) {
    console.error('Get movie by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching movie' });
  }
};

const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    
    res.status(201).json({
      message: 'Movie created successfully',
      movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Movie with this title already exists' });
    } else {
      res.status(500).json({ message: 'Server error while creating movie' });
    }
  }
};

const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ message: 'Server error while updating movie' });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ message: 'Server error while deleting movie' });
  }
};

const getFeaturedMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ featured: true })
      .sort({ averageRating: -1 })
      .limit(6)
      .lean();

    res.json({ movies });
  } catch (error) {
    console.error('Get featured movies error:', error);
    res.status(500).json({ message: 'Server error while fetching featured movies' });
  }
};

const getTrendingMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ trending: true })
      .sort({ averageRating: -1 })
      .limit(6)
      .lean();

    res.json({ movies });
  } catch (error) {
    console.error('Get trending movies error:', error);
    res.status(500).json({ message: 'Server error while fetching trending movies' });
  }
};

const searchMovies = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters long' });
    }

    const movies = await Movie.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .lean();

    res.json({ movies });
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({ message: 'Server error while searching movies' });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getFeaturedMovies,
  getTrendingMovies,
  searchMovies
};
