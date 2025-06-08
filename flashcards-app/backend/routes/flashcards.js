const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const Flashcard = require('../models/Flashcard');

const router = express.Router();
const upload = multer();

// GET all flashcards
router.get('/', async (req, res) => {
  const cards = await Flashcard.find().sort({ createdAt: -1 });
  res.json(cards);
});

// POST new flashcard
router.post('/', async (req, res) => {
  const card = new Flashcard(req.body);
  await card.save();
  res.status(201).json(card);
});

// PUT update card
router.put('/:id', async (req, res) => {
  const card = await Flashcard.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(card);
});

// DELETE a card
router.delete('/:id', async (req, res) => {
  await Flashcard.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// POST upload XLSX to import cards
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    // skip blank rows and header heuristics as in your script...
    const data = rows
      .filter(r => r.some(c => c !== '' && c != null))
      .slice(1)
      .map(([q, a]) => ({ question: q, answer: a }));
    Flashcard.insertMany(data).then(docs => res.json(docs));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
