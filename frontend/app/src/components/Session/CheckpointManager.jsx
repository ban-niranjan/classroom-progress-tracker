import React, { useState } from 'react';
import { sessionService } from '../../services/session.service';
import './CheckpointManager.css';

function CheckpointManager({ sessionId, checkpoints, onCheckpointsUpdate }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCheckpoint, setNewCheckpoint] = useState({
    title: '',
    description: '',
    orderNumber: checkpoints.length + 1
  });
  const [editingCheckpoint, setEditingCheckpoint] = useState(null);

  const handleAddCheckpoint = async (e) => {
    e.preventDefault();
    try {
      await sessionService.createCheckpoint(sessionId, newCheckpoint);
      setShowAddModal(false);
      setNewCheckpoint({
        title: '',
        description: '',
        orderNumber: checkpoints.length + 2
      });
      onCheckpointsUpdate();
    } catch (error) {
      console.error('Error creating checkpoint:', error);
      alert('Failed to create checkpoint');
    }
  };

  const handleDeleteCheckpoint = async (checkpointId) => {
    if (!window.confirm('Are you sure you want to delete this checkpoint?')) return;
    
    try {
      await sessionService.deleteCheckpoint(sessionId, checkpointId);
      onCheckpointsUpdate();
    } catch (error) {
      console.error('Error deleting checkpoint:', error);
      alert('Failed to delete checkpoint');
    }
  };

  const handleEditCheckpoint = async (e) => {
    e.preventDefault();
    try {
      await sessionService.updateCheckpoint(sessionId, editingCheckpoint._id, {
        title: editingCheckpoint.title,
        description: editingCheckpoint.description,
        orderNumber: editingCheckpoint.orderNumber
      });
      setEditingCheckpoint(null);
      onCheckpointsUpdate();
    } catch (error) {
      console.error('Error updating checkpoint:', error);
      alert('Failed to update checkpoint');
    }
  };

  return (
    <div className="checkpoint-manager">
      <div className="checkpoint-header">
        <h3>Checkpoints</h3>
        <button onClick={() => setShowAddModal(true)} className="btn-add-checkpoint">
          + Add Checkpoint
        </button>
      </div>

      <div className="checkpoints-list">
        {checkpoints.length === 0 ? (
          <p className="no-checkpoints">No checkpoints yet. Add your first checkpoint!</p>
        ) : (
          checkpoints.map((checkpoint) => (
            <div key={checkpoint._id} className="checkpoint-item">
              <div className="checkpoint-number">{checkpoint.orderNumber}</div>
              <div className="checkpoint-details">
                <h4>{checkpoint.title}</h4>
                <p>{checkpoint.description}</p>
              </div>
              <div className="checkpoint-actions">
                <button 
                  onClick={() => setEditingCheckpoint(checkpoint)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteCheckpoint(checkpoint._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Checkpoint Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Checkpoint</h2>
            <form onSubmit={handleAddCheckpoint}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newCheckpoint.title}
                  onChange={(e) => setNewCheckpoint({...newCheckpoint, title: e.target.value})}
                  required
                  placeholder="e.g., Complete Chapter 1"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newCheckpoint.description}
                  onChange={(e) => setNewCheckpoint({...newCheckpoint, description: e.target.value})}
                  rows="3"
                  placeholder="Brief description of the checkpoint"
                />
              </div>
              <div className="form-group">
                <label>Order Number</label>
                <input
                  type="number"
                  value={newCheckpoint.orderNumber}
                  onChange={(e) => setNewCheckpoint({...newCheckpoint, orderNumber: parseInt(e.target.value)})}
                  required
                  min="1"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Checkpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Checkpoint Modal */}
      {editingCheckpoint && (
        <div className="modal-overlay" onClick={() => setEditingCheckpoint(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Checkpoint</h2>
            <form onSubmit={handleEditCheckpoint}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editingCheckpoint.title}
                  onChange={(e) => setEditingCheckpoint({...editingCheckpoint, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingCheckpoint.description}
                  onChange={(e) => setEditingCheckpoint({...editingCheckpoint, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Order Number</label>
                <input
                  type="number"
                  value={editingCheckpoint.orderNumber}
                  onChange={(e) => setEditingCheckpoint({...editingCheckpoint, orderNumber: parseInt(e.target.value)})}
                  required
                  min="1"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setEditingCheckpoint(null)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Checkpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckpointManager;