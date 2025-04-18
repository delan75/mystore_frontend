import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import * as chatService from '../../services/chatService';
import { toast } from 'react-toastify';

const BlockedUsersList = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblockingUser, setUnblockingUser] = useState(null);

  // Fetch blocked users
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        setLoading(true);
        const data = await chatService.getBlockedUsers();
        setBlockedUsers(data);
      } catch (error) {
        console.error('Error fetching blocked users:', error);
        toast.error('Failed to load blocked users');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  // Handle unblocking a user
  const handleUnblockUser = async (userId) => {
    setUnblockingUser(userId);
    try {
      await chatService.unblockUser(userId);
      setBlockedUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User has been unblocked');
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user');
    } finally {
      setUnblockingUser(null);
    }
  };

  if (loading) {
    return (
      <div className="blocked-users-loading">
        <div className="spinner">
          <i className="fas fa-spinner fa-spin fa-2x"></i>
        </div>
        <p>Loading blocked users...</p>
      </div>
    );
  }

  return (
    <div className="blocked-users-list">
      <h2 className="blocked-users-title">Blocked Users</h2>
      
      {blockedUsers.length === 0 ? (
        <div className="no-blocked-users">
          <p>You haven't blocked any users yet.</p>
          <p className="text-muted">When you block someone, they won't be able to send you messages.</p>
        </div>
      ) : (
        <div className="blocked-users-table-container">
          <table className="blocked-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Blocked Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blockedUsers.map(user => (
                <tr key={user.id}>
                  <td className="user-info">
                    <div className="user-avatar">
                      {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="user-name">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : user.username || `User ${user.id.substring(0, 6)}`}
                      </div>
                      {user.email && <div className="user-email">{user.email}</div>}
                    </div>
                  </td>
                  <td>{formatTimestamp(user.blocked_at)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => handleUnblockUser(user.id)}
                      disabled={unblockingUser === user.id}
                    >
                      {unblockingUser === user.id ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <><i className="fas fa-user-check"></i> Unblock</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlockedUsersList;
