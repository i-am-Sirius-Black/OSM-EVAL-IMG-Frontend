import React, { useState, useEffect } from 'react';

const FinalMarkReview = () => {
  // State management
  const [finalMarks, setFinalMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCopies, setSelectedCopies] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmModal, setConfirmModal] = useState({ visible: false, action: '', copyId: null });

  // Mock data - replace with API call
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockData = [
        {
          copyId: '44051023',
          subject: 'Mathematics',
          evaluator: 'John Smith',
          finalMarks: 74,
          maxMarks: 100,
          source: 'Moderation',
          locked: true,
          lastUpdated: '2025-05-05T16:45:00'
        },
        {
          copyId: '44051045',
          subject: 'Physics',
          evaluator: 'Michael Brown',
          finalMarks: 68,
          maxMarks: 100,
          source: 'Moderation',
          locked: true,
          lastUpdated: '2025-05-06T13:20:00'
        },
        {
          copyId: '44051067',
          subject: 'Chemistry',
          evaluator: 'Emily Clark',
          finalMarks: 82,
          maxMarks: 100,
          source: 'Evaluation',
          locked: false,
          lastUpdated: '2025-05-03T15:20:00'
        },
        {
          copyId: '44051089',
          subject: 'Biology',
          evaluator: 'Lisa Wilson',
          finalMarks: 92,
          maxMarks: 100,
          source: 'Evaluation',
          locked: false,
          lastUpdated: '2025-05-04T11:30:00'
        },
        {
          copyId: '44051112',
          subject: 'Physics',
          evaluator: 'Anna Johnson',
          finalMarks: 61,
          maxMarks: 100,
          source: 'Re-evaluation',
          locked: true,
          lastUpdated: '2025-05-07T09:15:00'
        }
      ];
      
      setFinalMarks(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedCopies(filteredMarks.map(mark => mark.copyId));
    } else {
      setSelectedCopies([]);
    }
  }, [selectAll]);

  // Toggle selection of a single copy
  const toggleCopySelection = (copyId) => {
    if (selectedCopies.includes(copyId)) {
      setSelectedCopies(selectedCopies.filter(id => id !== copyId));
    } else {
      setSelectedCopies([...selectedCopies, copyId]);
    }
  };

  // Get unique subjects for filter
  const subjects = [...new Set(finalMarks.map(mark => mark.subject))];

  // Filter marks based on search, subject and status filters
  const filteredMarks = finalMarks.filter(mark => {
    const matchesSearch = 
      mark.copyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.evaluator.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || mark.subject === subjectFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'locked' && mark.locked) ||
      (statusFilter === 'unlocked' && !mark.locked);
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Handle lock/unlock action
  const handleLockAction = (copyId, action) => {
    setConfirmModal({ visible: true, action, copyId });
  };

  // Confirm lock/unlock action
  const confirmAction = () => {
    const { action, copyId } = confirmModal;
    
    if (action === 'lock') {
      // Lock the marks - in real app would call API
      setFinalMarks(finalMarks.map(mark => 
        mark.copyId === copyId ? { ...mark, locked: true } : mark
      ));
    } else if (action === 'unlock') {
      // Unlock the marks - in real app would call API
      setFinalMarks(finalMarks.map(mark => 
        mark.copyId === copyId ? { ...mark, locked: false } : mark
      ));
    } else if (action === 'bulkLock') {
      // Lock all selected marks - in real app would call API
      setFinalMarks(finalMarks.map(mark => 
        selectedCopies.includes(mark.copyId) ? { ...mark, locked: true } : mark
      ));
      setSelectedCopies([]);
      setSelectAll(false);
    }
    
    setConfirmModal({ visible: false, action: '', copyId: null });
  };

  // Handle bulk export
  const handleBulkExport = () => {
    // In a real implementation, you would generate a CSV file here
    const selectedData = finalMarks.filter(mark => selectedCopies.includes(mark.copyId));
    alert(`Exporting ${selectedData.length} records for result processing`);
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Final Mark Review</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review and lock final marks before result processing
        </p>
      </div>
      
      {/* Filters and Actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
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
          
          <div className="flex space-x-2">
            <button 
              onClick={() => selectedCopies.length > 0 && handleLockAction(null, 'bulkLock')}
              disabled={selectedCopies.length === 0}
              className={`inline-flex items-center gap-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                selectedCopies.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-green-300 cursor-not-allowed'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Lock Selected</span>
            </button>
            
            <button 
              onClick={handleBulkExport}
              disabled={selectedCopies.length === 0}
              className={`inline-flex items-center gap-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                selectedCopies.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export Selected</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="locked">Locked</option>
              <option value="unlocked">Unlocked</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selected</label>
            <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
              {selectedCopies.length} of {filteredMarks.length} copies
            </div>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredMarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No final marks found</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => setSelectAll(!selectAll)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy ID</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluator</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Marks</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMarks.map((mark) => (
                <tr key={mark.copyId} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedCopies.includes(mark.copyId)}
                      onChange={() => toggleCopySelection(mark.copyId)}
                      disabled={mark.locked}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mark.copyId}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{mark.subject}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{mark.evaluator}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {mark.finalMarks}/{mark.maxMarks}
                    <span className="ml-1 text-xs text-gray-500">
                      ({((mark.finalMarks / mark.maxMarks) * 100).toFixed(1)}%)
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSourceBadgeColor(mark.source)}`}>
                      {mark.source}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 ${mark.locked ? 'text-green-600' : 'text-yellow-600'}`}>
                      {mark.locked ? (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="text-xs font-medium">Locked</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs font-medium">Unlocked</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(mark.lastUpdated)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {mark.locked ? (
                      <button 
                        onClick={() => handleLockAction(mark.copyId, 'unlock')}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Reopen
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleLockAction(mark.copyId, 'lock')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Lock
                      </button>
                    )}
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
          Showing <span className="font-medium">{filteredMarks.length}</span> of <span className="font-medium">{finalMarks.length}</span> results
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
      
      {/* Confirmation Modal */}
      {confirmModal.visible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              {confirmModal.action === 'lock' || confirmModal.action === 'bulkLock' ? (
                <div className="rounded-full bg-green-100 p-2 mr-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              ) : (
                <div className="rounded-full bg-yellow-100 p-2 mr-3">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              <h3 className="text-lg font-medium text-gray-900">
                {confirmModal.action === 'lock' && 'Lock Final Marks'}
                {confirmModal.action === 'unlock' && 'Reopen for Changes'}
                {confirmModal.action === 'bulkLock' && 'Lock Multiple Records'}
              </h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              {confirmModal.action === 'lock' && 'Once locked, these marks will be used for final result processing and cannot be changed without administrative reopening.'}
              {confirmModal.action === 'unlock' && 'Reopening will allow further changes to the marks. This should only be done in exceptional circumstances.'}
              {confirmModal.action === 'bulkLock' && `You are about to lock ${selectedCopies.length} records. Locked records will be used for final result processing and cannot be changed without administrative reopening.`}
            </p>
            
            {confirmModal.action === 'lock' && (
              <div className="bg-yellow-50 p-3 rounded-md mb-4 text-sm text-yellow-700">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p>Are you sure you want to lock this record? This action cannot be easily reversed.</p>
                </div>
              </div>
            )}
            
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ visible: false, action: '', copyId: null })}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded ${
                  confirmModal.action === 'unlock' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {confirmModal.action === 'lock' && 'Lock Marks'}
                {confirmModal.action === 'unlock' && 'Reopen Record'}
                {confirmModal.action === 'bulkLock' && 'Lock Selected Records'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get source badge color
const getSourceBadgeColor = (source) => {
  switch (source) {
    case 'Evaluation':
      return 'bg-blue-100 text-blue-800';
    case 'Re-evaluation':
      return 'bg-purple-100 text-purple-800';
    case 'Moderation':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default FinalMarkReview;