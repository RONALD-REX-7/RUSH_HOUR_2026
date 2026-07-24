const asyncHandler = require('../utils/asyncHandler');
const Queue = require('../models/Queue');
const Opportunity = require('../models/Opportunity');
const { createNotification } = require('../services/notificationService');
const { QUEUE_STATUS, OPPORTUNITY_STATUS, NOTIFICATION_TYPES } = require('../config/constants');

const joinQueue = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.opportunityId);
  if (!opportunity) return res.status(404).json({ success: false, message: 'Opportunity not found' });
  if (![OPPORTUNITY_STATUS.OPEN, OPPORTUNITY_STATUS.IN_QUEUE].includes(opportunity.status)) {
    return res.status(400).json({ success: false, message: 'Opportunity is not open for queuing' });
  }
  if (opportunity.currentQueueSize >= opportunity.maxQueueSize) {
    return res.status(400).json({ success: false, message: 'Queue is full' });
  }
  
  const existingQueue = await Queue.findOne({ opportunity: opportunity._id, entrepreneur: req.user._id });
  if (existingQueue) {
    return res.status(400).json({ success: false, message: 'You are already in the queue' });
  }

  const position = opportunity.currentQueueSize + 1;
  const queue = await Queue.create({
    opportunity: opportunity._id,
    entrepreneur: req.user._id,
    position,
    applicationNote: req.body.applicationNote
  });

  opportunity.currentQueueSize += 1;
  opportunity.status = OPPORTUNITY_STATUS.IN_QUEUE;
  await opportunity.save();

  await createNotification({
    recipient: req.user._id,
    type: NOTIFICATION_TYPES.QUEUE_UPDATE,
    title: 'Joined Queue',
    message: `You are position ${position} in the queue.`,
    data: { opportunityId: opportunity._id, queueId: queue._id }
  });

  res.status(201).json({ success: true, data: queue, message: 'Joined queue successfully' });
});

const getQueue = asyncHandler(async (req, res) => {
  const queues = await Queue.find({ opportunity: req.params.opportunityId })
    .populate('entrepreneur', 'name businessDetails avatar')
    .sort({ position: 1 });
  res.status(200).json({ success: true, data: queues, message: 'Queue retrieved' });
});

const getMyQueues = asyncHandler(async (req, res) => {
  const queues = await Queue.find({ entrepreneur: req.user._id }).populate('opportunity', 'title status');
  res.status(200).json({ success: true, data: queues, message: 'My queues retrieved' });
});

const acceptOpportunity = asyncHandler(async (req, res) => {
  const queue = await Queue.findById(req.params.id).populate('opportunity');
  if (!queue) return res.status(404).json({ success: false, message: 'Queue entry not found' });
  
  if (queue.entrepreneur.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  queue.status = QUEUE_STATUS.ACCEPTED;
  queue.respondedAt = new Date();
  await queue.save();

  const opportunity = await Opportunity.findById(queue.opportunity._id);
  opportunity.status = OPPORTUNITY_STATUS.CLAIMED;
  opportunity.claimedBy = req.user._id;
  opportunity.claimedAt = new Date();
  await opportunity.save();

  await Queue.updateMany(
    { opportunity: opportunity._id, _id: { $ne: queue._id } },
    { $set: { status: QUEUE_STATUS.DECLINED } }
  );

  res.status(200).json({ success: true, data: queue, message: 'Opportunity accepted' });
});

const declineOpportunity = asyncHandler(async (req, res) => {
  const queue = await Queue.findById(req.params.id);
  if (!queue) return res.status(404).json({ success: false, message: 'Queue entry not found' });
  
  queue.status = QUEUE_STATUS.DECLINED;
  queue.respondedAt = new Date();
  await queue.save();

  res.status(200).json({ success: true, data: queue, message: 'Opportunity declined' });
});

const leaveQueue = asyncHandler(async (req, res) => {
  const queue = await Queue.findOneAndDelete({ _id: req.params.id, entrepreneur: req.user._id });
  if (!queue) return res.status(404).json({ success: false, message: 'Queue entry not found' });
  
  const opportunity = await Opportunity.findById(queue.opportunity);
  opportunity.currentQueueSize -= 1;
  if (opportunity.currentQueueSize === 0) {
    opportunity.status = OPPORTUNITY_STATUS.OPEN;
  }
  await opportunity.save();
  
  res.status(200).json({ success: true, message: 'Left queue successfully' });
});

module.exports = { joinQueue, getQueue, getMyQueues, acceptOpportunity, declineOpportunity, leaveQueue };
