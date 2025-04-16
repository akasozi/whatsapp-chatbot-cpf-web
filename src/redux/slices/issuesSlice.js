import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import IssuesService from '../../services/issues';

// Fetch issues for a conversation
export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async (conversationId, { rejectWithValue }) => {
    try {
      return await IssuesService.getIssuesByConversation(conversationId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch issues');
    }
  }
);

// Fetch a single issue with details
export const fetchIssueDetails = createAsyncThunk(
  'issues/fetchIssueDetails',
  async (issueId, { rejectWithValue }) => {
    try {
      return await IssuesService.getIssueById(issueId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch issue details');
    }
  }
);

// Create a new issue
export const createIssue = createAsyncThunk(
  'issues/createIssue',
  async (issueData, { rejectWithValue }) => {
    try {
      return await IssuesService.createIssue(issueData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create issue');
    }
  }
);

// Update issue
export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async ({ issueId, updateData }, { rejectWithValue }) => {
    try {
      return await IssuesService.updateIssue(issueId, updateData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update issue');
    }
  }
);

// Resolve issue
export const resolveIssue = createAsyncThunk(
  'issues/resolveIssue',
  async ({ issueId, resolution }, { rejectWithValue }) => {
    try {
      return await IssuesService.resolveIssue(issueId, resolution);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to resolve issue');
    }
  }
);

// Reopen issue
export const reopenIssue = createAsyncThunk(
  'issues/reopenIssue',
  async ({ issueId, reason }, { rejectWithValue }) => {
    try {
      return await IssuesService.reopenIssue(issueId, reason);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reopen issue');
    }
  }
);

// Attach message to issue
export const attachMessageToIssue = createAsyncThunk(
  'issues/attachMessage',
  async ({ issueId, messageId }, { rejectWithValue }) => {
    try {
      return await IssuesService.attachMessageToIssue(issueId, messageId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to attach message to issue');
    }
  }
);

const initialState = {
  // Normalized issues data
  byId: {},
  allIds: [],
  
  // Grouped by conversation
  byConversation: {},
  
  // Current issue being viewed or edited
  selectedIssueId: null,
  
  // UI state
  isLoading: false,
  loadingStatus: {
    fetchIssues: 'idle',
    fetchIssueDetails: 'idle',
    createIssue: 'idle',
    updateIssue: 'idle',
    resolveIssue: 'idle',
    reopenIssue: 'idle',
    attachMessage: 'idle',
  },
  error: null,
};

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    selectIssue: (state, action) => {
      state.selectedIssueId = action.payload;
    },
    
    clearSelectedIssue: (state) => {
      state.selectedIssueId = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch issues for a conversation
      .addCase(fetchIssues.pending, (state) => {
        state.loadingStatus.fetchIssues = 'pending';
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loadingStatus.fetchIssues = 'succeeded';
        
        const { conversationId, issues } = action.payload;
        
        // Store issues by conversation ID
        state.byConversation[conversationId] = issues.map(issue => issue.id);
        
        // Normalize and store the issues
        issues.forEach(issue => {
          state.byId[issue.id] = issue;
          
          // Add to allIds if not already present
          if (!state.allIds.includes(issue.id)) {
            state.allIds.push(issue.id);
          }
        });
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loadingStatus.fetchIssues = 'failed';
        state.error = action.payload;
      })
      
      // Fetch a single issue with details
      .addCase(fetchIssueDetails.pending, (state) => {
        state.loadingStatus.fetchIssueDetails = 'pending';
        state.error = null;
      })
      .addCase(fetchIssueDetails.fulfilled, (state, action) => {
        state.loadingStatus.fetchIssueDetails = 'succeeded';
        
        const issue = action.payload;
        
        // Update or add the issue in our store
        state.byId[issue.id] = issue;
        
        // Make sure it's in allIds
        if (!state.allIds.includes(issue.id)) {
          state.allIds.push(issue.id);
        }
        
        // Make sure it's in the conversation's issue list
        if (state.byConversation[issue.conversation_id]) {
          if (!state.byConversation[issue.conversation_id].includes(issue.id)) {
            state.byConversation[issue.conversation_id].push(issue.id);
          }
        } else {
          state.byConversation[issue.conversation_id] = [issue.id];
        }
      })
      .addCase(fetchIssueDetails.rejected, (state, action) => {
        state.loadingStatus.fetchIssueDetails = 'failed';
        state.error = action.payload;
      })
      
      // Create a new issue
      .addCase(createIssue.pending, (state) => {
        state.loadingStatus.createIssue = 'pending';
        state.error = null;
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.loadingStatus.createIssue = 'succeeded';
        
        const newIssue = action.payload;
        
        // Add the new issue to our store
        state.byId[newIssue.id] = newIssue;
        state.allIds.push(newIssue.id);
        
        // Add to the conversation's issue list
        if (state.byConversation[newIssue.conversation_id]) {
          state.byConversation[newIssue.conversation_id].push(newIssue.id);
        } else {
          state.byConversation[newIssue.conversation_id] = [newIssue.id];
        }
        
        // Set as selected issue
        state.selectedIssueId = newIssue.id;
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.loadingStatus.createIssue = 'failed';
        state.error = action.payload;
      })
      
      // Update issue
      .addCase(updateIssue.pending, (state) => {
        state.loadingStatus.updateIssue = 'pending';
        state.error = null;
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.loadingStatus.updateIssue = 'succeeded';
        
        const updatedIssue = action.payload;
        
        // Update the issue in our store
        state.byId[updatedIssue.id] = {
          ...state.byId[updatedIssue.id],
          ...updatedIssue
        };
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.loadingStatus.updateIssue = 'failed';
        state.error = action.payload;
      })
      
      // Resolve issue
      .addCase(resolveIssue.pending, (state) => {
        state.loadingStatus.resolveIssue = 'pending';
        state.error = null;
      })
      .addCase(resolveIssue.fulfilled, (state, action) => {
        state.loadingStatus.resolveIssue = 'succeeded';
        
        const { id, status, closed_at, resolution_summary, resolution_time } = action.payload;
        
        if (state.byId[id]) {
          state.byId[id].status = status;
          state.byId[id].closed_at = closed_at;
          state.byId[id].resolution_summary = resolution_summary;
          state.byId[id].resolution_time = resolution_time;
        }
      })
      .addCase(resolveIssue.rejected, (state, action) => {
        state.loadingStatus.resolveIssue = 'failed';
        state.error = action.payload;
      })
      
      // Reopen issue
      .addCase(reopenIssue.pending, (state) => {
        state.loadingStatus.reopenIssue = 'pending';
        state.error = null;
      })
      .addCase(reopenIssue.fulfilled, (state, action) => {
        state.loadingStatus.reopenIssue = 'succeeded';
        
        const { id, status, reopen_reason } = action.payload;
        
        if (state.byId[id]) {
          state.byId[id].status = status;
          state.byId[id].reopen_reason = reopen_reason;
          // Clear resolution data or keep history as needed
          state.byId[id].closed_at = null;
        }
      })
      .addCase(reopenIssue.rejected, (state, action) => {
        state.loadingStatus.reopenIssue = 'failed';
        state.error = action.payload;
      })
      
      // Attach message to issue
      .addCase(attachMessageToIssue.pending, (state) => {
        state.loadingStatus.attachMessage = 'pending';
        state.error = null;
      })
      .addCase(attachMessageToIssue.fulfilled, (state, action) => {
        state.loadingStatus.attachMessage = 'succeeded';
        
        const { issueId, messageId } = action.payload;
        
        if (state.byId[issueId]) {
          // Add message ID to the attached_messages array if not already there
          if (!state.byId[issueId].attached_messages.includes(messageId)) {
            state.byId[issueId].attached_messages.push(messageId);
          }
        }
      })
      .addCase(attachMessageToIssue.rejected, (state, action) => {
        state.loadingStatus.attachMessage = 'failed';
        state.error = action.payload;
      });
  }
});

export const { 
  selectIssue,
  clearSelectedIssue,
  clearError
} = issuesSlice.actions;

// Selectors
export const selectAllIssues = state => 
  state.issues.allIds.map(id => state.issues.byId[id]);

export const selectIssueById = (state, issueId) => 
  state.issues.byId[issueId];

export const selectCurrentIssue = state => 
  state.issues.selectedIssueId 
    ? state.issues.byId[state.issues.selectedIssueId]
    : null;

export const selectIssuesByConversation = (state, conversationId) => {
  const issueIds = state.issues.byConversation[conversationId] || [];
  return issueIds.map(id => state.issues.byId[id]);
};

export const selectOpenIssuesByConversation = (state, conversationId) => {
  const issues = selectIssuesByConversation(state, conversationId);
  return issues.filter(issue => 
    issue && ['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'REOPENED'].includes(issue.status)
  );
};

export const selectIsIssueLoading = state => 
  Object.values(state.issues.loadingStatus).some(status => status === 'pending');

export default issuesSlice.reducer;