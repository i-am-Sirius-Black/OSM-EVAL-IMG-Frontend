// //*Working version with all features

// import { useState, useEffect } from "react";
// import {
//   Pagination,
//   TextField,
//   InputAdornment,
//   CircularProgress,
//   Tooltip,
// } from "@mui/material";
// import { Search, Assignment, ArrowForwardIos } from "@mui/icons-material";
// import PendingActionsIcon from "@mui/icons-material/PendingActions";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import CheckIcon from "@mui/icons-material/Check";
// import { useNavigate } from "react-router-dom";

// export default function Evaluation({
//   currentCopies,
//   filteredCopies,
//   evaluatedStats,
//   searchTerm,
//   setSearchTerm,
//   page,
//   setPage,
//   itemsPerPage,
//   error,
//   loading,
// }) {
//   const navigate = useNavigate();

//   const handleEvaluate = (copy) => {
//     const copyId = copy.copyId || copy;
//     navigate(`/evaluate/${copyId}`);
//   };

//   return (
//     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//       {/* Header panel with title and search */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Assigned Answer Scripts
//             </h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Manage and evaluate your assigned answer scripts
//             </p>
//           </div>

//           <div className="flex items-center">
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
//                 <p className="text-xl font-semibold mt-1">
//                   {loading ? (
//                     <CircularProgress size={24} />
//                   ) : (
//                     evaluatedStats.total
//                   )}
//                 </p>
//               </div>
//               <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
//                 <Assignment className="text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Evaluated</p>
//                 <p className="text-xl font-semibold mt-1">
//                   {evaluatedStats.evaluated}
//                 </p>
//               </div>
//               <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
//                 <CheckIcon className="h-6 w-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Pending</p>
//                 <p className="text-xl font-semibold mt-1">
//                   {loading ? (
//                     <CircularProgress size={24} />
//                   ) : (
//                     evaluatedStats.pending
//                   )}
//                 </p>
//               </div>
//               <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
//                 <AccessTimeIcon className="h-6 w-6 text-amber-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">
//                   Partially-Checked
//                 </p>
//                 <p className="text-xl font-semibold mt-1">
//                   {evaluatedStats.partial}
//                 </p>
//               </div>
//               <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
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
//                   {currentCopies.map((copy) => {
//                     const copyId = copy.copyId || copy;
//                     const assignedAt = copy.assignedAt
//                       ? new Date(copy.assignedAt)
//                       : new Date();

//                     // Format the date nicely
//                     const formattedDate = assignedAt.toLocaleDateString(
//                       "en-IN",
//                       {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       }
//                     );

//                     return (
//                       <tr
//                         key={copyId}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${copy.partial ? "text-yellow-600 bg-yellow-100" : "text-blue-600 bg-blue-100"}`}>
//                               <Assignment />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {copyId}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 Answer Script
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               copy.partial
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : "bg-gray-100 text-gray-800"
//                             }`}
//                           >
//                             {copy.partial ? "Partially Checked" : "Pending"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {formattedDate}
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <button
//                             onClick={() => handleEvaluate(copy)}
//                             className={`inline-flex items-center px-5 py-1.5 text-xs uppercase tracking-wider font-medium hover:translate-x-0.5 ${
//                               copy.partial
//                                 ? "text-gray-800 border hover:bg-yellow-100 border-gray-300 hover:border-gray-800"
//                                 : "text-gray-800 border hover:bg-blue-100 border-gray-300 hover:border-gray-800"
//                             } rounded-sm transition-all duration-150`}
//                           >
//                             {copy.partial ? "Continue" : "Evaluate"}

//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="h-3 w-3 ml-2"
//                               viewBox="0 0 20 20"
//                               fill="currentColor"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
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

//* v2 Updated Evaluation logic

// import { useState, useEffect } from "react";
// import {
//   Pagination,
//   TextField,
//   InputAdornment,
//   CircularProgress,
// } from "@mui/material";
// import { Search, Assignment, MenuBook } from "@mui/icons-material";
// import PendingActionsIcon from "@mui/icons-material/PendingActions";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import CheckIcon from "@mui/icons-material/Check";
// import { useNavigate } from "react-router-dom";

// export default function Evaluation({
//   assignedSubjects,
//   filteredSubjects,
//   evaluatedStats,
//   searchTerm,
//   setSearchTerm,
//   page,
//   setPage,
//   itemsPerPage,
//   error,
//   loading,
//   onSelectSubject,
// }) {
//   const navigate = useNavigate();

//   // Handle subject selection
//   const handleSelectSubject = (subject) => {
//     onSelectSubject(subject);
//     navigate(`/subject-copies/${subject.subjectId}`);
//   };

//   return (
//     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//       {/* Header panel with title and search */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Assigned Subjects
//             </h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Select a subject to evaluate assigned answer scripts
//             </p>
//           </div>

//           <div className="flex items-center">
//             <TextField
//               placeholder="Search subject..."
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
//                 <p className="text-xl font-semibold mt-1">
//                   {loading ? (
//                     <CircularProgress size={24} />
//                   ) : (
//                     evaluatedStats.total
//                   )}
//                 </p>
//               </div>
//               <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
//                 <Assignment className="text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Evaluated</p>
//                 <p className="text-xl font-semibold mt-1">
//                   {evaluatedStats.evaluated}
//                 </p>
//               </div>
//               <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
//                 <CheckIcon className="h-6 w-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Pending</p>
//                 <p className="text-xl font-semibold mt-1">
//                   {loading ? (
//                     <CircularProgress size={24} />
//                   ) : (
//                     evaluatedStats.pending
//                   )}
//                 </p>
//               </div>
//               <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
//                 <AccessTimeIcon className="h-6 w-6 text-amber-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">
//                   Partially-Checked
//                 </p>
//                 <p className="text-xl font-semibold mt-1">
//                   {evaluatedStats.partial}
//                 </p>
//               </div>
//               <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
//                 <PendingActionsIcon className="h-6 w-6 text-yellow-600" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Subjects table */}
//       <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-16">
//             <CircularProgress size={40} />
//             <p className="mt-4 text-gray-500">Loading your assigned subjects...</p>
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
//         ) : filteredSubjects.length > 0 ? (
//           <>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Subject
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Copies Available
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Completed
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Time Remaining
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
//                   {filteredSubjects.map((subject) => {
//                     // Calculate time remaining for assignment expiry
//                     const assignedAt = new Date(subject.assignedAt || Date.now());
//                     const expiryTime = new Date(assignedAt.getTime() + 24 * 60 * 60 * 1000);
//                     const now = new Date();
//                     const hoursRemaining = Math.max(0, Math.floor((expiryTime - now) / (1000 * 60 * 60)));
//                     const minutesRemaining = Math.max(0, Math.floor(((expiryTime - now) % (1000 * 60 * 60)) / (1000 * 60)));

//                     return (
//                       <tr
//                         key={subject.subjectId}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center bg-blue-100 text-blue-600">
//                               <MenuBook />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {subject.subjectName}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {subject.subjectCode}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{subject.availableCopies} copies</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-green-600 h-2 rounded-full"
//                               style={{ width: `${(subject.completedCopies / subject.totalAssigned) * 100}%` }}
//                             ></div>
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             {subject.completedCopies}/{subject.totalAssigned} copies
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className={`text-sm font-medium ${hoursRemaining < 3 ? 'text-red-600' : 'text-gray-700'}`}>
//                             {hoursRemaining}h {minutesRemaining}m
//                           </div>
//                           <div className="text-xs text-gray-500">Until expiry</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <button
//                             onClick={() => handleSelectSubject(subject)}
//                             className="inline-flex items-center px-5 py-1.5 text-xs uppercase tracking-wider font-medium hover:translate-x-0.5 text-gray-800 border hover:bg-blue-100 border-gray-300 hover:border-gray-800 rounded-sm transition-all duration-150"
//                           >
//                             View Copies
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="h-3 w-3 ml-2"
//                               viewBox="0 0 20 20"
//                               fill="currentColor"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {filteredSubjects.length > itemsPerPage && (
//               <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-center">
//                 <Pagination
//                   count={Math.ceil(filteredSubjects.length / itemsPerPage)}
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
//               No subjects assigned
//             </h3>
//             <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
//               {searchTerm
//                 ? "No subjects match your search criteria. Try a different search term."
//                 : "You don't have any subjects assigned to you yet. Please check back later or contact your administrator."}
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





//?V 7.1 clean look, with dropdown instead of tabs

import { useState, useEffect } from "react";
import { Assignment, CheckCircle, AccessTime, MenuBook, KeyboardArrowDown } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

export default function Evaluation({setActiveTab}) {
  const navigate = useNavigate();
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeBatch, setActiveBatch] = useState(null);
  const [copies, setCopies] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState({
    subjects: true,
    batch: false
  });
  const [error, setError] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  // First, fetch all assigned subjects with isCopyAssigned flag
  useEffect(() => {
    const fetchAssignedSubjects = async () => {
      try {
        setLoading(prev => ({ ...prev, subjects: true }));
        const response = await api.get("/api/evaluator/assigned-subjects");
        setAssignedSubjects(response.data.subjects);
        
        // Auto-select the first active subject
        const activeSubjects = response.data.subjects.filter(s => s.isCopyAssigned);
        if (activeSubjects.length > 0) {
          setSelectedSubject(activeSubjects[0].subjectCode);
        }
      } catch (err) {
        console.error("Error fetching assigned subjects:", err);
        setError("Failed to load your assigned subjects. Please refresh and try again.");
      } finally {
        setLoading(prev => ({ ...prev, subjects: false }));
      }
    };

    fetchAssignedSubjects();
  }, []);

  // When a subject is selected, fetch its active batch
  useEffect(() => {
    if (!selectedSubject) {
      setActiveBatch(null);
      setCopies([]);
      return;
    }

    const fetchActiveBatch = async () => {
      try {
        setLoading(prev => ({ ...prev, batch: true }));
        const response = await api.get(`/api/evaluator/current-batch/${selectedSubject}`);
        
        if (response.data.hasBatch) {
          setActiveBatch(response.data.batch);
          setCopies(response.data.batch.copies || []);
        } else {
          setActiveBatch(null);
          setCopies([]);
        }
      } catch (err) {
        console.error("Error fetching active batch:", err);
        setError("Failed to load copies for this subject. Please refresh and try again.");
        setActiveBatch(null);
        setCopies([]);
      } finally {
        setLoading(prev => ({ ...prev, batch: false }));
      }
    };

    fetchActiveBatch();
  }, [selectedSubject]);

  const handleSubjectChange = (subjectCode) => {
    setSelectedSubject(subjectCode);
    setDropdownOpen(false);
  };

  // const handleEvaluate = (copyBarcode) => {
  //   navigate(`/evaluate/${copyBarcode}`);
  // };


// Frontend: Navigate with state (secure)
const handleEvaluate = (copyBarcode) => {
  navigate("/evaluate", {
    state: { copyId: copyBarcode, subjectCode: selectedSubject }, // 🔒 Hidden from URL
  });
};

  // // Calculate stats for current batch
  // const completedCount = copies.filter(copy => copy.isChecked).length;
  // const pendingCount = copies.length - completedCount;
  // const progressPercent = copies.length > 0 ? Math.round((completedCount / copies.length) * 100) : 0;

  // Get active subjects (with copies assigned)
  const activeSubjects = assignedSubjects.filter(subject => subject.isCopyAssigned);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.subject-dropdown')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Evaluate Answer Scripts</h1>
            <p className="mt-1 text-sm text-gray-500">View and evaluate your assigned copies</p>
          </div>
          
          {/* Subject Dropdown Selector */}
          {activeSubjects.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-sm font-black text-gray-800">{activeSubjects.length} Active {activeSubjects.length > 1 ? "Subjects" : "Subject"}:</div>
              <div className="relative subject-dropdown">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between w-full md:w-56 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div className="flex items-center">
                  <MenuBook className="mr-2 h-5 w-5 text-gray-500" />
                  {selectedSubject || "Select Subject"}
                </div>
                <KeyboardArrowDown className={`ml-2 h-5 w-5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {activeSubjects.map((subject) => (
                      <button
                        key={subject.subjectCode}
                        onClick={() => handleSubjectChange(subject.subjectCode)}
                        className={`block w-full text-left px-4 py-2 text-sm ${selectedSubject === subject.subjectCode ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <MenuBook className="h-4 w-4 mr-2" />
                          {subject.subjectCode}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Show loading state for subjects */}
      {loading.subjects && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Active batch info */}

{!loading.subjects && activeBatch && (
  <div className="mb-6">
    <div className="bg-white px-5 py-4 rounded-lg shadow-sm border border-gray-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      
      {/* Left: Info Section */}
      <div className="flex-1 min-w-[280px]">
        <h2 className="text-xl font-semibold text-gray-900">
          {activeBatch.subjectCode} — {activeBatch.examName}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Assigned: <span className="font-medium text-gray-700">{new Date(activeBatch.assignedAt).toLocaleDateString()}</span>
          &nbsp; • &nbsp;
          Expires: <span className="font-medium text-gray-700">{new Date(activeBatch.expiresAt).toLocaleString()}</span>
        </p>
      </div>

      {/* Right: Summary Stats */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-800">
        <div className="flex items-center gap-2 min-w-[120px]" title="Total Copies">
          <Assignment className="text-blue-600 w-5 h-5" />
          <span className="font-medium">{activeBatch.totalCount} Copies</span>
        </div>

        <div className="flex items-center gap-2 min-w-[120px]" title="Checked Copies">
          <CheckCircle className="text-green-600 w-5 h-5" />
          <span className="font-medium">{activeBatch.checkedCount} Checked</span>
        </div>

        <div className="flex items-center gap-2 min-w-[120px]" title="Pending Copies">
          <AccessTime className="text-yellow-500 w-5 h-5" />
          <span className="font-medium">{activeBatch.pendingCount} Pending</span>
        </div>

        <div className="flex items-center gap-2 min-w-[140px]" title="Expires In">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">
            {`${Math.max(0, Math.floor((new Date(activeBatch.expiresAt) - new Date()) / (1000 * 60 * 60)))}h ` +
              `${Math.max(0, Math.floor(((new Date(activeBatch.expiresAt) - new Date()) % (1000 * 60 * 60)) / (1000 * 60)))}m`}
          </span>
        </div>
      </div>
    </div>
  </div>
)}







      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        {loading.batch ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <ErrorMessage error={error} />
        ) : !activeBatch && !loading.subjects ? (
          <NoBatchMessage activeSubjects={activeSubjects.length > 0} handleTabChange={handleTabChange} />
        ) : (

<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 pr-10 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
      </tr>
    </thead>
  </table>

  {/* Scrollable table body */}
  <div className="max-h-[40vh] overflow-y-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <tbody className="bg-white divide-y divide-gray-200">
        {copies.map((copy, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{"copy " + idx}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {copy.isChecked ? (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Checked
                </span>
              ) : (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => handleEvaluate(copy.copyBarcode)}
                disabled={copy.isChecked}
                className={`inline-flex items-center px-3 py-1 border text-sm font-medium rounded-md ${
                  copy.isChecked
                    ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                {copy.isChecked ? "Evaluated" : "Evaluate"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        )}
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, color }) {
  const bgMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600"
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-md ${bgMap[color]}`}>{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ error }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto h-12 w-12 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="mt-2 text-lg font-medium text-gray-900">{error}</h3>
      <p className="mt-1 text-sm text-gray-500">Please try refreshing the page.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Refresh
      </button>
    </div>
  );
}

function NoBatchMessage({ activeSubjects, handleTabChange }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto h-12 w-12 text-gray-400">
        <Assignment className="h-12 w-12" />
      </div>
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        {activeSubjects ? "Select a subject from the dropdown" : "No copies assigned"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {activeSubjects 
          ? "Please select a subject from the dropdown above to view copies." 
          : "You haven't requested any copies for evaluation yet."}
      </p>
      {!activeSubjects && (
        <div className="mt-6">
          <a
            onClick={() => handleTabChange(1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Assign Copies
          </a>
        </div>
      )}
    </div>
  );
}

