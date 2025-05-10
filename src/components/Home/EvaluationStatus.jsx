
import React, { useState, useMemo } from 'react';
import Evaluation from './Evaluation';

const EvaluationStatus = () => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for each status column
  const mockData = {
    checked: [
      { id: 'CP001', subjectName: 'Mathematics', date: '2025-04-26', score: '85/100', status: 'Checked' },
      { id: 'CP003', subjectName: 'Physics', date: '2025-04-27', score: '92/100', status: 'Checked' },
      { id: 'CP007', subjectName: 'Chemistry', date: '2025-04-28', score: '78/100', status: 'Checked' },
    ],
    partiallyChecked: [
      { id: 'CP002', subjectName: 'Mathematics', date: '2025-04-26', progress: '60%', status: 'Partial' },
      { id: 'CP005', subjectName: 'Biology', date: '2025-04-28', progress: '45%', status: 'Partial' },
    ],
    pending: [
      { id: 'CP004', subjectName: 'Physics', date: '2025-04-27', status: 'Pending', detail: 'Not Started' },
      { id: 'CP006', subjectName: 'Chemistry', date: '2025-04-28', status: 'Pending', detail: 'Assigned' },
      { id: 'CP008', subjectName: 'Biology', date: '2025-04-29', status: 'Pending', detail: 'Assigned' },
      { id: 'CP009', subjectName: 'Mathematics', date: '2025-04-29', status: 'Pending', detail: 'Not Started' },
    ]
  };

  // Combine and normalize all data for sorting and filtering
  const allCopies = useMemo(() => {
    // Normalize the data structure
    const result = [
      ...mockData.checked.map(copy => ({ 
        ...copy, 
        detail: copy.score,
        statusType: 'Checked'
      })),
      ...mockData.partiallyChecked.map(copy => ({ 
        ...copy, 
        detail: copy.progress,
        statusType: 'Partial'
      })),
      ...mockData.pending.map(copy => ({ 
        ...copy,
        statusType: 'Pending'
      }))
    ];
    
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
    
    // Apply filtering
    if (statusFilter !== 'all') {
      return result.filter(copy => copy.statusType === statusFilter);
    }
    
    return result;
  }, [mockData, sortConfig, statusFilter]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Evaluation Status</h3>
          <div className="flex items-center space-x-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Filter by status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="Checked">Checked</option>
              <option value="Partial">Partially Checked</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="h-[60vh] overflow-x-hidden overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('id')}
              >
                Copy ID{getSortIndicator('id')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('subjectName')}
              >
                Subject{getSortIndicator('subjectName')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('date')}
              >
                Date{getSortIndicator('date')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('statusType')}
              >
                Status{getSortIndicator('statusType')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allCopies.map((copy) => (
              <tr key={copy.id} className="hover:bg-gray-50 ">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {copy.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {copy.subjectName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {copy.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {copy.statusType === 'Checked' && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Checked
                    </span>
                  )}
                  {copy.statusType === 'Partial' && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Partial
                    </span>
                  )}
                  {copy.statusType === 'Pending' && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {copy.statusType === 'Checked' && (
                    <span className="text-sm text-green-600 font-medium">{copy.detail}</span>
                  )}
                  {copy.statusType === 'Partial' && (
                    <div>
                      <div className="w-24 bg-gray-200 rounded-full h-1.5 ">
                        <div 
                          className="bg-yellow-500 h-1.5 rounded-full" 
                          style={{ width: copy.detail }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-1">{copy.detail}</span>
                    </div>
                  )}
                  {copy.statusType === 'Pending' && (
                    <span className="text-sm text-gray-500 ">{copy.detail}</span>
                  )}
                </td>
              </tr>
            ))}
            {allCopies.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No copies matching the selected filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Summary Section */}
      <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
        <div className="flex space-x-4">
          <div>
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            Checked: {mockData.checked.length}
          </div>
          <div>
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
            Partial: {mockData.partiallyChecked.length}
          </div>
          <div>
            <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mr-1"></span>
            Pending: {mockData.pending.length}
          </div>
          <div className="ml-auto">
            {statusFilter === 'all' 
              ? `Total: ${mockData.checked.length + mockData.partiallyChecked.length + mockData.pending.length}`
              : `Filtered: ${allCopies.length}`
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationStatus;