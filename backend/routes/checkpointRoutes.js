const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createCheckpoint,
  getCheckpoints,
  updateCheckpoint,
  deleteCheckpoint
} = require('../controllers/checkpointController');
const { protect, restrictTo } = require('../middleware/auth');

router.route('/')
  .get(protect, getCheckpoints)
  .post(protect, restrictTo('instructor'), createCheckpoint);

router.route('/:id')
  .put(protect, restrictTo('instructor'), updateCheckpoint)
  .delete(protect, restrictTo('instructor'), deleteCheckpoint);

module.exports = router;