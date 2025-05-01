import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

const RejectedCopies = () => {
  const [rejectedCopies, setRejectedCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEvalId, setFilterEvalId] = useState('');
  const [filterCopyId, setFilterCopyId] = useState('');
  const [unrejectingCopyId, setUnrejectingCopyId] = useState(null);

  useEffect(() => {
    fetchRejectedCopies();
  }, []);

  const fetchRejectedCopies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/copy/rejected');
      
      if (response.status === 200) {
        setRejectedCopies(response.data);
      } else {
        setError('Failed to fetch rejected copies');
      }
    } catch (error) {
      console.error('Error fetching rejected copies:', error);
      setError('Error loading rejected copies. Please try again.');
      
      // For development/demo purposes - comment out in production
      setRejectedCopies([
        { copyid: 'CP001', reject_reason: 'Incomplete annotation of answers', eval_id: 'EVAL123', bag_id: 'BAG001' },
        { copyid: 'CP002', reject_reason: 'Inconsistent marking scheme applied', eval_id: 'EVAL456', bag_id: 'BAG002' },
        { copyid: 'CP003', reject_reason: 'Incorrect total calculation', eval_id: 'EVAL789', bag_id: 'BAG001' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnreject = async (copyid) => {
    if (!confirm('Are you sure you want to unreject this copy? It will be marked as checked again.')) {
      return;
    }
    
    try {
      setUnrejectingCopyId(copyid);
      
      const response = await api.post(`/api/copy/unreject`, {
        copyId: copyid,
      });
      console.log("Unreject response:", response.data);
      if(response.status !== 200) {
        toast.error(response.error);
        return;
      }
      
      // Remove the copy from the list
      setRejectedCopies(prev => prev.filter(copy => copy.copyid !== copyid));
      
      // Show success message
      toast.success('Copy has been successfully unrejected');
    } catch (error) {
      console.error('Error unrejecting copy:', error);
      toast.error('Failed to unreject copy. Please try again.');
    } finally {
      setUnrejectingCopyId(null);
    }
  };

  const filteredCopies = rejectedCopies.filter(copy => {
    const matchesEval = !filterEvalId || copy.eval_id.toLowerCase().includes(filterEvalId.toLowerCase());
    const matchesCopy = !filterCopyId || copy.copyid.toLowerCase().includes(filterCopyId.toLowerCase());
    return matchesEval && matchesCopy;
  });

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Rejected Copies</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Review copies that have been rejected and their reasons</p>
        </div>
        
        {loading ? (
          <div className="px-4 py-5 sm:p-6 text-center">Loading rejected copies...</div>
        ) : error ? (
          <div className="px-4 py-5 sm:p-6 text-center text-red-500">{error}</div>
        ) : (
          <div className="px-4 py-5 sm:p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Filter by Evaluator ID</label>
                <input
                  type="text"
                  value={filterEvalId}
                  onChange={(e) => setFilterEvalId(e.target.value)}
                  placeholder="Search by evaluator ID"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filter by Copy ID</label>
                <input
                  type="text"
                  value={filterCopyId}
                  onChange={(e) => setFilterCopyId(e.target.value)}
                  placeholder="Search by copy ID"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
            </div>

            {/* Copies Table */}
            <div className="mt-4 flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Copy ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Evaluator ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bag ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rejection Reason
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCopies.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                              No rejected copies found
                            </td>
                          </tr>
                        ) : (
                          filteredCopies.map((copy) => (
                            <tr key={copy.copyid}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{copy.copyid}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{copy.eval_id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{copy.bag_id}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{copy.reject_reason}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleUnreject(copy.copyid)}
                                  disabled={unrejectingCopyId === copy.copyid}
                                  className={`${
                                    unrejectingCopyId === copy.copyid 
                                      ? 'text-gray-400 cursor-not-allowed' 
                                      : 'text-green-600 hover:text-green-900'
                                  }`}
                                >
                                  {unrejectingCopyId === copy.copyid ? 'Processing...' : 'Unreject'}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RejectedCopies;