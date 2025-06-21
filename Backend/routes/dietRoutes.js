// routes/dietRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const Diet = require('../models/Diet'); // create this model

// Save diet/water entry
router.post('/diet', verifyToken, async (req, res) => {
  const { meal, calories } = req.body;

  if (!meal || !calories) {
    return res.status(400).json({ message: 'Meal and calories are required' });
  }

  const today = new Date().toISOString().slice(0, 10);

  let tracker = await Tracker.findOne({ userId: req.userId, date: today });
  if (!tracker) {
    tracker = new Tracker({ userId: req.userId, date: today, meals: [], waterIntake: 0 });
  }

  tracker.meals.push({ meal, calories: Number(calories) });
  await tracker.save();

  res.json(tracker);
});
// Get saved data
router.get('/my', verifyToken, async (req, res) => {
  try {
    const data = await Diet.findOne({ userId: req.userId });
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ message: 'Failed to load data' });
  }
});

module.exports = router;
