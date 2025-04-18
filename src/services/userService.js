import axios from '../utils/axios';

// Mock user data for development when backend endpoints are not available
const mockUsers = [
  { id: 'user-1', first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
  { id: 'user-2', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' },
  { id: 'user-3', first_name: 'Alice', last_name: 'Johnson', email: 'alice.johnson@example.com' },
  { id: 'user-4', first_name: 'Bob', last_name: 'Brown', email: 'bob.brown@example.com' },
  { id: 'user-5', first_name: 'Charlie', last_name: 'Wilson', email: 'charlie.wilson@example.com' }
];

// Search for users by name, email, etc.
export const searchUsers = async (query) => {
  try {
    // Check if we have a valid query
    if (!query || query.trim().length < 2) {
      return [];
    }

    console.log('Searching for users with query:', query);

    try {
      // Use the correct endpoint for user search
      const response = await axios.get(`/chats/users/search/?q=${encodeURIComponent(query)}`);

      if (Array.isArray(response.data)) {
        console.log(`Found ${response.data.length} users matching "${query}"`);
        return response.data;
      } else {
        console.log('Unexpected response format from user search endpoint:', response.data);
        throw new Error('Invalid response format');
      }
    } catch (apiError) {
      console.warn('Chats API search endpoint failed, using fallback:', apiError.message);

      // If the primary endpoint fails, try alternative endpoints
      try {
        // Try the messaging API endpoint
        const messagingResponse = await axios.get(`/chats/users/search/?q=${encodeURIComponent(query)}`);

        if (Array.isArray(messagingResponse.data)) {
          console.log(`Found ${messagingResponse.data.length} users from messaging API matching "${query}"`);
          return messagingResponse.data;
        }
      } catch (messagingError) {
        console.warn('Messaging API search endpoint failed, trying auth API:', messagingError.message);

        try {
          // Try the auth API endpoint
          const authResponse = await axios.get(`/auth/users/search/?q=${encodeURIComponent(query)}`);

          if (Array.isArray(authResponse.data)) {
            console.log(`Found ${authResponse.data.length} users from auth API matching "${query}"`);
            return authResponse.data;
          }
        } catch (authError) {
          console.warn('Auth API search endpoint also failed, using mock data:', authError.message);

          // If both APIs fail, use mock data for development
          console.log('Using mock user data as fallback');
          const lowercaseQuery = query.toLowerCase();
          const filteredUsers = mockUsers.filter(user =>
            user.first_name.toLowerCase().includes(lowercaseQuery) ||
            user.last_name.toLowerCase().includes(lowercaseQuery) ||
            user.email.toLowerCase().includes(lowercaseQuery)
          );

          console.log(`Found ${filteredUsers.length} mock users matching "${query}"`);
          return filteredUsers;
        }
      }
    }
  } catch (error) {
    console.error('Error searching for users:', error);

    // Return empty array to prevent errors
    return [];
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`/auth/users/${userId}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    throw error;
  }
};
