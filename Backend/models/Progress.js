const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: String,
  date: { type: String }, // YYYY-MM-DD
  publicId: String        // for deleting from Cloudinary
});

module.exports = mongoose.model('Progress', progressSchema);
