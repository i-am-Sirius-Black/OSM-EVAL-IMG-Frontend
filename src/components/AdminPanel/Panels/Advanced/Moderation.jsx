import React, { useState, useEffect } from 'react';

const Moderation = () => {
  // State management
  const [moderationRequests, setModerationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'assign', 'comments', 'finalize'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Mock data - replace with API call
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockData = [
        {
          id: 'MOD001',
          copyId: '44051023',
          subject: 'Mathematics',
          evaluator: 'John Smith',
          originalMarks: 72,
          maxMarks: 100,
          moderator: null,
          moderatedMarks: null,
          status: 'Pending',
          assignedDate: '2025-05-01T08:30:00',
          comments: null
        },
        {
          id: 'MOD002',
          copyId: '44051045',
          subject: 'Physics',
          evaluator: 'Anna Johnson',
          originalMarks: 65,
          maxMarks: 100,
          moderator: 'Dr. Robert Davis',
          moderatedMarks: 68,
          status: 'Completed',
          assignedDate: '2025-05-02T10:15:00',
          comments: 'Properly answered Q3 deserving additional marks. Calculation in Q5 correct but misinterpreted.'
        },
        {
          id: 'MOD003',
          copyId: '44051067',
          subject: 'Chemistry',
          evaluator: 'Michael Brown',
          originalMarks: 58,
          maxMarks: 100,
          moderator: 'Dr. Lisa Wilson',
          moderatedMarks: null,
          status: 'Assigned',
          assignedDate: '2025-05-03T14:45:00',
          comments: null
        }
      ];
      
      setModerationRequests(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle different actions
  const handleAction = (action, request) => {
    setSelectedRequest(request);
    setModalType(action);
    setModalVisible(true);
  };

  // Get unique subjects for filter
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];

  // Filter requests based on search, status and subject filters
  const filteredRequests = moderationRequests.filter(request => {
    const matchesSearch = 
      request.copyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.evaluator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.moderator && request.moderator.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSubject = subjectFilter === 'all' || request.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Handle modal close
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
  };

  // Render the modal content based on type
  const renderModalContent = () => {
    if (!selectedRequest) return null;

    switch (modalType) {
      case 'view':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">View Copy Details</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Copy ID</p>
                  <p className="font-medium">{selectedRequest.copyId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{selectedRequest.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Evaluator</p>
                  <p className="font-medium">{selectedRequest.evaluator}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Original Marks</p>
                  <p className="font-medium">{selectedRequest.originalMarks}/{selectedRequest.maxMarks}</p>
                </div>
              </div>
              
              {selectedRequest.moderator && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Moderator</p>
                      <p className="font-medium">{selectedRequest.moderator}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Moderated Marks</p>
                      <p className="font-medium">
                        {selectedRequest.moderatedMarks ? 
                          `${selectedRequest.moderatedMarks}/${selectedRequest.maxMarks}` : 
                          'Pending'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {selectedRequest.comments && (
                    <div>
                      <p className="text-sm text-gray-500">Moderation Comments</p>
                      <p className="bg-gray-50 p-2 rounded text-sm">{selectedRequest.comments}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="mt-5 flex items-center justify-between">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => alert('Viewing PDF is not implemented in this demo')}
              >
                View Answer PDF
              </button>
              
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        );
        
      case 'assign':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Assign Moderator</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Copy ID</p>
                <p className="font-medium">{selectedRequest.copyId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium">{selectedRequest.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Evaluator</p>
                <p className="font-medium">{selectedRequest.evaluator}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Original Marks</p>
                <p className="font-medium">{selectedRequest.originalMarks}/{selectedRequest.maxMarks}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Select Moderator</label>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Select a Moderator</option>
                  <option value="mod1">Dr. Robert Davis</option>
                  <option value="mod2">Dr. Lisa Wilson</option>
                  <option value="mod3">Prof. James Miller</option>
                  <option value="mod4">Dr. Sarah Johnson</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Moderation Deadline</label>
                <input 
                  type="date" 
                  className="w-full p-2 border border-gray-300 rounded"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Instructions (Optional)</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded h-20 resize-none"
                  placeholder="Add any specific instructions for the moderator"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </div>
        );
        
      case 'comments':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Moderation Comments</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Copy ID</p>
                  <p className="font-medium">{selectedRequest.copyId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{selectedRequest.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Moderator</p>
                  <p className="font-medium">{selectedRequest.moderator}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Original Marks</p>
                  <p className="font-medium">{selectedRequest.originalMarks}/{selectedRequest.maxMarks}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Moderated Marks</p>
                  <p className="font-medium">
                    {selectedRequest.moderatedMarks ? 
                      `${selectedRequest.moderatedMarks}/${selectedRequest.maxMarks}` : 
                      'Pending'
                    }
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Moderation Comments</p>
                {selectedRequest.comments ? (
                  <p className="bg-gray-50 p-3 rounded text-sm border border-gray-100">{selectedRequest.comments}</p>
                ) : (
                  <p className="italic text-gray-400">No comments provided</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Changes by Question</p>
                <div className="border border-gray-200 rounded-md mt-1 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Question</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Original</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Moderated</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Change</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Mock question data - replace with actual data */}
                      <tr>
                        <td className="px-3 py-2 text-sm">Q1</td>
                        <td className="px-3 py-2 text-sm">8/10</td>
                        <td className="px-3 py-2 text-sm">8/10</td>
                        <td className="px-3 py-2 text-sm">No change</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm">Q2</td>
                        <td className="px-3 py-2 text-sm">15/20</td>
                        <td className="px-3 py-2 text-sm">15/20</td>
                        <td className="px-3 py-2 text-sm">No change</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm">Q3</td>
                        <td className="px-3 py-2 text-sm">12/20</td>
                        <td className="px-3 py-2 text-sm">15/20</td>
                        <td className="px-3 py-2 text-sm text-green-600">+3</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm">Q4</td>
                        <td className="px-3 py-2 text-sm">10/15</td>
                        <td className="px-3 py-2 text-sm">10/15</td>
                        <td className="px-3 py-2 text-sm">No change</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm">Q5</td>
                        <td className="px-3 py-2 text-sm">20/35</td>
                        <td className="px-3 py-2 text-sm">20/35</td>
                        <td className="px-3 py-2 text-sm">No change</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        );
        
      case 'finalize':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Finalize Moderation</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Copy ID</p>
                  <p className="font-medium">{selectedRequest.copyId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{selectedRequest.subject}</p>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Original Evaluator</p>
                    <p className="font-medium">{selectedRequest.evaluator}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Moderator</p>
                    <p className="font-medium">{selectedRequest.moderator}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Original Marks</p>
                    <p className="font-medium">{selectedRequest.originalMarks}/{selectedRequest.maxMarks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Moderated Marks</p>
                    <p className="font-medium">
                      {selectedRequest.moderatedMarks ? 
                        `${selectedRequest.moderatedMarks}/${selectedRequest.maxMarks}` : 
                        'Pending'
                      }
                    </p>
                  </div>
                </div>
                
                {selectedRequest.comments && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Moderation Comments</p>
                    <p className="text-sm mt-1">{selectedRequest.comments}</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Select Final Marks</p>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <input type="radio" name="finalMarks" className="h-4 w-4 text-blue-600" defaultChecked />
                    <div className="ml-3">
                      <p className="text-sm font-medium">Accept Moderated Marks</p>
                      <p className="text-xs text-gray-500">
                        Set final marks to {selectedRequest.moderatedMarks || 'moderated'} (Recommended)
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <input type="radio" name="finalMarks" className="h-4 w-4 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium">Keep Original Marks</p>
                      <p className="text-xs text-gray-500">
                        Revert to original {selectedRequest.originalMarks} marks
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <input type="radio" name="finalMarks" className="h-4 w-4 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium">Custom Value</p>
                      <input 
                        type="number" 
                        className="mt-1 p-1.5 w-24 border border-gray-300 rounded text-sm" 
                        placeholder="Enter marks"
                        min="0"
                        max={selectedRequest.maxMarks}
                      />
                    </div>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Notes (Optional)</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded h-20 resize-none"
                  placeholder="Add any notes about this moderation decision"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm & Finalize
              </button>
            </div>
          </div>
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Moderation Management</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage and oversee the moderation process for evaluated answer scripts
        </p>
      </div>
      
      {/* Filters and Search */}
      <div className="p-6 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID, evaluator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
          </select>
          
          <select 
            value={subjectFilter} 
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        
        <button className="inline-flex items-center gap-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Moderation</span>
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No moderation requests found</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluator</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Marks</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moderator</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moderated Marks</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.copyId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.evaluator}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.originalMarks}/{request.maxMarks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.moderator || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.moderatedMarks ? 
                      `${request.moderatedMarks}/${request.maxMarks}` : 
                      '—'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-3 justify-end">
                      <button 
                        onClick={() => handleAction('view', request)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      
                      {request.status === 'Pending' && (
                        <button 
                          onClick={() => handleAction('assign', request)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Assign
                        </button>
                      )}
                      
                      {request.moderator && request.comments && (
                        <button 
                          onClick={() => handleAction('comments', request)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Comments
                        </button>
                      )}
                      
                      {request.status === 'Completed' && (
                        <button 
                          onClick={() => handleAction('finalize', request)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Finalize
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
      
      {/* Pagination (simplified) */}
      <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredRequests.length}</span> results
        </div>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
      
      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Moderation;
