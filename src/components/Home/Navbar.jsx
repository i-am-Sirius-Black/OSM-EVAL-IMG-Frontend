// //?v.3 Navbar and notification separated component
// import { useEffect, useRef, useState } from "react";
// import { Person, Logout, Dashboard, Assignment } from "@mui/icons-material";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import { useUserIP } from "../../hooks/ShowUserIP";
// import { useAuth } from "../context/AuthContext.jsx";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// import ProfileModal from "./ProfileModal";
// import ConfirmModal from "../Common/ConfirmModal.jsx";
// import Notifications from "./components/Notifications.jsx";

// export default function Navbar({ activeTab, setActiveTab, userData }) {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [logoutModalOpen, setLogoutModalOpen] = useState(false);

//   const dropdownRef = useRef(null);
//   const ipAddress = useUserIP();
//   const { logout } = useAuth();

//   const username = userData?.name || "User";
//   const navigate = useNavigate();

//   // Handle clicks outside dropdowns
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLogout = async () => {
//     logout();
//     toast.success("Logged out successfully!");
//   };

//   const handleChangePassword = async () => {
//     navigate("/change-password");
//   };

//   return (
//     <header className="bg-white shadow">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <div className="flex-shrink-0 flex items-center">
//               <Dashboard className="icon h-8 w-8 text-blue-600" />
//               <span className="ml-2 text-xl font-bold text-gray-900">OSM</span>
//             </div>
//             <nav className="ml-16 flex space-x-8">
//               <button
//                 onClick={() => setActiveTab("evaluation")}
//                 className={`${
//                   activeTab === "evaluation"
//                     ? "border-blue-500 text-gray-900"
//                     : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                 } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
//               >
//                 <Assignment className="mr-1" fontSize="small" />
//                 Evaluation
//               </button>
//               <button
//                 onClick={() => setActiveTab("status")}
//                 className={`${
//                   activeTab === "status"
//                     ? "border-blue-500 text-gray-900"
//                     : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                 } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
//               >
//                 <AssessmentIcon className="mr-1" fontSize="small" />
//                 Status
//               </button>
//             </nav>
//           </div>

//           <div className="flex items-center">
//             {/* Notifications dropdown */}
//             <div className="relative mr-4">
//               <Notifications />
//             </div>

//             {/* <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
//                   <Person className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <span className="ml-2 mr-1 text-gray-700">{username}</span>
//                 <svg
//                   className="h-5 w-5 text-gray-400"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//               {dropdownOpen && (
//                 <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
//                   <div className="py-1">
//                     <a
//                       href="/"
//                       onClick={() => setShowProfile(true)}
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Your Profile
//                     </a>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
//                     >
//                       Logout
//                     </button>
//                     <button
//                       onClick={handleChangePassword}
//                       className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
//                     >
//                       Change-Password
//                     </button>

//                      <a href="/contact" className="block px-4 py-2 text-sm font-black text-blue-900 hover:bg-blue-100">
//                       <h2 className='text-sm'>Contact Support</h2>
//                     </a>
//                                         {ipAddress && (
//                       <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         <h2 className='text-xs'>IP Address: {ipAddress}</h2> 
//                       </a>
//                     )}

//                   </div>
//                 </div>
//               )}
//             </div> */}

//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
//                 aria-expanded={dropdownOpen}
//                 aria-haspopup="true"
//               >
//                 <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
//                   <Person fontSize="small" className=" text-white" />
//                 </div>
//                 <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate inline-block align-middle">
//                   {username}
//                 </span>

//                 <span
//                   className={`text-xs text-gray-400 transition-transform duration-150 ${
//                     dropdownOpen ? "rotate-180" : ""
//                   }`}
//                 >
//                   ▼
//                 </span>
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-1 w-48 rounded-md shadow-sm bg-white border border-gray-100 z-10">
//                   <div className="py-1">
//                     <a
//                       href="/"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setShowProfile(true);
//                         setDropdownOpen(false);
//                       }}
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                     >
//                       Your Profile
//                     </a>

//                     <a
//                       href="/contact"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                     >
//                       Contact Support
//                     </a>

//                     <div className="my-1 border-t border-gray-100"></div>

//                     <button
//                       onClick={() => {
//                         handleChangePassword();
//                         setDropdownOpen(false);
//                       }}
//                       className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                     >
//                       Change Password
//                     </button>

//                     <button
//                       onClick={() => {
//                         handleLogout();
//                         setDropdownOpen(false);
//                       }}
//                       className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
//                     >
//                       Logout
//                     </button>

//                     {ipAddress && (
//                       <div className="px-4 py-2 text-xs text-gray-400">
//                         IP: {ipAddress}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={() => setLogoutModalOpen(true)}
//               className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-400 flex items-center"
//             >
//               <Logout className="mr-1" fontSize="small" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Profile Modal */}
//       <ProfileModal
//         isOpen={showProfile}
//         onClose={() => setShowProfile(false)}
//         userData={userData}
//       />

//       {/* Logout Confirmation Modal */}
//       <ConfirmModal
//         isOpen={logoutModalOpen}
//         onClose={() => setLogoutModalOpen(false)}
//         onConfirm={handleLogout}
//         title="Confirm Logout"
//         text="Are you sure you want to log out?"
//         action="Logout"
//       />
//     </header>
//   );
// }



//? V2 include new tab

import { useEffect, useRef, useState } from "react";
import { Person, Logout, Dashboard } from "@mui/icons-material";
import Assignment from "@mui/icons-material/Assignment";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import { useUserIP } from "../../hooks/ShowUserIP";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ProfileModal from "./ProfileModal";
import ConfirmModal from "../Common/ConfirmModal.jsx";
import Notifications from "./components/Notifications.jsx";

export default function Navbar({ activeTab, setActiveTab, userData, isReevalAssigned }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);


  const dropdownRef = useRef(null);
  const ipAddress = useUserIP();
  const { logout } = useAuth();

  const username = userData?.name || "User";
  const navigate = useNavigate();

 
  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    logout();
    toast.success("Logged out successfully!");
  };

  const handleChangePassword = async () => {
    navigate("/change-password");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Dashboard className="icon h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">OSM</span>
            </div>
            <nav className="ml-16 flex space-x-8">
                            <button
                onClick={() => setActiveTab(2)}
                className={`${
                  activeTab === 2
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <Assignment className="mr-1" fontSize="small" />
                Evaluation
              </button>
              
              <button
                onClick={() => setActiveTab(1)}
                className={`${
                  activeTab === 1
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <LibraryAdd className="mr-1" fontSize="small" />
                Assign Copies
              </button>

              {isReevalAssigned && (
               <button
                onClick={() => setActiveTab(3)}
                className={`${
                  activeTab === 3
                    ? "border-blue-500 text-blue-900"
                    : "animate-pulse border-transparent text-red-600 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {/* <LibraryAdd className="mr-1" fontSize="small" /> */}
                Re-Evaluation
              </button>
              )}

              {/* <button
                onClick={() => setActiveTab(3)}
                className={`${
                  activeTab === 3
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <AssessmentIcon className="mr-1" fontSize="small" />
                Status
              </button> */}
            </nav>
          </div>

          <div className="flex items-center">
            {/* Notifications dropdown */}
            <div className="relative mr-4">
              <Notifications />
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Person fontSize="small" className=" text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate inline-block align-middle">
                  {username}
                </span>

                <span
                  className={`text-xs text-gray-400 transition-transform duration-150 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-md shadow-sm bg-white border border-gray-100 z-10">
                  <div className="py-1">
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowProfile(true);
                        setDropdownOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Your Profile
                    </a>

                    <a
                      href="/contact"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Contact Support
                    </a>

                    <div className="my-1 border-t border-gray-100"></div>

                    <button
                      onClick={() => {
                        handleChangePassword();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Change Password
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                    >
                      Logout
                    </button>

                    {ipAddress && (
                      <div className="px-4 py-2 text-xs text-gray-400">
                        IP: {ipAddress}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setLogoutModalOpen(true)}
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-400 flex items-center"
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
        onClose={() => setShowProfile(false)}
        userData={userData}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        text="Are you sure you want to log out?"
        action="Logout"
      />
    </header>
  );
}
