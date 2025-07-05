import API from './api';

export const NotificationService = {
  // Send notification
  sendNotification: async (notificationData, token) => {
    try {
      const response = await API.sendNotification(notificationData, token);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to send notification',
        error 
      };
    }
  },

  // Get notification history
  getNotificationHistory: async (token, params = {}) => {
    try {
      const response = await API.getNotificationHistory(token, params);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to get notification history',
        error 
      };
    }
  },

  // Schedule birthday notification
  scheduleBirthdayNotification: async (birthdayId, token) => {
    try {
      const notificationData = {
        birthdayId,
        type: 'push',
        title: 'Nhắc nhở sinh nhật',
        body: 'Bạn có một sinh nhật sắp đến!'
      };
      
      const response = await API.sendNotification(notificationData, token);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to schedule notification',
        error 
      };
    }
  },

  // Send test notification
  sendTestNotification: async (token) => {
    try {
      const testData = {
        birthdayId: 1, // Test birthday ID
        type: 'push',
        title: 'Thử nghiệm thông báo',
        body: 'Đây là thông báo thử nghiệm từ Birthday Reminder App!'
      };
      
      const response = await API.sendNotification(testData, token);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to send test notification',
        error 
      };
    }
  },

  // Get notification statistics
  getNotificationStats: async (token) => {
    try {
      const response = await API.getNotificationHistory(token);
      const notifications = response.data.notifications || [];
      
      const stats = {
        total: notifications.length,
        sent: notifications.filter(n => n.status === 'sent').length,
        failed: notifications.filter(n => n.status === 'failed').length,
        pending: notifications.filter(n => n.status === 'pending').length,
        byType: {
          push: notifications.filter(n => n.type === 'push').length,
          email: notifications.filter(n => n.type === 'email').length
        }
      };
      
      return { success: true, data: stats };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to get notification stats',
        error 
      };
    }
  },

  // Validate notification data
  validateNotificationData: (data) => {
    const errors = {};
    
    if (!data.birthdayId) {
      errors.birthdayId = 'Birthday ID is required';
    }
    
    if (!data.type) {
      errors.type = 'Notification type is required';
    } else if (!['push', 'email'].includes(data.type)) {
      errors.type = 'Invalid notification type';
    }
    
    if (!data.title || data.title.trim().length === 0) {
      errors.title = 'Title is required';
    }
    
    if (!data.body || data.body.trim().length === 0) {
      errors.body = 'Body is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default NotificationService;