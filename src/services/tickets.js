import api from './api';

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
      console.error('Error fetching ticket:', error);
      throw error;
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
      console.error('Error fetching ticket by number:', error);
      throw error;
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
      console.error('Error fetching tickets for conversation:', error);
      // Return empty array instead of throwing - this ensures UI won't break
      // when no tickets are found or API errors
      return [];
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
      console.error('Error updating ticket status:', error);
      throw error;
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
      console.error('Error updating ticket priority:', error);
      throw error;
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
      console.error('Error updating ticket:', error);
      throw error;
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
      console.error('Error creating ticket:', error);
      throw error;
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
      console.error('Error closing ticket:', error);
      throw error;
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
      console.error('Error reopening ticket:', error);
      throw error;
    }
  }
};

export default TicketService;