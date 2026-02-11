import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '../../services/session.service';
import { authService } from '../../services/auth.service';
import './MySessions.css';

function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [joinError, setJoinError] = useState('');
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await sessionService.getSessions();
      setSessions(response.sessions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const handleJoinSession = async (e) => {
    e.preventDefault();
    setJoinError('');
    
    try {
      await sessionService.joinSession(sessionCode);
      setShowJoinModal(false);
      setSessionCode('');
      fetchSessions();
    } catch (error) {
      setJoinError(error.response?.data?.message || 'Failed to join session');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-sessions">
      <header className="sessions-header">
        <h1>My Sessions</h1>
        <div className="header-right">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="sessions-content">
        <div className="sessions-actions">
          <button onClick={() => setShowJoinModal(true)} className="btn-join">
            + Join New Session
          </button>
        </div>

        <div className="sessions-grid">
          {sessions.length === 0 ? (
            <p className="no-sessions">No sessions yet. Join your first session!</p>
          ) : (
            sessions.map(session => (
              <div 
                key={session._id} 
                className="session-card"
                onClick={() => navigate(`/session/${session._id}`)}
              >
                <h3>{session.name}</h3>
                <p>{session.description || 'No description'}</p>
                <div className="session-footer">
                  <span className="instructor-name">
                    Instructor: {session.instructor?.name}
                  </span>
                  <span className={`session-status ${session.isActive ? 'active' : 'inactive'}`}>
                    {session.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Join Session</h2>
            {joinError && <div className="error-message">{joinError}</div>}
            <form onSubmit={handleJoinSession}>
              <div className="form-group">
                <label>Session Code</label>
                <input
                  type="text"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  required
                  placeholder="Enter session code"
                  maxLength={6}
                />
                <small>Ask your instructor for the session code</small>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowJoinModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Join Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MySessions;