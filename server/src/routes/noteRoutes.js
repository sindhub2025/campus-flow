const express = require('express');
const { listNotes, createNote, getNoteById, updateNote, deleteNote } = require('../controllers/noteController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', listNotes);
router.post('/', createNote);
router.get('/:id', getNoteById);
router.patch('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
