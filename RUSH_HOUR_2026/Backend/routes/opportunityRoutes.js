const express = require('express');
const { getOpportunities, getOpportunity, updateOpportunity, getOpportunitiesForMap, getHeatmapData } = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/map', getOpportunitiesForMap);
router.get('/heatmap', getHeatmapData);
router.route('/')
  .get(getOpportunities);

router.route('/:id')
  .get(getOpportunity)
  .put(protect, authorize('admin'), updateOpportunity);

module.exports = router;
