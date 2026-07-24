import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  getUsers,
  getUserById,
  getProblems,
  saveProblem,
  deleteProblemById,
  getChats,
  saveChatMessage,
  getNotifications,
  markNotificationRead,
  markAllNotificationsReadForUser,
  addNotification,
  getDbStatus,
} from '../db';
import { User, Role, Problem, ChatMessage, NotificationItem } from '../../src/types';

export const apiRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'problemchain_default_jwt_secret_key';

// JWT Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // allow optional auth or handle in routes
  }

  jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
    if (!err && decoded && decoded.id) {
      const user = await getUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
    next();
  });
}

apiRouter.use(authenticateToken);

// Health check endpoint
apiRouter.get('/health', (req: Request, res: Response) => {
  const status = getDbStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: status,
  });
});

// Auth Login endpoint
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  const { role, email } = req.body as { role: Role; email?: string };
  const allUsers = await getUsers();

  let matchedUser = allUsers.find((u) => u.role === role);
  if (email) {
    const foundByEmail = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundByEmail) matchedUser = foundByEmail;
  }

  if (!matchedUser) {
    matchedUser = allUsers[0];
  }

  const token = jwt.sign(
    { id: matchedUser.id, role: matchedUser.role, email: matchedUser.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: matchedUser,
  });
});

// Current user profile
apiRouter.get('/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ user: req.user });
});

// GET all users/entrepreneurs
apiRouter.get('/users', async (req: Request, res: Response) => {
  const users = await getUsers();
  res.json(users);
});

apiRouter.get('/entrepreneurs', async (req: Request, res: Response) => {
  const users = await getUsers();
  const entrepreneurs = users.filter((u) => u.role === 'entrepreneur');
  res.json(entrepreneurs);
});

// PROBLEMS REST APIs
apiRouter.get('/problems', async (req: Request, res: Response) => {
  const problems = await getProblems();
  res.json(problems);
});

apiRouter.post('/problems', async (req: Request, res: Response) => {
  const problemData = req.body as Partial<Problem>;
  const newProblem: Problem = {
    id: `PRB-${Math.floor(100 + Math.random() * 900)}`,
    title: problemData.title || 'Untitled Report',
    category: problemData.category || 'Roads',
    description: problemData.description || '',
    location: problemData.location || 'City Center',
    coordinates: problemData.coordinates || { lat: 12.9716, lng: 77.5946 },
    images: problemData.images || ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'],
    priority: problemData.priority || 'Medium',
    status: 'Pending',
    dateSubmitted: new Date().toISOString(),
    citizenId: problemData.citizenId || 'usr-citizen-1',
    citizenName: problemData.citizenName || 'Citizen User',
    citizenAvatar: problemData.citizenAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  };

  await saveProblem(newProblem);

  // Notify admin
  await addNotification({
    id: `notif-${Date.now()}`,
    userId: 'usr-admin-1',
    type: 'problem_submitted',
    title: 'New Problem Reported',
    message: `"${newProblem.title}" reported in ${newProblem.category}.`,
    timestamp: new Date().toISOString(),
    read: false,
    linkId: newProblem.id,
  });

  res.status(201).json(newProblem);
});

apiRouter.put('/problems/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const problems = await getProblems();
  const existing = problems.find((p) => p.id === id);

  if (!existing) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  const updated: Problem = {
    ...existing,
    ...req.body,
  };

  await saveProblem(updated);
  res.json(updated);
});

apiRouter.delete('/problems/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteProblemById(id);
  res.json({ success: true, message: `Problem ${id} deleted` });
});

// Assign entrepreneur
apiRouter.post('/problems/:id/assign', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { entrepreneurId } = req.body;

  const users = await getUsers();
  const entrepreneur = users.find((u) => u.id === entrepreneurId);
  const problems = await getProblems();
  const problem = problems.find((p) => p.id === id);

  if (!problem || !entrepreneur) {
    return res.status(400).json({ error: 'Invalid problem or entrepreneur ID' });
  }

  const updated: Problem = {
    ...problem,
    status: 'In Progress',
    assignedEntrepreneurId: entrepreneur.id,
    assignedEntrepreneurName: entrepreneur.name,
    assignedEntrepreneurAvatar: entrepreneur.avatar,
    acceptedDate: new Date().toISOString(),
  };

  await saveProblem(updated);

  // Send notifications
  await addNotification({
    id: `notif-${Date.now()}-1`,
    userId: entrepreneur.id,
    type: 'problem_assigned',
    title: 'New Contract Assigned',
    message: `You have been assigned to solve "${problem.title}".`,
    timestamp: new Date().toISOString(),
    read: false,
    linkId: problem.id,
  });

  res.json(updated);
});

// Submit Rating
apiRouter.post('/problems/:id/rating', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, feedback } = req.body;

  const problems = await getProblems();
  const problem = problems.find((p) => p.id === id);

  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  const updated: Problem = {
    ...problem,
    citizenRating: rating,
    citizenFeedback: feedback,
  };

  await saveProblem(updated);
  res.json(updated);
});

// CHATS REST APIs
apiRouter.get('/chats', async (req: Request, res: Response) => {
  const chats = await getChats();
  res.json(chats);
});

apiRouter.post('/chats', async (req: Request, res: Response) => {
  const messageData = req.body as Partial<ChatMessage>;

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    problemId: messageData.problemId || '',
    senderId: messageData.senderId || 'usr-1',
    senderName: messageData.senderName || 'Anonymous',
    senderRole: messageData.senderRole || 'citizen',
    senderAvatar: messageData.senderAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    content: messageData.content || '',
    imageUrl: messageData.imageUrl,
    fileUrl: messageData.fileUrl,
    fileName: messageData.fileName,
    timestamp: new Date().toISOString(),
    read: false,
  };

  await saveChatMessage(newMessage);
  res.status(201).json(newMessage);
});

// NOTIFICATIONS REST APIs
apiRouter.get('/notifications', async (req: Request, res: Response) => {
  const notifs = await getNotifications();
  res.json(notifs);
});

apiRouter.put('/notifications/:id/read', async (req: Request, res: Response) => {
  const { id } = req.params;
  await markNotificationRead(id);
  res.json({ success: true });
});

apiRouter.put('/notifications/user/:userId/read-all', async (req: Request, res: Response) => {
  const { userId } = req.params;
  await markAllNotificationsReadForUser(userId);
  res.json({ success: true });
});
