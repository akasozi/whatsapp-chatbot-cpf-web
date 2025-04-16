import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadAttachment, removeAttachment } from '../redux/slices/conversationsSlice';
import { Button } from '@/components/ui/button';

const FileUpload = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { attachments, uploadProgress } = useSelector((state) => state.conversations);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate file sizes (30MB limit)
    const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
    
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    
    if (oversizedFiles.length > 0) {
      const filesStr = oversizedFiles.length === 1 
        ? oversizedFiles[0].name 
        : `${oversizedFiles.length} files`;
      
      setError(`${filesStr} exceed the 30MB size limit`);
      return;
    }
    
    setError(null);
    
    // Upload files
    files.forEach(file => {
      dispatch(uploadAttachment(file));
    });
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (attachmentId) => {
    dispatch(removeAttachment(attachmentId));
  };

  // Format the file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml') || 
               fileType === 'application/msword') {
      return (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return (
    <div className="mt-4 border border-dashed border-border p-3 rounded-md">
      <h3 className="text-sm font-medium mb-2">Attach files to your message</h3>
      <p className="text-xs text-muted-foreground mb-3">
        You can attach PDFs, images, and documents to send with your message. Max size: 30MB per file.
      </p>
      
      {/* File upload button */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadProgress !== null && uploadProgress < 100}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          Choose Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
        />
        
        {/* Upload progress */}
        {uploadProgress !== null && uploadProgress < 100 && (
          <div className="text-xs text-muted-foreground">
            Uploading... {uploadProgress}%
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="text-xs text-destructive mb-2">
          {error}
        </div>
      )}
      
      {/* Attached files preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {attachments.map((attachment) => (
            <div 
              key={attachment.id} 
              className="flex items-center gap-2 p-2 bg-muted/30 rounded border border-border text-sm"
            >
              {/* File type icon */}
              {getFileIcon(attachment.type)}
              
              {/* File info */}
              <div className="flex-1 min-w-0">
                <div className="truncate max-w-[150px]">{attachment.name}</div>
                <div className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</div>
              </div>
              
              {/* Remove button */}
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveAttachment(attachment.id)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;