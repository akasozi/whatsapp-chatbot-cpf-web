# WhatsApp Chatbot Agent Portal

A frontend portal for human agents to handle WhatsApp conversations transferred from a chatbot system.

## Features

- Agent authentication and authorization
- Real-time conversation management
- WhatsApp-style chat interface with support for various message types
- Issue tracking and management within continuous conversations
- Agent tools for effective customer support
- Dashboard with performance analytics
- Notifications and alerts system
- Responsive design with dark/light mode support

## Conversation, Query & Issue Management

### Difference Between Queries and Conversations

#### Conceptual Differences

**Conversation:**
- The entire communication thread between a customer and agent(s)
- Contains all messages exchanged over time, regardless of topic
- Represents the complete interaction history with a customer
- Primarily a communication channel and record
- Bound to a specific medium (WhatsApp in this case)
- Continues across multiple topics and requests
- May span days, weeks, or months

**Query:**
- A specific request, question, or issue raised within a conversation
- Has a defined lifecycle (creation, processing, resolution)
- Focused on tracking a single customer need until completion
- Primarily a workflow and tracking mechanism
- Medium-agnostic (can be tracked across channels)
- Has specific SLAs, ownership, and resolution criteria
- Usually resolved in hours or days

#### Technical Differences

| Aspect | Conversation | Query |
|--------|--------------|-------|
| **Purpose** | Communication record | Issue tracking |
| **Lifecycle** | Open-ended, continuous | Defined start and end |
| **Structure** | Sequential messages | Structured workflow |
| **Primary Key** | Customer phone number | Issue identifier |
| **Ownership** | May transfer between agents | Assigned to specific agent |
| **Resolution** | Never formally "resolved" | Explicitly marked resolved |
| **Metrics** | Response time, volume | Resolution time, SLA compliance |
| **Content** | Raw messages, media, attachments | Categorized issue data, status updates |

#### System Implementation Examples

**Conversation Data Model:**
```javascript
{
  id: "conv-123",
  customer_name: "John Doe",
  phone_number: "+1234567890",
  status: "ACTIVE", // or INACTIVE, TRANSFERRED
  created_at: "2023-07-12T14:30:00Z",
  updated_at: "2023-07-15T09:20:00Z",
  unread_count: 2,
  agent_id: "agent-456",
  messages: [
    {
      id: "msg-789",
      content: "Hello, I need my statement",
      sender_type: "CUSTOMER",
      timestamp: "2023-07-12T14:30:00Z",
      read: true
    },
    // More messages in chronological order
  ]
}
```

**Query Data Model:**
```javascript
{
  id: "query-456",
  conversation_id: "conv-123", // Reference to parent conversation
  customer_id: "cust-789",
  query_type: "STATEMENT_REQUEST",
  subject: "February 2023 Contribution Statement",
  description: "Customer requested statement for Feb 2023 to be sent to email@example.com",
  status: "IN_PROGRESS", // NEW, WAITING_CUSTOMER, RESOLVED, etc.
  priority: "MEDIUM",
  created_at: "2023-07-12T14:35:00Z",
  due_by: "2023-07-13T14:35:00Z", // Based on SLA
  assigned_to: "agent-456",
  followup_required: true,
  followup_date: "2023-07-14T14:35:00Z",
  resolution_notes: "",
  activities: [
    {
      timestamp: "2023-07-12T15:20:00Z",
      action: "STATUS_CHANGED",
      from: "NEW",
      to: "IN_PROGRESS",
      performed_by: "agent-456",
      notes: "Started processing statement request"
    }
    // More activity records
  ]
}
```

### Continuous Conversation Model

This system uses a continuous conversation model rather than a closed-ticket approach, since customers use the same WhatsApp number for all interactions. Key features:

- Conversations have states (ACTIVE, RESOLVED, DORMANT, ARCHIVED) rather than being closed
- Individual support cases are tracked as "Issues" within ongoing conversations
- Messages can be linked to specific issues to maintain context

### Working with Issues

1. **View Issues**: The right panel in conversation view displays all issues related to the current conversation
2. **Create Issues**: Click "New Issue" to create a support case with title, description, priority, and category
3. **Manage Issue Lifecycle**:
   - OPEN → IN_PROGRESS → WAITING_CUSTOMER → RESOLVED
   - Issues can be reopened if needed
4. **Link Messages**: Messages can be associated with specific issues, and when composing a message with an issue selected, it's automatically linked

### Issue Tracking Features

- **Status Tracking**: Each issue shows its current status with color-coded indicators
- **Priority Levels**: Issues can be marked as HIGH, MEDIUM, or LOW priority
- **Categories**: Organize issues by category (GENERAL, ACCOUNT, CLAIMS, etc.)
- **Resolution Flow**: Document how issues are resolved with resolution summaries
- **Message Association**: View all messages relevant to a specific issue

## Tech Stack

- React
- Redux
- React Router
- Shadcn/UI (with Tailwind CSS)
- Socket.io (for real-time updates)
- Axios (for API requests)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/whatsapp-chatbot-cpf-web.git
   cd whatsapp-chatbot-cpf-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   VITE_API_URL=http://your-api-url/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── assets/         # Static assets like images
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── pages/          # Page components
├── redux/          # Redux store, slices, and actions
├── services/       # API services and utilities
└── utils/          # Helper functions
```

## Development Roadmap

See the [CLAUDE.md](./CLAUDE.md) for the complete implementation plan and roadmap.

## API Integration

This frontend is designed to work with a specific backend API. Refer to the [AGENT_PORTAL_REQUIREMENTS.md](./AGENT_PORTAL_REQUIREMENTS.md) for details on the API endpoints.

## License

This project is licensed under the MIT License - see the LICENSE file for details.