# Database Schema Documentation

## Overview

The application uses Supabase's PostgreSQL database for data storage and management. The database schema consists of three main tables: users (extending Supabase Auth), test_data, and shorthand_categories.

## Tables

### Users Table (Auth.users extension)

```sql
-- Extends Supabase Auth.users
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
```

**Policies:**

- Users can read their own profile
- Admins can read all profiles
- Users can update their own profile
- Admins can update any profile

### Test Data Table

```sql
CREATE TABLE public.test_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  job_category TEXT NOT NULL,
  shorthand_test JSONB NOT NULL,
  normal_test JSONB NOT NULL,
  time_saved JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  CONSTRAINT shorthand_test_schema CHECK (
    shorthand_test ? 'wpm' AND
    shorthand_test ? 'accuracy' AND
    shorthand_test ? 'timeInSeconds'
  ),
  CONSTRAINT normal_test_schema CHECK (
    normal_test ? 'wpm' AND
    normal_test ? 'accuracy' AND
    normal_test ? 'timeInSeconds'
  ),
  CONSTRAINT time_saved_schema CHECK (
    time_saved ? 'seconds' AND
    time_saved ? 'percentage'
  )
);

-- Indexes
CREATE INDEX test_data_user_id_idx ON public.test_data(user_id);
CREATE INDEX test_data_job_category_idx ON public.test_data(job_category);

-- RLS Policies
ALTER TABLE public.test_data ENABLE ROW LEVEL SECURITY;
```

**Policies:**

- Users can read their own test data
- Admins can read all test data
- Users can create their own test data
- No update/delete operations allowed

### Shorthand Categories Table

```sql
CREATE TABLE public.shorthand_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  test_text TEXT NOT NULL,
  rules JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  CONSTRAINT category_enum CHECK (
    category IN ('general', 'medical', 'legal', 'tech')
  ),
  CONSTRAINT rules_schema CHECK (
    jsonb_typeof(rules) = 'array' AND
    jsonb_array_length(rules) > 0
  )
);

-- RLS Policies
ALTER TABLE public.shorthand_categories ENABLE ROW LEVEL SECURITY;
```

**Policies:**

- All authenticated users can read
- Only admins can create/update/delete

## Relationships

### Users -> Test Data

- One-to-Many relationship via `user_id` foreign key
- Enforced by foreign key constraint to `auth.users`

### Categories -> Rules

- Contained within JSONB array in the `rules` column
- Schema validated through CHECK constraints

## Data Validation

### User Profiles

- Automatic user creation through Supabase Auth triggers
- Boolean validation for `is_admin`
- Timestamp management for auditing

### Test Data

- JSON schema validation through CHECK constraints
- Foreign key constraint for user relationship
- Timestamp management for auditing

### Shorthand Categories

- Enum validation for category types
- JSON array validation for rules
- Unique constraint on category names

## Default Data

### Admin User

```sql
INSERT INTO auth.users /* handled by Supabase Auth */
INSERT INTO public.user_profiles (id, is_admin)
VALUES ('admin-uuid', true);
```

### Default Categories

```sql
INSERT INTO public.shorthand_categories
(category, test_text, rules) VALUES
('general', '...', '[
  {"shorthand": "btw", "expansion": "by the way"},
  ...
]');
```

## Performance Considerations

### Indexes

- B-tree indexes on frequently queried columns
- Foreign key indexes for relationships
- GiST indexes for text search capabilities

### Data Structure

- JSONB for flexible schema elements
- Normalized tables for core entities
- Efficient constraint validation

### Query Optimization

- RLS policies for security
- Efficient joins through foreign keys
- Prepared statements for common queries

## Security

### Row Level Security

- Enforced on all tables
- Policy-based access control
- Role-based permissions

### Authentication

- Integrated with Supabase Auth
- JWT token validation
- Secure session management
