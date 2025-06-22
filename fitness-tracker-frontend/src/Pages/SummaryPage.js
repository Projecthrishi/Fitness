import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SummaryPage() {
  const [summary, setSummary] = useState([]);
  const token = localStorage.getItem('token');

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/trackers/summary/weekly', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(res.data || []);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setSummary([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSummary();
    }
  }, [token]);

  const handleDelete = async (date) => {
    if (!window.confirm(`Delete data for ${new Date(date).toLocaleDateString()}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/trackers/delete/${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSummary(); // refresh after delete
    } catch (err) {
      alert('❌ Failed to delete');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">📊 Last 7 Days Summary</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Meals</th>
              <th>Total Calories</th>
              <th>Water Intake</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((day, index) => (
              <tr key={index}>
                <td>{new Date(day.date).toLocaleDateString()}</td>
                <td>
                  {Array.isArray(day.meals) && day.meals.length > 0 ? (
                    day.meals.map((m, i) => (
                      <div key={i}>
                        {m.meal} ({m.calories} kcal)
                      </div>
                    ))
                  ) : (
                    <em>No meals</em>
                  )}
                </td>
                <td>{day.totalCalories || 0} kcal</td>
                <td>{day.waterIntake || 0} ml</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(day.date)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
            {summary.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SummaryPage;
