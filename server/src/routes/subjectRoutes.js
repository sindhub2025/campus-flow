const express = require('express');
const { listSubjects, createSubject, getSubjectById, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', listSubjects);
router.post('/', createSubject);
router.get('/:id', getSubjectById);
router.patch('/:id', updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router;
