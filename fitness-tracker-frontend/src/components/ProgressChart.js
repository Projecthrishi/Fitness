// src/components/ProgressChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function ProgressChart({ workouts }) {
  const chartData = {
    labels: workouts.map(w => new Date(w.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Workout Duration (min)',
        data: workouts.map(w => w.duration),
        fill: false,
        borderColor: '#00bcd4',
        tension: 0.3
      }
    ]
  };

  return (
    <div className="card p-3 mt-4 shadow">
      <h5 className="text-center mb-3">Progress Chart</h5>
      <Line data={chartData} />
    </div>
  );
}

export default ProgressChart;
