// src/components/Home/DashboardSummary.jsx
export default function DashboardSummary() {
    const evaluationStatus = {
      pending: Math.floor(Math.random() * 50) + 30,
      completed: Math.floor(Math.random() * 50) + 70,
      total: 120,
    };
  
    return (
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Copies</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{evaluationStatus.total}</div>
                </dd>
              </div>
            </div>
          </div>
        </div>
  
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Evaluated</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{evaluationStatus.completed}</div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    {Math.round((evaluationStatus.completed / evaluationStatus.total) * 100)}%
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
  
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{evaluationStatus.pending}</div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  