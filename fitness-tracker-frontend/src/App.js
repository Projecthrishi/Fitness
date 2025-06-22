import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import WorkoutPage from './Pages/WorkoutPage';
import DietAndWaterPage from './Pages/DietAndWaterPage';
import SummaryPage from './Pages/SummaryPage';
import PrivateRoute from './components/PrivateRoute';
import WeeklyCharts from "./Pages/WeeklyCharts"
import EditWeight from './Pages/EditWeight';
import UpdateGoals from './components/UpdateGoals';
import ProgressGallery from './Pages/ProgressGallery';
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/diet-water" element={<DietAndWaterPage />} />
   <Route path="/summary" element={<SummaryPage />} />
   <Route path="/charts" element={<WeeklyCharts />} />
   <Route path="/edit-weight" element={<EditWeight />} />
   <Route path="/goals" element={<UpdateGoals />} />
<Route path="/progress" element={<ProgressGallery />} />
   <Route path="/summary" element={
  <PrivateRoute>
    <SummaryPage />
  </PrivateRoute>
} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
