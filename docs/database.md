# Database Schema Documentation

## Overview

The application uses MongoDB as its database, with Mongoose for schema definition and validation. The database consists of three main collections: Users, TestData, and ShorthandCategories.

## Collections

### Users Collection

```typescript
{
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  timestamps: true
}
```

**Indexes:**

- `email`: unique index

**Methods:**

- `comparePassword`: Compares plain text password with hashed password

### TestData Collection

```typescript
{
  timestamp: {
    type: Date,
    default: Date.now
  },
  jobCategory: {
    type: String,
    required: true
  },
  shorthandTest: {
    wpm: Number,
    accuracy: Number,
    timeInSeconds: Number,
    inputText: String
  },
  normalTest: {
    wpm: Number,
    accuracy: Number,
    timeInSeconds: Number,
    inputText: String
  },
  timeSaved: {
    seconds: Number,
    percentage: Number
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  timestamps: true
}
```

**Indexes:**

- `userId, timestamp`: Compound index for efficient queries
- `jobCategory`: Single field index

### ShorthandCategory Collection

```typescript
{
  category: {
    type: String,
    required: true,
    unique: true,
    enum: ["general", "medical", "legal", "tech"]
  },
  testText: {
    type: String,
    required: true
  },
  rules: [{
    shorthand: {
      type: String,
      required: true
    },
    expansion: {
      type: String,
      required: true
    }
  }]
}
```

**Indexes:**

- `category`: unique index

## Relationships

### User -> TestData

- One-to-Many relationship
- User's `_id` referenced in TestData's `userId` field
- Populated when retrieving test data in admin dashboard

### ShorthandCategory -> Rules

- Embedded document relationship
- Rules array contained within each category document
- No separate collection for rules

## Data Validation

### User Model

- Email format validation
- Password hashing before save
- Unique email constraint

### TestData Model

- Required fields validation
- Numeric field type enforcement
- Reference validation for userId

### ShorthandCategory Model

- Category enum validation
- Required fields validation
- Array validation for rules

## Default Data

### Admin User

```json
{
  "email": "admin@example.com",
  "password": "<hashed>admin123",
  "isAdmin": true
}
```

### Default Categories

```json
{
  "category": "general",
  "testText": "...",
  "rules": [
    {
      "shorthand": "btw",
      "expansion": "by the way"
    },
    ...
  ]
}
```

## Performance Considerations

### Indexes

- Strategic indexes for common queries
- Compound indexes for related fields
- Text indexes for search functionality

### Data Structure

- Embedded documents for related data
- References for scalable relationships
- Optimized field types

### Query Optimization

- Selective field projection
- Efficient population strategies
- Batch operations where possible
