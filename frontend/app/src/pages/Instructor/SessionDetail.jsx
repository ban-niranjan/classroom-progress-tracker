import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionService } from '../../services/session.service';
import { authService } from '../../services/auth.service';
import socketService from '../../services/socket.service';
import CheckpointManager from '../../components/Session/CheckpointManager';
import ProgressCharts from '../../components/Progress/ProgressCharts';
import StudentList from '../../components/Progress/StudentList';
import ChatBox from '../../components/Chat/ChatBox';
import './SessionDetail.css';

function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchSessionData();
    
    // Connect socket
    socketService.connect();
    socketService.joinSession(id);
    socketService.joinUser(currentUser.id);

    // Listen for real-time progress updates
    socketService.onProgressUpdate((data) => {
      console.log('Progress updated:', data);
      fetchProgressData(); // Refresh progress data
    });

    return () => {
      socketService.disconnect();
    };
  }, [id]);

  const fetchSessionData = async () => {
    try {
      const [sessionRes, checkpointsRes, progressRes] = await Promise.all([
        sessionService.getSession(id),
        sessionService.getCheckpoints(id),
        sessionService.getSessionProgress(id)
      ]);

      setSession(sessionRes.session);
      setCheckpoints(checkpointsRes.checkpoints);
      setProgressData(progressRes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching session data:', error);
      setLoading(false);
    }
  };

  const fetchProgressData = async () => {
    try {
      const progressRes = await sessionService.getSessionProgress(id);
      setProgressData(progressRes);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleCheckpointsUpdate = () => {
    fetchSessionData();
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="session-detail">
      <header className="session-header">
        <button onClick={() => navigate('/instructor')} className="btn-back">
          ← Back to Dashboard
        </button>
        <div className="session-info">
          <h1>{session?.name}</h1>
          <p>{session?.description}</p>
          <span className="session-code-badge">Code: {session?.sessionCode}</span>
        </div>
      </header>

      <div className="session-content">
        {/* Checkpoint Management */}
        <CheckpointManager 
          sessionId={id}
          checkpoints={checkpoints}
          onCheckpointsUpdate={handleCheckpointsUpdate}
        />

        {/* Progress Charts */}
        <div className="section-title">
          <h2>Real-time Progress Statistics</h2>
        </div>
        <ProgressCharts 
          stats={progressData?.stats}
          studentProgress={progressData?.studentProgress}
        />

        {/* Student Progress and Chat */}
        <div className="student-chat-section">
          <div className="student-section">
            <StudentList 
              studentProgress={progressData?.studentProgress}
              onSelectStudent={handleSelectStudent}
              selectedStudent={selectedStudent}
            />
          </div>
          <div className="chat-section">
            <ChatBox 
              sessionId={id}
              selectedStudent={selectedStudent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionDetail;