// //? Fixing the Page Scrolling Issue in AdminPanel
// import React, { useState } from "react";

// // Import tab components
// import EvaluatorStatus from "./tabs/EvaluatorStatus";
// import AssignSubjects from "./tabs/AssignSubjects";
// import CheckedCopies from "./tabs/CheckedCopies";
// import RejectedCopies from "./tabs/RejectedCopies";
// import { Logout } from "@mui/icons-material";
// import api from "../../api/axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import API_ROUTES from "../../api/routes";
// import { useAuth } from "../context/AuthContext";
// import Moderation from "./tabs/Moderation";
// import Reevaluation from "./tabs/ReEvaluation";

// const AdminPanel = ({ userData }) => {
//   const [activeTab, setActiveTab] = useState("evaluators");

//     // Get adminLogout function from AuthContext
//     const { adminLogout } = useAuth();
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//       try {
//         // 1. Call server to clear the HTTP-only cookie
//         const response = await api.post(API_ROUTES.ADMIN.ADMIN_LOGOUT);
//         localStorage.removeItem("adminUser");
//         toast.success(response.data.message || "Logged out successfully");
//       } catch (error) {
//         console.error("Logout error:", error);
//         toast.error("Server logout failed, but you've been logged out locally");
//       } finally {
//         // 2. Call AuthContext function to clear local storage and state
//         adminLogout();
//         // 3. Navigate to login page
//         navigate("/admin-login", { replace: true });
//       }
//     };

//   return (
//     <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
//       <div className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <div className="flex-shrink-0 flex items-center">
//                 <span className="text-xl font-bold text-gray-900">
//                   Admin Panel
//                 </span>
//               </div>
//               <nav className="ml-16 flex space-x-8">
//                 <button
//                   onClick={() => setActiveTab("evaluators")}
//                   className={`${
//                     activeTab === "evaluators"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
//                 >
//                   Evaluator Status
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("assign")}
//                   className={`${
//                     activeTab === "assign"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
//                 >
//                   Assign Subjects
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("copies")}
//                   className={`${
//                     activeTab === "copies"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
//                 >
//                   Checked Copies
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("rejected")}
//                   className={`${
//                     activeTab === "rejected"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
//                 >
//                   Rejected Copies
//                 </button>
//                   <button
//                     onClick={() => setActiveTab("reEvaluation")}
//                     className={`${
//                       activeTab === "reEvaluation"
//                         ? "border-blue-500 text-gray-900"
//                         : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                     } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
//                   >
//                     Re-Evaluation
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("moderation")}
//                     className={`${
//                       activeTab === "moderation"
//                         ? "border-blue-500 text-gray-900"
//                         : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                     } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
//                   >
//                     Moderation
//                   </button>

//               </nav>
//             </div>
//             <div className="flex items-center">

//               <button
//               onClick={handleLogout}
//               className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-400  flex items-center"
//             >
//               <Logout className="mr-1" fontSize="small" />
//               Logout
//             </button>
//             </div>

//           </div>
//         </div>
//       </div>

//       <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
//         <div className="h-full overflow-y-auto">
//           {activeTab === "evaluators" && <EvaluatorStatus />}
//           {activeTab === "assign" && <AssignSubjects />}
//           {activeTab === "copies" && <CheckedCopies />}
//           {activeTab === "rejected" && <RejectedCopies />}
//           {activeTab === "reEvaluation" && <Reevaluation />}
//           {activeTab === "moderation" && <Moderation />}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminPanel;

//? Split panel navigation

import React, { useState } from "react";

// Import tab components

import EvaluatorStatus from "./Panels/Dashboard/EvaluatorStatus";
import Stats from "./Panels/Advanced/Stats";
import AssignSubjects from "./Panels/Dashboard/AssignSubjects";
import AssignedStatus from "./Panels/Dashboard/AssignedStatus";
import CheckedCopies from "./Panels/Advanced/CheckedCopies";
import Moderation from "./Panels/Advanced/Moderation";
import Reevaluation from "./Panels/Advanced/Reevaluation";
import AuditTrail from "./Panels/Advanced/AuditTrail";
import FinalMarkReview from "./Panels/Advanced/FinalMarkReview";
import RejectedCopies from "./Panels/Advanced/RejectedCopies";
import StudentResults from "./Panels/Registration/Registration";


// Import material-ui icons
import { Logout, SwapHoriz } from "@mui/icons-material";

// Import API and Auth
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API_ROUTES from "../../api/routes";
import { useAuth } from "../context/AuthContext";
import Registration from "./Panels/Registration/Registration";

const AdminPanel = () => {
  // State for panel and tab management
  const [activePanel, setActivePanel] = useState("main"); // "main" or "secondary"
  const [activeTab, setActiveTab] = useState("evaluators"); // Default tab

  // Get adminLogout function from AuthContext
  const { adminLogout } = useAuth();
  const navigate = useNavigate();

  // Handle logout logic
  const handleLogout = async () => {
    try {
      // 1. Call server to clear the HTTP-only cookie
      const response = await api.post(API_ROUTES.ADMIN.ADMIN_LOGOUT);
      localStorage.removeItem("adminUser");
      toast.success(response.data.message || "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Server logout failed, but you've been logged out locally");
    } finally {
      // 2. Call AuthContext function to clear local storage and state
      adminLogout();
      // 3. Navigate to login page
      navigate("/admin-login", { replace: true });
    }
  };

  // Handle switching between panels
  const handlePanelSwitch = (panel) => {
    setActivePanel(panel);
    // Set default tab for each panel
    if (panel === "main") {
      setActiveTab("evaluators");
    } else if(panel === "secondary") {
      setActiveTab("copies");
    } else if(panel === "tertiary") {
      setActiveTab("registration");
    }
  };

  // Render the appropriate tab component based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "evaluators":
        return <EvaluatorStatus />;
      case "assign":
        return <AssignSubjects />;
      case "assigned-status":
        return <AssignedStatus />;
      case "copies":
        return <CheckedCopies />;
      case "rejected":
        return <RejectedCopies />;
      case "reEvaluation":
        return <Reevaluation />;
      case "stats":
        return <Stats />;
      case "registration":
        return  <Registration />
      // Add more cases for other tabs as needed
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent uppercase">
                  Admin Panel
                </span>
              </div>

              <div className="ml-8 flex items-center mt-1 space-x-2">
                <button
                  onClick={() => handlePanelSwitch("main")}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors hover:cursor-pointer ${
                    activePanel === "main"
                      ? "bg-blue-50 text-blue-500 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Dashboard
                </button>
                <span className="mx-2 text-gray-300">|</span>
                <button
                  onClick={() => handlePanelSwitch("secondary")}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center hover:cursor-pointer ${
                    activePanel === "secondary"
                      ? "bg-blue-50 text-blue-500 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <SwapHoriz fontSize="small" className="h-4.5 w-4.5 mr-1" />
                  Advanced
                </button>
                <span className="mx-2 text-gray-300">|</span>
                <button
                  onClick={() => handlePanelSwitch("tertiary")}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center hover:cursor-pointer ${
                    activePanel === "tertiary"
                      ? "bg-cyan-50 text-cyan-500 shadow-sm"
                      : "text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50"
                  }`}
                >
                  Registration
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-400 flex items-center"
              >
                <Logout className="mr-1" fontSize="small" />
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex space-x-8 -mb-px">
            {/* Main Panel Tabs */}
            {activePanel === "main" && (
              <>
                <button
                  onClick={() => setActiveTab("evaluators")}
                  className={`${
                    activeTab === "evaluators"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
                >
                  Evaluator Status
                </button>
                <button
                  onClick={() => setActiveTab("assign")}
                  className={`${
                    activeTab === "assign"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
                >
                  Assign Subjects
                </button>
                <button
                  onClick={() => setActiveTab("assigned-status")}
                  className={`${
                    activeTab === "assigned-status"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
                >
                  Assignment Status
                </button>
              </>
            )}

            {/* Secondary Panel Tabs */}
            {activePanel === "secondary" && (
              <>
                <button
                  onClick={() => setActiveTab("copies")}
                  className={`${
                    activeTab === "copies"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
                >
                  Checked Copies
                </button>
                <button
                  onClick={() => setActiveTab("rejected")}
                  className={`${
                    activeTab === "rejected"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
                >
                  Rejected Copies
                </button>
                <button
                  onClick={() => setActiveTab("reEvaluation")}
                  className={`${
                    activeTab === "reEvaluation"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
                >
                  Re-Evaluation
                </button>

                {/* <button
                  onClick={() => setActiveTab("stats")}
                  className={`${
                    activeTab === "stats"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
                >
                  Analytics
                </button> */}
              </>
            )}

            {/* Tertiary Panel Tabs */}
            {activePanel === "tertiary" && (
              <>
                <button
                  onClick={() => setActiveTab("registration")}
                  className={`${
                    activeTab === "registration"
                      ? "border-cyan-500 text-cyan-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
                >
                  Evaluators Registration
                </button>
              </>
            )}
          </nav>
        </div>

      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="h-full overflow-y-auto">{renderTabContent()}</div>
      </main>

    </div>
  );
};

export default AdminPanel;
