import React, { useState, useEffect } from 'react';

const EvaluatorStatus = () => {
  const [evaluators, setEvaluators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch evaluators data from API
    fetch('/api/evaluators') // Replace with your API endpoint
      .then((res) => res.json())
      .then((data) => {
        setEvaluators(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching evaluators:', error);
        setLoading(false);
        // For demo purposes, add some sample data
        setEvaluators([
          { id: 1, name: 'John Doe', checkedCopies: 45, remainingCopies: 15, subject: 'Mathematics' },
          { id: 2, name: 'Jane Smith', checkedCopies: 32, remainingCopies: 28, subject: 'Physics' },
          { id: 3, name: 'Mike Johnson', checkedCopies: 56, remainingCopies: 0, subject: 'Chemistry' }
        ]);
      });
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
                    Evaluator Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Checked Copies
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining Copies
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {evaluators.map((evaluator) => {
                  const total = evaluator.checkedCopies + evaluator.remainingCopies;
                  const progress = total > 0 ? (evaluator.checkedCopies / total) * 100 : 100;
                  
                  return (
                    <tr key={evaluator.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{evaluator.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{evaluator.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{evaluator.checkedCopies}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{evaluator.remainingCopies}</div>
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