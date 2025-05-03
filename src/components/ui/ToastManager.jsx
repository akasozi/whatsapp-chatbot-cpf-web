import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectAllNotifications, 
  markAsRead, 
  clearNotifications
} from '../../redux/slices/notificationsSlice';
import Toast, { ToastContainer } from './toast';
import { useNavigate } from 'react-router-dom';
import NotificationSound from './NotificationSound';

const ToastManager = () => {
  const notifications = useSelector(selectAllNotifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visibleToasts, setVisibleToasts] = useState([]);
  
  // Maximum number of toasts to show at once
  const MAX_TOASTS = 3;

  // Update visible toasts when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      setVisibleToasts(prev => {
        // Keep existing toasts that haven't been removed yet
        const existing = prev.filter(toast => 
          notifications.some(n => n.id === toast.id)
        );
        
        // Add new toasts up to MAX_TOASTS limit
        const newNotifications = notifications
          .filter(n => !existing.some(toast => toast.id === n.id))
          .slice(0, MAX_TOASTS - existing.length);
        
        return [...existing, ...newNotifications];
      });
    }
  }, [notifications]);

  // Handle toast close
  const handleClose = useCallback((id) => {
    setVisibleToasts(prev => prev.filter(toast => toast.id !== id));
    dispatch(markAsRead({ id }));
  }, [dispatch]);

  // Handle action (e.g., navigating to the conversation)
  const handleAction = useCallback((id) => {
    const notification = notifications.find(n => n.id === id);
    
    if (notification) {
      // Mark as read no matter what
      dispatch(markAsRead({ id }));
      
      // Navigate based on notification type
      if (notification.conversationId) {
        navigate(`/conversations/${notification.conversationId}`);
      } else if (notification.type === 'ticket' && notification.ticketId) {
        navigate(`/tickets/${notification.ticketId}`);
      } else if (notification.type === 'system') {
        // System announcements don't navigate anywhere
        console.log('System announcement clicked:', notification);
      }
    }
  }, [dispatch, navigate, notifications]);

  // We'll use the NotificationSound component instead of handling it here

  return (
    <>
      <NotificationSound notifications={notifications} />
      <ToastContainer position="top-right">
        {visibleToasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            autoClose={toast.autoClose !== false}
            duration={5000}
            onClose={handleClose}
            actionLabel={toast.type === 'message' ? 'View Conversation' : undefined}
            onAction={handleAction}
          />
        ))}
      </ToastContainer>
    </>
  );
};

export default ToastManager;