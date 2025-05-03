import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchConversations, 
  updateFilters,
  clearFilters,
  selectFilteredConversations,
  selectTotalUnreadCount
} from '../redux/slices/conversationsSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import ConversationList from '../components/conversations/ConversationList';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ConversationsList = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get loading and error states
  const { loadingStatus, error, selectedConversationId, activeFilters } = useSelector(
    (state) => state.conversations
  );
  
  // Use the selector to get filtered conversations
  const filteredConversations = useSelector(selectFilteredConversations);
  
  // Get total unread message count
  const totalUnreadCount = useSelector(selectTotalUnreadCount);
  
  // Loading state
  const isLoading = loadingStatus.fetchConversations === 'pending';
  
  // Fetch conversations on mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);
  
  // Update search filter when searchTerm changes
  useEffect(() => {
    dispatch(updateFilters({ searchTerm }));
  }, [dispatch, searchTerm]);
  
  // Handle refresh button
  const handleRefresh = () => {
    dispatch(fetchConversations());
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
              {totalUnreadCount > 0 && (
                <span className="flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-blue-500 text-white text-sm font-bold">
                  {totalUnreadCount}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
              </div>
              <Button 
                variant={totalUnreadCount > 0 ? "default" : "outline"}
                onClick={handleRefresh}
                className="flex items-center space-x-1 relative"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold">
                    {totalUnreadCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md mb-4">
              {error}
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-hidden rounded-lg border bg-card">
          <ConversationList 
            conversations={filteredConversations}
            selectedId={selectedConversationId}
            activeFilters={activeFilters}
            isLoading={isLoading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConversationsList;