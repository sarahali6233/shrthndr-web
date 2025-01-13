# Shrthnder Web Documentation

## Project Overview

Shrthnder Web is a web-based application for testing and comparing typing speeds using shorthand versus normal typing. The application consists of a React frontend and a Node.js/Express backend with MongoDB for data storage.

## Project Structure

```
shrthnder-web/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── services/          # API service functions
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── models/       # MongoDB models
│   │   ├── middleware/   # Express middleware
│   │   └── routes/       # API routes
│   └── .env              # Environment configuration
└── docs/                 # Documentation
```

## Core Features

1. **Typing Test System**

   - Normal typing test
   - Shorthand typing test
   - Real-time WPM and accuracy calculation
   - Time-saving comparison

2. **User Management**

   - User authentication
   - Admin and regular user roles
   - Secure JWT-based authentication

3. **Admin Dashboard**

   - View test results
   - Manage shorthand rules
   - Export data to CSV

4. **Shorthand Management**
   - Multiple job categories
   - Customizable shorthand rules
   - Category-specific test texts

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

### Running the Application

1. Start MongoDB
2. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```
3. Start the frontend:
   ```bash
   npm start
   ```

### Default Credentials

- Admin User:
  - Email: admin@example.com
  - Password: admin123
- Regular User:
  - Email: user@tester.com
  - Password: user

## Detailed Documentation

- [Frontend Architecture](./frontend.md)
- [Backend Architecture](./backend.md)
- [API Documentation](./api.md)
- [Database Schema](./database.md)
