import React from 'react';
import api from '../services/api'; // Import API for download URLs

const AttachmentPreview = ({ attachment }) => {
  // Format the file size to human-readable format
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get document name from attachment
  const getDocumentName = () => {
    return attachment.name || attachment.file_name || 'attachment';
  };

  // Get document size
  const getDocumentSize = () => {
    return attachment.size || 0; // Default to 0 if size not provided
  };

  // Determine if attachment is an image that can be previewed
  const isPreviewableImage = (attachment.type?.startsWith('image/') || 
    attachment.mime_type?.startsWith('image/')) && 
    !attachment.type?.includes('svg') && 
    (attachment.thumbnail_url || attachment.preview_url);

  // Determine document icon based on file type
  const getDocumentIcon = () => {
    const fileType = attachment.type || attachment.mime_type || attachment.content_type || '';
    
    if (fileType.includes('pdf') || fileType === 'application/pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType.includes('word') || fileType === 'application/msword') {
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

  // Handle document download
  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Determine the download URL
    let downloadUrl = attachment.download_url || attachment.url;
    
    // If the document ID is available but no download URL, construct it
    if (!downloadUrl && (attachment.id || attachment.document_id)) {
      const documentId = attachment.id || attachment.document_id;
      downloadUrl = `/attachments/documents/${documentId}/download`;
    }
    
    // If the download URL is a relative path, prepend the API base URL
    if (downloadUrl && downloadUrl.startsWith('/')) {
      const apiBaseUrl = api.defaults.baseURL;
      
      // Fix duplication of /api/v1 in path
      // If downloadUrl contains /api/v1 and baseUrl ends with /api/v1,
      // remove it from downloadUrl to avoid duplication
      if (downloadUrl.startsWith('/api/v1/') && apiBaseUrl.endsWith('/api/v1')) {
        console.log('Fixing API path duplication');
        downloadUrl = downloadUrl.substring(7); // Remove /api/v1 prefix
      }
      
      downloadUrl = `${apiBaseUrl}${downloadUrl}`;
      console.log('Constructed download URL:', downloadUrl);
    }
    
    if (downloadUrl) {
      // Open in a new tab - this will trigger the browser's download behavior for most file types
      window.open(downloadUrl, '_blank');
    } else {
      console.error('No download URL available for attachment:', attachment);
    }
  };

  // Determine the URL for displaying/previewing the attachment
  const getPreviewUrl = () => {
    return attachment.url || attachment.preview_url || attachment.thumbnail_url || '#';
  };

  return (
    <div className="group block max-w-xs rounded-lg border bg-background overflow-hidden hover:bg-muted/30 transition-colors">
      <a 
        href={getPreviewUrl()} 
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {isPreviewableImage ? (
          <div className="relative">
            <img 
              src={attachment.thumbnail_url || attachment.preview_url} 
              alt={getDocumentName()}
              className="w-full max-h-32 object-cover"
            />
          </div>
        ) : (
          <div className="p-4 flex items-center">
            {getDocumentIcon()}
            <div className="ml-2 overflow-hidden">
              <p className="truncate font-medium">{getDocumentName()}</p>
            </div>
          </div>
        )}
      </a>
      
      <div className="p-2 flex justify-between items-center text-xs text-muted-foreground border-t">
        <span>{formatFileSize(getDocumentSize())}</span>
        
        {/* Download button */}
        {(attachment.download_url || attachment.url) && (
          <button 
            onClick={handleDownload}
            className="ml-auto flex items-center text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/10 transition-colors"
            title="Download file"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AttachmentPreview;