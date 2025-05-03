import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectAllNotifications,
  selectUnreadCount as selectNotificationUnreadCount,
  markAllAsRead,
  markAsRead,
  clearNotifications
} from '../../redux/slices/notificationsSlice';
import { fetchUnreadStats, selectTotalUnreadCount } from '../../redux/slices/conversationsSlice';
import { cn } from '../../utils/cn';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useSelector(selectAllNotifications);
  const notificationUnreadCount = useSelector(selectNotificationUnreadCount);
  const messageUnreadCount = useSelector(selectTotalUnreadCount);
  const totalUnreadCount = notificationUnreadCount + messageUnreadCount;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fetch unread message stats on component mount and periodically
  useEffect(() => {
    // Fetch initially
    dispatch(fetchUnreadStats());
    
    // Set up periodic fetch every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchUnreadStats());
    }, 30000);
    
    // Cleanup
    return () => clearInterval(interval);
  }, [dispatch]);

  // Mark all as read
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  // Clear all notifications
  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  // Handle click on a notification
  const handleNotificationClick = (notification) => {
    // Mark as read
    dispatch(markAsRead({ id: notification.id }));
    
    // Navigate to the relevant page based on notification type
    if (notification.conversationId) {
      navigate(`/conversations/${notification.conversationId}`);
    } else if (notification.type === 'ticket' && notification.ticketId) {
      navigate(`/tickets/${notification.ticketId}`);
    } else if (notification.type === 'system') {
      // System announcements don't navigate anywhere
      console.log('System announcement clicked:', notification);
    }
    
    // Close the dropdown
    setIsOpen(false);
  };

  // Format time to display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // difference in seconds
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {/* Badge for unread count */}
        {totalUnreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="px-4 py-2 border-b flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
            <div className="flex space-x-2">
              {notificationUnreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div>
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'px-4 py-3 hover:bg-gray-50 cursor-pointer border-b',
                    !notification.read && 'bg-blue-50'
                  )}
                >
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
            
            {notifications.length > 10 && (
              <div className="px-4 py-2 text-center text-xs text-gray-500">
                {notifications.length - 10} more notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;