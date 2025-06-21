const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const Tracker = require('../models/Tracker');
const Workout = require('../models/Workout');
const User = require('../models/user');
// Save diet
router.post('/diet', verifyToken, async (req, res) => {
  const { meal, calories } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  let tracker = await Tracker.findOne({ userId: req.userId, date: today });
  if (!tracker) {
    tracker = new Tracker({ userId: req.userId, date: today, meals: [], waterIntake: 0 });
  }

  tracker.meals.push({ meal, calories });
  await tracker.save();
  res.json(tracker);
});

// Save water
router.post('/water', verifyToken, async (req, res) => {
  const { amount } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  let tracker = await Tracker.findOne({ userId: req.userId, date: today });
  if (!tracker) {
    tracker = new Tracker({ userId: req.userId, date: today, meals: [], waterIntake: 0 });
  }

  tracker.waterIntake += amount;
  await tracker.save();
  res.json(tracker);
});

// Get today's data
router.get('/today', verifyToken, async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const tracker = await Tracker.findOne({ userId: req.userId, date: today });
  res.json(tracker || { meals: [], waterIntake: 0 });
});
// Delete meal by index
router.delete('/diet/:index', verifyToken, async (req, res) => {
  const index = parseInt(req.params.index);
  const today = new Date().toISOString().slice(0, 10);

  let tracker = await Tracker.findOne({ userId: req.userId, date: today });
  if (!tracker || !tracker.meals || index < 0 || index >= tracker.meals.length) {
    return res.status(404).json({ message: 'Meal not found' });
  }

  tracker.meals.splice(index, 1); // remove meal at index
  await tracker.save();
  res.json({ message: 'Meal deleted', meals: tracker.meals });
});
// Delete last water entry (e.g. remove 250ml)
router.delete('/water/remove', verifyToken, async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  let tracker = await Tracker.findOne({ userId: req.userId, date: today });

  if (!tracker || tracker.waterIntake <= 0) {
    return res.status(400).json({ message: 'No water to remove' });
  }

  tracker.waterIntake = Math.max(tracker.waterIntake - 250, 0);
  await tracker.save();

  res.json({ waterIntake: tracker.waterIntake });
});

// Get last 7 days diet/water data
// Get last 7 days diet/water data
// GET /summary/weekly
router.get('/summary/weekly', verifyToken, async (req, res) => {
  const today = new Date();
  const past7Days = new Date(today);
  past7Days.setDate(today.getDate() - 6);

  try {
    const records = await Tracker.find({
      userId: req.userId,
      date: {
        $gte: past7Days.toISOString().slice(0, 10),
        $lte: today.toISOString().slice(0, 10)
      }
    }).sort({ date: 1 });

    const result = records.map(r => ({
      date: r.date,
      meals: r.meals, // ✅ Needed for frontend
      totalCalories: r.meals.reduce((sum, m) => sum + Number(m.calories), 0), // ✅ match frontend key
      waterIntake: r.waterIntake // ✅ match frontend key
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load summary' });
  }
});


// Delete a tracker by date
router.delete('/delete/:date', verifyToken, async (req, res) => {
  const { date } = req.params;

  try {
    const deleted = await Tracker.findOneAndDelete({
      userId: req.userId,
      date: new Date(date).toISOString().slice(0, 10)
    });

    if (!deleted) return res.status(404).json({ message: 'No record found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete' });
  }
});

// Get total weekly workout calories
router.get('/summary/weekly/aggregate', verifyToken, async (req, res) => {
  const today = new Date();
  const past7Days = new Date(today);
  past7Days.setDate(today.getDate() - 6);

  try {
    const workouts = await Workout.find({
      userId: req.userId,
      date: {
        $gte: past7Days,
        $lte: today
      }
    });

    const totalBurned = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

    // Also get total diet calories
    const trackers = await Tracker.find({
      userId: req.userId,
      date: {
        $gte: past7Days.toISOString().slice(0, 10),
        $lte: today.toISOString().slice(0, 10)
      }
    });

    const totalIntake = trackers.reduce((sum, r) => {
      return sum + r.meals.reduce((mSum, m) => mSum + Number(m.calories), 0);
    }, 0);

    res.json({ totalBurned, totalIntake });
  } catch (err) {
    console.error('Aggregate summary error:', err);
    res.status(500).json({ message: 'Failed to load weekly totals' });
  }
});


router.patch('/update-weight', verifyToken, async (req, res) => {
  const { weight } = req.body;

  if (!weight || isNaN(weight)) {
    return res.status(400).json({ message: 'Invalid weight' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { weight },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error('Weight update error:', err);
    res.status(500).json({ message: 'Failed to update weight' });
  }
});

module.exports = router;
