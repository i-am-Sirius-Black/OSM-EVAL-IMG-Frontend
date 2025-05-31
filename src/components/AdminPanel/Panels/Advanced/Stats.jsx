// //?v3  ui update needed data stats(latest version)
// import React, { useState, useEffect } from "react";
// import { Assignment, Autorenew, CheckCircle } from "@mui/icons-material";

// const Stats = () => {
//   const [loading, setLoading] = useState(true);
//   const [courseFilter, setCourseFilter] = useState("all");
//   const [statsData, setStatsData] = useState(null);

//   // Mock data - replace with API call
//   useEffect(() => {
//     // Simulate API fetch
//     setTimeout(() => {
//       const mockData = {
//         overview: {
//           totalEvaluations: 12875,
//           totalReevaluations: 521,
//           totalModerations: 943,
//         },
//         courses: [
//           { id: "bsc", name: "Bachelor of Science" },
//           { id: "btech", name: "Bachelor of Technology" },
//           { id: "beng", name: "Bachelor of Engineering" },
//         ],
//         courseData: [
//           {
//             id: "bsc",
//             name: "Bachelor of Science",
//             count: 4850,
//             completion: 92,
//           },
//           {
//             id: "beng",
//             name: "Bachelor of Engineering",
//             count: 3240,
//             completion: 87,
//           },
//           {
//             id: "bcom",
//             name: "Bachelor of Commerce",
//             count: 2180,
//             completion: 95,
//           },
//         ],
//       };

//       setStatsData(mockData);
//       setLoading(false);
//     }, 1200);
//   }, []);

//   // Handle click on a specific metric to drill down
//   const handleDrillDown = (metricType, value) => {
//     // In a real implementation, you would navigate to a filtered view
//     alert(`Drilling down to ${metricType}: ${value}`);
//   };

//   // Get filtered course data
//   const getFilteredCourseData = () => {
//     if (!statsData) return [];
//     if (courseFilter === "all") return statsData.courseData;
//     return statsData.courseData.filter((course) => course.id === courseFilter);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow">
//       {/* Header */}
//       <div className="flex justify-between px-6 py-4 border-b border-gray-200">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">
//             Evaluation Analytics
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Key metrics for evaluation, re-evaluation, and moderation
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="px-6 py-2 border-b border-gray-200 flex flex-wrap gap-4 items-center">

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Course
//             </label>
//             <select
//               value={courseFilter}
//               onChange={(e) => setCourseFilter(e.target.value)}
//               className="px-3 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Courses</option>
//               {statsData?.courses.map((course) => (
//                 <option key={course.id} value={course.id}>
//                   {course.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Dashboard Content */}
//       {loading ? (
//         <div className="flex justify-center items-center h-65">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       ) : (
//         <div className="p-6">
//           <div className="flex flex-col md:flex-row gap-6">
//             {/* Left Side - Stacked Stats Cards */}
//             <div className="w-full md:w-1/3 flex flex-col gap-6">
//               <div
//                 className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//                 onClick={() =>
//                   handleDrillDown(
//                     "evaluations",
//                     statsData.overview.totalEvaluations
//                   )
//                 }
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Total Evaluations
//                     </p>
//                     <p className="mt-1 text-3xl font-semibold text-gray-900">
//                       {statsData.overview.totalEvaluations.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
//                     <Assignment className="h-6 w-6 text-blue-600" />
//                   </div>
//                 </div>
//               </div>

//               <div
//                 className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//                 onClick={() =>
//                   handleDrillDown(
//                     "reevaluations",
//                     statsData.overview.totalReevaluations
//                   )
//                 }
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Re-evaluation Requests
//                     </p>
//                     <p className="mt-1 text-3xl font-semibold text-gray-900">
//                       {statsData.overview.totalReevaluations.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
//                     <Autorenew className="h-6 w-6 text-purple-600" />
//                   </div>
//                 </div>
//                 <div className="mt-2 text-sm text-gray-600">
//                   <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
//                     {(
//                       (statsData.overview.totalReevaluations /
//                         statsData.overview.totalEvaluations) *
//                       100
//                     ).toFixed(1)}
//                     % of total
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Right Side - Course Evaluation Progress */}
//             <div className="w-full md:w-2/3">
//               <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm h-full">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">
//                   Evaluation Progress by Course
//                 </h3>
//                 <div className="space-y-5">
//                   {getFilteredCourseData().map((course, index) => (
//                     <div key={index} className="flex items-center">
//                       <div className="w-48 truncate text-sm font-medium text-gray-800">
//                         {course.name}
//                       </div>
//                       <div className="flex-grow mx-2">
//                         <div className="relative w-full bg-gray-200 rounded-full h-5">
//                           <div
//                             className="h-5 rounded-full bg-blue-600"
//                             style={{ width: `${course.completion}%` }}
//                           ></div>
//                           <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold">
//                             {course.completion}% Complete
//                           </div>
//                         </div>
//                       </div>
//                       <div className="w-20 text-right text-sm text-gray-600">
//                         {course.count}
//                         <div className="text-xs text-gray-500">Papers</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Stats;



//? Simple Stats 

// import React, { useState, useEffect } from "react";
// import { Assignment, Autorenew } from "@mui/icons-material";
// import api from "../../../../api/axios";

// const Stats = () => {
//   const [loading, setLoading] = useState(true);
//   const [statsData, setStatsData] = useState({
//     totalEvaluations: 0,
//     totalReevaluations: 0
//   });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get("/api/admin/stats/evaluation");
//         setStatsData(response.data);
//       } catch (error) {
//         console.error("Error fetching evaluation statistics:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <div className="bg-white rounded-lg shadow">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Evaluation Analytics
//         </h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Key metrics for evaluation and re-evaluation
//         </p>
//       </div>

//       {/* Dashboard Content */}
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       ) : (
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Total Evaluations Card */}
//             <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Total Evaluations
//                   </p>
//                   <p className="mt-1 text-3xl font-semibold text-gray-900">
//                     {statsData.totalEvaluations.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center">
//                   <Assignment className="h-7 w-7 text-blue-600" />
//                 </div>
//               </div>
//             </div>

//             {/* Re-evaluation Requests Card */}
//             <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Re-evaluation Requests
//                   </p>
//                   <p className="mt-1 text-3xl font-semibold text-gray-900">
//                     {statsData.totalReevaluations.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="h-14 w-14 bg-purple-50 rounded-full flex items-center justify-center">
//                   <Autorenew className="h-7 w-7 text-purple-600" />
//                 </div>
//               </div>
//               <div className="mt-2 text-sm text-gray-600">
//                 {statsData.totalEvaluations > 0 && (
//                   <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
//                     {(
//                       (statsData.totalReevaluations / statsData.totalEvaluations) *
//                       100
//                     ).toFixed(1)}
//                     % of total
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Stats;


//?v3 Simple stats with rejected copies also 

import React, { useState, useEffect } from "react";
import { Assignment, Autorenew, Cancel, DoDisturbOn } from "@mui/icons-material";
import api from "../../../../api/axios";

const Stats = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalEvaluations: 0,
    totalReevaluations: 0,
    totalRejected: 0,
    totalCopies: 0
  });
  const [timeRange, setTimeRange] = useState("all"); // all, today, week, month

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/admin/stats/evaluation?timeRange=${timeRange}`);
        setStatsData(response.data);
      } catch (error) {
        console.error("Error fetching evaluation statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with time range filter */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Evaluation Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Key metrics for evaluation process
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Dashboard Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Evaluations Card */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Evaluations
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {statsData.totalEvaluations.toLocaleString()}
                  </p>
                </div>
                <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center">
                  <Assignment className="h-7 w-7 text-blue-600" />
                </div>
              </div>
              {statsData.totalCopies > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                    {(
                      (statsData.totalEvaluations / statsData.totalCopies) *
                      100
                    ).toFixed(1)}
                    % completion
                  </span>
                </div>
              )}
            </div>

            {/* Re-evaluation Requests Card */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Re-evaluation Requests
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {statsData.totalReevaluations.toLocaleString()}
                  </p>
                </div>
                <div className="h-14 w-14 bg-purple-50 rounded-full flex items-center justify-center">
                  <Autorenew className="h-7 w-7 text-purple-600" />
                </div>
              </div>
              {statsData.totalEvaluations > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                    {(
                      (statsData.totalReevaluations / statsData.totalEvaluations) *
                      100
                    ).toFixed(1)}
                    % of evaluations
                  </span>
                </div>
              )}
            </div>

            {/* Rejected Copies Card */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Rejected Copies
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {statsData.totalRejected.toLocaleString()}
                  </p>
                </div>
                <div className="h-14 w-14 bg-red-50 rounded-full flex items-center justify-center">
                  <DoDisturbOn className="h-7 w-7 text-red-600" />
                </div>
              </div>
              {statsData.totalCopies > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                    {(
                      (statsData.totalRejected / statsData.totalCopies) *
                      100
                    ).toFixed(1)}
                    % rejection rate
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
