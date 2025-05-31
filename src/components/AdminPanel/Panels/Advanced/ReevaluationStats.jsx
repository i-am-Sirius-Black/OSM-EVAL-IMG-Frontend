
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../../api/axios';

const ReevaluationStats = () => {
  const [reevaluations, setReevaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('assignedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all'); // New filter state

  // Fetch reevaluation data
  useEffect(() => {
    const fetchReevaluationData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/reevaluation-assignments');
        setReevaluations(response.data.reevaluations || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching reevaluation stats:', err);
        setError('Failed to load reevaluation data');
        toast.error('Failed to load reevaluation data');
      } finally {
        setLoading(false);
      }
    };

    fetchReevaluationData();
  }, []);

  // Handler for sorting
  const handleSort = (field) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  // Filter data based on checked status
  const filteredReevaluations = reevaluations.filter((reevaluation) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'checked') return reevaluation.isChecked === true;
    if (filterStatus === 'unchecked') return reevaluation.isChecked === false;
    return true;
  });

  // Sort the filtered data
  const sortedReevaluations = [...filteredReevaluations].sort((a, b) => {
    if (sortField === 'assignedAt' || sortField === 'submittedAt') {
      const dateA = a[sortField] ? new Date(a[sortField]) : new Date(0);
      const dateB = b[sortField] ? new Date(b[sortField]) : new Date(0);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'reevaluatedMarks') {
      const marksA = a[sortField] !== null ? a[sortField] : -1;
      const marksB = b[sortField] !== null ? b[sortField] : -1;
      return sortOrder === 'asc' ? marksA - marksB : marksB - marksA;
    } else {
      const valA = (a[sortField] || '').toString().toLowerCase();
      const valB = (b[sortField] || '').toString().toLowerCase();
      return sortOrder === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const sortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Re-evaluation Assignments</h2>
          
          {/* Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <label htmlFor="filter-status" className="text-sm font-medium text-gray-700">
              Filter:
            </label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="checked">Checked</option>
              <option value="unchecked">Unchecked</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 py-2">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('copyId')}
                  >
                    Copy ID {sortIcon('copyId')}
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('evaluatorId')}
                  >
                    Evaluator ID {sortIcon('evaluatorId')}
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortIcon('status')}
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('assignedAt')}
                  >
                    Assigned At {sortIcon('assignedAt')}
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('submittedAt')}
                  >
                    Submitted At {sortIcon('submittedAt')}
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('reevaluatedMarks')}
                  >
                    ReEval Marks {sortIcon('reevaluatedMarks')}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedReevaluations.map((reevaluation) => (
                  <tr key={reevaluation.requestId} className={`${reevaluation.isChecked ? "bg-green-50" : "hover:bg-gray-50"} `}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reevaluation.copyId}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {reevaluation.evaluatorId}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs rounded ${
                        reevaluation.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reevaluation.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(reevaluation.assignedAt)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(reevaluation.submittedAt)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {reevaluation.reevaluatedMarks !== null ? reevaluation.reevaluatedMarks : '-'}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500 max-w-xs truncate">
                      {reevaluation.remarks || '-'}
                    </td>
                  </tr>
                ))}
                {sortedReevaluations.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-3 py-3 text-center text-sm text-gray-500">
                      No re-evaluation assignments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>
                Showing: {sortedReevaluations.length} of {reevaluations.length} assignments
              </div>
              <div>
                Total: {reevaluations.length} assignments
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReevaluationStats;