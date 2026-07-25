import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'citizen' | 'entrepreneur' | 'admin';
  profileImage?: string;
  address?: string;
  bio?: string;
  domain?: string;
  skills?: string[];
  rating?: number;
  completedJobs?: number;
  monthlyEarnings?: number;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    role: { type: String, enum: ['citizen', 'entrepreneur', 'admin'], default: 'citizen' },
    profileImage: { type: String },
    address: { type: String },
    bio: { type: String },
    domain: { type: String },
    skills: [{ type: String }],
    rating: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    monthlyEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
