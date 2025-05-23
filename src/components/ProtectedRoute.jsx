// import React, { useState, useEffect, useCallback } from 'react';
// import { Navigate } from 'react-router-dom';
// import api from '../api/axios';

// const ProtectedRoute = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [error, setError] = useState(null);

//   console.log("isAuthenticated?", isAuthenticated);
  
//   const checkAuth = useCallback(async () => {
//     try {
//       const res = await api.get('/auth/check', { withCredentials: true });
//       setIsAuthenticated(res.status === 200);
//     } catch (err) {
//       setIsAuthenticated(false);
//       setError('Authentication failed. Please log in again.');
//     }
//   }, []);

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   if (isAuthenticated === null) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-gray-500">Checking authentication...</div>
//       </div>
//     );
//   }

// //   if (error) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="text-red-500">{error}</div>
// //       </div>
// //     );
// //   }

//   return isAuthenticated ? children : <Navigate to="/login" replace/>;
// };

// export default ProtectedRoute;


//? using authcontext for cheking authentication

// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Checking authentication...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;