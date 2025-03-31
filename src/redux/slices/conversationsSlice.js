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

const initialState = {
  // Normalized conversations data
  byId: {},
  allIds: [],
  
  // Current view state
  selectedConversationId: null,
  
  // Fetched messages for the selected conversation
  messages: [],
  
  // UI state
  isLoading: false,
  loadingStatus: {
    fetchConversations: 'idle',
    fetchConversationDetails: 'idle',
    sendMessage: 'idle',
    uploadAttachment: 'idle',
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
      state.selectedConversationId = action.payload;
    },
    
    clearSelectedConversation: (state) => {
      state.selectedConversationId = null;
      state.messages = [];
    },
    
    addMessage: (state, action) => {
      const message = action.payload;
      
      // Add message to the conversation's messages array if it's the currently selected one
      if (state.selectedConversationId === message.conversation_id) {
        state.messages.push(message);
      }
      
      // Update the last message in the conversation object
      if (state.byId[message.conversation_id]) {
        state.byId[message.conversation_id].lastMessage = {
          content: message.content,
          created_at: message.created_at,
          direction: message.direction,
          source: message.source
        };
        state.byId[message.conversation_id].last_activity = message.created_at;
        
        // If the conversation was RESOLVED or DORMANT, set it to ACTIVE
        if (['RESOLVED', 'DORMANT'].includes(state.byId[message.conversation_id].status)) {
          state.byId[message.conversation_id].status = 'ACTIVE';
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
        
        // Normalize the data
        state.byId = {};
        state.allIds = [];
        
        action.payload.forEach(conversation => {
          state.byId[conversation.id] = conversation;
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
        
        // Update conversation details
        state.byId[conversation.id] = {
          ...state.byId[conversation.id],
          ...conversation
        };
        
        // Set messages
        state.messages = messages;
        
        // Ensure this conversation is in our list
        if (!state.allIds.includes(conversation.id)) {
          state.allIds.push(conversation.id);
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
  clearFilters
} = conversationsSlice.actions;

// Selectors
export const selectAllConversations = state => 
  state.conversations.allIds.map(id => state.conversations.byId[id]);

export const selectConversationById = (state, conversationId) => 
  state.conversations.byId[conversationId];

export const selectCurrentConversation = state => 
  state.conversations.selectedConversationId 
    ? state.conversations.byId[state.conversations.selectedConversationId]
    : null;

export const selectConversationMessages = state => state.conversations.messages;

export const selectPendingAttachments = state => state.conversations.attachments;

export const selectIsLoading = state => 
  Object.values(state.conversations.loadingStatus).some(status => status === 'pending');

export const selectFilteredConversations = state => {
  const { status, assignedTo, hasOpenIssues, searchTerm } = state.conversations.activeFilters;
  const allConversations = selectAllConversations(state);
  
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
};

export default conversationsSlice.reducer;