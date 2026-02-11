import api from './api';

export const messageService = {
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  getChatHistory: async (sessionId, userId) => {
    const response = await api.get(`/messages/session/${sessionId}/user/${userId}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/messages/unread-count');
    return response.data;
  }
};