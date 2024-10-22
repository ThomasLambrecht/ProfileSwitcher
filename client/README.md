# ProfileSwitcher UI Client

This is the React-based UI client for the ProfileSwitcher application. It provides an admin interface and an app context that renders server-driven UI components.

## Features

- Admin interface for managing users, roles, permissions, and apps
- App context with server-driven UI components
- Authentication and profile switching
- Responsive design using Tailwind CSS

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/your-repo/profile-switcher.git
   cd profile-switcher/ui-client
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

- `src/components/`: React components
- `src/lib/`: Utility functions and API clients
- `src/styles/`: Global styles and Tailwind CSS configuration

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production

## Connecting to Servers

- Update the REST API base URL in `src/lib/api.ts`
- Update the GraphQL server URL in `src/lib/apollo-client.ts`

## Adding New Components

To add new UI components for the server-driven UI:

1. Create a new component in `src/components/`
2. Add the component to the `renderComponent` function in `src/components/AppContext.tsx`

## Styling

This project uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`.

## Testing

Run `npm test` to execute the test suite.

## Building for Production

Run `npm run build` to create a production-ready build in the `build/` directory.

## License

This project is licensed under the MIT License.
