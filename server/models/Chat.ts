import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  problemId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  message: string;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  read: boolean;
}

const ChatSchema = new Schema<IChat>(
  {
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    imageUrl: { type: String },
    fileUrl: { type: String },
    fileName: { type: String },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
