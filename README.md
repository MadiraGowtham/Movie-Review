# Movie Review Platform

A full-stack movie review platform built with the MERN stack (MongoDB, Express.js, React, Node.js). Users can browse movies, read and write reviews, rate films, and manage their watchlist.

## Features

### Frontend (React)
- 🏠 Home page with featured movies and trending films
- 🎬 Movie listing page with search and filter functionality
- 📱 Individual movie page with details, trailers, cast, and reviews
- 👤 User profile page with review history and watchlist
- ⭐ Review submission form with star ratings
- 📋 Movie watchlist functionality
- 🔐 User authentication and authorization
- 📱 Responsive design for mobile and desktop

### Backend (Node.js, Express, MongoDB)
- 🚀 RESTful API with comprehensive endpoints
- 🔒 JWT-based authentication
- 📊 Data validation and error handling
- 🗄️ MongoDB for data persistence
- ⭐ Average rating calculations
- 🔍 Advanced search and filtering

## Tech Stack

- **Frontend**: React, React Router, Context API, Axios, Styled Components
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-review-platform
```

2. Run the setup script (installs dependencies and seeds database):
```bash
npm run setup
```

3. Start the development servers:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## Sample Accounts

The database is seeded with the following test accounts:

- **Admin**: admin@moviereview.com / admin123
- **User**: movielover@example.com / password123  
- **User**: critic@example.com / password123
- **User**: student@example.com / password123

## Manual Installation

If you prefer to set up manually:

1. Install dependencies for all parts of the application:
```bash
npm run install-all
```

2. Set up environment variables:
   - The `.env` file is already created with the provided MongoDB connection string and JWT secret
   - You can modify it if needed

3. Seed the database with sample data:
```bash
npm run seed
```

4. Start the development servers:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://madiragowtham19:M8qRs6R1ayBKA7bE@cluster0.sievzrz.mongodb.net/movie-review-platform
JWT_SECRET=4ec8a951a7ee92b3dd304bf7fb2f24bdb08c636a32ab42e03b62c9ab43fba228
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Movies
- `GET /api/movies` - Get all movies (with pagination and filtering)
- `GET /api/movies/:id` - Get specific movie with reviews
- `POST /api/movies` - Add new movie (admin only)
- `GET /api/movies/:id/reviews` - Get reviews for specific movie
- `POST /api/movies/:id/reviews` - Submit review for movie

### Users
- `GET /api/users/:id` - Get user profile and review history
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/watchlist` - Get user's watchlist
- `POST /api/users/:id/watchlist` - Add movie to watchlist
- `DELETE /api/users/:id/watchlist/:movieId` - Remove movie from watchlist

## Database Schema

### Movies Collection
```javascript
{
  title: String,
  genre: [String],
  releaseYear: Number,
  director: String,
  cast: [String],
  synopsis: String,
  posterUrl: String,
  averageRating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  profilePicture: String,
  joinDate: Date,
  isAdmin: Boolean
}
```

### Reviews Collection
```javascript
{
  userId: ObjectId,
  movieId: ObjectId,
  rating: Number (1-5),
  reviewText: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Watchlist Collection
```javascript
{
  userId: ObjectId,
  movieId: ObjectId,
  dateAdded: Date
}
```

## Project Structure

```
movie-review-platform/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
