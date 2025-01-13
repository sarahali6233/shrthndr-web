# API Documentation

## Base URL

```
http://localhost:5001/api
```

## Authentication

### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "isAdmin": "boolean"
  }
}
```

**Status Codes:**

- 200: Success
- 401: Invalid credentials
- 400: Missing required fields

### Logout

```http
POST /auth/logout
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

**Status Codes:**

- 200: Success
- 401: Unauthorized

## Test Data

### Submit Test Results

```http
POST /test-data
```

**Request Body:**

```json
{
  "jobCategory": "string",
  "shorthandTest": {
    "wpm": "number",
    "accuracy": "number",
    "timeInSeconds": "number",
    "inputText": "string"
  },
  "normalTest": {
    "wpm": "number",
    "accuracy": "number",
    "timeInSeconds": "number",
    "inputText": "string"
  },
  "timeSaved": {
    "seconds": "number",
    "percentage": "number"
  }
}
```

**Response:**

```json
{
  "message": "Test results saved successfully",
  "id": "string"
}
```

**Status Codes:**

- 201: Created
- 400: Invalid data
- 500: Server error

### Get Test Results (Admin Only)

```http
GET /admin/test-data
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "results": [
    {
      "id": "string",
      "timestamp": "date",
      "jobCategory": "string",
      "shorthandTest": {
        "wpm": "number",
        "accuracy": "number",
        "timeInSeconds": "number"
      },
      "normalTest": {
        "wpm": "number",
        "accuracy": "number",
        "timeInSeconds": "number"
      },
      "timeSaved": {
        "seconds": "number",
        "percentage": "number"
      },
      "userId": "string"
    }
  ],
  "total": "number"
}
```

**Query Parameters:**

- page (optional): Page number for pagination
- limit (optional): Results per page
- category (optional): Filter by job category

**Status Codes:**

- 200: Success
- 401: Unauthorized
- 403: Not admin

## Shorthand Management

### Get Categories

```http
GET /shorthand/categories
```

**Response:**

```json
{
  "categories": [
    {
      "id": "string",
      "category": "string",
      "testText": "string",
      "rules": [
        {
          "shorthand": "string",
          "expansion": "string"
        }
      ]
    }
  ]
}
```

**Status Codes:**

- 200: Success
- 500: Server error

### Get Category Rules

```http
GET /shorthand/categories/:category
```

**Parameters:**

- category: Category name (general, medical, legal, tech)

**Response:**

```json
{
  "category": "string",
  "testText": "string",
  "rules": [
    {
      "shorthand": "string",
      "expansion": "string"
    }
  ]
}
```

**Status Codes:**

- 200: Success
- 404: Category not found
- 500: Server error

### Update Category (Admin Only)

```http
PUT /admin/shorthand/categories/:category
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "testText": "string",
  "rules": [
    {
      "shorthand": "string",
      "expansion": "string"
    }
  ]
}
```

**Response:**

```json
{
  "message": "Category updated successfully",
  "category": {
    "id": "string",
    "category": "string",
    "testText": "string",
    "rules": [
      {
        "shorthand": "string",
        "expansion": "string"
      }
    ]
  }
}
```

**Status Codes:**

- 200: Success
- 401: Unauthorized
- 403: Not admin
- 404: Category not found
- 400: Invalid data

## User Management

### Create User (Admin Only)

```http
POST /admin/users
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "email": "string",
  "password": "string",
  "isAdmin": "boolean"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "string",
    "email": "string",
    "isAdmin": "boolean"
  }
}
```

**Status Codes:**

- 201: Created
- 400: Invalid data
- 401: Unauthorized
- 403: Not admin
- 409: Email already exists

### Get Users (Admin Only)

```http
GET /admin/users
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "users": [
    {
      "id": "string",
      "email": "string",
      "isAdmin": "boolean",
      "createdAt": "date"
    }
  ]
}
```

**Status Codes:**

- 200: Success
- 401: Unauthorized
- 403: Not admin

## Error Responses

### 400 Bad Request

```json
{
  "error": "string",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized

```json
{
  "error": "Please authenticate."
}
```

### 403 Forbidden

```json
{
  "error": "Admin access required."
}
```

### 404 Not Found

```json
{
  "error": "Resource not found."
}
```

### 500 Server Error

```json
{
  "error": "Internal server error."
}
```

## Rate Limiting

- Rate limit: 100 requests per minute
- Headers:
  - X-RateLimit-Limit: Maximum requests per window
  - X-RateLimit-Remaining: Remaining requests in current window
  - X-RateLimit-Reset: Time when the rate limit resets

## Authentication Headers

All protected endpoints require:

```
Authorization: Bearer <token>
```

## Data Types

### TestMetrics

```typescript
{
  wpm: number;          // Words per minute
  accuracy: number;     // Percentage (0-100)
  timeInSeconds: number;// Test duration
  inputText?: string;   // Optional user input
}
```

### TimeSaved

```typescript
{
  seconds: number; // Time saved in seconds
  percentage: number; // Percentage of time saved
}
```

### ShorthandRule

```typescript
{
  shorthand: string; // Shorthand text
  expansion: string; // Expanded text
}
```
