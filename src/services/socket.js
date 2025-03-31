import { io } from 'socket.io-client';
import { addMessage } from '../redux/slices/conversationsSlice';
import store from '../redux/store';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Initialize the socket connection
  init() {
    // Skip socket connection in development mode since we're using mock data
    console.log('Socket initialization skipped in development/mock mode');
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

  // Disconnect the socket - no-op in mock mode
  disconnect() {
    console.log('Socket disconnect called (no-op in mock mode)');
    // No-op in mock mode
    /*
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
    */
  }

  // Reconnect with a new token - no-op in mock mode
  reconnect() {
    console.log('Socket reconnect called (no-op in mock mode)');
    // No-op in mock mode
    /*
    this.disconnect();
    this.init();
    */
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