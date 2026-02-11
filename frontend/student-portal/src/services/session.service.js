import api from './api';

export const sessionService = {
  getSessions: async () => {
    const response = await api.get('/sessions');
    return response.data;
  },

  getSession: async (id) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  joinSession: async (sessionCode) => {
    const response = await api.post('/sessions/join', { sessionCode });
    return response.data;
  },

  getCheckpoints: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}/checkpoints`);
    return response.data;
  },

  getMyProgress: async (sessionId) => {
    const response = await api.get(`/progress/session/${sessionId}/my-progress`);
    return response.data;
  }
};