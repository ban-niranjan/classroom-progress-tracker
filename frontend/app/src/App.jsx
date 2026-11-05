import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Instructor/Dashboard';
import SessionDetail from './pages/Instructor/SessionDetail';
import MySessions from './pages/Student/MySessions';
import SessionCheckpoints from './pages/Student/SessionCheckpoints';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Instructor Routes */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/session/:id"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <SessionDetail />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <MySessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/session/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <SessionCheckpoints />
            </ProtectedRoute>
          }
        />

        {/* Fallbacks */}
        <Route path="/dashboard" element={<Navigate to="/instructor" replace />} />
        <Route path="/my-sessions" element={<Navigate to="/student" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
