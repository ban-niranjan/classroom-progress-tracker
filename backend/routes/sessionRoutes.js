const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  joinSession
} = require('../controllers/sessionController');
const { protect, restrictTo } = require('../middleware/auth');

router.route('/')
  .get(protect, getSessions)
  .post(protect, restrictTo('instructor'), createSession);

router.post('/join', protect, restrictTo('student'), joinSession);

router.route('/:id')
  .get(protect, getSession)
  .put(protect, restrictTo('instructor'), updateSession)
  .delete(protect, restrictTo('instructor'), deleteSession);

module.exports = router;