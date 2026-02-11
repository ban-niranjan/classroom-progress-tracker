import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(SOCKET_URL);
    
    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinSession(sessionId) {
    if (this.socket) {
      this.socket.emit('join_session', sessionId);
    }
  }

  joinUser(userId) {
    if (this.socket) {
      this.socket.emit('join_user', userId);
    }
  }

  onProgressUpdate(callback) {
    if (this.socket) {
      this.socket.on('progress_updated', callback);
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();