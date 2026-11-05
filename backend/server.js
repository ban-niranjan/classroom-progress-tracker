const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const checkpointRoutes = require('./routes/checkpointRoutes');
const progressRoutes = require('./routes/progressRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Connect to database
connectDB();


const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

// CORS configuration using allow-list
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : [];

const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174',
  `http://localhost:${PORT}`,
  `http://127.0.0.1:${PORT}`,
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : defaultOrigins;
const combinedOrigins = [...defaultOrigins, ...allowedOrigins];

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (combinedOrigins.includes(origin) || combinedOrigins.includes('*')) return true;
  try {
    const url = new URL(origin);
    if (
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      combinedOrigins.some((allowed) => allowed.includes(url.host))
    ) {
      return true;
    }
  } catch (e) {}
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, or same-origin requests)
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
};
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => callback(null, isOriginAllowed(origin)),
    credentials: true
  }
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// ADD THIS DEBUG MIDDLEWARE
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/sessions/:sessionId/checkpoints', checkpointRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/messages', messageRoutes);

// Serve static frontend files
const distPath = path.join(__dirname, '../frontend/app/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Catch-all route to serve index.html for client-side routing (Express 5 syntax)
  app.get('{*path}', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_session', (sessionId) => {
    socket.join(`session_${sessionId}`);
    console.log(`Socket ${socket.id} joined session ${sessionId}`);
  });

  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user room ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
