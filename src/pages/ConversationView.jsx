import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchConversationDetails, 
  selectConversation,
  markConversationAsSeen
} from '../redux/slices/conversationsSlice';
import { fetchApplications } from '../redux/slices/applicationsSlice';
import { fetchLibApplications } from '../redux/slices/libApplicationsSlice';
import { 
  fetchIssues,
  fetchIssueDetails,
  selectIssue
} from '../redux/slices/issuesSlice';
import { 
  fetchTicketsByConversation,
  fetchTicketByNumber,
  updateTicketFromConversation,
  selectTicket
} from '../redux/slices/ticketsSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import MessageList from '../components/conversations/MessageList';
import MessageInput from '../components/conversations/MessageInput';
import ConversationDetailHeader from '../components/conversations/ConversationDetailHeader';
import TicketPanel from '../components/tickets/TicketPanel';
import Modal from '../components/ui/modal';
import { Button } from '../components/ui/button';
import ErrorBoundary from '../components/ui/ErrorBoundary';

const ConversationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Selectors for conversations
  const { 
    byId: conversationsById, 
    messages, 
    loadingStatus: conversationsLoadingStatus, 
    selectedConversationId,
    attachments: pendingAttachments,
    uploadProgress,
    error: conversationsError 
  } = useSelector((state) => state.conversations);
  
  // Selectors for issues
  const {
    byConversation: issuesByConversation,
    selectedIssueId,
    loadingStatus: issuesLoadingStatus,
    error: issuesError
  } = useSelector((state) => state.issues);
  
  // Selectors for tickets
  const {
    byConversation: ticketsByConversation,
    selectedTicketId,
    loadingStatus: ticketsLoadingStatus, 
    error: ticketsError
  } = useSelector((state) => state.tickets);
  
  // Current user (for assignment checks)
  const { user } = useSelector((state) => state.auth);
  
  // Get the selected conversation
  const conversation = id ? conversationsById[id] : null;
  
  // Get all issues from the store
  const { byId: issuesById = {} } = useSelector((state) => state.issues || {});
  
  // Get issues for this conversation
  const issueIds = id ? (issuesByConversation?.[id] || []) : [];
  const issues = issueIds.map(issueId => issuesById?.[issueId]).filter(Boolean);
  
  // Get all tickets from the store
  const { byId: ticketsById = {} } = useSelector((state) => state.tickets || {});
  
  // Get tickets for this conversation
  const ticketIds = id ? (ticketsByConversation?.[id] || []) : [];
  const tickets = ticketIds.map(ticketId => ticketsById?.[ticketId]).filter(Boolean);
  
  // Get IPP applications for this customer's phone number
  const applications = useSelector((state) => {
    const phone = conversation?.phone_number;
    if (!phone) return [];
    if (!state.applications?.allIds) return [];
    return state.applications.allIds
      .map(id => state.applications.byId?.[id])
      .filter(app => app && app.customer?.phone_number === phone);
  });
  
  // Get LIB applications for this customer's phone number
  const libApplications = useSelector((state) => {
    const phone = conversation?.phone_number;
    if (!phone) return [];
    if (!state.libApplications?.allIds) return [];
    return state.libApplications.allIds
      .map(id => state.libApplications.byId?.[id])
      .filter(app => app && app.customer?.phone_number === phone);
  });
  
  // Get the selected issue
  const selectedIssue = selectedIssueId ? issuesById[selectedIssueId] : null;
  
  // UI states
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  
  // Loading states
  const isConversationLoading = conversationsLoadingStatus.fetchConversationDetails === 'pending';
  const areIssuesLoading = issuesLoadingStatus.fetchIssues === 'pending';
  const areTicketsLoading = ticketsLoadingStatus.fetchTicketsByConversation === 'pending';
  const isMessageSending = conversationsLoadingStatus.sendMessage === 'pending';
  
  // Fetch conversation data when ID changes
  useEffect(() => {
    if (id) {
      // Select and fetch conversation details
      dispatch(selectConversation(id));
      dispatch(fetchConversationDetails(id));
      
      // Mark conversation as seen when it's opened
      dispatch(markConversationAsSeen(id));
      
      // Fetch issues for this conversation
      dispatch(fetchIssues(id));
      
      // Fetch tickets for this conversation
      dispatch(fetchTicketsByConversation(id));
      
      // Fetch applications (to find any linked to this customer)
      dispatch(fetchApplications());
      
      // Fetch LIB applications
      dispatch(fetchLibApplications());
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(selectConversation(null));
      dispatch(selectIssue(null));
      dispatch(selectTicket(null));
    };
  }, [dispatch, id]);
  
  // Mark messages as seen when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      if (id) {
        dispatch(markConversationAsSeen(id));
      }
    };

    // Add focus event listener
    window.addEventListener('focus', handleFocus);
    
    // Clean up
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch, id]);
  
  // Fetch issue details when selected issue changes
  useEffect(() => {
    if (selectedIssueId) {
      dispatch(fetchIssueDetails(selectedIssueId));
    }
  }, [dispatch, selectedIssueId]);
  
  // Sync ticket data from conversation response to tickets slice
  useEffect(() => {
    if (conversation && conversation.ticket) {
      dispatch(updateTicketFromConversation({
        conversationId: id,
        ticket: conversation.ticket
      }));
    }
  }, [dispatch, id, conversation?.ticket]);
  
  // Helper functions for ticket display
  const getTicketStatusBadge = (status) => {
    // Convert to lowercase for case-insensitive comparison
    const statusLower = status?.toLowerCase();
    
    switch (statusLower) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-indigo-100 text-indigo-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'waiting_on_customer':
        return 'bg-yellow-100 text-yellow-800';
      case 'waiting_on_third_party':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'reopened':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTicketPriorityBadge = (priority) => {
    // Convert to lowercase for case-insensitive comparison
    const priorityLower = priority?.toLowerCase();
    
    switch (priorityLower) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'urgent':
        return 'bg-red-200 text-red-900';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Handle errors
  const error = conversationsError || issuesError || ticketsError;
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      </DashboardLayout>
    );
  }
  
  // This code is replaced by the updated loading logic below
  
  // Handle missing conversation - adding a delay to ensure loading is complete
  const [shouldShowError, setShouldShowError] = useState(false);
  
  useEffect(() => {
    // If not loading and no conversation is found, set a delay before showing error
    if (!isConversationLoading && !conversation) {
      const timer = setTimeout(() => {
        setShouldShowError(true);
      }, 1000); // 1 second delay
      
      return () => clearTimeout(timer);
    } else if (conversation) {
      setShouldShowError(false);
    }
  }, [isConversationLoading, conversation]);
  
  // If either loading or no conversation data, show appropriate UI
  if (isConversationLoading || (!conversation && !shouldShowError)) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!conversation && shouldShowError) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Conversation not found</h3>
          <p className="text-muted-foreground mt-2">
            The conversation you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </DashboardLayout>
    );
  }
  
  // Safety check - only render main UI if conversation exists
  if (!conversation) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Conversation header */}
        <ConversationDetailHeader 
          conversation={conversation}
          currentUser={user}
          onOpenTicketModal={() => setIsTicketModalOpen(true)}
        />
        
        {/* Main content */}
        <div className="flex-1 flex h-full">
          {/* WhatsApp-like chat area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-muted/10">
            {/* Message list with WhatsApp-like styling */}
            <div className="flex-1 overflow-y-auto p-4" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="rgba(0,0,0,0.025)" fill-rule="evenodd"/%3E%3C/svg%3E")', backgroundRepeat: 'repeat'}}>
              {/* WhatsApp style message bubbles with error boundary */}
              <ErrorBoundary>
                <MessageList 
                  messages={messages}
                  currentIssueId={selectedIssueId}
                  isLoading={isConversationLoading}
                  conversationId={id}
                />
              </ErrorBoundary>
            </div>
            
            {/* Message input with WhatsApp-like styling */}
            <div className="border-t bg-card">
              <MessageInput 
                conversationId={id}
                pendingAttachments={pendingAttachments}
                currentIssueId={selectedIssueId}
                isLoading={isMessageSending}
                uploadProgress={uploadProgress}
              />
            </div>
          </div>
          
          {/* Right sidebar - Customer Info */}
          <div className="w-96 flex-shrink-0 border-l overflow-y-auto bg-card">
            {/* Customer info section */}
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  {conversation.customer_name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{conversation.customer_name}</h3>
                  <p className="text-sm text-muted-foreground">{conversation.phone_number}</p>
                </div>
              </div>
              
              {conversation.metadata && (
                <div className="bg-muted/20 p-2 rounded-md text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Type:</span>
                    <span>{conversation.metadata.account_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer ID:</span>
                    <span>{conversation.metadata.customer_id}</span>
                  </div>
                  
                  {/* IPP Application links if available */}
                  {applications.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-muted">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">IPP Applications:</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-medium">
                          {applications.length}
                        </span>
                      </div>
                      {applications.map(app => (
                        <div key={app.id} className="mt-1">
                          <a 
                            href={`/applications/${app.id}`} 
                            className="text-indigo-600 hover:underline flex items-center"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            IPP Application
                            <span className="ml-1 text-xs bg-gray-100 px-1 rounded">
                              {app.status.replace(/_/g, ' ')}
                            </span>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* LIB Application links if available */}
                  {libApplications.length > 0 && (
                    <div className={`mt-2 pt-2 ${applications.length > 0 ? '' : 'border-t'} border-muted`}>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">LIB Flex Applications:</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium">
                          {libApplications.length}
                        </span>
                      </div>
                      {libApplications.map(app => (
                        <div key={app.id} className="mt-1">
                          <a 
                            href={`/lib-applications/${app.id}`} 
                            className="text-purple-600 hover:underline flex items-center"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            LIB Flex Application
                            <span className="ml-1 text-xs bg-gray-100 px-1 rounded">
                              {app.status.replace(/_/g, ' ')}
                            </span>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Ticket summary - preview in sidebar */}
              {conversation.ticket && (
                <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-sm">Support Ticket</h4>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs py-0 px-2 h-6"
                      onClick={() => setIsTicketModalOpen(true)}
                    >
                      View Details
                    </Button>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Number:</span>
                      <span className="font-medium">{conversation.ticket.ticket_number || `T-${conversation.ticket.id}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${getTicketStatusBadge(conversation.ticket.status)}`}>
                        {conversation.ticket.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${getTicketPriorityBadge(conversation.ticket.priority)}`}>
                        {conversation.ticket.priority}
                      </span>
                    </div>
                    {conversation.ticket.title && (
                      <div className="pt-1 mt-1 border-t border-blue-100">
                        <p className="line-clamp-2 text-gray-700">{conversation.ticket.title}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Button at the bottom of ticket summary */}
                  <div className="mt-3 flex justify-center">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => setIsTicketModalOpen(true)}
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Manage Ticket Details
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Ticket Modal */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title={`Support Tickets - ${conversation?.customer_name || 'Conversation'}`}
        size="lg"
      >
        <div className="h-[70vh] border rounded-md overflow-hidden">
          <TicketPanel 
            tickets={tickets}
            conversationId={id}
            selectedTicketId={selectedTicketId}
            isLoading={areTicketsLoading}
            conversationTicket={conversation?.ticket}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ConversationView;