import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Role {
  id: string;
  name: string;
}

interface Permission {
  id: string;
  name: string;
}

interface App {
  id: string;
  name: string;
}

// Mock data
let users: User[] = [
  { id: uuidv4(), name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: uuidv4(), name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

let roles: Role[] = [
  { id: uuidv4(), name: 'Admin' },
  { id: uuidv4(), name: 'User' },
];

let permissions: Permission[] = [
  { id: uuidv4(), name: 'Read' },
  { id: uuidv4(), name: 'Write' },
  { id: uuidv4(), name: 'Delete' },
];

let apps: App[] = [
  { id: uuidv4(), name: 'Dashboard' },
  { id: uuidv4(), name: 'Analytics' },
];

// Mock session storage
let activeSessions: { [key: string]: string } = {};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // In a real application, you would validate the credentials here
  if (username && password) {
    const sessionId = uuidv4();
    activeSessions[sessionId] = username;
    res.json({ sessionId });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId && activeSessions[sessionId]) {
    delete activeSessions[sessionId];
    res.json({ message: 'Logged out successfully' });
  } else {
    res.status(401).json({ error: 'Invalid session' });
  }
});

// Middleware to check if the user is authenticated
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const sessionId = req.headers['x-session-id'] as string;
  if (sessionId && activeSessions[sessionId]) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Apply authentication middleware to all routes that need protection
app.use('/api/users', authenticate);
app.use('/api/roles', authenticate);
app.use('/api/permissions', authenticate);
app.use('/api/apps', authenticate);

// Users endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const newUser: User = { id: uuidv4(), ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  users = users.map(user => user.id === id ? { ...user, ...updatedUser } : user);
  res.json(users.find(user => user.id === id));
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  users = users.filter(user => user.id !== id);
  res.status(204).send();
});

// Roles endpoints
app.get('/api/roles', (req, res) => {
  res.json(roles);
});

app.post('/api/roles', (req, res) => {
  const newRole: Role = { id: uuidv4(), ...req.body };
  roles.push(newRole);
  res.status(201).json(newRole);
});

app.put('/api/roles/:id', (req, res) => {
  const { id } = req.params;
  const updatedRole = req.body;
  roles = roles.map(role => role.id === id ? { ...role, ...updatedRole } : role);
  res.json(roles.find(role => role.id === id));
});

app.delete('/api/roles/:id', (req, res) => {
  const { id } = req.params;
  roles = roles.filter(role => role.id !== id);
  res.status(204).send();
});

// Permissions endpoints
app.get('/api/permissions', (req, res) => {
  res.json(permissions);
});

app.post('/api/permissions', (req, res) => {
  const newPermission: Permission = { id: uuidv4(), ...req.body };
  permissions.push(newPermission);
  res.status(201).json(newPermission);
});

app.put('/api/permissions/:id', (req, res) => {
  const { id } = req.params;
  const updatedPermission = req.body;
  permissions = permissions.map(permission => permission.id === id ? { ...permission, ...updatedPermission } : permission);
  res.json(permissions.find(permission => permission.id === id));
});

app.delete('/api/permissions/:id', (req, res) => {
  const { id } = req.params;
  permissions = permissions.filter(permission => permission.id !== id);
  res.status(204).send();
});

// Apps endpoints
app.get('/api/apps', (req, res) => {
  res.json(apps);
});

app.post('/api/apps', (req, res) => {
  const newApp: App = { id: uuidv4(), ...req.body };
  apps.push(newApp);
  res.status(201).json(newApp);
});

app.put('/api/apps/:id', (req, res) => {
  const { id } = req.params;
  const updatedApp = req.body;
  apps = apps.map(app => app.id === id ? { ...app, ...updatedApp } : app);
  res.json(apps.find(app => app.id === id));
});

app.delete('/api/apps/:id', (req, res) => {
  const { id } = req.params;
  apps = apps.filter(app => app.id !== id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});