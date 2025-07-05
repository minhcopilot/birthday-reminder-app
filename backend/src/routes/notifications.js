const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendNotification, getNotificationHistory } = require('../controllers/notificationController');

const router = express.Router();

// All routes are protected
router.use(protect);

// POST /api/notifications/send - Send a notification
router.post('/send', sendNotification);

// GET /api/notifications/history - Get notification history
router.get('/history', getNotificationHistory);

module.exports = router; 