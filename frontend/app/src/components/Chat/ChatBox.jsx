import React, { useState, useEffect, useRef } from 'react';
import { messageService } from '../../services/message.service';
import socketService from '../../services/socket.service';
import { authService } from '../../services/auth.service';
import './ChatBox.css';

function ChatBox({ sessionId, selectedStudent, instructorId, instructorName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = authService.getCurrentUser();

  const targetUserId = selectedStudent ? selectedStudent.studentId : instructorId;
  const targetUserName = selectedStudent ? selectedStudent.studentName : (instructorName || 'Instructor');

  useEffect(() => {
    if (targetUserId) {
      fetchChatHistory();
      
      // Listen for new messages
      socketService.onNewMessage((message) => {
        if (
          (message.sender._id === targetUserId && message.receiver._id === currentUser?.id) ||
          (message.sender._id === currentUser?.id && message.receiver._id === targetUserId)
        ) {
          setMessages(prev => [...prev, message]);
        }
      });
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [targetUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    setLoading(true);
    try {
      const response = await messageService.getChatHistory(sessionId, targetUserId);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !targetUserId) return;

    try {
      await messageService.sendMessage({
        sessionId,
        receiverId: targetUserId,
        messageText: newMessage
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  if (!targetUserId) {
    return (
      <div className="chat-box">
        <div className="no-student-selected">
          <p>Select a student to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h3>Chat with {targetUserName}</h3>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div className="chat-loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender._id === currentUser?.id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{message.messageText}</p>
                <span className="message-time">
                  {new Date(message.sentAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
