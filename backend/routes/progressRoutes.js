const express = require('express');
const router = express.Router();
const {
  updateProgress,
  getSessionProgress,
  getStudentProgress
} = require('../controllers/progressController');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/', protect, restrictTo('student'), updateProgress);
router.get('/session/:sessionId', protect, getSessionProgress);
router.get('/session/:sessionId/student/:studentId', protect, restrictTo('instructor'), getStudentProgress);
router.get('/session/:sessionId/my-progress', protect, restrictTo('student'), getStudentProgress);

module.exports = router;