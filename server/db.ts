import mongoose from 'mongoose';
import { mockUsers, mockProblems, mockChats, mockNotifications, mockEntrepreneurPerformances } from '../src/data/mockData';
import { User, Problem, ChatMessage, NotificationItem } from '../src/types';

// Mongoose Schemas
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
});

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

export const UserModel = mongoose.models.UserStore || mongoose.model('UserStore', userSchema);
export const ProblemModel = mongoose.model('Problem', problemSchema);
export const ChatModel = mongoose.model('ChatMessage', chatSchema);
export const NotificationModel = mongoose.model('NotificationItem', notificationSchema);

// Memory fallback store if MongoDB is not connected
let isMongoConnected = false;
let memoryUsers: User[] = [...mockUsers];
let memoryProblems: Problem[] = [...mockProblems];
let memoryChats: ChatMessage[] = [...mockChats];
let memoryNotifications: NotificationItem[] = [...mockNotifications];

export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('[DB] MONGODB_URI not set. Running with memory store.');
    return;
  }

  try {
    console.log('[DB] Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log('[DB] Successfully connected to MongoDB!');

    // Seed if empty
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('[DB] Seeding initial mock users to MongoDB...');
      await UserModel.insertMany(mockUsers);
    }

    const problemCount = await ProblemModel.countDocuments();
    if (problemCount === 0) {
      console.log('[DB] Seeding initial mock problems to MongoDB...');
      await ProblemModel.insertMany(mockProblems);
    }

    const chatCount = await ChatModel.countDocuments();
    if (chatCount === 0) {
      console.log('[DB] Seeding initial mock chats to MongoDB...');
      await ChatModel.insertMany(mockChats);
    }

    const notifCount = await NotificationModel.countDocuments();
    if (notifCount === 0) {
      console.log('[DB] Seeding initial mock notifications to MongoDB...');
      await NotificationModel.insertMany(mockNotifications);
    }
  } catch (err) {
    console.warn('[DB] Could not connect to MongoDB. Falling back to memory store:', (err as Error).message);
    isMongoConnected = false;
  }
}

export function getDbStatus() {
  return { connected: isMongoConnected, mode: isMongoConnected ? 'MongoDB' : 'Memory Store' };
}

// DB Data Access Methods
export async function getUsers() {
  if (isMongoConnected) {
    const docs = await UserModel.find().lean();
    return docs as unknown as User[];
  }
  return memoryUsers;
}

export async function getUserById(id: string) {
  if (isMongoConnected) {
    const doc = await UserModel.findOne({ id }).lean();
    return doc as unknown as User | null;
  }
  return memoryUsers.find((u) => u.id === id) || null;
}

export async function getProblems() {
  if (isMongoConnected) {
    const docs = await ProblemModel.find().lean();
    return docs as unknown as Problem[];
  }
  return memoryProblems;
}

export async function saveProblem(problem: Problem) {
  if (isMongoConnected) {
    await ProblemModel.updateOne({ id: problem.id }, problem, { upsert: true });
    return problem;
  }
  const idx = memoryProblems.findIndex((p) => p.id === problem.id);
  if (idx >= 0) {
    memoryProblems[idx] = problem;
  } else {
    memoryProblems.unshift(problem);
  }
  return problem;
}

export async function deleteProblemById(id: string) {
  if (isMongoConnected) {
    await ProblemModel.deleteOne({ id });
    return true;
  }
  memoryProblems = memoryProblems.filter((p) => p.id !== id);
  return true;
}

export async function getChats() {
  if (isMongoConnected) {
    const docs = await ChatModel.find().lean();
    return docs as unknown as ChatMessage[];
  }
  return memoryChats;
}

export async function saveChatMessage(chat: ChatMessage) {
  if (isMongoConnected) {
    await ChatModel.create(chat);
    return chat;
  }
  memoryChats.push(chat);
  return chat;
}

export async function getNotifications() {
  if (isMongoConnected) {
    const docs = await NotificationModel.find().lean();
    return docs as unknown as NotificationItem[];
  }
  return memoryNotifications;
}

export async function markNotificationRead(id: string) {
  if (isMongoConnected) {
    await NotificationModel.updateOne({ id }, { read: true });
    return true;
  }
  memoryNotifications = memoryNotifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  return true;
}

export async function markAllNotificationsReadForUser(userId: string) {
  if (isMongoConnected) {
    await NotificationModel.updateMany({ userId }, { read: true });
    return true;
  }
  memoryNotifications = memoryNotifications.map((n) => (n.userId === userId ? { ...n, read: true } : n));
  return true;
}

export async function addNotification(notif: NotificationItem) {
  if (isMongoConnected) {
    await NotificationModel.create(notif);
    return notif;
  }
  memoryNotifications.unshift(notif);
  return notif;
}
