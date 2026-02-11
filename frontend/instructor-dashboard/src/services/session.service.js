import api from './api';

export const sessionService = {
  createSession: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get('/sessions');
    return response.data;
  },

  getSession: async (id) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  updateSession: async (id, sessionData) => {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data;
  },

  deleteSession: async (id) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  },

  // Checkpoints
  createCheckpoint: async (sessionId, checkpointData) => {
    const response = await api.post(`/sessions/${sessionId}/checkpoints`, checkpointData);
    return response.data;
  },

  getCheckpoints: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}/checkpoints`);
    return response.data;
  },

  updateCheckpoint: async (sessionId, checkpointId, checkpointData) => {
    const response = await api.put(`/sessions/${sessionId}/checkpoints/${checkpointId}`, checkpointData);
    return response.data;
  },

  deleteCheckpoint: async (sessionId, checkpointId) => {
    const response = await api.delete(`/sessions/${sessionId}/checkpoints/${checkpointId}`);
    return response.data;
  },

  // Progress
  getSessionProgress: async (sessionId) => {
    const response = await api.get(`/progress/session/${sessionId}`);
    return response.data;
  }
};