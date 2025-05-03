import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  selectConversation, 
  updateFilters
} from '../../redux/slices/conversationsSlice';
import ConversationItemRow from './ConversationItemRow';

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
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ticket No.</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {conversations.map((conversation) => (
                  <ConversationItemRow
                    key={conversation.id}
                    conversation={conversation}
                    selectedId={selectedId}
                    handleSelect={handleSelect}
                    getStatusBadge={getStatusBadge}
                    formatTime={formatTime}
                  />
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