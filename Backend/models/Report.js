const mongoose = require('mongoose');
const { REPORT_STATUS, CATEGORIES } = require('../config/constants');

const reportSchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: CATEGORIES, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  images: [{ type: String }],
  evidence: { type: String },
  status: { type: String, enum: Object.values(REPORT_STATUS), default: REPORT_STATUS.PENDING },
  aiAnalysis: { type: Object },
  adminReview: { type: Object },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  upvoteCount: { type: Number, default: 0 }
}, { timestamps: true });

reportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Report', reportSchema);
