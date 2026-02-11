import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionService } from '../../services/session.service';
import { progressService } from '../../services/progress.service';
import { authService } from '../../services/auth.service';
import socketService from '../../services/socket.service';
import ChatBox from '../../components/Chat/ChatBox';
import './SessionCheckpoints.css';

function SessionCheckpoints() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [progress, setProgress] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchSessionData();
    
    // Connect socket
    socketService.connect();
    socketService.joinSession(id);
    socketService.joinUser(currentUser.id);

    return () => {
      socketService.disconnect();
    };
  }, [id]);

  const fetchSessionData = async () => {
    try {
      const [sessionRes, progressRes] = await Promise.all([
        sessionService.getSession(id),
        progressService.getMyProgress(id)
      ]);

      setSession(sessionRes.session);
      setProgress(progressRes.progress);
      setSummary(progressRes.summary);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching session data:', error);
      setLoading(false);
    }
  };

  const handleCheckpointToggle = async (checkpointId, currentStatus) => {
    try {
      await progressService.updateProgress(checkpointId, !currentStatus);
      fetchSessionData(); // Refresh data
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="session-checkpoints">
      <header className="checkpoints-header">
        <button onClick={() => navigate('/my-sessions')} className="btn-back">
          ← Back to My Sessions
        </button>
        <div className="session-info">
          <h1>{session?.name}</h1>
          <p>{session?.description}</p>
          <div className="session-meta">
            <span className="instructor-badge">
              Instructor: {session?.instructor?.name}
            </span>
            <button onClick={() => setShowChat(!showChat)} className="btn-chat">
              {showChat ? 'Hide Chat' : 'Chat with Instructor'}
            </button>
          </div>
        </div>
      </header>

      <div className="checkpoints-content">
        {/* Progress Summary */}
        <div className="progress-summary">
          <h2>Your Progress</h2>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">{summary?.completed || 0}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{summary?.total || 0}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{summary?.percentage || 0}%</span>
              <span className="stat-label">Progress</span>
            </div>
          </div>
          <div className="progress-bar-large">
            <div 
              className="progress-fill-large" 
              style={{ width: `${summary?.percentage || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Checkpoints List and Chat */}
        <div className="main-content-grid">
          {/* Checkpoints */}
          <div className="checkpoints-section">
            <h2>Checkpoints</h2>
            {progress.length === 0 ? (
              <p className="no-checkpoints">No checkpoints available yet</p>
            ) : (
              <div className="checkpoints-list">
                {progress.map((item, index) => (
                  <div 
                    key={item.checkpoint.id} 
                    className={`checkpoint-item ${item.isCompleted ? 'completed' : ''}`}
                  >
                    <div className="checkpoint-checkbox">
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => handleCheckpointToggle(item.checkpoint.id, item.isCompleted)}
                        id={`checkpoint-${item.checkpoint.id}`}
                      />
                      <label htmlFor={`checkpoint-${item.checkpoint.id}`}></label>
                    </div>
                    <div className="checkpoint-number">{item.checkpoint.orderNumber}</div>
                    <div className="checkpoint-details">
                      <h4>{item.checkpoint.title}</h4>
                      <p>{item.checkpoint.description}</p>
                      {item.isCompleted && item.completedAt && (
                        <span className="completed-time">
                          ✓ Completed on {new Date(item.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Section */}
          {showChat && (
            <div className="chat-section">
              <ChatBox 
                sessionId={id}
                instructorId={session?.instructor?._id}
                instructorName={session?.instructor?.name}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SessionCheckpoints;