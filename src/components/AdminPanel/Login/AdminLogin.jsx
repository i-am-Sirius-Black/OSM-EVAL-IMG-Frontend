// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import api from '../../../api/axios';
// import API_ROUTES from '../../../api/routes';

// const AdminLogin = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
    
//     try {
//       const response = await api.post(API_ROUTES.ADMIN.ADMIN_LOGIN, { username, password });
      
//       if (response.status === 200 && response.data) {
//         // Store admin user data in localStorage
//         const adminData = { 
//           ...response.data,
//           role: 'admin'  // Ensure role is set to admin
//         };
        
//         localStorage.setItem('evalUserData', JSON.stringify(adminData));
        
//         // Navigate to the admin dashboard
//         navigate('/admin', { replace: true });
//       } else {
//         setError('Invalid credentials');
//       }
//     } catch (err) {
//       setError('Login failed: ' + (err.response?.data?.message || 'Unknown error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Access restricted to authorized administrators only
//           </p>
//         </div>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}
        
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="username" className="sr-only">Username</label>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Admin Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">Password</label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Admin Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
//                 loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
//               } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//             >
//               {loading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </div>
          
//           <div className="text-center">
//             <a href="/" className="font-medium text-blue-600 hover:text-blue-500">
//               Return to Main Login
//             </a>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;



// import { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API_ROUTES from '../../../api/routes.js';
// import api from '../../../api/axios.js';

// function AdminLogin() {
//   const [uid, setUid] = useState('');
//   const [pass, setPass] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const inputRef = useRef(null);

//   useEffect(() => {
//     // Focus the first input on component mount
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       // Make sure to send the expected property names that match the backend
//       const response = await api.post(API_ROUTES.ADMIN.ADMIN_LOGIN, {
//         uid: uid,  // Use 'uid' instead of 'username' or other field names
//         pass: pass // Use 'pass' instead of 'password' to match backend expectations
//       });

//       // Handle successful login
//       if (response.data) {
//         console.log('Admin login successful:', response.data);
//         // Store admin user data in local storage or context if needed
//         localStorage.setItem('adminUser', JSON.stringify(response.data.userData));
//         // Redirect to admin dashboard
//         navigate('/admin', { replace: true });
//       }
//     } catch (err) {
//       console.error('Login error:', err);
      
//       // Handle various error responses
//       if (err.response) {
//         // Server responded with an error status
//         setError(err.response.data.error || 'Failed to login. Please check your credentials.');
//       } else if (err.request) {
//         // Request was made but no response received
//         setError('No response from server. Please try again later.');
//       } else {
//         // Something else caused the error
//         setError('An error occurred. Please try again.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Admin Login
//           </h2>
//         </div>
        
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
//               <div className="flex">
//                 <div className="ml-3">
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="uid" className="sr-only">User ID</label>
//               <input
//                 id="uid"
//                 name="uid"
//                 type="text"
//                 required
//                 ref={inputRef}
//                 value={uid}
//                 onChange={(e) => setUid(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Admin User ID"
//               />
//             </div>
//             <div>
//               <label htmlFor="pass" className="sr-only">Password</label>
//               <input
//                 id="pass"
//                 name="pass"
//                 type="password"
//                 required
//                 value={pass}
//                 onChange={(e) => setPass(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
//             >
//               {isLoading ? 'Logging in...' : 'Sign in'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AdminLogin;


//*v2* Updated - auto-redirect, role setting, better error handling, and minor UI improvements

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


