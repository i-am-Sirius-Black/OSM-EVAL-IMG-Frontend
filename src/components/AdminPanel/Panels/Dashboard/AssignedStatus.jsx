import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import toast from "react-hot-toast";
import formattedDateTime from "../../../../utils/formattedDateTime";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AssignedStatus = () => {
  const [subjectsAssigned, setSubjectsAssigned] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [uniqueSubjects, setUniqueSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjectsAssigned = async () => {
      try {
        const response = await api.get("/api/admin/subject-assignments");
        if (!response) {
          console.log("Error Fetching Subject-Assignments");
          return;
        }
        setSubjectsAssigned(response.data.assignments);
        setFilteredAssignments(response.data.assignments);

        // Extract unique subjects
        const subjects = [
          ...new Set(
            response.data.assignments.map((assign) => assign.subjectCode)
          ),
        ].map((code) => {
          const firstMatch = response.data.assignments.find(
            (a) => a.subjectCode === code
          );
          return {
            subjectCode: code,
            examName: firstMatch.examName,
          };
        });

        setUniqueSubjects(subjects);
        setLoading(false);
      } catch (error) {
        console.log("Error Fetching Data", error);
        setLoading(false);
      }
    };

    fetchSubjectsAssigned();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSubjectChange = (subjectCode) => {
    setSelectedSubject(subjectCode);
    setDropdownOpen(false);

    if (subjectCode === "") {
      setFilteredAssignments(subjectsAssigned);
    } else {
      const filtered = subjectsAssigned.filter(
        (assign) => assign.subjectCode === subjectCode
      );
      setFilteredAssignments(filtered);
    }
  };

  const handleUnAssign = async(evalId, subCode) => {
    try {
        const response = await api.post("/api/admin/unassign-subject", {
          evaluatorId: evalId,
          subjectCode: subCode
        });
        if (response.status === 200) {
          toast.success("Subject Un-Assigned Successfully");
        }
    } catch (error) {
      console.log("Error Un-Assigning Subject", error);
      toast.error("Error Un-Assigning Subject");   
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-1/2">
        <h1>Loading.....</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="flex items-center justify-between">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Assigned Subjects
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Overview of assigned subjects to evaluators
            </p>
          </div>
          <div className="flex items-center gap-4 px-4 pb-4">
            <div className="text-sm font-black text-gray-800">Subject:</div>
            <div className="relative subject-dropdown">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full md:w-56 px-4 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div className="flex items-center">
                  {selectedSubject || "All Subjects"}
                </div>
                <KeyboardArrowDownIcon
                  className={`ml-2 h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => handleSubjectChange("")}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedSubject === ""
                          ? "bg-gray-100 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-center">All Subjects</div>
                    </button>
                    {uniqueSubjects.map((subject) => (
                      <button
                        key={subject.subjectCode}
                        onClick={() => handleSubjectChange(subject.subjectCode)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          selectedSubject === subject.subjectCode
                            ? "bg-gray-100 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          {subject.subjectCode} - {subject.examName}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:p-6">
         <div className="max-h-[50vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr className="">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subject Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Evaluator
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Assigned Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Active Batch
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssignments.map((assign) => (
                  <tr key={assign.assignmentId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assign.examName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {assign.subjectCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assign.evaluatorName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formattedDateTime(assign.assignedAt, "date")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">True?False</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-xs px-4 py-1 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        onClick={() =>
                          handleUnAssign(assign.evaluatorId, assign.subjectCode)
                        }
                      >
                        Un-Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedStatus;
