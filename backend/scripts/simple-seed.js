const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');

const sampleMovies = [
  {
    title: "The Dark Knight",
    genre: ["Action", "Crime", "Drama"],
    releaseYear: 2008,
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    duration: 152,
    featured: true,
    trending: true
  },
  {
    title: "Inception",
    genre: ["Action", "Sci-Fi", "Thriller"],
    releaseYear: 2010,
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    duration: 148,
    featured: true,
    trending: false
  },
  {
    title: "Pulp Fiction",
    genre: ["Crime", "Drama"],
    releaseYear: 1994,
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItZDU3MDE1OTVkMDAxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
    duration: 154,
    featured: false,
    trending: true
  },
  {
    title: "The Shawshank Redemption",
    genre: ["Drama"],
    releaseYear: 1994,
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=6hB3S9bIaco",
    duration: 142,
    featured: true,
    trending: false
  },
  {
    title: "The Godfather",
    genre: ["Crime", "Drama"],
    releaseYear: 1972,
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
    duration: 175,
    featured: false,
    trending: true
  },
  {
    title: "Forrest Gump",
    genre: ["Drama", "Romance"],
    releaseYear: 1994,
    director: "Robert Zemeckis",
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
    synopsis: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg",
    duration: 142,
    featured: true,
    trending: false
  }
];

const sampleUsers = [
  {
    username: "admin",
    email: "admin@moviereview.com",
    password: "admin123",
    isAdmin: true,
    bio: "Administrator of MovieReview Platform"
  },
  {
    username: "movielover",
    email: "movielover@example.com",
    password: "password123",
    bio: "Passionate about cinema and storytelling"
  },
  {
    username: "cinemacritic",
    email: "critic@example.com",
    password: "password123",
    bio: "Professional film critic with 10+ years experience"
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-review-platform');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Review.deleteMany({});
    await Watchlist.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create movies
    const movies = [];
    for (const movieData of sampleMovies) {
      const movie = new Movie(movieData);
      await movie.save();
      movies.push(movie);
      console.log(`Created movie: ${movie.title}`);
    }

    // Create reviews
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const user = users[i % users.length];
      
      const review = new Review({
        userId: user._id,
        movieId: movie._id,
        rating: 4 + (i % 2),
        reviewText: `This is an amazing movie! Great acting and storyline. Highly recommended for all movie lovers.`
      });
      await review.save();
      console.log(`Created review for ${movie.title} by ${user.username}`);
    }

    // Calculate average ratings for movies
    for (const movie of movies) {
      await movie.calculateAverageRating();
      console.log(`Updated average rating for ${movie.title}: ${movie.averageRating}`);
    }

    // Create watchlist items
    for (let i = 0; i < 3; i++) {
      const user = users[1]; // movielover user
      const movie = movies[i];
      
      const watchlistItem = new Watchlist({
        userId: user._id,
        movieId: movie._id
      });
      await watchlistItem.save();
      console.log(`Added ${movie.title} to ${user.username}'s watchlist`);
    }

    console.log('Database seeding completed successfully!');
    console.log(`Created ${users.length} users, ${movies.length} movies, and various reviews and watchlist items.`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

const main = async () => {
  await connectDB();
  await seedDatabase();
};

if (require.main === module) {
  main();
}

module.exports = { seedDatabase };
