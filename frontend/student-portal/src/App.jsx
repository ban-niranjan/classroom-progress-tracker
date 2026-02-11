import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import MySessions from './pages/MySessions/MySessions';
import SessionCheckpoints from './pages/SessionCheckpoints/SessionCheckpoints';
import { authService } from './services/auth.service';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = authService.getToken();
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/my-sessions" 
          element={
            <ProtectedRoute>
              <MySessions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/session/:id" 
          element={
            <ProtectedRoute>
              <SessionCheckpoints />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;