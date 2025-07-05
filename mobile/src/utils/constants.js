// API Configuration
export const API_BASE_URL = 'http://10.0.2.2:3000/api'; // Android emulator
// export const API_BASE_URL = 'http://localhost:3000/api'; // iOS simulator

// App Constants
export const APP_NAME = 'Birthday Reminder';
export const VERSION = '1.0.0';

// Screen Names
export const SCREENS = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // Main
  HOME: 'Home',
  BIRTHDAY_LIST: 'BirthdayList',
  BIRTHDAY_DETAIL: 'BirthdayDetail',
  ADD_BIRTHDAY: 'AddBirthday',
  EDIT_BIRTHDAY: 'EditBirthday',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  NOTIFICATIONS: 'Notifications',
  
  // Stack names
  AUTH_STACK: 'Auth',
  MAIN_STACK: 'Main',
  BIRTHDAY_STACK: 'BirthdayStack'
};

// Colors
export const COLORS = {
  primary: '#6200EE',
  primaryVariant: '#3700B3',
  secondary: '#03DAC6',
  secondaryVariant: '#018786',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onBackground: '#000000',
  onSurface: '#000000',
  onError: '#FFFFFF'
};

// Theme
export const THEME = {
  dark: false,
  colors: COLORS
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_INFO: 'user_info',
  FCM_TOKEN: 'fcm_token',
  NOTIFICATION_SETTINGS: 'notification_settings',
  THEME_PREFERENCE: 'theme_preference'
};

// Date Formats
export const DATE_FORMATS = {
  BIRTHDAY: 'DD/MM',
  FULL_DATE: 'DD/MM/YYYY',
  DISPLAY_DATE: 'DD MMMM, YYYY',
  TIME: 'HH:mm'
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9+\-\s()]{10,15}$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 50,
  MAX_NOTE_LENGTH: 500
};

// Notification Types
export const NOTIFICATION_TYPES = {
  BIRTHDAY_REMINDER: 'birthday_reminder',
  BIRTHDAY_TODAY: 'birthday_today',
  UPCOMING_BIRTHDAY: 'upcoming_birthday'
};

// Status Types
export const STATUS_TYPES = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  READ: 'read',
  UNREAD: 'unread'
};

// Filter Types
export const FILTER_TYPES = {
  ALL: 'all',
  UPCOMING: 'upcoming',
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month'
};

// Sort Types
export const SORT_TYPES = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  DATE_ASC: 'date_asc',
  DATE_DESC: 'date_desc',
  UPCOMING: 'upcoming'
};

// Default Values
export const DEFAULTS = {
  REMINDER_DAYS: 1,
  REMINDER_TIME: '09:00',
  NOTIFICATION_ENABLED: true,
  EMAIL_ENABLED: true,
  PUSH_ENABLED: true
};

export default {
  API_BASE_URL,
  APP_NAME,
  VERSION,
  SCREENS,
  COLORS,
  THEME,
  STORAGE_KEYS,
  DATE_FORMATS,
  VALIDATION,
  NOTIFICATION_TYPES,
  STATUS_TYPES,
  FILTER_TYPES,
  SORT_TYPES,
  DEFAULTS
};