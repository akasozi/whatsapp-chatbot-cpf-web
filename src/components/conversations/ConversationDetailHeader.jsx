import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateConversationStatus, assignConversation } from '../../redux/slices/conversationsSlice';
import { updateTicketStatus, updateTicketPriority } from '../../redux/slices/ticketsSlice';
import { Button } from '../../components/ui/button';

/**
 * ConversationDetailHeader component displays conversation information and actions
 * 
 * @param {Object} props
 * @param {Object} props.conversation - The conversation object
 * @param {Object} props.currentUser - The current logged-in user
 * @param {Function} props.onOpenTicketModal - Function to open the ticket modal
 */
const ConversationDetailHeader = ({ 
  conversation, 
  currentUser,
  onOpenTicketModal
}) => {
  const dispatch = useDispatch();
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [ticketStatusMenuOpen, setTicketStatusMenuOpen] = useState(false);
  const [ticketPriorityMenuOpen, setTicketPriorityMenuOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  
  if (!conversation) return null;
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setStatusMenuOpen(false);
      setTicketStatusMenuOpen(false);
      setTicketPriorityMenuOpen(false);
      setIsAssignmentOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
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
  
  // Handle ticket status update
  const handleTicketStatusChange = (status) => {
    if (!conversation.ticket || !conversation.ticket.id) return;
    
    dispatch(updateTicketStatus({
      ticketId: conversation.ticket.id,
      status
    }));
    
    setTicketStatusMenuOpen(false);
  };
  
  // Handle ticket priority update
  const handleTicketPriorityChange = (priority) => {
    if (!conversation.ticket || !conversation.ticket.id) return;
    
    dispatch(updateTicketPriority({
      ticketId: conversation.ticket.id,
      priority
    }));
    
    setTicketPriorityMenuOpen(false);
  };
  
  // Get ticket status badge style
  const getTicketStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'ASSIGNED':
        return 'bg-indigo-100 text-indigo-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'WAITING_ON_CUSTOMER':
        return 'bg-yellow-100 text-yellow-800';
      case 'WAITING_ON_THIRD_PARTY':
        return 'bg-orange-100 text-orange-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      case 'REOPENED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get ticket priority badge style
  const getTicketPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'URGENT':
      case 'urgent':
        return 'bg-red-200 text-red-900';
      case 'MEDIUM':
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'LOW':
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
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
          {/* Tickets button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onOpenTicketModal && onOpenTicketModal()}
            className={conversation.ticket ? "text-blue-600 border-blue-200 hover:bg-blue-50" : ""}
          >
            {conversation.ticket && (
              <span className="w-4 h-4 mr-1 text-blue-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 14l6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 20l2.5-2.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 4l-2 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 14.5l1.5 1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12.5l1 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 9l-1 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
            {conversation.ticket ? 'Manage Ticket' : 'Create Ticket'}
          </Button>
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
      
      {/* Ticket details */}
      {conversation.ticket && (conversation.ticket.ticket_number || conversation.ticket.id) && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md text-xs">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <div>
                <span className="font-medium">Ticket No: </span>
                <span className="text-blue-700">{conversation.ticket.ticket_number || `T-${conversation.ticket.id}`}</span>
              </div>
              
              {conversation.ticket.status && (
                <div className="relative">
                  <span className="font-medium">Status: </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setTicketStatusMenuOpen(!ticketStatusMenuOpen);
                    }}
                    className={`px-1.5 py-0.5 rounded-full text-xs cursor-pointer ${getTicketStatusBadge(conversation.ticket.status)}`}
                  >
                    {conversation.ticket.status}
                  </button>
                  
                  {ticketStatusMenuOpen && (
                    <div 
                      className="absolute left-0 mt-1 w-60 bg-white border rounded-md shadow-lg z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-1">
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.status === 'NEW' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketStatusChange('NEW');
                          }}
                        >
                          NEW
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.status === 'ASSIGNED' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketStatusChange('ASSIGNED');
                          }}
                        >
                          ASSIGNED
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.status === 'IN_PROGRESS' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketStatusChange('IN_PROGRESS');
                          }}
                        >
                          IN_PROGRESS
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.status === 'WAITING_ON_CUSTOMER' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketStatusChange('WAITING_ON_CUSTOMER');
                          }}
                        >
                          WAITING_ON_CUSTOMER
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.status === 'WAITING_ON_THIRD_PARTY' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketStatusChange('WAITING_ON_THIRD_PARTY');
                          }}
                        >
                          WAITING_ON_THIRD_PARTY
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.status === 'RESOLVED' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketStatusChange('RESOLVED');
                          }}
                        >
                          RESOLVED
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.status === 'CLOSED' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketStatusChange('CLOSED');
                          }}
                        >
                          CLOSED
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.status === 'REOPENED' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketStatusChange('REOPENED');
                          }}
                        >
                          REOPENED
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {conversation.ticket.priority && (
                <div className="relative">
                  <span className="font-medium">Priority: </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setTicketPriorityMenuOpen(!ticketPriorityMenuOpen);
                    }}
                    className={`px-1.5 py-0.5 rounded-full text-xs cursor-pointer ${getTicketPriorityBadge(conversation.ticket.priority)}`}
                  >
                    {conversation.ticket.priority}
                  </button>
                  
                  {ticketPriorityMenuOpen && (
                    <div 
                      className="absolute left-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-1">
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.priority === 'LOW' || conversation.ticket.priority === 'low' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketPriorityChange('LOW');
                          }}
                        >
                          LOW
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.priority === 'MEDIUM' || conversation.ticket.priority === 'medium' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketPriorityChange('MEDIUM');
                          }}
                        >
                          MEDIUM
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.priority === 'HIGH' || conversation.ticket.priority === 'high' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketPriorityChange('HIGH');
                          }}
                        >
                          HIGH
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100
                            ${conversation.ticket.priority === 'URGENT' || conversation.ticket.priority === 'urgent' ? 'bg-gray-100' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketPriorityChange('URGENT');
                          }}
                        >
                          URGENT
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              {/* If we needed additional ticket actions, we would add them here */}
            </div>
          </div>
          
          {conversation.ticket.title && (
            <div className="mt-2">
              <span className="font-medium">Title: </span>
              <span>{conversation.ticket.title}</span>
            </div>
          )}
          
          {conversation.ticket.description && (
            <div className="mt-1">
              <span className="font-medium">Description: </span>
              <span className="text-gray-700">{conversation.ticket.description}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationDetailHeader;