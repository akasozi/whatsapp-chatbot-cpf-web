import React from 'react';

const AttachmentPreview = ({ attachment }) => {
  // Format the file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Determine if attachment is an image that can be previewed
  const isPreviewableImage = attachment.type?.startsWith('image/') && 
    !attachment.type?.includes('svg') && 
    attachment.thumbnail_url;

  // Determine document icon based on file type
  const getDocumentIcon = () => {
    if (attachment.type === 'application/pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (attachment.type?.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml') || 
               attachment.type === 'application/msword') {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  return (
    <a 
      href={attachment.url} 
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-xs rounded-lg border bg-background overflow-hidden hover:bg-muted/30 transition-colors"
    >
      {isPreviewableImage ? (
        <div className="relative">
          <img 
            src={attachment.thumbnail_url} 
            alt={attachment.name}
            className="w-full max-h-32 object-cover"
          />
        </div>
      ) : (
        <div className="p-4 flex items-center">
          {getDocumentIcon()}
          <div className="ml-2 overflow-hidden">
            <p className="truncate font-medium">{attachment.name}</p>
          </div>
        </div>
      )}
      <div className="p-2 text-xs text-muted-foreground border-t">
        {formatFileSize(attachment.size)}
      </div>
    </a>
  );
};

export default AttachmentPreview;