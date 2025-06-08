require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const flashcardRoutes = require('./routes/flashcards');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/flashcards', flashcardRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
