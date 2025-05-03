import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../Common/Loader';

const ProtectedAdminRoute = ({ children }) => {
  const location = useLocation();
  
  const { user, loading } = useAuth();
  
  // Check if user is authenticated and has admin role
  const isAdmin = user && user.role === 'admin';

  // Show loading state or return null while authentication is in progress
  if (loading) {
    return <Loader />; //  loading spinner component
  }
  
  
  if (!isAdmin) {
    // Redirect to admin login if not admin
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedAdminRoute;