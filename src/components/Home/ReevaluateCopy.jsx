import React, { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

// Mock data for development and testing
const mockRequest = {
  requestId: "RE001",
  copyId: "44012345",
  assignedAt: "2025-05-15T10:30:00Z",
  subjectName: "Mathematics",
  courseName: "B.Sc. First Year",
};

const ReevaluateCopy = ({ request = mockRequest }) => {
  const [loading, setLoading] = useState(false);

  const handleStartReevaluation = async () => {
    setLoading(true);
    try {
      // Redirect to the evaluation page with the copy ID
      //   window.location.href = `/evaluate/${request.copyId}?reevaluation=true`;
      toast("Testing reevaluation...", { icon: "🔄" });
      setLoading(false);
    } catch (error) {
      console.error("Error starting reevaluation:", error);
      setLoading(false);
    }
  };

  // Format the date in a readable format
  const formattedDate = request?.assignedAt
    ? new Date(request.assignedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not assigned";

//   return (
//     <div className="max-w-6xl mt-10 rounded-2xl mx-auto py-6 sm:px-6 lg:px-8 bg-white">
//       <div className="mb-8">
//         <div className="mb-4">
//           <h1 className="text-xl font-medium text-gray-800">Re-evaluate Copy</h1>
//           <p className="mt-2 text-sm text-gray-500">
//             Re-evaluate the copy for the student.{" "}
//           </p>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
//           {/* Top section with status badge */}
//           <div className="relative">
//             <div className="absolute top-0 right-0 mt-3 mr-3">
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
//                 Re-evaluation
//               </span>
//             </div>
//           </div>

//           {/* Content section */}
//           <div className="p-5">
//             <h3 className="text-lg font-semibold text-gray-800 mb-1">
//               Copy1 ******
//             </h3>

//             <div className="flex items-center text-sm text-gray-500 mb-4">
//               <svg
//                 className="h-4 w-4 mr-1"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//               {formattedDate}
//             </div>

//             <div className="space-y-3 mb-5">
//               <div className="flex items-center">
//                 <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
//                   <svg
//                     className="w-3 h-3 text-indigo-500"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Subject</p>
//                   <p className="text-sm font-medium">
//                     {request?.subjectName || "Unknown"}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center">
//                 <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
//                   <svg
//                     className="w-3 h-3 text-green-500"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Course</p>
//                   <p className="text-sm font-medium">
//                     {request?.courseName || "Unknown"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Button section */}
//           <div className="px-5 pb-5">
//             <button
//               onClick={handleStartReevaluation}
//               disabled={loading}
//               className="w-full flex items-center justify-center text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-4 h-4 mr-2"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
//                   />
//                 </svg>
//               )}
//               {loading ? "Starting..." : "Start Re-evaluation"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

{/* Uncomment the above code to use the component in your application */}

// return (
//   <div className="max-w-2xl mx-auto py-12 px-4">
//     {/* Header */}
//     <div className="mb-8">
//       <h1 className="text-2xl font-medium text-gray-900 mb-2">Re-evaluate Copy</h1>
//       <p className="text-gray-600">Re-evaluate the copy for the student.</p>
//     </div>

//     {/* Main Card */}
//     <div className="bg-white border border-gray-200 rounded-lg p-6">
//       {/* Status and Title */}
//       <div className="flex items-start justify-between mb-6">
//         <div>
//           <h2 className="text-lg font-medium text-gray-900 mb-1">Copy1 ******</h2>
//           <div className="flex items-center text-sm text-gray-500">
//             <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             {formattedDate}
//           </div>
//         </div>
//         <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
//           Re-evaluation
//         </span>
//       </div>

//       {/* Course Info */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div>
//           <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Subject</div>
//           <div className="text-sm text-gray-900">{request?.subjectName || "Unknown"}</div>
//         </div>
//         <div>
//           <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Course</div>
//           <div className="text-sm text-gray-900">{request?.courseName || "Unknown"}</div>
//         </div>
//       </div>

//       {/* Action Button */}
//       <button
//         onClick={handleStartReevaluation}
//         disabled={loading}
//         className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {loading ? (
//           <>
//             <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Starting...
//           </>
//         ) : (
//           "Start Re-evaluation"
//         )}
//       </button>
//     </div>
//   </div>
// );


{/* version-3 */}

return (
  <div className="max-w-6xl mx-auto py-8 px-4">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Re-evaluate Copy</h1>
        <p className="text-gray-600 text-sm">Re-evaluate the copy for the student.</p>
      </div>

      {/* Main Card */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-l font-semibold text-gray-900 mb-2">Copy1 ******</h2>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              Re-evaluation
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Course Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Subject</p>
                  <p className="text-base font-semibold text-gray-900">
                    {request?.subjectName || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Course</p>
                  <p className="text-base font-semibold text-gray-900">
                    {request?.courseName || "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleStartReevaluation}
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Re-evaluation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);

};

export default ReevaluateCopy;
