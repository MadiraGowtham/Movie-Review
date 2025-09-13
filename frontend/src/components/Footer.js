import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h3>MovieReview</h3>
            <p>Discover, rate, and review your favorite movies. Join our community of movie enthusiasts!</p>
          </div>
          <div className="col-md-4">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/movies">Browse Movies</a></li>
              <li><a href="/movies?featured=true">Featured Movies</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h4>Categories</h4>
            <ul>
              <li><a href="/movies?genre=Action">Action</a></li>
              <li><a href="/movies?genre=Comedy">Comedy</a></li>
              <li><a href="/movies?genre=Drama">Drama</a></li>
              <li><a href="/movies?genre=Horror">Horror</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 MovieReview Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;