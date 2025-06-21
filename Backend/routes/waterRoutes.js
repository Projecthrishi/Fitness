const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const Water = require('../models/Water');


// Add water intake
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const newWater = new Water({ userId: req.userId, amount });
    await newWater.save();
    res.status(201).json(newWater);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add water intake' });
  }
});

// Get water logs
router.get('/my', verifyToken, async (req, res) => {
  try {
    const waterLogs = await Water.find({ userId: req.userId }).sort({ date: -1 });
    res.json(waterLogs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch water logs' });
  }
});

module.exports = router;
