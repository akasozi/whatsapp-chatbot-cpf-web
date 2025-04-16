import { mockIssuesData } from '../utils/mockData';

// Mock delay to simulate API request
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to find an issue by ID
const findIssue = (id) => {
  const issue = mockIssuesData.find(i => i.id === id);
  if (!issue) {
    throw new Error(`Issue with ID ${id} not found`);
  }
  return { ...issue };
};

// Helper to calculate resolution time
const calculateResolutionTime = (createdAt, closedAt) => {
  const created = new Date(createdAt);
  const closed = new Date(closedAt);
  return Math.round((closed - created) / (1000 * 60)); // in minutes
};

const IssuesService = {
  // Get all issues for a conversation
  async getIssuesByConversation(conversationId) {
    await mockDelay();
    
    const issues = mockIssuesData
      .filter(issue => issue.conversation_id === conversationId)
      .map(issue => ({ ...issue }));
    
    return {
      conversationId,
      issues
    };
  },
  
  // Get issue by ID
  async getIssueById(issueId) {
    await mockDelay();
    return findIssue(issueId);
  },
  
  // Create a new issue
  async createIssue(issueData) {
    await mockDelay(800);
    
    const now = new Date().toISOString();
    
    // Create new issue with provided data
    const newIssue = {
      id: `issue-${Date.now()}`,
      conversation_id: issueData.conversationId,
      title: issueData.title,
      description: issueData.description || '',
      created_at: now,
      updated_at: now,
      closed_at: null,
      status: 'OPEN',
      priority: issueData.priority || 'MEDIUM',
      category: issueData.category || null,
      assigned_agent: issueData.assignedAgent || null,
      resolution_summary: null,
      resolution_time: null,
      attached_messages: issueData.messageIds || []
    };
    
    // Add to mock data store
    mockIssuesData.push(newIssue);
    
    return newIssue;
  },
  
  // Update an issue
  async updateIssue(issueId, updateData) {
    await mockDelay();
    
    const issue = findIssue(issueId);
    
    // Update fields
    const updatedIssue = {
      ...issue,
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    // Find the issue in our mock data and update it
    const index = mockIssuesData.findIndex(i => i.id === issueId);
    if (index !== -1) {
      mockIssuesData[index] = updatedIssue;
    }
    
    return updatedIssue;
  },
  
  // Resolve an issue
  async resolveIssue(issueId, resolution) {
    await mockDelay();
    
    const issue = findIssue(issueId);
    const now = new Date().toISOString();
    
    // Calculate resolution time
    const resolutionTime = calculateResolutionTime(issue.created_at, now);
    
    // Update issue
    const resolvedIssue = {
      ...issue,
      status: 'RESOLVED',
      closed_at: now,
      updated_at: now,
      resolution_summary: resolution.summary || '',
      resolution_time: resolutionTime
    };
    
    // Find the issue in our mock data and update it
    const index = mockIssuesData.findIndex(i => i.id === issueId);
    if (index !== -1) {
      mockIssuesData[index] = resolvedIssue;
    }
    
    return resolvedIssue;
  },
  
  // Reopen an issue
  async reopenIssue(issueId, reason) {
    await mockDelay();
    
    const issue = findIssue(issueId);
    
    // Ensure the issue was previously resolved
    if (issue.status !== 'RESOLVED') {
      throw new Error('Only resolved issues can be reopened');
    }
    
    // Update issue
    const reopenedIssue = {
      ...issue,
      status: 'REOPENED',
      closed_at: null,
      updated_at: new Date().toISOString(),
      reopen_reason: reason || 'Issue needs additional attention'
    };
    
    // Find the issue in our mock data and update it
    const index = mockIssuesData.findIndex(i => i.id === issueId);
    if (index !== -1) {
      mockIssuesData[index] = reopenedIssue;
    }
    
    return reopenedIssue;
  },
  
  // Attach a message to an issue
  async attachMessageToIssue(issueId, messageId) {
    await mockDelay();
    
    const issue = findIssue(issueId);
    
    // Check if message is already attached
    if (issue.attached_messages.includes(messageId)) {
      return { issueId, messageId, alreadyAttached: true };
    }
    
    // Add message to attached_messages array
    issue.attached_messages.push(messageId);
    issue.updated_at = new Date().toISOString();
    
    // Find the issue in our mock data and update it
    const index = mockIssuesData.findIndex(i => i.id === issueId);
    if (index !== -1) {
      mockIssuesData[index] = issue;
    }
    
    return { issueId, messageId };
  }
};

export default IssuesService;