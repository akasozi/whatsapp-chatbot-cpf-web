import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  sendMessage,
  uploadAttachment,
  removeAttachment,
  clearAttachments 
} from '../../redux/slices/conversationsSlice';
import { Button } from '../../components/ui/button';
import AttachmentPreview from '../AttachmentPreview';

/**
 * MessageInput component for sending messages with optional attachments
 * 
 * @param {Object} props
 * @param {String} props.conversationId - Current conversation ID
 * @param {Array} props.pendingAttachments - List of attachments ready to send
 * @param {String} props.currentIssueId - Current issue ID (optional)
 * @param {Boolean} props.isLoading - Whether a message is being sent
 * @param {Number} props.uploadProgress - Upload progress percentage
 */
const MessageInput = ({ 
  conversationId, 
  pendingAttachments = [],
  currentIssueId = null,
  isLoading = false,
  uploadProgress = null 
}) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // Upload each file
    for (let i = 0; i < files.length; i++) {
      try {
        await dispatch(uploadAttachment(files[i])).unwrap();
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
    
    // Reset input and uploading state
    e.target.value = null;
    setIsUploading(false);
  };
  
  // Remove an attachment
  const handleRemoveAttachment = (attachmentId) => {
    dispatch(removeAttachment(attachmentId));
  };
  
  // Send the message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() && pendingAttachments.length === 0) return;
    
    dispatch(sendMessage({
      conversationId,
      content: message.trim(),
      attachments: pendingAttachments,
      issueId: currentIssueId
    }));
    
    setMessage('');
  };
  
  return (
    <div className="p-3">
      {/* Pending attachments */}
      {pendingAttachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 bg-white p-2 rounded-lg shadow-sm">
          {pendingAttachments.map((attachment) => (
            <div key={attachment.id} className="relative group">
              <AttachmentPreview attachment={attachment} compact />
              <button 
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveAttachment(attachment.id)}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          {pendingAttachments.length > 0 && (
            <button
              className="text-sm text-red-500 hover:text-red-700"
              onClick={() => dispatch(clearAttachments())}
            >
              Clear all
            </button>
          )}
        </div>
      )}
      
      {/* Upload progress */}
      {uploadProgress !== null && (
        <div className="w-full mb-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-xs text-right text-gray-500 mt-1">
            {uploadProgress}% uploaded
          </div>
        </div>
      )}
      
      {/* Issue indicator */}
      {currentIssueId && (
        <div className="mb-2 bg-blue-50 py-1 px-2 rounded-lg text-xs text-blue-700 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Messages will be linked to the current issue
        </div>
      )}
      
      {/* WhatsApp style input bar */}
      <div className="flex items-center bg-white rounded-full shadow-md p-1">
        {/* Attachment button */}
        <div className="px-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            multiple
            disabled={isUploading || isLoading}
          />
          <label
            htmlFor="file-upload"
            className={`flex items-center justify-center h-9 w-9 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors
              ${(isUploading || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </label>
        </div>
        
        {/* Text input */}
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center pr-2">
          <div className="relative flex-1">
            <textarea
              className="w-full py-2 px-3 resize-none focus:outline-none text-gray-800 min-h-[40px] max-h-32 overflow-auto"
              placeholder="Type a message (Shift+Enter for new line)"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                // Auto-adjust height based on content
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={isLoading}
            />
            {message.split('\n').length > 1 && (
              <div className="absolute bottom-1 right-1 bg-gray-100 rounded-md px-1 py-0.5 text-[10px] text-gray-500">
                Multiline message
              </div>
            )}
          </div>
          
          {/* Send button */}
          <button 
            type="submit" 
            disabled={isLoading || (message.trim() === '' && pendingAttachments.length === 0)}
            className={`h-9 w-9 rounded-full flex items-center justify-center ml-1 
              ${(message.trim() === '' && pendingAttachments.length === 0) 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-[#00a884] text-white'}`}
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;