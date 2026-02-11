const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkpoint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Checkpoint',
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique progress per student per checkpoint
progressSchema.index({ student: 1, checkpoint: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);