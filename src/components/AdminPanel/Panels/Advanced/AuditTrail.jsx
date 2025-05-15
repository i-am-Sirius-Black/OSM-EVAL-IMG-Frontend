import React, { useState, useEffect } from 'react';

const AuditTrail = () => {
  // State management
  const [auditEntries, setAuditEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'history', 'remarks'
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Mock data - replace with API call
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockData = [
        {
          copyId: '44051023',
          subject: 'Mathematics',
          originalEvaluator: 'John Smith',
          reevaluator: 'Sarah Johnson',
          moderator: 'Dr. Robert Davis',
          markChanges: [
            { value: 72, by: 'John Smith', role: 'Evaluator', date: '2025-05-01T10:30:00' },
            { value: 75, by: 'Sarah Johnson', role: 'Re-evaluator', date: '2025-05-03T14:15:00' },
            { value: 74, by: 'Dr. Robert Davis', role: 'Moderator', date: '2025-05-05T16:45:00' }
          ],
          timeline: [
            { action: 'Assigned for evaluation', user: 'System', timestamp: '2025-04-29T08:00:00', details: 'Copy assigned to John Smith' },
            { action: 'Evaluation started', user: 'John Smith', timestamp: '2025-05-01T09:15:00', details: 'Started evaluation process' },
            { action: 'Evaluation completed', user: 'John Smith', timestamp: '2025-05-01T10:30:00', details: 'Awarded 72 marks' },
            { action: 'Re-evaluation requested', user: 'Admin', timestamp: '2025-05-02T11:20:00', details: 'Re-evaluation requested due to potential calculation errors' },
            { action: 'Re-evaluation assigned', user: 'System', timestamp: '2025-05-02T13:45:00', details: 'Copy assigned to Sarah Johnson for re-evaluation' },
            { action: 'Re-evaluation completed', user: 'Sarah Johnson', timestamp: '2025-05-03T14:15:00', details: 'Awarded 75 marks' },
            { action: 'Moderation assigned', user: 'Admin', timestamp: '2025-05-04T09:30:00', details: 'Copy assigned to Dr. Robert Davis for moderation' },
            { action: 'Moderation completed', user: 'Dr. Robert Davis', timestamp: '2025-05-05T16:45:00', details: 'Finalized with 74 marks' }
          ],
          remarks: [
            { user: 'John Smith', role: 'Evaluator', timestamp: '2025-05-01T10:30:00', text: 'Q3 partially correct. Q5 has calculation errors.' },
            { user: 'Sarah Johnson', role: 'Re-evaluator', timestamp: '2025-05-03T14:15:00', text: 'Q3 deserves more marks as approach is correct. Q5 calculations are actually correct.' },
            { user: 'Dr. Robert Davis', role: 'Moderator', timestamp: '2025-05-05T16:45:00', text: 'Agree with re-evaluator on Q3. Q5 partial credit warranted.' }
          ]
        },
        {
          copyId: '44051045',
          subject: 'Physics',
          originalEvaluator: 'Michael Brown',
          reevaluator: null,
          moderator: 'Dr. Lisa Wilson',
          markChanges: [
            { value: 65, by: 'Michael Brown', role: 'Evaluator', date: '2025-05-02T11:45:00' },
            { value: 68, by: 'Dr. Lisa Wilson', role: 'Moderator', date: '2025-05-06T13:20:00' }
          ],
          timeline: [
            { action: 'Assigned for evaluation', user: 'System', timestamp: '2025-05-01T08:00:00', details: 'Copy assigned to Michael Brown' },
            { action: 'Evaluation started', user: 'Michael Brown', timestamp: '2025-05-02T09:30:00', details: 'Started evaluation process' },
            { action: 'Evaluation completed', user: 'Michael Brown', timestamp: '2025-05-02T11:45:00', details: 'Awarded 65 marks' },
            { action: 'Moderation assigned', user: 'Admin', timestamp: '2025-05-05T10:15:00', details: 'Copy assigned to Dr. Lisa Wilson for moderation' },
            { action: 'Moderation completed', user: 'Dr. Lisa Wilson', timestamp: '2025-05-06T13:20:00', details: 'Finalized with 68 marks' }
          ],
          remarks: [
            { user: 'Michael Brown', role: 'Evaluator', timestamp: '2025-05-02T11:45:00', text: 'Some concepts misunderstood in Q2. Good approach in Q4.' },
            { user: 'Dr. Lisa Wilson', role: 'Moderator', timestamp: '2025-05-06T13:20:00', text: 'Q2 deserves partial credit for approach. Increasing marks.' }
          ]
        },
        {
          copyId: '44051067',
          subject: 'Chemistry',
          originalEvaluator: 'Emily Clark',
          reevaluator: null,
          moderator: null,
          markChanges: [
            { value: 82, by: 'Emily Clark', role: 'Evaluator', date: '2025-05-03T15:20:00' }
          ],
          timeline: [
            { action: 'Assigned for evaluation', user: 'System', timestamp: '2025-05-02T08:00:00', details: 'Copy assigned to Emily Clark' },
            { action: 'Evaluation started', user: 'Emily Clark', timestamp: '2025-05-03T13:40:00', details: 'Started evaluation process' },
            { action: 'Evaluation completed', user: 'Emily Clark', timestamp: '2025-05-03T15:20:00', details: 'Awarded 82 marks' }
          ],
          remarks: [
            { user: 'Emily Clark', role: 'Evaluator', timestamp: '2025-05-03T15:20:00', text: 'Well-structured answers. Minor errors in Q5 chemical equations.' }
          ]
        }
      ];
      
      setAuditEntries(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle different actions
  const handleAction = (action, entry) => {
    setSelectedEntry(entry);
    setModalType(action);
    setModalVisible(true);
  };

  // Get unique subjects for filter
  const subjects = [...new Set(auditEntries.map(entry => entry.subject))];

  // Filter entries based on search, subject and action filters
  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = 
      entry.copyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.originalEvaluator && entry.originalEvaluator.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.reevaluator && entry.reevaluator.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.moderator && entry.moderator.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = subjectFilter === 'all' || entry.subject === subjectFilter;
    
    const matchesAction = actionFilter === 'all' || 
      (actionFilter === 'evaluated' && entry.originalEvaluator) ||
      (actionFilter === 'reevaluated' && entry.reevaluator) ||
      (actionFilter === 'moderated' && entry.moderator);
    
    return matchesSearch && matchesSubject && matchesAction;
  });

  // Handle modal close
  const closeModal = () => {
    setModalVisible(false);
    setSelectedEntry(null);
  };

  // Render timeline modal
  const renderTimelineModal = () => {
    if (!selectedEntry) return null;
    
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Action Timeline for Copy #{selectedEntry.copyId}</h3>
          <button 
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Copy ID:</span> {selectedEntry.copyId}
            </div>
            <div>
              <span className="text-gray-500">Subject:</span> {selectedEntry.subject}
            </div>
            <div>
              <span className="text-gray-500">Current Mark:</span> {selectedEntry.markChanges[selectedEntry.markChanges.length - 1].value}
            </div>
            <div>
              <span className="text-gray-500">Mark Changes:</span> {selectedEntry.markChanges.map(change => change.value).join(' → ')}
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <div className="relative">
            {selectedEntry.timeline.map((event, index) => (
              <div key={index} className="mb-8 relative">
                {/* Timeline connector */}
                {index < selectedEntry.timeline.length - 1 && (
                  <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                )}
                
                <div className="flex gap-4">
                  {/* Timeline bullet */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center z-10">
                    {getActionIcon(event.action)}
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{event.action}</h4>
                      <time className="text-xs text-gray-500">{formatDateTime(event.timestamp)}</time>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{event.details}</p>
                    <p className="mt-1 text-xs text-gray-400">By: {event.user}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <button 
            onClick={() => handleAction('remarks', selectedEntry)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Remarks
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
  };

  // Render remarks modal
  const renderRemarksModal = () => {
    if (!selectedEntry) return null;
    
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Remarks for Copy #{selectedEntry.copyId}</h3>
          <button 
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Copy ID:</span> {selectedEntry.copyId}
            </div>
            <div>
              <span className="text-gray-500">Subject:</span> {selectedEntry.subject}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {selectedEntry.remarks.map((remark, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-md">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleBadgeColor(remark.role)}`}>
                    {remark.role}
                  </span>
                  <span className="text-sm font-medium">{remark.user}</span>
                </div>
                <time className="text-xs text-gray-500">{formatDateTime(remark.timestamp)}</time>
              </div>
              <p className="mt-2 text-sm">{remark.text}</p>
            </div>
          ))}
          
          {selectedEntry.remarks.length === 0 && (
            <p className="text-center text-gray-500 italic py-4">No remarks available</p>
          )}
        </div>
        
        <div className="mt-6 flex justify-between">
          <button 
            onClick={() => handleAction('history', selectedEntry)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Timeline
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
  };

  // Helper function to get appropriate icon for timeline events
  const getActionIcon = (action) => {
    if (action.includes('Assigned')) {
      return (
        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    } else if (action.includes('started')) {
      return (
        <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (action.includes('completed')) {
      return (
        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else if (action.includes('requested')) {
      return (
        <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    } else {
      return (
        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  // Helper function to get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Evaluator':
        return 'bg-blue-100 text-blue-800';
      case 'Re-evaluator':
        return 'bg-purple-100 text-purple-800';
      case 'Moderator':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  // Format date only
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get mark changes as formatted string
  const getMarkChangesString = (changes) => {
    if (!changes || changes.length === 0) return '—';
    return changes.map(change => change.value).join(' → ');
  };

  // Handle export to CSV
  const handleExportReport = () => {
    // In a real implementation, you would generate a CSV file here
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Audit Trail</h2>
        <p className="text-sm text-gray-500 mt-1">
          Track the full history of each copy and all actions performed
        </p>
      </div>
      
      {/* Filters and Search */}
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
          
          <button 
            onClick={handleExportReport}
            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export Report</span>
          </button>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
            <select 
              value={actionFilter} 
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Actions</option>
              <option value="evaluated">Evaluated</option>
              <option value="reevaluated">Re-evaluated</option>
              <option value="moderated">Moderated</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input 
              type="date" 
              value={dateRange.from}
              onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input 
              type="date" 
              value={dateRange.to}
              onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No audit entries found</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluator</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reevaluated By</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moderated By</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mark Changes</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.copyId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.originalEvaluator || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.reevaluator || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.moderator || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getMarkChangesString(entry.markChanges)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-3 justify-end">
                      <button 
                        onClick={() => handleAction('history', entry)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Timeline
                      </button>
                      
                      <button 
                        onClick={() => handleAction('remarks', entry)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Remarks
                      </button>
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
          Showing <span className="font-medium">{filteredEntries.length}</span> of <span className="font-medium">{auditEntries.length}</span> entries
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {modalType === 'history' ? renderTimelineModal() : renderRemarksModal()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditTrail;