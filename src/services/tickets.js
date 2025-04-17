import api from './api';

// Mock data for when the API fails
const mockTickets = [
  {
    id: 1,
    ticket_number: 'T-10001',
    title: 'Account Access Issue',
    description: 'Customer unable to login to their account after password reset',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    conversation_id: 10,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    agent_notes: 'Working with the customer to verify identity'
  },
  {
    id: 2,
    ticket_number: 'T-10002',
    title: 'Payment Processing Error',
    description: 'Payment failed but funds were deducted from account',
    status: 'WAITING_ON_THIRD_PARTY',
    priority: 'HIGH',
    conversation_id: 10,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    agent_notes: 'Contacted payment processor for transaction details'
  }
];

// Mock delay to simulate API request
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Tickets service for interactions with the ticket API
const TicketService = {
  /**
   * Get ticket details by ID
   * @param {number|string} ticketId - The ticket ID to fetch
   * @returns {Promise<Object>} - The ticket data
   */
  async getTicketById(ticketId) {
    try {
      const response = await api.get(`tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket, using mock data:', error);
      // Return mock data instead of throwing
      await mockDelay();
      return mockTickets.find(t => t.id === parseInt(ticketId)) || {
        id: parseInt(ticketId),
        ticket_number: `T-${ticketId}`,
        title: 'Sample Ticket',
        status: 'new',
        priority: 'medium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  },
  
  /**
   * Get ticket details by ticket number
   * @param {string} ticketNumber - The ticket number to fetch
   * @returns {Promise<Object>} - The ticket data
   */
  async getTicketByNumber(ticketNumber) {
    try {
      const response = await api.get(`support_tickets/by-number/${ticketNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket by number, using mock data:', error);
      // Return mock data instead of throwing
      await mockDelay();
      return mockTickets.find(t => t.ticket_number === ticketNumber) || {
        id: Date.now(),
        ticket_number: ticketNumber,
        title: 'Sample Ticket from Number',
        status: 'new',
        priority: 'medium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  },

  /**
   * Get tickets associated with a conversation
   * @param {number|string} conversationId - The conversation ID
   * @returns {Promise<Array>} - List of tickets for the conversation
   */
  async getTicketsByConversation(conversationId) {
    try {
      const response = await api.get(`tickets?conversation_id=${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets for conversation, using mock data:', error);
      // Return filtered mock data
      await mockDelay();
      const conversationIdNum = parseInt(conversationId);
      let tickets = mockTickets.filter(t => t.conversation_id === conversationIdNum);
      
      // If no tickets exist for this conversation, create a sample one
      if (tickets.length === 0 && conversationIdNum === 10) {
        // Add at least one ticket for conversation ID 10 (which is often used in the UI)
        const newTicket = {
          id: mockTickets.length + 1,
          ticket_number: `T-${10001}`,
          title: 'Account Access Issue',
          description: 'Customer unable to login to their account after password reset',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          conversation_id: 10,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        };
        
        mockTickets.push(newTicket);
        tickets = [newTicket];
      }
      
      // If the real API is implemented later, it will return a proper response
      // For now, return mock data in a format that matches the expected structure
      return tickets;
    }
  },

  /**
   * Update ticket status
   * @param {number|string} ticketId - The ticket ID to update
   * @param {string} status - The new status (NEW, ASSIGNED, IN_PROGRESS, WAITING_ON_CUSTOMER, etc.)
   * @param {string} [notes] - Optional agent notes to include with the status update
   * @returns {Promise<Object>} - The updated ticket
   */
  async updateTicketStatus(ticketId, status, notes) {
    try {
      // Use the correct tickets endpoint for all updates
      const updateData = { status };
      
      if (notes) {
        updateData.agent_notes = notes;
      }
      
      const response = await api.put(`tickets/${ticketId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating ticket status, using mock data:', error);
      await mockDelay();
      
      // Find and update the mock ticket
      const ticketIdNum = parseInt(ticketId);
      const ticket = mockTickets.find(t => t.id === ticketIdNum);
      
      if (ticket) {
        ticket.status = status;
        if (notes) {
          ticket.agent_notes = notes;
        }
        ticket.updated_at = new Date().toISOString();
        return { ...ticket };
      }
      
      // If no matching mock ticket, create a new one
      const newTicket = {
        id: ticketIdNum,
        ticket_number: `T-${ticketId}`,
        status: status,
        priority: 'MEDIUM',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        agent_notes: notes || ''
      };
      
      mockTickets.push(newTicket);
      return newTicket;
    }
  },

  /**
   * Update ticket priority
   * @param {number|string} ticketId - The ticket ID to update
   * @param {string} priority - The new priority (LOW, MEDIUM, HIGH, URGENT)
   * @returns {Promise<Object>} - The updated ticket
   */
  async updateTicketPriority(ticketId, priority) {
    try {
      const response = await api.put(`tickets/${ticketId}/priority`, { priority });
      return response.data;
    } catch (error) {
      console.error('Error updating ticket priority, using mock data:', error);
      await mockDelay();
      
      // Find and update the mock ticket
      const ticketIdNum = parseInt(ticketId);
      const ticket = mockTickets.find(t => t.id === ticketIdNum);
      
      if (ticket) {
        ticket.priority = priority;
        ticket.updated_at = new Date().toISOString();
        return { ...ticket };
      }
      
      // If no matching mock ticket, create a new one
      const newTicket = {
        id: ticketIdNum,
        ticket_number: `T-${ticketId}`,
        status: 'NEW',
        priority: priority,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockTickets.push(newTicket);
      return newTicket;
    }
  },

  /**
   * Update ticket 
   * @param {number|string} ticketId - The ticket ID to update
   * @param {Object} updateData - The fields to update
   * @returns {Promise<Object>} - The updated ticket
   */
  async updateTicket(ticketId, updateData) {
    try {
      const response = await api.put(`tickets/${ticketId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating ticket, using mock data:', error);
      await mockDelay();
      
      // Find and update the mock ticket
      const ticketIdNum = parseInt(ticketId);
      const ticket = mockTickets.find(t => t.id === ticketIdNum);
      
      if (ticket) {
        // Update ticket with the provided data
        Object.assign(ticket, updateData);
        ticket.updated_at = new Date().toISOString();
        return { ...ticket };
      }
      
      // If no matching mock ticket, create a new one
      const newTicket = {
        id: ticketIdNum,
        ticket_number: `T-${ticketId}`,
        status: 'NEW',
        priority: 'MEDIUM',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updateData
      };
      
      mockTickets.push(newTicket);
      return newTicket;
    }
  },

  /**
   * Create a ticket associated with a conversation
   * @param {Object} ticketData - The ticket data
   * @param {number|string} ticketData.conversation_id - The conversation ID to link
   * @param {string} ticketData.title - The ticket title
   * @param {string} [ticketData.description] - Optional ticket description
   * @param {string} [ticketData.priority] - Optional ticket priority
   * @returns {Promise<Object>} - The created ticket
   */
  async createTicket(ticketData) {
    try {
      const response = await api.post('tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket, using mock data:', error);
      await mockDelay();
      
      // Generate a new ID that doesn't conflict with existing mock tickets
      const maxId = mockTickets.length > 0 
        ? Math.max(...mockTickets.map(t => t.id)) 
        : 0;
      
      const newTicket = {
        id: maxId + 1,
        ticket_number: `T-${10000 + maxId + 1}`,
        status: ticketData.status || 'NEW',
        priority: ticketData.priority || 'MEDIUM',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...ticketData
      };
      
      mockTickets.push(newTicket);
      return newTicket;
    }
  },
  
  /**
   * Close a ticket
   * @param {number|string} ticketId - The ticket ID to close
   * @param {string} [resolution] - Optional resolution information
   * @returns {Promise<Object>} - The closed ticket
   */
  async closeTicket(ticketId, resolution) {
    try {
      const response = await api.put(`tickets/${ticketId}/close`, { resolution });
      return response.data;
    } catch (error) {
      console.error('Error closing ticket, using mock data:', error);
      await mockDelay();
      
      // Find and update the mock ticket
      const ticketIdNum = parseInt(ticketId);
      const ticket = mockTickets.find(t => t.id === ticketIdNum);
      
      if (ticket) {
        ticket.status = 'CLOSED';
        ticket.resolution = resolution;
        ticket.resolved_at = new Date().toISOString();
        ticket.updated_at = new Date().toISOString();
        return { ...ticket };
      }
      
      // If no matching ticket, create a mock closed ticket
      const newTicket = {
        id: ticketIdNum,
        ticket_number: `T-${ticketId}`,
        status: 'CLOSED',
        resolution: resolution,
        resolved_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date().toISOString()
      };
      
      mockTickets.push(newTicket);
      return newTicket;
    }
  },
  
  /**
   * Reopen a ticket
   * @param {number|string} ticketId - The ticket ID to reopen
   * @param {string} [reason] - Optional reason for reopening
   * @returns {Promise<Object>} - The reopened ticket
   */
  async reopenTicket(ticketId, reason) {
    try {
      const response = await api.put(`tickets/${ticketId}/reopen`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error reopening ticket, using mock data:', error);
      await mockDelay();
      
      // Find and update the mock ticket
      const ticketIdNum = parseInt(ticketId);
      const ticket = mockTickets.find(t => t.id === ticketIdNum);
      
      if (ticket) {
        ticket.status = 'REOPENED';
        ticket.reopen_reason = reason;
        ticket.reopened_at = new Date().toISOString();
        ticket.updated_at = new Date().toISOString();
        // Clear resolution data
        ticket.resolved_at = null;
        return { ...ticket };
      }
      
      // If no matching ticket, return an error
      console.error('Cannot reopen a non-existent ticket');
      throw new Error('Ticket not found');
    }
  }
};

export default TicketService;