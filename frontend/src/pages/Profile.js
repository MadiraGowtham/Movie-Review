import React from 'react';
import { useQuery } from 'react-query';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  const { data: profileData, isLoading } = useQuery(
    ['profile', user?.id],
    () => usersAPI.getProfile(user?.id),
    { enabled: !!user?.id }
  );

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const profile = profileData?.data;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-info">
            <h1>{user?.username}</h1>
            <p className="join-date">Member since {new Date(user?.joinDate).getFullYear()}</p>
            {profile?.user?.bio && (
              <p className="bio">{profile.user.bio}</p>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h3>{profile?.stats?.totalReviews || 0}</h3>
            <p>Reviews Written</p>
          </div>
          <div className="stat-card">
            <h3>{profile?.stats?.averageRating?.toFixed(1) || '0.0'}</h3>
            <p>Average Rating Given</p>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Reviews</h2>
          {profile?.recentReviews?.length === 0 ? (
            <p>No reviews yet. Start reviewing movies!</p>
          ) : (
            <div className="reviews-list">
              {profile?.recentReviews?.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-movie">
                    <h4>{review.movieId?.title}</h4>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
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

export default Profile;