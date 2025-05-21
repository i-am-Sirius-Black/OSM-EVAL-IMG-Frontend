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