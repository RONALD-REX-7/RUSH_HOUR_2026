const express = require('express');
const { joinQueue, getQueue, getMyQueues, acceptOpportunity, declineOpportunity, leaveQueue } = require('../controllers/queueController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { queueJoinSchema } = require('../utils/validators');

const router = express.Router();

router.use(protect);

router.get('/my', authorize('entrepreneur'), getMyQueues);
router.post('/opportunity/:opportunityId/join', authorize('entrepreneur'), validate(queueJoinSchema), joinQueue);
router.get('/opportunity/:opportunityId', getQueue);

router.put('/:id/accept', authorize('entrepreneur'), acceptOpportunity);
router.put('/:id/decline', authorize('entrepreneur'), declineOpportunity);
router.delete('/:id/leave', authorize('entrepreneur'), leaveQueue);

module.exports = router;
