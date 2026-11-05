import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

function ProtectedRoute({ children, allowedRoles }) {
  const token = authService.getToken();
  const user = authService.getCurrentUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === 'instructor' ? '/instructor' : '/student';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
