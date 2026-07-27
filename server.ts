import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_FILE = path.join(process.cwd(), 'users_data.json');

interface ServerUser {
  id: string;
  username: string;
  name: string;
  phone: string;
  password: string;
  status: string;
  role: string;
  createdAt: string;
  approvedAt?: string;
}

// Default initial users, INCLUDING "dona"
const INITIAL_USERS: ServerUser[] = [
  {
    id: 'admin-1',
    username: 'admin',
    name: 'Administrador Pica-Pau',
    phone: '(62) 98428-9911',
    password: 'admin123',
    status: 'approved',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-dona',
    username: 'dona',
    name: 'Dona',
    phone: '(62) 98428-9911',
    password: '123456',
    status: 'pending',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-1',
    username: 'jogador1',
    name: 'Carlos Eduardo',
    phone: '(11) 98888-7777',
    password: '123456',
    status: 'approved',
    role: 'user',
    createdAt: '2026-01-02T10:00:00.000Z',
  },
  {
    id: 'user-2',
    username: 'novo_jogador',
    name: 'Roberto Alves',
    phone: '(21) 97777-6666',
    password: '123456',
    status: 'pending',
    role: 'user',
    createdAt: '2026-01-03T14:30:00.000Z',
  },
];

let state = {
  users: INITIAL_USERS,
  pixKey: '(62) 98428-9911',
};

// Load existing file if present
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.users && Array.isArray(parsed.users) && parsed.users.length > 0) {
      // Ensure "dona" is in users if missing
      const hasDona = parsed.users.some((u: any) => u.username.toLowerCase() === 'dona');
      if (!hasDona) {
        parsed.users.push(INITIAL_USERS[1]);
      }
      state.users = parsed.users;
    }
    if (parsed.pixKey) {
      state.pixKey = parsed.pixKey;
    }
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
  }
} catch (e) {
  console.error('Error loading data file:', e);
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
  } catch (e) {
    console.error('Error saving data file:', e);
  }
}

// API Routes
app.get('/api/users', (req, res) => {
  res.json(state.users);
});

app.post('/api/users', (req, res) => {
  const { name, username, phone, password, status, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const cleanUsername = username.trim().toLowerCase();
  const existing = state.users.find(u => u.username.toLowerCase() === cleanUsername);
  if (existing) {
    return res.status(400).json({ error: 'Este nome de usuário já está cadastrado.' });
  }

  const newUser = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
    name: name ? name.trim() : cleanUsername,
    username: cleanUsername,
    phone: phone ? phone.trim() : '',
    password: password.trim(),
    status: status || 'pending',
    role: role || 'user',
    createdAt: new Date().toISOString(),
  };

  state.users.push(newUser);
  saveData();
  res.json(newUser);
});

app.put('/api/users/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = state.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.status = status;
  if (status === 'approved') {
    user.approvedAt = new Date().toISOString();
  }
  saveData();
  res.json(user);
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  state.users = state.users.filter(u => u.id !== id);
  saveData();
  res.json({ success: true });
});

app.get('/api/pix-key', (req, res) => {
  res.json({ pixKey: state.pixKey });
});

app.post('/api/pix-key', (req, res) => {
  const { pixKey } = req.body;
  if (pixKey) {
    state.pixKey = pixKey;
    saveData();
  }
  res.json({ pixKey: state.pixKey });
});

// Vite middleware / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
