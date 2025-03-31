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

## Conversation & Issue Management

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