import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { attachMessageToIssue } from '../../redux/slices/issuesSlice';
import AttachmentPreview from '../AttachmentPreview';

/**
 * MessageList component displays conversation messages with proper formatting
 * 
 * @param {Object} props
 * @param {Array} props.messages - List of messages to display
 * @param {String} props.currentIssueId - Currently selected issue ID (for attaching messages)
 * @param {Boolean} props.isLoading - Loading state
 */
const MessageList = ({ 
  messages = [], 
  currentIssueId = null,
  isLoading = false
}) => {
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);
  
  // Format timestamp for display
  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Get CSS classes for message bubble based on source - WhatsApp-like styling
  const getMessageClasses = (message) => {
    if (message.source === 'USER') {
      return 'bg-[#e2f7cb] text-black ml-auto'; // WhatsApp green for user messages
    } else if (message.source === 'AGENT') {
      return 'bg-white text-black'; // White for agent messages
    } else if (message.source === 'BOT') {
      return 'bg-[#f0f0f0] text-black'; // Light gray for bot messages
    } else {
      return 'bg-[#ffe6cc] text-black'; // Light orange for system messages
    }
  };
  
  // Get indicator icon/label based on message source
  const getSourceIndicator = (message) => {
    if (message.source === 'USER') {
      return 'Customer';
    } else if (message.source === 'AGENT') {
      return message.sender_name || 'Agent';
    } else if (message.source === 'BOT') {
      return 'Bot';
    } else {
      return 'System';
    }
  };
  
  // Format agent info for display
  const getAgentInfo = (message) => {
    if (message.source !== 'AGENT') return null;
    
    const agentName = message.sender_name || 'Agent';
    const responseTime = message.response_time_seconds 
      ? `${Math.round(message.response_time_seconds / 60)} min response` 
      : null;
      
    return { agentName, responseTime };
  };
  
  // Handle attaching a message to the current issue
  const handleAttachToIssue = (messageId) => {
    if (!currentIssueId) return;
    
    dispatch(attachMessageToIssue({
      issueId: currentIssueId,
      messageId
    }));
  };
  
  // Check if message is already attached to current issue
  const isMessageAttachedToCurrentIssue = (message) => {
    return currentIssueId && message.issue_id === currentIssueId;
  };
  
  // Group adjacent messages by date - prepare outside the render conditionals
  const renderMessages = () => {
    let currentDate = null;
    return messages.map((message, index) => {
      const messageDate = new Date(message.created_at).toDateString();
      const showDateDivider = currentDate !== messageDate;
      
      if (showDateDivider) {
        currentDate = messageDate;
        
        // Format the date for display
        const formattedDate = new Date(message.created_at).toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        });
        
        return (
          <div key={message.id}>
            {/* Date divider */}
            <div className="flex justify-center my-4">
              <div className="bg-[#e1f2fa] rounded-full px-3 py-1 text-xs text-[#5a7589] font-medium shadow-sm">
                {formattedDate}
              </div>
            </div>
            
            {/* Message bubble */}
            <div className={`max-w-[70%] group ${message.source === 'USER' ? 'ml-auto' : 'mr-auto'}`}>
              <div className={`rounded-lg p-3 shadow-sm relative ${getMessageClasses(message)}`}>
                {/* Agent info for agent messages */}
                {message.source === 'AGENT' && (
                  <div className="mb-1 -mt-1 text-[10px] text-gray-500 font-medium">
                    {message.sender_name || 'Agent'}
                    {message.response_time_seconds && (
                      <span className="ml-2 text-green-600">
                        {Math.round(message.response_time_seconds / 60)}m response
                      </span>
                    )}
                  </div>
                )}
                
                {/* Message content */}
                <div className="whitespace-pre-wrap text-sm break-words">
                  {message.content}
                </div>
                
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment) => (
                      <AttachmentPreview key={attachment.id} attachment={attachment} />
                    ))}
                  </div>
                )}
                
                {/* Issue indicator */}
                {message.issue_id && (
                  <div className="mt-1 inline-flex items-center text-xs">
                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-1.5 py-0.5">
                      Linked to issue
                    </span>
                  </div>
                )}
                
                {/* Time and status */}
                <div className="text-right mt-1">
                  <span className="text-[10px] text-gray-500 mr-1">
                    {formatMessageTime(message.created_at)}
                  </span>
                  {message.source === 'AGENT' && (
                    <span className="text-[10px] text-gray-500">✓✓</span>
                  )}
                </div>
                
                {/* Action menu */}
                {currentIssueId && !isMessageAttachedToCurrentIssue(message) && (
                  <button 
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleAttachToIssue(message.id)}
                    title="Attach to current issue"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <div key={message.id} className={`max-w-[70%] group ${message.source === 'USER' ? 'ml-auto' : 'mr-auto'}`}>
          <div className={`rounded-lg p-3 shadow-sm relative ${getMessageClasses(message)}`}>
            {/* Agent info for agent messages */}
            {message.source === 'AGENT' && (
              <div className="mb-1 -mt-1 text-[10px] text-gray-500 font-medium">
                {message.sender_name || 'Agent'}
                {message.response_time_seconds && (
                  <span className="ml-2 text-green-600">
                    {Math.round(message.response_time_seconds / 60)}m response
                  </span>
                )}
              </div>
            )}
            
            {/* Message content */}
            <div className="whitespace-pre-wrap text-sm break-words">
              {message.content}
            </div>
            
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment) => (
                  <AttachmentPreview key={attachment.id} attachment={attachment} />
                ))}
              </div>
            )}
            
            {/* Issue indicator */}
            {message.issue_id && (
              <div className="mt-1 inline-flex items-center text-xs">
                <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-1.5 py-0.5">
                  Linked to issue
                </span>
              </div>
            )}
            
            {/* Time and status */}
            <div className="text-right mt-1">
              <span className="text-[10px] text-gray-500 mr-1">
                {formatMessageTime(message.created_at)}
              </span>
              {message.source === 'AGENT' && (
                <span className="text-[10px] text-gray-500">✓✓</span>
              )}
            </div>
            
            {/* Action menu */}
            {currentIssueId && !isMessageAttachedToCurrentIssue(message) && (
              <button 
                className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleAttachToIssue(message.id)}
                title="Attach to current issue"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  // Main render
  return (
    <div className="h-full flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p>No messages yet</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3">
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;