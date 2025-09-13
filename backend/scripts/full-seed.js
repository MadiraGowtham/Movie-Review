const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');

const fullMovies = [
  {
    title: "The Dark Knight",
    genre: ["Action", "Crime", "Drama"],
    releaseYear: 2008,
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine", "Maggie Gyllenhaal"],
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice. The Joker's reign of terror escalates as he challenges Batman's moral code and pushes him to his limits.",
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
    cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy", "Ellen Page", "Michael Caine"],
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. The film explores the nature of reality and dreams in a complex narrative structure.",
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
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson", "Bruce Willis", "Ving Rhames"],
    synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption. A non-linear narrative that revolutionized independent cinema.",
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
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler", "Clancy Brown"],
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency. A powerful story of hope, friendship, and the human spirit.",
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
    cast: ["Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall", "Diane Keaton"],
    synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. A masterpiece of American cinema exploring family, power, and corruption.",
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
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise", "Sally Field", "Mykelti Williamson"],
    synopsis: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75. A heartwarming tale of innocence and determination.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg",
    duration: 142,
    featured: true,
    trending: false
  },
  {
    title: "The Matrix",
    genre: ["Action", "Sci-Fi"],
    releaseYear: 1999,
    director: "Lana Wachowski",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving", "Joe Pantoliano"],
    synopsis: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers. A groundbreaking sci-fi film that redefined action cinema.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
    duration: 136,
    featured: false,
    trending: true
  },
  {
    title: "Goodfellas",
    genre: ["Biography", "Crime", "Drama"],
    releaseYear: 1990,
    director: "Martin Scorsese",
    cast: ["Robert De Niro", "Ray Liotta", "Joe Pesci", "Lorraine Bracco", "Paul Sorvino"],
    synopsis: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtMzRjYy00YzJkLTk4N2UtMjRhNWY4N2JjOTU3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=qo5jJN7uQZc",
    duration: 146,
    featured: true,
    trending: false
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    genre: ["Adventure", "Drama", "Fantasy"],
    releaseYear: 2001,
    director: "Peter Jackson",
    cast: ["Elijah Wood", "Ian McKellen", "Orlando Bloom", "Viggo Mortensen", "Sean Astin"],
    synopsis: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron. An epic fantasy adventure.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=V75dMMIW2B4",
    duration: 178,
    featured: false,
    trending: true
  },
  {
    title: "Fight Club",
    genre: ["Drama"],
    releaseYear: 1999,
    director: "David Fincher",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter", "Meat Loaf", "Jared Leto"],
    synopsis: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more. A dark and thought-provoking film about modern society.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMmEzNTg4MDktODI0Mi00MzE4LTk3OTUxN2YtYzQ0N2Q0YzQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=SUXWAEX2jlg",
    duration: 139,
    featured: true,
    trending: false
  },
  {
    title: "The Silence of the Lambs",
    genre: ["Crime", "Drama", "Thriller"],
    releaseYear: 1991,
    director: "Jonathan Demme",
    cast: ["Jodie Foster", "Anthony Hopkins", "Scott Glenn", "Ted Levine", "Anthony Heald"],
    synopsis: "A young F.B.I. cadet must confide in an incarcerated and manipulative killer to receive his help on catching another serial killer who skins his victims. A psychological thriller masterpiece.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=W6Mm8Sbe__o",
    duration: 118,
    featured: false,
    trending: true
  },
  {
    title: "Schindler's List",
    genre: ["Biography", "Drama", "History"],
    releaseYear: 1993,
    director: "Steven Spielberg",
    cast: ["Liam Neeson", "Ralph Fiennes", "Ben Kingsley", "Caroline Goodall", "Jonathan Sagall"],
    synopsis: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis. A powerful historical drama.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=gG22XNhtnoY",
    duration: 195,
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
    bio: "Administrator of MovieReview Platform. Passionate about cinema and helping others discover great films."
  },
  {
    username: "movielover",
    email: "movielover@example.com",
    password: "password123",
    bio: "Passionate about cinema and storytelling. Love discovering hidden gems and discussing films with fellow movie enthusiasts."
  },
  {
    username: "cinemacritic",
    email: "critic@example.com",
    password: "password123",
    bio: "Professional film critic with 10+ years experience. Specializing in independent cinema and international films."
  },
  {
    username: "filmstudent",
    email: "student@example.com",
    password: "password123",
    bio: "Film studies student exploring the art of cinema. Always eager to learn and share thoughts on movies."
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
    console.log('Starting comprehensive database seeding...');

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
    for (const movieData of fullMovies) {
      const movie = new Movie(movieData);
      await movie.save();
      movies.push(movie);
      console.log(`Created movie: ${movie.title}`);
    }

    // Create reviews for each movie
    const reviewTexts = [
      "Absolutely brilliant! This movie exceeded all my expectations. The acting, direction, and cinematography are all top-notch.",
      "A masterpiece of cinema. This film will stay with you long after the credits roll. Highly recommended!",
      "Incredible storytelling and character development. One of the best movies I've seen in years.",
      "The performances are outstanding and the plot is engaging from start to finish. A must-watch!",
      "This movie perfectly balances action, drama, and emotion. The director's vision is executed flawlessly.",
      "A thought-provoking film that challenges your perspective. The cinematography is absolutely stunning.",
      "Outstanding performances from the entire cast. The story is compelling and well-paced.",
      "This is what cinema is all about. A perfect blend of entertainment and artistic expression.",
      "The attention to detail in this film is remarkable. Every frame tells a story.",
      "A powerful and moving experience. This movie deserves all the praise it has received."
    ];

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      
      // Create 2-4 reviews per movie with unique user-movie combinations
      const numReviews = Math.floor(Math.random() * 3) + 2;
      const usedUsers = new Set();
      
      for (let j = 0; j < numReviews; j++) {
        let user;
        do {
          user = users[Math.floor(Math.random() * users.length)];
        } while (usedUsers.has(user._id.toString()));
        
        usedUsers.add(user._id.toString());
        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
        const reviewText = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
        
        const review = new Review({
          userId: user._id,
          movieId: movie._id,
          rating: rating,
          reviewText: reviewText
        });
        await review.save();
        console.log(`Created review for ${movie.title} by ${user.username}`);
      }
    }

    // Calculate average ratings for movies
    for (const movie of movies) {
      await movie.calculateAverageRating();
      console.log(`Updated average rating for ${movie.title}: ${movie.averageRating}`);
    }

    // Create watchlist items
    const movieloverUser = users.find(u => u.username === 'movielover');
    const criticUser = users.find(u => u.username === 'cinemacritic');
    
    // Add some movies to watchlists
    const watchlistMovies = movies.slice(0, 4);
    for (const movie of watchlistMovies) {
      const watchlistItem = new Watchlist({
        userId: movieloverUser._id,
        movieId: movie._id
      });
      await watchlistItem.save();
      console.log(`Added ${movie.title} to ${movieloverUser.username}'s watchlist`);
    }

    // Add different movies to critic's watchlist
    const criticWatchlistMovies = movies.slice(4, 8);
    for (const movie of criticWatchlistMovies) {
      const watchlistItem = new Watchlist({
        userId: criticUser._id,
        movieId: movie._id
      });
      await watchlistItem.save();
      console.log(`Added ${movie.title} to ${criticUser.username}'s watchlist`);
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
