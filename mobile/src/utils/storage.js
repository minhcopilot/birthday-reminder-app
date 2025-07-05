import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

// Store data in AsyncStorage
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};

// Get data from AsyncStorage
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

// Remove data from AsyncStorage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data:', error);
    return false;
  }
};

// Clear all data from AsyncStorage
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Store user token
export const storeToken = async (token) => {
  return await storeData(STORAGE_KEYS.USER_TOKEN, token);
};

// Get user token
export const getToken = async () => {
  return await getData(STORAGE_KEYS.USER_TOKEN);
};

// Remove user token
export const removeToken = async () => {
  return await removeData(STORAGE_KEYS.USER_TOKEN);
};

// Store user info
export const storeUserInfo = async (userInfo) => {
  return await storeData(STORAGE_KEYS.USER_INFO, userInfo);
};

// Get user info
export const getUserInfo = async () => {
  return await getData(STORAGE_KEYS.USER_INFO);
};

// Remove user info
export const removeUserInfo = async () => {
  return await removeData(STORAGE_KEYS.USER_INFO);
};

// Store FCM token
export const storeFCMToken = async (token) => {
  return await storeData(STORAGE_KEYS.FCM_TOKEN, token);
};

// Get FCM token
export const getFCMToken = async () => {
  return await getData(STORAGE_KEYS.FCM_TOKEN);
};

// Store notification settings
export const storeNotificationSettings = async (settings) => {
  return await storeData(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
};

// Get notification settings
export const getNotificationSettings = async () => {
  return await getData(STORAGE_KEYS.NOTIFICATION_SETTINGS);
};

// Store theme preference
export const storeThemePreference = async (theme) => {
  return await storeData(STORAGE_KEYS.THEME_PREFERENCE, theme);
};

// Get theme preference
export const getThemePreference = async () => {
  return await getData(STORAGE_KEYS.THEME_PREFERENCE);
};

// Get all storage keys
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

// Get multiple items
export const getMultipleItems = async (keys) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    return values.reduce((acc, [key, value]) => {
      acc[key] = value ? JSON.parse(value) : null;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error getting multiple items:', error);
    return {};
  }
};

// Set multiple items
export const setMultipleItems = async (keyValuePairs) => {
  try {
    const pairs = keyValuePairs.map(([key, value]) => [key, JSON.stringify(value)]);
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error('Error setting multiple items:', error);
    return false;
  }
};

// Remove multiple items
export const removeMultipleItems = async (keys) => {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error removing multiple items:', error);
    return false;
  }
};

export default {
  storeData,
  getData,
  removeData,
  clearAllData,
  storeToken,
  getToken,
  removeToken,
  storeUserInfo,
  getUserInfo,
  removeUserInfo,
  storeFCMToken,
  getFCMToken,
  storeNotificationSettings,
  getNotificationSettings,
  storeThemePreference,
  getThemePreference,
  getAllKeys,
  getMultipleItems,
  setMultipleItems,
  removeMultipleItems
};