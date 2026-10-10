const express = require('express');
const { getOverview, getWeekly, getSubjectBreakdown } = require('../controllers/analyticsController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/overview', getOverview);
router.get('/weekly', getWeekly);
router.get('/subjects', getSubjectBreakdown);

module.exports = router;
