const asyncHandler = require('../utils/asyncHandler');
const Milestone = require('../models/Milestone');
const Opportunity = require('../models/Opportunity');
const { uploadImage } = require('../services/cloudinaryService');
const { createNotification } = require('../services/notificationService');

const createMilestone = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.opportunityId);
  if (!opportunity) return res.status(404).json({ success: false, message: 'Opportunity not found' });
  if (opportunity.claimedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const { title, description, targetDate, order } = req.body;
  const milestone = await Milestone.create({
    opportunity: opportunity._id,
    entrepreneur: req.user._id,
    title,
    description,
    targetDate,
    order: order || 0
  });

  res.status(201).json({ success: true, data: milestone, message: 'Milestone created' });
});

const getMilestones = asyncHandler(async (req, res) => {
  const milestones = await Milestone.find({ opportunity: req.params.opportunityId }).sort({ order: 1 });
  res.status(200).json({ success: true, data: milestones, message: 'Milestones retrieved' });
});

const updateMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findOneAndUpdate(
    { _id: req.params.id, entrepreneur: req.user._id },
    req.body,
    { new: true }
  );
  if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
  res.status(200).json({ success: true, data: milestone, message: 'Milestone updated' });
});

const completeMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findOne({ _id: req.params.id, entrepreneur: req.user._id });
  if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

  const evidence = [];
  if (req.files) {
    for (const file of req.files) {
      const result = await uploadImage(file.buffer, 'milestones');
      evidence.push(result.url);
    }
  }

  milestone.status = 'completed';
  milestone.completedDate = new Date();
  milestone.progressPercentage = 100;
  if (evidence.length > 0) milestone.evidence = evidence;
  await milestone.save();

  const allMilestones = await Milestone.find({ opportunity: milestone.opportunity });
  const allCompleted = allMilestones.every(m => m.status === 'completed');

  if (allCompleted) {
    const opportunity = await Opportunity.findById(milestone.opportunity);
    opportunity.status = 'completed';
    await opportunity.save();
    
    await createNotification({
      recipient: opportunity.createdBy,
      type: 'system',
      title: 'Opportunity Completed',
      message: 'All milestones for this opportunity have been completed.',
      data: { opportunityId: opportunity._id }
    });
  }

  res.status(200).json({ success: true, data: milestone, message: 'Milestone completed' });
});

module.exports = { createMilestone, getMilestones, updateMilestone, completeMilestone };
