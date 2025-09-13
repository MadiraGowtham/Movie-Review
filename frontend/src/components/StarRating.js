import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, size = 'medium', interactive = false, onRatingChange }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const handleStarClick = (starIndex) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className={`star-rating ${size}`}>
      {[...Array(fullStars)].map((_, index) => (
        <span
          key={index}
          className="star filled"
          onClick={() => handleStarClick(index)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          ★
        </span>
      ))}
      
      {hasHalfStar && (
        <span
          className="star half"
          onClick={() => handleStarClick(fullStars)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          ★
        </span>
      )}
      
      {[...Array(emptyStars)].map((_, index) => (
        <span
          key={fullStars + (hasHalfStar ? 1 : 0) + index}
          className="star empty"
          onClick={() => handleStarClick(fullStars + (hasHalfStar ? 1 : 0) + index)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;