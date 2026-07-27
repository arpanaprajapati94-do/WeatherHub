import axios from 'axios';

/**
 * Axios instance with base configuration
 * Automatically attaches JWT token and handles errors
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Request interceptor - attaches JWT token to every request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('weatherhub-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handles common errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 - Unauthorized (token expired/invalid)
      if (status === 401) {
        localStorage.removeItem('weatherhub-token');
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Return meaningful error message
      const message = data?.message || 'Something went wrong. Please try again.';
      error.displayMessage = message;
    } else if (error.request) {
      // Network error
      error.displayMessage = 'Network error. Please check your connection.';
    } else {
      error.displayMessage = error.message || 'An unexpected error occurred.';
    }

    return Promise.reject(error);
  }
);

/**
 * Auth API calls
 */
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/password', { currentPassword, newPassword }),
  deleteAccount: () => api.delete('/auth/me'),
};

/**
 * Weather API calls
 */
export const weatherAPI = {
  getWeather: (city) => api.get('/weather', { params: { city } }),
};

/**
 * Favourites API calls
 */
export const favouritesAPI = {
  getAll: () => api.get('/favourites'),
  add: (data) => api.post('/favourites', data),
  remove: (id) => api.delete(`/favourites/${id}`),
};

/**
 * Search History API calls
 */
export const historyAPI = {
  getAll: () => api.get('/history'),
  add: (data) => api.post('/history', data),
  clear: () => api.delete('/history'),
  remove: (id) => api.delete(`/history/${id}`),
};

export default api;

