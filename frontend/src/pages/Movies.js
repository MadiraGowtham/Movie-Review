import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { moviesAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import './Movies.css';

const Movies = () => {
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    year: '',
    minRating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  const queryFilters = {
    ...filters,
    search: debouncedSearch
  };

  const { data, isLoading, error } = useQuery(
    ['movies', queryFilters],
    () => moviesAPI.getAll(queryFilters),
    {
      keepPreviousData: true,
      staleTime: 30000
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'
  ];

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        Failed to load movies. Please try again later.
      </div>
    );
  }

  const movies = data?.data?.movies || [];

  return (
    <div className="movies-page">
      <div className="container">
        <h1 className="page-title">Movies</h1>
        
        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search movies..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="form-control"
            />
          </div>
          
          <div className="filters">
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="form-control"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="form-control"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
              className="form-control"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="movies-grid">
          {movies.length === 0 ? (
            <div className="no-movies">
              <h3>No movies found</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="row">
              {movies.map((movie) => (
                <div key={movie._id} className="col-md-3">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;