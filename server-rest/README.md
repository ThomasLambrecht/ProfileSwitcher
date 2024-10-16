# ProfileSwitcher REST Server

This is the REST API server for the ProfileSwitcher application. It provides endpoints for user authentication and CRUD operations for users, roles, permissions, and apps.

## Features

- User authentication (login/logout)
- CRUD operations for users, roles, permissions, and apps
- Session-based authentication

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/profile-switcher.git
   cd profile-switcher/rest-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

The server will start running on `http://localhost:3001`.

## API Endpoints

- POST /api/login - User login
- POST /api/logout - User logout
- GET /api/users - Get all users
- POST /api/users - Create a new user
- PUT /api/users/:id - Update a user
- DELETE /api/users/:id - Delete a user

Similar endpoints exist for roles, permissions, and apps.

## Authentication

All endpoints except login require authentication. Include the `x-session-id` header in your requests with the session ID received from the login endpoint.

## Development

To run the server in development mode with hot reloading:

```
npm run dev
```

## Testing

To run tests:

```
npm test
```

## License

This project is licensed under the MIT License.