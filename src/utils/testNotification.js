import store from '../redux/store';
import { createNotification } from '../redux/slices/notificationsSlice';

// Simple utility to test notifications from the browser console
// Usage: import { testNotification } from './utils/testNotification';
//        testNotification('Test message');

export const testNotification = (message = 'This is a test notification', type = 'message', importance = 'medium') => {
  const notification = {
    type: type,
    conversationId: type === 'message' ? '12345' : null, // Mock conversation ID for message types
    ticketId: type === 'ticket' ? '67890' : null, // Mock ticket ID for ticket types
    title: 'Test Notification',
    message: message,
    data: {
      conversation_id: type === 'message' ? '12345' : null,
      content: message,
      created_at: new Date().toISOString(),
      direction: 'inbound',
      source: 'whatsapp',
      importance: importance
    },
    importance: importance,
    autoClose: type !== 'system' && type !== 'ticket'
  };
  
  store.dispatch(createNotification(notification));
  console.log('Test notification dispatched:', notification);
  return 'Notification test triggered';
};

// Test function for message notifications
export const testMessageNotification = (conversationId = '12345', customerName = 'Test Customer') => {
  const notification = {
    type: 'message',
    conversationId,
    title: `New message from ${customerName}`,
    message: 'Hello, I need assistance with my account.',
    data: {
      conversation_id: conversationId,
      content: 'Hello, I need assistance with my account.',
      created_at: new Date().toISOString(),
      direction: 'inbound',
      source: 'whatsapp'
    },
    autoClose: true
  };
  
  store.dispatch(createNotification(notification));
  console.log('Test message notification dispatched:', notification);
  return 'Message notification test triggered';
};

// Add functions for testing other notification types
export const testTicketNotification = () => {
  const notification = {
    type: 'ticket',
    ticketId: '67890',
    title: 'New Ticket: Customer Issue',
    message: 'A new HIGH priority ticket has been created: T-5A3B7C9D',
    data: {
      ticket_id: '67890',
      ticket_number: 'T-5A3B7C9D',
      priority: 'HIGH',
      category: 'TECHNICAL_ISSUE',
      conversation_id: '12345',
      importance: 'high'
    },
    importance: 'high',
    autoClose: false
  };
  
  store.dispatch(createNotification(notification));
  console.log('Test ticket notification dispatched:', notification);
  return 'Ticket notification test triggered';
};

export const testSystemNotification = (message = 'The system will be down for maintenance on Saturday from 2-4 AM') => {
  const notification = {
    type: 'system',
    title: 'System Announcement',
    message: message,
    data: {
      maintenance_date: '2025-05-03',
      duration_hours: 2,
      importance: 'high'
    },
    importance: 'high',
    autoClose: false
  };
  
  store.dispatch(createNotification(notification));
  console.log('Test system notification dispatched:', notification);
  return 'System notification test triggered';
};

// Export all functions for testing in window
window.testNotification = testNotification;
window.testMessageNotification = testMessageNotification;
window.testTicketNotification = testTicketNotification;
window.testSystemNotification = testSystemNotification;