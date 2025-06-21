const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  food: String,
  calories: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diet', dietSchema);