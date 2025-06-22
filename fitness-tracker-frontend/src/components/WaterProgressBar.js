import React from 'react';

function WaterProgressBar({ value, max }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="progress" style={{ height: '25px' }}>
      <div
        className="progress-bar bg-info"
        role="progressbar"
        style={{ width: `${percentage}%` }}
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax={max}
      >
        {Math.round(percentage)}%
      </div>
    </div>
  );
}

export default WaterProgressBar;
