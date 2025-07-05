const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// This is a placeholder for future notification endpoints
// Such as marking notifications as read, getting notification history, etc.
router.get('/', (req, res) => {
  res.json({ message: 'Notification API is working', notifications: [] });
});

module.exports = router; 