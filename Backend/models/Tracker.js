const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  meal: { type: String, required: true },
  calories: { type: Number, required: true }
});

const trackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date: {
    type: String, // or Date if you prefer
    required: true
  },
  meals: [mealSchema],  // 👈 THIS IS IMPORTANT
  waterIntake: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Tracker', trackerSchema);
