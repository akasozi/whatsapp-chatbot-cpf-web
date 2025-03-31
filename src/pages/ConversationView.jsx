import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchConversationDetails, 
  selectConversation 
} from '../redux/slices/conversationsSlice';
import { fetchApplications } from '../redux/slices/applicationsSlice';
import { 
  fetchIssues,
  fetchIssueDetails,
  selectIssue
} from '../redux/slices/issuesSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import MessageList from '../components/conversations/MessageList';
import MessageInput from '../components/conversations/MessageInput';
import ConversationDetailHeader from '../components/conversations/ConversationDetailHeader';
import IssuePanel from '../components/issues/IssuePanel';

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
  
  // Current user (for assignment checks)
  const { user } = useSelector((state) => state.auth);
  
  // Get the selected conversation
  const conversation = id ? conversationsById[id] : null;
  
  // Get all issues from the store
  const { byId: issuesById } = useSelector((state) => state.issues);
  
  // Get issues for this conversation
  const issueIds = id ? (issuesByConversation[id] || []) : [];
  const issues = issueIds.map(issueId => issuesById[issueId]).filter(Boolean);
  
  // Get applications for this customer's phone number
  const applications = useSelector((state) => {
    const phone = conversation?.phone_number;
    if (!phone) return [];
    return state.applications.allIds
      .map(id => state.applications.byId[id])
      .filter(app => app.customer.phone_number === phone);
  });
  
  // Get the selected issue
  const selectedIssue = selectedIssueId ? issuesById[selectedIssueId] : null;
  
  // Loading states
  const isConversationLoading = conversationsLoadingStatus.fetchConversationDetails === 'pending';
  const areIssuesLoading = issuesLoadingStatus.fetchIssues === 'pending';
  const isMessageSending = conversationsLoadingStatus.sendMessage === 'pending';
  
  // Fetch conversation data when ID changes
  useEffect(() => {
    if (id) {
      // Select and fetch conversation details
      dispatch(selectConversation(id));
      dispatch(fetchConversationDetails(id));
      
      // Fetch issues for this conversation
      dispatch(fetchIssues(id));
      
      // Fetch applications (to find any linked to this customer)
      dispatch(fetchApplications());
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(selectConversation(null));
      dispatch(selectIssue(null));
    };
  }, [dispatch, id]);
  
  // Fetch issue details when selected issue changes
  useEffect(() => {
    if (selectedIssueId) {
      dispatch(fetchIssueDetails(selectedIssueId));
    }
  }, [dispatch, selectedIssueId]);

  // Handle errors
  const error = conversationsError || issuesError;
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      </DashboardLayout>
    );
  }
  
  // Handle loading state
  if (isConversationLoading && !conversation) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Handle missing conversation
  if (!isConversationLoading && !conversation) {
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
  
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Conversation header */}
        <ConversationDetailHeader 
          conversation={conversation}
          currentUser={user}
        />
        
        {/* Main content */}
        <div className="flex-1 flex h-full">
          {/* WhatsApp-like chat area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-muted/10">
            {/* Message list with WhatsApp-like styling */}
            <div className="flex-1 overflow-y-auto p-4" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="rgba(0,0,0,0.025)" fill-rule="evenodd"/%3E%3C/svg%3E")', backgroundRepeat: 'repeat'}}>
              {/* WhatsApp style message bubbles */}
              <MessageList 
                messages={messages}
                currentIssueId={selectedIssueId}
                isLoading={isConversationLoading}
              />
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
          
          {/* Right sidebar - Issues panel */}
          <div className="w-96 flex-shrink-0 border-l overflow-y-auto bg-card">
            {/* Customer info section */}
            <div className="border-b p-4">
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
                  
                  {/* Application link if available */}
                  {applications.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-muted">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Applications:</span>
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
                </div>
              )}
            </div>
            
            {/* Issues panel */}
            <IssuePanel 
              issues={issues}
              conversationId={id}
              selectedIssueId={selectedIssueId}
              isLoading={areIssuesLoading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConversationView;