import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import * as chatService from '../../services/chatService';
import { toast } from 'react-toastify';

const ChatWindow = ({
  conversation,
  messages,
  onSendMessage,
  onDeleteMessage,
  onMarkConversationAsRead,
  onDeleteConversation,
  currentUserId,
  loading,
  isAdmin = false
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isUserBlocked, setIsUserBlocked] = useState(false); // Current user blocked the other user
  const [isBlockedByUser, setIsBlockedByUser] = useState(false); // Current user is blocked by the other user
  const [isBlockingUser, setIsBlockingUser] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (conversation && conversation.id) {
      // Call the parent component's function to mark the conversation as read
      // This will update the unread count and message status
      onMarkConversationAsRead(conversation.id);
      console.log('Marking conversation as read on conversation change');

      // Check if the other user is blocked
      checkIfUserIsBlocked();
    }
  }, [conversation, conversation?.id, onMarkConversationAsRead]);

  // Fetch blocked users
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const data = await chatService.getBlockedUsers();
        setBlockedUsers(data);
      } catch (error) {
        console.error('Error fetching blocked users:', error);
      }
    };

    fetchBlockedUsers();
  }, []);

  // Check if the other user in the conversation is blocked or has blocked the current user
  const checkIfUserIsBlocked = () => {
    if (!conversation || !conversation.participants) return;

    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    if (!otherParticipant) return;

    // Check if the current user has blocked the other user
    const isBlocked = blockedUsers.some(user => user.id === otherParticipant.id);
    setIsUserBlocked(isBlocked);

    // Check if the current user is blocked by the other user
    // This information would typically come from the API
    // For now, we'll check if there's a 'blocked_by' property in the conversation
    const isBlockedBy = conversation.blocked_by === otherParticipant.id ||
                        (conversation.status === 'blocked' && !isBlocked);
    setIsBlockedByUser(isBlockedBy);
  };

  // Handle blocking a user
  const handleBlockUser = async () => {
    if (!conversation || !conversation.participants) return;

    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    if (!otherParticipant) return;

    setIsBlockingUser(true);
    try {
      await chatService.blockUser(otherParticipant.id);
      setIsUserBlocked(true);
      setBlockedUsers(prev => [...prev, otherParticipant]);
      toast.success(`${otherParticipant.first_name || 'User'} has been blocked`);
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user');
    } finally {
      setIsBlockingUser(false);
    }
  };

  // Handle unblocking a user
  const handleUnblockUser = async () => {
    if (!conversation || !conversation.participants) return;

    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    if (!otherParticipant) return;

    setIsBlockingUser(true);
    try {
      await chatService.unblockUser(otherParticipant.id);
      setIsUserBlocked(false);
      setBlockedUsers(prev => prev.filter(user => user.id !== otherParticipant.id));
      toast.success(`${otherParticipant.first_name || 'User'} has been unblocked`);
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user');
    } finally {
      setIsBlockingUser(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !conversation.participants) return;

    // Get the other participant's ID
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);

    if (otherParticipant) {
      onSendMessage(otherParticipant.id, newMessage);
      setNewMessage('');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  // Get the other participant's name
  const getOtherParticipantName = () => {
    if (!conversation || !conversation.participants) return '';

    // For admin view, show both participants
    if (isAdmin && conversation.participants.length === 2) {
      const user1 = conversation.participants[0];
      const user2 = conversation.participants[1];

      const getName = (user) => {
        if (user.first_name || user.last_name) {
          return `${user.first_name || ''} ${user.last_name || ''}`.trim();
        } else if (user.username) {
          return user.username;
        } else if (user.email) {
          return user.email.split('@')[0] || user.email;
        } else {
          return `User ${user.id.substring(0, 6)}`;
        }
      };

      return `${getName(user1)} & ${getName(user2)}`;
    }

    // For regular view, just show the other participant
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    if (!otherParticipant) return '';

    const firstName = otherParticipant.first_name || '';
    const lastName = otherParticipant.last_name || '';
    const email = otherParticipant.email || '';
    const username = otherParticipant.username || '';

    // Try to use name, then username, then email, then ID
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    } else if (username) {
      return username;
    } else if (email) {
      // Return email without domain if possible
      return email.split('@')[0] || email;
    } else {
      // Use ID as last resort, but make it more user-friendly
      return `User ${otherParticipant.id.substring(0, 6)}`;
    }
  };

  if (!conversation) {
    return (
      <div className="chat-window">
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="fas fa-comments"></i>
          </div>
          <h3 className="empty-state-title">No conversation selected</h3>
          <p className="empty-state-description">
            Select a conversation from the list or start a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-title">
          {getOtherParticipantName()}
          {isUserBlocked && (
            <span className="blocked-badge" title="You blocked this user">
              <i className="fas fa-ban"></i> Blocked by you
            </span>
          )}
          {isBlockedByUser && (
            <span className="blocked-badge blocked-by-badge" title="This user blocked you">
              <i className="fas fa-ban"></i> Blocked you
            </span>
          )}
        </div>
        <div className="chat-header-actions">
          {!isAdmin && (
            <button
              className={`btn btn-sm ${isUserBlocked ? 'btn-outline-success' : 'btn-outline-warning'}`}
              onClick={isUserBlocked ? handleUnblockUser : handleBlockUser}
              disabled={isBlockingUser}
              title={isUserBlocked ? 'Unblock user' : 'Block user'}
            >
              {isBlockingUser ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : isUserBlocked ? (
                <><i className="fas fa-user-check"></i> Unblock</>
              ) : (
                <><i className="fas fa-ban"></i> Block</>
              )}
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDeleteConversation(conversation.id)}
            title="Delete conversation"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin fa-2x"></i>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted p-4">
            <p>No messages yet</p>
            <p>Start the conversation by sending a message below.</p>
          </div>
        ) : (
          messages.map(message => {
            const isSentByCurrentUser = message.sender.id === currentUserId;

            return (
              <div
                key={message.id}
                className={`message ${isSentByCurrentUser ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  {isAdmin && (
                    <div className="message-sender">
                      {message.sender.first_name || message.sender.username || `User ${message.sender.id.substring(0, 6)}`}
                    </div>
                  )}
                  {message.message}
                </div>
                <div className="message-meta">
                  <span className="timestamp">{formatTimestamp(message.created_at)}</span>

                  {isSentByCurrentUser && (
                    <span className="message-status">
                      {message.status === 'Read' ? (
                        <i className="fas fa-check-double" title="Read"></i>
                      ) : (
                        <i className="fas fa-check" title="Delivered"></i>
                      )}
                    </span>
                  )}
                </div>

                {isSentByCurrentUser && (
                  <div className="message-actions">
                    <button
                      className="btn btn-sm text-white"
                      onClick={() => onDeleteMessage(message.id)}
                      title="Delete message"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {isUserBlocked || isBlockedByUser ? (
        <div className="blocked-message-container">
          <div className="blocked-message">
            <i className="fas fa-ban mr-2"></i>
            {conversation && conversation.error_message ? (
              // Display the error message from the backend if available
              <>{conversation.error_message}</>
            ) : isUserBlocked ? (
              <>You have blocked this user. Unblock to send messages.</>
            ) : (
              <>You have been blocked by this user and cannot send messages.</>
            )}
          </div>
          {isUserBlocked && (
            <button
              className="btn btn-sm btn-outline-success"
              onClick={handleUnblockUser}
              disabled={isBlockingUser}
            >
              {isBlockingUser ? (
                <i className="fas fa-spinner fa-spin mr-1"></i>
              ) : (
                <i className="fas fa-user-check mr-1"></i>
              )}
              Unblock User
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSendMessage} className="message-input-container">
          <input
            type="text"
            className="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!newMessage.trim() || loading}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      )}
    </div>
  );
};

export default ChatWindow;
