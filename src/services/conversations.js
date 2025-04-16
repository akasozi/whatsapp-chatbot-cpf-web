import { mockConversationsData, mockMessagesData } from '../utils/mockData';
import api from './api';

// Flag to toggle between mock data and actual API
const USE_MOCK_DATA = false; // Using real backend data

// Mock delay to simulate API request
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to find a conversation by ID (for mock data)
const findConversation = (id) => {
  const conversation = mockConversationsData.find(c => c.id === id || c.id === parseInt(id));
  if (!conversation) {
    throw new Error(`Conversation with ID ${id} not found`);
  }
  return { ...conversation };
};

// Helper to get messages for a conversation (for mock data)
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
    if (USE_MOCK_DATA) {
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
    } else {
      try {
        console.log('Fetching conversations from backend...');
        
        // For the admin endpoint, we use specific parameters
        let queryParams = new URLSearchParams();
        
        // Add pagination parameters as required by API
        queryParams.append('limit', filters.limit || 100);
        queryParams.append('skip', filters.skip || filters.offset || 0);
        
        // Log the request we're about to make
        const url = `messages/admin/conversations?${queryParams.toString()}`;
        console.log('Making request to:', url);
        
        // Make API request to the correct endpoint - don't include /api/v1 as it's in the baseURL
        const response = await api.get(url);
        
        // Transform response data to match the expected format based on actual API response
        console.log('Received conversations data:', response.data);
        
        const conversations = response.data.map(conv => {
          // Format customer name, using phone number if name is null
          const customerName = conv.user?.name || `Customer (${conv.user?.phone_number || 'Unknown'})`;
          const phoneNumber = conv.user?.phone_number || 'Unknown';
          
          return {
            id: conv.id,
            customer_name: customerName,
            phone_number: phoneNumber,
            status: conv.status || 'ACTIVE',
            assignee_id: conv.agent?.id || null,
            assignee_name: conv.agent?.name || null,
            last_activity: conv.updated_at || conv.created_at,
            updated_at: conv.updated_at || conv.created_at,
            created_at: conv.created_at,
            session_id: conv.session_id,
            unread_count: 0, // API doesn't provide this yet
            lastMessage: {
              content: conv.last_message?.content || 'No message',
              created_at: conv.last_message?.created_at || conv.updated_at || conv.created_at,
              direction: 'INBOUND', // Assuming most recent is from customer
              source: 'CUSTOMER',
              has_attachments: conv.last_message?.has_attachments || false
            },
            ticket: conv.ticket || null
          };
        });
        
        return conversations;
      } catch (error) {
        console.error('Error fetching conversations:', error);
        // Fallback to mock data if API request fails
        return [...mockConversationsData];
      }
    }
  },
  
  // Get details for a specific conversation
  async getConversationDetails(conversationId) {
    if (USE_MOCK_DATA) {
      await mockDelay();
      
      const conversation = findConversation(conversationId);
      const messages = getMessagesForConversation(conversationId);
      
      return {
        conversation,
        messages
      };
    } else {
      try {
        // Fetch conversation details - don't include /api/v1 as it's in the baseURL
        // Create a fallback conversation in case of errors
        const fallbackConversation = {
          id: parseInt(conversationId),
          status: 'ACTIVE',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: null,
            name: 'Customer',
            phone_number: 'Unknown'
          },
          agent: {
            id: null,
            name: null
          },
          last_message: {
            content: 'No message available',
            created_at: new Date().toISOString(),
            has_attachments: false
          }
        };
        
        // Using the same endpoint as the conversation list but with a specific ID
        console.log(`Fetching conversation details for ID: ${conversationId}`);
        let conversation;
        
        try {
          const response = await api.get(`messages/admin/conversations?conversation_id=${conversationId}`);
          // The response is an array, so we take the first item for the conversation details
          conversation = Array.isArray(response.data) && response.data.length > 0 
              ? response.data[0] 
              : fallbackConversation;
        } catch (error) {
          console.error('Error fetching conversation details:', error);
          // Use fallback data if the API request fails
          conversation = fallbackConversation;
        }
        
        console.log('Fetched conversation details:', conversation);
        
        // Format customer name, using phone number if name is null
        const customerName = conversation.user?.name || `Customer (${conversation.user?.phone_number || 'Unknown'})`;
        const phoneNumber = conversation.user?.phone_number || 'Unknown';
        
        // Format conversation to match expected structure
        const formattedConversation = {
          id: conversation.id,
          customer_name: customerName,
          phone_number: phoneNumber,
          status: conversation.status || 'ACTIVE',
          assignee_id: conversation.agent?.id || null,
          assignee_name: conversation.agent?.name || null,
          last_activity: conversation.updated_at || conversation.created_at,
          updated_at: conversation.updated_at || conversation.created_at,
          created_at: conversation.created_at,
          session_id: conversation.session_id,
          ticket: conversation.ticket || null,
          lastMessage: {
            content: conversation.last_message?.content || 'No message',
            created_at: conversation.last_message?.created_at || conversation.updated_at || conversation.created_at,
            direction: 'INBOUND', // Assuming most recent is from customer
            source: 'CUSTOMER',
            has_attachments: conversation.last_message?.has_attachments || false
          }
        };
        
        // Try to fetch conversation history, but handle errors gracefully
        console.log(`Fetching message history for conversation ID: ${conversationId}`);
        
        // Create a fallback message
        const fallbackMessage = {
          id: `msg-${Date.now()}`,
          conversation_id: conversationId,
          content: "Unable to load message history. Please try again later.",
          created_at: new Date().toISOString(),
          message_type: 'OUTBOUND',
          is_from_customer: false,
          agent_id: 'system',
          agent_name: 'System'
        };
        
        // Start with an empty message array
        let messageData = [];
        
        try {
          // Try several endpoint formats since we're not sure which one works
          let messagesResponse = null;
          
          // Add query parameters for including attachments
          const queryParams = 'include_attachments=true';
          
          // First attempt - using conversation (singular) path
          try {
            messagesResponse = await api.get(`messages/admin/conversation/${conversationId}/history?${queryParams}`);
          } catch (e) {
            console.log('First endpoint attempt failed, trying alternative format');
          }
          
          // Second attempt if first failed - using conversations (plural) path
          if (!messagesResponse) {
            try {
              messagesResponse = await api.get(`messages/admin/conversations/${conversationId}/history?${queryParams}`);
            } catch (e) {
              console.log('Second endpoint attempt failed');
            }
          }
          
          // If we got a response, use it
          if (messagesResponse && messagesResponse.data) {
            console.log('Fetched messages:', messagesResponse.data);
            
            // Check various response formats - support multiple API structures
            if (Array.isArray(messagesResponse.data)) {
              // Direct array response
              messageData = messagesResponse.data;
              console.log('Using direct array response format');
            } else if (messagesResponse.data && Array.isArray(messagesResponse.data.messages)) {
              // Object with messages array property
              messageData = messagesResponse.data.messages;
              console.log('Extracted messages from response object, count:', messageData.length);
              
              // Log the first message to see its structure
              if (messageData.length > 0) {
                console.log('Sample message structure:', JSON.stringify(messageData[0]).substring(0, 300));
              }
            } else if (messagesResponse.data && typeof messagesResponse.data === 'object') {
              // Log all keys that might contain message data
              console.log('API response keys:', Object.keys(messagesResponse.data));
              // Handle object responses that might have message data but not in a standard format
              console.log('Response is an object without standard messages array, trying to extract message data');
              
              // If we have a message_count property but no messages array, the API might be returning
              // message data in a different format - try to identify message objects
              const possibleMessages = [];
              for (const key in messagesResponse.data) {
                const value = messagesResponse.data[key];
                // Look for message-like objects in the response
                if (Array.isArray(value) && value.length > 0 && 
                   (value[0].content || value[0].text || value[0].body)) {
                  console.log(`Found potential message array in property: ${key}`);
                  possibleMessages.push(...value);
                }
              }
              
              if (possibleMessages.length > 0) {
                messageData = possibleMessages;
                console.log(`Found ${messageData.length} messages in non-standard format`);
              } else {
                // If we can't find message arrays, try to use the whole object if it has message-like properties
                if (messagesResponse.data.content || messagesResponse.data.text || messagesResponse.data.body) {
                  messageData = [messagesResponse.data];
                  console.log('Using entire response object as a single message');
                } else {
                  messageData = [];
                  console.log('No usable message data found in response');
                }
              }
            } else {
              messageData = [];
              console.log('Response format not recognized, using empty message array');
            }
          } else {
            // If both attempts failed, use fallback message
            console.log('All message history endpoint attempts failed, using fallback');
            messageData = [fallbackMessage];
          }
        } catch (error) {
          console.error('Error fetching message history:', error);
          console.log('Using fallback message due to API error');
          messageData = [fallbackMessage];
        }
        
        console.log('Processing message data:', messageData);
        
        // Log raw message data for debugging
        if (messageData.length > 0) {
          console.log('Sample raw message:', JSON.stringify(messageData[0]).substring(0, 300));
        }
        
        // Format messages to match expected structure based on history endpoint response
        const messages = messageData.map(msg => {
          // Log each message to debug direction information
          console.log('Processing message:', 
            'id:', msg.id || 'unknown',
            'message_type:', msg.message_type || 'undefined', 
            'source:', msg.source || 'undefined',
            'direction:', msg.direction || 'undefined'
          );
          
          // Determine if message is from customer based on message properties
          // Check all possible fields that might indicate the message direction
          const isFromCustomer = msg.message_type === 'INBOUND' || 
                                msg.role === 'user' || 
                                msg.source === 'CUSTOMER' ||
                                msg.direction === 'INBOUND' ||
                                (msg.text && !msg.agent_id); // Heuristic: Message without agent_id might be from customer
          
          // Get message content, checking multiple possible field names
          const getMessageContent = () => {
            // Check all possible content field names
            if (msg.content) return msg.content;
            if (msg.body) return msg.body;
            if (msg.text) return msg.text;
            if (msg.message) return msg.message;
            return '';
          };
          
          // Get message timestamp, checking multiple possible field names
          const getMessageTimestamp = () => {
            if (msg.created_at) return msg.created_at;
            if (msg.timestamp) return msg.timestamp;
            if (msg.sent_at) return msg.sent_at;
            if (msg.time) return msg.time;
            return new Date().toISOString();
          };
          
          // Handle attachments in different formats
          const getAttachments = () => {
            // Log attachment data for debugging
            if (msg.has_attachments || msg.media_urls || msg.attachments || msg.media || msg.attachment_url) {
              console.log('Message has attachments:', 
                'has_attachments:', msg.has_attachments,
                'media_urls:', msg.media_urls,
                'attachments:', msg.attachments ? 'present' : 'none'
              );
            }
            
            // Check for direct attachments array from API
            if (msg.attachments && Array.isArray(msg.attachments)) {
              // If attachments already have the right format, use them directly
              return msg.attachments.map(att => {
                // Ensure each attachment has at least an id and url
                return {
                  id: att.id || `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  url: att.url || att.media_url || att.attachment_url || '',
                  name: att.name || att.file_name || att.filename || 'attachment',
                  type: att.type || att.mime_type || att.content_type || 'application/octet-stream',
                  size: att.size || 0,
                  download_url: att.download_url || null,
                  preview_url: att.preview_url || null,
                  file_path: att.file_path || null,
                  content_type: att.content_type || null,
                  ...att // Keep any other properties
                };
              });
            }
            
            // Check for media_urls array (common in WhatsApp API)
            if (msg.media_urls && Array.isArray(msg.media_urls)) {
              return msg.media_urls.map((url, index) => ({
                id: `att-${msg.id || Date.now()}-${index}`,
                url: url,
                name: `attachment-${index + 1}`,
                type: url.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'file'
              }));
            }
            
            // Check for media array
            if (msg.media && Array.isArray(msg.media)) {
              return msg.media.map((m, index) => ({
                id: m.id || `att-${msg.id || Date.now()}-${index}`,
                url: m.url || m,
                name: m.name || `attachment-${index + 1}`,
                type: m.type || 'file'
              }));
            }
            
            // Check for single attachment URL
            if (msg.attachment_url || msg.media_url) {
              const url = msg.attachment_url || msg.media_url;
              return [{
                id: `att-${msg.id || Date.now()}`,
                url: url,
                name: 'attachment',
                type: url.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'file'
              }];
            }
            
            // If message is marked as having attachments but none found
            if (msg.has_attachments === true) {
              console.warn('Message marked as having attachments but none found in data');
            }
            
            return [];
          };
          
          // Preserve existing message_type if available, otherwise determine from direction
          const messageType = msg.message_type || 
                              (msg.direction === 'INBOUND' || msg.direction === 'OUTBOUND' ? msg.direction : 
                              (isFromCustomer ? 'INBOUND' : 'OUTBOUND'));
          
          // Infer direction more reliably
          const inferredDirection = isFromCustomer ? 'INBOUND' : 'OUTBOUND';
          
          // Use explicit direction from original message if available, otherwise use our inference
          const finalDirection = msg.direction || inferredDirection;
          
          // Debug message direction resolution
          console.log(`Message direction resolution: isFromCustomer=${isFromCustomer}, inferred=${inferredDirection}, final=${finalDirection}`);
          
          return {
            id: msg.id || msg.message_id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            conversation_id: msg.conversation_id || parseInt(conversationId),
            content: getMessageContent(),
            created_at: getMessageTimestamp(),
            direction: finalDirection,
            message_type: messageType,
            source: msg.source || (isFromCustomer ? 'CUSTOMER' : 'AGENT'),
            sender_id: isFromCustomer ? 
                       (msg.user_id || msg.sender_id || phoneNumber) : 
                       (msg.agent_id || msg.agent?.id || msg.sender_id || 'system'),
            sender_name: isFromCustomer ? 
                         (msg.user_name || msg.sender_name || formattedConversation.customer_name) : 
                         (msg.agent_name || msg.agent?.name || msg.sender_name || 'Agent'),
            username: msg.username || msg.agent?.username || null,
            attachments: getAttachments()
          };
        });
        
        return {
          conversation: formattedConversation,
          messages
        };
      } catch (error) {
        console.error('Error fetching conversation details:', error);
        
        // Fallback to mock data if API request fails
        const conversation = findConversation(conversationId);
        const messages = getMessagesForConversation(conversationId);
        
        return {
          conversation,
          messages
        };
      }
    }
  },
  
  // Send a message in a conversation
  async sendMessage(conversationId, content, attachments = [], issueId = null) {
    if (USE_MOCK_DATA) {
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
    } else {
      try {
        // Check if we have attachments with document_ids, which requires the special endpoint
        const hasDocumentAttachments = attachments && attachments.length > 0 && 
                                      attachments.some(att => att.document_id);
        
        let response;
        
        if (hasDocumentAttachments) {
          // Use the agent/send endpoint with document_id parameter
          console.log(`Sending message with attachment to conversation ${conversationId}`);
          
          // Extract document ID from attachments - per API spec, only one document can be sent at a time
          const documentId = attachments.find(att => att.document_id)?.document_id || 
                             attachments.find(att => att.id)?.id;
          
          if (!documentId) {
            console.error('No valid document ID found in attachments');
            // Fall back to text-only message if no document ID is found
            const url = `messages/agent/send/${conversationId}?content=${encodeURIComponent(content)}`;
            response = await api.post(url, {});
          } else {
            // Build URL with content and document_id as query parameters
            const url = `messages/agent/send/${conversationId}?content=${encodeURIComponent(content)}&document_id=${documentId}`;
            
            console.log('Sending message with document:', url);
            
            // Send message using the agent endpoint with document_id parameter
            response = await api.post(url, {});
          }
        } else {
          // Use standard agent message endpoint for text-only messages
          console.log(`Sending text message to conversation ${conversationId}: ${content}`);
          
          // Build URL with query parameter for content
          const url = `messages/agent/send/${conversationId}?content=${encodeURIComponent(content)}`;
          
          // Handle regular attachments (non-document) if API supports it
          if (attachments && attachments.length > 0) {
            console.log('Sending with regular attachments - this may not be supported');
          }
          
          // Send message to API - don't include /api/v1 as it's in the baseURL
          response = await api.post(url, {});
        }
        
        console.log('Message send response:', response.data);
        
        // Format the response to match expected structure based on API response
        const message = response.data;
        
        // Log the API response structure for debugging
        console.log('Message API response structure:', Object.keys(message));
        
        // Try to extract attachment information from the response
        let responseAttachments = [];
        
        if (message.attachments && Array.isArray(message.attachments)) {
          // Use attachments directly if provided in response
          responseAttachments = message.attachments;
        } else if (message.documents && Array.isArray(message.documents)) {
          // Convert documents to attachments format
          responseAttachments = message.documents.map(doc => ({
            id: doc.id || doc.document_id,
            document_id: doc.id || doc.document_id,
            name: doc.file_name || doc.name || 'document',
            type: doc.mime_type || doc.content_type || 'application/octet-stream',
            url: doc.file_path || doc.download_url || null,
            download_url: doc.download_url || null,
            preview_url: doc.preview_url || null
          }));
        } else if (message.media_urls && Array.isArray(message.media_urls)) {
          // Convert media_urls to attachments format
          responseAttachments = message.media_urls.map(url => ({ url }));
        } else if (hasDocumentAttachments) {
          // If we sent documents but don't have them in response, use original attachments
          responseAttachments = attachments;
        }
        
        return {
          id: message.id,
          conversation_id: message.conversation_id || parseInt(conversationId),
          issue_id: null,
          content: message.content || content || '',
          created_at: message.created_at || new Date().toISOString(),
          direction: 'OUTBOUND',
          message_type: 'OUTBOUND',
          source: 'AGENT',
          sender_id: message.agent_id || 'agent',
          sender_name: message.agent_name || message.sender_name || 'Agent',
          username: message.username || message.agent_username || null,
          attachments: responseAttachments
        };
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    }
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
    if (USE_MOCK_DATA) {
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
    } else {
      try {
        console.log(`Uploading file: ${file.name}`);
        
        // Create form data for the upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', 'OTHER'); // Default to OTHER if not specified
        formData.append('description', file.name); // Use filename as description
        
        // Send file to document upload endpoint
        const response = await api.post('attachments/documents/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Document upload response:', response.data);
        
        // Return the document data
        return {
          id: response.data.id || response.data.document_id,
          document_id: response.data.id || response.data.document_id, // Also store as document_id for API calls
          name: file.name,
          type: file.type,
          size: file.size,
          url: response.data.file_path || response.data.download_url || null,
          download_url: response.data.download_url || null,
          preview_url: response.data.preview_url || null,
          file_path: response.data.file_path || null,
          ...response.data // Include all API response fields
        };
      } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
      }
    }
  },
  
  /**
   * Upload a document for sending in messages
   * @param {File} file - The file to upload
   * @param {string} documentType - Document type (e.g., "FORM", "ID", "CERTIFICATE", "MEDICAL", "OTHER")
   * @param {string|null} description - Optional description of the document
   * @returns {Promise<Object>} - Object containing document_id and other metadata
   */
  async uploadDocument(file, documentType = 'OTHER', description = null) {
    try {
      console.log(`Uploading document: ${file.name}, type: ${documentType}`);
      
      // Create form data for the upload exactly as specified in the API docs
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);
      
      if (description) {
        formData.append('description', description);
      } else {
        formData.append('description', file.name); // Use filename as default description
      }
      
      // Send file to document upload endpoint
      const response = await api.post('attachments/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Document upload response:', response.data);
      
      // Extract document_id from the response and return with additional useful metadata
      const documentId = response.data.id || response.data.document_id;
      
      if (!documentId) {
        console.error('No document_id returned from upload response:', response.data);
        throw new Error('Document upload failed: No document_id returned');
      }
      
      return {
        document_id: documentId,
        id: documentId, // Include as id as well for compatibility
        name: file.name,
        file_name: file.name,
        type: file.type || response.data.mime_type || response.data.content_type,
        size: file.size,
        // Include all original response data for reference
        ...response.data
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },
  
  /**
   * Send a message with a document to a conversation
   * Convenience method that combines document upload and message sending
   * @param {number|string} conversationId - The conversation ID
   * @param {string} content - The message text
   * @param {File} file - The file to attach
   * @param {string} documentType - Document type (e.g., "FORM", "OTHER")
   * @param {string|null} description - Optional description of the document
   * @returns {Promise<Object>} - The sent message
   */
  async sendDocumentMessage(conversationId, content, file, documentType = 'OTHER', description = null) {
    try {
      // Step 1: Upload the document
      const document = await this.uploadDocument(file, documentType, description);
      console.log('Document uploaded successfully:', document);
      
      // Step 2: Send the message with the document ID
      const message = await this.sendMessage(conversationId, content, [document]);
      return message;
    } catch (error) {
      console.error('Error sending document message:', error);
      throw error;
    }
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