const asyncHandler = require('../utils/asyncHandler');
const Opportunity = require('../models/Opportunity');

const getOpportunities = asyncHandler(async (req, res) => {
  const { businessCategory, demandLevel, status, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (businessCategory) filter.businessCategory = businessCategory;
  if (demandLevel) filter.demandLevel = demandLevel;
  if (status) filter.status = status;

  const opportunities = await Opportunity.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: opportunities, message: 'Opportunities retrieved' });
});

const getOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id)
    .populate('report', 'title description images upvoteCount')
    .populate('claimedBy', 'name avatar businessDetails');
  if (!opportunity) return res.status(404).json({ success: false, message: 'Opportunity not found' });
  res.status(200).json({ success: true, data: opportunity, message: 'Opportunity retrieved' });
});

const updateOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!opportunity) return res.status(404).json({ success: false, message: 'Opportunity not found' });
  res.status(200).json({ success: true, data: opportunity, message: 'Opportunity updated' });
});

const getOpportunitiesForMap = asyncHandler(async (req, res) => {
  const opportunities = await Opportunity.find().select('title location demandLevel businessCategory status');
  res.status(200).json({ success: true, data: opportunities, message: 'Map opportunities retrieved' });
});

const getHeatmapData = asyncHandler(async (req, res) => {
  const opportunities = await Opportunity.find().select('location demandScore');
  const data = opportunities.map(o => ({ coordinates: o.location.coordinates, weight: o.demandScore }));
  res.status(200).json({ success: true, data, message: 'Heatmap data retrieved' });
});

module.exports = { getOpportunities, getOpportunity, updateOpportunity, getOpportunitiesForMap, getHeatmapData };
