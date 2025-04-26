import { useState, useEffect } from "react";
import { Pagination, TextField, InputAdornment } from "@mui/material";
import { Search, SortByAlpha, ArrowForwardIos } from "@mui/icons-material";
import SubjectSelection from "./SubjectSelection";

// Mock data for exams and subjects
const exams = [
  { examName: "BCA 2nd Sem", examId: "EXAM101" },
  { examName: "BCA 4th Sem", examId: "EXAM102" },
  { examName: "MCA 1st Sem", examId: "EXAM103" },
];

const subjectsByExam = {
  EXAM101: [
    { subject: "Mathematics", subjectId: "SUB101" },
    { subject: "Physics", subjectId: "SUB102" },
  ],
  EXAM102: [
    { subject: "Chemistry", subjectId: "SUB103" },
    { subject: "Biology", subjectId: "SUB104" },
  ],
  EXAM103: [
    { subject: "Computer Science", subjectId: "SUB105" },
    { subject: "Data Structures", subjectId: "SUB106" },
  ],
};

const generateDummyCopies = (subjectId) =>
  Array.from({ length: 120 }, (_, i) => `${subjectId}-Copy-${String(i + 1).padStart(3, "0")}`);

const dummyCopies = {
  SUB101: generateDummyCopies("SUB101"),
  SUB102: generateDummyCopies("SUB102"),
  SUB103: generateDummyCopies("SUB103"),
  SUB104: generateDummyCopies("SUB104"),
  SUB105: generateDummyCopies("SUB105"),
  SUB106: generateDummyCopies("SUB106"),
};

export default function Evaluation() {
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCopies, setFilteredCopies] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const [subjects, setSubjects] = useState([]);

  // Update subjects when an exam is selected
  useEffect(() => {
    if (selectedExam) {
      setSubjects(subjectsByExam[selectedExam] || []);
      setSelectedSubject(""); // Reset subject when exam changes
    }
  }, [selectedExam]);

  // Filter and sort copies whenever subject, search term, or sort order changes
  useEffect(() => {
    if (selectedSubject) {
      let copies = dummyCopies[selectedSubject];

      if (searchTerm) {
        copies = copies.filter((copy) =>
          copy.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (sortOrder === "asc") {
        copies.sort((a, b) => a.localeCompare(b));
      } else {
        copies.sort((a, b) => b.localeCompare(a));
      }

      setFilteredCopies(copies);
      setPage(1); // Reset to the first page
    }
  }, [selectedSubject, searchTerm, sortOrder]);

  const handleEvaluate = (copyId) => {
    console.log(`Navigating to evaluate copy: ${copyId}`);
  };

  const currentCopies = filteredCopies.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Exam and Subject Selection */}
      <div className="flex gap-4 mb-4">
        {/* Exam Name Dropdown */}
        <div className="flex-1">
          <label htmlFor="examName" className="block text-sm font-medium text-gray-700">
            Exam Name
          </label>
          <select
            id="examName"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Exam</option>
            {exams.map((exam) => (
              <option key={exam.examId} value={exam.examId}>
                {exam.examName}
              </option>
            ))}
          </select>
        </div>
        
        {/* Subject to Evaluate Dropdown */}
        <div className="flex-1">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject to Evaluate
          </label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            disabled={!selectedExam} // Disable if no exam is selected
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSubject && (
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-200 sm:px-6">
            <div className="flex flex-wrap items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Copies for{" "}
                {subjects.find((s) => s.subjectId === selectedSubject)?.subject}
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {filteredCopies.length} copies
                </span>
              </h2>
              <div className="flex gap-2 mt-3 sm:mt-0">
                <TextField
                  placeholder="Search copies..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: "200px" }}
                />
                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <SortByAlpha fontSize="small" className="mr-1" />
                  {sortOrder === "asc" ? "A → Z" : "Z → A"}
                </button>
              </div>
            </div>
          </div>

          {/* Copies List */}
          {filteredCopies.length > 0 ? (
            <div className="p-4">
              <div className="max-h-[45vh] overflow-y-auto pr-2">
                {currentCopies.map((copyId) => (
                  <div
                    key={copyId}
                    className="flex justify-between items-center px-3 py-2 mb-1 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <svg
                          className="w-3 h-3 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="font-medium text-gray-900">{copyId}</div>
                      <div className="ml-3 text-xs">
                        {Math.random() > 0.3 ? (
                          <span className="text-green-600">Evaluated</span>
                        ) : (
                          <span className="text-yellow-600">Pending</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEvaluate(copyId)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-xs w-24 justify-center"
                    >
                      {Math.random() > 0.3 ? "View" : "Evaluate"}
                      <ArrowForwardIos
                        fontSize="small"
                        className="ml-1"
                        style={{ fontSize: "10px" }}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-4 flex justify-center">
                <Pagination
                  count={Math.ceil(filteredCopies.length / itemsPerPage)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No copies found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}