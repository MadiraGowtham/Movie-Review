import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const formatYear = (year) => {
    return year ? new Date(year).getFullYear() : 'N/A';
  };

  return (
    <div className="movie-card">
      <Link to={`/movies/${movie._id}`}>
        <div className="movie-poster">
          <img 
            src={movie.posterUrl} 
            alt={movie.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=No+Image';
            }}
          />
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-meta">
            <span className="movie-year">{formatYear(movie.releaseYear)}</span>
            <span className="movie-genre">{movie.genre?.[0] || 'Unknown'}</span>
          </div>
          <div className="movie-rating">
            <StarRating rating={movie.averageRating} />
            <span className="rating-text">
              {movie.averageRating ? movie.averageRating.toFixed(1) : 'N/A'} 
              ({movie.totalRatings || 0} reviews)
            </span>
          </div>
          <p className="movie-synopsis">{movie.synopsis?.substring(0, 100)}...</p>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;