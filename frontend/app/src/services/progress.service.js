import api from './api';

export const progressService = {
  updateProgress: async (checkpointId, isCompleted) => {
    const response = await api.post('/progress', {
      checkpointId,
      isCompleted
    });
    return response.data;
  },

  getMyProgress: async (sessionId) => {
    const response = await api.get(`/progress/session/${sessionId}/my-progress`);
    return response.data;
  }
};