import React, { useState, useEffect } from 'react';
import { searchUsers } from '../../services/userService';

const NewChatModal = ({ isOpen, onClose, onStartChat, currentUserId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedUser(null);
      setError('');
    }
  }, [isOpen]);

  // Search for users when query changes
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Use the userService to search for users
        const results = await searchUsers(searchQuery);

        // Filter out the current user
        const filteredResults = Array.isArray(results)
          ? results.filter(user => user.id !== currentUserId)
          : [];

        if (filteredResults.length === 0) {
          console.log('No users found matching the search query');

          // Show a message to the user that no results were found
          setError(`No users found matching "${searchQuery}". Try a different search term.`);
          setSearchResults([]);
        } else {
          setSearchResults(filteredResults);
          console.log('Found users:', filteredResults);
        }
      } catch (error) {
        console.error('Error searching for users:', error);
        setError('Failed to search for users. Please try again.');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(handleSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentUserId]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleStartChat = () => {
    if (selectedUser) {
      onStartChat(selectedUser.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="new-chat-modal" onClick={onClose}>
      <div className="new-chat-modal-content" onClick={e => e.stopPropagation()}>
        <div className="new-chat-modal-header">
          <h5 className="new-chat-modal-title">New Conversation</h5>
          <button className="new-chat-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="new-chat-modal-body">
          <input
            type="text"
            className="user-search-input form-control"
            placeholder="Search for a user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="user-search-results">
            {loading ? (
              <div className="text-center p-3">
                <i className="fas fa-spinner fa-spin"></i> Searching...
              </div>
            ) : searchResults.length === 0 ? (
              searchQuery.trim().length >= 2 ? (
                <div className="text-center p-3 text-muted">
                  No users found matching "{searchQuery}"
                </div>
              ) : (
                <div className="text-center p-3 text-muted">
                  Type at least 2 characters to search
                </div>
              )
            ) : (
              searchResults.map(user => (
                <div
                  key={user.id}
                  className={`user-search-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="user-avatar">
                    {user.first_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <div className="user-name">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="user-email">
                      {user.email}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="new-chat-modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="start-chat-button"
            onClick={handleStartChat}
            disabled={!selectedUser}
          >
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
