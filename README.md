# Shrthnder Web Application

A web-based shorthand typing test and training platform that helps users measure and improve their typing efficiency using shorthand rules.

## Features

- **Typing Test System**

  - Normal typing test
  - Shorthand typing test
  - Real-time WPM and accuracy tracking
  - Time saved calculations

- **Job-Specific Tests**

  - General shorthand
  - Medical transcription
  - Legal documentation
  - Technical writing

- **User Management**

  - User registration and login
  - Admin dashboard
  - Role-based access control

- **Analytics**
  - Detailed test results
  - Performance metrics
  - Time saved statistics
  - CSV export functionality

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/shrthnder-web.git
cd shrthnder-web
```

2. Install dependencies:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Set up environment variables:

```bash
# In server directory
cp .env.example .env
```

Edit `.env` file with your configuration:

```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/shrthnder
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. Start MongoDB:

```bash
mongod
```

2. Start the backend server (from server directory):

```bash
npm run dev
```

3. Start the frontend (from project root):

```bash
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## Default Credentials

### Admin User

- Email: admin@example.com
- Password: admin123

### Regular User

- Email: user@tester.com
- Password: user

## Documentation

Detailed documentation is available in the `docs` folder:

- [Frontend Architecture](docs/frontend.md)
- [Backend Architecture](docs/backend.md)
- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)

## Project Structure

```
shrthnder-web/
├── src/                # Frontend source files
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── hooks/         # Custom hooks
│   ├── services/      # API services
│   └── utils/         # Utility functions
├── server/            # Backend source files
│   ├── src/           # Server source code
│   ├── tests/         # Server tests
│   └── tsconfig.json  # TypeScript config
├── docs/             # Documentation
├── public/           # Static files
└── package.json      # Project dependencies
```

## Key Features Implementation

### Typing Test

The typing test system measures:

- Words per minute (WPM)
- Accuracy percentage
- Time saved using shorthand
- Comparison between normal and shorthand typing

### Shorthand Rules

Shorthand rules are categorized by job type:

- Each category has specific abbreviations
- Rules are automatically applied during typing
- Custom rules can be added by admins

### Admin Dashboard

Administrators can:

- View all test results
- Export data to CSV
- Manage shorthand rules
- Monitor user performance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- Express.js for the backend framework
- React for the frontend framework
