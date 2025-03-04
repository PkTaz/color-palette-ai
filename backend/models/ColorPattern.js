const mongoose = require('mongoose');

const colorPatternSchema = new mongoose.Schema({
  colors: [[Number]],
  score: Number,
  context: String,
  industry: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ColorPattern', colorPatternSchema);