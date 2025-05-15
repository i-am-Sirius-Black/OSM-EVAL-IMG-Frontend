import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import API_ROUTES from '../../api/routes';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);
  const [isAdmin, setIsAdminState] = useState(false);

// Update isAdmin when admin state changes
  useEffect(() => {
    setIsAdminState(admin && admin.role === 'admin');
  }, [admin]);

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


 // Check for existing admin auth on mount
useEffect(() => {
  const checkAdminAuth = async () => {
    // First check localStorage for admin
    const storedAdmin = localStorage.getItem('adminUser');
    console.log("checking admin auth");
    console.log("Stored Admin:", storedAdmin);
    
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        
        // Verify admin with backend (you can create a dedicated admin check endpoint)
        try {
          await api.get(API_ROUTES.ADMIN.AUTH_CHECK);

          // Admin auth is valid, set admin data
          setAdmin(adminData); // IMPORTANT: Only set admin after verification
        } catch (err) {
          console.error("Admin verification failed:", err.response?.data || err.message);
           localStorage.removeItem('adminUser');
        }
      } catch (err) {
        // JSON parse error
        localStorage.removeItem('adminUser');
      }
    }
    
    // Always set loading to false, regardless of outcome
    setAdminLoading(false);
  };
  
  checkAdminAuth();
}, []); 
  
  
// Function to update user data after login
const setAuthenticatedUser = (userData) => {
    // Store user data in localStorage
    localStorage.setItem("evalUserData", JSON.stringify(userData));
    
    // Update state
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Function to update admin data after admin login
const setAuthenticatedAdmin = (adminData) => {
  // Store admin data in localStorage first
  localStorage.setItem("adminUser", JSON.stringify(adminData));
  
  // Then update state (do this in one operation)
  setAdmin(adminData);
  setAdminLoading(false); // Make sure loading is false
};

  // Function to clear auth on logout
  const logout = () => {
    localStorage.removeItem('evalUserData');
    setUser(null);
    setIsAuthenticated(false);
  };

    // Function to clear admin auth on admin logout
    const adminLogout = () => {
      localStorage.removeItem('adminUser');
      setAdmin(null);
    };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      user,
      admin,
      isAdmin,
      adminLoading,
      loading,
      setAuthenticatedUser,
      setAuthenticatedAdmin,
      logout,
      adminLogout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);