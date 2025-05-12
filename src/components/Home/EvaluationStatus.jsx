
// import React, { useState, useMemo } from 'react';

// const EvaluationStatus = ({ loading, assignedCopies, evaluatedStats }) => {
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending'
//   });
//   const [statusFilter, setStatusFilter] = useState('all');

//   // Combine and normalize all data for sorting and filtering
//   const allCopies = useMemo(() => {
//     // Normalize the data structure
//     const result = [
//       ...mockData.checked.map(copy => ({ 
//         ...copy, 
//         detail: copy.score,
//         statusType: 'Checked'
//       })),
//       ...mockData.partiallyChecked.map(copy => ({ 
//         ...copy, 
//         detail: copy.progress,
//         statusType: 'Partial'
//       })),
//       ...mockData.pending.map(copy => ({ 
//         ...copy,
//         statusType: 'Pending'
//       }))
//     ];
    
//     // Apply sorting
//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
    
//     // Apply filtering
//     if (statusFilter !== 'all') {
//       return result.filter(copy => copy.statusType === statusFilter);
//     }
    
//     return result;
//   }, [mockData, sortConfig, statusFilter]);

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIndicator = (name) => {
//     if (sortConfig.key === name) {
//       return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
//     }
//     return '';
//   };

//   return (
//     <div className="bg-white rounded-lg shadow">
//       <div className="px-4 py-4 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-medium text-gray-900">Evaluation Status</h3>
//           <div className="flex items-center space-x-2">
//             <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
//               Filter by status:
//             </label>
//             <select
//               id="status-filter"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="text-sm p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All</option>
//               <option value="Checked">Checked</option>
//               <option value="Partial">Partially Checked</option>
//               <option value="Pending">Pending</option>
//             </select>
//           </div>
//         </div>
//       </div>
      
//       <div className="h-[60vh] overflow-x-hidden overflow-y-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr>
//               <th 
//                 scope="col" 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => requestSort('id')}
//               >
//                 Copy ID{getSortIndicator('id')}
//               </th>
//               <th 
//                 scope="col" 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => requestSort('subjectName')}
//               >
//                 Subject{getSortIndicator('subjectName')}
//               </th>
//               <th 
//                 scope="col" 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => requestSort('date')}
//               >
//                 Date{getSortIndicator('date')}
//               </th>
//               <th 
//                 scope="col" 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => requestSort('statusType')}
//               >
//                 Status{getSortIndicator('statusType')}
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Details
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {allCopies.map((copy) => (
//               <tr key={copy.id} className="hover:bg-gray-50 ">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   {copy.id}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {copy.subjectName}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {copy.date}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {copy.statusType === 'Checked' && (
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                       Checked
//                     </span>
//                   )}
//                   {copy.statusType === 'Partial' && (
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                       Partial
//                     </span>
//                   )}
//                   {copy.statusType === 'Pending' && (
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                       Pending
//                     </span>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {copy.statusType === 'Checked' && (
//                     <span className="text-sm text-green-600 font-medium">{copy.detail}</span>
//                   )}
//                   {copy.statusType === 'Partial' && (
//                     <div>
//                       <div className="w-24 bg-gray-200 rounded-full h-1.5 ">
//                         <div 
//                           className="bg-yellow-500 h-1.5 rounded-full" 
//                           style={{ width: copy.detail }}
//                         ></div>
//                       </div>
//                       <span className="text-xs text-gray-500 ml-1">{copy.detail}</span>
//                     </div>
//                   )}
//                   {copy.statusType === 'Pending' && (
//                     <span className="text-sm text-gray-500 ">{copy.detail}</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//             {allCopies.length === 0 && (
//               <tr>
//                 <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
//                   No copies matching the selected filter
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Summary Section */}
//       <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
//         <div className="flex space-x-4">
//           <div>
//             <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
//             Checked: {mockData.checked.length}
//           </div>
//           <div>
//             <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
//             Partial: {mockData.partiallyChecked.length}
//           </div>
//           <div>
//             <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mr-1"></span>
//             Pending: {mockData.pending.length}
//           </div>
//           <div className="ml-auto">
//             {statusFilter === 'all' 
//               ? `Total: ${mockData.checked.length + mockData.partiallyChecked.length + mockData.pending.length}`
//               : `Filtered: ${allCopies.length}`
//             }
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EvaluationStatus;


//? Data from API via props

// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';

// const EvaluationStatus = ({ currentCopies, filteredCopies, evaluatedStats, searchTerm, setSearchTerm, page, setPage, itemsPerPage, error, loading }) => {
//   const [sortConfig, setSortConfig] = useState({
//     key: 'id',
//     direction: 'ascending'
//   });
//   const [statusFilter, setStatusFilter] = useState('all');
//   const navigate = useNavigate();

//   // Process the real data from props
//   const processedCopies = useMemo(() => {
//     // Check if valid data is available
//     if (!filteredCopies || !Array.isArray(filteredCopies)) {
//       return [];
//     }

//     // Map the copies to a normalized format
//     let result = filteredCopies.map(copy => ({
//       id: copy.copyId,
//       date: new Date(copy.assignedAt).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       }),
//       statusType: copy.partial ? 'Partial' : 'Pending',
//       detail: copy.partial ? '50% Complete' : 'Not started yet',
//       assignedAt: copy.assignedAt,
//       partial: copy.partial
//     }));
    
//     // Apply filtering based on status
//     if (statusFilter !== 'all') {
//       result = result.filter(copy => copy.statusType === statusFilter);
//     }
    
//     // Apply sorting
//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
    
//     return result;
//   }, [filteredCopies, sortConfig, statusFilter]);

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIndicator = (name) => {
//     if (sortConfig.key === name) {
//       return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
//     }
//     return '';
//   };

//   const handleEvaluate = (copyId) => {
//     navigate(`/evaluate/${copyId}`);
//   };

//   // Calculate pagination
//   const startIndex = (page - 1) * itemsPerPage;
//   const displayedCopies = processedCopies.slice(startIndex, startIndex + itemsPerPage);

//   return (
//     <div className="bg-white rounded-lg shadow">
//       <div className="px-4 py-4 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-medium text-gray-900">Evaluation Status</h3>
//           <div className="flex items-center space-x-2">
//             <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
//               Filter by status:
//             </label>
//             <select
//               id="status-filter"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="text-sm p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All</option>
//               <option value="Partial">Partially Checked</option>
//               <option value="Pending">Pending</option>
//             </select>
//           </div>
//         </div>
//       </div>
      
//       <div className="h-[60vh] overflow-x-hidden overflow-y-auto">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center h-full py-16">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
//             <p className="text-gray-500">Loading your assignments...</p>
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
//               Please try refreshing the page or contact support if the problem persists.
//             </p>
//           </div>
//         ) : (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50 sticky top-0 z-10">
//               <tr>
//                 <th 
//                   scope="col" 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => requestSort('id')}
//                 >
//                   Copy ID{getSortIndicator('id')}
//                 </th>
//                 <th 
//                   scope="col" 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => requestSort('date')}
//                 >
//                   Date Assigned{getSortIndicator('date')}
//                 </th>
//                 <th 
//                   scope="col" 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => requestSort('statusType')}
//                 >
//                   Status{getSortIndicator('statusType')}
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Progress
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayedCopies.length > 0 ? (
//                 displayedCopies.map((copy) => (
//                   <tr key={copy.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {copy.id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {copy.date}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {copy.statusType === 'Partial' && (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                           Partially Checked
//                         </span>
//                       )}
//                       {copy.statusType === 'Pending' && (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                           Pending
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {copy.statusType === 'Partial' && (
//                         <div>
//                           <div className="w-24 bg-gray-200 rounded-full h-1.5">
//                             <div 
//                               className="bg-yellow-500 h-1.5 rounded-full" 
//                               style={{ width: '50%' }}
//                             ></div>
//                           </div>
//                           <span className="text-xs text-gray-500 ml-1">50% Complete</span>
//                         </div>
//                       )}
//                       {copy.statusType === 'Pending' && (
//                         <span className="text-sm text-gray-500">Not started</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
//                     {searchTerm
//                       ? "No copies match your search criteria. Try a different search term."
//                       : statusFilter !== 'all'
//                         ? 'No copies matching the selected filter'
//                         : 'No copies assigned to you yet'}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
      
//       {/* Summary Section */}
//       <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
//         <div className="flex flex-wrap gap-4">
//           <div>
//             <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
//             Evaluated: {evaluatedStats?.evaluated || 0}
//           </div>
//           <div>
//             <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
//             Partially Checked: {evaluatedStats?.partial || 0}
//           </div>
//           <div>
//             <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mr-1"></span>
//             Pending: {evaluatedStats?.pending || 0}
//           </div>
//           <div className="ml-auto">
//             Total: {evaluatedStats?.total || 0}
//           </div>
//         </div>
//       </div>
      
//       {/* Pagination */}
//       {processedCopies.length > itemsPerPage && (
//         <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-center">
//           <div className="flex space-x-1">
//             {Array.from({ length: Math.ceil(processedCopies.length / itemsPerPage) }).map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setPage(idx + 1)}
//                 className={`px-3 py-1 rounded text-sm ${
//                   page === idx + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 {idx + 1}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EvaluationStatus;

//?Update 1.2
// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';

// const EvaluationStatus = ({ currentCopies, filteredCopies, evaluatedStats, searchTerm, setSearchTerm, page, setPage, itemsPerPage, error, loading }) => {
//   const [sortConfig, setSortConfig] = useState({
//     key: 'id',
//     direction: 'ascending'
//   });
//   const navigate = useNavigate();

//   // Process the real data from props
//   const processedCopies = useMemo(() => {
//     // Check if valid data is available
//     if (!filteredCopies || !Array.isArray(filteredCopies)) {
//       return [];
//     }

//     // Map the copies to a normalized format with calculated fields
//     let result = filteredCopies.map(copy => {
//       // Calculate assignment age in days
//       const assignedDate = new Date(copy.assignedAt);
//       const today = new Date();
//       const ageInDays = Math.floor((today - assignedDate) / (1000 * 60 * 60 * 24));
      
//       return {
//         id: copy.copyId,
//         date: assignedDate.toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'short',
//           day: 'numeric'
//         }),
//         statusType: copy.partial ? 'Partial' : 'Pending',
//         assignedAt: copy.assignedAt,
//         partial: copy.partial,
//         ageInDays: ageInDays,
//         priorityLevel: ageInDays > 7 ? 'high' : ageInDays > 3 ? 'medium' : 'low'
//       };
//     });
    
//     // Apply sorting
//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
    
//     return result;
//   }, [filteredCopies, sortConfig]);

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIndicator = (name) => {
//     if (sortConfig.key === name) {
//       return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
//     }
//     return '';
//   };

//   const handleEvaluate = (copyId) => {
//     navigate(`/evaluate/${copyId}`);
//   };

//   // Calculate pagination
//   const startIndex = (page - 1) * itemsPerPage;
//   const displayedCopies = processedCopies.slice(startIndex, startIndex + itemsPerPage);

//   // Calculate statistics
//   const stats = useMemo(() => {
//     if (!processedCopies.length) return { overdue: 0, today: 0, upcoming: 0 };
    
//     return {
//       overdue: processedCopies.filter(copy => copy.ageInDays > 7).length,
//       today: processedCopies.filter(copy => copy.ageInDays >= 0 && copy.ageInDays <= 1).length,
//       upcoming: processedCopies.filter(copy => copy.ageInDays > 1 && copy.ageInDays <= 7).length
//     };
//   }, [processedCopies]);

//   return (
//     <div className="bg-white rounded-lg shadow">
//       <div className="px-4 py-4 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-medium text-gray-900">Evaluation Timeline</h3>
//           <div className="flex items-center space-x-2">
//             <button 
//               onClick={() => requestSort('ageInDays')}
//               className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
//             >
//               Sort by Age {sortConfig.key === 'ageInDays' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Priority Stats */}
//       <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
//         <div className="bg-white p-3 rounded-lg shadow-sm border border-red-100">
//           <div className="text-xs font-medium text-gray-500">Overdue (7 days)</div>
//           <div className="text-xl font-bold text-red-600">{stats.overdue}</div>
//         </div>
//         <div className="bg-white p-3 rounded-lg shadow-sm border border-yellow-100">
//           <div className="text-xs font-medium text-gray-500">Due Today</div>
//           <div className="text-xl font-bold text-yellow-600">{stats.today}</div>
//         </div>
//         <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
//           <div className="text-xs font-medium text-gray-500">Upcoming</div>
//           <div className="text-xl font-bold text-green-600">{stats.upcoming}</div>
//         </div>
//       </div>
      
//       <div className="h-[50vh] overflow-x-hidden overflow-y-auto">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center h-full py-16">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
//             <p className="text-gray-500">Loading your assignments...</p>
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
//               Please try refreshing the page or contact support if the problem persists.
//             </p>
//           </div>
//         ) : (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50 sticky top-0 z-10">
//               <tr>
//                 <th 
//                   scope="col" 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => requestSort('id')}
//                 >
//                   Copy ID{getSortIndicator('id')}
//                 </th>
//                 <th 
//                   scope="col" 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => requestSort('date')}
//                 >
//                   Assigned Date{getSortIndicator('date')}
//                 </th>
//                 <th 
//                   scope="col" 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => requestSort('ageInDays')}
//                 >
//                   Age (Days){getSortIndicator('ageInDays')}
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Priority
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayedCopies.length > 0 ? (
//                 displayedCopies.map((copy) => (
//                   <tr 
//                     key={copy.id} 
//                     className={`hover:bg-gray-50 ${
//                       copy.priorityLevel === 'high' 
//                         ? 'bg-red-50' 
//                         : copy.priorityLevel === 'medium' 
//                           ? 'bg-yellow-50' 
//                           : ''
//                     }`}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {copy.id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {copy.date}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <span 
//                         className={`${
//                           copy.ageInDays > 7 
//                             ? 'text-red-600' 
//                             : copy.ageInDays > 3 
//                               ? 'text-yellow-600' 
//                               : 'text-green-600'
//                         }`}
//                       >
//                         {copy.ageInDays} days
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {copy.priorityLevel === 'high' && (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                           High Priority
//                         </span>
//                       )}
//                       {copy.priorityLevel === 'medium' && (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                           Medium Priority
//                         </span>
//                       )}
//                       {copy.priorityLevel === 'low' && (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           Low Priority
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button 
//                         className={`px-3 py-1.5 rounded text-white text-xs font-medium ${
//                           copy.priorityLevel === 'high' 
//                             ? 'bg-red-500 hover:bg-red-600' 
//                             : copy.priorityLevel === 'medium'
//                               ? 'bg-yellow-500 hover:bg-yellow-600'
//                               : 'bg-green-500 hover:bg-green-600'
//                         }`}
//                         onClick={() => handleEvaluate(copy.id)}
//                       >
//                         {copy.partial ? 'Continue' : 'Evaluate'}
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
//                     {searchTerm
//                       ? "No copies match your search criteria. Try a different search term."
//                       : 'No copies assigned to you yet'}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
      
//       {/* Completion Summary */}
//       <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
//         <div className="flex flex-col">
//           <div className="mb-2">Completion Progress</div>
//           <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
//             <div 
//               className="bg-blue-600 h-2.5 rounded-full" 
//               style={{ width: `${(evaluatedStats?.evaluated / evaluatedStats?.total) * 100 || 0}%` }}
//             ></div>
//           </div>
//           <div className="flex justify-between">
//             <span>Evaluated: {evaluatedStats?.evaluated || 0}/{evaluatedStats?.total || 0}</span>
//             <span>{Math.round((evaluatedStats?.evaluated / evaluatedStats?.total) * 100 || 0)}% complete</span>
//           </div>
//         </div>
//       </div>
      
//       {/* Pagination */}
//       {processedCopies.length > itemsPerPage && (
//         <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-center">
//           <div className="flex space-x-1">
//             {Array.from({ length: Math.ceil(processedCopies.length / itemsPerPage) }).map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setPage(idx + 1)}
//                 className={`px-3 py-1 rounded text-sm ${
//                   page === idx + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 {idx + 1}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EvaluationStatus;

//?Update 1.3

// import React, { useState, useMemo } from 'react';

// const EvaluationStatus = ({ filteredCopies, evaluatedStats, searchTerm, setSearchTerm, page, setPage, itemsPerPage, error, loading }) => {
//   const [sortConfig, setSortConfig] = useState({
//     key: 'ageInDays',
//     direction: 'ascending'
//   });

//   // Process the real data from props
//   const processedCopies = useMemo(() => {
//     // Check if valid data is available
//     if (!filteredCopies || !Array.isArray(filteredCopies)) {
//       return [];
//     }

//     // Map the copies to a normalized format with calculated fields
//     let result = filteredCopies.map(copy => {
//       // Calculate assignment age in days
//       const assignedDate = new Date(copy.assignedAt);
//       const today = new Date();
//       const ageInDays = Math.floor((today - assignedDate) / (1000 * 60 * 60 * 24));
      
//       return {
//         id: copy.copyId,
//         date: assignedDate.toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'short',
//           day: 'numeric'
//         }),
//         statusType: copy.partial ? 'Partial' : 'Pending',
//         assignedAt: copy.assignedAt,
//         partial: copy.partial,
//         ageInDays: ageInDays,
//         priorityLevel: ageInDays > 7 ? 'high' : ageInDays > 3 ? 'medium' : 'low'
//       };
//     });
    
//     // Apply sorting
//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
    
//     return result;
//   }, [filteredCopies, sortConfig]);

//   const toggleSortDirection = () => {
//     setSortConfig({
//       key: 'ageInDays',
//       direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
//     });
//   };

//   // Calculate pagination
//   const startIndex = (page - 1) * itemsPerPage;
//   const displayedCopies = processedCopies.slice(startIndex, startIndex + itemsPerPage);

//   // Calculate statistics
//   const stats = useMemo(() => {
//     if (!processedCopies.length) return { overdue: 0, today: 0, upcoming: 0 };
    
//     return {
//       overdue: processedCopies.filter(copy => copy.ageInDays > 7).length,
//       today: processedCopies.filter(copy => copy.ageInDays >= 0 && copy.ageInDays <= 1).length,
//       upcoming: processedCopies.filter(copy => copy.ageInDays > 1 && copy.ageInDays <= 7).length
//     };
//   }, [processedCopies]);

//   return (
//     <div className="bg-white rounded-lg shadow">
//       <div className="px-4 py-4 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-medium text-gray-900">Evaluation Timeline</h3>
//           <div className="flex items-center space-x-2">
//             <button 
//               onClick={toggleSortDirection}
//               className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
//             >
//               Sort by Age {sortConfig.direction === 'ascending' ? '↑' : '↓'}
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Priority Stats */}
//       <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
//         <div className="bg-white p-3 rounded-lg shadow-sm border border-red-100">
//           <div className="text-xs font-medium text-gray-500">Overdue ({'>'}7 days)</div>
//           <div className="text-xl font-bold text-red-600">{stats.overdue}</div>
//         </div>
//         <div className="bg-white p-3 rounded-lg shadow-sm border border-yellow-100">
//           <div className="text-xs font-medium text-gray-500">Due Today</div>
//           <div className="text-xl font-bold text-yellow-600">{stats.today}</div>
//         </div>
//         <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
//           <div className="text-xs font-medium text-gray-500">Upcoming</div>
//           <div className="text-xl font-bold text-green-600">{stats.upcoming}</div>
//         </div>
//       </div>
      
//       <div className="h-[50vh] overflow-x-hidden overflow-y-auto">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center h-full py-16">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
//             <p className="text-gray-500">Loading your assignments...</p>
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
//               Please try refreshing the page or contact support if the problem persists.
//             </p>
//           </div>
//         ) : (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50 sticky top-0 z-10">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Copy ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Assigned Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Age (Days)
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Priority
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayedCopies.length > 0 ? (
//                 displayedCopies.map((copy) => (
//                   <tr 
//                     key={copy.id} 
//                     className={`hover:bg-gray-50 ${
//                       copy.priorityLevel === 'high' 
//                         ? 'bg-red-50' 
//                         : copy.priorityLevel === 'medium' 
//                           ? 'bg-yellow-50' 
//                           : ''
//                     }`}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {copy.id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {copy.date}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <span 
//                         className={`${
//                           copy.ageInDays > 7 
//                             ? 'text-red-600' 
//                             : copy.ageInDays > 3 
//                               ? 'text-yellow-600' 
//                               : 'text-green-600'
//                         }`}
//                       >
//                         {copy.ageInDays} days
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {copy.priorityLevel === 'high' && (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                           High Priority
//                         </span>
//                       )}
//                       {copy.priorityLevel === 'medium' && (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                           Medium Priority
//                         </span>
//                       )}
//                       {copy.priorityLevel === 'low' && (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           Low Priority
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
//                     {searchTerm
//                       ? "No copies match your search criteria. Try a different search term."
//                       : 'No copies assigned to you yet'}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
      
//       {/* Completion Summary */}
//       <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
//         <div className="flex flex-col">
//           <div className="mb-2">Completion Progress</div>
//           <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
//             <div 
//               className="bg-blue-600 h-2.5 rounded-full" 
//               style={{ width: `${(evaluatedStats?.evaluated / evaluatedStats?.total) * 100 || 0}%` }}
//             ></div>
//           </div>
//           <div className="flex justify-between">
//             <span>Evaluated: {evaluatedStats?.evaluated || 0}/{evaluatedStats?.total || 0}</span>
//             <span>{Math.round((evaluatedStats?.evaluated / evaluatedStats?.total) * 100 || 0)}% complete</span>
//           </div>
//         </div>
//       </div>
      
//       {/* Pagination */}
//       {processedCopies.length > itemsPerPage && (
//         <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-center">
//           <div className="flex space-x-1">
//             {Array.from({ length: Math.ceil(processedCopies.length / itemsPerPage) }).map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setPage(idx + 1)}
//                 className={`px-3 py-1 rounded text-sm ${
//                   page === idx + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 {idx + 1}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EvaluationStatus;


//?update 1.4

import React, { useState, useMemo } from 'react';

const EvaluationStatus = ({ filteredCopies, evaluatedStats, searchTerm, setSearchTerm, page, setPage, itemsPerPage, error, loading }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'ageInDays',
    direction: 'ascending'
  });

  // Process the real data from props
  const processedCopies = useMemo(() => {
    // Check if valid data is available
    if (!filteredCopies || !Array.isArray(filteredCopies)) {
      return [];
    }

    // Map the copies to a normalized format with calculated fields
    let result = filteredCopies.map(copy => {
      // Calculate assignment age in days
      const assignedDate = new Date(copy.assignedAt);
      const today = new Date();
      const ageInDays = Math.floor((today - assignedDate) / (1000 * 60 * 60 * 24));
      
      return {
        id: copy.copyId,
        date: assignedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        statusType: copy.partial ? 'Partial' : 'Pending',
        assignedAt: copy.assignedAt,
        partial: copy.partial,
        ageInDays: ageInDays,
        priorityLevel: ageInDays > 7 ? 'high' : ageInDays > 3 ? 'medium' : 'low'
      };
    });
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [filteredCopies, sortConfig]);

  const toggleSortDirection = () => {
    setSortConfig({
      key: 'ageInDays',
      direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
    });
  };

  // Calculate pagination
  const startIndex = (page - 1) * itemsPerPage;
  const displayedCopies = processedCopies.slice(startIndex, startIndex + itemsPerPage);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!processedCopies.length) return { overdue: 0, today: 0, upcoming: 0 };
    
    return {
      overdue: processedCopies.filter(copy => copy.ageInDays > 7).length,
      today: processedCopies.filter(copy => copy.ageInDays >= 0 && copy.ageInDays <= 1).length,
      upcoming: processedCopies.filter(copy => copy.ageInDays > 1 && copy.ageInDays <= 7).length
    };
  }, [processedCopies]);

  // Search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Evaluation Timeline</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="text-sm p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              onClick={toggleSortDirection}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Sort by Age {sortConfig.direction === 'ascending' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Priority Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-red-100">
          <div className="text-xs font-medium text-gray-500">Overdue ({'>'}7 days)</div>
          <div className="text-xl font-bold text-red-600">{stats.overdue}</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border border-yellow-100">
          <div className="text-xs font-medium text-gray-500">Due Today</div>
          <div className="text-xl font-bold text-yellow-600">{stats.today}</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
          <div className="text-xs font-medium text-gray-500">Upcoming</div>
          <div className="text-xl font-bold text-green-600">{stats.upcoming}</div>
        </div>
      </div>
      
      <div className="h-[40vh] overflow-x-hidden overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[75vh] py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Loading your assignments...</p>
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
              Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Copy ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age (Days)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedCopies.length > 0 ? (
                displayedCopies.map((copy) => (
                  <tr 
                    key={copy.id} 
                    className={`hover:bg-gray-50 ${
                      copy.priorityLevel === 'high' 
                        ? 'bg-red-50' 
                        : copy.priorityLevel === 'medium' 
                          ? 'bg-yellow-50' 
                          : ''
                    }`}
                  >
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {copy.id}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {copy.date}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                      <span 
                        className={`${
                          copy.ageInDays > 7 
                            ? 'text-red-600' 
                            : copy.ageInDays > 3 
                              ? 'text-yellow-600' 
                              : 'text-green-600'
                        }`}
                      >
                        {copy.ageInDays} days
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {copy.priorityLevel === 'high' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          High Priority
                        </span>
                      )}
                      {copy.priorityLevel === 'medium' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Medium Priority
                        </span>
                      )}
                      {copy.priorityLevel === 'low' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Low Priority
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-3 text-center text-sm text-gray-500">
                    {searchTerm
                      ? "No copies match your search criteria. Try a different search term."
                      : 'No copies assigned to you yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Completion Summary */}
      <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
        <div className="flex flex-col">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-green-400 h-2.5 rounded-full" 
              style={{ width: `${(evaluatedStats?.evaluated / evaluatedStats?.total) * 100 || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between">
            <span>Evaluated: {evaluatedStats?.evaluated || 0}/{evaluatedStats?.total || 0}</span>
            <span>{Math.round((evaluatedStats?.evaluated / evaluatedStats?.total) * 100 || 0)}% complete</span>
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      {processedCopies.length > itemsPerPage && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-center">
          <div className="flex space-x-1">
            {Array.from({ length: Math.ceil(processedCopies.length / itemsPerPage) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`px-3 py-1 rounded text-sm ${
                  page === idx + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationStatus;