import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  sound: true,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const { id } = action.payload;
      const notification = state.notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    toggleSound: (state) => {
      state.sound = !state.sound;
    },
    setSoundEnabled: (state, action) => {
      state.sound = action.payload;
    }
  }
});

export const { 
  addNotification, 
  markAsRead, 
  markAllAsRead, 
  clearNotifications,
  toggleSound,
  setSoundEnabled
} = notificationsSlice.actions;

// Selectors
export const selectAllNotifications = state => state.notifications.notifications;
export const selectUnreadCount = state => state.notifications.unreadCount;
export const selectIsSoundEnabled = state => state.notifications.sound;

// Create notification action creator
export const createNotification = ({ 
  type = 'message', 
  conversationId = null, 
  ticketId = null,
  title, 
  message, 
  data = {}, 
  importance = 'medium',
  autoClose = true 
}) => {
  return {
    type: 'notifications/addNotification',
    payload: {
      id: Date.now().toString(),
      type,
      title,
      message,
      conversationId,
      ticketId,
      data,
      importance,
      timestamp: new Date().toISOString(),
      read: false,
      autoClose
    }
  };
};

export default notificationsSlice.reducer;