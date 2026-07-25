import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

export const initDatabase = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/problem_chain', {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('[DB] MongoDB connection error:', error);
  }
};
export default initDatabase;
