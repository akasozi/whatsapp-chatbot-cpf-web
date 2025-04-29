import { io } from 'socket.io-client';
import { addMessage, fetchConversations } from '../redux/slices/conversationsSlice';
import store from '../redux/store';

// Flag to enable/disable WebSocket functionality
const USE_WEBSOCKETS = true; // Set to false to disable WebSockets

class SocketService {
  constructor() {
    this.socket = null;
    this.ws = null; // Native WebSocket connection
    this.isConnected = false;
  }

  // Initialize the socket connection
  init() {
    // Skip socket connection in development mode since we're using mock data
    console.log('Socket initialization skipped in development/mock mode');
    
    // Only continue with WebSocket if enabled - this won't break existing code
    if (!USE_WEBSOCKETS) {
      return;
    }
    
    // Attempt to initialize WebSocket
    try {
      // Get required auth token
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token available for WebSocket authentication');
        return;
      }
      
      // Get agent ID from user info
      let agentId;
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        agentId = user?.id;
        if (!agentId) {
          console.warn('No agent ID found for WebSocket connection');
          return;
        }
      } catch (e) {
        console.error('Failed to parse user info:', e);
        return;
      }
      
      // Get base URL from environment
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Check if we need to use the provided ngrok URL for WebSockets
      // This is for testing with localhost/ngrok
      // const WS_URL = 'wss://fd79-105-161-152-117.ngrok-free.app';

      const WS_URL = 'wss://whatsapp-api.clouddlow.co.ke';
      // Determine which URL to use - use ngrok for development
      const baseWsUrl = WS_URL || BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://');
      
      // Construct WebSocket URL
      const wsUrl = `${baseWsUrl}/api/v1/ws/agent/${agentId}/conversations?token=${encodeURIComponent(token)}`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      
      // Create WebSocket connection
      this.ws = new WebSocket(wsUrl);
      
      // Basic event handlers
      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.isConnected = true;
        
        // Set up ping to keep connection alive
        // Store the interval ID so we can clear it later
        this.pingInterval = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('Sending ping to keep connection alive');
            this.ws.send(JSON.stringify({event: 'ping'}));
          }
        }, 30000);
      };
      
      this.ws.onclose = (event) => {
        console.log(`WebSocket disconnected with code ${event.code}`, event.reason);
        this.isConnected = false;
        
        // Clear ping interval
        if (this.pingInterval) {
          clearInterval(this.pingInterval);
          this.pingInterval = null;
        }
        
        // Don't reconnect if closed cleanly or if feature is disabled
        if (event.code === 1000 || !USE_WEBSOCKETS) {
          console.log('WebSocket closed cleanly, not reconnecting');
          return;
        }
        
        // Reconnect after delay
        console.log('Will attempt to reconnect in 5 seconds...');
        this.reconnectTimeout = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          this.init();
        }, 5000);
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data.event);
          
          if (data.event === 'new_message' && data.data) {
            console.log('New message:', data.data);
            
            // Dispatch to Redux
            store.dispatch(addMessage(data.data));
            
            // Refresh conversations list to update last message, etc.
            store.dispatch(fetchConversations());
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
    
    return;
    
    /* Disable socket connection until backend is ready
    if (this.socket) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    // Connect directly to the base URL without additional path segments
    this.socket = io(BASE_URL, {
      auth: {
        token
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    */

    /* Disable socket events until backend is ready
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Listen for new messages
    this.socket.on('new_message', (message) => {
      console.log('New message received:', message);
      store.dispatch(addMessage(message));
    });

    // Listen for conversation status changes
    this.socket.on('conversation_update', (data) => {
      console.log('Conversation update:', data);
      // Will handle this with appropriate Redux actions
    });

    // Listen for handoff events
    this.socket.on('handoff_received', (data) => {
      console.log('New handoff received:', data);
      // Will handle notifications or automatic updates
    });
    */
  }

  // Disconnect the socket - now handles both socket.io and WebSocket
  disconnect() {
    console.log('Socket disconnect called');
    
    // Clean up WebSocket if it exists
    if (this.ws) {
      console.log('Closing WebSocket connection');
      
      // Clear intervals and timeouts first
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      // Close the connection
      try {
        this.ws.close();
      } catch (e) {
        console.error('Error closing WebSocket:', e);
      }
      
      this.ws = null;
      this.isConnected = false;
    }
    
    // Keep original socket.io cleanup (commented out for now)
    // No-op in mock mode
    /*
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
    */
  }

  // Reconnect with a new token - now handles both socket.io and WebSocket
  reconnect() {
    console.log('Socket reconnect called');
    
    // Disconnect existing connections
    this.disconnect();
    
    // Reconnect
    this.init();
  }

  // Join a specific conversation room - no-op in mock mode
  joinConversation(conversationId) {
    console.log(`Socket joinConversation called for conversation ${conversationId} (no-op in mock mode)`);
    // No-op in mock mode
    /*
    if (this.socket && this.isConnected) {
      this.socket.emit('join_conversation', { conversationId });
    }
    */
  }

  // Leave a specific conversation room - no-op in mock mode
  leaveConversation(conversationId) {
    console.log(`Socket leaveConversation called for conversation ${conversationId} (no-op in mock mode)`);
    // No-op in mock mode
    /*
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_conversation', { conversationId });
    }
    */
  }

  // Send a typing indicator - no-op in mock mode
  sendTypingIndicator(conversationId, isTyping) {
    console.log(`Socket typing indicator called for conversation ${conversationId} (no-op in mock mode)`);
    // No-op in mock mode
    /*
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', {
        conversationId,
        isTyping
      });
    }
    */
  }
}

const socketService = new SocketService();
export default socketService;