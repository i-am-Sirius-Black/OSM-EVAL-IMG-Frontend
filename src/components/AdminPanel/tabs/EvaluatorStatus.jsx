import React, { useState, useEffect } from 'react';
import API_ROUTES from '../../../api/routes';
import api from '../../../api/axios.js'; 

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
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default EvaluatorStatus;