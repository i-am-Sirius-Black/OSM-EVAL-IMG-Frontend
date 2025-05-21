import React, { useState, useEffect } from 'react';
import API_ROUTES from '../../../../api/routes';
import api from '../../../../api/axios.js'; 

const EvaluatorStatus = () => {
  const [evaluators, setEvaluators] = useState([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
    const fetchEvaluatorsStatus = async () => {
      setLoading(true);
      try {
        const response = await api.get(API_ROUTES.ADMIN.GET_EVALUATORS_STATUS);
        const data = response.data.evaluators;

        console.log("Fetched evaluators data:", data);
        
        // Transform the API data to match your component's expected structure
        const formattedEvaluators = data.map(evaluator => ({
          id: evaluator.evaluatorId,
          name: evaluator.name || evaluator.evaluatorId, // Use ID as fallback if name is missing
          checked: evaluator.checked,
          remaining: evaluator.pending,
          total: evaluator.totalAssigned,
          email: evaluator.email || ""
        }));
        
        setEvaluators(formattedEvaluators);
        console.log("Set evaluators data:", formattedEvaluators);
        
      } catch (error) {
        console.error('Error fetching evaluators:', error);
        // Set empty array in case of error
        setEvaluators([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvaluatorsStatus();
  }, []);

  return (
  <div>
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Evaluator Status</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Overview of evaluator progress and workload</p>
      </div>
      {loading ? (
        <div className="px-4 py-5 sm:p-6 text-center">Loading evaluator data...</div>
      ) : evaluators.length > 0 ? (
        <div className="px-4 py-5 sm:p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checked
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
               {evaluators.map((evaluator) => {
                  const total = evaluator.total;
                  const progress = total > 0 ? (evaluator.checked / total) * 100 : 100;
                  
                  return (
                    <tr key={evaluator.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{evaluator.name}</div>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{evaluator.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-blue-600">{evaluator.total}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{evaluator.checked}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{evaluator.remaining}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{progress.toFixed(0)}% complete</div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-4 py-12 sm:p-6 text-center">
          <div className="rounded-md bg-gray-50 p-4">
            <div className="flex justify-center">
              <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="mt-3 text-sm text-gray-700">
              <p>No evaluators found</p>
            </div>
            <div className="mt-4">
              <button type="button" onClick={() => fetchEvaluatorsStatus()} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Refresh data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default EvaluatorStatus;