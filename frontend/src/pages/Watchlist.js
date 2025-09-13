import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { watchlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import './Watchlist.css';

const Watchlist = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: watchlistData, isLoading } = useQuery(
    ['watchlist', user?.id],
    () => watchlistAPI.getWatchlist(user?.id),
    { enabled: !!user?.id && isAuthenticated }
  );

  const removeFromWatchlistMutation = useMutation(
    (movieId) => watchlistAPI.removeFromWatchlist(movieId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['watchlist', user?.id]);
        alert('Removed from watchlist!');
      }
    }
  );

  const handleRemoveFromWatchlist = (movieId) => {
    if (window.confirm('Remove this movie from your watchlist?')) {
      removeFromWatchlistMutation.mutate(movieId);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="watchlist-page">
        <div className="container">
          <div className="not-logged-in">
            <h1>My Watchlist</h1>
            <p>Please log in to view your watchlist.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your watchlist...</p>
      </div>
    );
  }

  const watchlist = watchlistData?.data?.watchlist || [];
  const filteredMovies = watchlist.filter(item => 
    item.movieId.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="watchlist-page">
      <div className="container">
        <h1>My Watchlist</h1>
        
        <div className="watchlist-controls">
          <input
            type="text"
            placeholder="Search your watchlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
          />
        </div>

        {watchlist.length === 0 ? (
          <div className="empty-watchlist">
            <h3>Your watchlist is empty</h3>
            <p>Start building your watchlist by adding movies you want to watch later.</p>
            <button onClick={() => navigate('/movies')} className="btn btn-primary">
              Browse Movies
            </button>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="no-results">
            <h3>No movies found</h3>
            <p>No movies in your watchlist match your search criteria.</p>
          </div>
        ) : (
          <div className="watchlist-grid">
            <div className="row">
              {filteredMovies.map((item) => (
                <div key={item._id} className="col-md-3">
                  <div className="watchlist-item">
                    <MovieCard movie={item.movieId} />
                    <div className="watchlist-actions">
                      <button
                        onClick={() => handleRemoveFromWatchlist(item.movieId._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Remove
                      </button>
                      <span className="added-date">
                        Added {new Date(item.dateAdded).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;