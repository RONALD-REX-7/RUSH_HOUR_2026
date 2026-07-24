const mongoose = require('mongoose');
const { OPPORTUNITY_STATUS, DEMAND_LEVELS, CATEGORIES } = require('../config/constants');

const opportunitySchema = new mongoose.Schema({
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  businessCategory: { type: String, enum: CATEGORIES, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  images: [{ type: String }],
  demandLevel: { type: String, enum: Object.values(DEMAND_LEVELS), required: true },
  demandScore: { type: Number, required: true },
  communityInfo: { type: Object },
  status: { type: String, enum: Object.values(OPPORTUNITY_STATUS), default: OPPORTUNITY_STATUS.OPEN },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimedAt: { type: Date },
  maxQueueSize: { type: Number, default: 6 },
  currentQueueSize: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

opportunitySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Opportunity', opportunitySchema);
