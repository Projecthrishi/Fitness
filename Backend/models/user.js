const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  weight: { type: Number, default: 70 } ,
  // 🆕 Add weight with default
   goal: {
    dailyDuration: { type: Number, default: 30 },  // in minutes
    dailyCalories: { type: Number, default: 300 }, // in kcal
      dailyIntake: { type: Number, default: 1800 } ,
     goalDate: { type: String } 
  }
});

module.exports = mongoose.model('User', userSchema);
