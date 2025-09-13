const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation
const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  handleValidationErrors
];

// Movie validation
const validateMovie = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .trim(),
  body('genre')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('genre.*')
    .isIn([
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History',
      'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi',
      'Sport', 'Thriller', 'War', 'Western'
    ])
    .withMessage('Invalid genre'),
  body('releaseYear')
    .isInt({ min: 1888, max: new Date().getFullYear() + 5 })
    .withMessage('Invalid release year'),
  body('director')
    .isLength({ min: 1, max: 100 })
    .withMessage('Director name must be between 1 and 100 characters')
    .trim(),
  body('cast')
    .optional()
    .isArray()
    .withMessage('Cast must be an array'),
  body('cast.*')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Cast member name must be between 1 and 100 characters')
    .trim(),
  body('synopsis')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Synopsis must be between 10 and 2000 characters')
    .trim(),
  body('posterUrl')
    .isURL()
    .withMessage('Poster URL must be a valid URL')
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
    .withMessage('Poster URL must be an image file'),
  body('trailerUrl')
    .optional()
    .isURL()
    .withMessage('Trailer URL must be a valid URL')
    .matches(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//)
    .withMessage('Trailer URL must be a valid YouTube URL'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 600 })
    .withMessage('Duration must be between 1 and 600 minutes'),
  handleValidationErrors
];

// Review validation
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Review text must be between 10 and 2000 characters')
    .trim(),
  handleValidationErrors
];

// Query validation
const validateMovieQuery = [
  query('page')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      const num = parseInt(value);
      return !isNaN(num) && num >= 1;
    })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      const num = parseInt(value);
      return !isNaN(num) && num >= 1 && num <= 50;
    })
    .withMessage('Limit must be between 1 and 50'),
  query('genre')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      const validGenres = [
        'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
        'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History',
        'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi',
        'Sport', 'Thriller', 'War', 'Western'
      ];
      return validGenres.includes(value);
    })
    .withMessage('Invalid genre filter'),
  query('year')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      const num = parseInt(value);
      const currentYear = new Date().getFullYear();
      return !isNaN(num) && num >= 1888 && num <= currentYear + 5;
    })
    .withMessage('Invalid year filter'),
  query('minRating')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0 && num <= 5;
    })
    .withMessage('Min rating must be between 0 and 5'),
  query('sortBy')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      const validSortFields = ['title', 'releaseYear', 'averageRating', 'createdAt'];
      return validSortFields.includes(value);
    })
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      return ['asc', 'desc'].includes(value);
    })
    .withMessage('Sort order must be asc or desc'),
  handleValidationErrors
];

// ID validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID`),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateMovie,
  validateReview,
  validateMovieQuery,
  validateObjectId
};
