import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const location = useLocation();
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('evalUserData'));
  
  // Check if user is authenticated and has admin role
  const isAdmin = userData && userData.role === 'admin';
  
  if (!isAdmin) {
    // Redirect to admin login if not admin
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedAdminRoute;