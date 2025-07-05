const Notification = require('../models/Notification');
const User = require('../models/User');
const Birthday = require('../models/Birthday');
const { sendPushNotification, sendEmailNotification } = require('../services/notificationService');

// Send a notification
const sendNotification = async (req, res) => {
  try {
    const { birthdayId, type, title, body } = req.body;
    const userId = req.user.id;

    // Get birthday details
    const birthday = await Birthday.findByPk(birthdayId);
    if (!birthday) {
      return res.status(404).json({ error: 'Birthday not found' });
    }

    // Check if user owns this birthday
    if (birthday.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to send notification for this birthday' });
    }

    // Get user details
    const user = await User.findByPk(userId);

    let notificationResult = null;
    
    if (type === 'push' && user.fcmToken) {
      notificationResult = await sendPushNotification(
        user.fcmToken,
        title,
        body,
        { birthdayId: birthdayId.toString() }
      );
    } else if (type === 'email') {
      notificationResult = await sendEmailNotification(
        user.email,
        title,
        body
      );
    }

    // Save notification record
    const notification = await Notification.create({
      userId,
      birthdayId,
      type,
      status: notificationResult ? 'sent' : 'failed'
    });

    res.status(201).json({
      message: 'Notification sent successfully',
      notification
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get notification history
const getNotificationHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const notifications = await Notification.findAndCountAll({
      where: { userId },
      include: [{
        model: Birthday,
        attributes: ['name', 'birthday']
      }],
      order: [['sentAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      notifications: notifications.rows,
      totalCount: notifications.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(notifications.count / parseInt(limit))
    });
  } catch (error) {
    console.error('Get notification history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  sendNotification,
  getNotificationHistory
};