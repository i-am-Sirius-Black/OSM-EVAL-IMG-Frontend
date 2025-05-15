import { useState } from "react";
import { useEffect } from "react";

// CopySelector Component
const CopySelector = ({ copies, selectedCopies, setSelectedCopies, loading }) => {
  const [selectAll, setSelectAll] = useState(false);
  
  // Handle select all toggle
  useEffect(() => {
    if (selectAll) {
      setSelectedCopies(copies.map(copy => copy.id));
    } else if (selectedCopies.length === copies.length) {
      setSelectedCopies([]);
    }
  }, [selectAll, copies]);
  
  // Toggle individual copy selection
  const toggleCopy = (copyId) => {
    if (selectedCopies.includes(copyId)) {
      setSelectedCopies(selectedCopies.filter(id => id !== copyId));
    } else {
      setSelectedCopies([...selectedCopies, copyId]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading copies...</span>
      </div>
    );
  }

  if (copies.length === 0) {
    return (
      <div className="border border-gray-200 rounded-md p-6 text-center">
        <p className="text-gray-500 text-sm">No copies available for this subject</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center">
          <input
            id="select-all"
            type="checkbox"
            checked={selectAll}
            onChange={(e) => setSelectAll(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
            Select All
          </label>
        </div>
        <span className="text-xs text-gray-500">
          {selectedCopies.length} of {copies.length} selected
        </span>
      </div>
      
      <div className="max-h-60 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <span className="sr-only">Select</span>
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Copy ID
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {copies.map((copy) => (
              <tr 
                key={copy.id} 
                className={selectedCopies.includes(copy.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedCopies.includes(copy.id)}
                    onChange={() => toggleCopy(copy.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {copy.barcode || copy.id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CopySelector;