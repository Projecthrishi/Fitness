import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function WeeklyCharts() {
  const [aggregate, setAggregate] = useState({ totalBurned: 0, totalIntake: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get(`${process.env.REACT_APP_API_URL}/api/trackers/summary/weekly/aggregate`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setAggregate(res.data))
    .catch((err) => console.error('Pie chart fetch error:', err));
  }, []);

  const pieData = {
    labels: ['🔥 Calories Burned', '🍱 Diet Calories'],
    datasets: [
      {
        label: 'Weekly Calories',
        data: [aggregate.totalBurned, aggregate.totalIntake],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="container mt-5">
  <h2 className="text-center mb-4">📊 Weekly Calories Overview</h2>
  <div className="card p-4 shadow-sm" style={{ maxWidth: 600, margin: '0 auto' }}>
    <h5 className="text-center mb-3">🔥 Burn vs 🍱 Diet</h5>

    <div style={{ width: '250px', height: '250px', margin: '0 auto' }}>
      <Pie 
        data={pieData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                font: { size: 12 }
              }
            }
          }
        }}
      />
    </div>
    
  </div>
</div>

  );
}

export default WeeklyCharts;
