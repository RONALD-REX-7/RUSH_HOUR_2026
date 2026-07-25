#!/bin/bash

# Update server.ts
cat << 'INNER_EOF' > server.ts
import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './server/config/db';
import { apiRouter } from './server/routes/api';
import { errorHandler } from './server/middleware/errorHandler';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Initialize Database
  await initDatabase();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json({ limit: '10mb' }));

  // Mount API REST routes
  app.use('/api', apiRouter);

  // Error Handler
  app.use(errorHandler);

  // Vite middleware for development vs static production serving
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
    console.log(`[Server] Express running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
});
INNER_EOF

# Refactor the models to have 'id' instead of just '_id' for seamless integration
cat << 'INNER_EOF' > server/models/User.ts
import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  email: String,
  role: String,
  avatar: String,
  phone: String,
  address: String,
  bio: String,
  domain: String,
  skills: [String],
  rating: Number,
  completedJobs: Number,
  monthlyEarnings: Number,
  password: { type: String }
});
export const UserModel = mongoose.model('User', userSchema);
INNER_EOF

cat << 'INNER_EOF' > server/models/Problem.ts
import mongoose from 'mongoose';
const problemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  category: String,
  description: String,
  location: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
  images: [String],
  priority: String,
  status: String,
  dateSubmitted: String,
  citizenId: String,
  citizenName: String,
  citizenAvatar: String,
  assignedEntrepreneurId: String,
  assignedEntrepreneurName: String,
  assignedEntrepreneurAvatar: String,
  acceptedDate: String,
  solvedDate: String,
  citizenRating: Number,
  citizenFeedback: String,
});
export const ProblemModel = mongoose.model('Problem', problemSchema);
INNER_EOF

cat << 'INNER_EOF' > server/models/Chat.ts
import mongoose from 'mongoose';
const chatSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  problemId: String,
  senderId: String,
  senderName: String,
  senderRole: String,
  senderAvatar: String,
  content: String,
  imageUrl: String,
  fileUrl: String,
  fileName: String,
  timestamp: String,
  read: Boolean,
});
export const ChatModel = mongoose.model('ChatMessage', chatSchema);
INNER_EOF

cat << 'INNER_EOF' > server/models/Notification.ts
import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: String,
  type: String,
  title: String,
  message: String,
  timestamp: String,
  read: Boolean,
  linkId: String,
});
export const NotificationModel = mongoose.model('NotificationItem', notificationSchema);
INNER_EOF

# Keep apiRouter but route it internally to Controllers for proper MERN structure
cat << 'INNER_EOF' > server/routes/api.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import citizenRoutes from './citizenRoutes';
import entrepreneurRoutes from './entrepreneurRoutes';
import adminRoutes from './adminRoutes';
import chatRoutes from './chatRoutes';
import notificationRoutes from './notificationRoutes';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/citizen', citizenRoutes);
apiRouter.use('/entrepreneur', entrepreneurRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/chats', chatRoutes);
apiRouter.use('/notifications', notificationRoutes);

// Fallback for current frontend API calls that aren't prefixed
apiRouter.use('/', citizenRoutes); 
INNER_EOF

chmod +x setup_backend.sh
./setup_backend.sh
