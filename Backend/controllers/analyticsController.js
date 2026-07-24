const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const Report = require('../models/Report');
const Opportunity = require('../models/Opportunity');

const getOverview = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();
  const reports = await Report.countDocuments();
  const opportunities = await Opportunity.countDocuments();
  const completed = await Opportunity.countDocuments({ status: 'completed' });
  res.status(200).json({ success: true, data: { users, reports, opportunities, completed }, message: 'Overview retrieved' });
});

const getReportsByCategory = asyncHandler(async (req, res) => {
  const data = await Report.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.status(200).json({ success: true, data, message: 'Reports by category retrieved' });
});

const getDemandByRegion = asyncHandler(async (req, res) => {
  const data = await Opportunity.aggregate([
    { $group: { _id: '$demandLevel', count: { $sum: 1 } } }
  ]);
  res.status(200).json({ success: true, data, message: 'Demand by region retrieved' });
});

const getOpportunityTrends = asyncHandler(async (req, res) => {
  const data = await Opportunity.aggregate([
    { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  res.status(200).json({ success: true, data, message: 'Opportunity trends retrieved' });
});

const getPublicStats = asyncHandler(async (req, res) => {
  const totalReports = await Report.countDocuments();
  const totalOpportunities = await Opportunity.countDocuments();
  res.status(200).json({ success: true, data: { totalReports, totalOpportunities }, message: 'Public stats retrieved' });
});

module.exports = { getOverview, getReportsByCategory, getDemandByRegion, getOpportunityTrends, getPublicStats };
