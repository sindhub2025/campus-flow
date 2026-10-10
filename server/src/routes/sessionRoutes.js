const express = require('express');
const { listSessions, createSession, updateSession, deleteSession } = require('../controllers/sessionController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', listSessions);
router.post('/', createSession);
router.patch('/:id', updateSession);
router.delete('/:id', deleteSession);

module.exports = router;
