import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('evalUserData'); // Check if user data exists in localStorage

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;