import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { 
  createTicket, 
  updateTicketStatus, 
  updateTicketPriority,
  resolveTicket,
  reopenTicket,
  fetchTicketByNumber,
  updateTicketFromConversation
} from '../../redux/slices/ticketsSlice';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

/**
 * TicketPanel component for managing support tickets within a conversation
 * 
 * @param {Object} props
 * @param {Array} props.tickets - List of tickets for this conversation
 * @param {String} props.conversationId - Current conversation ID
 * @param {String} props.selectedTicketId - Currently selected ticket ID
 * @param {Boolean} props.isLoading - Whether tickets are loading
 * @param {Object} props.conversationTicket - Ticket object from the conversation data
 */
const TicketPanel = ({ 
  tickets = [], 
  conversationId, 
  selectedTicketId = null,
  isLoading = false,
  conversationTicket = null
}) => {
  const dispatch = useDispatch();
  const [isCreating, setIsCreating] = useState(false);
  const [isResolvingTicket, setIsResolvingTicket] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [priorityMenuOpen, setPriorityMenuOpen] = useState(false);
  
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'new'
  });
  
  const [resolution, setResolution] = useState('');
  const [agentNotes, setAgentNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newPriority, setPriority] = useState('');
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Reference to the agent notes textarea to maintain focus
  const agentNotesRef = useRef(null);
  
  const selectedTicket = tickets.find(ticket => ticket.id === selectedTicketId);
  
  // Handle selecting a ticket
  const handleSelectTicket = (ticketId) => {
    if (selectedTicketId === ticketId) {
      // Deselect if already selected
      dispatch({ type: 'tickets/selectTicket', payload: null });
    } else {
      dispatch({ type: 'tickets/selectTicket', payload: ticketId });
    }
    
    // Reset all edit states when changing selection
    setIsResolvingTicket(false);
    setIsChangingStatus(false);
    setStatusMenuOpen(false);
    setPriorityMenuOpen(false);
    
    // Clear the agent notes when switching tickets to avoid confusion
    setAgentNotes('');
    setNewStatus('');
  };
  
  // Handle creating a new ticket
  const handleCreateTicket = () => {
    dispatch(createTicket({
      conversation_id: conversationId,
      ...newTicket
    }));
    
    // Reset form and close it
    setNewTicket({
      title: '',
      description: '',
      priority: 'medium',
      status: 'new'
    });
    setIsCreating(false);
  };
  
  // Handle updating ticket status
  const handleUpdateStatus = (status) => {
    if (!selectedTicket) return;
    
    // Set the new status and focus the agent notes textarea
    setNewStatus(status);
    setStatusMenuOpen(false);
    
    // Focus the textarea after a slight delay to ensure the DOM has updated
    setTimeout(() => {
      if (agentNotesRef.current) {
        agentNotesRef.current.focus();
      }
    }, 50);
  };
  
  const submitStatusChange = () => {
    if (!selectedTicket || !newStatus) return;
    
    dispatch(updateTicketStatus({
      ticketId: selectedTicket.id,
      status: newStatus,
      notes: agentNotes || undefined
    }));
    
    // Show a success indication
    const statusElement = document.getElementById('status-update-message');
    if (statusElement) {
      statusElement.textContent = 'Status and notes updated!';
      statusElement.classList.remove('hidden');
      
      // Hide after 3 seconds
      setTimeout(() => {
        statusElement.classList.add('hidden');
      }, 3000);
    }
    
    setIsChangingStatus(false);
    setNewStatus('');
    setAgentNotes('');
  };
  
  // Handle updating ticket priority
  const handleUpdatePriority = (priority) => {
    if (!selectedTicket) return;
    
    dispatch(updateTicketPriority({
      ticketId: selectedTicket.id,
      priority
    }));
    
    setPriorityMenuOpen(false);
  };
  
  // Handle resolving a ticket
  const handleResolveTicket = () => {
    if (!selectedTicket) return;
    
    dispatch(resolveTicket({
      ticketId: selectedTicket.id,
      resolution: resolution,
      status: 'resolved' // Use lowercase status value
    }));
    
    setResolution('');
    setIsResolvingTicket(false);
  };
  
  // Handle reopening a ticket
  const handleReopenTicket = () => {
    if (!selectedTicket) return;
    
    dispatch(reopenTicket({
      ticketId: selectedTicket.id,
      reason: 'Reopened by agent'
    }));
  };
  
  // Handle loading full ticket details
  const handleLoadFullTicketDetails = (ticketNumber) => {
    if (!ticketNumber) return;
    
    setIsLoadingDetails(true);
    
    // Dispatch action to fetch ticket by number
    dispatch(fetchTicketByNumber(ticketNumber))
      .unwrap()
      .then(() => {
        // Loading succeeded
        setIsLoadingDetails(false);
      })
      .catch(error => {
        console.error('Failed to load ticket details:', error);
        setIsLoadingDetails(false);
      });
  };
  
  // Get status badge style
  const getStatusBadge = (status) => {
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
  
  // Get priority badge style
  const getPriorityBadge = (priority) => {
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
  
  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };
  
  // Close dropdowns when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setStatusMenuOpen(false);
      setPriorityMenuOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Add conversationTicket to the local tickets array if it's not already there
  // and automatically select it to display ticket details
  useEffect(() => {
    if (conversationTicket && conversationTicket.id) {
      // Check if the ticket already exists in our tickets array
      const existingTicket = tickets.find(t => t.id === conversationTicket.id);
      
      if (!existingTicket) {
        // Add the conversation ticket to our local state by dispatching it to the Redux store
        dispatch(updateTicketFromConversation({
          conversationId,
          ticket: conversationTicket
        }));
        
        // Automatically select this ticket to show its details
        dispatch({ type: 'tickets/selectTicket', payload: conversationTicket.id });
      } else if (!selectedTicketId) {
        // If ticket exists but none is currently selected, select the conversation ticket
        dispatch({ type: 'tickets/selectTicket', payload: conversationTicket.id });
      }
    }
  }, [conversationTicket, tickets, dispatch, conversationId, selectedTicketId]);
  
  // Effect to maintain focus on the agent notes textarea when status changes 
  useEffect(() => {
    if (newStatus && agentNotesRef.current) {
      agentNotesRef.current.focus();
    }
  }, [newStatus]);
  
  return (
    <div className="border rounded-md h-full flex flex-col">
      <div className="p-3 bg-blue-50 border-b flex justify-between items-center">
        <h3 className="font-medium">Support Tickets</h3>
        <div className="flex items-center space-x-2">
          <div id="status-update-message" className="text-green-600 text-sm font-medium mr-2 hidden">
            Status and notes updated!
          </div>
          <Button 
            size="sm" 
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
          >
            New Ticket
          </Button>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-2">
          {/* New ticket form */}
          {isCreating && (
            <div className="mb-4 p-3 border rounded-md bg-card">
              <h4 className="font-medium mb-2">Create New Ticket</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Title</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-1 border rounded-md text-sm"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    placeholder="Brief ticket title"
                  />
                </div>
                <div>
                  <label className="text-sm">Description</label>
                  <Textarea 
                    className="w-full px-3 py-1 border rounded-md text-sm"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    placeholder="Detailed description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm">Priority</label>
                    <select 
                      className="w-full px-3 py-1 border rounded-md text-sm"
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm">Status</label>
                    <select 
                      className="w-full px-3 py-1 border rounded-md text-sm"
                      value={newTicket.status}
                      onChange={(e) => setNewTicket({...newTicket, status: e.target.value})}
                    >
                      <option value="new">New</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCreateTicket}
                    disabled={!newTicket.title}
                  >
                    Create Ticket
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Ticket resolution form */}
          {isResolvingTicket && selectedTicket && (
            <div className="mb-4 p-3 border rounded-md bg-card">
              <h4 className="font-medium mb-2">Resolve Ticket</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Resolution Summary</label>
                  <Textarea 
                    className="w-full px-3 py-1 border rounded-md text-sm"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Describe how the issue was resolved"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsResolvingTicket(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleResolveTicket}
                    disabled={!resolution.trim()}
                  >
                    Resolve Ticket
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Status change form - removed */}
          
          {/* Tickets list */}
          {tickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No tickets found</p>
              <p className="text-xs mt-1">Create a new ticket to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className={`p-3 border rounded-md cursor-pointer hover:bg-blue-50/30 transition-colors
                    ${selectedTicketId === ticket.id ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}
                  onClick={() => handleSelectTicket(ticket.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{ticket.ticket_number || `T-${ticket.id}`}{ticket.title ? `: ${ticket.title}` : ''}</h4>
                      <div className="flex space-x-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(ticket.created_at)}
                    </div>
                  </div>
                  
                  {/* Details only shown when selected */}
                  {selectedTicketId === ticket.id && (
                    <>
                      {ticket.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {ticket.description}
                        </p>
                      )}
                      
                      {/* Agent notes history section */}
                      {ticket.agent_notes && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm border border-blue-100">
                          <div className="font-medium text-blue-800 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Agent Notes History:
                          </div>
                          <div className="text-blue-700 whitespace-pre-wrap mt-1 border-t border-blue-100 pt-2">
                            {ticket.agent_notes}
                          </div>
                        </div>
                      )}
                      
                      {/* Resolution info for resolved tickets */}
                      {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && ticket.resolved_at && (
                        <div className="mt-2 p-2 bg-green-50 rounded-md text-sm">
                          <div className="font-medium text-green-800">Resolution:</div>
                          {ticket.resolution && (
                            <div className="text-green-700">{ticket.resolution}</div>
                          )}
                          <div className="mt-1 text-xs text-green-600">
                            Resolved on {formatTime(ticket.resolved_at)}
                          </div>
                        </div>
                      )}
                      
                      {/* Direct Status Update and Agent Notes */}
                      <div 
                        className="mt-3 p-3 border rounded-md bg-gray-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="mb-2 flex justify-between">
                          <div className="flex space-x-2">
                            <div className="relative">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setStatusMenuOpen(!statusMenuOpen);
                                  setPriorityMenuOpen(false);
                                }}
                              >
                                Status: <span className={`px-1.5 py-0.5 ml-1 rounded-full text-xs ${getStatusBadge(ticket.status)}`}>{ticket.status || 'NEW'}</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </Button>
                              
                              {statusMenuOpen && (
                                <div 
                                  className="absolute left-0 mt-1 w-52 bg-white border rounded-md shadow-lg z-10"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="py-1">
                                    <button
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                        ${ticket.status?.toLowerCase() === 'new' ? 'bg-gray-100' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNewStatus('new');
                                        setStatusMenuOpen(false);
                                      }}
                                    >
                                      NEW
                                    </button>
                                    <button
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                        ${ticket.status?.toLowerCase() === 'assigned' ? 'bg-gray-100' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNewStatus('assigned');
                                        setStatusMenuOpen(false);
                                      }}
                                    >
                                      ASSIGNED
                                    </button>
                                    <button
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                        ${ticket.status?.toLowerCase() === 'in_progress' ? 'bg-gray-100' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNewStatus('in_progress');
                                        setStatusMenuOpen(false);
                                      }}
                                    >
                                      IN_PROGRESS
                                    </button>
                                    <button
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                        ${ticket.status?.toLowerCase() === 'waiting_on_customer' ? 'bg-gray-100' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNewStatus('waiting_on_customer');
                                        setStatusMenuOpen(false);
                                      }}
                                    >
                                      WAITING_ON_CUSTOMER
                                    </button>
                                    <button
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                        ${ticket.status?.toLowerCase() === 'waiting_on_third_party' ? 'bg-gray-100' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNewStatus('waiting_on_third_party');
                                        setStatusMenuOpen(false);
                                      }}
                                    >
                                      WAITING_ON_THIRD_PARTY
                                    </button>
                                    <button
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 bg-green-50
                                        ${ticket.status?.toLowerCase() === 'resolved' ? 'bg-green-100' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNewStatus('resolved');
                                        setStatusMenuOpen(false);
                                      }}
                                    >
                                      <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        RESOLVED
                                      </span>
                                    </button>
                                    <button
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                        ${ticket.status?.toLowerCase() === 'closed' ? 'bg-gray-100' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNewStatus('closed');
                                        setStatusMenuOpen(false);
                                      }}
                                    >
                                      CLOSED
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="relative">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPriorityMenuOpen(!priorityMenuOpen);
                                  setStatusMenuOpen(false);
                                }}
                              >
                                Priority: <span className={`px-1.5 py-0.5 ml-1 rounded-full text-xs ${getPriorityBadge(ticket.priority)}`}>{ticket.priority || 'MEDIUM'}</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </Button>
                              
                              {priorityMenuOpen && (
                                <div 
                                  className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-10"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="py-1">
                                    <button
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                        ${ticket.priority?.toLowerCase() === 'low' ? 'bg-gray-100' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdatePriority('low');
                                      }}
                                    >
                                      LOW
                                    </button>
                                    <button
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                        ${ticket.priority?.toLowerCase() === 'medium' ? 'bg-gray-100' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdatePriority('medium');
                                      }}
                                    >
                                      MEDIUM
                                    </button>
                                    <button
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                        ${ticket.priority?.toLowerCase() === 'high' ? 'bg-gray-100' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdatePriority('high');
                                      }}
                                    >
                                      HIGH
                                    </button>
                                    <button
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                        ${ticket.priority?.toLowerCase() === 'urgent' ? 'bg-gray-100' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdatePriority('urgent');
                                      }}
                                    >
                                      URGENT
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Status change indicator */}
                          {newStatus && (
                            <div className="text-sm">
                              <span>New Status: </span>
                              <span className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusBadge(newStatus)}`}>
                                {newStatus.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Agent Notes */}
                        <div 
                          className="mt-3"
                          onClick={(e) => {
                            // Stop propagation to prevent parent elements from capturing click
                            e.stopPropagation();
                          }}
                        >
                          <div className="flex items-center mb-1">
                            <label className="text-sm font-medium">Agent Notes</label>
                            <span className="ml-1 text-xs text-blue-600">(Visible to agents only)</span>
                          </div>
                          <div 
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <textarea 
                              ref={agentNotesRef}
                              className="w-full px-3 py-2 border rounded-md text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={agentNotes}
                              onChange={(e) => setAgentNotes(e.target.value)}
                              placeholder="Add notes about this ticket (required when changing status)"
                              rows={3}
                              // Prevent clicks from bubbling up to parent elements
                              onClick={(e) => e.stopPropagation()}
                              // Prevent mousedown events from bubbling up
                              onMouseDown={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        {/* Submit button - enabled when there are notes, use current status if none selected */}
                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                              dispatch(updateTicketStatus({
                                ticketId: selectedTicket.id,
                                status: newStatus || ticket.status, // Use current status if none selected
                                notes: agentNotes
                              }))
                              .then(() => {
                                // Show success message
                                const statusElement = document.getElementById('status-update-message');
                                if (statusElement) {
                                  statusElement.textContent = 'Ticket updated!';
                                  statusElement.classList.remove('hidden');
                                  
                                  // Hide after 3 seconds
                                  setTimeout(() => {
                                    statusElement.classList.add('hidden');
                                  }, 3000);
                                }
                                
                                // Only clear the status, preserving agent_notes for context
                                setNewStatus('');
                                
                                // Only append, don't reset notes
                                // We no longer clear agent_notes, so they're preserved
                              });
                            }}
                            disabled={!agentNotes.trim()}
                          >
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {newStatus ? `Update to ${newStatus.toUpperCase()}` : "Update Ticket Notes"}
                            </span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex justify-end space-x-2">
                        {/* View complete details button */}
                        {ticket.ticket_number && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoadFullTicketDetails(ticket.ticket_number);
                            }}
                            disabled={isLoadingDetails}
                          >
                            {isLoadingDetails ? (
                              <>
                                <span className="animate-spin mr-1">⟳</span> 
                                Loading...
                              </>
                            ) : (
                              'View Complete Details'
                            )}
                          </Button>
                        )}
                        
                        {['in_progress', 'waiting_on_customer', 'waiting_on_third_party'].includes(ticket.status?.toLowerCase()) && (
                          <Button 
                            size="sm"
                            variant="success"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsResolvingTicket(true);
                            }}
                          >
                            Resolve Ticket
                          </Button>
                        )}
                        
                        {(ticket.status?.toLowerCase() === 'resolved' || ticket.status?.toLowerCase() === 'closed') && (
                          <Button 
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReopenTicket();
                            }}
                          >
                            Reopen Ticket
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketPanel;