import React from "react";
import { Close, Person, Email, Phone } from "@mui/icons-material";

export default function ProfileModal({ isOpen, onClose, userData }) {
  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm transition-all">
      <div className="relative w-full max-w-md transform rounded-xl bg-white shadow-2xl transition-all duration-300 sm:mx-auto">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">User Profile</h2>
            <button
              onClick={onClose}
              className="rounded-full bg-white bg-opacity-20 p-1 text-black hover:bg-opacity-30 transition-all"
            >
              <Close />
            </button>
          </div>
        </div>

        {/* Profile picture area */}
        <div className="flex flex-col items-center -mt-12 px-6">
          <div className="h-24 w-24 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
            {userData.profilePic ? (
              <img
                src={userData.profilePic}
                alt={userData.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <Person size={40} className="text-gray-400" />
            )}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            {userData.name}
          </h3>
        </div>

        {/* User details */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center rounded-lg bg-gray-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Email size={18} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-800">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center rounded-lg bg-gray-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Phone size={18} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-gray-500">Phone</p>
                <p className="text-sm text-gray-800">{userData.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                /* Add edit profile function here */
              }}
              disabled
              className="rounded-lg bg-blue-300 py-2 px-4 text-sm font-medium text-white shadow-sm cursor-not-allowed opacity-50"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
