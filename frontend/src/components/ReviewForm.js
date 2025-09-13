import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { reviewsAPI } from '../services/api';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

const FormContainer = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FormTitle = styled.h3`
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #e50914;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RatingLabel = styled.label`
  color: #cccccc;
  font-weight: 500;
  font-size: 14px;
`;

const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RatingText = styled.span`
  color: #cccccc;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #0a0a0a;
  color: #ffffff;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #e50914;
  }

  &::placeholder {
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  &.primary {
    background: #e50914;
    color: white;
    
    &:hover:not(:disabled) {
      background: #f40612;
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: transparent;
    color: #cccccc;
    border: 2px solid #333;
    
    &:hover:not(:disabled) {
      border-color: #e50914;
      color: #e50914;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ReviewForm = ({ movieId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    reviewText: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const createReviewMutation = useMutation(
    (reviewData) => reviewsAPI.create(movieId, reviewData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['movie', movieId]);
        queryClient.invalidateQueries(['reviews', movieId]);
        toast.success('Review submitted successfully!');
        onSuccess();
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to submit review';
        toast.error(message);
      },
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (formData.reviewText.trim().length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    createReviewMutation.mutate(formData, {
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  const getRatingText = (rating) => {
    const texts = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return texts[rating] || '';
  };

  return (
    <FormContainer>
      <FormHeader>
        <FormTitle>Write a Review</FormTitle>
        <CloseButton onClick={onCancel}>
          <FaTimes />
        </CloseButton>
      </FormHeader>

      <Form onSubmit={handleSubmit}>
        <RatingSection>
          <RatingLabel>Your Rating *</RatingLabel>
          <StarRatingContainer>
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              interactive={true}
              size={24}
            />
            {formData.rating > 0 && (
              <RatingText>{getRatingText(formData.rating)}</RatingText>
            )}
          </StarRatingContainer>
        </RatingSection>

        <div>
          <RatingLabel htmlFor="reviewText">Your Review *</RatingLabel>
          <TextArea
            id="reviewText"
            name="reviewText"
            placeholder="Share your thoughts about this movie..."
            value={formData.reviewText}
            onChange={handleChange}
            required
          />
        </div>

        <ButtonGroup>
          <Button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="primary"
            disabled={isSubmitting || formData.rating === 0 || formData.reviewText.trim().length < 10}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default ReviewForm;
