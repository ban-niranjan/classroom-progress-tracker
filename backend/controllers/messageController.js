const Message = require('../models/Message');
const Enrollment = require('../models/Enrollment');
const Session = require('../models/Session');

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { sessionId, receiverId, messageText } = req.body;

    // Verify enrollment or instructor
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const isInstructor = session.instructor.toString() === req.user.id;
    const isEnrolled = await Enrollment.findOne({
      session: sessionId,
      student: req.user.id
    });

    if (!isInstructor && !isEnrolled) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = await Message.create({
      session: sessionId,
      sender: req.user.id,
      receiver: receiverId,
      messageText
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role');

    // Emit socket event
    req.io.to(`user_${receiverId}`).emit('new_message', populatedMessage);

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Chat History
exports.getChatHistory = async (req, res) => {
  try {
    const { sessionId, userId } = req.params;

    const messages = await Message.find({
      session: sessionId,
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .sort('sentAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Message as Read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Unread Count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};