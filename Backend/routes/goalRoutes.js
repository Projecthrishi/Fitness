const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const User = require('../models/user'); // 🆕


router.get('/goals', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('goal');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date().toISOString().slice(0, 10);
    if (user.goal?.goalDate !== today) {
      return res.json(null); // No goals for today
    }

    res.json(user.goal);
  } catch (err) {
    console.error('Fetch goal error:', err);
    res.status(500).json({ message: 'Failed to fetch goals' });
  }
});


router.patch('/update-goals', verifyToken, async (req, res) => {
  const { dailyDuration, dailyCalories, weeklyWater, dailyIntake } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.goal.dailyDuration = dailyDuration ?? user.goal.dailyDuration;
    user.goal.dailyCalories = dailyCalories ?? user.goal.dailyCalories;
   
    user.goal.dailyIntake = dailyIntake ?? user.goal.dailyIntake; // ✅ new
    user.goal.goalDate = today;

    await user.save();
    res.json({ message: 'Goals updated successfully', goal: user.goal });
  } catch (err) {
    console.error('Update goal error:', err);
    res.status(500).json({ message: 'Failed to update goals' });
  }
});


// DELETE user goals
router.delete('/goals', verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $unset: { goal: "" } }, // 🛠 unset the entire goal object
      { new: true }
    ).select('-password');

    res.json({ message: 'Goals deleted', user: updatedUser });
  } catch (err) {
    console.error('Failed to delete goals:', err);
    res.status(500).json({ message: 'Failed to delete goals' });
  }
});



module.exports = router;