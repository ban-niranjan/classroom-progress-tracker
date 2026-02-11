const Session = require('../models/Session');
const Enrollment = require('../models/Enrollment');

// Generate random session code
const generateSessionCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create Session (Instructor only)
exports.createSession = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const sessionCode = generateSessionCode();

    const session = await Session.create({
      name,
      description,
      instructor: req.user.id,
      sessionCode
    });

    res.status(201).json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Sessions
exports.getSessions = async (req, res) => {
  try {
    let sessions;

    if (req.user.role === 'instructor') {
      // Get sessions created by instructor
      sessions = await Session.find({ instructor: req.user.id })
        .populate('instructor', 'name email')
        .sort('-createdAt');
    } else {
      // Get sessions student is enrolled in
      const enrollments = await Enrollment.find({ student: req.user.id })
        .populate({
          path: 'session',
          populate: { path: 'instructor', select: 'name email' }
        });
      
      sessions = enrollments.map(enrollment => enrollment.session);
    }

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Session
exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('instructor', 'name email');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Session (Instructor only)
exports.updateSession = async (req, res) => {
  try {
    let session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is the instructor
    if (session.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this session' });
    }

    session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Session (Instructor only)
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is the instructor
    if (session.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this session' });
    }

    await session.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join Session (Student only)
exports.joinSession = async (req, res) => {
  try {
    const { sessionCode } = req.body;

    const session = await Session.findOne({ sessionCode });

    if (!session) {
      return res.status(404).json({ message: 'Invalid session code' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      session: session._id,
      student: req.user.id
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this session' });
    }

    const enrollment = await Enrollment.create({
      session: session._id,
      student: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Successfully joined session',
      enrollment,
      session
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};