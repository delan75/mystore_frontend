import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as chatService from '../services/chatService';
import '../styles/MessageNotification.css';

const MessageNotification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { totalUnread, unreadConversations } = await chatService.getUnreadMessagesCount();

        setUnreadCount(totalUnread);
        setUnreadMessages(unreadConversations);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // Set up polling for unread messages
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle icon click
  const handleIconClick = () => {
    if (unreadCount > 0) {
      setShowModal(!showModal);
    } else {
      // Navigate to chats page if no unread messages
      navigate('/chats');
    }
  };

  // Handle message click
  const handleMessageClick = (conversationId) => {
    setShowModal(false);
    navigate('/chats', { state: { activeConversationId: conversationId } });
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get the other participant's name
  const getOtherParticipantName = (conversation) => {
    if (!conversation || !conversation.participants) return 'Unknown';

    const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
    if (!otherParticipant) return 'Unknown';

    if (otherParticipant.first_name || otherParticipant.last_name) {
      return `${otherParticipant.first_name || ''} ${otherParticipant.last_name || ''}`.trim();
    } else if (otherParticipant.username) {
      return otherParticipant.username;
    } else {
      return `User ${otherParticipant.id.substring(0, 6)}`;
    }
  };

  return (
    <div className="message-notification">
      <div className="message-icon" onClick={handleIconClick}>
        <i className="fas fa-envelope"></i>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </div>

      {showModal && (
        <div className="message-modal" ref={modalRef}>
          <div className="message-modal-header">
            <h3>Unread Messages</h3>
            <button className="close-button" onClick={() => setShowModal(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="message-modal-body">
            {loading ? (
              <div className="loading-messages">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading messages...</p>
              </div>
            ) : unreadMessages.length > 0 ? (
              <ul className="unread-messages-list">
                {unreadMessages.map(conversation => (
                  <li
                    key={conversation.id}
                    className="unread-message-item"
                    onClick={() => handleMessageClick(conversation.id)}
                  >
                    <div className="message-sender">
                      <div className="sender-avatar">
                        {getOtherParticipantName(conversation).charAt(0).toUpperCase()}
                      </div>
                      <div className="sender-info">
                        <div className="sender-name">{getOtherParticipantName(conversation)}</div>
                        <div className="message-preview">
                          {conversation.latest_message?.message.length > 40
                            ? `${conversation.latest_message?.message.substring(0, 40)}...`
                            : conversation.latest_message?.message}
                        </div>
                      </div>
                    </div>
                    <div className="message-meta">
                      <div className="message-time">
                        {formatTimestamp(conversation.latest_message?.created_at)}
                      </div>
                      <div className="unread-count">
                        {conversation.unread_count}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-messages">
                <i className="fas fa-check-circle"></i>
                <p>No unread messages</p>
              </div>
            )}
          </div>

          <div className="message-modal-footer">
            <button
              className="view-all-button"
              onClick={() => {
                setShowModal(false);
                navigate('/chats');
              }}
            >
              View All Messages
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageNotification;
