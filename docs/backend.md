# Backend Architecture Documentation

## Overview

The backend is built using Node.js with Express and TypeScript, using Supabase as the database. It's deployed on Vercel at `https://shrthnder-server.vercel.app`.

## Project Structure

```
server/
├── src/
│   ├── config/         # Configuration files (Supabase setup)
│   ├── models/         # Data models and types
│   └── index.ts        # Application entry point and route handlers
├── dist/              # Compiled TypeScript output
├── vercel.json        # Vercel deployment configuration
└── tsconfig.json      # TypeScript configuration
```

## Core Components

### Server Configuration

**Location:** `src/index.ts`

Main server setup:

- Express application configuration
- CORS and JSON middleware
- Route handlers
- Supabase database connection
- Error handling
- Authentication middleware

### Database Configuration

**Location:** `src/config/supabase.ts`

Supabase client setup and configuration:

- Database connection
- Authentication
- Table access

### Deployment

The backend is deployed on Vercel with the following configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node",
      "config": {
        "outputDirectory": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

### API Endpoints

#### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Test Data

- `GET /api/test-data` - Get user's test data
- `POST /api/test-data` - Save test results

#### Admin Routes

- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/users` - Create new user (admin only)
- `GET /api/admin/test-data` - Get all test data (admin only)

#### Shorthand Rules

- `GET /api/shorthand` - Get all shorthand categories
- `PUT /api/shorthand/:category` - Update shorthand category rules

### Security

- JWT-based authentication
- Role-based access control (admin vs regular users)
- Environment variables for sensitive data
- CORS configuration for frontend access

### Error Handling

- Global error handler for consistent error responses
- Input validation
- Proper HTTP status codes
- Detailed error messages in development

## Environment Variables

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret
```
