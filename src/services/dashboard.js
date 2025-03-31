// Mock delay to simulate API request
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for dashboard statistics
const MOCK_STATS = {
  pendingConversations: 8,
  activeConversations: 15,
  resolvedConversations: 42,
  averageResponseTime: 2.5, // minutes
  averageResolutionTime: 18, // minutes
  customerSatisfaction: 92, // percentage
  agentAvailability: 85, // percentage
};

// Mock data for activity feed
const MOCK_ACTIVITIES = [
  {
    id: 1,
    type: 'message',
    description: 'Sent a document to Jane Smith regarding claim CPF-5678-9012',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
    agent: 'Agent Demo',
    conversationId: 124
  },
  {
    id: 2,
    type: 'handoff',
    description: "Accepted handoff from bot for Michael Brown's beneficiary update",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
    agent: 'Agent Demo',
    conversationId: 127
  },
  {
    id: 3,
    type: 'resolution',
    description: "Resolved Robert Johnson's account information update request",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
    agent: 'Agent Demo',
    conversationId: 125
  },
  {
    id: 4,
    type: 'message',
    description: 'Sent claim processing timeline to Sarah Williams',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(), // 3 hours ago
    agent: 'Agent Demo',
    conversationId: 126
  },
];

// Mock data for performance metrics
const MOCK_PERFORMANCE = {
  responseTime: {
    current: 2.5, // minutes
    previous: 2.8,
    trend: 'down', // down is good for response time
    trendValue: 10.7
  },
  resolutionRate: {
    current: 87, // percentage
    previous: 82,
    trend: 'up', // up is good for resolution rate
    trendValue: 6.1
  },
  customerSatisfaction: {
    current: 92, // percentage
    previous: 90,
    trend: 'up',
    trendValue: 2.2
  },
  conversationsHandled: {
    current: 42,
    previous: 38,
    trend: 'up',
    trendValue: 10.5
  }
};

// Mock agent performance data
const MOCK_AGENT_PERFORMANCE = {
  // Current month data
  current: {
    totalConversations: 254,
    byAgent: [
      { id: 1, name: "John Smith", conversations: 62, avgResponseTime: 2.3, resolutionRate: 94, satisfaction: 4.7 },
      { id: 2, name: "Jane Doe", conversations: 78, avgResponseTime: 1.8, resolutionRate: 96, satisfaction: 4.9 },
      { id: 3, name: "Agent Demo", conversations: 42, avgResponseTime: 2.5, resolutionRate: 87, satisfaction: 4.6 },
      { id: 4, name: "Sarah Johnson", conversations: 72, avgResponseTime: 2.1, resolutionRate: 92, satisfaction: 4.8 }
    ],
    periodLabel: "April 2023"
  },
  // Previous month data
  previous: {
    totalConversations: 231,
    byAgent: [
      { id: 1, name: "John Smith", conversations: 55, avgResponseTime: 2.5, resolutionRate: 92, satisfaction: 4.6 },
      { id: 2, name: "Jane Doe", conversations: 71, avgResponseTime: 2.0, resolutionRate: 94, satisfaction: 4.8 },
      { id: 3, name: "Agent Demo", conversations: 38, avgResponseTime: 2.8, resolutionRate: 82, satisfaction: 4.5 },
      { id: 4, name: "Sarah Johnson", conversations: 67, avgResponseTime: 2.3, resolutionRate: 90, satisfaction: 4.7 }
    ],
    periodLabel: "March 2023"
  },
  // Two months ago
  twoMonthsAgo: {
    totalConversations: 210,
    byAgent: [
      { id: 1, name: "John Smith", conversations: 48, avgResponseTime: 2.7, resolutionRate: 90, satisfaction: 4.5 },
      { id: 2, name: "Jane Doe", conversations: 65, avgResponseTime: 2.2, resolutionRate: 93, satisfaction: 4.7 },
      { id: 3, name: "Agent Demo", conversations: 35, avgResponseTime: 3.0, resolutionRate: 80, satisfaction: 4.4 },
      { id: 4, name: "Sarah Johnson", conversations: 62, avgResponseTime: 2.5, resolutionRate: 88, satisfaction: 4.6 }
    ],
    periodLabel: "February 2023"
  }
};

// Dashboard service with mock data
const DashboardService = {
  // Get overview statistics
  async getStats() {
    await mockDelay();
    return { ...MOCK_STATS };
  },

  // Get recent activities
  async getActivities() {
    await mockDelay();
    return [...MOCK_ACTIVITIES];
  },

  // Get agent performance metrics
  async getPerformance() {
    await mockDelay();
    return { ...MOCK_PERFORMANCE };
  },

  // Get queue metrics
  async getQueueMetrics() {
    await mockDelay();
    return {
      currentQueue: 8,
      averageWaitTime: 4.5, // minutes
      serviceLevel: 92, // percentage of conversations picked up within SLA
      trends: {
        queue: [3, 5, 8, 12, 10, 8, 7, 5, 8], // last 9 hours
        waitTime: [2.1, 2.5, 3.2, 4.5, 5.0, 4.2, 3.8, 3.5, 4.5] // last 9 hours
      }
    };
  },

  // Get agent-based conversation metrics
  async getAgentPerformance(period = 'current') {
    await mockDelay();
    
    if (period === 'current' || period === 'currentMonth') {
      return { ...MOCK_AGENT_PERFORMANCE.current };
    } else if (period === 'previousMonth') {
      return { ...MOCK_AGENT_PERFORMANCE.previous };
    } else if (period === 'twoMonthsAgo') {
      return { ...MOCK_AGENT_PERFORMANCE.twoMonthsAgo };
    } else {
      // Default to current if invalid period
      return { ...MOCK_AGENT_PERFORMANCE.current };
    }
  },
  
  // Get available reporting periods
  async getReportingPeriods() {
    await mockDelay();
    return [
      { id: 'currentMonth', label: 'April 2023 (Current)' },
      { id: 'previousMonth', label: 'March 2023' },
      { id: 'twoMonthsAgo', label: 'February 2023' },
      { id: 'lastQuarter', label: 'Q1 2023' },
      { id: 'lastYear', label: 'Last 12 Months' }
    ];
  }
};

export default DashboardService;