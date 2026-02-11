const Progress = require('../models/Progress');
const Checkpoint = require('../models/Checkpoint');
const Enrollment = require('../models/Enrollment');

// Update Progress
exports.updateProgress = async (req, res) => {
  try {
    const { checkpointId, isCompleted } = req.body;

    // Find or create progress
    let progress = await Progress.findOne({
      student: req.user.id,
      checkpoint: checkpointId
    });

    if (progress) {
      progress.isCompleted = isCompleted;
      progress.completedAt = isCompleted ? new Date() : null;
      progress.updatedAt = new Date();
      await progress.save();
    } else {
      progress = await Progress.create({
        student: req.user.id,
        checkpoint: checkpointId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null
      });
    }

    // Emit socket event for real-time update
    const checkpoint = await Checkpoint.findById(checkpointId);
    req.io.to(`session_${checkpoint.session}`).emit('progress_updated', {
      studentId: req.user.id,
      studentName: req.user.name,
      checkpointId,
      isCompleted,
      sessionId: checkpoint.session
    });

    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Session Progress (All students)
exports.getSessionProgress = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // Get all checkpoints
    const checkpoints = await Checkpoint.find({ session: sessionId }).sort('orderNumber');

    // Get all enrolled students
    const enrollments = await Enrollment.find({ session: sessionId })
      .populate('student', 'name email');

    // Get all progress records
    const progressRecords = await Progress.find({
      checkpoint: { $in: checkpoints.map(c => c._id) }
    }).populate('student', 'name email');

    // Calculate statistics
    const stats = checkpoints.map(checkpoint => {
      const checkpointProgress = progressRecords.filter(
        p => p.checkpoint.toString() === checkpoint._id.toString()
      );
      const completed = checkpointProgress.filter(p => p.isCompleted).length;
      const total = enrollments.length;

      return {
        checkpointId: checkpoint._id,
        checkpointTitle: checkpoint.title,
        completed,
        total,
        percentage: total > 0 ? ((completed / total) * 100).toFixed(2) : 0
      };
    });

    // Student-wise progress
    const studentProgress = enrollments.map(enrollment => {
      const studentRecords = progressRecords.filter(
        p => p.student._id.toString() === enrollment.student._id.toString()
      );
      const completed = studentRecords.filter(p => p.isCompleted).length;

      return {
        studentId: enrollment.student._id,
        studentName: enrollment.student.name,
        studentEmail: enrollment.student.email,
        completedCheckpoints: completed,
        totalCheckpoints: checkpoints.length,
        percentage: checkpoints.length > 0 
          ? ((completed / checkpoints.length) * 100).toFixed(2) 
          : 0,
        checkpoints: checkpoints.map(cp => {
          const prog = studentRecords.find(
            p => p.checkpoint.toString() === cp._id.toString()
          );
          return {
            checkpointId: cp._id,
            title: cp.title,
            isCompleted: prog ? prog.isCompleted : false,
            completedAt: prog ? prog.completedAt : null
          };
        })
      };
    });

    res.status(200).json({
      success: true,
      stats,
      studentProgress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student Progress
exports.getStudentProgress = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const studentId = req.user.role === 'student' ? req.user.id : req.params.studentId;

    const checkpoints = await Checkpoint.find({ session: sessionId }).sort('orderNumber');

    const progressRecords = await Progress.find({
      student: studentId,
      checkpoint: { $in: checkpoints.map(c => c._id) }
    });

    const progress = checkpoints.map(checkpoint => {
      const prog = progressRecords.find(
        p => p.checkpoint.toString() === checkpoint._id.toString()
      );

      return {
        checkpoint: {
          id: checkpoint._id,
          title: checkpoint.title,
          description: checkpoint.description,
          orderNumber: checkpoint.orderNumber
        },
        isCompleted: prog ? prog.isCompleted : false,
        completedAt: prog ? prog.completedAt : null
      };
    });

    const completed = progress.filter(p => p.isCompleted).length;

    res.status(200).json({
      success: true,
      progress,
      summary: {
        total: checkpoints.length,
        completed,
        percentage: checkpoints.length > 0 
          ? ((completed / checkpoints.length) * 100).toFixed(2) 
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};