import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = config.headers.Authorization;
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
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Handle unauthorized access
        console.log('Unauthorized access - redirecting to login');
        // You can dispatch a logout action here
      }
      
      return Promise.reject({
        status,
        message: data.error || data.message || 'Something went wrong',
        data: data
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        status: 0,
        message: 'Network error - please check your connection',
        data: null
      });
    } else {
      // Something else happened
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        data: null
      });
    }
  }
);

// API methods
export const API = {
  // Auth endpoints
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  
  // User endpoints
  getProfile: (token) => apiClient.get('/users/profile', {
    headers: { Authorization: token }
  }),
  updateProfile: (userData, token) => apiClient.put('/users/profile', userData, {
    headers: { Authorization: token }
  }),
  
  // Birthday endpoints
  getBirthdays: (token) => apiClient.get('/birthdays', {
    headers: { Authorization: token }
  }),
  getBirthday: (id, token) => apiClient.get(`/birthdays/${id}`, {
    headers: { Authorization: token }
  }),
  createBirthday: (birthdayData, token) => apiClient.post('/birthdays', birthdayData, {
    headers: { Authorization: token }
  }),
  updateBirthday: (id, birthdayData, token) => apiClient.put(`/birthdays/${id}`, birthdayData, {
    headers: { Authorization: token }
  }),
  deleteBirthday: (id, token) => apiClient.delete(`/birthdays/${id}`, {
    headers: { Authorization: token }
  }),
  
  // Notification endpoints
  sendNotification: (notificationData, token) => apiClient.post('/notifications/send', notificationData, {
    headers: { Authorization: token }
  }),
  getNotificationHistory: (token, params = {}) => apiClient.get('/notifications/history', {
    headers: { Authorization: token },
    params
  }),
};

export default API;