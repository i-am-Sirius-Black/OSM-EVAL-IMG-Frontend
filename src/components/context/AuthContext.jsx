import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import API_ROUTES from '../../api/routes';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      // First check localStorage
      const storedUser = localStorage.getItem('evalUserData');
      
      if (storedUser) {
        // If user exists in localStorage, set as authenticated first
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        
        // Then verify with backend (optional but recommended)
        try {
          await api.get(API_ROUTES.AUTH.CHECK);
          // Auth is valid
        } catch (err) {
          // Token invalid or expired
          setIsAuthenticated(false);
          localStorage.removeItem('evalUserData');
        }
      }
      
      setLoading(false);
    };
    
    checkExistingAuth();
  }, []);


  console.log("AuthContext", isAuthenticated, user, loading);
  
  
// Function to update user data after login
const setAuthenticatedUser = (userData) => {
    // Store user data in localStorage
    localStorage.setItem("evalUserData", JSON.stringify(userData));
    
    // Update state
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Function to clear auth on logout
  const logout = () => {
    localStorage.removeItem('evalUserData');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      user,
      loading,
      setAuthenticatedUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);