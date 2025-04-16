import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateConversationStatus, assignConversation } from '../../redux/slices/conversationsSlice';
import { Button } from '../../components/ui/button';

/**
 * ConversationDetailHeader component displays conversation information and actions
 * 
 * @param {Object} props
 * @param {Object} props.conversation - The conversation object
 * @param {Object} props.currentUser - The current logged-in user
 */
const ConversationDetailHeader = ({ 
  conversation, 
  currentUser
}) => {
  const dispatch = useDispatch();
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  
  if (!conversation) return null;
  
  // Get status badge styling
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
  
  // Handle conversation status change
  const handleStatusChange = (status) => {
    if (status === conversation.status) return;
    
    dispatch(updateConversationStatus({
      conversationId: conversation.id,
      status
    }));
    
    setStatusMenuOpen(false);
  };
  
  // Handle assigning conversation
  const handleAssign = (agentId) => {
    dispatch(assignConversation({
      conversationId: conversation.id,
      agentId
    }));
    
    setIsAssignmentOpen(false);
  };
  
  // Format time for display
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Check if this conversation is assigned to current user
  const isAssignedToCurrentUser = conversation.assignee_id === currentUser?.id;
  
  // Mock agents list for demo
  const availableAgents = [
    { id: 'agent-789', name: 'Sarah Smith' },
    { id: 'agent-790', name: 'Mark Wilson' },
    { id: 'agent-791', name: 'Jessica Taylor' },
    { id: 'agent-792', name: 'Robert Brown' }
  ];
  
  return (
    <div className="border-b p-4">
      <div className="flex justify-between items-start">
        {/* Customer info */}
        <div>
          <h2 className="text-lg font-medium">{conversation.customer_name}</h2>
          <div className="text-sm text-muted-foreground">{conversation.phone_number}</div>
          <div className="flex space-x-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(conversation.status)}`}>
              {conversation.status}
            </span>
            {conversation.tags && conversation.tags.map((tag, index) => (
              <span key={index} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          {/* Status dropdown */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setStatusMenuOpen(!statusMenuOpen)}
            >
              Status
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            
            {statusMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-card border rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted
                      ${conversation.status === 'ACTIVE' ? 'bg-muted/50' : ''}`}
                    onClick={() => handleStatusChange('ACTIVE')}
                  >
                    Active
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted
                      ${conversation.status === 'RESOLVED' ? 'bg-muted/50' : ''}`}
                    onClick={() => handleStatusChange('RESOLVED')}
                  >
                    Resolved
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted
                      ${conversation.status === 'DORMANT' ? 'bg-muted/50' : ''}`}
                    onClick={() => handleStatusChange('DORMANT')}
                  >
                    Dormant
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted
                      ${conversation.status === 'ARCHIVED' ? 'bg-muted/50' : ''}`}
                    onClick={() => handleStatusChange('ARCHIVED')}
                  >
                    Archived
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Assignment dropdown */}
          <div className="relative">
            <Button 
              variant={conversation.assignee_id ? 'outline' : 'default'}
              size="sm"
              onClick={() => setIsAssignmentOpen(!isAssignmentOpen)}
            >
              {conversation.assignee_id ? 'Reassign' : 'Assign'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            
            {isAssignmentOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-card border rounded-md shadow-lg z-10">
                <div className="py-1">
                  {availableAgents.map((agent) => (
                    <button
                      key={agent.id}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted
                        ${conversation.assignee_id === agent.id ? 'bg-muted/50' : ''}`}
                      onClick={() => handleAssign(agent.id)}
                    >
                      {agent.name}
                    </button>
                  ))}
                  <div className="border-t my-1"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-muted text-muted-foreground"
                    onClick={() => handleAssign(null)}
                  >
                    Unassign
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Assignment info */}
      {conversation.assignee_id && (
        <div className="mt-2 text-xs text-muted-foreground">
          {isAssignedToCurrentUser ? 'Assigned to you' : 'Assigned to agent'}
          {' · Last activity: '}
          {formatTime(conversation.last_activity)}
        </div>
      )}
      
      {/* Customer details */}
      {conversation.metadata && (
        <div className="mt-2 p-2 bg-muted/30 rounded-md text-xs">
          <span className="font-medium">Account: </span>
          <span>{conversation.metadata.account_type}</span>
          <span className="mx-2">·</span>
          <span className="font-medium">Customer ID: </span>
          <span>{conversation.metadata.customer_id}</span>
        </div>
      )}
    </div>
  );
};

export default ConversationDetailHeader;