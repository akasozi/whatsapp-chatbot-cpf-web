import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { createSelector } from '@reduxjs/toolkit';

// Create a factory function that returns a memoized selector for a specific conversation
// This ensures we don't create a new selector function on each render
const makeSelectUnreadCount = (conversationId) => {
  return createSelector(
    state => state.conversations.unreadCounts,
    unreadCounts => unreadCounts[conversationId] || 0
  );
};

const ConversationItemRow = ({ 
  conversation, 
  selectedId, 
  handleSelect, 
  getStatusBadge,
  formatTime
}) => {
  // Create a memoized selector for this specific conversation
  const selectUnreadCount = useMemo(
    () => makeSelectUnreadCount(conversation.id),
    [conversation.id]
  );
  
  // Use the memoized selector
  const unreadCount = useSelector(selectUnreadCount);
  
  return (
    <tr 
      key={conversation.id} 
      className={`hover:bg-muted/30 cursor-pointer ${
        selectedId === conversation.id 
          ? 'bg-muted/50' 
          : unreadCount > 0 
            ? 'bg-blue-50 font-medium' 
            : ''
      }`}
      onClick={() => handleSelect(conversation.id)}
    >
      <td className="py-3 px-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
            {conversation.customer_name.charAt(0)}
          </div>
          <div className="ml-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{conversation.customer_name}</p>
              {unreadCount > 0 && (
                <span className="flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-blue-500 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{conversation.phone_number}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm">
        <div className={`max-w-xs truncate ${unreadCount > 0 ? 'font-medium text-blue-700' : ''}`}>
          {conversation.lastMessage?.content || "No messages yet"}
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(conversation.status)}`}>
          {conversation.status}
        </span>
      </td>
      <td className="py-3 px-4">
        {conversation.assignee_id ? (
          <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
            Assigned
          </span>
        ) : (
          <span className="text-xs bg-yellow-100 text-yellow-800 rounded-full px-2 py-1">
            Unassigned
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        {conversation.ticket && (conversation.ticket.ticket_number || conversation.ticket.id) ? (
          <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
            {conversation.ticket.ticket_number || `T-${conversation.ticket.id}`}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">
        {formatTime(conversation.last_activity || conversation.updated_at)}
      </td>
      <td className="py-3 px-4">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/conversations/${conversation.id}`}>
            View
          </Link>
        </Button>
      </td>
    </tr>
  );
};

export default ConversationItemRow;