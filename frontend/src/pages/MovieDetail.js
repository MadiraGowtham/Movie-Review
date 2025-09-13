import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { moviesAPI, watchlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    reviewText: ''
  });

  const { data: movieData, isLoading, error } = useQuery(
    ['movie', id],
    () => moviesAPI.getById(id),
    { enabled: !!id }
  );

  const { data: watchlistStatus } = useQuery(
    ['watchlistStatus', id],
    () => watchlistAPI.checkStatus(id),
    { enabled: !!id && isAuthenticated }
  );

  const addToWatchlistMutation = useMutation(
    () => watchlistAPI.addToWatchlist(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['watchlistStatus', id]);
        alert('Added to watchlist!');
      }
    }
  );

  const removeFromWatchlistMutation = useMutation(
    () => watchlistAPI.removeFromWatchlist(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['watchlistStatus', id]);
        alert('Removed from watchlist!');
      }
    }
  );

  const handleWatchlistToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (watchlistStatus?.data?.inWatchlist) {
      removeFromWatchlistMutation.mutate();
    } else {
      addToWatchlistMutation.mutate();
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Review submission logic would go here
    alert('Review submitted! (Feature coming soon)');
    setShowReviewForm(false);
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movieData?.data?.movie) {
    return (
      <div className="error">
        Movie not found. <button onClick={() => navigate('/movies')}>Back to Movies</button>
      </div>
    );
  }

  const movie = movieData.data.movie;
  const reviews = movie.reviews || [];

  return (
    <div className="movie-detail">
      <div className="container">
        <div className="movie-header">
          <div className="movie-poster">
            <img src={movie.posterUrl} alt={movie.title} />
          </div>
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              <span>{new Date(movie.releaseYear).getFullYear()}</span>
              <span>{movie.duration} min</span>
              <span>{movie.genre?.join(', ')}</span>
            </div>
            <div className="movie-rating">
              <StarRating rating={movie.averageRating} size="large" />
              <span>{movie.averageRating?.toFixed(1) || 'N/A'} ({movie.totalRatings || 0} reviews)</span>
            </div>
            <p className="movie-synopsis">{movie.synopsis}</p>
            <div className="movie-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setShowReviewForm(true)}
              >
                Write Review
              </button>
              <button 
                className={`btn ${watchlistStatus?.data?.inWatchlist ? 'btn-danger' : 'btn-secondary'}`}
                onClick={handleWatchlistToggle}
              >
                {watchlistStatus?.data?.inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>

        {showReviewForm && (
          <div className="review-form-section">
            <h3>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Your Rating</label>
                <StarRating 
                  rating={reviewData.rating} 
                  interactive={true}
                  onRatingChange={(rating) => setReviewData({...reviewData, rating})}
                />
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={reviewData.reviewText}
                  onChange={(e) => setReviewData({...reviewData, reviewText: e.target.value})}
                  className="form-control"
                  rows="4"
                  placeholder="Share your thoughts about this movie..."
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Submit Review</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowReviewForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="reviews-section">
          <h3>Reviews ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review this movie!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <strong>{review.userId?.username}</strong>
                    <StarRating rating={review.rating} size="small" />
                  </div>
                  <p>{review.reviewText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;