import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import NewChatModal from '../components/chat/NewChatModal';
import BlockedUsersList from '../components/chat/BlockedUsersList';
import * as chatService from '../services/chatService';
import '../styles/Chats.css';

const Chats = ({ mode = 'my' }) => {
  const { user } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  // Polling is temporarily disabled
  const [pollingInterval] = useState(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
      setIsLoading(false);
      return data; // Return the data for use in loadData
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
      setIsLoading(false);
      return []; // Return empty array on error
    }
  }, []);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    setMessagesLoading(true);
    try {
      const data = await chatService.getConversationChats(conversationId);

      // Check if the conversation has a blocked status
      if (data && data.status === 'blocked') {
        console.log('Conversation is blocked:', data);
        // If the conversation is blocked, we still set the messages
        // but we also update the conversation with the blocked status
        setMessages(data.messages || []);

        // Update the conversation with the blocked status
        setActiveConversation(prev => ({
          ...prev,
          status: 'blocked',
          blocked_by: data.blocked_by || null,
          error_message: data.error_message || null
        }));

        // If there's an error message, show it to the user
        if (data.error_message) {
          toast.warning(data.error_message);
        }
      } else {
        // Normal case - just set the messages
        setMessages(data);

        // Mark conversation as read
        try {
          await chatService.markConversationAsRead(conversationId);
          console.log('Conversation marked as read');
        } catch (readError) {
          console.error('Error marking conversation as read:', readError);
        }
      }

      // Update the unread count in the conversations list
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
      toast.error('Failed to load messages');
      // Set empty messages array to prevent errors
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, [setMessages, setMessagesLoading, setConversations, setActiveConversation]);

  // Initialize polling for new messages
  const setupPolling = useCallback(() => {
    // Clear any existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    // Temporarily disable polling until backend is ready
    // Set up new polling interval (every 10 seconds)
    // const interval = setInterval(() => {
    //   fetchConversations();
    //
    //   if (activeConversation) {
    //     fetchMessages(activeConversation.id);
    //   }
    // }, 10000);
    //
    // setPollingInterval(interval);

    // Clean up on component unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch conversations first
        const conversationsData = await chatService.getConversations();
        setConversations(conversationsData);
        setIsLoading(false);

        // Check if we have an activeConversationId from navigation state
        const activeConversationId = location.state?.activeConversationId;
        if (activeConversationId && conversationsData.length > 0) {
          // Find the conversation in our list
          const conversation = conversationsData.find(conv => conv.id === activeConversationId);
          if (conversation) {
            // Set it as active and fetch its messages
            setActiveConversation(conversation);
            await fetchMessages(activeConversationId);
          }
        }
      } catch (error) {
        console.error('Error loading chat data:', error);
        toast.error('Failed to load chat data');
        setIsLoading(false);
      }
    };

    loadData();

    // Set up polling
    const cleanup = setupPolling();

    // If mode is 'new', automatically open the new chat modal
    if (mode === 'new') {
      setIsNewChatModalOpen(true);
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      cleanup();
    };
  }, [fetchConversations, fetchMessages, setupPolling, pollingInterval, mode, location.state]);

  // Handle conversation selection
  const handleSelectConversation = useCallback(async (conversationId) => {
    const selected = conversations.find(conv => conv.id === conversationId);
    setActiveConversation(selected);

    if (selected) {
      await fetchMessages(conversationId);
    }
  }, [conversations, fetchMessages]);

  // Send a new message
  const handleSendMessage = useCallback(async (recipientId, message) => {
    try {
      // Try to use the chatService to send the message
      const newMessage = await chatService.sendMessage(recipientId, message);

      // Add the new message to the messages list
      setMessages(prevMessages => [...prevMessages, newMessage]);

      // If this is a new conversation, refresh the conversations list
      if (!activeConversation) {
        fetchConversations();
      } else {
        // Update the latest message in the conversations list
        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.id === activeConversation.id
              ? {
                  ...conv,
                  latest_message: newMessage
                }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Check if the error is related to blocking
      if (error.message) {
        // Display the error message from the backend
        toast.error(error.message);

        // If it's a blocking-related error, update the conversation status
        if (error.message.toLowerCase().includes('cannot send') ||
            error.message.toLowerCase().includes('blocked')) {

          // Update the conversation with the blocked status
          if (activeConversation) {
            setActiveConversation(prev => ({
              ...prev,
              status: 'blocked'
            }));

            // Refresh the conversation to get the latest status
            fetchMessages(activeConversation.id);
          }
        }
      } else {
        toast.error('Failed to send message');
      }
    }
  }, [activeConversation, fetchConversations, fetchMessages, setMessages, setConversations, setActiveConversation]);

  // Delete a message
  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      // Call the API to delete the message
      await chatService.deleteMessage(messageId);

      // Remove the message from the messages list
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== messageId)
      );

      toast.success('Message deleted');

      // If this was the latest message, refresh the conversations list
      fetchConversations();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  }, [fetchConversations, setMessages]);

  // Mark conversation as read
  const handleMarkConversationAsRead = useCallback(async (conversationId) => {
    try {
      // Call the API to mark the conversation as read
      await chatService.markConversationAsRead(conversationId);
      console.log('Conversation marked as read via handleMarkConversationAsRead');

      // Update the unread count in the conversations list
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );

      // Also update the message status to 'Read' for all messages in this conversation
      // that were sent by the other user
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.sender.id !== user.id
            ? { ...msg, status: 'Read' }
            : msg
        )
      );
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  }, [setConversations, setMessages, user.id]);

  // Delete a conversation
  const handleDeleteConversation = useCallback(async (conversationId) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        // Call the API to delete the conversation
        await chatService.deleteConversation(conversationId);

        // Remove the conversation from the list
        setConversations(prevConversations =>
          prevConversations.filter(conv => conv.id !== conversationId)
        );

        // Clear the active conversation if it was deleted
        if (activeConversation && activeConversation.id === conversationId) {
          setActiveConversation(null);
          setMessages([]);
        }

        toast.success('Conversation deleted');
      } catch (error) {
        console.error('Error deleting conversation:', error);
        toast.error('Failed to delete conversation');
      }
    }
  }, [activeConversation, setActiveConversation, setMessages, setConversations]);

  // Start a new chat
  const handleStartChat = useCallback(async (userId) => {
    try {
      // Send an initial message to create the conversation
      const newMessage = await chatService.sendMessage(userId, 'Hello!');

      // Fetch conversations to get the new conversation
      await fetchConversations();

      // Find the conversation with this user
      const newConversation = conversations.find(conv =>
        conv.participants.some(p => p.id === userId)
      );

      if (newConversation) {
        // Select the new conversation
        setActiveConversation(newConversation);
        // Set messages with our initial message
        setMessages([newMessage]);
      } else {
        // If we couldn't find the conversation, create a mock one
        const mockConversation = {
          id: 'mock-conv-' + Date.now(),
          participants: [
            {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name
            },
            {
              id: userId,
              first_name: 'User',
              last_name: userId.substring(0, 5)
            }
          ],
          unread_count: 0,
          latest_message: newMessage
        };

        // Add the mock conversation to the list
        setConversations(prev => [...prev, mockConversation]);

        // Select the new conversation
        setActiveConversation(mockConversation);
        setMessages([newMessage]);
      }

      toast.success('New conversation started');
    } catch (error) {
      console.error('Error starting new chat:', error);
      toast.error('Failed to start new conversation');
    }
  }, [conversations, fetchConversations, user, setActiveConversation, setMessages, setConversations]);

  if (isLoading) {
    return (
      <div className="chats-container d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  // Get the page title based on the mode
  const getPageTitle = () => {
    switch (mode) {
      case 'new':
        return 'New Chat';
      case 'manage':
        return 'Manage Chats';
      case 'blocked':
        return 'Blocked Users';
      default:
        return 'My Chats';
    }
  };

  // Render the blocked users view
  if (mode === 'blocked') {
    return (
      <div className="chats-container">
        <div className="chats-header">
          <h1 className="chats-title">{getPageTitle()}</h1>
          <div className="chats-actions">
            <button
              onClick={() => history.push('/chats')}
              className="btn-create-chat"
            >
              <i className="fas fa-arrow-left"></i> Back to Chats
            </button>
          </div>
        </div>

        <div className="p-4">
          <BlockedUsersList />
        </div>
      </div>
    );
  }

  // Render the manage chats view for admins and managers
  if (mode === 'manage') {
    const isAdmin = user?.role === 'admin';
    const isManager = user?.role === 'manager';
    const hasManagementAccess = isAdmin || isManager;

    if (!hasManagementAccess) {
      return (
        <div className="chats-container p-4">
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            You don't have permission to access this page.
          </div>
        </div>
      );
    }

    return (
      <div className="chats-container">
        <div className="chats-header">
          <h1 className="chats-title">{getPageTitle()}</h1>
          <div className="chats-actions">
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="btn-create-chat"
            >
              <i className="fas fa-plus"></i> New Chat
            </button>
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-center text-muted">
            <i className="fas fa-info-circle mr-2"></i>
            As an administrator, you can monitor and manage all conversations in the system.
          </p>

          <div className="chats-layout mt-4">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversation?.id}
              onSelectConversation={handleSelectConversation}
              onNewChat={() => setIsNewChatModalOpen(true)}
              currentUserId={user.id}
              showAllConversations={true}
            />

            <ChatWindow
              conversation={activeConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              onDeleteMessage={handleDeleteMessage}
              onMarkConversationAsRead={handleMarkConversationAsRead}
              onDeleteConversation={handleDeleteConversation}
              currentUserId={user.id}
              loading={messagesLoading}
              isAdmin={true}
            />
          </div>
        </div>

        <NewChatModal
          isOpen={isNewChatModalOpen}
          onClose={() => setIsNewChatModalOpen(false)}
          onStartChat={handleStartChat}
          currentUserId={user.id}
        />
      </div>
    );
  }

  // Default view for regular users
  return (
    <div className="chats-container">
      <div className="chats-header">
        <h1 className="chats-title">{getPageTitle()}</h1>
        <div className="chats-actions">
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="btn-create-chat"
          >
            <i className="fas fa-plus"></i> New Chat
          </button>
        </div>
      </div>

      <div className="chats-layout">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?.id}
          onSelectConversation={handleSelectConversation}
          onNewChat={() => setIsNewChatModalOpen(true)}
          currentUserId={user.id}
        />

        <ChatWindow
          conversation={activeConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
          onMarkConversationAsRead={handleMarkConversationAsRead}
          onDeleteConversation={handleDeleteConversation}
          currentUserId={user.id}
          loading={messagesLoading}
        />
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onStartChat={handleStartChat}
        currentUserId={user.id}
      />
    </div>
  );
};

export default Chats;