// // src/components/Home/Dashboard.jsx
// import { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import Evaluation from "./Evaluation";
// import EvaluationStatus from "./EvaluationStatus";
// import { useAuth } from "../context/AuthContext";
// import Loader from "../Common/Loader";
// import api from "../../api/axios";
// import API_ROUTES from "../../api/routes";

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState("evaluation");
//   const [evaluatedStats, setEvaluatedStats] = useState({
//     evaluated: 0,
//     pending: 0,
//     partial: 0,
//     total: 0,
//   });
//   const [assignmentsLoading, setAssignmentsLoading] = useState(false);
//   const [assignedCopies, setAssignedCopies] = useState([]);
//   const [error, setError] = useState(null);
//   const [filteredCopies, setFilteredCopies] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   const { user, loading } = useAuth();
//   const userId = user?.uid || "";

//   // Fetching assigned copies on component mount
//   useEffect(() => {
//     const fetchAssignedCopies = async () => {
//       setAssignmentsLoading(true);
//       try {
//         const evaluatorId = userId || "current-user";
//         const response = await api.get(API_ROUTES.EVALUATION.GET_COPIES, {
//           params: { evaluatorId },
//         });

//         // Directly access the copies array from the response
//         const copies = response.data.copies || [];

//         // Sort copies alphanumerically by copyId
//         copies.sort((a, b) => {
//           return a.copyId.localeCompare(b.copyId);
//         });

//         setAssignedCopies(copies);
//         setFilteredCopies(copies);
//         setError(null);
//       } catch (err) {
//         console.error("Failed to fetch assigned copies:", err);
//         setError("Failed to load your assigned copies. Please try again.");
//         setAssignedCopies([]);
//         setFilteredCopies([]);
//       } finally {
//         setAssignmentsLoading(false);
//       }
//     };

//     fetchAssignedCopies();
//   }, [userId]);

//   // Fetch Evaluations stats like evaluated, pending, total
//   useEffect(() => {
//     try {
//       const fetchEvaluationStats = async () => {
//         const evaluatorId = userId || "";
//         const response = await api.get(
//           API_ROUTES.EVALUATION.GET_EVALUATION_STATS,
//           {
//             params: { evaluatorId },
//           }
//         );
//         const evalStat = response.data.stats;
//         setEvaluatedStats({
//           evaluated: evalStat.evaluated || 0,
//           partial: evalStat.partial || 0,
//           pending: evalStat.pending || 0,
//           total: evalStat.total || 0,
//         });
//       };
//       fetchEvaluationStats();
//     } catch (error) {
//       console.error("Error fetching evaluated count:", error.message);
//       setError("Failed to fetch evaluated count");
//     }
//   }, [assignedCopies]);


//   useEffect(() => {
//     if (!assignedCopies.length) return;

//     if (searchTerm) {
//       const filtered = assignedCopies.filter((copy) =>
//         copy.copyId.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredCopies(filtered);
//     } else {
//       setFilteredCopies(assignedCopies);
//     }

//     setPage(1); // Reset to first page when filter changes
//   }, [searchTerm, assignedCopies]);

//   // Calculate copies for current page
//   const currentCopies = filteredCopies.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage
//   );



//   return (
//     <div className="min-h-screen bg-gray-50">
//       {loading ? (
//         <Loader />
//       ) : (
//         <>
//           <Navbar
//             activeTab={activeTab}
//             setActiveTab={setActiveTab}
//             userData={user}
//           />
//           {activeTab === "status" && (
//             <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//               {/* <DashboardSummary /> */}
//               <div className="mt-1">
//                 <EvaluationStatus currentCopies={currentCopies} filteredCopies={filteredCopies} evaluatedStats={evaluatedStats} searchTerm={searchTerm} setSearchTerm={setSearchTerm} page={page} setPage={setPage} itemsPerPage={itemsPerPage} error={error} loading={assignmentsLoading} />
//               </div>
//             </main>
//           )}
//           {activeTab === "evaluation" && <Evaluation currentCopies={currentCopies} filteredCopies={filteredCopies} evaluatedStats={evaluatedStats} searchTerm={searchTerm} setSearchTerm={setSearchTerm} page={page} setPage={setPage} itemsPerPage={itemsPerPage} error={error} loading={assignmentsLoading} />}
//           {/* {activeTab === 'reports' && <Reports />} */}
//           <div className="nav-item"></div>
//         </>
//       )}
//     </div>
//   );
// }

//?v2 include new tab

// src/components/Home/Dashboard.jsx
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Evaluation from "./Evaluation";
// import EvaluationStatus from "./EvaluationStatus";
import AssignCopies from "./AssignCopies";
import { useAuth } from "../context/AuthContext";
import Loader from "../Common/Loader";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(2);
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userData={user}
          />
          
          {activeTab === 1 && <AssignCopies setActiveTab={setActiveTab} />}
          {activeTab === 2 && <Evaluation setActiveTab={setActiveTab} />}
          {/* {activeTab === 3 && <EvaluationStatus setActiveTab={setActiveTab} />} */}
        </>
      )}
    </div>
  );
}