const asyncHandler = require('../utils/asyncHandler');
const Report = require('../models/Report');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');
const { REPORT_STATUS, OPPORTUNITY_STATUS, NOTIFICATION_TYPES } = require('../config/constants');

const getPendingReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ status: { $in: [REPORT_STATUS.PENDING, REPORT_STATUS.AI_ANALYZED] } }).populate('citizen', 'name');
  res.status(200).json({ success: true, data: reports, message: 'Pending reports retrieved' });
});

const verifyReport = asyncHandler(async (req, res) => {
  const { decision, comments } = req.body;
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
  
  report.adminReview = { decision, comments, reviewedBy: req.user._id, reviewedAt: new Date() };
  report.status = decision === 'approved' ? REPORT_STATUS.VERIFIED : REPORT_STATUS.REJECTED;
  await report.save();

  await createNotification({
    recipient: report.citizen,
    type: NOTIFICATION_TYPES.REPORT_STATUS,
    title: 'Report Reviewed',
    message: `Your report has been ${decision}.`,
    data: { reportId: report._id }
  });

  res.status(200).json({ success: true, data: report, message: 'Report verified' });
});

const convertToOpportunity = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report || report.status !== REPORT_STATUS.VERIFIED) {
    return res.status(400).json({ success: false, message: 'Report must be verified to convert' });
  }

  const { title, description, businessCategory, demandLevel, demandScore, maxQueueSize } = req.body;

  const opportunity = await Opportunity.create({
    report: report._id,
    title: title || report.title,
    description: description || report.description,
    businessCategory: businessCategory || report.category,
    location: report.location,
    images: report.images,
    demandLevel: demandLevel || 'medium',
    demandScore: demandScore || 50,
    maxQueueSize: maxQueueSize || 6,
    createdBy: req.user._id
  });

  report.status = REPORT_STATUS.CONVERTED;
  await report.save();

  await createNotification({
    recipient: report.citizen,
    type: NOTIFICATION_TYPES.OPPORTUNITY_NEW,
    title: 'Report Converted to Opportunity',
    message: 'Your report has been converted to a business opportunity!',
    data: { opportunityId: opportunity._id, reportId: report._id }
  });

  res.status(201).json({ success: true, data: opportunity, message: 'Converted to opportunity' });
});

const getUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 10 } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.status(200).json({ success: true, data: users, message: 'Users retrieved' });
});

const updateUser = asyncHandler(async (req, res) => {
  const { role, isVerified, isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
  if (role) user.role = role;
  if (isVerified !== undefined) user.isVerified = isVerified;
  if (isActive !== undefined) user.isActive = isActive;
  await user.save();
  
  res.status(200).json({ success: true, data: user, message: 'User updated' });
});

const getDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalReports = await Report.countDocuments();
  const totalOpportunities = await Opportunity.countDocuments();
  
  res.status(200).json({
    success: true,
    data: { totalUsers, totalReports, totalOpportunities },
    message: 'Dashboard stats retrieved'
  });
});

module.exports = { getPendingReports, verifyReport, convertToOpportunity, getUsers, updateUser, getDashboard };
