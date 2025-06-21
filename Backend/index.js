const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const goalRoutes = require('./routes/goalRoutes');
const progressRoutes = require('./routes/progress');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/diet', require('./routes/dietRoutes'));
app.use('/api/water', require('./routes/waterRoutes'));
app.use('/api/trackers', trackerRoutes);
app.use('/api/user', goalRoutes);
app.use('/api/progress', progressRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

app.use('/api/auth', authRoutes);
app.use('/api/workouts', require('./routes/workoutRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
