const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
  markAsRead,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.post('/', protect, sendMessage);
router.get('/session/:sessionId/user/:userId', protect, getChatHistory);
router.put('/:id/read', protect, markAsRead);
router.get('/unread-count', protect, getUnreadCount);

module.exports = router;