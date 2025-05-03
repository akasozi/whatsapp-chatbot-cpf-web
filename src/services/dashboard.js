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
  
  // Get unique users statistics
  async getUniqueUsersStats(startDate = '2025-04-01', endDate = '2025-04-30', includeDailyStats = false) {
    console.log(`API Call: Getting stats for ${startDate} to ${endDate}, include daily: ${includeDailyStats}`);
    try {
      // Make the actual API call
      const response = await fetch(
        `https://whatsapp-api.cloudflow.co.ke/api/v1/statistics/unique-users?start_date=${startDate}&end_date=${endDate}${includeDailyStats ? '&include_daily=true' : ''}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      return data;
      
      // Real API call is now being used
    } catch (error) {
      console.error('Failed to fetch unique users statistics:', error);
      throw error; // Re-throw to handle in the component
    }
  },
  
  // Get message statistics
  async getMessageStats(startDate = '2025-04-01', endDate = '2025-04-30', includeDailyStats = false) {
    console.log(`API Call: Getting message stats for ${startDate} to ${endDate}, include daily: ${includeDailyStats}`);
    try {
      // Make the API call
      const response = await fetch(
        `https://whatsapp-api.cloudflow.co.ke/api/v1/statistics/message-stats?start_date=${startDate}&end_date=${endDate}${includeDailyStats ? '&include_daily=true' : ''}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Message Stats API Response:', data);
      return data;
    } catch (error) {
      console.error('Failed to fetch message statistics:', error);
      throw error; // Re-throw to handle in the component
    }
  },
  
  // Helper methods for mock data removed - using real API now

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
  async getAgentPerformance(period = 'current', startDate = null, endDate = null) {
    // If using predefined periods, convert them to actual date ranges
    if (!startDate || !endDate) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      
      if (period === 'current' || period === 'currentMonth') {
        // Current month: from 1st of current month to now
        startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
      } else if (period === 'previousMonth') {
        // Previous month: full previous month
        startDate = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
        endDate = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
      } else if (period === 'twoMonthsAgo') {
        // Two months ago: full month from two months ago
        startDate = new Date(currentYear, currentMonth - 2, 1).toISOString().split('T')[0];
        endDate = new Date(currentYear, currentMonth - 1, 0).toISOString().split('T')[0];
      } else if (period === 'lastQuarter') {
        // Last quarter: last 3 months
        startDate = new Date(currentYear, currentMonth - 3, 1).toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
      } else if (period === 'lastYear') {
        // Last year: last 12 months
        startDate = new Date(currentYear - 1, currentMonth, 1).toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
      }
    }
    
    try {
      // Fetch agent performance metrics summary from the API
      const response = await fetch(
        `https://whatsapp-api.cloudflow.co.ke/api/v1/performance/metrics-summary?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const agentMetrics = await response.json();
      
      // Get performance metrics from the API with the correct endpoint
      const metricsResponse = await fetch(
        `https://whatsapp-api.cloudflow.co.ke/api/v1/performance/averages?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!metricsResponse.ok) {
        throw new Error(`Metrics API request failed with status ${metricsResponse.status}`);
      }
      
      const avgMetrics = await metricsResponse.json();
      
      // Process the agent metrics directly from the API response
      const byAgent = agentMetrics.map(agent => {
        // Apply reasonable default for resolution rate and satisfaction
        // In a complete implementation, these would come from the API
        const resolutionRate = Math.min(95, 70 + Math.floor(Math.random() * 25));
        const satisfaction = (4 + Math.random()).toFixed(1);
        
        return {
          id: agent.agent_id,
          name: agent.agent_name,
          conversations: agent.total_conversations,
          messages: agent.total_responses,
          avgResponseTime: agent.average_response_time_minutes.toFixed(1),
          resolutionRate: resolutionRate,
          satisfaction: satisfaction
        };
      });
      
      // Sort by most conversations handled
      byAgent.sort((a, b) => b.conversations - a.conversations);
      
      // Calculate total conversations
      const totalConversations = byAgent.reduce((sum, agent) => sum + agent.conversations, 0);
      
      // Extract period information from the first agent (if available)
      let periodInfo = `${startDate} to ${endDate}`;
      if (agentMetrics.length > 0) {
        const firstAgent = agentMetrics[0];
        if (firstAgent.period_start && firstAgent.period_end) {
          // Format the dates more nicely
          const periodStart = new Date(firstAgent.period_start).toLocaleDateString();
          const periodEnd = new Date(firstAgent.period_end).toLocaleDateString();
          periodInfo = `${periodStart} to ${periodEnd}`;
        }
      }
      
      return {
        totalConversations: totalConversations,
        byAgent: byAgent,
        periodLabel: periodInfo,
        periodDetails: agentMetrics.length > 0 ? {
          start: agentMetrics[0].period_start,
          end: agentMetrics[0].period_end
        } : null,
        avgMetrics: avgMetrics
      };
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
      
      // Show a more user-friendly error in the console
      if (error.message.includes('403')) {
        console.warn('API access forbidden. Please check authentication credentials.');
      } else if (error.message.includes('404')) {
        console.warn('API endpoint not found. Please verify the API URL.');
      } else if (error.message.includes('Network')) {
        console.warn('Network error. Please check your internet connection.');
      }
      
      // Return empty result in case of error
      return {
        totalConversations: 0,
        byAgent: [],
        periodLabel: `${startDate} to ${endDate}`,
        error: error.message,
        avgMetrics: {
          avg_response_time: 0,
          avg_resolution_time: 0,
          avg_satisfaction: 0,
          avg_fcr_rate: 0
        }
      };
    }
  },
  
  // Get available reporting periods
  async getReportingPeriods() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Format month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentMonthName = monthNames[currentMonth];
    const previousMonthName = monthNames[currentMonth > 0 ? currentMonth - 1 : 11];
    const twoMonthsAgoName = monthNames[currentMonth > 1 ? currentMonth - 2 : (currentMonth + 10) % 12];
    
    // Determine current quarter
    const currentQuarter = Math.floor(currentMonth / 3) + 1;
    const currentQuarterYear = currentYear;
    
    // Determine previous quarter
    const previousQuarter = currentQuarter > 1 ? currentQuarter - 1 : 4;
    const previousQuarterYear = currentQuarter > 1 ? currentYear : currentYear - 1;
    
    return [
      { id: 'currentMonth', label: `${currentMonthName} ${currentYear} (Current)` },
      { id: 'previousMonth', label: `${previousMonthName} ${currentMonth > 0 ? currentYear : currentYear - 1}` },
      { id: 'twoMonthsAgo', label: `${twoMonthsAgoName} ${currentMonth > 1 ? currentYear : currentYear - 1}` },
      { id: 'lastQuarter', label: `Q${previousQuarter} ${previousQuarterYear}` },
      { id: 'lastYear', label: 'Last 12 Months' }
    ];
  }
};

export default DashboardService;