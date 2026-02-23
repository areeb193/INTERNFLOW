import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './utils/db.js';
import userRoutes from './routes/user.route.js';
import jobRoutes from './routes/job.route.js';
import companyRoutes from './routes/company.route.js';
import applicationRoutes from './routes/application.route.js';
import jobHuntRoutes from './routes/jobHunt.route.js';
import chatRoutes from './routes/chat.route.js';
dotenv.config({});
const app = express();
const httpServer = createServer(app);

// Socket.IO setup with Railway-compatible configuration
const io = new Server(httpServer, {
  cors: {
    origin: true, // Allow all origins temporarily for debugging
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  allowUpgrades: true
});

// Health check endpoint (keep a simple backend response under /api)
app.get('/api/health', (req, res) => {
  res.send('Welcome to the InternshipPortal Backend!');
});
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Dynamic CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins for now (Railway + Vercel compatibility)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Socket.IO connection handling with error handling
io.on('connection', (socket) => {
  console.log('✅ Socket.IO client connected:', socket.id);
  
  // Join chat room based on application
  socket.on('join-chat', (applicationId) => {
    socket.join(`chat-${applicationId}`);
    console.log(`User ${socket.id} joined chat-${applicationId}`);
  });
  
  // Handle incoming messages
  socket.on('send-message', async (data) => {
    const { chatId, senderId, content, applicationId } = data;
    
    // Broadcast to all users in the chat room
    io.to(`chat-${applicationId}`).emit('new-message', {
      chatId,
      senderId,
      content,
      timestamp: new Date()
    });
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('❌ Socket.IO client disconnected:', socket.id, 'Reason:', reason);
  });
});

const PORT = process.env.PORT || 8000;

// Frontend is deployed separately on Vercel
// Backend only serves API endpoints

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Job Portal API is running',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      user: '/api/v1/user',
      company: '/api/v1/company',
      job: '/api/v1/job',
      application: '/api/v1/application',
      jobHunt: '/api/v1/job-hunt',
      chat: '/api/v1/chat',
      health: '/api/health'
    }
  });
});

// API routes
app.use('/api/v1/user', userRoutes);
//http://localhost:8000/api/v1/user/register
//http://localhost:8000/api/v1/user/login
//http://localhost:8000/api/v1/user/profile/update
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/application', applicationRoutes);
app.use('/api/v1/job-hunt', jobHuntRoutes);
app.use('/api/v1/chat', chatRoutes);
//http://localhost:8000/api/v1/application/apply/:id
//http://localhost:8000/api/v1/application/get
//http://localhost:8000/api/v1/application/:id/applicants
//http://localhost:8000/api/v1/application/status/:id/update
//http://localhost:8000/api/v1/job/get

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/v1/user',
      '/api/v1/company',
      '/api/v1/job',
      '/api/v1/application',
      '/api/v1/job-hunt',
      '/api/v1/chat'
    ]
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Note: static + SPA catch-all are registered above to ensure '/' serves the frontend

httpServer.listen(PORT, () => {
    connectDB();
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
    console.log(`💬 Socket.IO is ready for connections`);
});

// Make io available to other modules if needed
export { io };