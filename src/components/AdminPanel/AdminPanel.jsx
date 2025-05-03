

//? Fixing the Page Scrolling Issue in AdminPanel
import React, { useState } from "react";
import Navbar from "../Home/Navbar";

// Import tab components
import EvaluatorStatus from "./tabs/EvaluatorStatus";
import AssignSubjects from "./tabs/AssignSubjects";
import CheckedCopies from "./tabs/CheckedCopies";
import RejectedCopies from "./tabs/RejectedCopies";
import { useAuth } from "../context/AuthContext";
import { Logout } from "@mui/icons-material";

const AdminPanel = ({ userData }) => {
  const [activeTab, setActiveTab] = useState("evaluators");
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };


  

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900">
                  Admin Panel
                </span>
              </div>
              <nav className="ml-16 flex space-x-8">
                <button
                  onClick={() => setActiveTab("evaluators")}
                  className={`${
                    activeTab === "evaluators"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Evaluator Status
                </button>
                <button
                  onClick={() => setActiveTab("assign")}
                  className={`${
                    activeTab === "assign"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Assign Subjects
                </button>
                <button
                  onClick={() => setActiveTab("copies")}
                  className={`${
                    activeTab === "copies"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Checked Copies
                </button>
                <button
                  onClick={() => setActiveTab("rejected")}
                  className={`${
                    activeTab === "rejected"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Rejected Copies
                </button>
              </nav>
            </div>
            <div className="flex items-center">
              <a
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Back to Dashboard
              </a>
              <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-400  flex items-center"
            >
              <Logout className="mr-1" fontSize="small" />
              Logout
            </button>
            </div>
          
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {activeTab === "evaluators" && <EvaluatorStatus />}
          {activeTab === "assign" && <AssignSubjects />}
          {activeTab === "copies" && <CheckedCopies />}
          {activeTab === "rejected" && <RejectedCopies />}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
