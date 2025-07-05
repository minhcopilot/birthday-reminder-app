import API from './api';
import { storeToken, removeToken, storeUserInfo, removeUserInfo } from '../utils/storage';

export const AuthService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await API.login(credentials);
      const { token, user } = response.data;
      
      // Store token and user info
      await storeToken(token);
      await storeUserInfo(user);
      
      return { success: true, token, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Login failed',
        error 
      };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await API.register(userData);
      const { token, user } = response.data;
      
      // Store token and user info
      await storeToken(token);
      await storeUserInfo(user);
      
      return { success: true, token, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Registration failed',
        error 
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Remove stored token and user info
      await removeToken();
      await removeUserInfo();
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: 'Logout failed',
        error 
      };
    }
  },

  // Get user profile
  getProfile: async (token) => {
    try {
      const response = await API.getProfile(token);
      const user = response.data;
      
      // Update stored user info
      await storeUserInfo(user);
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to get profile',
        error 
      };
    }
  },

  // Update user profile
  updateProfile: async (userData, token) => {
    try {
      const response = await API.updateProfile(userData, token);
      const user = response.data;
      
      // Update stored user info
      await storeUserInfo(user);
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to update profile',
        error 
      };
    }
  },

  // Validate token
  validateToken: async (token) => {
    try {
      const response = await API.getProfile(token);
      return { success: true, user: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: 'Token validation failed',
        error 
      };
    }
  }
};

export default AuthService;