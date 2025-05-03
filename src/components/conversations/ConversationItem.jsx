import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

/**
 * ConversationItem - A component to display a conversation item in the list
 * 
 * @param {Object} props
 * @param {Object} props.conversation - The conversation data
 * @param {Function} props.onSelectConversation - Callback when conversation is selected
 * @param {boolean} props.isSelected - Whether this conversation is selected
 */
const ConversationItem = ({ 
  conversation, 
  onSelectConversation, 
  isSelected = false,
  onQuickReply
}) => {
  const [showPreview, setShowPreview] = useState(false);
  
  // Get status badge classes based on status
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'TRANSFERRED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  // Get priority badge classes based on priority
  const getPriorityBadgeClasses = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Quick replies for common scenarios
  const quickReplies = [
    "Thank you for providing that information. I'll look into it right away.",
    "I'll need a few more details to help with your request.",
    "Could you please confirm your claim reference number?",
    "Your request has been processed successfully."
  ];
  
  return (
    <div 
      className={`border rounded-lg mb-2 overflow-hidden ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${
        conversation.has_unseen_messages ? 'bg-blue-50 border-blue-200 font-medium' : ''
      } transition-all`}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
              {conversation.customer_name.charAt(0)}
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <h3 className={`text-sm ${conversation.has_unseen_messages ? 'font-bold text-blue-700' : 'font-medium'}`}>
                  {conversation.customer_name}
                </h3>
                {conversation.unread_count > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500 text-white">
                    {conversation.unread_count}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{conversation.phone_number}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeClasses(conversation.status)}`}>
              {conversation.status}
            </span>
            {conversation.ticket?.priority && (
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityBadgeClasses(conversation.ticket.priority)}`}>
                {conversation.ticket.priority}
              </span>
            )}
          </div>
        </div>
        
        <div className="mb-2">
          <p className={`text-sm line-clamp-1 ${
              conversation.has_unseen_messages ? 'font-medium text-gray-900' : ''
            }`}>
            {conversation.lastMessage?.content || "No messages yet"}
          </p>
          <div className="flex justify-between text-xs mt-1">
            <span className={conversation.has_unseen_messages ? 'text-blue-700 font-medium' : 'text-muted-foreground'}>
              {conversation.lastMessage?.source === 'USER' ? 'From customer' : 
                conversation.lastMessage?.source === 'AGENT' ? 'From agent' : 'From system'}
              {conversation.lastMessage?.is_read === false && ' • Unread'}
            </span>
            <span className={conversation.has_unseen_messages ? 'text-blue-700 font-medium' : 'text-muted-foreground'}>
              {formatDate(conversation.last_activity || conversation.updated_at)}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/conversations/${conversation.id}`}>
                View
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onSelectConversation(conversation)}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Select</span>
            </Button>
          </div>
          
          {conversation.ticket && (
            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
              {conversation.ticket.title}
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Reply Section */}
      {showPreview && conversation.status !== 'CLOSED' && (
        <div className="bg-muted/30 p-3 border-t">
          <h4 className="text-xs font-medium mb-2">Quick Replies</h4>
          <div className="flex flex-wrap gap-1">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => onQuickReply(conversation.id, reply)}
                className="text-xs bg-card hover:bg-muted px-2 py-1 rounded-md truncate max-w-[200px] text-left"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationItem;