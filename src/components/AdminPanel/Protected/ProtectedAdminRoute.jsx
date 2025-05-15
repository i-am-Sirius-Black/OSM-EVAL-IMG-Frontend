// import React, { use } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import Loader from '../../Common/Loader';

// const ProtectedAdminRoute = ({ children }) => {
//   const location = useLocation();
  
//   const { admin, loading } = useAuth();
  
//   // Check if user is authenticated and has admin role
//   const isAdmin = admin && admin.role === 'admin';

  

//   // Show loading state or return null while authentication is in progress
//   if (loading) {
//     return <Loader />; //  loading spinner component
//   }
  
//   if (!isAdmin) {
//     // Redirect to admin login if not admin
//     return <Navigate to="/admin-login" state={{ from: location }} replace />;
//   }
  
//   return children;
// };

// export default ProtectedAdminRoute;

//?
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../../Common/Loader';
import { useAuth } from '../../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const location = useLocation();
  const { isAdmin, adminLoading } = useAuth();
  console.log("Admin Loading:", adminLoading);
  console.log("Is Admin:", isAdmin);
  

  if (adminLoading) {
    return <Loader />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;