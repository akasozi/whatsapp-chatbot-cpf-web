import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import TicketService from '../../services/tickets';

// Fetch ticket by ID
export const fetchTicket = createAsyncThunk(
  'tickets/fetchTicket',
  async (ticketId, { rejectWithValue }) => {
    try {
      return await TicketService.getTicketById(ticketId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch ticket');
    }
  }
);

// Fetch ticket by ticket number
export const fetchTicketByNumber = createAsyncThunk(
  'tickets/fetchTicketByNumber',
  async (ticketNumber, { rejectWithValue }) => {
    try {
      return await TicketService.getTicketByNumber(ticketNumber);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch ticket by number');
    }
  }
);

// Fetch tickets for a conversation
export const fetchTicketsByConversation = createAsyncThunk(
  'tickets/fetchTicketsByConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const tickets = await TicketService.getTicketsByConversation(conversationId);
      return { conversationId, tickets };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tickets');
    }
  }
);

// Update ticket status with optional agent notes
export const updateTicketStatus = createAsyncThunk(
  'tickets/updateStatus',
  async ({ ticketId, status, notes }, { rejectWithValue }) => {
    try {
      // The service now handles both status and notes in a single call
      const result = await TicketService.updateTicketStatus(ticketId, status, notes);
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update ticket status');
    }
  }
);

// Update ticket priority
export const updateTicketPriority = createAsyncThunk(
  'tickets/updatePriority',
  async ({ ticketId, priority }, { rejectWithValue }) => {
    try {
      return await TicketService.updateTicketPriority(ticketId, priority);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update ticket priority');
    }
  }
);

// Update ticket (general)
export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ ticketId, updateData }, { rejectWithValue }) => {
    try {
      return await TicketService.updateTicket(ticketId, updateData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update ticket');
    }
  }
);

// Create new ticket
export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      return await TicketService.createTicket(ticketData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create ticket');
    }
  }
);

// Resolve ticket (mark as resolved)
export const resolveTicket = createAsyncThunk(
  'tickets/resolveTicket',
  async ({ ticketId, resolution }, { rejectWithValue }) => {
    try {
      // First update the status to RESOLVED
      let statusResult = null;
      try {
        statusResult = await TicketService.updateTicketStatus(ticketId, 'RESOLVED');
      } catch (statusError) {
        console.error('Error updating ticket status during resolve:', statusError);
        // If the status update fails, we'll still try to update the ticket with resolution
      }
      
      if (resolution) {
        try {
          // Then update the ticket with the resolution details
          const resolutionResult = await TicketService.updateTicket(ticketId, { 
            resolution: resolution,
            status: 'RESOLVED', // Ensure status is RESOLVED even if first call failed
            resolved_at: new Date().toISOString() 
          });
          
          return {
            ...resolutionResult,
            resolution: resolution,
            status: 'RESOLVED',
            resolved_at: new Date().toISOString()
          };
        } catch (resolutionError) {
          console.error('Error updating ticket with resolution:', resolutionError);
          // If both calls fail, we'll reject the thunk
          if (!statusResult) {
            throw new Error('Failed to resolve ticket');
          }
        }
      }
      
      // If we got a successful status update but resolution update failed or wasn't needed
      if (statusResult) {
        return {
          ...statusResult,
          resolved_at: new Date().toISOString()
        };
      }
      
      // If we get here, both calls failed
      throw new Error('Failed to resolve ticket');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to resolve ticket');
    }
  }
);

// Close ticket
export const closeTicket = createAsyncThunk(
  'tickets/closeTicket',
  async ({ ticketId, resolution }, { rejectWithValue }) => {
    try {
      return await TicketService.closeTicket(ticketId, resolution);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to close ticket');
    }
  }
);

// Reopen ticket
export const reopenTicket = createAsyncThunk(
  'tickets/reopenTicket',
  async ({ ticketId, reason }, { rejectWithValue }) => {
    try {
      return await TicketService.reopenTicket(ticketId, reason);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reopen ticket');
    }
  }
);

const initialState = {
  // Normalized tickets data
  byId: {},
  allIds: [],
  
  // Grouped by conversation
  byConversation: {},
  
  // Current ticket being viewed or edited
  selectedTicketId: null,
  
  // UI state
  isLoading: false,
  loadingStatus: {
    fetchTicket: 'idle',
    fetchTicketByNumber: 'idle',
    fetchTicketsByConversation: 'idle',
    createTicket: 'idle',
    updateTicket: 'idle',
    updateStatus: 'idle',
    updatePriority: 'idle',
    resolveTicket: 'idle',
    closeTicket: 'idle',
    reopenTicket: 'idle',
  },
  error: null,
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    selectTicket: (state, action) => {
      state.selectedTicketId = action.payload;
    },
    
    clearSelectedTicket: (state) => {
      state.selectedTicketId = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Update ticket in state from conversation data
    updateTicketFromConversation: (state, action) => {
      const { conversationId, ticket } = action.payload;
      
      if (ticket && ticket.id) {
        // Update or add ticket to state
        state.byId[ticket.id] = ticket;
        
        // Add to allIds if not already present
        if (!state.allIds.includes(ticket.id)) {
          state.allIds.push(ticket.id);
        }
        
        // Add to byConversation
        if (!state.byConversation[conversationId]) {
          state.byConversation[conversationId] = [];
        }
        
        if (!state.byConversation[conversationId].includes(ticket.id)) {
          state.byConversation[conversationId].push(ticket.id);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch ticket by ID
      .addCase(fetchTicket.pending, (state) => {
        state.loadingStatus.fetchTicket = 'pending';
        state.error = null;
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.loadingStatus.fetchTicket = 'succeeded';
        
        const ticket = action.payload;
        
        // Update or add ticket to state
        state.byId[ticket.id] = ticket;
        
        // Add to allIds if not already present
        if (!state.allIds.includes(ticket.id)) {
          state.allIds.push(ticket.id);
        }
      })
      .addCase(fetchTicket.rejected, (state, action) => {
        state.loadingStatus.fetchTicket = 'failed';
        state.error = action.payload;
      })
      
      // Fetch ticket by number
      .addCase(fetchTicketByNumber.pending, (state) => {
        state.loadingStatus.fetchTicketByNumber = 'pending';
        state.error = null;
      })
      .addCase(fetchTicketByNumber.fulfilled, (state, action) => {
        state.loadingStatus.fetchTicketByNumber = 'succeeded';
        
        const ticket = action.payload;
        
        // Update or add ticket to state
        state.byId[ticket.id] = ticket;
        
        // Add to allIds if not already present
        if (!state.allIds.includes(ticket.id)) {
          state.allIds.push(ticket.id);
        }
        
        // If the ticket has a conversation_id, also add to byConversation
        if (ticket.conversation_id) {
          if (!state.byConversation[ticket.conversation_id]) {
            state.byConversation[ticket.conversation_id] = [];
          }
          
          if (!state.byConversation[ticket.conversation_id].includes(ticket.id)) {
            state.byConversation[ticket.conversation_id].push(ticket.id);
          }
        }
        
        // Set as selected ticket
        state.selectedTicketId = ticket.id;
      })
      .addCase(fetchTicketByNumber.rejected, (state, action) => {
        state.loadingStatus.fetchTicketByNumber = 'failed';
        state.error = action.payload;
      })
      
      // Fetch tickets for a conversation
      .addCase(fetchTicketsByConversation.pending, (state) => {
        state.loadingStatus.fetchTicketsByConversation = 'pending';
        state.error = null;
      })
      .addCase(fetchTicketsByConversation.fulfilled, (state, action) => {
        state.loadingStatus.fetchTicketsByConversation = 'succeeded';
        
        const { conversationId, tickets } = action.payload;
        
        // Store tickets by conversation ID
        state.byConversation[conversationId] = tickets.map(ticket => ticket.id);
        
        // Normalize and store the tickets
        tickets.forEach(ticket => {
          state.byId[ticket.id] = ticket;
          
          // Add to allIds if not already present
          if (!state.allIds.includes(ticket.id)) {
            state.allIds.push(ticket.id);
          }
        });
      })
      .addCase(fetchTicketsByConversation.rejected, (state, action) => {
        state.loadingStatus.fetchTicketsByConversation = 'failed';
        state.error = action.payload;
      })
      
      // Create ticket
      .addCase(createTicket.pending, (state) => {
        state.loadingStatus.createTicket = 'pending';
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loadingStatus.createTicket = 'succeeded';
        
        const newTicket = action.payload;
        
        // Add the new ticket to our store
        state.byId[newTicket.id] = newTicket;
        state.allIds.push(newTicket.id);
        
        // Add to the conversation's ticket list
        if (newTicket.conversation_id) {
          if (state.byConversation[newTicket.conversation_id]) {
            state.byConversation[newTicket.conversation_id].push(newTicket.id);
          } else {
            state.byConversation[newTicket.conversation_id] = [newTicket.id];
          }
        }
        
        // Set as selected ticket
        state.selectedTicketId = newTicket.id;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loadingStatus.createTicket = 'failed';
        state.error = action.payload;
      })
      
      // Update ticket
      .addCase(updateTicket.pending, (state) => {
        state.loadingStatus.updateTicket = 'pending';
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loadingStatus.updateTicket = 'succeeded';
        
        const updatedTicket = action.payload;
        
        // Update the ticket in our store
        if (state.byId[updatedTicket.id]) {
          state.byId[updatedTicket.id] = {
            ...state.byId[updatedTicket.id],
            ...updatedTicket
          };
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loadingStatus.updateTicket = 'failed';
        state.error = action.payload;
      })
      
      // Update ticket status
      .addCase(updateTicketStatus.pending, (state) => {
        state.loadingStatus.updateStatus = 'pending';
        state.error = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.loadingStatus.updateStatus = 'succeeded';
        
        const updatedTicket = action.payload;
        
        // Update the ticket in our store
        if (state.byId[updatedTicket.id]) {
          state.byId[updatedTicket.id].status = updatedTicket.status;
          // Update other fields that might have changed
          state.byId[updatedTicket.id].updated_at = updatedTicket.updated_at;
          
          // If agent notes were included, update them
          if (updatedTicket.agent_notes) {
            state.byId[updatedTicket.id].agent_notes = updatedTicket.agent_notes;
          }
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.loadingStatus.updateStatus = 'failed';
        state.error = action.payload;
      })
      
      // Update ticket priority
      .addCase(updateTicketPriority.pending, (state) => {
        state.loadingStatus.updatePriority = 'pending';
        state.error = null;
      })
      .addCase(updateTicketPriority.fulfilled, (state, action) => {
        state.loadingStatus.updatePriority = 'succeeded';
        
        const updatedTicket = action.payload;
        
        // Update the ticket in our store
        if (state.byId[updatedTicket.id]) {
          state.byId[updatedTicket.id].priority = updatedTicket.priority;
          // Update other fields that might have changed
          state.byId[updatedTicket.id].updated_at = updatedTicket.updated_at;
        }
      })
      .addCase(updateTicketPriority.rejected, (state, action) => {
        state.loadingStatus.updatePriority = 'failed';
        state.error = action.payload;
      })
      
      // Resolve ticket
      .addCase(resolveTicket.pending, (state) => {
        state.loadingStatus.resolveTicket = 'pending';
        state.error = null;
      })
      .addCase(resolveTicket.fulfilled, (state, action) => {
        state.loadingStatus.resolveTicket = 'succeeded';
        
        const updatedTicket = action.payload;
        
        if (state.byId[updatedTicket.id]) {
          state.byId[updatedTicket.id].status = 'RESOLVED';
          state.byId[updatedTicket.id].resolved_at = updatedTicket.resolved_at;
          state.byId[updatedTicket.id].resolution = updatedTicket.resolution;
          state.byId[updatedTicket.id].updated_at = updatedTicket.updated_at || new Date().toISOString();
        }
      })
      .addCase(resolveTicket.rejected, (state, action) => {
        state.loadingStatus.resolveTicket = 'failed';
        state.error = action.payload;
      })
      
      // Close ticket
      .addCase(closeTicket.pending, (state) => {
        state.loadingStatus.closeTicket = 'pending';
        state.error = null;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.loadingStatus.closeTicket = 'succeeded';
        
        const { id, status, resolved_at } = action.payload;
        
        if (state.byId[id]) {
          state.byId[id].status = status || 'CLOSED';
          state.byId[id].resolved_at = resolved_at;
        }
      })
      .addCase(closeTicket.rejected, (state, action) => {
        state.loadingStatus.closeTicket = 'failed';
        state.error = action.payload;
      })
      
      // Reopen ticket
      .addCase(reopenTicket.pending, (state) => {
        state.loadingStatus.reopenTicket = 'pending';
        state.error = null;
      })
      .addCase(reopenTicket.fulfilled, (state, action) => {
        state.loadingStatus.reopenTicket = 'succeeded';
        
        const { id, status, reopened_at } = action.payload;
        
        if (state.byId[id]) {
          state.byId[id].status = status || 'REOPENED';
          state.byId[id].reopened_at = reopened_at;
          // Clear resolution data
          state.byId[id].resolved_at = null;
        }
      })
      .addCase(reopenTicket.rejected, (state, action) => {
        state.loadingStatus.reopenTicket = 'failed';
        state.error = action.payload;
      });
  }
});

export const { 
  selectTicket,
  clearSelectedTicket,
  clearError,
  updateTicketFromConversation
} = ticketsSlice.actions;

// Selectors
export const selectAllTickets = state => 
  state.tickets.allIds.map(id => state.tickets.byId[id]);

export const selectTicketById = (state, ticketId) => 
  state.tickets.byId[ticketId];

export const selectCurrentTicket = state => 
  state.tickets.selectedTicketId 
    ? state.tickets.byId[state.tickets.selectedTicketId]
    : null;

export const selectTicketsByConversation = (state, conversationId) => {
  const ticketIds = state.tickets.byConversation[conversationId] || [];
  return ticketIds.map(id => state.tickets.byId[id]);
};

export const selectIsTicketLoading = state => 
  Object.values(state.tickets.loadingStatus).some(status => status === 'pending');

export default ticketsSlice.reducer;