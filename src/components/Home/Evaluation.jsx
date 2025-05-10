// import { useState, useEffect } from "react";
// import { Pagination, TextField, InputAdornment, CircularProgress } from "@mui/material";
// import { Search, SortByAlpha, ArrowForwardIos } from "@mui/icons-material";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/axios";
// import API_ROUTES from "../../api/routes";

// const { EXAMS, SUBJECTS, COPIES } = API_ROUTES;

// export default function Evaluation() {
//   const [exams, setExams] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedExam, setSelectedExam] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [selectedPackingId, setSelectedPackingId] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredCopies, setFilteredCopies] = useState([]);
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 12;
//   const [loading, setLoading] = useState({
//     exams: false,
//     subjects: false,
//     copies: false
//   });
//   const [error, setError] = useState({
//     exams: null,
//     subjects: null,
//     copies: null
//   });

//   const navigate = useNavigate();

//   // Fetch exams on component mount
//   useEffect(() => {
//     const fetchExams = async () => {
//       setLoading(prev => ({ ...prev, exams: true }));
//       try {
//         const response = await api.get(EXAMS.GET_ALL);
//         setExams(response.data);
//         setError(prev => ({ ...prev, exams: null }));
//       } catch (err) {
//         console.error("Failed to fetch exams:", err);
//         setError(prev => ({ ...prev, exams: "Failed to load exams. Please try again." }));
//       } finally {
//         setLoading(prev => ({ ...prev, exams: false }));
//       }
//     };

//     fetchExams();
//   }, []);

//   // Fetch subjects when exam is selected
//   useEffect(() => {
//     if (!selectedExam) {
//       setSubjects([]);
//       return;
//     }

//     const fetchSubjects = async () => {
//       setLoading(prev => ({ ...prev, subjects: true }));
//       try {
//         const response = await api.get(SUBJECTS.GET_BY_EXAM_ID(selectedExam));
//         setSubjects(response.data);
//         setSelectedSubject("");
//         setError(prev => ({ ...prev, subjects: null }));
//       } catch (err) {
//         console.error("Failed to fetch subjects:", err);
//         setError(prev => ({ ...prev, subjects: "Failed to load subjects. Please try again." }));
//       } finally {
//         setLoading(prev => ({ ...prev, subjects: false }));
//       }
//     };

//     fetchSubjects();
//   }, [selectedExam]);

// // Modify the fetchCopies function in the useEffect hook
// useEffect(() => {
//   if (!selectedSubject) {
//     setFilteredCopies([]);
//     return;
//   }

//   // Reset search term and page when changing subjects
//   setSearchTerm('');
//   setPage(1);

//   const fetchCopies = async () => {
//     setLoading(prev => ({ ...prev, copies: true }));
//     setFilteredCopies([]); // Clear previous state to avoid showing old data

//     try {
//       // Find the packingId for the selected subject
//       const subject = subjects.find(s => s.subjectId === selectedSubject);
//       if (subject) {
//         setSelectedPackingId(subject.packingId);

//         //* now with params since changed to GET
//         // Fetch copies by Subject in packet
//           const response = await api.get(COPIES.GET_BY_SUBJECT, {
//             params: {
//               packingId: subject.packingId,
//             }
//           });

//         console.log(`Response for subject ${selectedSubject}:`, response);

//         // Handle different response formats
//         let copies = [];
//         if (response.data && Array.isArray(response.data)) {
//           copies = response.data;
//         } else if (response.data && typeof response.data === 'object') {
//           // Try to extract array from response object
//           const possibleArrays = Object.values(response.data)
//             .filter(val => Array.isArray(val) && val.length > 0);

//           if (possibleArrays.length > 0) {
//             copies = possibleArrays[0]; // Use the first non-empty array found
//           }
//         }

//         console.log(`Processed ${copies.length} copies for subject ${selectedSubject}`);

//         // Apply sorting (but no search filter initially)
//         if (sortOrder === "asc") {
//           copies.sort((a, b) => a.localeCompare(b));
//         } else {
//           copies.sort((a, b) => b.localeCompare(a));
//         }

//         setFilteredCopies(copies);

//         // Set appropriate error message if no copies found
//         if (copies.length === 0) {
//           setError(prev => ({
//             ...prev,
//             copies: "No copies available for this subject."
//           }));
//         } else {
//           setError(prev => ({ ...prev, copies: null }));
//         }
//       }
//     } catch (err) {
//       console.error("Failed to fetch copies:", err);
//       setError(prev => ({ ...prev, copies: "Failed to load copies. Please try again." }));
//       setFilteredCopies([]);
//     } finally {
//       setLoading(prev => ({ ...prev, copies: false }));
//     }
//   };

//   fetchCopies();
// }, [selectedSubject, subjects]);

//   // Handle search and sort
//   useEffect(() => {
//     if (!selectedSubject || !filteredCopies.length) return;

//     const applyFiltersAndSort = async () => {
//       setLoading(prev => ({ ...prev, copies: true }));
//       try {
//         // For filtering and sorting, we have two options:
//         // 1. Make a new API call with search/sort parameters
//         // 2. Filter/sort the existing data client-side

//         // Option 1: API call (better for large datasets)
//         if (selectedPackingId) {
//           const response = await api.get(COPIES.SEARCH, {
//             params: {
//               bagId: selectedPackingId,
//               searchTerm: searchTerm,
//               sortOrder: sortOrder
//             }
//           });
//           setFilteredCopies(response.data);
//         }
//         // Option 2: Client-side filtering (we'll fall back to this)
//         else {
//           // Fetch copies by subject ID again
//           const response = await api.get(COPIES.GET_BY_SUBJECT, {
//             params: {
//               packingId: selectedPackingId,
//             }
//           });
//           let copies = response.data;

//           // Apply search filter
//           if (searchTerm) {
//             copies = copies.filter(copy =>
//               copy.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//           }

//           // Apply sorting
//           if (sortOrder === "asc") {
//             copies.sort((a, b) => a.localeCompare(b));
//           } else {
//             copies.sort((a, b) => b.localeCompare(a));
//           }

//           setFilteredCopies(copies);
//         }

//         setPage(1); // Reset to first page
//       } catch (err) {
//         console.error("Failed to filter/sort copies:", err);
//       } finally {
//         setLoading(prev => ({ ...prev, copies: false }));
//       }
//     };

//     applyFiltersAndSort();
//   }, [searchTerm, sortOrder, selectedPackingId]);

//   const handleEvaluate = (copyId) => {
//     // Navigate to the evaluation layout with the selected copy ID
//     navigate(`/evaluate/${copyId}`);
//   };

//   const currentCopies = filteredCopies.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage
//   );

//   return (
//     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//       {/* Exam and Subject Selection */}
//       <div className="flex flex-col md:flex-row gap-4 mb-4">
//         {/* Exam Name Dropdown */}
//         <div className="flex-1">
//           <label htmlFor="examName" className="block text-sm font-medium text-gray-700">
//             Exam Name
//           </label>
//           <div className="relative">
//             <select
//               id="examName"
//               value={selectedExam}
//               onChange={(e) => setSelectedExam(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//               disabled={loading.exams}
//             >
//               <option value="">Select Exam</option>
//               {exams.map((exam) => (
//                 <option key={exam.examId} value={exam.examId}>
//                   {exam.examName}
//                 </option>
//               ))}
//             </select>
//             {loading.exams && (
//               <div className="absolute right-2 top-2">
//                 <CircularProgress size={20} />
//               </div>
//             )}
//           </div>
//           {error.exams && <p className="mt-1 text-sm text-red-600">{error.exams}</p>}
//         </div>

//         {/* Subject to Evaluate Dropdown */}
//         <div className="flex-1">
//           <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
//             Subject to Evaluate
//           </label>
//           <div className="relative">
//             <select
//               id="subject"
//               value={selectedSubject}
//               onChange={(e) => setSelectedSubject(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//               disabled={!selectedExam || loading.subjects}
//             >
//               <option value="">Select Subject</option>
//               {subjects.map((subject) => (
//                 <option key={subject.subjectId} value={subject.subjectId}>
//                   {subject.subject}
//                 </option>
//               ))}
//             </select>
//             {loading.subjects && (
//               <div className="absolute right-2 top-2">
//                 <CircularProgress size={20} />
//               </div>
//             )}
//           </div>
//           {error.subjects && <p className="mt-1 text-sm text-red-600">{error.subjects}</p>}
//         </div>
//       </div>

//       {selectedSubject && (
//         <div className="bg-white shadow rounded-lg">
//           {/* Header */}
//           <div className="px-4 py-2 border-b border-gray-200 sm:px-6">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between">
//               <h2 className="text-lg font-medium text-gray-900">
//                 Copies for{" "}
//                 {subjects.find((s) => s.subjectId === selectedSubject)?.subject}
//                 <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
//                   {loading.copies ? "..." : filteredCopies.length} copies
//                 </span>
//               </h2>
//               <div className="flex gap-2 mt-3 sm:mt-0">
//                 <TextField
//                   placeholder="Search copies..."
//                   size="small"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Search fontSize="small" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{ width: "200px" }}
//                 />
//                 <button
//                   onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
//                   className="px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   <SortByAlpha fontSize="small" className="mr-1" />
//                   {sortOrder === "asc" ? "A → Z" : "Z → A"}
//                 </button>
//               </div>
//             </div>
//           </div>

//         {/* Copies List */}
// {loading.copies ? (
//   <div className="flex items-center justify-center py-12">
//     <CircularProgress />
//     <span className="ml-3 text-gray-600">Loading copies...</span>
//   </div>
// ) : error.copies ? (
//   <div className="text-center py-12">
//     <svg
//       className="mx-auto h-12 w-12 text-gray-400"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//       />
//     </svg>
//     <h3 className="mt-2 text-sm font-medium text-gray-900">
//       {error.copies === "No copies available for this subject." ?
//         "No copies available for this subject" :
//         error.copies}
//     </h3>
//     <p className="mt-1 text-sm text-gray-500">
//       {error.copies === "No copies available for this subject." ?
//         "This subject doesn't have any copies available for evaluation yet." :
//         "Please try selecting a different subject or refreshing the page."}
//     </p>
//     <div className="mt-4">
//       <button
//         onClick={() => setSelectedSubject("")}
//         className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
//       >
//         Select a different subject
//       </button>
//     </div>
//   </div>
// ) : filteredCopies.length > 0 ? (
//             <div className="p-4">
//               <div className="max-h-[45vh] overflow-y-auto pr-2">
//                 {currentCopies.map((copyId) => (
//                   <div
//                     key={copyId}
//                     className="flex justify-between items-center px-3 py-2 mb-1 border border-gray-200 rounded-md hover:bg-gray-50"
//                   >
//                     <div className="flex items-center">
//                       <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
//                         <svg
//                           className="w-3 h-3 text-blue-600"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                           />
//                         </svg>
//                       </div>
//                       <div className="font-medium text-gray-900">{copyId}</div>
//                       {/* We could add evaluation status here if available from API */}
//                     </div>
//                     <button
//                       onClick={() => handleEvaluate(copyId)}
//                       className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-xs w-24 justify-center"
//                     >
//                       Evaluate
//                       <ArrowForwardIos
//                         fontSize="small"
//                         className="ml-1"
//                         style={{ fontSize: "10px" }}
//                       />
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               {/* Pagination */}
//               <div className="mt-4 flex justify-center">
//                 <Pagination
//                   count={Math.ceil(filteredCopies.length / itemsPerPage)}
//                   page={page}
//                   onChange={(e, value) => setPage(value)}
//                   color="primary"
//                   showFirstButton
//                   showLastButton
//                 />
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">
//                 No copies found
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Try adjusting your search or selecting a different subject.
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </main>
//   );
// }

//?v5 minimalist card-changed ui/ux update

// import { useState, useEffect } from "react";
// import {
//   Pagination,
//   TextField,
//   InputAdornment,
//   CircularProgress,
//   Tooltip,
// } from "@mui/material";
// import { Search, Assignment, ArrowForwardIos } from "@mui/icons-material";
// import PendingActionsIcon from '@mui/icons-material/PendingActions';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import CheckIcon from '@mui/icons-material/Check';
// import { useNavigate } from "react-router-dom";
// import api from "../../api/axios";
// import API_ROUTES from "../../api/routes";
// import { useAuth } from "../context/AuthContext";

// export default function Evaluation() {
//   const [assignedCopies, setAssignedCopies] = useState([]);
//   const [filteredCopies, setFilteredCopies] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const itemsPerPage = 10;

//   const { user } = useAuth();
//   const userId = user?.uid || "";

//   const navigate = useNavigate();

//   // Fetch assigned copies on component mount
//   useEffect(() => {
//     const fetchAssignedCopies = async () => {
//       setLoading(true);
//       try {
//         const evaluatorId = userId || "current-user";
//         const response = await api.get(API_ROUTES.EVALUATION.GET_COPIES, {
//           params: { evaluatorId },
//         });

//         // Handle different response formats
//         let copies = [];
//         if (response.data && Array.isArray(response.data)) {
//           copies = response.data;
//         } else if (
//           response.data &&
//           response.data.copies &&
//           Array.isArray(response.data.copies)
//         ) {
//           copies = response.data.copies;
//         } else if (response.data && typeof response.data === "object") {
//           const possibleArrays = Object.values(response.data).filter(
//             (val) => Array.isArray(val) && val.length > 0
//           );

//           if (possibleArrays.length > 0) {
//             copies = possibleArrays[0];
//           }
//         }

//         // Sort copies alphanumerically by default
//         copies.sort((a, b) => a.localeCompare(b));

//         setAssignedCopies(copies);
//         setFilteredCopies(copies);
//         setError(null);
//       } catch (err) {
//         console.error("Failed to fetch assigned copies:", err);
//         setError("Failed to load your assigned copies. Please try again.");
//         setAssignedCopies([]);
//         setFilteredCopies([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignedCopies();
//   }, [userId]);

//   // Apply search filter when search term changes
//   useEffect(() => {
//     if (!assignedCopies.length) return;

//     if (searchTerm) {
//       const filtered = assignedCopies.filter((copyId) =>
//         copyId.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredCopies(filtered);
//     } else {
//       setFilteredCopies(assignedCopies);
//     }

//     setPage(1); // Reset to first page when filter changes
//   }, [searchTerm, assignedCopies]);

//   const handleEvaluate = (copyId) => {
//     navigate(`/evaluate/${copyId}`);
//   };

//   // Calculate copies for current page
//   const currentCopies = filteredCopies.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage
//   );

//   return (
//     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//       {/* Header panel with title and search */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Your Assignments
//             </h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Manage and evaluate your assigned answer scripts
//             </p>
//           </div>

//           <div className="flex items-center">
//             {/* <TextField
//               placeholder="Search by copy ID..."
//               size="small"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search fontSize="small" className="text-gray-400" />
//                   </InputAdornment>
//                 ),
//                 sx: {
//                   borderRadius: '9999px',
//                   '.MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgb(229, 231, 235)'
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgb(209, 213, 219)'
//                   }
//                 }
//               }}
//               sx={{ minWidth: "250px" }}
//             /> */}
//             <TextField
//               placeholder="Search by copy ID..."
//               size="small"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               slotProps={{
//                 input: {
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Search fontSize="small" className="text-gray-400" />
//                     </InputAdornment>
//                   ),
//                 },
//                 root: {
//                   sx: {
//                     borderRadius: "9999px",
//                     ".MuiOutlinedInput-notchedOutline": {
//                       borderColor: "rgb(229, 231, 235)",
//                     },
//                     "&:hover .MuiOutlinedInput-notchedOutline": {
//                       borderColor: "rgb(209, 213, 219)",
//                     },
//                   },
//                 },
//               }}
//               sx={{ minWidth: "250px" }}
//             />
//           </div>
//         </div>

//         {/* Stats bar */}
//         <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">
//                   Total Assigned
//                 </p>
//                 <p className="text-2xl font-semibold mt-1">
//                   {loading ? (
//                     <CircularProgress size={24} />
//                   ) : (
//                     assignedCopies.length
//                   )}
//                 </p>
//               </div>
//               <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
//                 <Assignment className="text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Evaluated</p>
//                 <p className="text-2xl font-semibold mt-1">0</p>
//               </div>
//               <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
//                 <CheckIcon className="h-6 w-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Pending</p>
//                 <p className="text-2xl font-semibold mt-1">
//                   {loading ? (
//                     <CircularProgress size={24} />
//                   ) : (
//                     assignedCopies.length
//                   )}
//                 </p>
//               </div>
//               <div className="h-12 w-12 bg-amber-50 rounded-lg flex items-center justify-center">
//                 <AccessTimeIcon className="h-6 w-6 text-amber-600" />
//               </div>
//             </div>
//           </div>

//            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Partially-Checked</p>
//                 <p className="text-2xl font-semibold mt-1">0</p>
//               </div>
//               <div className="h-12 w-12 bg-yellow-50 rounded-lg flex items-center justify-center">
//                 <PendingActionsIcon className="h-6 w-6 text-yellow-600" />
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Copies table */}
//       <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-16">
//             <CircularProgress size={40} />
//             <p className="mt-4 text-gray-500">
//               Loading your assigned copies...
//             </p>
//           </div>
//         ) : error ? (
//           <div className="text-center py-16">
//             <div className="bg-red-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg
//                 className="h-8 w-8 text-red-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900">{error}</h3>
//             <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
//               Please try refreshing the page or contact support if the problem
//               persists.
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Refresh
//             </button>
//           </div>
//         ) : filteredCopies.length > 0 ? (
//           <>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Copy ID
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Status
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Date Assigned
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {currentCopies.map((copyId) => (
//                     <tr
//                       key={copyId}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
//                             <Assignment />
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {copyId}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               Answer Script
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                           Pending
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date().toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => handleEvaluate(copyId)}
//                           className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150"
//                         >
//                           Evaluate
//                           <ArrowForwardIos
//                             className="ml-1.5"
//                             style={{ fontSize: "12px" }}
//                           />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {filteredCopies.length > itemsPerPage && (
//               <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-center">
//                 <Pagination
//                   count={Math.ceil(filteredCopies.length / itemsPerPage)}
//                   page={page}
//                   onChange={(e, value) => setPage(value)}
//                   color="primary"
//                   variant="outlined"
//                   shape="rounded"
//                   size="medium"
//                 />
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="text-center py-16">
//             <svg
//               className="mx-auto h-16 w-16 text-gray-300"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg>
//             <h3 className="mt-4 text-lg font-medium text-gray-900">
//               No copies found
//             </h3>
//             <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
//               {searchTerm
//                 ? "No copies match your search criteria. Try a different search term."
//                 : "You don't have any copies assigned to you yet. Check back later or contact your administrator."}
//             </p>
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm("")}
//                 className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Clear search
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

//?Copies with date of assignment from api

import { useState, useEffect } from "react";
import {
  Pagination,
  TextField,
  InputAdornment,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Search, Assignment, ArrowForwardIos } from "@mui/icons-material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import API_ROUTES from "../../api/routes";
import { useAuth } from "../context/AuthContext";

export default function Evaluation() {
  const [assignedCopies, setAssignedCopies] = useState([]);
  const [filteredCopies, setFilteredCopies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evaluatedStats, setEvaluatedStats] = useState({
    evaluated: 0,
    pending: 0,
    total: 0,
  });

  const itemsPerPage = 10;

  const { user } = useAuth();
  const userId = user?.uid || "";

  const navigate = useNavigate();

  // Update your fetchAssignedCopies function to handle the new data structure
  useEffect(() => {
    const fetchAssignedCopies = async () => {
      setLoading(true);
      try {
        const evaluatorId = userId || "current-user";
        const response = await api.get(API_ROUTES.EVALUATION.GET_COPIES, {
          params: { evaluatorId },
        });

        // Handle different response formats
        let copies = [];
        if (response.data && Array.isArray(response.data)) {
          copies = response.data;
        } else if (
          response.data &&
          response.data.copies &&
          Array.isArray(response.data.copies)
        ) {
          copies = response.data.copies;
        } else if (response.data && typeof response.data === "object") {
          const possibleArrays = Object.values(response.data).filter(
            (val) => Array.isArray(val) && val.length > 0
          );

          if (possibleArrays.length > 0) {
            copies = possibleArrays[0];
          }
        }

        // Format the data to handle both string IDs and object with copyId & assignedAt
        const formattedCopies = copies.map((copy) => {
          if (typeof copy === "string") {
            return { copyId: copy, assignedAt: new Date().toISOString() };
          }
          return copy;
        });

        // Sort copies alphanumerically by copyId
        formattedCopies.sort((a, b) => {
          const idA = a.copyId || a;
          const idB = b.copyId || b;
          return idA.localeCompare(idB);
        });

        setAssignedCopies(formattedCopies);
        setFilteredCopies(formattedCopies);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch assigned copies:", err);
        setError("Failed to load your assigned copies. Please try again.");
        setAssignedCopies([]);
        setFilteredCopies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedCopies();
  }, [userId]);



  useEffect(() => {
    try {
      const fetchEvaluationStats = async () => {
        const evaluatorId = userId || "";
        const response = await api.get(API_ROUTES.EVALUATION.GET_EVALUATION_STATS, {
          params: { evaluatorId },
        });
        console.log("Evaluation stats:", response.data.stats);
        const evalStat = response.data.stats;
        setEvaluatedStats({
          evaluated: evalStat.evaluated || 0,
          pending: evalStat.pending || 0,
          total: evalStat.total || 0,
        });
        
      };
      fetchEvaluationStats();
    } catch (error) {
      console.error("Error fetching evaluated count:", error.message);
      setError("Failed to fetch evaluated count");
    }
  }, [assignedCopies]);



  useEffect(() => {
    if (!assignedCopies.length) return;

    if (searchTerm) {
      const filtered = assignedCopies.filter((copy) => {
        const copyId = copy.copyId || copy;
        return copyId.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredCopies(filtered);
    } else {
      setFilteredCopies(assignedCopies);
    }

    setPage(1); // Reset to first page when filter changes
  }, [searchTerm, assignedCopies]);

  const handleEvaluate = (copy) => {
    const copyId = copy.copyId || copy;
    navigate(`/evaluate/${copyId}`);
  };

  // Calculate copies for current page
  const currentCopies = filteredCopies.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header panel with title and search */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Assigned Answer Scripts
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and evaluate your assigned answer scripts
            </p>
          </div>

          <div className="flex items-center">
            
            <TextField
              placeholder="Search by copy ID..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" className="text-gray-400" />
                    </InputAdornment>
                  ),
                },
                root: {
                  sx: {
                    borderRadius: "9999px",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgb(229, 231, 235)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgb(209, 213, 219)",
                    },
                  },
                },
              }}
              sx={{ minWidth: "250px" }}
            />
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Assigned
                </p>
                <p className="text-xl font-semibold mt-1">
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    evaluatedStats.total
                  )}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Assignment className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Evaluated</p>
                <p className="text-xl font-semibold mt-1">{evaluatedStats.evaluated}</p>
              </div>
              <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-xl font-semibold mt-1">
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    assignedCopies.length
                  )}
                </p>
              </div>
              <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <AccessTimeIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Partially-Checked - work on this
                </p>
                <p className="text-xl font-semibold mt-1">0</p>
              </div>
              <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <PendingActionsIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copies table */}
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <CircularProgress size={40} />
            <p className="mt-4 text-gray-500">
              Loading your assigned copies...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="bg-red-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">{error}</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          </div>
        ) : filteredCopies.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Copy ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date Assigned
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCopies.map((copy) => {
                    const copyId = copy.copyId || copy;
                    const assignedAt = copy.assignedAt
                      ? new Date(copy.assignedAt)
                      : new Date();

                    // Format the date nicely
                    const formattedDate = assignedAt.toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    );

                    return (
                      <tr
                        key={copyId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
                              <Assignment />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {copyId}
                              </div>
                              <div className="text-xs text-gray-500">
                                Answer Script
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formattedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {/* <button
                            onClick={() => handleEvaluate(copy)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150"
                          >
                            Evaluate
                            <ArrowForwardIos
                              className="ml-1.5"
                              style={{ fontSize: "12px" }}
                            />
                          </button> */}



<button
  onClick={() => handleEvaluate(copy)}
  className="inline-flex items-center px-5 py-1.5 text-xs uppercase tracking-wider font-medium text-gray-800 border hover:bg-blue-100 border-gray-300 hover:border-gray-800 rounded-sm transition-all duration-150"
>
  Evaluate
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
</button>



                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredCopies.length > itemsPerPage && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-center">
                <Pagination
                  count={Math.ceil(filteredCopies.length / itemsPerPage)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                  size="medium"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-16 w-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No copies found
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? "No copies match your search criteria. Try a different search term."
                : "You don't have any copies assigned to you yet. Check back later or contact your administrator."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
