const mongoose = require('mongoose');
const { QUEUE_STATUS } = require('../config/constants');

const queueSchema = new mongoose.Schema({
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  position: { type: Number, required: true },
  status: { type: String, enum: Object.values(QUEUE_STATUS), default: QUEUE_STATUS.WAITING },
  applicationNote: { type: String },
  offeredAt: { type: Date },
  respondedAt: { type: Date },
  expiresAt: { type: Date }
}, { timestamps: true });

queueSchema.index({ opportunity: 1, entrepreneur: 1 }, { unique: true });

module.exports = mongoose.model('Queue', queueSchema);
