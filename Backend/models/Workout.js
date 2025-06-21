const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  completed: { type: Boolean, default: false },caloriesBurned: {
  type: Number,
  default: 0,
}

});

module.exports = mongoose.model('Workout', workoutSchema);
