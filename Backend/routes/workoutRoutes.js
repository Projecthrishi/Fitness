const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const verifyToken = require('../middlewares/authMiddleware');
const User = require('../models/user'); // 🆕

// Add workout
// Add workout
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { title, duration } = req.body;

    if (!title || !duration) {
      return res.status(400).json({ message: 'Title and duration are required' });
    }

    const parsedDuration = Number(duration);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      return res.status(400).json({ message: 'Invalid duration' });
    }

    // 🆕 Fetch user's weight
    const user = await User.findById(req.userId);
    const weightKg = user?.weight || 70; // fallback if not set

    const MET = 8; // avg MET value
    const hours = parsedDuration / 60;
    const calories = Math.round(MET * weightKg * hours);

    const newWorkout = new Workout({
      userId: req.userId,
      title,
      duration: parsedDuration,
      completed: false,
      caloriesBurned: calories
    });

    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error('Workout add error:', err);
    res.status(500).json({ message: 'Failed to add workout' });
  }
});

// Get workouts
router.get('/my', verifyToken, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get workouts' });
  }
});

// Delete workout
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Workout.deleteOne({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete workout' });
  }
});

// ✅ Toggle completion
router.patch('/toggle/:id', verifyToken, async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.userId });
    if (!workout) return res.status(404).send('Workout not found');

    workout.completed = !workout.completed;
    await workout.save();
    res.json(workout);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
// Get today's workout summary
router.get('/summary/today', verifyToken, async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  try {
   const workouts = await Workout.find({
  userId: req.userId,
  completed: true,  // ✅ Only include completed workouts
  date: {
    $gte: new Date(today),
    $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
  }
});

    const totalDuration = workouts.reduce((sum, w) => sum + Number(w.duration), 0);
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

    res.json({ totalDuration, totalCalories });
  } catch (err) {
    console.error('Workout summary error:', err);
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
});




module.exports = router;
