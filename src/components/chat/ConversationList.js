import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ConversationList = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  currentUserId,
  showAllConversations = false
}) => {
  // Helper function to get the other participant in a conversation
  const getOtherParticipant = (conversation) => {
    if (showAllConversations) {
      // For admin view, show both participants
      const participants = conversation.participants || [];
      if (participants.length === 2) {
        const user1 = participants[0];
        const user2 = participants[1];
        return {
          id: 'both',
          first_name: `${user1.first_name || user1.username || 'User'} & ${user2.first_name || user2.username || 'User'}`,
          last_name: ''
        };
      }
    }

    // For regular view, just show the other participant
    return conversation.participants.find(p => p.id !== currentUserId) || {};
  };

  // Helper function to format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  // Helper function to check if a conversation has unread messages
  const hasUnreadMessages = (conversation) => {
    return conversation.unread_count > 0;
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="conversation-list">
      <div className="conversation-list-header d-flex justify-content-between align-items-center">
        <span>Conversations</span>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={onNewChat}
          title="Start a new conversation"
        >
          <i className="fas fa-plus"></i> New
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="p-3 text-center text-muted">
          <p>No conversations yet</p>
          <button
            className="btn btn-sm btn-primary"
            onClick={onNewChat}
          >
            Start a new conversation
          </button>
        </div>
      ) : (
        conversations.map(conversation => {
          const otherParticipant = getOtherParticipant(conversation);
          const isActive = activeConversationId === conversation.id;
          const isUnread = hasUnreadMessages(conversation);

          return (
            <div
              key={conversation.id}
              className={`conversation-item ${isActive ? 'active' : ''} ${isUnread ? 'unread' : ''}`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="conversation-header">
                <div className="participant-info">
                  {otherParticipant.first_name} {otherParticipant.last_name}
                </div>
                <div className="timestamp">
                  {formatTimestamp(conversation.latest_message?.created_at)}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div className="latest-message">
                  {conversation.latest_message ? truncateText(conversation.latest_message.message) : 'No messages yet'}
                </div>

                {isUnread && (
                  <div className="unread-badge">
                    {conversation.unread_count}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ConversationList;
