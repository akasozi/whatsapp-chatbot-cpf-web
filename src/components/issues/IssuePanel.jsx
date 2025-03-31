import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  createIssue, 
  updateIssue, 
  resolveIssue,
  reopenIssue,
  selectIssue
} from '../../redux/slices/issuesSlice';
import { Button } from '../../components/ui/button';

/**
 * IssuePanel component for managing issues within a conversation
 * 
 * @param {Object} props
 * @param {Array} props.issues - List of issues for this conversation
 * @param {String} props.conversationId - Current conversation ID
 * @param {String} props.selectedIssueId - Currently selected issue ID
 * @param {Boolean} props.isLoading - Whether issues are loading
 */
const IssuePanel = ({ 
  issues = [], 
  conversationId, 
  selectedIssueId = null,
  isLoading = false
}) => {
  const dispatch = useDispatch();
  const [isCreating, setIsCreating] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'GENERAL'
  });
  const [resolution, setResolution] = useState('');
  
  const selectedIssue = issues.find(issue => issue.id === selectedIssueId);
  const hasOpenIssues = issues.some(issue => 
    ['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'REOPENED'].includes(issue.status)
  );
  
  // Handle selecting an issue
  const handleSelectIssue = (issueId) => {
    dispatch(selectIssue(issueId));
  };
  
  // Handle creating a new issue
  const handleCreateIssue = () => {
    dispatch(createIssue({
      conversationId,
      ...newIssue
    }));
    
    // Reset form and close it
    setNewIssue({
      title: '',
      description: '',
      priority: 'MEDIUM',
      category: 'GENERAL'
    });
    setIsCreating(false);
  };
  
  // Handle resolving an issue
  const handleResolveIssue = () => {
    if (!selectedIssue) return;
    
    dispatch(resolveIssue({
      issueId: selectedIssue.id,
      resolution: {
        summary: resolution
      }
    }));
    
    setResolution('');
    setIsResolving(false);
  };
  
  // Handle reopening an issue
  const handleReopenIssue = () => {
    if (!selectedIssue) return;
    
    dispatch(reopenIssue({
      issueId: selectedIssue.id,
      reason: 'Issue requires additional attention'
    }));
  };
  
  // Handle updating issue status
  const handleUpdateStatus = (status) => {
    if (!selectedIssue) return;
    
    dispatch(updateIssue({
      issueId: selectedIssue.id,
      updateData: { status }
    }));
  };
  
  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-indigo-100 text-indigo-800';
      case 'WAITING_CUSTOMER':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'REOPENED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get priority badge style
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-orange-100 text-orange-800';
      case 'LOW':
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
  
  return (
    <div className="border rounded-md h-full flex flex-col">
      <div className="p-3 bg-muted/30 border-b flex justify-between items-center">
        <h3 className="font-medium">Issues</h3>
        <Button 
          size="sm" 
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          New Issue
        </Button>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-2">
          {/* New issue form */}
          {isCreating && (
            <div className="mb-4 p-3 border rounded-md bg-card">
              <h4 className="font-medium mb-2">Create New Issue</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Title</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-1 border rounded-md text-sm"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                    placeholder="Brief issue title"
                  />
                </div>
                <div>
                  <label className="text-sm">Description</label>
                  <textarea 
                    className="w-full px-3 py-1 border rounded-md text-sm"
                    value={newIssue.description}
                    onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                    placeholder="Detailed description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm">Priority</label>
                    <select 
                      className="w-full px-3 py-1 border rounded-md text-sm"
                      value={newIssue.priority}
                      onChange={(e) => setNewIssue({...newIssue, priority: e.target.value})}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm">Category</label>
                    <select 
                      className="w-full px-3 py-1 border rounded-md text-sm"
                      value={newIssue.category}
                      onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                    >
                      <option value="GENERAL">General</option>
                      <option value="ACCOUNT">Account</option>
                      <option value="CLAIMS">Claims</option>
                      <option value="TECHNICAL">Technical</option>
                      <option value="BENEFITS">Benefits</option>
                      <option value="PAYMENTS">Payments</option>
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
                    onClick={handleCreateIssue}
                    disabled={!newIssue.title}
                  >
                    Create Issue
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Issue resolution form */}
          {isResolving && selectedIssue && (
            <div className="mb-4 p-3 border rounded-md bg-card">
              <h4 className="font-medium mb-2">Resolve Issue</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Resolution Summary</label>
                  <textarea 
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
                    onClick={() => setIsResolving(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleResolveIssue}
                    disabled={!resolution.trim()}
                  >
                    Resolve Issue
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Issues list */}
          {issues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No issues found</p>
              <p className="text-xs mt-1">Create a new issue to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {issues.map((issue) => (
                <div 
                  key={issue.id}
                  className={`p-3 border rounded-md cursor-pointer hover:bg-muted/30 transition-colors
                    ${selectedIssueId === issue.id ? 'bg-muted/50 ring-1 ring-primary/30' : ''}`}
                  onClick={() => handleSelectIssue(issue.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{issue.title}</h4>
                      <div className="flex space-x-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(issue.status)}`}>
                          {issue.status}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(issue.priority)}`}>
                          {issue.priority}
                        </span>
                        {issue.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {issue.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(issue.created_at)}
                    </div>
                  </div>
                  
                  {/* Description only shown when selected */}
                  {selectedIssueId === issue.id && (
                    <>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {issue.description || 'No description provided'}
                      </p>
                      
                      {/* Resolution info for resolved issues */}
                      {issue.status === 'RESOLVED' && (
                        <div className="mt-2 p-2 bg-green-50 rounded-md text-sm">
                          <div className="font-medium text-green-800">Resolution:</div>
                          <div className="text-green-700">{issue.resolution_summary}</div>
                          <div className="mt-1 text-xs text-green-600">
                            Resolved in {issue.resolution_time} minutes on {formatTime(issue.closed_at)}
                          </div>
                        </div>
                      )}
                      
                      {/* Action buttons based on status */}
                      <div className="mt-3 flex justify-end space-x-2">
                        {['OPEN', 'REOPENED'].includes(issue.status) && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpdateStatus('IN_PROGRESS')}
                          >
                            Start Working
                          </Button>
                        )}
                        
                        {issue.status === 'IN_PROGRESS' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpdateStatus('WAITING_CUSTOMER')}
                          >
                            Waiting for Customer
                          </Button>
                        )}
                        
                        {['IN_PROGRESS', 'WAITING_CUSTOMER'].includes(issue.status) && (
                          <Button 
                            size="sm"
                            onClick={() => setIsResolving(true)}
                          >
                            Resolve Issue
                          </Button>
                        )}
                        
                        {issue.status === 'RESOLVED' && (
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={handleReopenIssue}
                          >
                            Reopen Issue
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

export default IssuePanel;