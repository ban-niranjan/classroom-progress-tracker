const Checkpoint = require('../models/Checkpoint');
const Session = require('../models/Session');

// Create Checkpoint
exports.createCheckpoint = async (req, res) => {
  try {
    const { title, description, orderNumber } = req.body;
    const sessionId = req.params.sessionId;

    // Verify session exists and user is instructor
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const checkpoint = await Checkpoint.create({
      session: sessionId,
      title,
      description,
      orderNumber
    });

    res.status(201).json({
      success: true,
      checkpoint
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Checkpoints for a Session
exports.getCheckpoints = async (req, res) => {
  try {
    const checkpoints = await Checkpoint.find({ session: req.params.sessionId })
      .sort('orderNumber');

    res.status(200).json({
      success: true,
      count: checkpoints.length,
      checkpoints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Checkpoint
exports.updateCheckpoint = async (req, res) => {
  try {
    let checkpoint = await Checkpoint.findById(req.params.id).populate('session');

    if (!checkpoint) {
      return res.status(404).json({ message: 'Checkpoint not found' });
    }

    // Check authorization
    if (checkpoint.session.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    checkpoint = await Checkpoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      checkpoint
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Checkpoint
exports.deleteCheckpoint = async (req, res) => {
  try {
    const checkpoint = await Checkpoint.findById(req.params.id).populate('session');

    if (!checkpoint) {
      return res.status(404).json({ message: 'Checkpoint not found' });
    }

    // Check authorization
    if (checkpoint.session.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await checkpoint.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Checkpoint deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};