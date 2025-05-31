import { useEffect, useRef, useState } from "react";
import { Person, Logout, Dashboard } from "@mui/icons-material";
import Assignment from "@mui/icons-material/Assignment";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ProfileModal from "./ProfileModal";
import ConfirmModal from "../Common/ConfirmModal.jsx";
import Notifications from "./components/Notifications.jsx";

export default function Navbar({
  activeTab,
  setActiveTab,
  userData,
  showCountDot, 
  setShowCountDot,
  reevalStatus = { count: 0, hasAssignments: false },
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const dropdownRef = useRef(null);
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

              {/* Only show reevaluation tab when there are assignments */}
              {reevalStatus.hasAssignments && (
                <button
                  onClick={() => {
                    setActiveTab(3);
                    setShowCountDot(false);
                  }}
                  className={`${
                    activeTab === 3
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium relative`}
                >
                  Re-Evaluation
                  {activeTab !== 3 && showCountDot === true ? (
                    <span className="animate-pulse absolute top-4 -right-3 bg-red-400 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {reevalStatus.count}
                    </span>
                  ) : (
                    ""
                  )}
                </button>
              )}
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
                  <div className="p-1 py-2">
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
