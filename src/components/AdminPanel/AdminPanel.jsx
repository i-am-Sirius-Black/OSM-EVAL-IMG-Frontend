//* v2-> Independent Panel approach to handle their own tabs states

import { useState } from "react";
import { Logout, SwapHoriz } from "@mui/icons-material";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API_ROUTES from "../../api/routes";
import { useAuth } from "../context/AuthContext";

// Import Panel Components
import DashboardPanel from "./Panels/DashboardPanel";
import AdvancedPanel from "./Panels/AdvancedPanel";
import RegistrationPanel from "./Panels/RegistrationPanel";
import FragmentationPanel from "./Panels/FragmentationPanel";

const AdminPanel = () => {
  const [activePanel, setActivePanel] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  const { adminLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await api.post(API_ROUTES.ADMIN.ADMIN_LOGOUT);
      toast.success(response.data.message || "Logged out successfully");
    } catch (error) {
      toast.error("Logout error, logging out locally");
    } finally {
      localStorage.removeItem("adminUser");
      setTimeout(() => {
        adminLogout();
        setLoggingOut(false);
        navigate("/admin-login", { replace: true });
      }, 500);
    }
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case 0:
        return <DashboardPanel />;
      case 1:
        return <AdvancedPanel />;
      case 2:
        return <RegistrationPanel />;
      case 3:
        return <FragmentationPanel />;
      default:
        return <DashboardPanel />;
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
                  onClick={() => setActivePanel(0)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors hover:cursor-pointer ${
                    activePanel === 0
                      ? "bg-blue-50 text-blue-500 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Dashboard
                </button>
                <span className="mx-2 text-gray-300">|</span>
                <button
                  onClick={() => setActivePanel(1)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center hover:cursor-pointer ${
                    activePanel === 1
                      ? "bg-blue-50 text-blue-500 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <SwapHoriz fontSize="small" className="h-4.5 w-4.5 mr-1" />
                  Advanced
                </button>
                <span className="mx-2 text-gray-300">|</span>
                <button
                  onClick={() => setActivePanel(2)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center hover:cursor-pointer ${
                    activePanel === 2
                      ? "bg-cyan-50 text-cyan-500 shadow-sm"
                      : "text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50"
                  }`}
                >
                  Registration
                </button>
                <span className="mx-2 text-gray-300">|</span>
                <button
                  onClick={() => setActivePanel(3)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors hover:cursor-pointer ${
                    activePanel === 3
                      ? "bg-blue-50 text-blue-500 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Fragmentation
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className={`px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-400 flex items-center ${
                  loggingOut && "animate-bounce"
                }`}
              >
                <Logout className="mr-1" fontSize="small" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 overflow-hidden">
        <div className="h-full overflow-y-auto">{renderActivePanel()}</div>
      </main>
    </div>
  );
};

export default AdminPanel;







//?old single file handling all panels and tabs
// import { useState } from "react";
// import EvaluatorStatus from "./Panels/Dashboard/EvaluatorStatus";
// import Stats from "./Panels/Advanced/Stats";
// import AssignSubjects from "./Panels/Dashboard/AssignSubjects";
// import AssignedStatus from "./Panels/Dashboard/AssignedStatus";
// import CheckedCopies from "./Panels/Advanced/CheckedCopies";
// import ReevaluationStats from "./Panels/Advanced/ReevaluationStats";

// import RejectedCopies from "./Panels/Advanced/RejectedCopies";
// import { Logout, SwapHoriz } from "@mui/icons-material";
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// // Import API and Auth
// import api from "../../api/axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import API_ROUTES from "../../api/routes";
// import { useAuth } from "../context/AuthContext";
// import Registration from "./Panels/Registration/Registration";
// import ReevaluationAssignment from "./Panels/Advanced/ReevaluationAssignment";
// import Evaluators from "./Panels/Dashboard/Evaluators";
// import UploadEvalData from "./Panels/Advanced/UploadEvalData";
// import QuestionFragmentation from "./Panels/Fragmentation/QuestionFragmentation";
// import UploadPaper from "./Panels/Fragmentation/UploadPaper";
// import EditFragmentation from "./Panels/Fragmentation/EditFragmentation";

// const AdminPanel = () => {
//   // State for panel and tab management
//   const [activePanel, setActivePanel] = useState(0); // Default panel
//   const [activeTab, setActiveTab] = useState("evaluatorStatus"); // Default tab
//   const [loggingOut, setLoggingOut] = useState(false);

//   // Get adminLogout function from AuthContext
//   const { adminLogout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     setLoggingOut(true);

//     try {
//       const response = await api.post(API_ROUTES.ADMIN.ADMIN_LOGOUT);
//       toast.success(response.data.message || "Logged out successfully");
//     } catch (error) {
//       toast.error("Logout error, logging out locally");
//     } finally {
//       localStorage.removeItem("adminUser");

//       // Delay the state change and navigation
//       setTimeout(() => {
//         adminLogout(); // this sets admin to null
//         setLoggingOut(false);
//         navigate("/admin-login", { replace: true });
//       }, 500);
//     }
//   };

//   // Handle switching between panels
//   const handlePanelSwitch = (panel) => {
//     setActivePanel(panel);
//     // Set default tab for each panel
//     if (panel === 0) {
//       setActiveTab("evaluatorStatus");
//     } else if (panel === 1) {
//       setActiveTab("copies");
//     } else if (panel === 2) {
//       setActiveTab("registration");
//     } else if (panel === 3) {
//       setActiveTab("uploadPaper");
//     }
//   };

//   // Render the appropriate tab component based on activeTab
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "evaluators":
//         return <Evaluators />;
//       case "evaluatorStatus":
//         return <EvaluatorStatus />;
//       case "assign":
//         return <AssignSubjects />;
//       case "assigned-status":
//         return <AssignedStatus />;
//       case "copies":
//         return <CheckedCopies />;
//       case "rejected":
//         return <RejectedCopies />;
//       case "reeval-stats":
//         return <ReevaluationStats />;
//       case "reevalAssignment":
//         return <ReevaluationAssignment />;
//       case "stats":
//         return <Stats />;
//       case "registration":
//         return <Registration />;
//       case "uploadPaper":
//         return <UploadPaper />;
//       case "questionStructure":
//         return <QuestionFragmentation />;
//       case "editFragmentation":
//         return <EditFragmentation/>;  
//       // Add more cases for other tabs as needed
//       default:
//         return <div>Select a tab</div>;
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
//       <div className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <div className="flex-shrink-0 flex items-center">
//                 <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent uppercase">
//                   Admin Panel
//                 </span>
//               </div>

//               <div className="ml-8 flex items-center mt-1 space-x-2">
//                 <button
//                   onClick={() => handlePanelSwitch(0)}
//                   className={`px-3 py-1.5 rounded text-sm font-medium transition-colors hover:cursor-pointer ${
//                     activePanel === 0
//                       ? "bg-blue-50 text-blue-500 shadow-sm"
//                       : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   Dashboard
//                 </button>
//                 <span className="mx-2 text-gray-300">|</span>
//                 <button
//                   onClick={() => handlePanelSwitch(1)}
//                   className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center hover:cursor-pointer ${
//                     activePanel === 1
//                       ? "bg-blue-50 text-blue-500 shadow-sm"
//                       : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <SwapHoriz fontSize="small" className="h-4.5 w-4.5 mr-1" />
//                   Advanced
//                 </button>

//                 <span className="mx-2 text-gray-300">|</span>
//                 <button
//                   onClick={() => handlePanelSwitch(2)}
//                   className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center hover:cursor-pointer ${
//                     activePanel === 2
//                       ? "bg-cyan-50 text-cyan-500 shadow-sm"
//                       : "text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50"
//                   }`}
//                 >
//                   Registration
//                 </button>
//                 <span className="mx-2 text-gray-300">|</span>
//                 <button
//                   onClick={() => handlePanelSwitch(3)}
//                   className={`px-3 py-1.5 rounded text-sm font-medium transition-colors hover:cursor-pointer ${
//                     activePanel === 3
//                       ? "bg-blue-50 text-blue-500 shadow-sm"
//                       : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   Fragmentation
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center">
//               <button
//                 onClick={handleLogout}
//                 disabled={loggingOut}
//                 className={`px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-400 flex items-center ${
//                   loggingOut && "animate-bounce"
//                 }`}
//               >
//                 <Logout className="mr-1" fontSize="small" />
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Tab Navigation */}
//           <nav className="flex space-x-8 -mb-px">
//             {/* Main Panel Tabs */}
//             {activePanel === 0 && (
//               <>
//                 <button
//                   onClick={() => setActiveTab("evaluatorStatus")}
//                   className={`${
//                     activeTab === "evaluatorStatus"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Evaluator Status
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("evaluators")}
//                   className={`${
//                     activeTab === "evaluators"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Evaluators
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("assign")}
//                   className={`${
//                     activeTab === "assign"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Assign Subjects
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("assigned-status")}
//                   className={`${
//                     activeTab === "assigned-status"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Assignment Status
//                 </button>
//               </>
//             )}

//             {/* Secondary Panel Tabs */}
//             {activePanel === 1 && (
//               <>
//                 <button
//                   onClick={() => setActiveTab("copies")}
//                   className={`${
//                     activeTab === "copies"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Checked Copies
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("rejected")}
//                   className={`${
//                     activeTab === "rejected"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Rejected Copies
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("reeval-stats")}
//                   className={`${
//                     activeTab === "reeval-stats"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Re-Evaluation
//                 </button>

//                 <button
//                   onClick={() => setActiveTab("reevalAssignment")}
//                   className={`${
//                     activeTab === "reevalAssignment"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Re-Evaluation Assignment
//                 </button>

//                 <button
//                   onClick={() => setActiveTab("stats")}
//                   className={`${
//                     activeTab === "stats"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Analytics
//                 </button>
//                 {/* <button
//                   onClick={() => setActiveTab("questionPaper")}
//                   className={`${
//                     activeTab === "questionPaper"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Question Paper
//                 </button> */}
//               </>
//             )}

//             {/* Tertiary Panel Tabs */}
//             {activePanel === 2 && (
//               <>
//                 <button
//                   onClick={() => setActiveTab("registration")}
//                   className={`${
//                     activeTab === "registration"
//                       ? "border-cyan-500 text-cyan-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Evaluators Registration
//                 </button>
//               </>
//             )}

//             {/* Fragmentation Panel Tabs */}
//             {activePanel === 3 && (
//               <>
//                 <button
//                   onClick={() => setActiveTab("uploadPaper")}
//                   className={`${
//                     activeTab === "uploadPaper"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                       <CloudUploadIcon className="mr-2" />
//                       <span>Upload Paper</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("questionStructure")}
//                   className={`${
//                     activeTab === "questionStructure"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Paper Fragmentation
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("editFragmentation")}
//                   className={`${
//                     activeTab === "editFragmentation"
//                       ? "border-blue-500 text-gray-900"
//                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                   } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//                 >
//                   Edit Fragmentation
//                 </button>
//               </>
//             )}
//           </nav>
//         </div>
//       </div>

//       <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
//         <div className="h-full overflow-y-auto">{renderTabContent()}</div>
//       </main>
//     </div>
//   );
// };

// export default AdminPanel;
