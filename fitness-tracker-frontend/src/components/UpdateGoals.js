import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from "../api";


function UpdateGoals() {
  const [goals, setGoals] = useState({
    dailyCalories: '',
    dailyDuration: '',
   dailyIntake: ''
  });

  const [userGoals, setUserGoals] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get(`${process.env.REACT_APP_API_URL}/api/user/goals`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const data = res.data || {};
        setGoals({
          dailyCalories: data.dailyCalories || '',
          dailyDuration: data.dailyDuration || '',
         dailyIntake: data.dailyIntake || ''
        });
        setUserGoals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch goals:', err);
        alert('❌ Failed to load goals');
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoals(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`${process.env.REACT_APP_API_URL}/api/user/update-goals`, goals, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Goals updated successfully!');
      setUserGoals(goals);
      setGoals({ dailyCalories: '', dailyDuration: '', dailyWater: '' });
    } catch (err) {
      console.error('Goal update failed:', err);
      alert('❌ Failed to update goals');
    }
  };

  const handleDeleteGoals = async () => {
    if (!window.confirm('Are you sure you want to delete your saved goals?')) return;

    try {
      await api.delete(`${process.env.REACT_APP_API_URL}/api/user/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('🗑️ Goals deleted!');
      setGoals({ dailyCalories: '', dailyDuration: '', dailyIntake: '' });
      setUserGoals(null);
    } catch (err) {
      console.error('Goal deletion failed:', err);
      alert('❌ Failed to delete goals');
    }
  };

  if (loading) return <p className="text-center mt-5">Loading goals...</p>;

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      <h3 className="mb-4 text-center">🎯 Update Your Fitness Goals</h3>

      {/* Goal Form */}
      <div className="card p-4 shadow-sm mb-4" style={{ maxWidth: 450, width: '100%' }}>
        <div className="mb-3">
          <label className="form-label">🔥 Daily Calories Goal (kcal)</label>
          <input
            type="number"
            className="form-control"
            name="dailyCalories"
            value={goals.dailyCalories}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">🏋️ Daily Workout Goal (minutes)</label>
          <input
            type="number"
            className="form-control"
            name="dailyDuration"
            value={goals.dailyDuration}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
  <label className="form-label">💧 Daily Water Intake Goal (ml)</label>
  <input
    type="number"
    className="form-control"
    name="dailyIntake" // ✅ this must match schema
    value={goals.dailyIntake}
    onChange={handleChange}
  />
</div>

        <button className="btn btn-success w-100" onClick={handleUpdate}>
          💾 Save Goals
        </button>
      </div>

      {/* Current Saved Goals */}
      {userGoals && (
        <div className="card p-4 shadow-sm text-center" style={{ maxWidth: 450, width: '100%' }}>
          <h5 className="mb-3">📌 Your Current Saved Goals</h5>
          <table className="table table-sm table-bordered">
            <tbody>
              <tr>
                <th>🔥 Calories/day</th>
                <td>{userGoals.dailyCalories || 0} kcal</td>
              </tr>
              <tr>
                <th>🏋️ Duration/day</th>
                <td>{userGoals.dailyDuration || 0} min</td>
              </tr>
             <tr>
  <th>💧 Water/day</th>
  <td>{userGoals.dailyIntake || 0} ml</td>
</tr>
            </tbody>
          </table>
          <button className="btn btn-danger w-100 mt-2" onClick={handleDeleteGoals}>
            🗑️ Delete Goals
          </button>
        </div>
      )}
    </div>
  );
}

export default UpdateGoals;
