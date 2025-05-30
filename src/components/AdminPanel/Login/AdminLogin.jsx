import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios.js';
import API_ROUTES from '../../../api/routes.js';
import { useAuth } from '../../context/AuthContext.jsx';

function AdminLogin() {
  const [uid, setUid] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);


  // Get the setAuthenticatedAdmin function from context
  const { setAuthenticatedAdmin, isAdmin } = useAuth();

  useEffect(() => {
    // Focus the first input on component mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Redirect if already logged in as admin
    if (isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post(API_ROUTES.ADMIN.ADMIN_LOGIN, {
        uid: uid,
        pass: pass
      });

      // Handle successful login
      if (response.data && response.data.userData) {
        const adminData = response.data.userData;
        console.log('Admin login successful:', adminData);
        
        localStorage.removeItem("evalUserData");// Clear previous user data

        // Use the context function instead of directly setting localStorage
        setAuthenticatedAdmin(adminData);
        
        // Wait a short delay before navigation to ensure state is updated
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 100);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      
      // Handle various error responses
      if (err.response) {
        setError(err.response.data.error || 'Failed to login. Please check your credentials.');
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access restricted to authorized administrators only
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="uid" className="sr-only">User ID</label>
              <input
                id="uid"
                name="uid"
                type="text"
                required
                ref={inputRef}
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Admin User ID"
              />
            </div>
            <div>
              <label htmlFor="pass" className="sr-only">Password</label>
              <input
                id="pass"
                name="pass"
                type="password"
                required
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isLoading ? 'Logging in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center">
            <a href="/" className="font-medium text-blue-600 hover:text-blue-500">
              Return to Main Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;


