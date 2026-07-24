const express = require('express');
const { getPendingReports, verifyReport, convertToOpportunity, getUsers, updateUser, getDashboard } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/reports/pending', getPendingReports);
router.put('/reports/:id/verify', verifyReport);
router.post('/reports/:id/convert', convertToOpportunity);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/dashboard', getDashboard);

module.exports = router;
