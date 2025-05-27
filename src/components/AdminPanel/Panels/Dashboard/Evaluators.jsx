import React, { useState, useEffect } from "react";
import API_ROUTES from "../../../../api/routes";
import api from "../../../../api/axios.js";
import toast from "react-hot-toast";

const Evaluators = () => {
  const [evaluators, setEvaluators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluators();
  }, []);

  const fetchEvaluators = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/evaluators");
      setEvaluators(response.data);
      console.log("Fetched evaluators:", response.data);
    } catch (error) {
      console.error("Error fetching evaluators:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateDeactivate = async (uid, isActive) => {
    try {
      const endpoint = isActive
        ? "/api/admin/evaluators/deactivate"
        : "/api/admin/evaluators/activate";
      const response = await api.post(endpoint, { uid });
      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh the evaluators list
        fetchEvaluators();
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error(
        `Error ${evaluator.active ? "deactivating" : "activating"} evaluator:`,
        error
      );
      toast.error(
        `Failed to ${
          evaluator.active ? "deactivate" : "activate"
        } evaluator. Please try again.`
      );
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Evaluator Management
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View and manage all evaluators in the system
          </p>
        </div>
        <button
          onClick={fetchEvaluators}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : evaluators.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phone Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {evaluators.map((evaluator) => (
                <tr key={evaluator.uid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {evaluator.uid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {evaluator.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a
                      href={`mailto:${evaluator.email}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                    >
                      {evaluator.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a
                      href={`tel:${evaluator.phoneNumber}`}
                      className="text-gray-500 hover:text-gray-700 hover:underline transition-colors duration-200"
                    >
                      {evaluator.phoneNumber}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        evaluator.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {evaluator.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <button
                        className={`inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                          evaluator.active
                            ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500"
                            : "border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500"
                        }`}
                        onClick={() =>
                          handleActivateDeactivate(
                            evaluator.uid,
                            evaluator.active
                          )
                        }
                        disabled={loading}
                      >
                        {evaluator.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No evaluators found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new evaluator
          </p>
        </div>
      )}
    </div>
  );
};

export default Evaluators;
