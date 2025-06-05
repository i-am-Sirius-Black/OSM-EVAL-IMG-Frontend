
//? using authcontext for cheking authentication

// ProtectedRoute.jsx
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