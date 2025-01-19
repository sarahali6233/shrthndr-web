# Shrthnder Web Documentation

## Project Overview

Shrthnder Web is a web-based application for testing and comparing typing speeds using shorthand versus normal typing. The application consists of a React frontend and uses Supabase for backend services and data storage.

## Project Links

- **Frontend Application:** [https://shrthnder-web.vercel.app/](https://shrthnder-web.vercel.app/)
- **Admin Dashboard:** [https://shrthnder-web.vercel.app/admin](https://shrthnder-web.vercel.app/admin)
- **API Endpoint:** [https://shrthnder-server.vercel.app/](https://shrthnder-server.vercel.app/)

## Project Structure

```
shrthnder-web/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── services/          # API service functions
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── supabase/              # Supabase configuration
│   ├── functions/         # Edge functions
│   └── migrations/        # Database migrations
└── docs/                  # Documentation
```

## Core Features

1. **Typing Test System**

   - Normal typing test
   - Shorthand typing test
   - Real-time WPM and accuracy calculation
   - Time-saving comparison

2. **User Management**

   - User authentication via Supabase Auth
   - Admin and regular user roles
   - Secure session management

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
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update with your Supabase project credentials

### Running the Application

1. Start the development server:
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
