import mongoose, { Document, Schema } from 'mongoose';

export interface IProblem extends Document {
  title: string;
  description: string;
  category: string;
  priority: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: string[];
  status: 'Pending' | 'In Progress' | 'Solved' | 'Accepted';
  citizenId: mongoose.Types.ObjectId;
  entrepreneurId?: mongoose.Types.ObjectId;
  assignedBy?: mongoose.Types.ObjectId;
  citizenRating?: number;
  citizenFeedback?: string;
  dateSubmitted?: Date;
  acceptedDate?: Date;
  solvedDate?: Date;
}

const ProblemSchema = new Schema<IProblem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, required: true },
    location: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    images: [{ type: String }],
    status: { type: String, enum: ['Pending', 'In Progress', 'Solved', 'Accepted'], default: 'Pending' },
    citizenId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    entrepreneurId: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    citizenRating: { type: Number },
    citizenFeedback: { type: String },
    dateSubmitted: { type: Date, default: Date.now },
    acceptedDate: { type: Date },
    solvedDate: { type: Date }
  },
  { timestamps: true }
);

export const Problem = mongoose.model<IProblem>('Problem', ProblemSchema);
