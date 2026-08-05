import axios from 'axios';

/**
 * Axios instance with base configuration
 * Automatically attaches JWT token and handles errors
 */

// Determine the backend API origin.
// Priority:
//   1. VITE_API_URL (set explicitly in .env / hosting dashboard)
//   2. In development → same-origin `/api`, handled by Vite's proxy → http://localhost:5000
//   3. In production → the deployed Render backend (NEVER fall back to same-origin, because the
//      frontend (Vercel) and backend (Render) live on different domains).
const PROD_API_URL = 'https://weatherhub-mdip.onrender.com';

const getApiBase = () => {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (configured) return configured;

  if (import.meta.env.PROD) {
    // Production frontend must call the Render backend, not same-origin /api
    return PROD_API_URL;
  }

  // Development: same origin, Vite proxies /api → http://localhost:5000
  return '';
};

const API_URL = getApiBase();

const api = axios.create({
  baseURL: `${API_URL}/api`,
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

      // Handle 401 - Unauthorized
      if (status === 401) {
        localStorage.removeItem('weatherhub-token');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      const message =
        data?.message || 'Something went wrong. Please try again.';

      error.displayMessage = message;

    } else if (error.request) {

      error.displayMessage =
        'Network error. Please check your connection.';

    } else {

      error.displayMessage =
        error.message || 'An unexpected error occurred.';
    }

    return Promise.reject(error);
  }
);


/**
 * Auth API calls
 */
export const authAPI = {

  login: (email, password) =>
    api.post('/auth/login', {
      email,
      password,
    }),

  register: (name, email, password) =>
    api.post('/auth/register', {
      name,
      email,
      password,
    }),

  getMe: () =>
    api.get('/auth/me'),

  updateProfile: (data) =>
    api.put('/auth/me', data),

  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/password', {
      currentPassword,
      newPassword,
    }),

  deleteAccount: () =>
    api.delete('/auth/me'),

};


/**
 * Weather API calls
 */
export const weatherAPI = {

  getWeather: (city) =>
    api.get('/weather', {
      params: {
        city,
      },
    }),

  getForecast: (city) =>
    api.get('/weather/forecast', {
      params: {
        city,
      },
    }),

  getAirQuality: (city) =>
    api.get('/weather/air-quality', {
      params: {
        city,
      },
    }),

  getAlerts: (city) =>
    api.get('/weather/alerts', {
      params: {
        city,
      },
    }),

};


/**
 * Favourites API calls
 */
export const favouritesAPI = {

  getAll: () =>
    api.get('/favourites'),

  add: (data) =>
    api.post('/favourites', data),

  remove: (id) =>
    api.delete(`/favourites/${id}`),

};


/**
 * Search History API calls
 */
export const historyAPI = {

  getAll: () =>
    api.get('/history'),

  add: (data) =>
    api.post('/history', data),

  clear: () =>
    api.delete('/history'),

  remove: (id) =>
    api.delete(`/history/${id}`),

};


export default api;