import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectConversation, updateFilters } from '../../redux/slices/conversationsSlice';
import { Button } from '../../components/ui/button';

/**
 * ConversationList component displays a list of conversations with filtering options
 * 
 * @param {Object} props
 * @param {Array} props.conversations - List of conversations to display
 * @param {String} props.selectedId - Currently selected conversation ID
 * @param {Object} props.activeFilters - Current active filters
 * @param {Boolean} props.isLoading - Whether data is loading
 */
const ConversationList = ({ 
  conversations = [], 
  selectedId = null,
  activeFilters = {},
  isLoading = false
}) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState(activeFilters.status || 'ALL');
  
  // Handle status filter change
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    dispatch(updateFilters({ status: status === 'ALL' ? null : status }));
  };
  
  // Get status badge styling based on conversation status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'RESOLVED':
        return 'bg-blue-100 text-blue-800';
      case 'DORMANT':
        return 'bg-gray-100 text-gray-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date/time for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's within the last 7 days, show the day name
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show the date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Handle conversation selection
  const handleSelect = (conversationId) => {
    dispatch(selectConversation(conversationId));
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Filter tabs */}
      <div className="flex border-b mb-2">
        <button
          className={`px-3 py-2 text-sm font-medium ${selectedStatus === 'ALL' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => handleStatusFilter('ALL')}
        >
          All
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium ${selectedStatus === 'ACTIVE' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => handleStatusFilter('ACTIVE')}
        >
          Active
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium ${selectedStatus === 'RESOLVED' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => handleStatusFilter('RESOLVED')}
        >
          Resolved
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium ${selectedStatus === 'DORMANT' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => handleStatusFilter('DORMANT')}
        >
          Dormant
        </button>
      </div>
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">No conversations found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Message</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Issues</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {conversations.map((conversation) => (
                  <tr 
                    key={conversation.id} 
                    className={`hover:bg-muted/30 cursor-pointer ${selectedId === conversation.id ? 'bg-muted/50' : ''}`}
                    onClick={() => handleSelect(conversation.id)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                          {conversation.customer_name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{conversation.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{conversation.phone_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="max-w-xs truncate">
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
                      {conversation.openIssueCount > 0 ? (
                        <span className="text-xs bg-red-100 text-red-800 rounded-full px-2 py-1">
                          {conversation.openIssueCount} open
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;