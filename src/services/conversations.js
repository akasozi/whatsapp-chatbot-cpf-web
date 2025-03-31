import { mockConversationsData, mockMessagesData } from '../utils/mockData';

// Mock delay to simulate API request
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to find a conversation by ID
const findConversation = (id) => {
  const conversation = mockConversationsData.find(c => c.id === id || c.id === parseInt(id));
  if (!conversation) {
    throw new Error(`Conversation with ID ${id} not found`);
  }
  return { ...conversation };
};

// Helper to get messages for a conversation
const getMessagesForConversation = (conversationId) => {
  return mockMessagesData
    .filter(m => m.conversation_id === conversationId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map(message => ({ ...message }));
};

// ConversationsService with mock data
const ConversationsService = {
  // Get all conversations with optional filters
  async getConversations(filters = {}) {
    await mockDelay();
    
    let filteredConversations = [...mockConversationsData];
    
    // Apply status filter if provided
    if (filters.status) {
      filteredConversations = filteredConversations.filter(
        c => c.status === filters.status
      );
    }
    
    // Apply assignee filter if provided
    if (filters.assignedTo) {
      filteredConversations = filteredConversations.filter(
        c => c.assignee_id === filters.assignedTo
      );
    }
    
    // Apply search term filter if provided
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredConversations = filteredConversations.filter(c => 
        c.customer_name?.toLowerCase().includes(term) ||
        c.phone_number?.includes(filters.searchTerm) ||
        c.lastMessage?.content?.toLowerCase().includes(term)
      );
    }
    
    // Sort by last activity (most recent first)
    filteredConversations.sort((a, b) => 
      new Date(b.last_activity) - new Date(a.last_activity)
    );
    
    return filteredConversations;
  },
  
  // Get details for a specific conversation
  async getConversationDetails(conversationId) {
    await mockDelay();
    
    const conversation = findConversation(conversationId);
    const messages = getMessagesForConversation(conversationId);
    
    return {
      conversation,
      messages
    };
  },
  
  // Send a message in a conversation
  async sendMessage(conversationId, content, attachments = [], issueId = null) {
    await mockDelay(800); // Simulate network delay
    
    const conversation = findConversation(conversationId);
    
    // Create a mock message
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      issue_id: issueId,
      content,
      created_at: new Date().toISOString(),
      direction: 'OUTBOUND',
      source: 'AGENT',
      sender_id: 'current-agent-id', // Would be from auth in real app
      sender_name: 'Agent Demo',
      attachments: attachments || []
    };
    
    // Add to our mock data
    mockMessagesData.push(newMessage);
    
    // Update conversation last activity time
    conversation.last_activity = newMessage.created_at;
    conversation.lastMessage = {
      content: newMessage.content,
      created_at: newMessage.created_at,
      direction: newMessage.direction,
      source: newMessage.source
    };
    
    // If conversation was RESOLVED or DORMANT, set it to ACTIVE
    if (['RESOLVED', 'DORMANT'].includes(conversation.status)) {
      conversation.status = 'ACTIVE';
    }
    
    return newMessage;
  },
  
  // Update conversation status
  async updateConversationStatus(conversationId, status) {
    await mockDelay();
    
    const conversation = findConversation(conversationId);
    
    // Validate status
    if (!['ACTIVE', 'RESOLVED', 'DORMANT', 'ARCHIVED'].includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    
    // Update status
    conversation.status = status;
    
    return {
      id: conversationId,
      status
    };
  },
  
  // Assign conversation to agent
  async assignConversation(conversationId, agentId) {
    await mockDelay();
    
    const conversation = findConversation(conversationId);
    
    // Update assignment
    conversation.assignee_id = agentId;
    
    // Add to assignment history
    if (!conversation.assignment_history) {
      conversation.assignment_history = [];
    }
    
    conversation.assignment_history.push({
      agent_id: agentId,
      timestamp: new Date().toISOString()
    });
    
    return {
      id: conversationId,
      assignee_id: agentId,
      assignment_history: conversation.assignment_history
    };
  },
  
  // Upload attachment
  async uploadAttachment(file) {
    await mockDelay(1000); // Longer delay to simulate upload
    
    // Generate a mock attachment ID
    const attachmentId = `att-${Date.now()}`;
    
    // Determine file type based on extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    let fileType = 'application/octet-stream';
    let thumbnailUrl = 'https://example.com/attachments/thumbnails/document_icon.png';
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      fileType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
      thumbnailUrl = `https://example.com/attachments/thumbnails/image_preview.jpg`;
    } else if (fileExtension === 'pdf') {
      fileType = 'application/pdf';
      thumbnailUrl = `https://example.com/attachments/thumbnails/pdf_preview.jpg`;
    } else if (['doc', 'docx'].includes(fileExtension)) {
      fileType = fileExtension === 'doc' 
        ? 'application/msword'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    
    // Return mock attachment data
    return {
      id: attachmentId,
      name: file.name,
      type: fileType,
      size: file.size,
      url: `https://example.com/attachments/${attachmentId}/${encodeURIComponent(file.name)}`,
      thumbnail_url: thumbnailUrl
    };
  },
  
  // Get attachment details
  async getAttachment(attachmentId) {
    await mockDelay();
    
    // Find the message containing this attachment
    const message = mockMessagesData.find(msg => 
      msg.attachments.some(att => att.id === attachmentId)
    );
    
    if (!message) {
      throw new Error(`Attachment with ID ${attachmentId} not found`);
    }
    
    const attachment = message.attachments.find(att => att.id === attachmentId);
    
    return attachment;
  }
};

export default ConversationsService;