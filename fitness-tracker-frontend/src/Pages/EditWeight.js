import React, { useEffect, useState } from 'react';
import api from '../api';

function EditWeight() {
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setWeight(res.data.weight || '');
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch user:', err);
      alert('Failed to load user');
    });
  }, [token]);

  const handleUpdate = async () => {
    try {
      await api.patch(`${process.env.REACT_APP_API_URL}/api/trackers/update-weight`, {
        weight: Number(weight)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Weight updated successfully');
    } catch (err) {
      console.error('Update failed:', err);
      alert('❌ Failed to update weight');
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <h3 className="mb-4">⚙️ Update Your Weight</h3>
      <div className="card p-4 shadow-sm" style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label className="form-label">Weight (kg)</label>
          <input
            type="number"
            className="form-control"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleUpdate}>
          💾 Save
        </button>
      </div>
    </div>
  );
}

export default EditWeight;
