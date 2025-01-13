# Backend Architecture Documentation

## Overview

The backend is built using Node.js with Express and TypeScript, following a modular architecture pattern. It uses MongoDB as the database with Mongoose for object modeling.

## Project Structure

```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── index.ts        # Application entry point
├── tests/              # Test files
└── tsconfig.json       # TypeScript configuration
```

## Core Components

### Server Configuration

**Location:** `src/index.ts`

Main server setup:

- Express application configuration
- Middleware integration
- Route registration
- Database connection
- Error handling

```typescript
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test-data", testDataRoutes);
app.use("/api/admin", adminRoutes);

mongoose.connect(MONGODB_URI);
```

### Authentication

**Location:** `src/middleware/auth.ts`

JWT-based authentication:

- Token validation
- Role verification
- Protected route middleware

```typescript
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
  };
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // Token validation logic
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};
```

### Models

#### User Model

**Location:** `src/models/user.ts`

```typescript
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Password hashing logic
});
```

#### TestData Model

**Location:** `src/models/testData.ts`

```typescript
const testDataSchema = new Schema({
  timestamp: Date,
  jobCategory: String,
  shorthandTest: {
    wpm: Number,
    accuracy: Number,
    timeInSeconds: Number,
  },
  normalTest: {
    wpm: Number,
    accuracy: Number,
    timeInSeconds: Number,
  },
  timeSaved: {
    seconds: Number,
    percentage: Number,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
```

### Routes

#### Authentication Routes

**Location:** `src/routes/auth.ts`

```typescript
router.post("/login", async (req, res) => {
  // Login logic
});

router.post("/logout", auth, async (req, res) => {
  // Logout logic
});
```

#### Test Data Routes

**Location:** `src/routes/testData.ts`

```typescript
router.post("/", async (req, res) => {
  // Save test results
});

router.get("/admin", adminAuth, async (req, res) => {
  // Retrieve test results for admin
});
```

## Middleware

### Authentication Middleware

- JWT validation
- Role-based access control
- Error handling

### Request Validation

- Input sanitization
- Schema validation
- Type checking

### Error Handling

- Global error handler
- Custom error classes
- Error logging

## Security

### Authentication

- JWT token generation
- Password hashing (bcrypt)
- Token expiration

### Authorization

- Role-based access
- Route protection
- Resource ownership

### Data Protection

- Input validation
- XSS prevention
- Rate limiting

## Database Operations

### Connection Management

- Connection pooling
- Retry mechanism
- Error handling

### Queries

- Efficient indexing
- Query optimization
- Aggregation pipelines

### Data Validation

- Schema validation
- Type checking
- Required fields

## Error Handling

### Custom Error Classes

```typescript
class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public details?: any
  ) {
    super(message);
  }
}
```

### Global Error Handler

```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof APIError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details,
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
  });
});
```

## Testing

### Unit Tests

- Controller testing
- Model testing
- Utility function testing

### Integration Tests

- API endpoint testing
- Database operations
- Authentication flow

### Test Environment

- Separate test database
- Mock data generation
- Test utilities

## Performance Optimization

### Caching

- Response caching
- Database query caching
- In-memory caching

### Database

- Indexing strategy
- Query optimization
- Connection pooling

### Request Handling

- Compression
- Rate limiting
- Request timeout

## Deployment

### Environment Variables

```typescript
export const config = {
  PORT: process.env.PORT || 5001,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};
```

### Production Setup

- PM2 process management
- Logging configuration
- Error tracking
- Performance monitoring

### CI/CD

- Build process
- Testing pipeline
- Deployment automation
- Version control
