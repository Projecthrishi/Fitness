import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProgressChart from '../components/ProgressChart';

function WorkoutPage() {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchWorkouts();
    }
  }, [navigate]);

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/workouts/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setWorkouts(sorted);
      setLoading(false);
    } catch (err) {
      alert('⚠️ Failed to load workouts');
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !duration) return;

    try {
      await axios.post(
        'http://localhost:5000/api/workouts/add',
        { title, duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDuration('');
      fetchWorkouts();
    } catch (err) {
      alert('⚠️ Failed to add workout');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWorkouts();
    } catch (err) {
      alert('⚠️ Failed to delete workout');
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/workouts/toggle/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWorkouts();
    } catch (err) {
      alert('⚠️ Failed to update workout');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🏋️ Workout Tracker</h2>

      <form onSubmit={handleAdd} className="card p-4 shadow mb-5 mx-auto" style={{ maxWidth: '500px' }}>
        <div className="mb-3">
          <label className="form-label">Workout Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Morning Run"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Duration (minutes)</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 30"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-success w-100">➕ Add Workout</button>
      </form>

      <div>
        <h4 className="mb-3">Your Workouts</h4>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : workouts.length === 0 ? (
          <p>No workouts added yet.</p>
        ) : (
          <ul className="list-group">
            {workouts.map((w) => (
              <li
                key={w._id}
                className="list-group-item d-flex justify-content-between align-items-start"
              >
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={w.completed}
                    onChange={() => handleToggleComplete(w._id)}
                  />
                 <div style={{ textDecoration: w.completed ? 'line-through' : 'none' }}>
  <strong>{w.title}</strong> - {w.duration} min

  <div className="text-muted small">
    {w.date ? new Date(w.date).toLocaleString() : 'No Date'}
  </div>

  {w.caloriesBurned && (
    <div className="text-muted small">
      🔥 {w.caloriesBurned} kcal
    </div>
  )}
</div>

                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(w._id)}>
                  Delete
                </button>
                {workouts.length > 0 && <ProgressChart workouts={workouts} />}

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WorkoutPage;
