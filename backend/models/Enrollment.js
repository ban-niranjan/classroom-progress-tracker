const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a student can only enroll once per session
enrollmentSchema.index({ session: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);