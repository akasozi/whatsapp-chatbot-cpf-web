# Human Agent Portal Frontend - Requirements Specification

## Overview
This document outlines requirements for a frontend portal for human agents to handle WhatsApp conversations transferred from the chatbot. The portal will integrate with the existing backend API and database to provide a seamless experience for customer support agents.

## Core Requirements

### 1. Authentication & Authorization
- **Agent Login**: Secure login system using JWT authentication
- **Session Management**: Handle token refresh and session persistence
- **Role-Based Access**: Support different access levels (agent, supervisor, admin)
- **Password Reset**: Self-service password reset functionality

### 2. Conversation Management
- **Conversation Queue**: Display pending conversations awaiting agent handling
- **Conversation Assignment**: Allow supervisors to assign conversations to specific agents
- **Conversation Filtering**: Filter by status, date, category, and priority
- **Unread Indicators**: Clear indicators for unread messages
- **Conversation Search**: Search across conversations by content, customer details

### 3. Chat Interface
- **Real-time Messaging**: Live chat interface with real-time updates
- **Message Types Support**: Properly display text, image, document, location, and interactive messages
- **Message Attribution**: Clear visual distinction between user, bot, and agent messages
- **Media Handling**: Preview and download attachments directly in the interface
- **Message Composition**: Rich text editor with emoji support
- **Template Messages**: Quick access to message templates for common responses
- **Thread View**: Chronological thread view with proper timestamps
- **Read Receipts**: Indicators showing when messages have been read

### 4. Agent Tools
- **Customer Information**: Sidebar displaying relevant customer information
- **Conversation History**: Access to previous conversations with the same customer
- **Bot Handback**: Option to transfer conversation back to the bot
- **Escalation Pathway**: Ability to escalate to supervisors or specialized departments
- **Notes & Annotations**: Private agent notes that aren't visible to customers
- **Knowledge Base Integration**: Quick access to relevant information and procedures

### 5. Dashboard & Analytics
- **Agent Performance**: Individual performance metrics (response time, satisfaction)
- **Team Performance**: Team-wide statistics and comparisons
- **Queue Metrics**: Real-time and historical queue information (wait times, volume)
- **Conversation Analytics**: Trends, common issues, resolution rates
- **Custom Reports**: Configurable reports for management
- **Visual Analytics**: Charts and graphs for key metrics

### 6. Notifications & Alerts
- **New Conversation Alerts**: Desktop and in-app notifications for new assignments
- **SLA Warnings**: Alerts for conversations approaching response time limits
- **Supervisor Monitoring**: Allow supervisors to monitor agent performance in real-time
- **Offline Notifications**: Email notifications for important events when offline

### 7. User Experience & Interface
- **Responsive Design**: Work across desktop and tablet devices
- **Dark/Light Mode**: Support for different visual themes
- **Accessibility Compliance**: WCAG 2.1 AA compliance
- **Keyboard Shortcuts**: Efficiency-focused keyboard shortcuts
- **Customizable Layout**: Adjustable panels and workspace organization
- **Status Indicators**: Clear visual cues for conversation and agent status

### 8. Technical Requirements
- **Framework**: React with TypeScript for type safety
- **State Management**: Redux for application state
- **API Integration**: HTTP/REST client for backend API integration
- **WebSocket Support**: For real-time updates and notifications
- **Responsive Framework**: Material UI or similar component library
- **Localization Ready**: Support for multiple languages
- **Error Handling**: Comprehensive error handling and reporting
- **Testing Framework**: Jest and React Testing Library for unit and integration tests

## Technical Integration Points

### API Endpoints to Integrate
1. **Authentication Endpoints**:
   - `/api/v1/auth/token` - For login
   - `/api/v1/auth/refresh` - For token refresh

2. **Agent & Work Session Endpoints**:
   - `/api/v1/agent-profiles/*` - Agent profile management
   - `/api/v1/work-sessions/*` - Agent work session tracking

3. **Conversation Endpoints**:
   - `/api/v1/messages/agent/conversations` - List agent conversations
   - `/api/v1/messages/conversations/{id}/history` - View conversation history
   - `/api/v1/messages/agent/send/{id}` - Send agent messages
   - `/api/v1/messages/conversations/{id}/mark-read` - Mark messages as read

4. **Handoff Endpoints**:
   - `/api/v1/handoff/queue` - View handoff queue
   - `/api/v1/handoff/transferred` - View transferred conversations
   - `/api/v1/handoff/transfer` - Transfer conversation to agent
   - `/api/v1/handoff/accept/{id}` - Accept handoff
   - `/api/v1/handoff/reject/{id}` - Reject handoff
   - `/api/v1/handoff/complete/{id}` - Complete handoff
   - `/api/v1/handoff/stats` - View handoff statistics
   - `/api/v1/handoff/agents/available` - Check agent availability

5. **Support Ticket Endpoints**:
   - `/api/v1/tickets/*` - Ticket management
   - `/api/v1/assignments/*` - Ticket assignment management

6. **WebSocket Integration**:
   - `/api/v1/handoff/ws` - Real-time notifications

## Development Phases

### Phase 1: Core Interface & Authentication
- Authentication flow
- Basic conversation listing and viewing
- Simple chat interface with sending capabilities
- Basic agent profile management

### Phase 2: Enhanced Conversation Handling
- Complete chat capabilities with media support
- Conversation queue and filtering
- Real-time updates via WebSocket
- Read receipts and status updates
- Handoff completion and transfer features

### Phase 3: Dashboard & Productivity Features
- Agent performance dashboards
- Team analytics
- Knowledge base integration
- Message templates
- Advanced filtering and search

### Phase 4: Polish & Advanced Features
- Accessibility improvements
- Keyboard shortcuts
- Dark/light mode
- Performance optimizations
- Advanced notification system
- Report generation

## Success Criteria
1. Agents can efficiently handle transferred conversations
2. Supervisors can monitor and manage team performance
3. System provides real-time updates and notifications
4. UI/UX is intuitive and optimized for agent workflows
5. Portal integrates seamlessly with the backend API
6. Performance metrics show improved agent efficiency and customer satisfaction

## API Response Examples

### Example: Conversation List Response
```json
[
  {
    "id": 123,
    "session_id": "session-abc123",
    "status": "TRANSFERRED",
    "created_at": "2023-07-10T14:22:33Z",
    "updated_at": "2023-07-10T14:25:12Z",
    "user_id": 456,
    "user_phone_number": "+1234567890",
    "user_full_name": "John Doe",
    "last_message": {
      "content": "I need help with my pension claim.",
      "created_at": "2023-07-10T14:25:12Z",
      "source": "USER"
    },
    "ticket": {
      "id": 789,
      "title": "Pension Claim Assistance",
      "priority": "MEDIUM",
      "status": "OPEN"
    },
    "unread_count": 3,
    "handoff_reason": "Customer requires assistance with pension claim details"
  }
]
```

### Example: Conversation History Response
```json
{
  "conversation_id": 123,
  "session_id": "session-abc123",
  "status": "TRANSFERRED",
  "started_at": "2023-07-10T14:00:00Z",
  "updated_at": "2023-07-10T14:25:12Z",
  "user": {
    "id": 456,
    "name": "John Doe",
    "phone_number": "+1234567890"
  },
  "current_agent": {
    "id": 789
  },
  "latest_transition": {
    "id": 101,
    "from_status": "ACTIVE",
    "to_status": "TRANSFERRED",
    "timestamp": "2023-07-10T14:22:33Z",
    "reason": "Customer requires assistance with pension claim details"
  },
  "message_count": 5,
  "messages": [
    {
      "id": 1001,
      "conversation_id": 123,
      "content": "Hello, how can I help you today?",
      "created_at": "2023-07-10T14:15:00Z",
      "direction": "OUTBOUND",
      "source": "BOT",
      "sender_name": "Chatbot",
      "sender_role": "BOT",
      "attachments": []
    },
    {
      "id": 1002,
      "conversation_id": 123,
      "content": "I need help with my pension claim.",
      "created_at": "2023-07-10T14:20:00Z",
      "direction": "INBOUND",
      "source": "USER",
      "sender_name": "John Doe",
      "sender_role": "USER",
      "attachments": []
    },
    {
      "id": 1003,
      "conversation_id": 123,
      "content": "I'll connect you with a human agent who can help with your pension claim.",
      "created_at": "2023-07-10T14:22:00Z",
      "direction": "OUTBOUND",
      "source": "BOT",
      "sender_name": "Chatbot",
      "sender_role": "BOT",
      "attachments": []
    },
    {
      "id": 1004,
      "conversation_id": 123,
      "content": "Hello, I'm Sarah, a human agent. I'll be helping you with your pension claim today. Could you please provide your claim reference number?",
      "created_at": "2023-07-10T14:24:00Z",
      "direction": "OUTBOUND",
      "source": "AGENT",
      "agent_id": 789,
      "sender_name": "Sarah Smith",
      "sender_role": "AGENT",
      "attachments": []
    },
    {
      "id": 1005,
      "conversation_id": 123,
      "content": "My reference number is CPF-1234-5678.",
      "created_at": "2023-07-10T14:25:12Z",
      "direction": "INBOUND",
      "source": "USER",
      "sender_name": "John Doe",
      "sender_role": "USER",
      "attachments": []
    }
  ]
}
```

### Example: Agent Stats Response
```json
{
  "total_handoffs": 150,
  "pending_handoffs": 12,
  "in_progress_handoffs": 38,
  "completed_handoffs": 100,
  "rejected_handoffs": 0,
  "average_response_time": 2.5,
  "average_resolution_time": 15.3,
  "handoffs_by_category": {
    "PENSION_CLAIM": 60,
    "ACCOUNT_INQUIRY": 45,
    "DOCUMENT_VERIFICATION": 30,
    "TECHNICAL_ISSUE": 15
  },
  "handoffs_by_department": {
    "CLAIMS": 90,
    "CUSTOMER_SERVICE": 45,
    "TECHNICAL_SUPPORT": 15
  },
  "handoffs_by_date": {
    "2023-07-10": 22,
    "2023-07-09": 18,
    "2023-07-08": 25,
    "2023-07-07": 30
  },
  "top_agents": [
    {"name": "Sarah Smith", "completed": 40, "avg_time": 12.5},
    {"name": "John Davis", "completed": 32, "avg_time": 15.2},
    {"name": "Emma Johnson", "completed": 28, "avg_time": 13.7}
  ],
  "top_reasons": [
    {"reason": "COMPLEX_QUERY", "count": 45},
    {"reason": "DOCUMENT_VERIFICATION", "count": 35},
    {"reason": "CUSTOMER_REQUEST", "count": 30}
  ]
}
```

## High-Priority User Stories

1. As an agent, I want to see a list of conversations assigned to me so that I can manage my workload efficiently.
2. As an agent, I want to view the full conversation history when I open a chat so that I understand the context.
3. As an agent, I want to send messages to customers that are properly attributed to me so customers know they're talking to a human.
4. As an agent, I want to mark conversations as complete when issues are resolved so they don't remain in my active queue.
5. As a supervisor, I want to see team-wide statistics so that I can monitor overall performance.
6. As an agent, I want to see unread message indicators so I know which conversations need immediate attention.
7. As an agent, I want to receive real-time notifications for new assignments so I can respond promptly.
8. As a supervisor, I want to view the conversation queue so I can assign conversations to appropriate agents.
9. As an agent, I want to easily transfer conversations back to the bot when automated handling is sufficient.
10. As an agent, I want to add private notes to conversations so I can keep track of important details.