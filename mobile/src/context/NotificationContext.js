import React, { createContext, useState, useEffect, useContext } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform, Alert, Linking } from 'react-native';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { API_URL } from '../config/api';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { userToken, userInfo } = useContext(AuthContext);

  // Request notification permissions
  const requestPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      setHasPermission(enabled);
      return enabled;
    } catch (error) {
      console.log('Permission request failed', error);
      setHasPermission(false);
      return false;
    }
  };

  // Get FCM token
  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      setFcmToken(token);
      return token;
    } catch (error) {
      console.log('Failed to get FCM token', error);
      return null;
    }
  };

  // Update FCM token on the server
  const updateFcmToken = async (token) => {
    if (!userToken || !token) return;

    try {
      await axios.put(`${API_URL}/api/users/profile`, {
        fcmToken: token
      });
    } catch (error) {
      console.log('Failed to update FCM token on server', error);
    }
  };

  // Handle foreground notifications
  const handleForegroundNotification = () => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground notification received:', remoteMessage);
      
      // Add to notifications list
      setNotifications(prev => [
        {
          id: remoteMessage.messageId || Date.now().toString(),
          title: remoteMessage.notification?.title || '',
          body: remoteMessage.notification?.body || '',
          data: remoteMessage.data,
          timestamp: new Date().toISOString(),
          read: false
        },
        ...prev
      ]);

      // Show alert for foreground notification
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body,
        [
          { text: 'Đóng', style: 'cancel' },
          { 
            text: 'Xem', 
            onPress: () => {
              // Handle notification press based on type
              if (remoteMessage.data?.birthdayId) {
                // Navigate to birthday details
                // This would be implemented with navigation in a real app
                console.log('Navigate to birthday', remoteMessage.data.birthdayId);
              }
            } 
          }
        ]
      );
    });

    return unsubscribe;
  };

  // Initialize notifications
  const initializeNotifications = async () => {
    if (Platform.OS === 'android') {
      // Create notification channel for Android
      messaging().createChannel({
        id: 'birthday-reminders',
        name: 'Birthday Reminders',
        description: 'Notifications for upcoming birthdays',
        importance: 4, // high
        vibration: true
      });
    }

    // Check permission
    const hasPermission = await requestPermission();
    if (hasPermission) {
      const token = await getFcmToken();
      if (token && userToken) {
        updateFcmToken(token);
      }
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    initializeNotifications();
    
    // Set up foreground notification handler
    const unsubscribeForeground = handleForegroundNotification();
    
    // Set up background/quit state notification handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message:', remoteMessage);
    });
    
    // Handle notification that opened the app
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened by notification:', remoteMessage);
          // Handle navigation based on notification data
        }
      });
      
    return () => {
      unsubscribeForeground();
    };
  }, []);

  // Update FCM token when user logs in
  useEffect(() => {
    if (userToken && fcmToken) {
      updateFcmToken(fcmToken);
    }
  }, [userToken, fcmToken]);

  return (
    <NotificationContext.Provider
      value={{
        hasPermission,
        fcmToken,
        notifications,
        requestPermission,
        markAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}; 