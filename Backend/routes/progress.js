const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Progress = require('../models/Progress');
const verifyToken = require('../middlewares/authMiddleware');

// 🔧 Cloudinary config
cloudinary.config({
 cloud_name: 'duqdbbfbu',   // ✅ Your Cloudinary cloud name
  api_key: '129398262926817',
  api_secret: 'BqSFtFmPH-USUIo680QUEo50-jI'
});

// 🧾 Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'fitness-progress',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});
const upload = multer({ storage });

// 📤 Upload progress image
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const progress = new Progress({
      userId: req.userId,
      imageUrl: req.file.path,
      date: new Date().toISOString().slice(0, 10),
    });
    await progress.save();
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// 📥 Get all progress images of logged-in user
router.get('/my', verifyToken, async (req, res) => {
  try {
    const images = await Progress.find({ userId: req.userId }).sort({ date: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch images' });
  }
});

// ❌ Delete an image
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Progress.deleteOne({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
