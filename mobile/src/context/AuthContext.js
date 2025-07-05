import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const login = async (email, password, fcmToken = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
        fcmToken
      });
      
      const { token, user } = response.data;
      
      setUserToken(token);
      setUserInfo(user);
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      
      const { token, user } = response.data;
      
      setUserToken(token);
      setUserInfo(user);
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    
    setIsLoading(false);
  };

  const updateUserInfo = async (updatedInfo) => {
    setUserInfo(prevInfo => ({
      ...prevInfo,
      ...updatedInfo
    }));
    
    await AsyncStorage.setItem('userInfo', JSON.stringify({
      ...userInfo,
      ...updatedInfo
    }));
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      
      const token = await AsyncStorage.getItem('userToken');
      const userInfoString = await AsyncStorage.getItem('userInfo');
      
      if (token) {
        setUserToken(token);
        setUserInfo(JSON.parse(userInfoString));
        
        // Set authorization header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      setIsLoading(false);
    } catch (error) {
      console.log('isLoggedIn error:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  useEffect(() => {
    if (userToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [userToken]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        error,
        login,
        register,
        logout,
        updateUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 