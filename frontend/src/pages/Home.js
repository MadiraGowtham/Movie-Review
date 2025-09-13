import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { moviesAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const { data: featuredData, isLoading: featuredLoading } = useQuery(
    'featuredMovies',
    () => moviesAPI.getFeatured()
  );

  const { data: trendingData, isLoading: trendingLoading } = useQuery(
    'trendingMovies',
    () => moviesAPI.getTrending()
  );

  if (featuredLoading || trendingLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to MovieReview</h1>
            <p>Discover, rate, and review your favorite movies. Join our community of movie enthusiasts!</p>
            <div className="hero-buttons">
              <Link to="/movies" className="btn">Browse Movies</Link>
              <Link to="/register" className="btn btn-secondary">Join Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="featured-movies">
        <div className="container">
          <div className="section-header">
            <h2>Featured Movies</h2>
            <Link to="/movies?featured=true" className="btn">View All</Link>
          </div>
          <div className="row">
            {featuredData?.data?.movies?.map((movie) => (
              <div key={movie._id} className="col-md-3">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Movies */}
      <section className="trending-movies">
        <div className="container">
          <div className="section-header">
            <h2>Trending Now</h2>
            <Link to="/movies?trending=true" className="btn">View All</Link>
          </div>
          <div className="row">
            {trendingData?.data?.movies?.map((movie) => (
              <div key={movie._id} className="col-md-3">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;