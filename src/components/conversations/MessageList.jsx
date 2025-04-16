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
  
  // Get CSS classes for message bubble based on direction - WhatsApp-like styling
  const getMessageClasses = (message) => {
    // Support both source and direction/message_type to determine if it's INBOUND or OUTBOUND
    // Also handle lowercase 'inbound'/'outbound' from the API 
    const isInbound = message.source === 'USER' || 
                      message.source === 'user' ||
                      message.source === 'CUSTOMER' || 
                      message.direction === 'INBOUND' || 
                      message.direction === 'inbound' ||
                      message.message_type === 'INBOUND' ||
                      message.message_type === 'inbound';
    
    const isOutbound = message.source === 'AGENT' || 
                       message.source === 'bot' ||
                       message.direction === 'OUTBOUND' || 
                       message.direction === 'outbound' ||
                       message.message_type === 'OUTBOUND' ||
                       message.message_type === 'outbound';
    
    if (isInbound) {
      // INBOUND messages: Gray bubble with left-aligned styling (WhatsApp received message style)
      return 'bg-white text-black rounded-lg border border-gray-100 shadow-sm'; 
    } else if (isOutbound) {
      // OUTBOUND messages: Green bubble with right-aligned styling (WhatsApp sent message style)
      return 'bg-[#dcf8c6] text-black rounded-lg border border-[#c5e1a5] shadow-sm'; 
    } else if (message.source === 'BOT') {
      // Bot messages: Light purple with subtle styling
      return 'bg-[#f3e5f5] text-black rounded-lg border border-[#e1bee7] shadow-sm'; 
    } else {
      // System messages: Light orange with neutral styling
      return 'bg-[#fff3e0] text-black rounded-lg border border-[#ffe0b2] shadow-sm mx-auto'; 
    }
  };
  
  // Get indicator icon/label based on message source
  const getSourceIndicator = (message) => {
    // Support both source and direction/message_type
    const isCustomer = message.source === 'USER' || 
                      message.source === 'CUSTOMER' || 
                      message.direction === 'INBOUND' || 
                      message.message_type === 'INBOUND';
    
    if (isCustomer) {
      return 'Customer';
    } else if (message.source === 'AGENT' || message.direction === 'OUTBOUND' || message.message_type === 'OUTBOUND') {
      return message.sender_name || 'Agent';
    } else if (message.source === 'BOT') {
      return 'Bot';
    } else {
      return 'System';
    }
  };
  
  // Format agent info for display
  const getAgentInfo = (message) => {
    // Support both source and direction/message_type
    const isAgent = message.source === 'AGENT' || 
                   message.direction === 'OUTBOUND' || 
                   message.message_type === 'OUTBOUND';
                   
    if (!isAgent) return null;
    
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
            
            {/* Message bubble - WhatsApp-like positioning */}
            <div className={`max-w-[70%] group ${
              message.direction === 'INBOUND' || message.direction === 'inbound' || 
              message.message_type === 'INBOUND' || message.message_type === 'inbound' || 
              message.source === 'USER' || message.source === 'user' || 
              message.source === 'CUSTOMER' ? 'mr-auto' : 'ml-auto'
            }`}>
              <div className={`rounded-lg p-3 relative ${getMessageClasses(message)}`}>
                {/* Agent info for agent messages with username */}
                {(message.source === 'AGENT' || message.source === 'agent' || 
                  message.direction === 'OUTBOUND' || message.direction === 'outbound') && (
                  <div className="mb-1 -mt-1 text-[10px] text-gray-500 font-medium flex items-center justify-between">
                    <div>
                      {message.sender_name || 'Agent'}
                      {message.username && message.username !== message.sender_name && (
                        <span className="ml-1 text-blue-500">@{message.username}</span>
                      )}
                      {!message.username && message.sender_id && message.sender_id !== 'system' && (
                        <span className="ml-1 text-blue-500">ID: {message.sender_id}</span>
                      )}
                    </div>
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
                
                {/* Time and status with direction indicator */}
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-gray-500">
                    {(message.direction === 'INBOUND' || message.direction === 'inbound' || 
                      message.message_type === 'INBOUND' || message.message_type === 'inbound' ||
                      message.source === 'USER' || message.source === 'user' || 
                      message.source === 'CUSTOMER') ? 
                      <span className="text-[10px] text-blue-600 font-medium">INBOUND</span> : 
                      <span className="text-[10px] text-green-600 font-medium">OUTBOUND</span>
                    }
                  </span>
                  <div className="flex items-center">
                    <span className="text-[10px] text-gray-500 mr-1">
                      {formatMessageTime(message.created_at)}
                    </span>
                    {(message.source === 'AGENT' || message.direction === 'OUTBOUND' || message.message_type === 'OUTBOUND') && (
                      <span className="text-[10px] text-gray-500">✓✓</span>
                    )}
                  </div>
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
        <div key={message.id} className={`max-w-[70%] group ${
              message.direction === 'INBOUND' || message.direction === 'inbound' || 
              message.message_type === 'INBOUND' || message.message_type === 'inbound' || 
              message.source === 'USER' || message.source === 'user' || 
              message.source === 'CUSTOMER' ? 'mr-auto' : 'ml-auto'
            }`}>
          <div className={`rounded-lg p-3 relative ${getMessageClasses(message)}`}>
            {/* Agent info for agent messages with username */}
            {(message.source === 'AGENT' || message.source === 'agent' || 
              message.direction === 'OUTBOUND' || message.direction === 'outbound' ||
              message.message_type === 'OUTBOUND' || message.message_type === 'outbound') && (
              <div className="mb-1 -mt-1 text-[10px] text-gray-500 font-medium flex items-center justify-between">
                <div>
                  {message.sender_name || 'Agent'}
                  {message.username && message.username !== message.sender_name && (
                    <span className="ml-1 text-blue-500">@{message.username}</span>
                  )}
                  {!message.username && message.sender_id && message.sender_id !== 'system' && (
                    <span className="ml-1 text-blue-500">ID: {message.sender_id}</span>
                  )}
                </div>
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
            
            {/* Time and status with direction indicator */}
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-gray-500">
                {(message.direction === 'INBOUND' || message.direction === 'inbound' || 
                  message.message_type === 'INBOUND' || message.message_type === 'inbound' ||
                  message.source === 'USER' || message.source === 'user' || 
                  message.source === 'CUSTOMER') ? 
                  <span className="text-[10px] text-blue-600 font-medium">INBOUND</span> : 
                  <span className="text-[10px] text-green-600 font-medium">OUTBOUND</span>
                }
              </span>
              <div className="flex items-center">
                <span className="text-[10px] text-gray-500 mr-1">
                  {formatMessageTime(message.created_at)}
                </span>
                {(message.source === 'AGENT' || message.direction === 'OUTBOUND' || message.message_type === 'OUTBOUND') && (
                  <span className="text-[10px] text-gray-500">✓✓</span>
                )}
              </div>
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
        <div 
          className="flex-1 overflow-y-auto space-y-3 p-4"
          style={{
            backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAhOAAAITgBRZYxYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAUeSURBVEiJtZV5bBVVFIe/O2/evn2v9BVaaOoChtJiK0QK1YgGJUCUEIMYMcGkQSyVFo1iApQYFyRB5Q8TEoIhIWCIu1EjYrRSCBpctqJdKFRamq4vb+vbZu78UUDAUjT+kpObycyc892Tc+fOFT7ljV1ze5r/S/5LP/xk/MlAYNmAJQAceOFgSOJv8vefyP+XAR/UWwZvsnVq3skX4VSSdmIuzfLHgY7h+r9B7vCwfHFKXdIzxLcUfXO0pM9QXDNAkFj6N/kXpM5AoT5gc7TO0xL0p6+Xg0GI2yMn7cP+gqNPHx5zsvaF2qvZ8cnZp1/f9Ubr87rkkMQFjXI7BoAE5xKgcsBIS46hdNQ5oQQZzQTz25DuSXfYgn4p0zXNfV+YVyiCgbAoLCgc0tLQcseunw6mNdTU56RmZy5fMH/+6xdkjy0cdF/t6fLiG7vd+uDKFOXTk89EVieYyryLtQOVcLRYlbdjmfbI2Y4rdSBkaGmp7WN+7c2GVUuXrCpev3XL0vZzDd+eqT2dc+HwT7JHYqGjorLmU2ukcbTw1/oPTJvdDYa3qzuQmD0x8/GDO/aMW1dXUeZ2u8e7XK71wOzW5ubHTpafmLNv3978fXv3PQocCgQDIuhvOzfGsxkZmrYm3Zo2vkfYTY9lEWWtTL6mjlq0eYuMRsKxnvY22lra+OPs2ZTzZbUJzc1NE0rLDsZisRiiPV0FwAlgFCBEQkbL2rbG+uB9DzxJ+a4v+Xp7ibzYEEgCbUjC9RxYmZE/QQtHOvF1XmLfju28uX4dNTXVpnA4zIUL9UERERJgIvANYAJCxIWhgn2NKS5X8n2XXzxHKBTFnz6CsaN8uKyCpnBQ9tkj6pnCfJLtPv768zT7d+1kybJXOFVdxc4d29sHDRrUSESMJUuW6EOGDFkM7AasQsSl1WJ42nz9BXuP7CUUCtDub+XBkY8Ru+c5eo0ay9kjR8gY8DzOni6Mbt94I9nw+eefMXFaPosWL+L9De/mdnV1IVNTU6GsrMyZl5f3uKZpLwGpAkBkZrgx0mJgU+CPC/x+qZFhu3eT4/MxNPQQocU1OKw++g7UmDMnHyVAJOpn88Z3sLqSWLlqNalpabjd7rM2mw0RCASYMGFCJvASMEsphRARSqkNQiQrH1i6WGJxGeMUJl8oDvHQ1QquvncnSe3HSevrI9FTw/r1bzFz1nQy+2XS1NTA6qXP0K+fn3fee5+kpCQAYlaLFUQYMGDAxPLy8oNKqTalVAioUEq9I7MzeiUMBD/HFjzKw0MyOc8IzrWcpjkjFfvZP0mUZ5gz7Q7aW9pYvX4dw0aM4LtvS1i2+FkefnQuJSUl+P3+XjabDWEYFn9nZ+f53NzcqWPHjm0oKioyllw9rCZnuKHlJMKwJOKtbyYaKifcXkM8JUTSvfm4Asd56a1P6HGrmKGRkpLC1OrR7C/dS+mpk9lVVVW7DMNACCEcDocIOVxOrrszrg9C97vBm14iPGksrOx1Ysf9mA4PvSQnabEm+g4aTP6UyXR0dKbXnz8fvHrlCkh3d7dISUkRAEIIafWEwqG6xtbQhWj8BLrHhSYsKJlEzGolHm4lKcHEzEwkGApRV1dHPB4HqJVCnDaUQqSmpiLbIopQOMKf59pjp1t6TKMnpoT88Y8Rc29Ds5jYOk6gxWuxx9vRrRpNTU0RwzCOXn1vAVQopUDTNO2mm5kCeaHF39MQiPTENE0QD6mYMrxWi8U93PCoCpFI5ACwTSnV+y/VtQtZuef+jAAAAABJRU5ErkJggg==")`,
            backgroundColor: '#e9e4de'
          }}
        >
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;