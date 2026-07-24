const express = require('express');
const { getOverview, getReportsByCategory, getDemandByRegion, getOpportunityTrends, getPublicStats } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/overview', getOverview);
router.get('/reports-by-category', getReportsByCategory);
router.get('/demand-by-region', getDemandByRegion);
router.get('/opportunity-trends', getOpportunityTrends);
router.get('/public-stats', getPublicStats);

module.exports = router;
