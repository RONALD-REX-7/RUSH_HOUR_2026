const express = require('express');
const { createMilestone, getMilestones, updateMilestone, completeMilestone } = require('../controllers/milestoneController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { milestoneSchema } = require('../utils/validators');

const router = express.Router();

router.get('/opportunity/:opportunityId', getMilestones);
router.post('/opportunity/:opportunityId', protect, validate(milestoneSchema), createMilestone);

router.put('/:id', protect, updateMilestone);
router.put('/:id/complete', protect, upload.array('evidence', 5), completeMilestone);

module.exports = router;
