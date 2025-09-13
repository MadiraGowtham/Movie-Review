import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/">🎬 MovieReview</Link>
        </div>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/movies" className="navbar-link">Movies</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/watchlist" className="navbar-link">My Watchlist</Link>
              <div className="navbar-dropdown">
                <span className="navbar-user">👤 {user?.username}</span>
                <div className="dropdown-content">
                  <Link to="/profile" className="dropdown-link">Profile</Link>
                  <button onClick={handleLogout} className="dropdown-link">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
        
        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;