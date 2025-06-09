const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  question:    { type: String, required: true },
  answer:      { type: String },
  image:       { type: String },
  category:    { type: String, default: 'general' },
  subcategory: { type: String, default: '' },    // ← new
  done:        { type: Boolean, default: false },
  perfected:   { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', FlashcardSchema);