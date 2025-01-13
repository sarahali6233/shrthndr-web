# Frontend Architecture Documentation

## Overview

The frontend is built using React with TypeScript, utilizing Material-UI (MUI) for the component library. The application follows a component-based architecture with proper separation of concerns.

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/         # React context providers
├── hooks/           # Custom React hooks
├── services/        # API service functions
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Key Components

### TypingTest Component

**Location:** `src/components/TypingTest.tsx`

Main component for conducting typing tests:

- Manages test state (idle, running, completed)
- Handles input validation and timing
- Calculates WPM and accuracy
- Submits results to backend
- Integrates with shorthand rules

Key features:

- Real-time WPM calculation
- Accuracy tracking
- Time saved calculations
- Job category selection
- Results submission

### AdminDashboard Component

**Location:** `src/components/AdminDashboard.tsx`

Dashboard for administrators:

- Displays test results
- Provides data visualization
- Allows CSV export
- Manages shorthand rules

Features:

- Tabular data display
- Filtering capabilities
- Export functionality
- User management

### Login Component

**Location:** `src/components/Login.tsx`

Handles user authentication:

- User/Admin login form
- Credential validation
- Token management
- Error handling

### Navigation

**Location:** `src/App.tsx`

Main navigation and routing:

- Protected routes
- Role-based access
- Responsive layout
- Session management

## State Management

### Context Providers

1. **AuthContext**

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

2. **TestContext**

```typescript
interface TestContextType {
  jobCategory: string;
  setJobCategory: (category: string) => void;
  rules: ShorthandRule[];
  testText: string;
}
```

## API Integration

### API Services

**Location:** `src/services/api.ts`

```typescript
// Authentication
login(email: string, password: string): Promise<AuthResponse>
logout(): void

// Test Data
submitTestResults(data: TestData): Promise<void>
getTestResults(): Promise<TestResult[]>

// Shorthand Management
getShorthandRules(category: string): Promise<ShorthandRule[]>
```

## Type Definitions

**Location:** `src/types/index.ts`

```typescript
interface TestData {
  jobCategory: string;
  shorthandTest: TestMetrics;
  normalTest: TestMetrics;
  timeSaved: TimeSaved;
}

interface TestMetrics {
  wpm: number;
  accuracy: number;
  timeInSeconds: number;
  inputText?: string;
}

interface ShorthandRule {
  shorthand: string;
  expansion: string;
}
```

## Styling

### Material-UI Theme

**Location:** `src/theme.ts`

- Custom color palette
- Typography settings
- Component overrides
- Responsive breakpoints

### Component Styling

- Styled components using MUI's `styled` API
- CSS-in-JS with emotion
- Responsive design patterns
- Consistent spacing using theme

## Error Handling

### Error Boundaries

- Component-level error catching
- Fallback UI components
- Error reporting

### Form Validation

- Input validation
- Error messages
- Loading states
- Success feedback

## Performance Optimization

### Code Splitting

- Lazy loading routes
- Dynamic imports
- Suspense boundaries

### Memoization

- React.memo for pure components
- useMemo for expensive calculations
- useCallback for stable callbacks

### Caching

- API response caching
- Local storage utilization
- Memory cache for frequent data

## Testing

### Unit Tests

- Component testing
- Hook testing
- Utility function testing

### Integration Tests

- User flow testing
- API integration testing
- Error scenario testing

## Build and Deployment

### Build Process

- Environment configuration
- Asset optimization
- Bundle analysis
- Source maps

### Deployment

- Static file serving
- Environment variables
- Cache control
- Error tracking
