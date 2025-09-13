import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Movies API
export const moviesAPI = {
  getAll: (params) => api.get('/movies', { params }),
  getById: (id) => api.get(`/movies/${id}`),
  getFeatured: () => api.get('/movies/featured'),
  getTrending: () => api.get('/movies/trending'),
  search: (query) => api.get('/movies/search', { params: { q: query } }),
  create: (movieData) => api.post('/movies', movieData),
  update: (id, movieData) => api.put(`/movies/${id}`, movieData),
  delete: (id) => api.delete(`/movies/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getMovieReviews: (movieId, params) => api.get(`/reviews/movie/${movieId}`, { params }),
  getUserReviews: (userId, params) => api.get(`/reviews/user/${userId}`, { params }),
  create: (movieId, reviewData) => api.post(`/reviews/movie/${movieId}`, reviewData),
  update: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
  rate: (reviewId, helpful) => api.post(`/reviews/${reviewId}/rate`, { helpful }),
};

// Users API
export const usersAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, userData) => api.put(`/users/${userId}`, userData),
  getStats: (userId) => api.get(`/users/${userId}/stats`),
};

// Watchlist API
export const watchlistAPI = {
  getWatchlist: (userId, params) => api.get(`/watchlist/${userId}`, { params }),
  addToWatchlist: (movieId) => api.post('/watchlist', { movieId }),
  removeFromWatchlist: (movieId) => api.delete(`/watchlist/${movieId}`),
  checkStatus: (movieId) => api.get(`/watchlist/check/${movieId}`),
};

export default api;
