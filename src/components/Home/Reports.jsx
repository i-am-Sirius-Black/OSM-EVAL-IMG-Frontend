import { useState, useEffect } from "react";
import { Assignment, CheckCircle, History } from "@mui/icons-material";

export default function Reports() {
  const [reportData, setReportData] = useState({
    totalAssigned: 0,
    totalChecked: 0,
    lastCheckedCopy: "N/A",
  });

  useEffect(() => {
    // Mock data for reports (replace this with real API call later)
    const fetchReportData = async () => {
      // Simulate an API call
      const mockData = {
        totalAssigned: 120,
        totalChecked: 85,
        lastCheckedCopy: "SUB101-Copy-085",
      };
      setReportData(mockData);
    };

    fetchReportData();
  }, []);

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Copy Checking Report</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Assigned Copies */}
        <div className="bg-white shadow rounded-lg p-6 flex items-center">
          <Assignment className="text-blue-500 mr-4" style={{ fontSize: "40px" }} />
          <div>
            <h2 className="text-lg font-medium text-gray-700">Total Assigned</h2>
            <p className="text-2xl font-bold text-gray-900">{reportData.totalAssigned}</p>
          </div>
        </div>

        {/* Total Checked Copies */}
        <div className="bg-white shadow rounded-lg p-6 flex items-center">
          <CheckCircle className="text-green-500 mr-4" style={{ fontSize: "40px" }} />
          <div>
            <h2 className="text-lg font-medium text-gray-700">Total Checked</h2>
            <p className="text-2xl font-bold text-gray-900">{reportData.totalChecked}</p>
          </div>
        </div>

        {/* Last Checked Copy */}
        <div className="bg-white shadow rounded-lg p-6 flex items-center">
          <History className="text-yellow-500 mr-4" style={{ fontSize: "40px" }} />
          <div>
            <h2 className="text-lg font-medium text-gray-700">Last Checked Copy</h2>
            <p className="text-xl font-bold text-gray-900">{reportData.lastCheckedCopy}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
