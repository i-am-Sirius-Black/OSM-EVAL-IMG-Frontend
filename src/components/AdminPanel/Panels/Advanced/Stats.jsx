//?v3  ui update needed data stats(latest version)
import React, { useState, useEffect } from 'react';
import { Assignment, Autorenew, CheckCircle } from '@mui/icons-material';

const Stats = () => {
  const [loading, setLoading] = useState(true);
  const [sessionFilter, setSessionFilter] = useState('2025-2026');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statsData, setStatsData] = useState(null);

  // Mock data - replace with API call
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockData = {
        overview: {
          totalEvaluations: 12875,
          totalReevaluations: 521,
          totalModerations: 943
        },
        sessions: ['2023-2024', '2024-2025', '2025-2026'],
        courses: [
          { id: 'bsc', name: 'Bachelor of Science' },
          { id: 'btech', name: 'Bachelor of Technology' },
          { id: 'beng', name: 'Bachelor of Engineering' },
          { id: 'bcom', name: 'Bachelor of Commerce' },
          { id: 'ba', name: 'Bachelor of Arts' }
        ],
        courseData: [
          { id: 'bsc', name: 'Bachelor of Science', count: 4850, completion: 92 },
          { id: 'beng', name: 'Bachelor of Engineering', count: 3240, completion: 87 },
          { id: 'bcom', name: 'Bachelor of Commerce', count: 2180, completion: 95 },
          { id: 'ba', name: 'Bachelor of Arts', count: 1840, completion: 98 },
          { id: 'btech', name: 'Bachelor of Technology', count: 765, completion: 78 }
        ]
      };
      
      setStatsData(mockData);
      setLoading(false);
    }, 1200);
  }, []);

  // Handle click on a specific metric to drill down
  const handleDrillDown = (metricType, value) => {
    // In a real implementation, you would navigate to a filtered view
    alert(`Drilling down to ${metricType}: ${value}`);
  };

  // Get filtered course data
  const getFilteredCourseData = () => {
    if (!statsData) return [];
    if (courseFilter === 'all') return statsData.courseData;
    return statsData.courseData.filter(course => course.id === courseFilter);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Evaluation Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">
          Key metrics for evaluation, re-evaluation, and moderation
        </p>
      </div>
      
      {/* Filters */}
      <div className="px-6 py-2 border-b border-gray-200 flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
          <select 
            value={sessionFilter} 
            onChange={(e) => setSessionFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {statsData?.sessions.map(session => (
              <option key={session} value={session}>{session}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <select 
            value={courseFilter} 
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Courses</option>
            {statsData?.courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Dashboard Content */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="p-6">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleDrillDown('evaluations', statsData.overview.totalEvaluations)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Evaluations</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{statsData.overview.totalEvaluations.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Assignment className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div 
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleDrillDown('reevaluations', statsData.overview.totalReevaluations)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Re-evaluation Requests</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{statsData.overview.totalReevaluations.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <Autorenew className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  {((statsData.overview.totalReevaluations / statsData.overview.totalEvaluations) * 100).toFixed(1)}% of total
                </span>
              </div>
            </div>
            
            <div 
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleDrillDown('moderations', statsData.overview.totalModerations)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Moderated Papers</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{statsData.overview.totalModerations.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  {((statsData.overview.totalModerations / statsData.overview.totalEvaluations) * 100).toFixed(1)}% of total
                </span>
              </div>
            </div>
          </div>
          
          {/* Course Evaluation Progress */}
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluation Progress by Course</h3>
            <div className="space-y-5">
              {getFilteredCourseData().map((course, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-48 truncate text-sm font-medium text-gray-800">{course.name}</div>
                  <div className="flex-grow mx-2">
                    <div className="relative w-full bg-gray-200 rounded-full h-5">
                      <div 
                        className="h-5 rounded-full bg-blue-600" 
                        style={{ width: `${course.completion}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold">
                        {course.completion}% Complete
                      </div>
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm text-gray-600">
                    {course.count}
                    <div className="text-xs text-gray-500">Papers</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              Percentage indicates evaluation completion rate for session {sessionFilter}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;




//?v2 ui update str update (new version)
// import React, { useState, useEffect } from 'react';
// import { 
//   Assessment, TrendingUp, TrendingDown, BarChart, 
//   Assignment, Autorenew, CheckCircle, Warning 
// } from '@mui/icons-material';

// const Stats = () => {
//   const [loading, setLoading] = useState(true);
//   const [periodFilter, setPeriodFilter] = useState('last30days');
//   const [subjectFilter, setSubjectFilter] = useState('all');
//   const [statsData, setStatsData] = useState(null);
//   const [activeTab, setActiveTab] = useState('overview');

//   // Mock data - replace with API call
//   useEffect(() => {
//     // Simulate API fetch
//     setTimeout(() => {
//       const mockData = {
//         overview: {
//           totalEvaluations: 12875,
//           totalReevaluations: 521,
//           totalModerations: 943,
//           avgMarkChange: 4.2,
//           marksImproved: 312,
//           marksReduced: 164,
//           marksUnchanged: 45
//         },
//         topEvaluators: [
//           { name: 'John Smith', count: 48, avgAccuracy: 92 },
//           { name: 'Emily Clark', count: 37, avgAccuracy: 95 },
//           { name: 'Michael Brown', count: 35, avgAccuracy: 89 },
//           { name: 'Anna Johnson', count: 29, avgAccuracy: 91 },
//           { name: 'Robert Davis', count: 26, avgAccuracy: 94 }
//         ],
//         subjectData: [
//           { subject: 'Mathematics', evaluations: 3456, reevaluations: 142, moderations: 256, avgMarkChange: 5.7 },
//           { subject: 'Physics', evaluations: 2731, reevaluations: 108, moderations: 193, avgMarkChange: 4.2 },
//           { subject: 'Chemistry', evaluations: 2654, reevaluations: 96, moderations: 187, avgMarkChange: 3.8 },
//           { subject: 'Biology', evaluations: 2344, reevaluations: 89, moderations: 165, avgMarkChange: 4.5 },
//           { subject: 'Computer Science', evaluations: 1690, reevaluations: 86, moderations: 142, avgMarkChange: 3.2 }
//         ],
//         markChangeDistribution: [
//           { range: '0-2', count: 148 },
//           { range: '3-5', count: 213 },
//           { range: '6-10', count: 124 },
//           { range: '11-15', count: 26 },
//           { range: '>15', count: 10 }
//         ],
//         // New mock data for evaluation process
//         processData: {
//           courses: [
//             { name: 'Bachelor of Science', count: 4850, completion: 92 },
//             { name: 'Bachelor of Engineering', count: 3240, completion: 87 },
//             { name: 'Bachelor of Commerce', count: 2180, completion: 95 },
//             { name: 'Bachelor of Arts', count: 1840, completion: 98 },
//             { name: 'Bachelor of Technology', count: 765, completion: 78 }
//           ],
//           stages: {
//             pending: 872,
//             evaluation: 1453,
//             moderation: 278,
//             completed: 10272,
//             reevaluation: 521
//           },
//           evaluationTrends: [
//             { date: '2025-04-15', evaluations: 342, moderations: 31, reevaluations: 12 },
//             { date: '2025-04-22', evaluations: 287, moderations: 24, reevaluations: 15 },
//             { date: '2025-04-29', evaluations: 421, moderations: 37, reevaluations: 18 },
//             { date: '2025-05-06', evaluations: 375, moderations: 42, reevaluations: 21 },
//             { date: '2025-05-13', evaluations: 298, moderations: 27, reevaluations: 14 }
//           ]
//         }
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

//   // Get subjects from data
//   const subjects = statsData?.subjectData.map(item => item.subject) || [];

//   // Calculate process percentages
//   const getProcessPercentages = () => {
//     if (!statsData) return {};
    
//     const { pending, evaluation, moderation, completed, reevaluation } = statsData.processData.stages;
//     const total = pending + evaluation + moderation + completed + reevaluation;
    
//     return {
//       pending: ((pending / total) * 100).toFixed(1),
//       evaluation: ((evaluation / total) * 100).toFixed(1),
//       moderation: ((moderation / total) * 100).toFixed(1),
//       completed: ((completed / total) * 100).toFixed(1),
//       reevaluation: ((reevaluation / total) * 100).toFixed(1),
//     };
//   };

//   return (
//     <div className="bg-white rounded-lg shadow">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-800">Evaluation Analytics</h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Key metrics and insights for evaluation, re-evaluation, and moderation
//         </p>
//       </div>
      
//       {/* Filters */}
//       <div className="p-6 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
//         <div className="flex flex-wrap gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
//             <select 
//               value={periodFilter} 
//               onChange={(e) => setPeriodFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="last7days">Last 7 Days</option>
//               <option value="last30days">Last 30 Days</option>
//               <option value="last90days">Last 90 Days</option>
//               <option value="lastyear">Last Year</option>
//               <option value="all">All Time</option>
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
//             <select 
//               value={subjectFilter} 
//               onChange={(e) => setSubjectFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Subjects</option>
//               {subjects.map(subject => (
//                 <option key={subject} value={subject}>{subject}</option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         {/* Tabs for different views */}
//         <div className="flex border rounded-md overflow-hidden">
//           <button
//             onClick={() => setActiveTab('overview')}
//             className={`px-4 py-2 text-sm font-medium ${
//               activeTab === 'overview' 
//                 ? 'bg-blue-50 text-blue-700 border-blue-100' 
//                 : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             <Assessment className="h-4 w-4 mr-1 inline-block" />
//             Overview
//           </button>
//           <button
//             onClick={() => setActiveTab('process')}
//             className={`px-4 py-2 text-sm font-medium ${
//               activeTab === 'process' 
//                 ? 'bg-blue-50 text-blue-700 border-blue-100' 
//                 : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             <BarChart className="h-4 w-4 mr-1 inline-block" />
//             Process Flow
//           </button>
//         </div>
//       </div>
      
//       {/* Dashboard Content */}
//       {loading ? (
//         <div className="flex justify-center items-center h-96">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       ) : (
//         <div className="p-6">
//           {/* Top Stats Cards - Always visible */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div 
//               className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//               onClick={() => handleDrillDown('evaluations', statsData.overview.totalEvaluations)}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Total Evaluations</p>
//                   <p className="mt-1 text-3xl font-semibold text-gray-900">{statsData.overview.totalEvaluations.toLocaleString()}</p>
//                 </div>
//                 <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
//                   <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
            
//             <div 
//               className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//               onClick={() => handleDrillDown('reevaluations', statsData.overview.totalReevaluations)}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Re-evaluation Requests</p>
//                   <p className="mt-1 text-3xl font-semibold text-gray-900">{statsData.overview.totalReevaluations.toLocaleString()}</p>
//                 </div>
//                 <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
//                   <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="mt-2 text-sm text-gray-600">
//                 <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
//                   {((statsData.overview.totalReevaluations / statsData.overview.totalEvaluations) * 100).toFixed(1)}% of total
//                 </span>
//               </div>
//             </div>
            
//             <div 
//               className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//               onClick={() => handleDrillDown('moderations', statsData.overview.totalModerations)}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Moderated Papers</p>
//                   <p className="mt-1 text-3xl font-semibold text-gray-900">{statsData.overview.totalModerations.toLocaleString()}</p>
//                 </div>
//                 <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
//                   <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="mt-2 text-sm text-gray-600">
//                 <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
//                   {((statsData.overview.totalModerations / statsData.overview.totalEvaluations) * 100).toFixed(1)}% of total
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           {/* Tab Content */}
//           {activeTab === 'overview' ? (
//             // Overview tab content
//             <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Subject-wise Analysis</h3>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead>
//                     <tr>
//                       <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                       <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Evaluations</th>
//                       <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Re-evaluations</th>
//                       <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moderations</th>
//                       <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Re-eval Rate</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {statsData.subjectData.map((subject, index) => (
//                       <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleDrillDown('subject', subject.subject)}>
//                         <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{subject.subject}</td>
//                         <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{subject.evaluations.toLocaleString()}</td>
//                         <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{subject.reevaluations}</td>
//                         <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{subject.moderations}</td>
//                         <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {((subject.reevaluations / subject.evaluations) * 100).toFixed(1)}%
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ) : (
//             // Process Flow tab content
//             <div className="space-y-6">
//               {/* Process Flow Visualization */}
//               <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluation Workflow Status</h3>
                
//                 <div className="mb-6">
//                   {/* Workflow progression bar */}
//                   <div className="relative pt-12">
//                     {/* Stage percentages */}
//                     <div className="flex justify-between text-xs mb-1">
//                       <span>{getProcessPercentages().pending}%</span>
//                       <span>{getProcessPercentages().evaluation}%</span>
//                       <span>{getProcessPercentages().moderation}%</span>
//                       <span>{getProcessPercentages().completed}%</span>
//                       <span>{getProcessPercentages().reevaluation}%</span>
//                     </div>
                    
//                     {/* Progress bar */}
//                     <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
//                       <div className="h-full bg-yellow-400" style={{ width: `${getProcessPercentages().pending}%` }}></div>
//                       <div className="h-full bg-blue-400" style={{ width: `${getProcessPercentages().evaluation}%` }}></div>
//                       <div className="h-full bg-purple-400" style={{ width: `${getProcessPercentages().moderation}%` }}></div>
//                       <div className="h-full bg-green-400" style={{ width: `${getProcessPercentages().completed}%` }}></div>
//                       <div className="h-full bg-red-400" style={{ width: `${getProcessPercentages().reevaluation}%` }}></div>
//                     </div>
                    
//                     {/* Stage labels */}
//                     <div className="flex justify-between text-xs mt-2 font-medium">
//                       <span className="text-yellow-600">Pending</span>
//                       <span className="text-blue-600">Evaluation</span>
//                       <span className="text-purple-600">Moderation</span>
//                       <span className="text-green-600">Completed</span>
//                       <span className="text-red-600">Re-evaluation</span>
//                     </div>
                    
//                     {/* Stage connectors (workflow arrows) - Absolute positioned on top of the bar */}
//                     <div className="absolute top-0 left-0 w-full flex justify-between">
//                       <div className="w-1/5 flex justify-center">
//                         <div className="h-8 border-l-2 border-dashed border-gray-300"></div>
//                       </div>
//                       <div className="w-1/5 flex justify-center">
//                         <div className="h-8 border-l-2 border-dashed border-gray-300"></div>
//                       </div>
//                       <div className="w-1/5 flex justify-center">
//                         <div className="h-8 border-l-2 border-dashed border-gray-300"></div>
//                       </div>
//                       <div className="w-1/5 flex justify-center">
//                         <div className="h-8 border-l-2 border-dashed border-gray-300"></div>
//                       </div>
//                       <div className="w-1/5 flex justify-center">
//                         <div className="h-8 border-l-2 border-dashed border-gray-300"></div>
//                       </div>
//                     </div>
                    
//                     {/* Connecting arrow across the top */}
//                     <div className="absolute top-0 left-0 w-full px-4">
//                       <div className="w-full border-t-2 border-gray-300"></div>
//                     </div>
//                   </div>
                  
//                   {/* Counts below the workflow */}
//                   <div className="flex justify-between text-sm mt-3">
//                     <div className="text-center">
//                       <div className="font-semibold">{statsData.processData.stages.pending}</div>
//                       <div className="text-xs text-gray-500">Papers</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="font-semibold">{statsData.processData.stages.evaluation}</div>
//                       <div className="text-xs text-gray-500">Papers</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="font-semibold">{statsData.processData.stages.moderation}</div>
//                       <div className="text-xs text-gray-500">Papers</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="font-semibold">{statsData.processData.stages.completed}</div>
//                       <div className="text-xs text-gray-500">Papers</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="font-semibold">{statsData.processData.stages.reevaluation}</div>
//                       <div className="text-xs text-gray-500">Papers</div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="mt-6 text-sm text-gray-600">
//                   <p className="flex items-center mb-2">
//                     <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
//                     <strong>Pending:</strong> Answer scripts waiting to be assigned for evaluation
//                   </p>
//                   <p className="flex items-center mb-2">
//                     <span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
//                     <strong>Evaluation:</strong> Papers currently being evaluated by examiners
//                   </p>
//                   <p className="flex items-center mb-2">
//                     <span className="inline-block w-3 h-3 bg-purple-400 rounded-full mr-2"></span>
//                     <strong>Moderation:</strong> Evaluations being reviewed for quality assurance
//                   </p>
//                   <p className="flex items-center mb-2">
//                     <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span>
//                     <strong>Completed:</strong> Papers with finalized evaluation and results
//                   </p>
//                   <p className="flex items-center">
//                     <span className="inline-block w-3 h-3 bg-red-400 rounded-full mr-2"></span>
//                     <strong>Re-evaluation:</strong> Papers being re-checked after student request
//                   </p>
//                 </div>
//               </div>
              
//               {/* Top Courses */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Course Completion Status */}
//                 <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluation Progress by Course</h3>
//                   <div className="space-y-4">
//                     {statsData.processData.courses.map((course, index) => (
//                       <div key={index} className="flex items-center">
//                         <div className="w-40 truncate text-sm font-medium text-gray-800">{course.name}</div>
//                         <div className="flex-grow mx-2">
//                           <div className="relative w-full bg-gray-200 rounded-full h-5">
//                             <div 
//                               className="h-5 rounded-full bg-blue-600" 
//                               style={{ width: `${course.completion}%` }}
//                             ></div>
//                             <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold">
//                               {course.completion}%
//                             </div>
//                           </div>
//                         </div>
//                         <div className="w-16 text-right text-sm text-gray-600">
//                           {course.count}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="mt-4 text-xs text-gray-500 text-center">
//                     Percentage indicates evaluation completion rate
//                   </div>
//                 </div>
                
//                 {/* Evaluation Trends */}
//                 <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Evaluation Activity</h3>
//                   <div className="space-y-4">
//                     {statsData.processData.evaluationTrends.map((week, index) => (
//                       <div key={index}>
//                         <div className="flex justify-between mb-1">
//                           <div className="text-sm font-medium text-gray-700">
//                             Week of {new Date(week.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             Total: {week.evaluations + week.moderations + week.reevaluations}
//                           </div>
//                         </div>
//                         <div className="w-full h-8 bg-gray-100 rounded-md overflow-hidden flex">
//                           <div 
//                             className="h-full bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
//                             style={{ width: `${(week.evaluations / (week.evaluations + week.moderations + week.reevaluations)) * 100}%` }}
//                           >
//                             {week.evaluations}
//                           </div>
//                           <div 
//                             className="h-full bg-purple-500 flex items-center justify-center text-xs text-white font-medium"
//                             style={{ width: `${(week.moderations / (week.evaluations + week.moderations + week.reevaluations)) * 100}%` }}
//                           >
//                             {week.moderations}
//                           </div>
//                           <div 
//                             className="h-full bg-red-500 flex items-center justify-center text-xs text-white font-medium"
//                             style={{ width: `${(week.reevaluations / (week.evaluations + week.moderations + week.reevaluations)) * 100}%` }}
//                           >
//                             {week.reevaluations}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="mt-4 text-sm flex justify-center space-x-4">
//                     <div className="flex items-center">
//                       <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
//                       <span className="text-xs">Evaluations</span>
//                     </div>
//                     <div className="flex items-center">
//                       <div className="w-3 h-3 bg-purple-500 rounded-sm mr-1"></div>
//                       <span className="text-xs">Moderations</span>
//                     </div>
//                     <div className="flex items-center">
//                       <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
//                       <span className="text-xs">Re-evaluations</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Stats;





//?v1 (old version)
// import React, { useState, useEffect } from 'react';

// const Stats = () => {
//   const [loading, setLoading] = useState(true);
//   const [periodFilter, setPeriodFilter] = useState('last30days');
//   const [subjectFilter, setSubjectFilter] = useState('all');
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
//           avgMarkChange: 4.2,
//           marksImproved: 312,
//           marksReduced: 164,
//           marksUnchanged: 45
//         },
//         topEvaluators: [
//           { name: 'John Smith', count: 48, avgAccuracy: 92 },
//           { name: 'Emily Clark', count: 37, avgAccuracy: 95 },
//           { name: 'Michael Brown', count: 35, avgAccuracy: 89 },
//           { name: 'Anna Johnson', count: 29, avgAccuracy: 91 },
//           { name: 'Robert Davis', count: 26, avgAccuracy: 94 }
//         ],
//         subjectData: [
//           { subject: 'Mathematics', evaluations: 3456, reevaluations: 142, moderations: 256, avgMarkChange: 5.7 },
//           { subject: 'Physics', evaluations: 2731, reevaluations: 108, moderations: 193, avgMarkChange: 4.2 },
//           { subject: 'Chemistry', evaluations: 2654, reevaluations: 96, moderations: 187, avgMarkChange: 3.8 },
//           { subject: 'Biology', evaluations: 2344, reevaluations: 89, moderations: 165, avgMarkChange: 4.5 },
//           { subject: 'Computer Science', evaluations: 1690, reevaluations: 86, moderations: 142, avgMarkChange: 3.2 }
//         ],
//         markChangeDistribution: [
//           { range: '0-2', count: 148 },
//           { range: '3-5', count: 213 },
//           { range: '6-10', count: 124 },
//           { range: '11-15', count: 26 },
//           { range: '>15', count: 10 }
//         ]
//       };
      
//       setStatsData(mockData);
//       setLoading(false);
//     }, 1200);
//   }, []);

//   // Handle export report
//   const handleExportReport = () => {
//     // In a real implementation, you would generate a report file here
//     alert('Exporting analytics report...');
//   };

//   // Handle click on a specific metric to drill down
//   const handleDrillDown = (metricType, value) => {
//     // In a real implementation, you would navigate to a filtered view
//     alert(`Drilling down to ${metricType}: ${value}`);
//   };

//   // Get subjects from data
//   const subjects = statsData?.subjectData.map(item => item.subject) || [];

//   return (
//     <div className="bg-white rounded-lg shadow">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-800">Evaluation Analytics</h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Key metrics and insights for evaluation, re-evaluation, and moderation
//         </p>
//       </div>
      
//       {/* Filters and Actions */}
//       <div className="p-6 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
//         <div className="flex flex-wrap gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
//             <select 
//               value={periodFilter} 
//               onChange={(e) => setPeriodFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="last7days">Last 7 Days</option>
//               <option value="last30days">Last 30 Days</option>
//               <option value="last90days">Last 90 Days</option>
//               <option value="lastyear">Last Year</option>
//               <option value="all">All Time</option>
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
//             <select 
//               value={subjectFilter} 
//               onChange={(e) => setSubjectFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Subjects</option>
//               {subjects.map(subject => (
//                 <option key={subject} value={subject}>{subject}</option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         <button 
//           onClick={handleExportReport}
//           className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
//         >
//           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//           <span>Export Report</span>
//         </button>
//       </div>
      
//       {/* Dashboard Content */}
//       {loading ? (
//         <div className="flex justify-center items-center h-96">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       ) : (
//         <div className="p-6">
//           {/* Top Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div 
//               className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//               onClick={() => handleDrillDown('evaluations', statsData.overview.totalEvaluations)}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Total Evaluations</p>
//                   <p className="mt-1 text-3xl font-semibold text-gray-900">{statsData.overview.totalEvaluations.toLocaleString()}</p>
//                 </div>
//                 <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
//                   <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
            
//             <div 
//               className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//               onClick={() => handleDrillDown('reevaluations', statsData.overview.totalReevaluations)}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Re-evaluation Requests</p>
//                   <p className="mt-1 text-3xl font-semibold text-gray-900">{statsData.overview.totalReevaluations.toLocaleString()}</p>
//                 </div>
//                 <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
//                   <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="mt-2 text-sm text-gray-600">
//                 <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
//                   {((statsData.overview.totalReevaluations / statsData.overview.totalEvaluations) * 100).toFixed(1)}% of total
//                 </span>
//               </div>
//             </div>
            
//             <div 
//               className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//               onClick={() => handleDrillDown('moderations', statsData.overview.totalModerations)}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Moderated Papers</p>
//                   <p className="mt-1 text-3xl font-semibold text-gray-900">{statsData.overview.totalModerations.toLocaleString()}</p>
//                 </div>
//                 <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
//                   <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="mt-2 text-sm text-gray-600">
//                 <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
//                   {((statsData.overview.totalModerations / statsData.overview.totalEvaluations) * 100).toFixed(1)}% of total
//                 </span>
//               </div>
//             </div>
            
//             <div 
//               className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//               onClick={() => handleDrillDown('markChanges', statsData.overview.avgMarkChange)}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Avg. Mark Change</p>
//                   <p className="mt-1 text-3xl font-semibold text-gray-900">{statsData.overview.avgMarkChange}</p>
//                 </div>
//                 <div className="h-12 w-12 bg-yellow-50 rounded-full flex items-center justify-center">
//                   <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="mt-2 flex text-sm">
//                 <div className="mr-3">
//                   <span className="text-green-600">▲ {statsData.overview.marksImproved}</span>
//                 </div>
//                 <div className="mr-3">
//                   <span className="text-red-600">▼ {statsData.overview.marksReduced}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">◆ {statsData.overview.marksUnchanged}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Second Row: Two-column layout */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             {/* Top Evaluators Requiring Moderation */}
//             <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Top Moderated Evaluators</h3>
//               <div className="overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead>
//                     <tr>
//                       <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluator</th>
//                       <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moderation Count</th>
//                       <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Accuracy</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {statsData.topEvaluators.map((evaluator, index) => (
//                       <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleDrillDown('evaluator', evaluator.name)}>
//                         <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{evaluator.name}</td>
//                         <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{evaluator.count}</td>
//                         <td className="px-3 py-3 whitespace-nowrap text-sm">
//                           <div className="flex items-center">
//                             <div className="w-full bg-gray-200 rounded-full h-2.5">
//                               <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${evaluator.avgAccuracy}%` }}></div>
//                             </div>
//                             <span className="ml-2 text-sm text-gray-600">{evaluator.avgAccuracy}%</span>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
            
//             {/* Mark Change Distribution */}
//             <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Mark Change Distribution</h3>
//               <div className="space-y-4">
//                 {statsData.markChangeDistribution.map((item, index) => (
//                   <div key={index} className="flex items-center">
//                     <div className="w-24 text-sm text-gray-600">{item.range} marks</div>
//                     <div className="flex-grow mx-2">
//                       <div className="w-full bg-gray-100 rounded-full h-5">
//                         <div 
//                           className={`${getMarkChangeColor(item.range)} h-5 rounded-full`} 
//                           style={{ width: `${(item.count / statsData.overview.totalReevaluations) * 100}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                     <div className="w-16 text-right text-sm text-gray-600">
//                       {item.count} 
//                       <span className="text-xs text-gray-500 ml-1">
//                         ({((item.count / statsData.overview.totalReevaluations) * 100).toFixed(1)}%)
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4 text-xs text-gray-500 text-center">
//                 Based on {statsData.overview.totalReevaluations} re-evaluated papers
//               </div>
//             </div>
//           </div>
          
//           {/* Third Row: Subject Data */}
//           <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Subject-wise Analysis</h3>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr>
//                     <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                     <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Evaluations</th>
//                     <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Re-evaluations</th>
//                     <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moderations</th>
//                     <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Re-eval Rate</th>
//                     <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Mark Change</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {statsData.subjectData.map((subject, index) => (
//                     <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleDrillDown('subject', subject.subject)}>
//                       <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{subject.subject}</td>
//                       <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{subject.evaluations.toLocaleString()}</td>
//                       <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{subject.reevaluations}</td>
//                       <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{subject.moderations}</td>
//                       <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
//                         {((subject.reevaluations / subject.evaluations) * 100).toFixed(1)}%
//                       </td>
//                       <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
//                         <span className={getAvgMarkChangeColor(subject.avgMarkChange)}>
//                           {subject.avgMarkChange} marks
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Helper function to get color for mark change ranges
// const getMarkChangeColor = (range) => {
//   if (range === '0-2') return 'bg-blue-500';
//   if (range === '3-5') return 'bg-green-500';
//   if (range === '6-10') return 'bg-yellow-500';
//   if (range === '11-15') return 'bg-orange-500';
//   return 'bg-red-500'; // >15
// };

// // Helper function to get color for average mark change
// const getAvgMarkChangeColor = (value) => {
//   if (value < 3) return 'text-blue-600';
//   if (value < 5) return 'text-green-600';
//   if (value < 7) return 'text-yellow-600';
//   return 'text-red-600'; // >= 7
// };

// export default Stats;