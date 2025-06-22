import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WaterProgressBar from '../components/WaterProgressBar';

function DietAndWaterPage() {
  const [meal, setMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [meals, setMeals] = useState([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const waterGoal = 3000;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('http://localhost:5000/api/trackers/today', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setMeals(res.data.meals || []);
        setWaterIntake(res.data.waterIntake || 0);
      }
    };
    fetchData();
  }, [token]);

  const handleAddMeal = async (e) => {
  e.preventDefault();

  if (!meal.trim() || !calories.trim()) {
    return alert("Both meal and calories are required.");
  }

  await axios.post('http://localhost:5000/api/trackers/diet', {
    meal,
    calories: Number(calories)  // 🛠️ Ensure it's a number
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  setMeal('');
  setCalories('');

  const res = await axios.get('http://localhost:5000/api/trackers/today', {
    headers: { Authorization: `Bearer ${token}` }
  });

  setMeals(res.data.meals || []);
};


  const handleWaterIncrease = async () => {
    await axios.post('http://localhost:5000/api/trackers/water', { amount: 250 }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setWaterIntake(prev => Math.min(prev + 250, waterGoal));
  };

  const handleDeleteMeal = async (index) => {
  await axios.delete(`http://localhost:5000/api/trackers/diet/${index}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // Refresh meals
  const res = await axios.get('http://localhost:5000/api/trackers/today', {
    headers: { Authorization: `Bearer ${token}` }
  });
  setMeals(res.data.meals || []);
};

const handleWaterDecrease = async () => {
  try {
    const res = await axios.delete('http://localhost:5000/api/trackers/water/remove', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setWaterIntake(res.data.waterIntake);
  } catch (err) {
    alert('❌ Failed to remove water intake');
  }
};

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">🥗 Diet & 💧 Water Tracker</h2>

      <div className="card p-4 shadow mb-5">
        <h4>🍱 Add Meal
         <span className="text-muted small">({new Date().toLocaleDateString()})</span>
        </h4>
        <form onSubmit={handleAddMeal}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Meal (e.g. Breakfast)"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-success">Add Meal</button>
        </form>

       <ul className="list-group mt-4">
  {meals.map((m, index) => (
    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>{m.meal}</strong> - {m.calories} kcal
      </div>
      <button
        className="btn btn-sm btn-outline-danger"
        onClick={() => handleDeleteMeal(index)}
      >
        ❌
      </button>
    </li>
  ))}
</ul>

      </div>

      <div className="card p-4 shadow">
        <h4>🌊 Water Intake
           <span className="text-muted small">({new Date().toLocaleDateString()})</span>
        </h4>
        <p>{waterIntake} / {waterGoal} ml</p>
        <WaterProgressBar value={waterIntake} max={waterGoal} />
       <div className="d-flex gap-3 mt-3">
  <button className="btn btn-primary" onClick={handleWaterIncrease}>
    + Add 250ml
  </button>
  <button className="btn btn-outline-danger" onClick={handleWaterDecrease}>
    − Remove 250ml
  </button>
</div>

      </div>
    </div>
  );
}

export default DietAndWaterPage;
