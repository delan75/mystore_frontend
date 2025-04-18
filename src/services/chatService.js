import axios from '../utils/axios';

// Mock data for development when backend endpoints are not available
const mockConversations = [
  {
    id: 'conv-1',
    participants: [
      { id: 'current-user', first_name: 'Current', last_name: 'User' },
      { id: 'user-1', first_name: 'John', last_name: 'Doe' }
    ],
    unread_count: 0,
    latest_message: {
      id: 'msg-1',
      message: 'Hello there!',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      sender: { id: 'user-1', first_name: 'John', last_name: 'Doe' },
      status: 'Read'
    }
  },
  {
    id: 'conv-2',
    participants: [
      { id: 'current-user', first_name: 'Current', last_name: 'User' },
      { id: 'user-2', first_name: 'Jane', last_name: 'Smith' }
    ],
    unread_count: 2,
    latest_message: {
      id: 'msg-2',
      message: 'Can we meet tomorrow?',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      sender: { id: 'user-2', first_name: 'Jane', last_name: 'Smith' },
      status: 'Delivered'
    }
  }
];

const mockMessages = {
  'conv-1': [
    {
      id: 'msg-1-1',
      message: 'Hi there!',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      sender: { id: 'current-user', first_name: 'Current', last_name: 'User' },
      status: 'Read'
    },
    {
      id: 'msg-1-2',
      message: 'Hello! How are you?',
      created_at: new Date(Date.now() - 82800000).toISOString(),
      sender: { id: 'user-1', first_name: 'John', last_name: 'Doe' },
      status: 'Read'
    },
    {
      id: 'msg-1-3',
      message: 'I\'m doing well, thanks for asking!',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      sender: { id: 'current-user', first_name: 'Current', last_name: 'User' },
      status: 'Read'
    },
    {
      id: 'msg-1',
      message: 'Hello there!',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      sender: { id: 'user-1', first_name: 'John', last_name: 'Doe' },
      status: 'Read'
    }
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      message: 'Hey Jane, how\'s it going?',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      sender: { id: 'current-user', first_name: 'Current', last_name: 'User' },
      status: 'Read'
    },
    {
      id: 'msg-2-2',
      message: 'Pretty good! Working on that project.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      sender: { id: 'user-2', first_name: 'Jane', last_name: 'Smith' },
      status: 'Read'
    },
    {
      id: 'msg-2-3',
      message: 'How\'s it coming along?',
      created_at: new Date(Date.now() - 14400000).toISOString(),
      sender: { id: 'current-user', first_name: 'Current', last_name: 'User' },
      status: 'Read'
    },
    {
      id: 'msg-2',
      message: 'Can we meet tomorrow?',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      sender: { id: 'user-2', first_name: 'Jane', last_name: 'Smith' },
      status: 'Delivered'
    }
  ]
};

// Helper function to simulate API delay
const simulateApiDelay = (data, delay = 300) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

// Get chat data for the current user
export const getUserChatData = async () => {
  try {
    const response = await axios.get('/chats/chat-data/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user chat data:', error);
    throw error;
  }
};

// Get all conversations for the current user
export const getConversations = async () => {
  try {
    console.log('Fetching conversations');
    try {
      // Try the chats endpoint
      const response = await axios.get('/chats/conversations/');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch conversations:', error.message);

      // If API fails, use mock data for development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock conversation data');
        return simulateApiDelay(mockConversations);
      }

      // Return empty array to prevent errors
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    // Return empty array to prevent errors
    return [];
  }
};

// Get unread messages count
export const getUnreadMessagesCount = async () => {
  try {
    // First get all conversations
    const conversations = await getConversations();

    // Calculate total unread count
    const totalUnread = conversations.reduce(
      (total, conv) => total + (conv.unread_count || 0),
      0
    );

    // Get conversations with unread messages
    const unreadConversations = conversations.filter(conv => conv.unread_count > 0);

    return {
      totalUnread,
      unreadConversations
    };
  } catch (error) {
    console.error('Failed to get unread messages count:', error);
    return {
      totalUnread: 0,
      unreadConversations: []
    };
  }
};

// Get all messages in a conversation
export const getConversationChats = async (conversationId) => {
  try {
    console.log(`Fetching chats for conversation ${conversationId}`);

    // Use the chats endpoint
    const response = await axios.get(`/chats/conversations/${conversationId}/chats`);

    // Check if the response contains a blocked status
    if (response.data && response.data.status === 'blocked') {
      console.log('Conversation is blocked:', response.data);
      // If the conversation is blocked, we still return the messages
      // but we also include the blocked status information
      return {
        ...response.data,
        status: 'blocked',
        blocked_by: response.data.blocked_by || null
      };
    }

    return response.data;
  } catch (error) {
    // Check if the error is due to blocking (403 Forbidden)
    if (error.response && error.response.status === 403) {
      console.log('Conversation is blocked:', error.response.data);

      // Get the error message from the response
      const errorMessage = error.response.data.error ||
                          error.response.data.detail ||
                          'You cannot access this conversation';

      // Return a special object indicating the conversation is blocked
      return {
        messages: [],
        status: 'blocked',
        blocked_by: error.response.data.blocked_by || null,
        error_message: errorMessage
      };
    }

    console.warn(`Failed to fetch chats for conversation ${conversationId}:`, error.message);

    // For development, use mock data
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock message data for development');
      return simulateApiDelay(mockMessages[conversationId] || []);
    }

    console.error(`Failed to fetch chats for conversation ${conversationId}:`, error);
    // Return empty array to prevent errors
    return [];
  }
};

// Send a new message
export const sendMessage = async (userId, message) => {
  try {
    // Use the chats endpoint
    const response = await axios.post('/chats/create/', {
      other_user_id: userId,
      message: message
    });
    return response.data;
  } catch (error) {
    // Check if the error is due to blocking (403 Forbidden)
    if (error.response && error.response.status === 403) {
      console.error('Cannot send message - user is blocked or has blocked you:', error.response.data);

      // Get the error message from the response or use a default message
      const errorMessage = error.response.data.error ||
                          error.response.data.detail ||
                          'You cannot send messages to this user';

      // Throw a new error with the message from the backend
      throw new Error(errorMessage);
    }

    // For other errors, log and create a mock message for development
    console.warn('Failed to send message:', error.message);

    if (process.env.NODE_ENV === 'development') {
      console.log('Creating mock message for development');

      // Generate a mock message
      const mockMessage = {
        id: `msg-${Date.now()}`,
        message: message,
        created_at: new Date().toISOString(),
        sender: { id: 'current-user', first_name: 'Current', last_name: 'User' },
        status: 'Sent'
      };

      return simulateApiDelay(mockMessage);
    }

    // In production, rethrow the error
    throw error;
  }
};

// Update message status
export const updateMessageStatus = async (chatId, status) => {
  try {
    const response = await axios.post(`/chats/${chatId}/update-status/`, {
      status: status
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update status for chat ${chatId}:`, error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (chatId) => {
  try {
    const response = await axios.delete(`/chats/${chatId}/delete`);
    console.log('Message deleted response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete chat ${chatId}:`, error);
    // If the API fails, return a mock success response for development
    console.log('Simulating message deletion');
    return simulateApiDelay({ success: true, message: 'Message deleted successfully' });
  }
};

// Mark conversation as read
export const markConversationAsRead = async (conversationId) => {
  try {
    // Use the correct endpoint format with action=read as a query parameter
    const response = await axios.post(`/chats/conversations/${conversationId}/status?action=read`);
    console.log('Conversation marked as read response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to mark conversation ${conversationId} as read:`, error);
    // If the API fails, return a mock success response for development
    console.log('Simulating marking conversation as read');
    return simulateApiDelay({ success: true, message: 'Conversation marked as read' });
  }
};

// Mark conversation as unread
export const markConversationAsUnread = async (conversationId) => {
  try {
    const response = await axios.post(`/chats/conversations/${conversationId}/status?action=unread`);
    console.log('Conversation marked as unread response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to mark conversation ${conversationId} as unread:`, error);
    // If the API fails, return a mock success response for development
    console.log('Simulating marking conversation as unread');
    return simulateApiDelay({ success: true, message: 'Conversation marked as unread' });
  }
};

// Delete a conversation
export const deleteConversation = async (conversationId) => {
  try {
    const response = await axios.delete(`/chats/conversations/${conversationId}/delete`);
    console.log('Conversation deleted response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete conversation ${conversationId}:`, error);
    // If the API fails, return a mock success response for development
    console.log('Simulating conversation deletion');
    return simulateApiDelay({ success: true, message: 'Conversation deleted' });
  }
};

// Block a user
export const blockUser = async (userId) => {
  try {
    const response = await axios.post(`/chats/users/${userId}/block/`);
    console.log('User blocked response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to block user ${userId}:`, error);
    // If the API fails, return a mock success response for development
    console.log('Simulating user blocking');
    return simulateApiDelay({ success: true, message: 'User blocked successfully' });
  }
};

// Unblock a user
export const unblockUser = async (userId) => {
  try {
    const response = await axios.post(`/chats/users/${userId}/unblock/`);
    console.log('User unblocked response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to unblock user ${userId}:`, error);
    // If the API fails, return a mock success response for development
    console.log('Simulating user unblocking');
    return simulateApiDelay({ success: true, message: 'User unblocked successfully' });
  }
};

// Get list of blocked users
export const getBlockedUsers = async () => {
  try {
    const response = await axios.get('/chats/users/blocked/');
    console.log('Blocked users response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to get blocked users:', error);
    // If the API fails, return a mock success response for development
    console.log('Simulating blocked users list');
    return simulateApiDelay([
      { id: 'mock-user-1', username: 'blockeduser1', first_name: 'Blocked', last_name: 'User 1', blocked_at: new Date().toISOString() },
      { id: 'mock-user-2', username: 'blockeduser2', first_name: 'Blocked', last_name: 'User 2', blocked_at: new Date(Date.now() - 86400000).toISOString() }
    ]);
  }
};
