

import { useState, useEffect } from "react";
import { Assignment, CheckCircle, AccessTime, MenuBook, KeyboardArrowDown } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

export default function Evaluation({setActiveTab}) {
  const navigate = useNavigate();
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeBatch, setActiveBatch] = useState(null);
  const [copies, setCopies] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState({
    subjects: true,
    batch: false
  });
  const [error, setError] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  // First, fetch all assigned subjects with isCopyAssigned flag
  useEffect(() => {
    const fetchAssignedSubjects = async () => {
      try {
        setLoading(prev => ({ ...prev, subjects: true }));
        const response = await api.get("/api/evaluator/assigned-subjects");
        setAssignedSubjects(response.data.subjects);
        
        // Auto-select the first active subject
        const activeSubjects = response.data.subjects.filter(s => s.isCopyAssigned);
        if (activeSubjects.length > 0) {
          setSelectedSubject(activeSubjects[0].subjectCode);
        }
      } catch (err) {
        console.error("Error fetching assigned subjects:", err);
        setError("Failed to load your assigned subjects. Please refresh and try again.");
      } finally {
        setLoading(prev => ({ ...prev, subjects: false }));
      }
    };

    fetchAssignedSubjects();
  }, []);

  // When a subject is selected, fetch its active batch
  useEffect(() => {
    if (!selectedSubject) {
      setActiveBatch(null);
      setCopies([]);
      return;
    }

    const fetchActiveBatch = async () => {
      try {
        setLoading(prev => ({ ...prev, batch: true }));
        const response = await api.get(`/api/evaluator/current-batch/${selectedSubject}`);
        
        if (response.data.hasBatch) {
          setActiveBatch(response.data.batch);
          setCopies(response.data.batch.copies || []);
        } else {
          setActiveBatch(null);
          setCopies([]);
        }
      } catch (err) {
        console.error("Error fetching active batch:", err);
        setError("Failed to load copies for this subject. Please refresh and try again.");
        setActiveBatch(null);
        setCopies([]);
      } finally {
        setLoading(prev => ({ ...prev, batch: false }));
      }
    };

    fetchActiveBatch();
  }, [selectedSubject]);

  const handleSubjectChange = (subjectCode) => {
    setSelectedSubject(subjectCode);
    setDropdownOpen(false);
  };

  // const handleEvaluate = (copyBarcode) => {
  //   navigate(`/evaluate/${copyBarcode}`);
  // };


// Frontend: Navigate with state (secure)
const handleEvaluate = (copyBarcode) => {
  navigate("/evaluate", {
    state: { copyId: copyBarcode, subjectCode: selectedSubject }, // 🔒 Hidden from URL
  });
};

  // // Calculate stats for current batch
  // const completedCount = copies.filter(copy => copy.isChecked).length;
  // const pendingCount = copies.length - completedCount;
  // const progressPercent = copies.length > 0 ? Math.round((completedCount / copies.length) * 100) : 0;

  // Get active subjects (with copies assigned)
  const activeSubjects = assignedSubjects.filter(subject => subject.isCopyAssigned);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.subject-dropdown')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Evaluate Answer Scripts</h1>
            <p className="mt-1 text-sm text-gray-500">View and evaluate your assigned copies</p>
          </div>
          
          {/* Subject Dropdown Selector */}
          {activeSubjects.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-sm font-black text-gray-800">{activeSubjects.length} Active {activeSubjects.length > 1 ? "Subjects" : "Subject"}:</div>
              <div className="relative subject-dropdown">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between w-full md:w-56 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div className="flex items-center">
                  <MenuBook className="mr-2 h-5 w-5 text-gray-500" />
                  {selectedSubject || "Select Subject"}
                </div>
                <KeyboardArrowDown className={`ml-2 h-5 w-5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {activeSubjects.map((subject) => (
                      <button
                        key={subject.subjectCode}
                        onClick={() => handleSubjectChange(subject.subjectCode)}
                        className={`block w-full text-left px-4 py-2 text-sm ${selectedSubject === subject.subjectCode ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <MenuBook className="h-4 w-4 mr-2" />
                          {subject.subjectCode}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Show loading state for subjects */}
      {loading.subjects && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Active batch info */}

{!loading.subjects && activeBatch && (
  <div className="mb-6">
    <div className="bg-white px-5 py-4 rounded-lg shadow-sm border border-gray-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      
      {/* Left: Info Section */}
      <div className="flex-1 min-w-[280px]">
        <h2 className="text-xl font-semibold text-gray-900">
          {activeBatch.subjectCode} — {activeBatch.examName}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Assigned: <span className="font-medium text-gray-700">{new Date(activeBatch.assignedAt).toLocaleDateString()}</span>
          &nbsp; • &nbsp;
          Expires: <span className="font-medium text-gray-700">{new Date(activeBatch.expiresAt).toLocaleString()}</span>
        </p>
      </div>

      {/* Right: Summary Stats */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-800">
        <div className="flex items-center gap-2 min-w-[120px]" title="Total Copies">
          <Assignment className="text-blue-600 w-5 h-5" />
          <span className="font-medium">{activeBatch.totalCount} Copies</span>
        </div>

        <div className="flex items-center gap-2 min-w-[120px]" title="Checked Copies">
          <CheckCircle className="text-green-600 w-5 h-5" />
          <span className="font-medium">{activeBatch.checkedCount} Checked</span>
        </div>

        <div className="flex items-center gap-2 min-w-[120px]" title="Pending Copies">
          <AccessTime className="text-yellow-500 w-5 h-5" />
          <span className="font-medium">{activeBatch.pendingCount} Pending</span>
        </div>

        <div className="flex items-center gap-2 min-w-[140px]" title="Expires In">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">
            {`${Math.max(0, Math.floor((new Date(activeBatch.expiresAt) - new Date()) / (1000 * 60 * 60)))}h ` +
              `${Math.max(0, Math.floor(((new Date(activeBatch.expiresAt) - new Date()) % (1000 * 60 * 60)) / (1000 * 60)))}m`}
          </span>
        </div>
      </div>
    </div>
  </div>
)}

      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        {loading.batch ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <ErrorMessage error={error} />
        ) : !activeBatch && !loading.subjects ? (
          <NoBatchMessage activeSubjects={activeSubjects.length > 0} handleTabChange={handleTabChange} />
        ) : (

<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 pr-10 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
      </tr>
    </thead>
  </table>

  {/* Scrollable table body */}
  <div className="max-h-[40vh] overflow-y-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <tbody className="bg-white divide-y divide-gray-200">
        {copies.map((copy, idx) => (
          <tr key={idx} className={`${copy.isChecked ? "bg-green-50" : ""} hover:bg-gray-50`}>
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{"copy " + idx}</td>
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
              {copy.isChecked ? (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Checked
                </span>
              ) : (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              )}
            </td>
            <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => handleEvaluate(copy.copyId)}
                disabled={copy.isChecked}
                className={`inline-flex items-center px-3 py-1 border text-sm font-medium rounded-md ${
                  copy.isChecked
                    ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                {copy.isChecked ? "Evaluated" : "Evaluate"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        )}
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, color }) {
  const bgMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600"
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-md ${bgMap[color]}`}>{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ error }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto h-12 w-12 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="mt-2 text-lg font-medium text-gray-900">{error}</h3>
      <p className="mt-1 text-sm text-gray-500">Please try refreshing the page.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Refresh
      </button>
    </div>
  );
}

function NoBatchMessage({ activeSubjects, handleTabChange }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto h-12 w-12 text-gray-400">
        <Assignment className="h-12 w-12" />
      </div>
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        {activeSubjects ? "Select a subject from the dropdown" : "No copies assigned"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {activeSubjects 
          ? "Please select a subject from the dropdown above to view copies." 
          : "You haven't requested any copies for evaluation yet."}
      </p>
      {!activeSubjects && (
        <div className="mt-6">
          <a
            onClick={() => handleTabChange(1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
          >
            Go to Assign Copies
          </a>
        </div>

      )}
    </div>
  );
}

