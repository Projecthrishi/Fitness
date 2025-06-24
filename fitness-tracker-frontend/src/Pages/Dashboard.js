import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState({ caloriesBurned: 0, duration: 0 });
  const [userGoals, setUserGoals] = useState(null);
  const [todayDiet, setTodayDiet] = useState({ meals: [], waterIntake: 0 });
  const [alerts, setAlerts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch user
      api.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, { headers })
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          navigate('/login');
        });

      // Fetch workout summary
      api.get(`${process.env.REACT_APP_API_URL}/api/workouts/summary/today`, { headers })
        .then(res => {
          const summary = {
            caloriesBurned: res.data.totalCalories,
            duration: res.data.totalDuration
          };
          setTodayWorkout(summary);
        })
        .catch(err => console.error('Workout summary error:', err));

      // Fetch user goals
      api.get(`${process.env.REACT_APP_API_URL}/api/user/goals`, { headers })
        .then(res => setUserGoals(res.data))
        .catch(() => setUserGoals(null));

      // Fetch today’s diet/water log
      api.get(`${process.env.REACT_APP_API_URL}/api/trackers/today`, { headers })
        .then(res => {
          const diet = res.data || { meals: [], waterIntake: 0 };
          setTodayDiet(diet);
        })
        .catch(() => setTodayDiet({ meals: [], waterIntake: 0 }));
    }
  }, [navigate]);

  // Smart Reminders Logic
  useEffect(() => {
    const newAlerts = [];

   

  if (userGoals) {
  const burned = Number(todayWorkout.caloriesBurned || 0);
  const workoutGoal = Number(userGoals.dailyCalories || 0);
  const duration = Number(todayWorkout.duration || 0);
  const durationGoal = Number(userGoals.dailyDuration || 0);

  const workoutNotDone = burned === 0 && duration === 0;

  if (workoutNotDone) {
    newAlerts.push(`🚫 You haven't done any workout today! Time to get moving!`);
  } else {
    if (burned < workoutGoal) {
      newAlerts.push(`🔥 You burned only ${burned} kcal. Goal: ${workoutGoal} kcal.`);
    }
    if (duration < durationGoal) {
      newAlerts.push(`⏱️ You worked out only ${duration} min. Goal: ${durationGoal} min.`);
    }
  }

  // Meal reminder
  if ((todayDiet.meals || []).length === 0) {
    newAlerts.push(`🍱 You haven't logged any meals today.`);
  }

  // Water reminder
  const waterLogged = Number(todayDiet.waterIntake || 0);
  const waterGoal = Number(userGoals.dailyIntake || 0);

  if (waterGoal > 0) {
    if (waterLogged === 0) {
      newAlerts.push(`💧 No water intake logged today. Goal: ${waterGoal} ml.`);
    } else if (waterLogged < waterGoal) {
      const remaining = waterGoal - waterLogged;
      newAlerts.push(`💧 Drink ${remaining} ml more to meet your water goal of ${waterGoal} ml.`);
    }
  }
}


  setAlerts(newAlerts);
}, [todayWorkout, todayDiet, userGoals]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
  <motion.div
    className="min-vh-100 d-flex flex-column justify-content-start align-items-center"
    style={{
    backgroundImage: "url('https://images.unsplash.com/photo-1605296867304-46d5465a13f1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3ltJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')",
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',      // ✅ makes it full screen height
    width: '100vw',          // ✅ ensures full width
  }}
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {/* Overlay */}
    <div className="w-100 h-100 bg-dark bg-opacity-50 py-5 px-3">
      {/* 🔓 Logout Button */}
      <div className="position-absolute top-0 end-0 mt-3 me-3">
        <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
          🔓 Logout
        </button>
      </div>

      {/* 👤 Header Section */}
      <div className="text-center text-white mb-4">
        <h2>Welcome, {user ? user.name : '...'}</h2>
        <p className="lead">Your fitness dashboard</p>
        <p>
          Your Weight: <strong>{user?.weight || '...'} kg</strong>
          <Link to="/edit-weight" className="btn btn-sm btn-outline-light ms-3">
            Edit
          </Link>
        </p>

        {/* 📂 Navigation Buttons */}
       <div className="mt-4 d-flex flex-column flex-md-row justify-content-center gap-3 flex-wrap">
  {[
    { to: "/workouts", label: "🏃‍♂️ My Workouts" },
    { to: "/diet-water", label: "🍱 Track Diet & 💧 Water" },
    { to: "/summary", label: "📅 Weekly Summary" },
    { to: "/charts", label: "📈 Charts" },
    { to: "/goals", label: "🎯 Set Goals" },
    { to: "/progress", label: "📷 Progress Gallery" }
  ].map((btn, i) => (
    <Link
  to={btn.to}
  key={i}
  className="btn btn-gradient text-white px-4 py-2 rounded-pill shadow-sm"
  style={{
    background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
    border: 'none'
  }}
>
  {btn.label}
</Link>

  ))}
</div>

      </div>

      {/* 🔔 Alerts */}
      {alerts.length > 0 && (
        <div className="alert alert-warning shadow-lg">
          <h5 className="mb-2">🔔 Reminders:</h5>
          <ul className="mb-0">
            {alerts.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 📊 Workout Summary */}
      <div className="row g-4 justify-content-center mt-4 text-white">
        <div className="col-md-4">
          <div className="card bg-dark bg-opacity-75 text-white text-center p-4 shadow">
            <h5>🔥 Calories Burned Today</h5>
            <p className="display-6 fw-bold">{todayWorkout.caloriesBurned} kcal</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-dark bg-opacity-75 text-white text-center p-4 shadow">
            <h5>🏋️ Workout Duration Today</h5>
            <p className="display-6 fw-bold">{todayWorkout.duration} min</p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

}

export default Dashboard;
