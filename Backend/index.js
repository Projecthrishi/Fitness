const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const goalRoutes = require('./routes/goalRoutes');
const progressRoutes = require('./routes/progress');
const dietRoutes = require('./routes/dietRoutes');
const waterRoutes = require('./routes/waterRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

const app = express();

// === CORS Setup ===
const allowedOrigins = [
  'http://localhost:3000',                          // local dev
  'https://fitness-front-ji0y.onrender.com',          // example deployed frontend (change this!)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman, curl, etc.

    const trimmedOrigin = origin.trim().toLowerCase();
    const allowed = allowedOrigins.map(o => o.trim().toLowerCase());

    if (allowed.includes(trimmedOrigin)) {
      return callback(null, true);
    } else {
      return callback(new Error('❌ Not allowed by CORS'), false);
    }
  },
  credentials: true
}));

app.use(express.json());

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/trackers', trackerRoutes);
app.use('/api/user', goalRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/workouts', workoutRoutes);

// === MongoDB Connection ===
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
