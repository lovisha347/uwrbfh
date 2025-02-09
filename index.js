// server/index.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import geoip from 'geoip-lite';
import 'dotenv/config';

import config from './config/config.js';
import router from './routes/index.js';
import { securityMiddleware } from './middlewares/security.js';
import constants from './constants.js';

const app = express();
const server = http.createServer(app);

// Security Middleware
app.use(helmet()); // Security headers
app.use(xss()); // Sanitize input
app.use(cors({
  origin: config.CORS_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT.windowMs,
  max: config.RATE_LIMIT.max,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Apply security middleware
securityMiddleware.forEach(middleware => app.use(middleware));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use(router);

// Socket.IO setup with security measures
const io = require('socket.io')(server, {
  path: '/socket.io/',
  cors: {
    origin: ["https://dezzy.live", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket']
});

// WebRTC configuration
const iceServers = {
  iceServers: [
    { urls: [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302'
    ]},
    {
      urls: [
        'turn:numb.viagenie.ca:3478',
        'turn:numb.viagenie.ca:3478?transport=tcp',
        'turns:numb.viagenie.ca:443'
      ],
      username: 'webrtc@live.com',
      credential: 'muazkh'
    }
  ],
  iceCandidatePoolSize: 10,
  iceTransportPolicy: 'all',
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};

// Socket state
let activeViewers = new Map();
let streamActive = false;
const chatHistory = [];
const MAX_CHAT_HISTORY = 100;
let botInterval = null;
const BOT_DELAY_MIN = 3000;
const BOT_DELAY_MAX = 10000;

// Rate limit for socket connections
const socketRateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100;

const resetRateLimit = () => {
  socketRateLimit.clear();
};

setInterval(resetRateLimit, RATE_LIMIT_WINDOW);

const startBotMessages = () => {
  if (botInterval) {
    clearInterval(botInterval);
  }

  const sendBotMessage = () => {
    const botMessage = constants.generateBotMessage();
    chatHistory.push(botMessage);
    if (chatHistory.length > MAX_CHAT_HISTORY) {
      chatHistory.shift();
    }

    io.emit('chat:message', botMessage);
  };

  // Send first message after a short delay
  setTimeout(sendBotMessage, 2000);
  
  // Then send messages randomly between MIN and MAX delay
  botInterval = setInterval(() => {
    const delay = Math.floor(Math.random() * (BOT_DELAY_MAX - BOT_DELAY_MIN) + BOT_DELAY_MIN);
    setTimeout(sendBotMessage, delay);
  }, BOT_DELAY_MAX);
};

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Initialize rate limit for this socket
  socketRateLimit.set(socket.id, { count: 0, lastReset: Date.now() });

  socket.on('stream:start', () => {
    console.log(`Admin started streaming: ${socket.id}`);
    streamActive = true;
    socket.join('admin-room');
    socket.to('viewer-room').emit('stream-available', { streamerId: socket.id });
    
    if (!botInterval) {
      startBotMessages();
    }
  });

  socket.on('stream:end', () => {
    streamActive = false;
    if (botInterval) {
      clearInterval(botInterval);
      botInterval = null;
    }
    socket.to('viewer-room').emit('stream-ended');
  });

  socket.on('viewer:join', (username) => {
    const ip = socket.handshake.address;
    const geo = geoip.lookup(ip) || { country: 'Unknown' };
    
    activeViewers.set(socket.id, {
      username,
      country: geo.country,
      ip: ip
    });

    socket.join('viewer-room');
    
    io.emit('viewers:update', {
      count: activeViewers.size,
      viewers: Array.from(activeViewers.values())
    });

    // If stream is active, notify the new viewer
    const adminRoom = io.sockets.adapter.rooms.get('admin-room');
    if (adminRoom?.size > 0) {
      const adminId = Array.from(adminRoom)[0];
      socket.emit('stream-available', { streamerId: adminId });
    }

    // Send chat history to new viewer
    socket.emit('chat:history', chatHistory);
  });

  // WebRTC signaling
  socket.on('offer', ({ offer, streamerId }) => {
    console.log(`Relaying offer from ${socket.id} to ${streamerId}`);
    socket.to(streamerId).emit('offer', {
      offer,
      viewerId: socket.id
    });
  });

  socket.on('answer', ({ answer, viewerId }) => {
    console.log(`Relaying answer from ${socket.id} to ${viewerId}`);
    socket.to(viewerId).emit('answer', { answer });
  });

  socket.on('ice-candidate', ({ candidate, targetId }) => {
    console.log(`Relaying ICE candidate from ${socket.id} to ${targetId}`);
    socket.to(targetId).emit('ice-candidate', { candidate });
  });

  // Chat functionality
  socket.on('chat:message', (messageData) => {
    try {
      // Check rate limit
      const rateLimit = socketRateLimit.get(socket.id);
      if (rateLimit) {
        rateLimit.count++;
        if (rateLimit.count > RATE_LIMIT_MAX) {
          socket.emit('error', { message: 'Rate limit exceeded' });
          return;
        }
      }

      const sanitizedMessage = {
        username: messageData.username,
        message: messageData.message,
        timestamp: new Date().toISOString(),
        id: messageData.id || Date.now().toString(),
        isBot: false
      };

      chatHistory.push(sanitizedMessage);
      if (chatHistory.length > MAX_CHAT_HISTORY) {
        chatHistory.shift();
      }

      io.emit('chat:message', sanitizedMessage);
    } catch (error) {
      console.log('Error handling chat message:', error);
      socket.emit('error', { message: 'Error processing message' });
    }
  });

  socket.on('chat:history', () => {
    socket.emit('chat:history', chatHistory);
  });

  socket.on('bot:toggle', (enabled) => {
    if (enabled && !botInterval) {
      startBotMessages();
    } else if (!enabled && botInterval) {
      clearInterval(botInterval);
      botInterval = null;
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    activeViewers.delete(socket.id);
    socketRateLimit.delete(socket.id);
    
    io.emit('viewers:update', {
      count: activeViewers.size,
      viewers: Array.from(activeViewers.values())
    });

    if (socket.rooms?.has('admin-room')) {
      io.to('viewer-room').emit('stream-ended');
      if (botInterval) {
        clearInterval(botInterval);
        botInterval = null;
      }
    }
  });
});

// Error handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing server...');
  if (botInterval) {
    clearInterval(botInterval);
  }
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

server.on('error', (error) => {
  console.log('Server error:', error);
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log("hellooo..")
});