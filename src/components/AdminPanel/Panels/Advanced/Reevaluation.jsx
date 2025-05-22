
// import React, { useState, useEffect } from 'react';

// const Reevaluation = () => {
//   // State management
//   const [reEvalRequests, setReEvalRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'view', 'assign', 'finalize', 'reject'
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // Mock data - replace with API call
//   useEffect(() => {
//     // Simulate API fetch
//     setTimeout(() => {
//       const mockData = [
//         {
//           id: 'RE001',
//           copyId: '44054015',
//           subject: 'Mathematics',
//           evaluator: 'John Smith',
//           originalMarks: 65,
//           maxMarks: 100,
//           // requestedBy: 'Student (S12345)',
//           status: 'Pending',
//           requestDate: '2025-05-01T08:30:00',
//           reason: 'Calculation errors in marking',
//           assignedReevaluator: null,
//           reevaluatedMarks: null
//         },
//         {
//           id: 'RE002',
//           copyId: '44054032',
//           subject: 'Physics',
//           evaluator: 'Anna Johnson',
//           originalMarks: 78,
//           maxMarks: 100,
//           // requestedBy: 'Admin (A9876)',
//           status: 'Assigned',
//           requestDate: '2025-05-02T10:15:00',
//           reason: 'Content overlooked during evaluation',
//           assignedReevaluator: 'Robert Davis',
//           reevaluatedMarks: null
//         },
//         {
//           id: 'RE003',
//           copyId: '44054089',
//           subject: 'Chemistry',
//           evaluator: 'Michael Brown',
//           originalMarks: 45,
//           maxMarks: 100,
//           // requestedBy: 'Student (S45678)',
//           status: 'Completed',
//           requestDate: '2025-05-03T14:45:00',
//           reason: 'Answers match reference solution',
//           assignedReevaluator: 'Lisa Wilson',
//           reevaluatedMarks: 68
//         }
//       ];
      
//       setReEvalRequests(mockData);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   // Handle different actions
//   const handleAction = (action, request) => {
//     setSelectedRequest(request);
//     setModalType(action);
//     setModalVisible(true);
//   };

//   // Filter requests based on search and status filter
//   const filteredRequests = reEvalRequests.filter(request => {
//     const matchesSearch = 
//       request.copyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       request.evaluator.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter.toLowerCase();
    
//     return matchesSearch && matchesStatus;
//   });

//   // Handle modal close
//   const closeModal = () => {
//     setModalVisible(false);
//     setSelectedRequest(null);
//   };

//   // Render the modal content based on type
//   const renderModalContent = () => {
//     if (!selectedRequest) return null;

//     switch (modalType) {
//       case 'view':
//         return (
//           <div className="p-4">
//             <h3 className="text-lg font-medium mb-4">View Re-Evaluation Request</h3>
//             <div className="space-y-3">
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <p className="text-sm text-gray-500">Copy ID</p>
//                   <p className="font-medium">{selectedRequest.copyId}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Subject</p>
//                   <p className="font-medium">{selectedRequest.subject}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Original Evaluator</p>
//                   <p className="font-medium">{selectedRequest.evaluator}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Original Marks</p>
//                   <p className="font-medium">{selectedRequest.originalMarks}/{selectedRequest.maxMarks}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Request Date</p>
//                   <p className="font-medium">{new Date(selectedRequest.requestDate).toLocaleDateString()}</p>
//                 </div>
//               </div>
              
//               <div>
//                 <p className="text-sm text-gray-500">Reason for Re-Evaluation</p>
//                 <p className="bg-gray-50 p-2 rounded text-sm">{selectedRequest.reason}</p>
//               </div>
              
//               {selectedRequest.assignedReevaluator && (
//                 <div>
//                   <p className="text-sm text-gray-500">Assigned Re-Evaluator</p>
//                   <p className="font-medium">{selectedRequest.assignedReevaluator}</p>
//                 </div>
//               )}
              
//               {selectedRequest.reevaluatedMarks && (
//                 <div>
//                   <p className="text-sm text-gray-500">Re-Evaluated Marks</p>
//                   <p className="font-medium">{selectedRequest.reevaluatedMarks}/{selectedRequest.maxMarks}</p>
//                 </div>
//               )}
//             </div>
            
//             <div className="mt-6 flex justify-end">
//               <button 
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         );
        
//       case 'assign':
//         return (
//           <div className="p-4">
//             <h3 className="text-lg font-medium mb-4">Assign Re-Evaluator</h3>
//             <div className="space-y-3">
//               <div>
//                 <p className="text-sm text-gray-500">Copy ID</p>
//                 <p className="font-medium">{selectedRequest.copyId}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Subject</p>
//                 <p className="font-medium">{selectedRequest.subject}</p>
//               </div>
              
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Select Re-Evaluator</label>
//                 <select className="w-full p-2 border border-gray-300 rounded">
//                   <option value="">Select a Re-Evaluator</option>
//                   <option value="user1">Robert Davis</option>
//                   <option value="user2">Lisa Wilson</option>
//                   <option value="user3">James Miller</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Priority</label>
//                 <select className="w-full p-2 border border-gray-300 rounded">
//                   <option value="normal">Normal</option>
//                   <option value="high">High</option>
//                   <option value="urgent">Urgent</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Additional Instructions (Optional)</label>
//                 <textarea 
//                   className="w-full p-2 border border-gray-300 rounded h-20 resize-none"
//                   placeholder="Add any special instructions for the re-evaluator"
//                 ></textarea>
//               </div>
//             </div>
            
//             <div className="mt-6 flex justify-end space-x-3">
//               <button 
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Assign
//               </button>
//             </div>
//           </div>
//         );
        
//       case 'finalize':
//         return (
//           <div className="p-4">
//             <h3 className="text-lg font-medium mb-4">Finalize Re-Evaluation</h3>
//             <div className="space-y-3">
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <p className="text-sm text-gray-500">Copy ID</p>
//                   <p className="font-medium">{selectedRequest.copyId}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Subject</p>
//                   <p className="font-medium">{selectedRequest.subject}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Original Marks</p>
//                   <p className="font-medium">{selectedRequest.originalMarks}/{selectedRequest.maxMarks}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Re-Evaluated Marks</p>
//                   <p className="font-medium">{selectedRequest.reevaluatedMarks || 'Pending'}/{selectedRequest.maxMarks}</p>
//                 </div>
//               </div>
              
//               <div>
//                 <p className="text-sm text-gray-500">Select Final Marks</p>
//                 <div className="mt-2 space-y-2">
//                   <label className="flex items-center">
//                     <input type="radio" name="finalMarks" className="mr-2" />
//                     <span>Original Marks ({selectedRequest.originalMarks})</span>
//                   </label>
//                   <label className="flex items-center">
//                     <input type="radio" name="finalMarks" className="mr-2" />
//                     <span>Re-Evaluated Marks ({selectedRequest.reevaluatedMarks || 'Pending'})</span>
//                   </label>
//                   <label className="flex items-center">
//                     <input type="radio" name="finalMarks" className="mr-2" />
//                     <span>Average of Both ({selectedRequest.reevaluatedMarks ? Math.round((selectedRequest.originalMarks + selectedRequest.reevaluatedMarks) / 2) : 'Pending'})</span>
//                   </label>
//                   <label className="flex items-center">
//                     <input type="radio" name="finalMarks" className="mr-2" />
//                     <span>Custom Value</span>
//                   </label>
//                   <input 
//                     type="number" 
//                     className="w-full p-2 border border-gray-300 rounded mt-1" 
//                     placeholder="Enter custom marks"
//                     min="0"
//                     max={selectedRequest.maxMarks}
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Remarks (Optional)</label>
//                 <textarea 
//                   className="w-full p-2 border border-gray-300 rounded h-20 resize-none"
//                   placeholder="Add any remarks about the final decision"
//                 ></textarea>
//               </div>
//             </div>
            
//             <div className="mt-6 flex justify-end space-x-3">
//               <button 
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               >
//                 Finalize
//               </button>
//             </div>
//           </div>
//         );
        
//       case 'reject':
//         return (
//           <div className="p-4">
//             <h3 className="text-lg font-medium mb-4">Reject Re-Evaluation Request</h3>
//             <div className="space-y-3">
//               <div>
//                 <p className="text-sm text-gray-500">Copy ID</p>
//                 <p className="font-medium">{selectedRequest.copyId}</p>
//               </div>
              
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Reason for Rejection</label>
//                 <select className="w-full p-2 border border-gray-300 rounded">
//                   <option value="">Select a reason</option>
//                   <option value="invalid">Invalid Request</option>
//                   <option value="noerror">No Marking Errors Found</option>
//                   <option value="deadline">Past Deadline</option>
//                   <option value="duplicate">Duplicate Request</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Additional Comments</label>
//                 <textarea 
//                   className="w-full p-2 border border-gray-300 rounded h-20 resize-none"
//                   placeholder="Provide details about the rejection reason"
//                 ></textarea>
//               </div>
//             </div>
            
//             <div className="mt-6 flex justify-end space-x-3">
//               <button 
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 Confirm Rejection
//               </button>
//             </div>
//           </div>
//         );
        
//       default:
//         return null;
//     }
//   };

//   // Get status badge style
//   const getStatusBadge = (status) => {
//     switch (status.toLowerCase()) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'assigned':
//         return 'bg-blue-100 text-blue-800';
//       case 'completed':
//         return 'bg-green-100 text-green-800';
//       case 'rejected':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-800">Re-Evaluation Management</h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Manage re-evaluation requests for answer copies
//         </p>
//       </div>
      
//       {/* Filters and Search */}
//       <div className="p-6 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search by ID, subject..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
//             />
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//           </div>
          
//           <div>
//             <select 
//               value={statusFilter} 
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Statuses</option>
//               <option value="pending">Pending</option>
//               <option value="assigned">Assigned</option>
//               <option value="completed">Completed</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
        
//         <button className="inline-flex items-center gap-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
//           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           <span>New Request</span>
//         </button>
//       </div>
      
//       {/* Table */}
//       <div className="overflow-x-auto">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : filteredRequests.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//             <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <p>No re-evaluation requests found</p>
//           </div>
//         ) : (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy ID</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluator</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Marks</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Re-Evaluator</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Marks</th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredRequests.map((request) => (
//                 <tr key={request.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.copyId}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.subject}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.evaluator}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.originalMarks}/{request.maxMarks}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.status)}`}>
//                       {request.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {request.assignedReevaluator || '—'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {request.reevaluatedMarks ? `${request.reevaluatedMarks}/${request.maxMarks}` : '—'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium ">
//                     <div className="flex space-x-3 justify-end">
//                       <button 
//                         onClick={() => handleAction('view', request)}
//                         className="text-blue-600 hover:text-blue-900 hover:underline"
//                       >
//                         View
//                       </button>
                      
//                       {request.status === 'Pending' && (
//                         <>
//                           <button 
//                             onClick={() => handleAction('assign', request)}
//                             className="text-green-600 hover:text-green-900 hover:underline"
//                           >
//                             Assign
//                           </button>
//                           <button 
//                             onClick={() => handleAction('reject', request)}
//                             className="text-red-600 hover:text-red-900 hover:underline"
//                           >
//                             Reject
//                           </button>
//                         </>
//                       )}
                      
//                       {request.status === 'Assigned' && request.reevaluatedMarks && (
//                         <button 
//                           onClick={() => handleAction('finalize', request)}
//                           className="text-green-600 hover:text-green-900"
//                         >
//                           Finalize
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
      
//       {/* Pagination (simplified) */}
//       <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
//         <div className="text-sm text-gray-500">
//           Showing <span className="font-medium">{filteredRequests.length}</span> results
//         </div>
        
//         <div className="flex space-x-2">
//           <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
//             Previous
//           </button>
//           <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
//             Next
//           </button>
//         </div>
//       </div>
      
//       {/* Modal */}
//       {modalVisible && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
//             {renderModalContent()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Reevaluation;


//? v2 Assign reevaluation and show assignments info

import React, { useState, useEffect } from 'react';
import {
  Search as SearchIcon,
  Add as PlusIcon,
  Close as XIcon,
  CheckCircle as CheckCircleIcon,
  Error as ExclamationCircleIcon,
  Description as DocumentTextIcon,
  Edit as PencilAltIcon,
  Person as UserIcon,
  Assignment as ClipboardCheckIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../../../../api/axios.js';
import { toast } from 'react-hot-toast';

const Reevaluation = () => {
  // State management
  const [reevalRequests, setReevalRequests] = useState([]);
  const [loading, setLoading] = useState({
    table: true,
    submit: false,
    evaluators: false
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'assign'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // New assignment form state
  const [copyId, setCopyId] = useState('');
  const [selectedEvaluator, setSelectedEvaluator] = useState('');
  const [availableEvaluators, setAvailableEvaluators] = useState([]);
  const [formError, setFormError] = useState('');

  // Fetch all reevaluation requests
  useEffect(() => {
    fetchReevaluationRequests();
  }, []);
  
  // Fetch evaluators when assignment modal opens
  useEffect(() => {
    if (modalType === 'assign') {
      fetchEvaluators();
    }
  }, [modalType]);

  const fetchReevaluationRequests = async () => {
    setLoading(prev => ({ ...prev, table: true }));
    try {
      // Replace with actual API call when it's ready
      // const response = await api.get('/api/admin/reevaluation-requests');
      // setReevalRequests(response.data.requests);
      
      // Using mock data for now
      setTimeout(() => {
        const mockData = [
          {
            requestId: 'RE001',
            copyId: '44054015',
            subject: 'Mathematics',
            evaluator: 'John Smith',
            evaluatorId: 'EVAL001',
            originalMarks: 65,
            maxMarks: 100,
            status: 'Pending',
            requestDate: '2025-05-01T08:30:00',
            reason: 'Administrative review',
            assignedEvaluatorId: null,
            assignedEvaluator: null,
            reevaluatedMarks: null
          },
          {
            requestId: 'RE002',
            copyId: '44054032',
            subject: 'Physics',
            evaluator: 'Anna Johnson',
            evaluatorId: 'EVAL002',
            originalMarks: 78,
            maxMarks: 100,
            status: 'Assigned',
            requestDate: '2025-05-02T10:15:00',
            reason: 'Content overlooked during evaluation',
            assignedEvaluatorId: 'EVAL003',
            assignedEvaluator: 'Robert Davis',
            reevaluatedMarks: null
          },
          {
            requestId: 'RE003',
            copyId: '44054089',
            subject: 'Chemistry',
            evaluator: 'Michael Brown',
            evaluatorId: 'EVAL004',
            originalMarks: 45,
            maxMarks: 100,
            status: 'Completed',
            requestDate: '2025-05-03T14:45:00',
            reason: 'Answers match reference solution',
            assignedEvaluatorId: 'EVAL005',
            assignedEvaluator: 'Lisa Wilson',
            reevaluatedMarks: 68
          }
        ];
        
        setReevalRequests(mockData);
        setLoading(prev => ({ ...prev, table: false }));
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching reevaluation requests:', error);
      setLoading(prev => ({ ...prev, table: false }));
      toast.error('Failed to load reevaluation requests');
    }
  };

  // Fetch available evaluators
  const fetchEvaluators = async () => {
    setLoading(prev => ({ ...prev, evaluators: true }));
    try {
      // Replace with actual API call
      // const response = await api.get('/api/admin/evaluators');
      // setAvailableEvaluators(response.data.evaluators);
      
      // Mock data
      setTimeout(() => {
        const mockEvaluators = [
          { id: 'EVAL001', name: 'John Smith', email: 'john@example.com' },
          { id: 'EVAL003', name: 'Robert Davis', email: 'robert@example.com' },
          { id: 'EVAL005', name: 'Lisa Wilson', email: 'lisa@example.com' },
          { id: 'EVAL006', name: 'David Thompson', email: 'david@example.com' },
          { id: 'EVAL007', name: 'Sarah Johnson', email: 'sarah@example.com' }
        ];
        setAvailableEvaluators(mockEvaluators);
        setLoading(prev => ({ ...prev, evaluators: false }));
      }, 600);
    } catch (error) {
      console.error('Error fetching evaluators:', error);
      setLoading(prev => ({ ...prev, evaluators: false }));
      toast.error('Failed to load evaluators');
    }
  };

  // Handle different actions
  const handleAction = (action, request) => {
    setSelectedRequest(request);
    setModalType(action);
    setModalVisible(true);
  };

  // Submit new reevaluation assignment
  const handleSubmitAssignment = async () => {
    // Validate form
    if (!copyId.trim()) {
      setFormError('Please enter a valid Copy ID');
      return;
    }
    if (!selectedEvaluator) {
      setFormError('Please select an evaluator');
      return;
    }

    setFormError('');
    setLoading(prev => ({ ...prev, submit: true }));

    try {
      // Replace with actual API call
      // const response = await api.post('/api/admin/assign-reevaluation', {
      //   copyId: copyId.trim(),
      //   assignedEvaluatorId: selectedEvaluator
      // });
      
      // Mock successful response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add to local state to update UI
      const selectedEvaluatorData = availableEvaluators.find(e => e.id === selectedEvaluator);
      
      const newRequest = {
        requestId: `RE${Math.floor(Math.random() * 1000)}`,
        copyId: copyId.trim(),
        subject: 'Subject Assignment Pending',
        evaluator: 'Original Evaluator',
        evaluatorId: 'UNKNOWN',
        originalMarks: 0,
        maxMarks: 100,
        status: 'Assigned',
        requestDate: new Date().toISOString(),
        reason: 'Administrative reevaluation request',
        assignedEvaluatorId: selectedEvaluator,
        assignedEvaluator: selectedEvaluatorData.name,
        reevaluatedMarks: null
      };
      
      setReevalRequests(prev => [newRequest, ...prev]);
      
      toast.success('Reevaluation assigned successfully');
      
      // Reset form and close modal
      setCopyId('');
      setSelectedEvaluator('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error assigning reevaluation:', error);
      setFormError('Failed to assign reevaluation. Please try again.');
      toast.error('Failed to assign reevaluation');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  // Filter requests based on search and status filter
  const filteredRequests = reevalRequests.filter(request => {
    const matchesSearch = 
      request.copyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.evaluator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assignedEvaluator?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Handle modal close
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
    setCopyId('');
    setSelectedEvaluator('');
    setFormError('');
  };

  // Open new assignment modal
  const openNewAssignmentModal = () => {
    setModalType('assign');
    setSelectedRequest(null);
    setModalVisible(true);
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Render the modal content based on type
  const renderModalContent = () => {
    switch (modalType) {
      case 'view':
        return (
          <>
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">View Re-Evaluation Request</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Request ID</label>
                    <div className="mt-1 text-sm font-medium">{selectedRequest.requestId}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Copy ID</label>
                    <div className="mt-1 text-sm font-medium">{selectedRequest.copyId}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Subject</label>
                    <div className="mt-1 text-sm font-medium">{selectedRequest.subject}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Original Evaluator</label>
                    <div className="mt-1 text-sm font-medium">{selectedRequest.evaluator}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Original Marks</label>
                    <div className="mt-1 text-sm font-medium">{selectedRequest.originalMarks}/{selectedRequest.maxMarks}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Reason for Re-Evaluation</label>
                  <div className="mt-1 text-sm bg-gray-50 p-2 rounded border border-gray-100">
                    {selectedRequest.reason || 'No reason provided'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Assigned Re-Evaluator</label>
                    <div className="mt-1 text-sm font-medium">
                      {selectedRequest.assignedEvaluator || 'Not assigned yet'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Re-Evaluated Marks</label>
                    <div className="mt-1 text-sm font-medium">
                      {selectedRequest.reevaluatedMarks ? `${selectedRequest.reevaluatedMarks}/${selectedRequest.maxMarks}` : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        );
        
      case 'assign':
        return (
          <>
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedRequest ? 'Reassign Evaluator' : 'New Re-Evaluation Assignment'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {formError && (
                <div className="mb-4 bg-red-50 p-3 rounded-md">
                  <div className="flex">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{formError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="copyId" className="block text-sm font-medium text-gray-700">
                    Copy ID <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="copyId"
                      value={copyId}
                      onChange={(e) => setCopyId(e.target.value)}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter copy barcode"
                      disabled={loading.submit}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="evaluator" className="block text-sm font-medium text-gray-700">
                    Assign Evaluator <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="evaluator"
                      value={selectedEvaluator}
                      onChange={(e) => setSelectedEvaluator(e.target.value)}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading.submit || loading.evaluators}
                    >
                      <option value="">Select an evaluator</option>
                      {availableEvaluators.map(evaluator => (
                        <option key={evaluator.id} value={evaluator.id}>
                          {evaluator.name} ({evaluator.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  {loading.evaluators && (
                    <p className="mt-2 text-xs text-gray-500">Loading evaluators...</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                    Reason for Re-evaluation
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="reason"
                      rows={3}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Provide a reason for this re-evaluation"
                      disabled={loading.submit}
                      defaultValue="Administrative re-evaluation request"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading.submit}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAssignment}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading.submit}
                >
                  {loading.submit ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Assign for Re-evaluation'
                  )}
                </button>
              </div>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Re-Evaluation Management</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage re-evaluation requests for answer copies
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={openNewAssignmentModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Assignment
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Copy ID, subject, evaluator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        {loading.table ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <DocumentTextIcon className="h-12 w-12 text-gray-300 mb-4" />
            <p>No re-evaluation requests found</p>
            <button 
              onClick={openNewAssignmentModal}
              className="mt-4 inline-flex items-center px-3 py-1.5 text-sm border border-transparent rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Create new assignment
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Marks</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Re-Evaluated</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.requestId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requestId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.copyId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.originalMarks}/{request.maxMarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.assignedEvaluator || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.reevaluatedMarks ? `${request.reevaluatedMarks}/${request.maxMarks}` : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleAction('view', request)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View details"
                      >
                        <VisibilityIcon className="h-5 w-5" />
                      </button>
                      
                      {request.status !== 'Completed' && (
                        <button 
                          onClick={() => handleAction('assign', request)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Reassign evaluator"
                        >
                          <RefreshIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination - simplified for now */}
      {!loading.table && filteredRequests.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredRequests.length}</span> requests
          </div>
        </div>
      )}
      
      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleBackdropClick}
            />

            {/* Center modal */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            
            <div className="inline-block w-full max-w-md text-left align-middle transform transition-all my-8">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                {renderModalContent()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reevaluation;