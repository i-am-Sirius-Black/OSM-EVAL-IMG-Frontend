//Axios Instance
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

// 📝 Token interceptor (currently not used)
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// 📝  Response Interceptor
// api.interceptors.response.use(
//   (response) => {
//     // You can log or modify response here
//     return response;
//   },
//   (error) => {
//     // Example: Token expired / user not logged in
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized. Redirecting to login...");
//       // You can also clear tokens here
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }

//     // Show generic error (you can use toast here)
//     if (error.response?.status >= 500) {
//       console.error("Server error:", error.response.data.message);
//     }

//     // Always reject so component can also handle it
//     return Promise.reject(error);
//   }
// );

export default api;
