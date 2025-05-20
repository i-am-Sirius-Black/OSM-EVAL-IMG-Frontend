// import { useState, useEffect } from "react";
// import { Search, Assignment, MenuBook } from "@mui/icons-material";
// import api from "../../api/axios.js";

// export default function AssignCopies() {
//   const [assignedSubjects, setAssignedSubjects] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [assigningSubject, setAssigningSubject] = useState(null);
//   const [activeAssignment, setActiveAssignment] = useState(null);

//   // Fetch assigned subjects when component mounts
//   useEffect(() => {
//     const fetchAssignedSubjects = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get("/api/evaluator/assigned-subjects");
//         setAssignedSubjects(response.data.subjects);
//       } catch (err) {
//         console.error("Error fetching assigned subjects:", err);
//         setError("Failed to load your assigned subjects. Please refresh and try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignedSubjects();
//   }, []);

//   // Check if evaluator already has an active batch
//   useEffect(() => {
//     const checkActiveBatch = async () => {
//       try {
//         const response = await api.get("/api/evaluator/current-batch");
//         if (response.data.hasBatch) {
//           setActiveAssignment(response.data.batch);
//         }
//       } catch (err) {
//         console.error("Error checking active batch:", err);
//       }
//     };

//     checkActiveBatch();
//   }, []);

//   // Filter subjects based on search
//   const filteredSubjects = assignedSubjects.filter(subject => 
//     subject.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     subject.examName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Handle assigning copies
//   const handleAssignCopies = async (subject) => {
//     try {
//       setAssigningSubject(subject.subjectCode);
      
//       const response = await api.post("/api/evaluator/assign-batch", {
//         subjectCode: subject.subjectCode,
//         examName: subject.examName,
//         batchSize: 10
//       });
      
//       setActiveAssignment(response.data.batch);
      
//     } catch (error) {
//       console.error("Failed to assign copies:", error);
//       alert(error.response?.data?.message || "Failed to assign copies. Please try again.");
//     } finally {
//       setAssigningSubject(null);
//     }
//   };

//   return (
//     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">Assign Answer Scripts</h1>
//             <p className="mt-1 text-sm text-gray-500">Select a subject to assign copies for evaluation</p>
//           </div>
          
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search subjects..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Active assignment notification */}
//       {activeAssignment && (
//         <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <Assignment className="h-5 w-5 text-blue-600" />
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-blue-800">Active Assignment</h3>
//               <div className="mt-1 text-sm text-blue-700">
//                 <p>You have an active batch of {activeAssignment.copies?.length || 0} copies for {activeAssignment.subjectCode} ({activeAssignment.examName}).</p>
//                 <p className="mt-1">Please finish evaluating these copies before requesting a new batch.</p>
//               </div>
//               <div className="mt-2">
//                 <a
//                   href="#/evaluation"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     window.location.hash = "#evaluation";
//                   }}
//                   className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
//                 >
//                   Go to Evaluation
//                   <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Assigned subjects table */}
//       <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : error ? (
//           <div className="text-center py-16">
//             <div className="mx-auto h-12 w-12 text-red-500">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h3 className="mt-2 text-lg font-medium text-gray-900">{error}</h3>
//             <p className="mt-1 text-sm text-gray-500">Please try refreshing the page.</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Refresh
//             </button>
//           </div>
//         ) : filteredSubjects.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="mx-auto h-12 w-12 text-gray-400">
//               <MenuBook className="h-12 w-12" />
//             </div>
//             <h3 className="mt-2 text-lg font-medium text-gray-900">No subjects found</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               {searchTerm
//                 ? "No subjects match your search criteria."
//                 : "You don't have any subjects assigned to you yet."}
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Subject
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Exam
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date Assigned
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredSubjects.map((subject) => {
//                   const assignedDate = new Date(subject.assignedAt);
//                   const formattedDate = assignedDate.toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   });
                  
//                   return (
//                     <tr key={subject.assignmentId} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
//                             <MenuBook className="h-6 w-6 text-blue-600" />
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{subject.subjectCode}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{subject.examName}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formattedDate}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => handleAssignCopies(subject)}
//                           disabled={!!activeAssignment || assigningSubject === subject.subjectCode}
//                           className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                             activeAssignment || assigningSubject === subject.subjectCode
//                               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                               : "bg-blue-600 text-white hover:bg-blue-700"
//                           }`}
//                         >
//                           {assigningSubject === subject.subjectCode ? (
//                             <>
//                               <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
//                               Assigning...
//                             </>
//                           ) : activeAssignment ? (
//                             "Already Assigned"
//                           ) : (
//                             <>
//                               <Assignment className="mr-1 h-4 w-4" />
//                               Assign Copies
//                             </>
//                           )}
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

//? v2 without search functionality

// import { useState, useEffect } from "react";
// import { Assignment, MenuBook } from "@mui/icons-material";
// import api from "../../api/axios.js";

// export default function AssignCopies() {
//   const [assignedSubjects, setAssignedSubjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [assigningSubject, setAssigningSubject] = useState(null);
//   const [activeAssignment, setActiveAssignment] = useState(null);

//   // Fetch assigned subjects when component mounts
//   useEffect(() => {
//     const fetchAssignedSubjects = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get("/api/evaluator/assigned-subjects");
//         setAssignedSubjects(response.data.subjects);
//       } catch (err) {
//         console.error("Error fetching assigned subjects:", err);
//         setError("Failed to load your assigned subjects. Please refresh and try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignedSubjects();
//   }, []);

//   // Check if evaluator already has an active batch
//   useEffect(() => {
//     const checkActiveBatch = async () => {
//       try {
//         const response = await api.get("/api/evaluator/current-batch");
//         if (response.data.hasBatch) {
//           setActiveAssignment(response.data.batch);
//         }
//       } catch (err) {
//         console.error("Error checking active batch:", err);
//       }
//     };

//     checkActiveBatch();
//   }, []);

//   // Handle assigning copies
//   const handleAssignCopies = async (subject) => {
//     try {
//       setAssigningSubject(subject.subjectCode);
      
//       const response = await api.post("/api/evaluator/assign-batch", {
//         subjectCode: subject.subjectCode,
//         examName: subject.examName,
//         batchSize: 10
//       });
      
//       setActiveAssignment(response.data.batch);
      
//     } catch (error) {
//       console.error("Failed to assign copies:", error);
//       alert(error.response?.data?.message || "Failed to assign copies. Please try again.");
//     } finally {
//       setAssigningSubject(null);
//     }
//   };

//   return (
//     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//       <div className="mb-8">
//         <div className="flex flex-col gap-4">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">Assign Answer Scripts</h1>
//             <p className="mt-1 text-sm text-gray-500">Select a subject to assign copies for evaluation</p>
//           </div>
//         </div>
//       </div>

//       {/* Active assignment notification */}
//       {activeAssignment && (
//         <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <Assignment className="h-5 w-5 text-blue-600" />
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-blue-800">Active Assignment</h3>
//               <div className="mt-1 text-sm text-blue-700">
//                 <p>You have an active batch of {activeAssignment.copies?.length || 0} copies for {activeAssignment.subjectCode} ({activeAssignment.examName}).</p>
//                 <p className="mt-1">Please finish evaluating these copies before requesting a new batch.</p>
//               </div>
//               <div className="mt-2">
//                 <a
//                   href="#/evaluation"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     window.location.hash = "#evaluation";
//                   }}
//                   className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
//                 >
//                   Go to Evaluation
//                   <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Assigned subjects table */}
//       <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : error ? (
//           <div className="text-center py-16">
//             <div className="mx-auto h-12 w-12 text-red-500">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h3 className="mt-2 text-lg font-medium text-gray-900">{error}</h3>
//             <p className="mt-1 text-sm text-gray-500">Please try refreshing the page.</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Refresh
//             </button>
//           </div>
//         ) : assignedSubjects.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="mx-auto h-12 w-12 text-gray-400">
//               <MenuBook className="h-12 w-12" />
//             </div>
//             <h3 className="mt-2 text-lg font-medium text-gray-900">No subjects found</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               You don't have any subjects assigned to you yet.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Subject
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Exam
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date Assigned
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {assignedSubjects.map((subject) => {
//                   const assignedDate = new Date(subject.assignedAt);
//                   const formattedDate = assignedDate.toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   });
                  
//                   return (
//                     <tr key={subject.assignmentId} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
//                             <MenuBook className="h-6 w-6 text-blue-600" />
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{subject.subjectCode}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{subject.examName}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formattedDate}
//                       </td>
//                       {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => handleAssignCopies(subject)}
//                           disabled={!!activeAssignment || assigningSubject === subject.subjectCode}
//                           className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                             activeAssignment || assigningSubject === subject.subjectCode
//                               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                               : "bg-blue-600 text-white hover:bg-blue-700"
//                           }`}
//                         >
//                           {assigningSubject === subject.subjectCode ? (
//                             <>
//                               <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
//                               Assigning...
//                             </>
//                           ) : activeAssignment ? (
//                             "Already Assigned"
//                           ) : (
//                             <>
//                               <Assignment className="mr-1 h-4 w-4" />
//                               Assign Copies
//                             </>
//                           )}
//                         </button>
//                       </td> */}
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => handleAssignCopies(subject)}
//                           disabled={subject.isCopyAssigned || assigningSubject === subject.subjectCode}
//                           className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                             subject.isCopyAssigned || assigningSubject === subject.subjectCode
//                               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                               : "bg-blue-600 text-white hover:bg-blue-700"
//                           }`}
//                         >
//                           {assigningSubject === subject.subjectCode ? (
//                             <>
//                               <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
//                               Assigning...
//                             </>
//                           ) : subject.isCopyAssigned ? (
//                             "Already Assigned"
//                           ) : (
//                             <>
//                               <Assignment className="mr-1 h-4 w-4" />
//                               Assign Copies
//                             </>
//                           )}
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

//? v 2.1 multi subject batch check
import { useState, useEffect } from "react";
import { Assignment, MenuBook } from "@mui/icons-material";
import api from "../../api/axios.js";

export default function AssignCopies({setActiveTab}) {
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigningSubject, setAssigningSubject] = useState(null);
  
  // We no longer need an "overall" activeAssignment state
  // since subjects individually track if they have active assignments

  // Fetch assigned subjects when component mounts
  useEffect(() => {
    const fetchAssignedSubjects = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/evaluator/assigned-subjects");
        setAssignedSubjects(response.data.subjects);
      } catch (err) {
        console.error("Error fetching assigned subjects:", err);
        setError("Failed to load your assigned subjects. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedSubjects();
  }, []);

  // Handle assigning copies
  const handleAssignCopies = async (subject) => {
    try {
      setAssigningSubject(subject.subjectCode);
      
      const response = await api.post("/api/evaluator/assign-batch", {
        subjectCode: subject.subjectCode,
        examName: subject.examName,
        batchSize: 10
      });
      
      // Update just the subject that was assigned
      setAssignedSubjects(prev => 
        prev.map(s => 
          s.subjectCode === subject.subjectCode 
            ? { ...s, isCopyAssigned: true }
            : s
        )
      );
      
      // Show success message
      alert(`Successfully assigned ${response.data.copies?.length || 0} copies for ${subject.subjectCode}`);
      
    } catch (error) {
      console.error("Failed to assign copies:", error);
      alert(error.response?.data?.message || "Failed to assign copies. Please try again.");
    } finally {
      setAssigningSubject(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Assign Answer Scripts</h1>
            <p className="mt-1 text-sm text-gray-500">Select a subject to assign copies for evaluation</p>
          </div>
        </div>
      </div>

      {/* Show active assigned subjects as a summary card */}
      {assignedSubjects.some(subject => subject.isCopyAssigned) && (
        <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Assignment className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Active Assignments</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>You have active batches for the following subjects:</p>
                <ul className="mt-1 list-disc list-inside">
                  {assignedSubjects
                    .filter(subject => subject.isCopyAssigned)
                    .map(subject => (
                      <li key={subject.subjectCode}>
                        {subject.subjectCode} ({subject.examName})
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div className="mt-2">
                <a
                  onClick={() => setActiveTab(2)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center hover:cursor-pointer"
                >
                  Go to Evaluation
                  <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assigned subjects table */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="mx-auto h-12 w-12 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">{error}</h3>
            <p className="mt-1 text-sm text-gray-500">Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          </div>
        ) : assignedSubjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <MenuBook className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No subjects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any subjects assigned to you yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Assigned
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignedSubjects.map((subject) => {
                  const assignedDate = new Date(subject.assignedAt);
                  const formattedDate = assignedDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                  
                  return (
                    <tr key={subject.assignmentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                            <MenuBook className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{subject.subjectCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subject.examName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subject.isCopyAssigned ? (
                          <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                            No Copies Assigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {subject.isCopyAssigned ? (
                          <button
                            onClick={() => setActiveTab(2)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            View Copies
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAssignCopies(subject)}
                            disabled={assigningSubject === subject.subjectCode}
                            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                              assigningSubject === subject.subjectCode
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {assigningSubject === subject.subjectCode ? (
                              <>
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Assigning...
                              </>
                            ) : (
                              <>
                                <Assignment className="mr-1 h-4 w-4" />
                                Assign Copies
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}


//? v4 updated with new style

// import { useState, useEffect } from "react";
// import { Assignment, MenuBook, ArrowBack } from "@mui/icons-material";
// import api from "../../api/axios.js";

// export default function AssignCopies() {
//   const [assignedSubjects, setAssignedSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [assigningCopies, setAssigningCopies] = useState(false);

//   // Mock data for which subjects have active assignments
//   // TODO: Replace with actual API call
//   const mockActiveAssignments = {
//     "CS101": true,
//     "MATH201": false,
//     "PHY301": true,
//   };

//   // Fetch assigned subjects when component mounts
//   useEffect(() => {
//     const fetchAssignedSubjects = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get("/api/evaluator/assigned-subjects");
//         setAssignedSubjects(response.data.subjects);
//       } catch (err) {
//         console.error("Error fetching assigned subjects:", err);
//         setError("Failed to load your assigned subjects. Please refresh and try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignedSubjects();
//   }, []);

//   // Handle subject selection
//   const handleSelectSubject = (subject) => {
//     setSelectedSubject(subject);
//   };

//   // Handle going back to subject list
//   const handleBackToSubjects = () => {
//     setSelectedSubject(null);
//   };

//   // Handle assigning copies
//   const handleAssignCopies = async () => {
//     if (!selectedSubject) return;

//     try {
//       setAssigningCopies(true);
      
//       const response = await api.post("/api/evaluator/assign-batch", {
//         subjectCode: selectedSubject.subjectCode,
//         examName: selectedSubject.examName,
//         batchSize: 10
//       });
      
//       // Show success message
//       alert(`Successfully assigned ${response.data.batch.copies?.length || 10} copies for evaluation!`);
      
//       // Navigate to evaluation page
//       window.location.hash = "#evaluation";
      
//     } catch (error) {
//       console.error("Failed to assign copies:", error);
//       alert(error.response?.data?.message || "Failed to assign copies. Please try again.");
//     } finally {
//       setAssigningCopies(false);
//     }
//   };

//   // Check if subject has active assignment (mock)
//   const hasActiveAssignment = (subjectCode) => {
//     return mockActiveAssignments[subjectCode] || false;
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       </main>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="text-center py-16">
//           <div className="mx-auto h-12 w-12 text-red-500">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="mt-2 text-lg font-medium text-gray-900">{error}</h3>
//           <p className="mt-1 text-sm text-gray-500">Please try refreshing the page.</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             Refresh
//           </button>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//       {!selectedSubject ? (
//         // Step 1: See Assigned Subjects
//         <div>
//           <div className="mb-8">
//             <h1 className="text-2xl font-semibold text-gray-900">Your Assigned Subjects</h1>
//             <p className="mt-1 text-sm text-gray-500">Select a subject to assign copies for evaluation</p>
//           </div>

//           {assignedSubjects.length === 0 ? (
//             <div className="text-center py-16">
//               <div className="mx-auto h-12 w-12 text-gray-400">
//                 <MenuBook className="h-12 w-12" />
//               </div>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">No subjects assigned</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 You don't have any subjects assigned to you yet.
//               </p>
//             </div>
//           ) : (
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {assignedSubjects.map((subject) => {
//                 const hasActive = hasActiveAssignment(subject.subjectCode);
//                 const assignedDate = new Date(subject.assignedAt);
//                 const formattedDate = assignedDate.toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 });

//                 return (
//                   <div
//                     key={subject.assignmentId}
//                     className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
//                     onClick={() => handleSelectSubject(subject)}
//                   >
//                     <div className="p-6">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
//                           <MenuBook className="h-6 w-6 text-blue-600" />
//                         </div>
//                         <div className="ml-4 flex-1">
//                           <h3 className="text-lg font-medium text-gray-900">{subject.subjectCode}</h3>
//                           <p className="text-sm text-gray-500">{subject.examName}</p>
//                         </div>
//                         {hasActive && (
//                           <div className="flex-shrink-0">
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                               Active
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                       <div className="mt-4">
//                         <p className="text-xs text-gray-500">Assigned on {formattedDate}</p>
//                         {hasActive && (
//                           <p className="text-xs text-blue-600 mt-1">You have copies assigned for evaluation</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       ) : (
//         // Step 2: Selected Subject - Assign Copies
//         <div>
//           <div className="mb-8">
//             <button
//               onClick={handleBackToSubjects}
//               className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
//             >
//               <ArrowBack className="h-4 w-4 mr-1" />
//               Back to subjects
//             </button>
            
//             <h1 className="text-2xl font-semibold text-gray-900">Assign Copies</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               {selectedSubject.subjectCode} - {selectedSubject.examName}
//             </p>
//           </div>

//           <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
//             <div className="p-6">
//               <div className="flex items-center mb-6">
//                 <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <MenuBook className="h-8 w-8 text-blue-600" />
//                 </div>
//                 <div className="ml-6">
//                   <h2 className="text-xl font-semibold text-gray-900">{selectedSubject.subjectCode}</h2>
//                   <p className="text-gray-600">{selectedSubject.examName}</p>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Assigned on {new Date(selectedSubject.assignedAt).toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </p>
//                 </div>
//               </div>

//               {hasActiveAssignment(selectedSubject.subjectCode) ? (
//                 <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-md">
//                   <div className="flex">
//                     <div className="flex-shrink-0">
//                       <Assignment className="h-5 w-5 text-yellow-400" />
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-yellow-800">Active Assignment</h3>
//                       <div className="mt-1 text-sm text-yellow-700">
//                         <p>You already have copies assigned for this subject. Please complete the current evaluation before requesting new copies.</p>
//                       </div>
//                       <div className="mt-3">
//                         <button
//                           onClick={() => window.location.hash = "#evaluation"}
//                           className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors"
//                         >
//                           Go to Evaluation
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <Assignment className="mx-auto h-12 w-12 text-gray-400" />
//                   <h3 className="mt-2 text-lg font-medium text-gray-900">Ready to assign copies</h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     Click the button below to get a batch of answer scripts for evaluation.
//                   </p>
//                   <div className="mt-6">
//                     <button
//                       onClick={handleAssignCopies}
//                       disabled={assigningCopies}
//                       className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                         assigningCopies
//                           ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                           : "bg-blue-600 text-white hover:bg-blue-700"
//                       }`}
//                     >
//                       {assigningCopies ? (
//                         <>
//                           <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                           Assigning Copies...
//                         </>
//                       ) : (
//                         <>
//                           <Assignment className="mr-2 h-5 w-5" />
//                           Assign Copies for Evaluation
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }


