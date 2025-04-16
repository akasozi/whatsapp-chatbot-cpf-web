// Mock saved filter presets
export const mockSavedFilters = [
  {
    name: "High Priority",
    filters: {
      status: "ALL",
      priority: "HIGH",
      dateRange: "ALL"
    }
  },
  {
    name: "Today's Active",
    filters: {
      status: "ACTIVE",
      priority: "ALL",
      dateRange: "TODAY"
    }
  },
  {
    name: "Pending Conversations",
    filters: {
      status: "TRANSFERRED",
      priority: "ALL",
      dateRange: "ALL"
    }
  }
];

// Mock Conversations Data - restructured for the new model
export const mockConversationsData = [
  {
    id: "conv-123",
    phone_number: "+1234567890",
    customer_name: "John Doe",
    created_at: "2023-07-10T14:22:33Z",
    last_activity: "2023-07-10T14:25:12Z",
    status: "ACTIVE",
    assignee_id: "agent-789",
    assignment_history: [
      {
        agent_id: "agent-789",
        timestamp: "2023-07-10T14:22:40Z"
      }
    ],
    tags: ["pension", "claim"],
    metadata: {
      customer_id: "cust-456",
      account_type: "Premium"
    },
    lastMessage: {
      content: "I need help with my pension claim",
      created_at: "2023-07-10T14:25:12Z",
      direction: "INBOUND",
      source: "USER"
    },
    openIssueCount: 1
  },
  {
    id: "conv-124",
    phone_number: "+1987654321",
    customer_name: "Jane Smith",
    created_at: "2023-07-11T09:15:22Z",
    last_activity: "2023-07-11T09:45:18Z",
    status: "ACTIVE",
    assignee_id: "agent-789",
    assignment_history: [
      {
        agent_id: "agent-789",
        timestamp: "2023-07-11T09:20:30Z"
      }
    ],
    tags: ["claim", "processing"],
    metadata: {
      customer_id: "cust-457",
      account_type: "Standard"
    },
    lastMessage: {
      content: "When will my claim be processed?",
      created_at: "2023-07-11T09:45:18Z",
      direction: "INBOUND",
      source: "USER"
    },
    openIssueCount: 1
  },
  {
    id: "conv-125",
    phone_number: "+1122334455",
    customer_name: "Robert Johnson",
    created_at: "2023-07-09T11:30:45Z",
    last_activity: "2023-07-09T12:15:33Z",
    status: "RESOLVED",
    assignee_id: "agent-790",
    assignment_history: [
      {
        agent_id: "agent-790",
        timestamp: "2023-07-09T11:32:10Z"
      }
    ],
    tags: ["account", "update"],
    metadata: {
      customer_id: "cust-458",
      account_type: "Standard"
    },
    lastMessage: {
      content: "Thank you for your help!",
      created_at: "2023-07-09T12:15:33Z",
      direction: "INBOUND",
      source: "USER"
    },
    openIssueCount: 0
  },
  {
    id: "conv-126",
    phone_number: "+1567890123",
    customer_name: "Sarah Williams",
    created_at: "2023-07-12T16:40:12Z",
    last_activity: "2023-07-12T16:55:27Z",
    status: "ACTIVE",
    assignee_id: "agent-791",
    assignment_history: [
      {
        agent_id: "agent-791",
        timestamp: "2023-07-12T16:42:30Z"
      }
    ],
    tags: ["online", "access"],
    metadata: {
      customer_id: "cust-459",
      account_type: "Premium"
    },
    lastMessage: {
      content: "I can't access my online account",
      created_at: "2023-07-12T16:55:27Z",
      direction: "INBOUND",
      source: "USER"
    },
    openIssueCount: 1
  },
  {
    id: "conv-127",
    phone_number: "+1678901234",
    customer_name: "Michael Brown",
    created_at: "2023-07-12T10:22:18Z",
    last_activity: "2023-07-12T10:35:42Z",
    status: "ACTIVE",
    assignee_id: "agent-789",
    assignment_history: [
      {
        agent_id: "agent-789",
        timestamp: "2023-07-12T10:25:00Z"
      }
    ],
    tags: ["beneficiary", "update"],
    metadata: {
      customer_id: "cust-460",
      account_type: "Standard"
    },
    lastMessage: {
      content: "How do I update my beneficiary information?",
      created_at: "2023-07-12T10:35:42Z",
      direction: "INBOUND",
      source: "USER"
    },
    openIssueCount: 1
  },
  {
    id: "conv-128",
    phone_number: "+1345678901",
    customer_name: "David Wilson",
    created_at: "2023-07-08T09:10:15Z",
    last_activity: "2023-07-13T14:20:30Z",
    status: "DORMANT",
    assignee_id: "agent-792",
    assignment_history: [
      {
        agent_id: "agent-792",
        timestamp: "2023-07-08T09:12:00Z"
      }
    ],
    tags: ["payment", "processed"],
    metadata: {
      customer_id: "cust-461",
      account_type: "Standard"
    },
    lastMessage: {
      content: "Yes, that solves my problem. Thank you!",
      created_at: "2023-07-13T14:20:30Z",
      direction: "INBOUND",
      source: "USER"
    },
    openIssueCount: 0
  },
  {
    id: "conv-129",
    phone_number: "+1901234567",
    customer_name: "Emily Davis",
    created_at: "2023-07-14T11:05:22Z",
    last_activity: "2023-07-14T11:15:45Z",
    status: "ACTIVE",
    assignee_id: null, // Not yet assigned
    assignment_history: [],
    tags: ["new", "inquiry"],
    metadata: {
      customer_id: "cust-462",
      account_type: "Standard"
    },
    lastMessage: {
      content: "I'd like information about starting a pension plan",
      created_at: "2023-07-14T11:15:45Z",
      direction: "INBOUND",
      source: "USER"
    },
    openIssueCount: 0 // No issues yet
  }
];

// Mock Messages Data
export const mockMessagesData = [
  // Conversation 123
  {
    id: "msg-1001",
    conversation_id: "conv-123",
    issue_id: "issue-101",
    content: "Hello, how can I help you today?",
    created_at: "2023-07-10T14:15:00Z",
    direction: "OUTBOUND",
    source: "BOT",
    sender_id: "bot-1",
    sender_name: "Chatbot",
    attachments: []
  },
  {
    id: "msg-1002",
    conversation_id: "conv-123",
    issue_id: "issue-101",
    content: "I need help with my pension claim.",
    created_at: "2023-07-10T14:20:00Z",
    direction: "INBOUND",
    source: "USER",
    sender_id: "cust-456",
    sender_name: "John Doe",
    attachments: []
  },
  {
    id: "msg-1003",
    conversation_id: "conv-123",
    issue_id: "issue-101",
    content: "I'll connect you with an agent who can help with your pension claim.",
    created_at: "2023-07-10T14:22:00Z",
    direction: "OUTBOUND",
    source: "BOT",
    sender_id: "bot-1",
    sender_name: "Chatbot",
    attachments: []
  },
  {
    id: "msg-1004",
    conversation_id: "conv-123",
    issue_id: "issue-101",
    content: "Hello, I'm Agent Sarah. I'll be helping you with your pension claim today. Could you please provide your claim reference number?",
    created_at: "2023-07-10T14:24:00Z",
    direction: "OUTBOUND",
    source: "AGENT",
    sender_id: "agent-789",
    sender_name: "Sarah Smith",
    attachments: []
  },
  {
    id: "msg-1005",
    conversation_id: "conv-123",
    issue_id: "issue-101",
    content: "My reference number is CPF-1234-5678. I'm also attaching a screenshot of my application status page.",
    created_at: "2023-07-10T14:25:12Z",
    direction: "INBOUND",
    source: "USER",
    sender_id: "cust-456",
    sender_name: "John Doe",
    attachments: [
      {
        id: "att-001",
        name: "application_status_screenshot.png",
        type: "image/png",
        size: 528901,
        url: "https://example.com/attachments/application_status_screenshot.png",
        thumbnail_url: "https://example.com/attachments/thumbnails/application_status_screenshot.png"
      }
    ]
  },
  
  // Conversation 124
  {
    id: "msg-2001",
    conversation_id: "conv-124",
    issue_id: "issue-201",
    content: "Welcome to our support service. How may I assist you today?",
    created_at: "2023-07-11T09:15:22Z",
    direction: "OUTBOUND",
    source: "BOT",
    sender_id: "bot-1",
    sender_name: "Chatbot",
    attachments: []
  },
  {
    id: "msg-2002",
    conversation_id: "conv-124",
    issue_id: "issue-201",
    content: "I submitted my claim two weeks ago and haven't heard anything. When will it be processed?",
    created_at: "2023-07-11T09:18:45Z",
    direction: "INBOUND",
    source: "USER",
    sender_id: "cust-457",
    sender_name: "Jane Smith",
    attachments: []
  },
  {
    id: "msg-2003",
    conversation_id: "conv-124",
    issue_id: "issue-201",
    content: "I'll connect you with an agent who can check on your claim status.",
    created_at: "2023-07-11T09:20:10Z",
    direction: "OUTBOUND",
    source: "BOT",
    sender_id: "bot-1",
    sender_name: "Chatbot",
    attachments: []
  },
  {
    id: "msg-2004",
    conversation_id: "conv-124",
    issue_id: "issue-201",
    content: "Hello Jane, I'm Agent Demo. I'll help you check on your claim status. Could you please provide your claim reference number? I've attached our claim tracking guide to help you understand the process.",
    created_at: "2023-07-11T09:25:33Z",
    direction: "OUTBOUND",
    source: "AGENT",
    sender_id: "agent-789",
    sender_name: "Agent Demo",
    response_time_seconds: 320,
    attachments: [
      {
        id: "att-003",
        name: "claim_tracking_guide.pdf",
        type: "application/pdf",
        size: 1842567,
        url: "https://example.com/attachments/claim_tracking_guide.pdf",
        thumbnail_url: "https://example.com/attachments/thumbnails/claim_tracking_guide.pdf"
      }
    ]
  },
  {
    id: "msg-2005",
    conversation_id: "conv-124",
    issue_id: "issue-201",
    content: "My reference number is CPF-5678-9012. I've attached a screenshot of my submission confirmation.",
    created_at: "2023-07-11T09:35:22Z",
    direction: "INBOUND",
    source: "USER",
    sender_id: "cust-457",
    sender_name: "Jane Smith",
    attachments: [
      {
        id: "att-001",
        name: "claim_confirmation.png",
        type: "image/png",
        size: 567890,
        url: "https://example.com/attachments/claim_confirmation.png",
        thumbnail_url: "https://example.com/attachments/thumbnails/claim_confirmation.png"
      }
    ]
  },
  {
    id: "msg-2006",
    conversation_id: "conv-124",
    issue_id: "issue-201",
    content: "Thank you for the reference number and screenshot. I can see that your claim is currently in the verification stage.\n\nThe typical processing time is 3-4 weeks, so it's still within the expected timeframe.\n\nHere's what happens next:\n1. Verification (where your claim is now)\n2. Assessment\n3. Approval\n4. Payment processing\n\nI've attached our detailed claims timeline document for your reference.",
    created_at: "2023-07-11T09:45:18Z",
    direction: "OUTBOUND",
    source: "AGENT",
    sender_id: "agent-789",
    sender_name: "Agent Demo",
    response_time_seconds: 410,
    attachments: [
      {
        id: "att-002",
        name: "claims_timeline.pdf",
        type: "application/pdf",
        size: 432567,
        url: "https://example.com/attachments/claims_timeline.pdf",
        thumbnail_url: "https://example.com/attachments/thumbnails/claims_timeline.pdf"
      }
    ]
  },
  
  // Conversation 125 (Resolved)
  {
    id: "msg-3001",
    conversation_id: "conv-125",
    issue_id: "issue-301",
    content: "Hello, how may I assist you today?",
    created_at: "2023-07-09T11:30:45Z",
    direction: "OUTBOUND",
    source: "BOT",
    sender_id: "bot-1",
    sender_name: "Chatbot",
    attachments: []
  },
  {
    id: "msg-3002",
    conversation_id: "conv-125",
    issue_id: "issue-301",
    content: "I need to update my account information.",
    created_at: "2023-07-09T11:32:15Z",
    direction: "INBOUND",
    source: "USER",
    sender_id: "cust-458",
    sender_name: "Robert Johnson",
    attachments: []
  },
  {
    id: "msg-3003",
    conversation_id: "conv-125",
    issue_id: "issue-301",
    content: "I'll help you update your account information. What specific details do you need to change?",
    created_at: "2023-07-09T11:35:20Z",
    direction: "OUTBOUND",
    source: "AGENT",
    sender_id: "agent-790",
    sender_name: "Mark Wilson",
    attachments: []
  },
  {
    id: "msg-3004",
    conversation_id: "conv-125",
    issue_id: "issue-301",
    content: "I need to update my email address and phone number.",
    created_at: "2023-07-09T11:40:05Z",
    direction: "INBOUND",
    source: "USER",
    sender_id: "cust-458",
    sender_name: "Robert Johnson",
    attachments: []
  },
  {
    id: "msg-3005",
    conversation_id: "conv-125",
    issue_id: "issue-301",
    content: "I've updated your contact information. You should receive a confirmation email shortly.",
    created_at: "2023-07-09T12:10:22Z",
    direction: "OUTBOUND",
    source: "AGENT",
    sender_id: "agent-790",
    sender_name: "Mark Wilson",
    attachments: []
  },
  {
    id: "msg-3006",
    conversation_id: "conv-125",
    issue_id: "issue-301",
    content: "Thank you for your help!",
    created_at: "2023-07-09T12:15:33Z",
    direction: "INBOUND",
    source: "USER",
    sender_id: "cust-458",
    sender_name: "Robert Johnson",
    attachments: []
  },
  
  // Add more messages for other conversations as needed...
];

// Mock Issues Data
export const mockIssuesData = [
  {
    id: "issue-101",
    conversation_id: "conv-123",
    title: "Pension Claim Assistance",
    description: "Customer needs help with pension claim CPF-1234-5678",
    created_at: "2023-07-10T14:20:00Z",
    updated_at: "2023-07-10T14:25:12Z",
    closed_at: null,
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    category: "CLAIMS",
    assigned_agent: "agent-789",
    resolution_summary: null,
    resolution_time: null,
    attached_messages: ["msg-1001", "msg-1002", "msg-1003", "msg-1004", "msg-1005"]
  },
  {
    id: "issue-201",
    conversation_id: "conv-124",
    title: "Claim Processing Inquiry",
    description: "Customer inquiring about processing time for claim CPF-5678-9012",
    created_at: "2023-07-11T09:18:45Z",
    updated_at: "2023-07-11T09:45:18Z",
    closed_at: null,
    status: "IN_PROGRESS",
    priority: "HIGH",
    category: "CLAIMS",
    assigned_agent: "agent-789",
    resolution_summary: null,
    resolution_time: null,
    attached_messages: ["msg-2001", "msg-2002", "msg-2003", "msg-2004", "msg-2005", "msg-2006"]
  },
  {
    id: "issue-301",
    conversation_id: "conv-125",
    title: "Account Information Update",
    description: "Customer needs to update contact information",
    created_at: "2023-07-09T11:32:15Z",
    updated_at: "2023-07-09T12:15:33Z",
    closed_at: "2023-07-09T12:15:33Z",
    status: "RESOLVED",
    priority: "LOW",
    category: "ACCOUNT",
    assigned_agent: "agent-790",
    resolution_summary: "Updated customer's email and phone number in the system",
    resolution_time: 43, // minutes
    attached_messages: ["msg-3001", "msg-3002", "msg-3003", "msg-3004", "msg-3005", "msg-3006"]
  },
  {
    id: "issue-401",
    conversation_id: "conv-126",
    title: "Online Account Access Issue",
    description: "Customer unable to log into online account",
    created_at: "2023-07-12T16:40:12Z",
    updated_at: "2023-07-12T16:55:27Z",
    closed_at: null,
    status: "OPEN",
    priority: "HIGH",
    category: "TECHNICAL",
    assigned_agent: "agent-791",
    resolution_summary: null,
    resolution_time: null,
    attached_messages: []
  },
  {
    id: "issue-501",
    conversation_id: "conv-127",
    title: "Beneficiary Update Request",
    description: "Customer needs to update beneficiary information",
    created_at: "2023-07-12T10:22:18Z",
    updated_at: "2023-07-12T10:35:42Z",
    closed_at: null,
    status: "OPEN",
    priority: "MEDIUM",
    category: "BENEFITS",
    assigned_agent: "agent-789",
    resolution_summary: null,
    resolution_time: null,
    attached_messages: []
  },
  {
    id: "issue-601",
    conversation_id: "conv-128",
    title: "Payment Processing Confirmation",
    description: "Customer asking about payment status",
    created_at: "2023-07-08T09:10:15Z",
    updated_at: "2023-07-13T14:20:30Z",
    closed_at: "2023-07-13T14:20:30Z",
    status: "RESOLVED",
    priority: "MEDIUM",
    category: "PAYMENTS",
    assigned_agent: "agent-792",
    resolution_summary: "Confirmed payment was processed successfully",
    resolution_time: 7810, // minutes (about 5.4 days)
    attached_messages: []
  }
];

// Mock agent performance data
export const mockAgentPerformance = {
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