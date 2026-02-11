import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '../../services/session.service';
import { authService } from '../../services/auth.service';
import './Dashboard.css';

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
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

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await sessionService.createSession(newSession);
      setShowCreateModal(false);
      setNewSession({ name: '', description: '' });
      fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Instructor Dashboard</h1>
        <div className="header-right">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <button onClick={() => setShowCreateModal(true)} className="btn-create">
            + Create New Session
          </button>
        </div>

        <div className="sessions-grid">
          {sessions.length === 0 ? (
            <p className="no-sessions">No sessions yet. Create your first session!</p>
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
                  <span className="session-code">Code: {session.sessionCode}</span>
                  <span className={`session-status ${session.isActive ? 'active' : 'inactive'}`}>
                    {session.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Session</h2>
            <form onSubmit={handleCreateSession}>
              <div className="form-group">
                <label>Session Name</label>
                <input
                  type="text"
                  value={newSession.name}
                  onChange={(e) => setNewSession({...newSession, name: e.target.value})}
                  required
                  placeholder="e.g., Web Development - Spring 2024"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newSession.description}
                  onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                  rows="3"
                  placeholder="Brief description of the session"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;