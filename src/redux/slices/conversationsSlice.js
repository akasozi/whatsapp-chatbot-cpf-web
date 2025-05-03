import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ConversationsService from '../../services/conversations';

// Fetch conversations list
export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await ConversationsService.getConversations(filters);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch conversations');
    }
  }
);

// Fetch conversation details with messages
export const fetchConversationDetails = createAsyncThunk(
  'conversations/fetchConversationDetails',
  async (conversationId, { rejectWithValue }) => {
    try {
      return await ConversationsService.getConversationDetails(conversationId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch conversation details');
    }
  }
);

// Send message
export const sendMessage = createAsyncThunk(
  'conversations/sendMessage',
  async ({ conversationId, content, attachments = [], issueId = null }, { rejectWithValue }) => {
    try {
      return await ConversationsService.sendMessage(conversationId, content, attachments, issueId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

// Update conversation status
export const updateConversationStatus = createAsyncThunk(
  'conversations/updateStatus',
  async ({ conversationId, status }, { rejectWithValue }) => {
    try {
      return await ConversationsService.updateConversationStatus(conversationId, status);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update conversation status');
    }
  }
);

// Assign conversation to agent
export const assignConversation = createAsyncThunk(
  'conversations/assign',
  async ({ conversationId, agentId }, { rejectWithValue }) => {
    try {
      return await ConversationsService.assignConversation(conversationId, agentId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to assign conversation');
    }
  }
);

// Upload attachment
export const uploadAttachment = createAsyncThunk(
  'conversations/uploadAttachment',
  async (file, { rejectWithValue }) => {
    try {
      return await ConversationsService.uploadAttachment(file);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload attachment');
    }
  }
);

// Get attachment
export const getAttachment = createAsyncThunk(
  'conversations/getAttachment',
  async (attachmentId, { rejectWithValue }) => {
    try {
      return await ConversationsService.getAttachment(attachmentId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get attachment');
    }
  }
);

// Mark conversation as seen/read
export const markConversationAsSeen = createAsyncThunk(
  'conversations/markConversationAsSeen',
  async (conversationId, { rejectWithValue }) => {
    try {
      return await ConversationsService.markConversationAsSeen(conversationId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark conversation as seen');
    }
  }
);

// Fetch unread message statistics
export const fetchUnreadStats = createAsyncThunk(
  'conversations/fetchUnreadStats',
  async (_, { rejectWithValue }) => {
    try {
      return await ConversationsService.getUnreadStats();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch unread statistics');
    }
  }
);

const initialState = {
  // Normalized conversations data
  byId: {},
  allIds: [],
  
  // Current view state
  selectedConversationId: null,
  
  // Fetched messages for the selected conversation
  messages: [],
  
  // Unread messages tracking
  unreadCounts: {}, // Map of conversation ID to unread count
  unreadMessageIds: {}, // Map of conversation ID to array of unread message IDs
  totalUnreadMessages: 0, // Total number of unread messages across all conversations
  conversationsWithUnread: [], // Array of conversation IDs with unread messages
  
  // UI state
  isLoading: false,
  loadingStatus: {
    fetchConversations: 'idle',
    fetchConversationDetails: 'idle',
    sendMessage: 'idle',
    uploadAttachment: 'idle',
    markConversationAsSeen: 'idle',
    fetchUnreadStats: 'idle',
  },
  error: null,
  
  // Attachment handling
  attachments: [], // Pending attachments for current message
  uploadProgress: null,
  
  // Filters 
  activeFilters: {
    status: null,
    assignedTo: null,
    hasOpenIssues: null,
    searchTerm: '',
  }
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    selectConversation: (state, action) => {
      const newSelectedId = action.payload;
      state.selectedConversationId = newSelectedId;
      
      // When selecting a conversation, clear its unread count
      if (newSelectedId) {
        // Clear unread count for this conversation
        state.unreadCounts[newSelectedId] = 0;
      }
    },
    
    clearSelectedConversation: (state) => {
      state.selectedConversationId = null;
      state.messages = [];
    },
    
    addMessage: (state, action) => {
      const message = action.payload;
      const conversationId = message.conversation_id;
      
      // Add message to the conversation's messages array if it's the currently selected one
      if (state.selectedConversationId === conversationId) {
        state.messages.push(message);
      }
      
      // Update the last message in the conversation object
      if (state.byId[conversationId]) {
        state.byId[conversationId].lastMessage = {
          content: message.content,
          created_at: message.created_at,
          direction: message.direction,
          source: message.source
        };
        state.byId[conversationId].last_activity = message.created_at;
        
        // Track unread messages when they're from the user (not from the agent)
        // and the conversation is not currently selected
        if (
          (message.source === 'USER' || message.direction === 'INBOUND') && 
          state.selectedConversationId !== conversationId
        ) {
          // Increment unread count for this conversation
          const currentCount = state.unreadCounts[conversationId] || 0;
          state.unreadCounts[conversationId] = currentCount + 1;
        }
        
        // If the conversation was RESOLVED or DORMANT, set it to ACTIVE
        if (['RESOLVED', 'DORMANT'].includes(state.byId[conversationId].status)) {
          state.byId[conversationId].status = 'ACTIVE';
        }
      }
    },
    
    addAttachment: (state, action) => {
      state.attachments.push(action.payload);
    },
    
    removeAttachment: (state, action) => {
      state.attachments = state.attachments.filter(att => att.id !== action.payload);
    },
    
    clearAttachments: (state) => {
      state.attachments = [];
    },
    
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    
    clearMessages: (state) => {
      state.messages = [];
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    updateFilters: (state, action) => {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload
      };
    },
    
    clearFilters: (state) => {
      state.activeFilters = {
        status: null,
        assignedTo: null,
        hasOpenIssues: null,
        searchTerm: '',
      };
    },
    
    markMessagesAsRead: (state, action) => {
      const { conversationId, messageIds } = action.payload;
      
      // Reset unread count for the conversation
      if (conversationId) {
        // Get previous unread count for this conversation
        const prevCount = state.unreadCounts[conversationId] || 0;
        
        // Reset unread count in the conversation object
        if (state.byId[conversationId]) {
          state.byId[conversationId].unread_count = 0;
          state.byId[conversationId].has_unseen_messages = false;
        }
        
        // Reset unread count in the unreadCounts map
        state.unreadCounts[conversationId] = 0;
        
        // Clear unread message IDs for this conversation
        state.unreadMessageIds[conversationId] = [];
        
        // Update total unread count
        state.totalUnreadMessages = Math.max(0, state.totalUnreadMessages - prevCount);
        
        // Remove from conversations with unread
        state.conversationsWithUnread = state.conversationsWithUnread.filter(id => id !== conversationId);
      }
    },
    
    updateUnreadStats: (state, action) => {
      const { total_unread_messages, conversations_with_unread, conversation_unread_counts } = action.payload;
      
      // Update total count
      state.totalUnreadMessages = total_unread_messages;
      
      // Update conversations with unread
      state.conversationsWithUnread = conversations_with_unread;
      
      // Update individual counts
      Object.entries(conversation_unread_counts).forEach(([convId, count]) => {
        state.unreadCounts[convId] = count;
        
        // Update conversation object if it exists
        if (state.byId[convId]) {
          state.byId[convId].unread_count = count;
          state.byId[convId].has_unseen_messages = count > 0;
        }
      });
    },
    
    // Mark specific messages as unread
    markMessagesAsUnread: (state, action) => {
      const { conversationId, messageIds } = action.payload;
      
      if (conversationId && messageIds?.length) {
        // Store unread message IDs
        if (!state.unreadMessageIds[conversationId]) {
          state.unreadMessageIds[conversationId] = [];
        }
        
        // Add new message IDs (avoiding duplicates)
        messageIds.forEach(id => {
          if (!state.unreadMessageIds[conversationId].includes(id)) {
            state.unreadMessageIds[conversationId].push(id);
          }
        });
        
        // Update unread count
        state.unreadCounts[conversationId] = state.unreadMessageIds[conversationId].length;
        
        // Update conversation object
        if (state.byId[conversationId]) {
          state.byId[conversationId].unread_count = state.unreadMessageIds[conversationId].length;
          state.byId[conversationId].has_unseen_messages = true;
        }
        
        // Add to conversations with unread if not already there
        if (!state.conversationsWithUnread.includes(conversationId)) {
          state.conversationsWithUnread.push(conversationId);
        }
        
        // Update total unread count
        state.totalUnreadMessages = Object.values(state.unreadCounts).reduce((sum, count) => sum + count, 0);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loadingStatus.fetchConversations = 'pending';
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loadingStatus.fetchConversations = 'succeeded';
        
        // Store previous unread counts before we reset the state
        const previousUnreadCounts = {};
        state.allIds.forEach(id => {
          if (state.byId[id]?.unread_count > 0) {
            previousUnreadCounts[id] = state.byId[id].unread_count;
          }
        });
        
        // Normalize the data
        state.byId = {};
        state.allIds = [];
        
        action.payload.forEach(conversation => {
          // Create a copy of the conversation
          const conversationWithUnread = { ...conversation };
          
          // If we previously had an unread count for this conversation, restore it
          if (previousUnreadCounts[conversation.id]) {
            conversationWithUnread.unread_count = previousUnreadCounts[conversation.id];
          }
          
          // Store the conversation
          state.byId[conversation.id] = conversationWithUnread;
          state.allIds.push(conversation.id);
        });
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loadingStatus.fetchConversations = 'failed';
        state.error = action.payload;
      })
      
      // Fetch conversation details
      .addCase(fetchConversationDetails.pending, (state) => {
        state.loadingStatus.fetchConversationDetails = 'pending';
        state.error = null;
      })
      .addCase(fetchConversationDetails.fulfilled, (state, action) => {
        state.loadingStatus.fetchConversationDetails = 'succeeded';
        
        const { conversation, messages } = action.payload;
        const conversationId = conversation.id;
        
        // Update conversation details
        state.byId[conversationId] = {
          ...state.byId[conversationId],
          ...conversation
        };
        
        // Set messages
        state.messages = messages;
        
        // Mark all messages as read for this conversation since we're viewing it
        state.unreadCounts[conversationId] = 0;
        
        // Ensure this conversation is in our list
        if (!state.allIds.includes(conversationId)) {
          state.allIds.push(conversationId);
        }
        
        // Clear any pending attachments
        state.attachments = []; 
      })
      .addCase(fetchConversationDetails.rejected, (state, action) => {
        state.loadingStatus.fetchConversationDetails = 'failed';
        state.error = action.payload;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loadingStatus.sendMessage = 'pending';
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loadingStatus.sendMessage = 'succeeded';
        const message = action.payload;
        
        // Add message to state
        state.messages.push(message);
        
        // Update conversation last message
        const conversationId = message.conversation_id;
        if (state.byId[conversationId]) {
          state.byId[conversationId].lastMessage = {
            content: message.content,
            created_at: message.created_at,
            direction: message.direction,
            source: message.source
          };
          state.byId[conversationId].last_activity = message.created_at;
        }
        
        // Clear attachments
        state.attachments = [];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loadingStatus.sendMessage = 'failed';
        state.error = action.payload;
      })
      
      // Update conversation status
      .addCase(updateConversationStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        if (state.byId[id]) {
          state.byId[id].status = status;
        }
      })
      
      // Assign conversation
      .addCase(assignConversation.fulfilled, (state, action) => {
        const { id, assignee_id, assignment_history } = action.payload;
        if (state.byId[id]) {
          state.byId[id].assignee_id = assignee_id;
          state.byId[id].assignment_history = assignment_history;
        }
      })
      
      // Upload attachment
      .addCase(uploadAttachment.pending, (state) => {
        state.uploadProgress = 0;
        state.loadingStatus.uploadAttachment = 'pending';
      })
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        state.uploadProgress = 100;
        state.loadingStatus.uploadAttachment = 'succeeded';
        state.attachments.push(action.payload);
      })
      .addCase(uploadAttachment.rejected, (state, action) => {
        state.uploadProgress = null;
        state.loadingStatus.uploadAttachment = 'failed';
        state.error = action.payload;
      })
      
      // Mark conversation as seen/read
      .addCase(markConversationAsSeen.pending, (state) => {
        state.loadingStatus.markConversationAsSeen = 'pending';
      })
      .addCase(markConversationAsSeen.fulfilled, (state, action) => {
        state.loadingStatus.markConversationAsSeen = 'succeeded';
        const { conversation_id, updated_count } = action.payload;
        
        // Update messages to reflect they've been seen
        state.messages = state.messages.map(msg => ({
          ...msg,
          is_read: true,
          is_unread: false,
          first_seen_at: msg.first_seen_at || new Date().toISOString()
        }));
        
        // Reset unread count for this conversation
        state.unreadCounts[conversation_id] = 0;
        state.unreadMessageIds[conversation_id] = [];
        
        // Update conversation object
        if (state.byId[conversation_id]) {
          state.byId[conversation_id].unread_count = 0;
          state.byId[conversation_id].has_unseen_messages = false;
        }
        
        // Update total unread count
        state.totalUnreadMessages = Math.max(0, state.totalUnreadMessages - updated_count);
        
        // Remove from conversations with unread
        state.conversationsWithUnread = state.conversationsWithUnread.filter(id => id !== conversation_id);
      })
      .addCase(markConversationAsSeen.rejected, (state, action) => {
        state.loadingStatus.markConversationAsSeen = 'failed';
        state.error = action.payload;
      })
      
      // Fetch unread stats
      .addCase(fetchUnreadStats.pending, (state) => {
        state.loadingStatus.fetchUnreadStats = 'pending';
      })
      .addCase(fetchUnreadStats.fulfilled, (state, action) => {
        state.loadingStatus.fetchUnreadStats = 'succeeded';
        const { 
          total_unread_messages, 
          conversations_with_unread, 
          conversation_unread_counts,
          unread_conversations
        } = action.payload;
        
        // Update totals
        state.totalUnreadMessages = total_unread_messages;
        state.conversationsWithUnread = unread_conversations || conversations_with_unread;
        
        // Update individual conversation unread counts
        Object.entries(conversation_unread_counts).forEach(([convId, count]) => {
          state.unreadCounts[convId] = count;
          
          // Update conversation object if it exists
          if (state.byId[convId]) {
            state.byId[convId].unread_count = count;
            state.byId[convId].has_unseen_messages = count > 0;
          }
        });
      })
      .addCase(fetchUnreadStats.rejected, (state, action) => {
        state.loadingStatus.fetchUnreadStats = 'failed';
        state.error = action.payload;
      });
  }
});

export const { 
  selectConversation,
  clearSelectedConversation,
  addMessage, 
  clearMessages, 
  clearError,
  addAttachment,
  removeAttachment,
  clearAttachments,
  setUploadProgress,
  updateFilters,
  clearFilters,
  markMessagesAsRead,
  markMessagesAsUnread,
  updateUnreadStats
} = conversationsSlice.actions;

import { createSelector } from '@reduxjs/toolkit';

// Memoized selectors
export const selectAllConversations = createSelector(
  state => state.conversations.allIds,
  state => state.conversations.byId,
  (allIds, byId) => allIds.map(id => byId[id])
);

export const selectConversationById = createSelector(
  state => state.conversations.byId,
  (_, conversationId) => conversationId,
  (byId, conversationId) => byId[conversationId]
);

export const selectCurrentConversation = createSelector(
  state => state.conversations.selectedConversationId,
  state => state.conversations.byId,
  (selectedId, byId) => selectedId ? byId[selectedId] : null
);

export const selectConversationMessages = state => state.conversations.messages;

export const selectPendingAttachments = state => state.conversations.attachments;

export const selectIsLoading = state => 
  Object.values(state.conversations.loadingStatus).some(status => status === 'pending');
  
export const selectUnreadMessages = state => state.conversations.unreadMessages;

// Replaced with selectTotalUnreadCount

export const selectConversationUnreadCount = createSelector(
  state => state.conversations.unreadCounts,
  (_, conversationId) => conversationId,
  (unreadCounts, conversationId) => unreadCounts[conversationId] || 0
);
  
export const selectHasUnreadMessages = createSelector(
  state => state.conversations.unreadCounts,
  (unreadCounts) => Object.values(unreadCounts).some(count => count > 0)
);

export const selectTotalUnreadCount = createSelector(
  state => state.conversations.totalUnreadMessages,
  (totalUnread) => totalUnread
);

export const selectUnreadMessageIds = createSelector(
  state => state.conversations.unreadMessageIds,
  (_, conversationId) => conversationId,
  (unreadMessageIds, conversationId) => unreadMessageIds[conversationId] || []
);

export const selectConversationsWithUnread = createSelector(
  state => state.conversations.conversationsWithUnread,
  (conversationsWithUnread) => conversationsWithUnread
);

export const selectIsMessageUnread = createSelector(
  (state, messageId, conversationId) => {
    const unreadIds = state.conversations.unreadMessageIds[conversationId] || [];
    return unreadIds.includes(messageId);
  },
  isUnread => isUnread
);

export const selectFilteredConversations = createSelector(
  selectAllConversations,
  state => state.conversations.activeFilters,
  (allConversations, activeFilters) => {
    const { status, assignedTo, hasOpenIssues, searchTerm } = activeFilters;
    
    return allConversations.filter(conversation => {
      // Filter by status
      if (status && conversation.status !== status) {
        return false;
      }
      
      // Filter by assigned agent
      if (assignedTo && conversation.assignee_id !== assignedTo) {
        return false;
      }
      
      // Filter by open issues (would integrate with issues slice)
      // This is a placeholder - real implementation would check open issues
      if (hasOpenIssues === true) {
        const hasOpen = conversation.openIssueCount > 0;
        if (!hasOpen) return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = conversation.customer_name?.toLowerCase().includes(searchLower);
        const matchesPhone = conversation.phone_number?.includes(searchTerm);
        const matchesLastMessage = conversation.lastMessage?.content?.toLowerCase().includes(searchLower);
        
        if (!matchesName && !matchesPhone && !matchesLastMessage) {
          return false;
        }
      }
      
      return true;
    });
  }
);

export default conversationsSlice.reducer;