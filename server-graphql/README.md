# ProfileSwitcher GraphQL Server

This is the GraphQL server for the ProfileSwitcher application. It provides a flexible, server-driven UI system for the app context.

## Features

- Server-driven UI components
- Flexible page layouts
- GraphQL API for fetching UI structures

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/profile-switcher.git
   cd profile-switcher/graphql-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

The GraphQL server will start running on `http://localhost:4000/graphql`.

## GraphQL Schema

The main types in the schema are:

- `Page`: Represents a page in the application
- `Component`: Represents a UI component with its properties and children

## Queries

- `getPage(name: String!): Page`: Fetches a page by its name

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

## Extending the Schema

To add new component types or properties, update the `typeDefs` in `graphql-server.ts` and add corresponding resolvers if needed.

## License

This project is licensed under the MIT License.