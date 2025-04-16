# Project Overview: WhatsApp Chatbot Agent Portal Frontend

## Purpose

This codebase implements a **React-based web frontend for a customer support agent portal**. Its primary function is to allow human agents to manage customer conversations originating from WhatsApp, typically after being transferred from an automated chatbot system.

## Key Functionality

*   **Agent Authentication:** Secure login and session management for agents.
*   **Conversation Management:** View assigned conversations, manage queues, filter, and search conversations.
*   **Real-time Chat Interface:** A WhatsApp-style interface for live interaction with customers, supporting various message types (text, media).
*   **Agent Tools:** Access to customer information, conversation history, private notes, message templates, and escalation pathways.
*   **Issue/Ticket Tracking:** A system to track specific customer requests or issues within the continuous conversation flow (using a model distinct from traditional closed tickets).
*   **Dashboard & Analytics:** Monitor individual and team performance metrics, queue status, and conversation trends.
*   **Notifications:** Real-time alerts for new assignments, SLA warnings, etc.

## Technology Stack

*   **Framework:** React (v19)
*   **Build Tool:** Vite
*   **State Management:** Redux Toolkit
*   **Routing:** React Router (v7)
*   **UI Components:** Shadcn/UI
*   **Styling:** Tailwind CSS
*   **API Communication:** Axios
*   **Real-time Communication:** Socket.IO Client

## Integration

The frontend is designed to integrate with a specific backend API for data persistence, authentication, real-time updates (via WebSockets), and managing the handoff process between the chatbot and human agents. It also handles concepts like "Support Tickets" or "Issues" linked to conversations.

## Context ("CPF")

The term "CPF" appears in filenames and potentially in data (e.g., `CPF-1234-5678` reference number example). While not explicitly defined in the reviewed documents, it likely refers to an identifier specific to the business domain this portal serves (e.g., Central Provident Fund, Claim Processing Form, Customer Profile File).