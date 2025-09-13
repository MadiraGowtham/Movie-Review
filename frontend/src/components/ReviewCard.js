import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { FaThumbsUp, FaThumbsDown, FaTrash, FaUser } from 'react-icons/fa';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

const ReviewCardContainer = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #444;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e50914;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
`;

const ReviewDate = styled.span`
  color: #666;
  font-size: 14px;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ReviewText = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 16px;
  white-space: pre-wrap;
`;

const ReviewActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 6px;
  color: #cccccc;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e50914;
    color: #e50914;
  }

  &.helpful {
    color: #4caf50;
    border-color: #4caf50;
    
    &:hover {
      background: rgba(76, 175, 80, 0.1);
    }
  }

  &.not-helpful {
    color: #f44336;
    border-color: #f44336;
    
    &:hover {
      background: rgba(244, 67, 54, 0.1);
    }
  }

  &.danger {
    color: #f44336;
    border-color: #f44336;
    
    &:hover {
      background: rgba(244, 67, 54, 0.1);
    }
  }
`;

const HelpfulCount = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
`;

const ReviewCard = ({ review }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isRating, setIsRating] = useState(false);

  const rateReviewMutation = useMutation(
    (helpful) => reviewsAPI.rate(review._id, helpful),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['movie', review.movieId]);
        toast.success('Thank you for your feedback!');
      },
      onError: () => {
        toast.error('Failed to rate review');
      },
    }
  );

  const deleteReviewMutation = useMutation(
    () => reviewsAPI.delete(review._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['movie', review.movieId]);
        toast.success('Review deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete review');
      },
    }
  );

  const handleRateReview = (helpful) => {
    if (!user) {
      toast.error('Please login to rate reviews');
      return;
    }
    
    setIsRating(true);
    rateReviewMutation.mutate(helpful, {
      onSettled: () => {
        setIsRating(false);
      }
    });
  };

  const handleDeleteReview = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate();
    }
  };

  const isOwner = user && user.id === review.userId._id;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  return (
    <ReviewCardContainer>
      <ReviewHeader>
        <UserInfo>
          <UserAvatar>
            {review.userId.profilePicture ? (
              <img 
                src={review.userId.profilePicture} 
                alt={review.userId.username}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <FaUser />
            )}
          </UserAvatar>
          <UserDetails>
            <Username>{review.userId.username}</Username>
            <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
          </UserDetails>
        </UserInfo>
        
        <ReviewRating>
          <StarRating rating={review.rating} size={16} />
          <span style={{ color: '#cccccc', fontSize: '14px' }}>
            {review.rating}/5
          </span>
        </ReviewRating>
      </ReviewHeader>

      <ReviewText>{review.reviewText}</ReviewText>

      <ReviewActions>
        <HelpfulCount>
          <span>{review.helpful || 0} helpful</span>
          <span>•</span>
          <span>{review.notHelpful || 0} not helpful</span>
        </HelpfulCount>

        <ActionButtons>
          <ActionButton
            onClick={() => handleRateReview(true)}
            disabled={isRating}
            className="helpful"
          >
            <FaThumbsUp />
            Helpful
          </ActionButton>
          
          <ActionButton
            onClick={() => handleRateReview(false)}
            disabled={isRating}
            className="not-helpful"
          >
            <FaThumbsDown />
            Not Helpful
          </ActionButton>

          {isOwner && (
            <ActionButton
              onClick={handleDeleteReview}
              disabled={deleteReviewMutation.isLoading}
              className="danger"
            >
              <FaTrash />
              Delete
            </ActionButton>
          )}
        </ActionButtons>
      </ReviewActions>
    </ReviewCardContainer>
  );
};

export default ReviewCard;
