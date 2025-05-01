// src/components/Home/Navbar.jsx
import { useEffect, useRef, useState } from 'react';
import { Person, Logout, Dashboard, Assignment } from '@mui/icons-material';
import { useUserIP } from '../../hooks/ShowUserIP';
import api from '../../api/axios.js';
import ProfileModal from './ProfileModal'; // ✅ Import

export default function Navbar({ activeTab, setActiveTab , userData}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // Add state

  const dropdownRef = useRef(null); //ref for closing when clicked outside

    const ipAddress =useUserIP();

  const username = userData?.name || 'User'; // Get the username from userData or set a default value
    


  // Step 2: Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {

    //TODO: Make it proper by using a modal
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return; // If user cancels, do nothing

    try {
      const response = await api.post('/logout');
  
      if (response.status === 200) {
        localStorage.removeItem('evalUserData'); // Clear user data from local storage
        window.location.replace('/login'); // Redirect to login page and clear browser history
      } else {
        console.error('Logout failed:');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred while logging out. Please try again.');
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Dashboard className="icon h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">OSM-Portal</span>
            </div>
            <nav className="ml-16 flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`${
                  activeTab === 'dashboard' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('evaluation')}
                className={`${
                  activeTab === 'evaluation' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <Assignment className="mr-1" fontSize="small" />
                Evaluation
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`${
                  activeTab === 'reports' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Reports
              </button>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="relative " ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Person className="h-5 w-5 text-blue-600" />
                </div>
                <span className="ml-2 mr-1 text-gray-700">{username}</span>
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <a
                      href="#"
                      onClick={() => setShowProfile(true)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </a>
                    {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </a> */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                    >
                      Logout
                    </button>
                    {ipAddress&&(<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                       <h2 className='text-sm'>IP Address: <span className="font-semibold">{ipAddress}</span></h2> 
                    </a>)}

                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-400  flex items-center"
            >
              <Logout className="mr-1" fontSize="small" />
              Logout
            </button>
          </div>
        </div>
      </div>
       {/* Profile Modal */}
       <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)} // Close modal
        userData={userData}
      />
    </header>
  );
}