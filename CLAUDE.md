# CLAUDE.md - Guide for Claude Code

## Project Overview
WhatsApp Chatbot with Human Agent Portal - React frontend for handling transferred conversations.

## Build & Test Commands
- Install: `npm install`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Tests: `npm test`
- Run single test: `npm test -- -t "test name"` 

## Code Style Guidelines
- **Framework**: React (JavaScript)
- **UI Components**: Shadcn/UI
- **CSS Framework**: Tailwind CSS (used by Shadcn/UI)
- **State Management**: Redux for application state
- **Formatting**: Prettier
- **Imports**: Group by external, internal, then relative; sort alphabetically
- **Prop Validation**: PropTypes for component props
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Error Handling**: Use try/catch with descriptive error messages
- **Testing**: Jest and React Testing Library
- **Component Structure**: Functional components with hooks
- **Accessibility**: Maintain WCAG 2.1 AA compliance

## Git Workflow
- Branch naming: `feature/name`, `bugfix/name`, `refactor/name`
- Descriptive commit messages with present tense verbs

## Implementation Plan

### Phase 1: Project Setup
1. Create project with Vite: `npm create vite@latest . -- --template react`
2. Install dependencies: `npm install react-router-dom redux react-redux @reduxjs/toolkit axios socket.io-client`
3. Set up Shadcn/UI:
   - `npm install -D tailwindcss postcss autoprefixer`
   - `npx tailwindcss init -p`
   - `npx shadcn-ui@latest init`
4. Create folder structure: `src/{components,pages,redux,services,utils,hooks,assets,layouts}`

### Phase 2: Core Interface & Authentication
1. Set up routing in App.jsx
2. Implement auth service and API client
3. Create login page with Shadcn forms
4. Configure Redux store with auth slice
5. Build conversation list component
6. Develop basic chat interface

### Phase 3: Enhanced Features
1. Implement WebSocket for real-time updates
2. Add media message support
3. Build conversation queue management
4. Create agent performance dashboard
5. Develop message template system

### Phase 4: Polish & Optimization
1. Implement dark/light mode
2. Add keyboard shortcuts
3. Optimize performance
4. Implement comprehensive error handling
5. Add end-to-end tests