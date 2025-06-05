
//?new version ui

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../../../api/axios";
import QuestionStructure from "./components/QuestionStructure";
import { QuestionPaperPreview } from "./components/QuestionPaperPreview";
import ListAltIcon from "@mui/icons-material/ListAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FilterListIcon from "@mui/icons-material/FilterList";

const EditFragmentation = () => {
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [questionGroups, setQuestionGroups] = useState([]);
  const [formData, setFormData] = useState({
    maxMarks: 100,
  });
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [showStructureViewer, setShowStructureViewer] = useState(false);

  // Fetch all available courses
  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/exams/");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch courses first
        await fetchCourses();
        
        // Get papers that already have fragmentation
        const response = await api.get("/api/admin/papers?fragmented=true");
        setPapers(response.data);
        setFilteredPapers(response.data); // Initialize filtered papers with all papers
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle course filter change
  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);

    if (!courseId) {
      // If no course is selected, show all papers
      setFilteredPapers(papers);
    } else {
      // Filter papers by the selected course
      const filtered = papers.filter((paper) => paper.courseId === courseId);
      setFilteredPapers(filtered);
    }

    // Clear any selected paper when changing courses
    setSelectedPaperId(null);
    setSelectedPaper(null);
    setQuestionGroups([]);
  };

  // Load paper details and questions
  const handleSelectPaper = async (paperId) => {
    try {
      setLoading(true);
      setSelectedPaperId(paperId);

      // Fetch paper with its questions
      const response = await api.get(`/api/admin/papers/${paperId}/questions`);
      const paper = response.data;
      setSelectedPaper(paper);

      // Check if paper has questions before trying to convert
      if (paper.questions && paper.questions.length > 0) {
        const questionData = convertQuestionsToGroups(paper.questions);
        setQuestionGroups(questionData);
      } else {
        // Set an empty default if no questions
        setQuestionGroups([
          {
            id: Date.now(),
            questionNumber: "1",
            maxMarks: 10,
            subquestions: [],
          },
        ]);
        toast.warning(
          "No questions found for this paper. Creating default question structure."
        );
      }

      // Set form data
      setFormData({
        maxMarks: paper.maxMarks,
      });

      toast.success(`Loaded paper: ${paper.paperCode}`);
    } catch (error) {
      console.error("Error loading paper details:", error);
      toast.error(
        "Failed to load paper details: " +
          (error.response?.data?.message || error.message)
      );
      setSelectedPaperId(null);
    } finally {
      setLoading(false);
    }
  };

  // Convert DB questions to question groups format
  const convertQuestionsToGroups = (questions) => {
    // Group questions by their main number
    const questionsByMainNumber = {};

    questions.forEach((q) => {
      // Extract main question number and any suffix (a, b, c, etc.)
      const match = q.questionNumber.match(/^(\d+)([a-z]*)$/);
      if (!match) return;

      const mainNum = match[1];
      const suffix = match[2] || "";

      if (!questionsByMainNumber[mainNum]) {
        questionsByMainNumber[mainNum] = {
          mainQuestion: null,
          subQuestions: [],
        };
      }

      // If no suffix, it's a main question without parts
      if (!suffix) {
        questionsByMainNumber[mainNum].mainQuestion = {
          id: Date.now() + Math.random(),
          questionNumber: mainNum,
          maxMarks: q.maxMarks,
        };
      } else {
        // If has suffix, it's a subquestion
        questionsByMainNumber[mainNum].subQuestions.push({
          id: Date.now() + Math.random(),
          questionNumber: q.questionNumber,
          maxMarks: q.maxMarks,
        });
      }
    });

    // Convert to question groups array
    const groups = [];

    Object.keys(questionsByMainNumber)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .forEach((mainNum) => {
        const group = questionsByMainNumber[mainNum];

        if (group.subQuestions.length === 0 && group.mainQuestion) {
          // Simple question without parts
          groups.push({
            id: Date.now() + parseInt(mainNum),
            questionNumber: mainNum,
            maxMarks: group.mainQuestion.maxMarks,
            subquestions: [],
          });
        } else if (group.subQuestions.length > 0) {
          // Question with parts
          groups.push({
            id: Date.now() + parseInt(mainNum),
            questionNumber: mainNum,
            maxMarks: undefined,
            subquestions: group.subQuestions,
          });
        }
      });

    return groups;
  };

  // Calculate total marks
  const calculateTotalMarks = () => {
    return questionGroups.reduce((total, group) => {
      if (group.subquestions.length === 0) {
        // If no subquestions, use the group's marks
        return total + (parseFloat(group.maxMarks) || 0);
      } else {
        // Sum marks of all subquestions
        const subquestionsTotal = group.subquestions.reduce(
          (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
          0
        );
        return total + subquestionsTotal;
      }
    }, 0);
  };

  // Flatten all questions for submission
  const getAllQuestions = () => {
    const allQuestions = [];

    questionGroups.forEach((group) => {
      if (group.subquestions.length === 0) {
        // Main question with no subquestions
        allQuestions.push({
          questionNumber: group.questionNumber,
          maxMarks: parseFloat(group.maxMarks) || 0,
        });
      } else {
        // Add all subquestions
        group.subquestions.forEach((sq) => {
          allQuestions.push({
            questionNumber: sq.questionNumber,
            maxMarks: parseFloat(sq.maxMarks) || 0,
          });
        });
      }
    });

    return allQuestions;
  };

  // Validate question structure before submission
  const validateQuestionStructure = () => {
    // Check if we have Question 1
    const hasQuestion1 = questionGroups.some(
      (group) =>
        group.questionNumber === "1" || group.questionNumber.startsWith("1")
    );

    if (!hasQuestion1) {
      toast.error("Question paper must start with Question 1");
      return false;
    }

    // Extract all main question numbers and check for sequence
    const mainNumbers = [
      ...new Set(
        questionGroups.map((group) => {
          const match = group.questionNumber.match(/^(\d+)/);
          return match ? parseInt(match[1]) : null;
        })
      ),
    ]
      .filter(Boolean)
      .sort((a, b) => a - b);

    // Check for sequential numbering (no gaps)
    for (let i = 0; i < mainNumbers.length; i++) {
      if (mainNumbers[i] !== i + 1) {
        toast.error(`Question numbering must be sequential. Missing Q${i + 1}`);
        return false;
      }
    }

    return true;
  };

  // Handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate question structure
    if (!validateQuestionStructure()) {
      return;
    }

    // Show preview before submitting
    setShowPreview(true);
  };

  // Handle final submission after preview
  const handleFinalSubmit = async () => {
    const totalMarks = calculateTotalMarks();
    const maxMarks = parseFloat(formData.maxMarks);

    if (totalMarks !== maxMarks) {
      toast.error(
        `Total question marks (${totalMarks}) don't match paper max marks (${maxMarks})`
      );
      return;
    }

    try {
      setLoading(true);

      // Submit updated fragmentation data
      const fragmentationData = {
        paperId: selectedPaperId,
        questions: getAllQuestions(),
      };

      await api.put(
        `/api/admin/papers/${selectedPaperId}/fragmentation`,
        fragmentationData
      );

      // Close preview first to prevent UI glitches
      setShowPreview(false);

      toast.success("Fragmentation updated successfully");

      // Refresh papers list
      const response = await api.get("/api/admin/papers?fragmented=true");
      const updatedPapers = response.data;
      setPapers(updatedPapers);
      
      // Update filtered papers based on course selection
      if (selectedCourse) {
        setFilteredPapers(updatedPapers.filter(p => p.courseId === selectedCourse));
      } else {
        setFilteredPapers(updatedPapers);
      }

      // Reset form state after successful update and data refresh
      setSelectedPaperId(null);
      setSelectedPaper(null);
      setQuestionGroups([]);
    } catch (error) {
      console.error("Error updating fragmentation:", error);
      toast.error(
        "Failed to update fragmentation: " +
          (error.response?.data?.message || error.message)
      );
      setShowPreview(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle paper deletion
  const handleDeletePaper = async (paperId, event) => {
    event.stopPropagation();

    if (
      !confirm(
        "Are you sure you want to delete this fragmentation? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/api/admin/papers/${paperId}/fragmentation`);

      toast.success("Fragmentation deleted successfully");

      // Update papers list
      const updatedPapers = papers.filter((paper) => paper.paperId !== paperId);
      setPapers(updatedPapers);
      
      // Update filtered papers based on course selection
      if (selectedCourse) {
        setFilteredPapers(updatedPapers.filter(p => p.courseId === selectedCourse));
      } else {
        setFilteredPapers(updatedPapers);
      }

      // If the deleted paper was selected, reset selection
      if (selectedPaperId === paperId) {
        setSelectedPaperId(null);
        setSelectedPaper(null);
        setQuestionGroups([]);
      }
    } catch (error) {
      console.error("Error deleting fragmentation:", error);
      toast.error("Failed to delete fragmentation");
    } finally {
      setLoading(false);
    }
  };

  // PDF viewer component
  const PdfViewer = ({ paperId, onClose }) => {
    if (!paperId) return null;

    return (
      <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 h-[95vh] flex flex-col">
          <div className="flex items-center justify-between p-1 border-b">
            <h3 className="text-sm font-medium ml-4">Question Paper Preview</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 p-4">
            <iframe
              src={`${api.defaults.baseURL}/api/admin/papers/${paperId}/file`}
              className="w-full h-full border border-gray-300 rounded"
              title="Question Paper Preview"
            />
          </div>
        </div>
      </div>
    );
  };

  // View question details component
  const QuestionDetailsViewer = ({ paper, onClose }) => {
    if (!paper) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Question Structure Details</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-700">
                Paper Information
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Code: {paper.paperCode}
              </p>
              <p className="text-sm text-gray-600">Subject: {paper.subject}</p>
              <p className="text-sm text-gray-600">
                Course: {paper.courseName || "Unknown"}
              </p>
              <p className="text-sm text-gray-600">
                Max Marks: {paper.maxMarks}
              </p>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                Question Structure
              </h4>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paper.questions.map((question, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {question.questionNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {question.maxMarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-3">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Edit or Delete Fragmentation
        </h2>
        <p className="text-sm text-gray-600">
          Manage existing question paper fragmentations. Select a paper to view,
          edit, or delete its question structure.
        </p>
      </div>
      
      {/* Compact Papers List */}
      <div className="mb-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FilterListIcon className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-800">
              Available Papers ({filteredPapers.length})
            </h3>
          </div>
          
          {/* Compact Course Filter */}
          <select
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="text-sm border-gray-300 rounded-md px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Compact Papers List */}
        {loading && !selectedPaperId ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-gray-600">Loading papers...</p>
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="w-10 h-10 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {selectedCourse
                ? "No papers found for selected course"
                : "No fragmented papers available"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Create fragmentations first or select a different course
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPapers.map((paper) => (
              <div
                key={paper.paperId}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:shadow-sm ${
                  selectedPaperId === paper.paperId
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {/* Paper Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {paper.paperCode}
                      </h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-600 truncate">
                          {paper.subject}
                        </span>
                        <span className="text-xs text-gray-500">
                          {paper.courseName || "Unknown Course"}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                          {paper.maxMarks} marks
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => {
                      handleSelectPaper(paper.paperId);
                      setShowPdfPreview(false);
                    }}
                    className={`p-1.5 rounded-md transition-colors ${
                      selectedPaperId === paper.paperId
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                    title="Edit"
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPaper(paper.paperId);
                      setShowPdfPreview(true);
                    }}
                    className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                    title="View PDF"
                  >
                    <PictureAsPdfIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPaper(paper.paperId);
                      setShowStructureViewer(true);
                    }}
                    className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                    title="View Details"
                  >
                    <VisibilityIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={(e) => handleDeletePaper(paper.paperId, e)}
                    className="p-1.5 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    title="Delete"
                  >
                    <DeleteIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Edit Form */}
      {selectedPaperId && selectedPaper && !showPdfPreview && !showStructureViewer && (
        <div className="border-t pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-blue-800">
                  Editing: {selectedPaper.paperCode}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Make changes to the question structure below
                </p>
              </div>
              <div className="text-sm text-blue-800">
                <span className="font-medium">Max Marks:</span>{" "}
                {selectedPaper.maxMarks}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Structure Component */}
            <QuestionStructure
              questionGroups={questionGroups}
              setQuestionGroups={setQuestionGroups}
              maxMarks={formData.maxMarks}
            />

            <div className="flex justify-end gap-3 pt-5 border-t">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={() => {
                  setSelectedPaperId(null);
                  setSelectedPaper(null);
                  setQuestionGroups([]);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
                  loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <ListAltIcon className="h-4 w-4 mr-2" />
                    Preview & Update
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Preview Modal */}
      <QuestionPaperPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleFinalSubmit}
        formData={formData}
        selectedPaper={selectedPaper}
        questionGroups={questionGroups}
        file={null}
        loading={loading}
        isEditing={true}
        confirmTxt="Update Fragmentation"
      />
      
      {/* PDF Preview */}
      {showPdfPreview && selectedPaper && (
        <PdfViewer
          paperId={selectedPaperId}
          onClose={() => setShowPdfPreview(false)}
        />
      )}
      
      {/* Question Structure Viewer */}
      {showStructureViewer && selectedPaper && (
        <QuestionDetailsViewer
          paper={selectedPaper}
          onClose={() => setShowStructureViewer(false)}
        />
      )}
    </div>
  );
};

export default EditFragmentation;








// import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import api from "../../../../api/axios";
// import QuestionStructure from "./components/QuestionStructure";
// import { QuestionPaperPreview } from "./components/QuestionPaperPreview";
// import ListAltIcon from "@mui/icons-material/ListAlt";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// const EditFragmentation = () => {
//   const [loading, setLoading] = useState(false);
//   const [papers, setPapers] = useState([]);
//   const [selectedPaper, setSelectedPaper] = useState(null);
//   const [selectedPaperId, setSelectedPaperId] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showPdfPreview, setShowPdfPreview] = useState(false);
//   const [questionGroups, setQuestionGroups] = useState([]);
//   const [formData, setFormData] = useState({
//     maxMarks: 100,
//   });
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [filteredPapers, setFilteredPapers] = useState([]);
//   const [showStructureViewer, setShowStructureViewer] = useState(false);

//   // Fetch all available courses
//   const fetchCourses = async () => {
//     try {
//       const response = await api.get("/api/exams/");
//       setCourses(response.data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       toast.error("Failed to load courses");
//     }
//   };

//   // Fetch all data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch courses first
//         await fetchCourses();
        
//         // Get papers that already have fragmentation
//         const response = await api.get("/api/admin/papers?fragmented=true");
//         setPapers(response.data);
//         setFilteredPapers(response.data); // Initialize filtered papers with all papers
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle course filter change
//   const handleCourseChange = (courseId) => {
//     setSelectedCourse(courseId);

//     if (!courseId) {
//       // If no course is selected, show all papers
//       setFilteredPapers(papers);
//     } else {
//       // Filter papers by the selected course
//       const filtered = papers.filter((paper) => paper.courseId === courseId);
//       setFilteredPapers(filtered);
//     }

//     // Clear any selected paper when changing courses
//     setSelectedPaperId(null);
//     setSelectedPaper(null);
//     setQuestionGroups([]);
//   };

//   // Load paper details and questions
//   const handleSelectPaper = async (paperId) => {
//     try {
//       setLoading(true);
//       setSelectedPaperId(paperId);

//       // Fetch paper with its questions
//       const response = await api.get(`/api/admin/papers/${paperId}/questions`);
//       const paper = response.data;
//       setSelectedPaper(paper);

//       // Check if paper has questions before trying to convert
//       if (paper.questions && paper.questions.length > 0) {
//         const questionData = convertQuestionsToGroups(paper.questions);
//         setQuestionGroups(questionData);
//       } else {
//         // Set an empty default if no questions
//         setQuestionGroups([
//           {
//             id: Date.now(),
//             questionNumber: "1",
//             maxMarks: 10,
//             subquestions: [],
//           },
//         ]);
//         toast.warning(
//           "No questions found for this paper. Creating default question structure."
//         );
//       }

//       // Set form data
//       setFormData({
//         maxMarks: paper.maxMarks,
//       });

//       toast.success(`Loaded paper: ${paper.paperCode}`);
//     } catch (error) {
//       console.error("Error loading paper details:", error);
//       toast.error(
//         "Failed to load paper details: " +
//           (error.response?.data?.message || error.message)
//       );
//       setSelectedPaperId(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Convert DB questions to question groups format
//   const convertQuestionsToGroups = (questions) => {
//     // Group questions by their main number
//     const questionsByMainNumber = {};

//     questions.forEach((q) => {
//       // Extract main question number and any suffix (a, b, c, etc.)
//       const match = q.questionNumber.match(/^(\d+)([a-z]*)$/);
//       if (!match) return;

//       const mainNum = match[1];
//       const suffix = match[2] || "";

//       if (!questionsByMainNumber[mainNum]) {
//         questionsByMainNumber[mainNum] = {
//           mainQuestion: null,
//           subQuestions: [],
//         };
//       }

//       // If no suffix, it's a main question without parts
//       if (!suffix) {
//         questionsByMainNumber[mainNum].mainQuestion = {
//           id: Date.now() + Math.random(),
//           questionNumber: mainNum,
//           maxMarks: q.maxMarks,
//         };
//       } else {
//         // If has suffix, it's a subquestion
//         questionsByMainNumber[mainNum].subQuestions.push({
//           id: Date.now() + Math.random(),
//           questionNumber: q.questionNumber,
//           maxMarks: q.maxMarks,
//         });
//       }
//     });

//     // Convert to question groups array
//     const groups = [];

//     Object.keys(questionsByMainNumber)
//       .sort((a, b) => parseInt(a) - parseInt(b))
//       .forEach((mainNum) => {
//         const group = questionsByMainNumber[mainNum];

//         if (group.subQuestions.length === 0 && group.mainQuestion) {
//           // Simple question without parts
//           groups.push({
//             id: Date.now() + parseInt(mainNum),
//             questionNumber: mainNum,
//             maxMarks: group.mainQuestion.maxMarks,
//             subquestions: [],
//           });
//         } else if (group.subQuestions.length > 0) {
//           // Question with parts
//           groups.push({
//             id: Date.now() + parseInt(mainNum),
//             questionNumber: mainNum,
//             maxMarks: undefined,
//             subquestions: group.subQuestions,
//           });
//         }
//       });

//     return groups;
//   };

//   // Calculate total marks
//   const calculateTotalMarks = () => {
//     return questionGroups.reduce((total, group) => {
//       if (group.subquestions.length === 0) {
//         // If no subquestions, use the group's marks
//         return total + (parseFloat(group.maxMarks) || 0);
//       } else {
//         // Sum marks of all subquestions
//         const subquestionsTotal = group.subquestions.reduce(
//           (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
//           0
//         );
//         return total + subquestionsTotal;
//       }
//     }, 0);
//   };

//   // Flatten all questions for submission
//   const getAllQuestions = () => {
//     const allQuestions = [];

//     questionGroups.forEach((group) => {
//       if (group.subquestions.length === 0) {
//         // Main question with no subquestions
//         allQuestions.push({
//           questionNumber: group.questionNumber,
//           maxMarks: parseFloat(group.maxMarks) || 0,
//         });
//       } else {
//         // Add all subquestions
//         group.subquestions.forEach((sq) => {
//           allQuestions.push({
//             questionNumber: sq.questionNumber,
//             maxMarks: parseFloat(sq.maxMarks) || 0,
//           });
//         });
//       }
//     });

//     return allQuestions;
//   };

//   // Validate question structure before submission
//   const validateQuestionStructure = () => {
//     // Check if we have Question 1
//     const hasQuestion1 = questionGroups.some(
//       (group) =>
//         group.questionNumber === "1" || group.questionNumber.startsWith("1")
//     );

//     if (!hasQuestion1) {
//       toast.error("Question paper must start with Question 1");
//       return false;
//     }

//     // Extract all main question numbers and check for sequence
//     const mainNumbers = [
//       ...new Set(
//         questionGroups.map((group) => {
//           const match = group.questionNumber.match(/^(\d+)/);
//           return match ? parseInt(match[1]) : null;
//         })
//       ),
//     ]
//       .filter(Boolean)
//       .sort((a, b) => a - b);

//     // Check for sequential numbering (no gaps)
//     for (let i = 0; i < mainNumbers.length; i++) {
//       if (mainNumbers[i] !== i + 1) {
//         toast.error(`Question numbering must be sequential. Missing Q${i + 1}`);
//         return false;
//       }
//     }

//     return true;
//   };

//   // Handle form submission for editing
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate question structure
//     if (!validateQuestionStructure()) {
//       return;
//     }

//     // Show preview before submitting
//     setShowPreview(true);
//   };

//   // Handle final submission after preview
//   const handleFinalSubmit = async () => {
//     const totalMarks = calculateTotalMarks();
//     const maxMarks = parseFloat(formData.maxMarks);

//     if (totalMarks !== maxMarks) {
//       toast.error(
//         `Total question marks (${totalMarks}) don't match paper max marks (${maxMarks})`
//       );
//       return;
//     }

//     try {
//       setLoading(true);

//       // Submit updated fragmentation data
//       const fragmentationData = {
//         paperId: selectedPaperId,
//         questions: getAllQuestions(),
//       };

//       await api.put(
//         `/api/admin/papers/${selectedPaperId}/fragmentation`,
//         fragmentationData
//       );

//       // Close preview first to prevent UI glitches
//       setShowPreview(false);

//       toast.success("Fragmentation updated successfully");

//       // Refresh papers list
//       const response = await api.get("/api/admin/papers?fragmented=true");
//       const updatedPapers = response.data;
//       setPapers(updatedPapers);
      
//       // Update filtered papers based on course selection
//       if (selectedCourse) {
//         setFilteredPapers(updatedPapers.filter(p => p.courseId === selectedCourse));
//       } else {
//         setFilteredPapers(updatedPapers);
//       }

//       // Reset form state after successful update and data refresh
//       setSelectedPaperId(null);
//       setSelectedPaper(null);
//       setQuestionGroups([]);
//     } catch (error) {
//       console.error("Error updating fragmentation:", error);
//       toast.error(
//         "Failed to update fragmentation: " +
//           (error.response?.data?.message || error.message)
//       );
//       setShowPreview(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle paper deletion
//   const handleDeletePaper = async (paperId, event) => {
//     event.stopPropagation();

//     if (
//       !confirm(
//         "Are you sure you want to delete this fragmentation? This cannot be undone."
//       )
//     ) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await api.delete(`/api/admin/papers/${paperId}/fragmentation`);

//       toast.success("Fragmentation deleted successfully");

//       // Update papers list
//       const updatedPapers = papers.filter((paper) => paper.paperId !== paperId);
//       setPapers(updatedPapers);
      
//       // Update filtered papers based on course selection
//       if (selectedCourse) {
//         setFilteredPapers(updatedPapers.filter(p => p.courseId === selectedCourse));
//       } else {
//         setFilteredPapers(updatedPapers);
//       }

//       // If the deleted paper was selected, reset selection
//       if (selectedPaperId === paperId) {
//         setSelectedPaperId(null);
//         setSelectedPaper(null);
//         setQuestionGroups([]);
//       }
//     } catch (error) {
//       console.error("Error deleting fragmentation:", error);
//       toast.error("Failed to delete fragmentation");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // PDF viewer component
//   const PdfViewer = ({ paperId, onClose }) => {
//     if (!paperId) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg shadow-lg w-11/12 h-5/6 flex flex-col">
//           <div className="flex items-center justify-between p-4 border-b">
//             <h3 className="text-lg font-medium">Question Paper Preview</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//           <div className="flex-1 p-4">
//             <iframe
//               src={`${api.defaults.baseURL}/api/admin/papers/${paperId}/preview`}
//               className="w-full h-full border border-gray-300 rounded"
//               title="Question Paper Preview"
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // View question details component
//   const QuestionDetailsViewer = ({ paper, onClose }) => {
//     if (!paper) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] flex flex-col">
//           <div className="flex items-center justify-between p-4 border-b">
//             <h3 className="text-lg font-medium">Question Structure Details</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//           <div className="flex-1 p-6 overflow-y-auto">
//             <div className="mb-4">
//               <h4 className="text-md font-semibold text-gray-700">
//                 Paper Information
//               </h4>
//               <p className="text-sm text-gray-600 mt-1">
//                 Code: {paper.paperCode}
//               </p>
//               <p className="text-sm text-gray-600">Subject: {paper.subject}</p>
//               <p className="text-sm text-gray-600">
//                 Course: {paper.courseName || "Unknown"}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Max Marks: {paper.maxMarks}
//               </p>
//             </div>

//             <div className="mt-6">
//               <h4 className="text-md font-semibold text-gray-700 mb-3">
//                 Question Structure
//               </h4>
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Question Number
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Marks
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {paper.questions.map((question, index) => (
//                     <tr
//                       key={index}
//                       className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {question.questionNumber}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {question.maxMarks}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div className="border-t border-gray-200 px-4 py-3">
//             <button
//               onClick={onClose}
//               className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6">
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-2">
//           Edit or Delete Fragmentation
//         </h2>
//         <p className="text-sm text-gray-600">
//           Manage existing question paper fragmentations. Select a paper to view,
//           edit, or delete its question structure.
//         </p>
//       </div>
      
//       {/* Papers List with Course Filter */}
//       <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//         <div className="px-4 py-3 border-b border-gray-100">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//             <h3 className="text-sm font-semibold text-gray-800">
//               Available Papers with Fragmentation
//             </h3>

//             {/* Course Filter Dropdown */}
//             <div className="w-full sm:w-64">
//               <select
//                 value={selectedCourse}
//                 onChange={(e) => handleCourseChange(e.target.value)}
//                 className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-md px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//               >
//                 <option value="">All Courses/Exams</option>
//                 {courses.map((course) => (
//                   <option key={course.courseId} value={course.courseId}>
//                     {course.courseName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="p-4">
//           {loading && !selectedPaperId ? (
//             <div className="text-center py-10">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//               <p className="mt-2 text-sm text-gray-600">Loading papers...</p>
//             </div>
//           ) : filteredPapers.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
//                 <svg
//                   className="w-6 h-6 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={1.5}
//                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//               </div>
//               <p className="text-sm text-gray-600 font-medium">
//                 {selectedCourse
//                   ? "No papers available for the selected course"
//                   : "No papers with fragmentation available"}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 {selectedCourse
//                   ? "Try selecting a different course or create fragmentations first"
//                   : 'Create question fragmentations first in the "Create Fragmentation" tab'}
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredPapers.map((paper) => (
//                 <div
//                   key={paper.paperId}
//                   className={`relative border rounded-lg overflow-hidden transition-all ${
//                     selectedPaperId === paper.paperId
//                       ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50"
//                       : "border-gray-200 hover:border-blue-300 hover:shadow-md"
//                   }`}
//                 >
//                   <div className="p-4">
//                     <div className="font-medium text-gray-900 mb-1">
//                       {paper.paperCode}
//                     </div>
//                     <div className="text-sm text-gray-600">{paper.subject}</div>
//                     <div className="text-sm text-gray-600">
//                       Course: {paper.courseName || "Unknown"}
//                     </div>
//                     <div className="text-sm text-gray-600 mt-1">
//                       Max Marks: {paper.maxMarks}
//                     </div>

//                     <div className="mt-4 flex flex-wrap gap-2">
//                       <button
//                         onClick={() => {
//                           handleSelectPaper(paper.paperId);
//                           setShowPdfPreview(false);
//                         }}
//                         className={`inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                           selectedPaperId === paper.paperId ? "bg-gray-100" : ""
//                         }`}
//                       >
//                         <EditIcon className="h-3.5 w-3.5 mr-1" />
//                         Edit
//                       </button>

//                       <button
//                         onClick={(e) => handleDeletePaper(paper.paperId, e)}
//                         className="inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                       >
//                         <DeleteIcon className="h-3.5 w-3.5 mr-1" />
//                         Delete
//                       </button>

//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleSelectPaper(paper.paperId);
//                           setShowPdfPreview(true);
//                         }}
//                         className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <PictureAsPdfIcon className="h-3.5 w-3.5 mr-1" />
//                         PDF
//                       </button>
                      
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleSelectPaper(paper.paperId);
//                           setShowStructureViewer(true);
//                         }}
//                         className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <VisibilityIcon className="h-3.5 w-3.5 mr-1" />
//                         View
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Edit Form */}
//       {selectedPaperId && selectedPaper && !showPdfPreview && !showStructureViewer && (
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-md font-medium text-blue-800">
//                   Editing: {selectedPaper.paperCode}
//                 </h3>
//                 <p className="text-sm text-blue-700 mt-1">
//                   Make changes to the question structure below
//                 </p>
//               </div>
//               <div className="text-sm text-blue-800">
//                 <span className="font-medium">Max Marks:</span>{" "}
//                 {selectedPaper.maxMarks}
//               </div>
//             </div>
//           </div>

//           {/* Question Structure Component */}
//           <QuestionStructure
//             questionGroups={questionGroups}
//             setQuestionGroups={setQuestionGroups}
//             maxMarks={formData.maxMarks}
//           />

//           <div className="flex justify-end pt-5">
//             <button
//               type="button"
//               className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               onClick={() => {
//                 setSelectedPaperId(null);
//                 setSelectedPaper(null);
//                 setQuestionGroups([]);
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`ml-3 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
//                 loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
//               } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//             >
//               {loading ? (
//                 <>
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <ListAltIcon className="h-4 w-4 mr-1" />
//                   Preview & Update
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       )}
      
//       {/* Preview Modal */}
//       <QuestionPaperPreview
//         isOpen={showPreview}
//         onClose={() => setShowPreview(false)}
//         onConfirm={handleFinalSubmit}
//         formData={formData}
//         selectedPaper={selectedPaper}
//         questionGroups={questionGroups}
//         file={null}
//         loading={loading}
//         isEditing={true}
//       />
      
//       {/* PDF Preview */}
//       {showPdfPreview && selectedPaper && (
//         <PdfViewer
//           paperId={selectedPaperId}
//           onClose={() => setShowPdfPreview(false)}
//         />
//       )}
      
//       {/* Question Structure Viewer */}
//       {showStructureViewer && selectedPaper && (
//         <QuestionDetailsViewer
//           paper={selectedPaper}
//           onClose={() => setShowStructureViewer(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default EditFragmentation;   

















// import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import api from "../../../../api/axios";
// import QuestionStructure from "./components/QuestionStructure";
// import { QuestionPaperPreview } from "./components/QuestionPaperPreview";
// import ListAltIcon from "@mui/icons-material/ListAlt";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// const EditFragmentation = () => {
//   const [loading, setLoading] = useState(false);
//   const [papers, setPapers] = useState([]);
//   const [selectedPaper, setSelectedPaper] = useState(null);
//   const [selectedPaperId, setSelectedPaperId] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showPdfPreview, setShowPdfPreview] = useState(false);
//   const [questionGroups, setQuestionGroups] = useState([]);
//   const [formData, setFormData] = useState({
//     maxMarks: 100,
//   });

//   // Add these state variables at the top with your other states
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [filteredPapers, setFilteredPapers] = useState([]);

//   // Add this function to fetch all available courses
//   const fetchCourses = async () => {
//     try {
//       const response = await api.get("/api/exams/");
//       setCourses(response.data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       toast.error("Failed to load courses");
//     }
//   };

// // Replace both useEffects with this single one
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch courses first
//       await fetchCourses();
      
//       // Get papers that already have fragmentation
//       const response = await api.get("/api/admin/papers?fragmented=true");
//       setPapers(response.data);
//       setFilteredPapers(response.data); // Initialize filtered papers with all papers
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, []);

// // Delete the second useEffect that calls fetchPapers()

//   // Update the course change handler
//   const handleCourseChange = (courseId) => {
//     setSelectedCourse(courseId);

//     if (!courseId) {
//       // If no course is selected, show all papers
//       setFilteredPapers(papers);
//     } else {
//       // Filter papers by the selected course
//       // This compares the courseId (string) with the paper's courseId (also string)
//       const filtered = papers.filter((paper) => paper.courseId === courseId);
//       setFilteredPapers(filtered);
//     }

//     // Clear any selected paper when changing courses
//     setSelectedPaperId(null);
//     setSelectedPaper(null);
//     setQuestionGroups([]);
//   };



//   // Inside your handleSelectPaper function
//   const handleSelectPaper = async (paperId) => {
//     try {
//       setLoading(true);
//       setSelectedPaperId(paperId);

//       // Fetch paper with its questions
//       const response = await api.get(`/api/admin/papers/${paperId}/questions`);
//       const paper = response.data;
//       setSelectedPaper(paper);

//       // Check if paper has questions before trying to convert
//       if (paper.questions && paper.questions.length > 0) {
//         const questionData = convertQuestionsToGroups(paper.questions);
//         setQuestionGroups(questionData);
//       } else {
//         // Set an empty default if no questions
//         setQuestionGroups([
//           {
//             id: Date.now(),
//             questionNumber: "1",
//             maxMarks: 10,
//             subquestions: [],
//           },
//         ]);
//         toast.warning(
//           "No questions found for this paper. Creating default question structure."
//         );
//       }

//       // Set form data
//       setFormData({
//         maxMarks: paper.maxMarks,
//       });

//       toast.success(`Loaded paper: ${paper.paperCode}`);
//     } catch (error) {
//       console.error("Error loading paper details:", error);
//       toast.error(
//         "Failed to load paper details: " +
//           (error.response?.data?.message || error.message)
//       );
//       setSelectedPaperId(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Convert DB questions to question groups format
//   const convertQuestionsToGroups = (questions) => {
//     // Group questions by their main number
//     const questionsByMainNumber = {};

//     questions.forEach((q) => {
//       // Extract main question number and any suffix (a, b, c, etc.)
//       const match = q.questionNumber.match(/^(\d+)([a-z]*)$/);
//       if (!match) return;

//       const mainNum = match[1];
//       const suffix = match[2] || "";

//       if (!questionsByMainNumber[mainNum]) {
//         questionsByMainNumber[mainNum] = {
//           mainQuestion: null,
//           subQuestions: [],
//         };
//       }

//       // If no suffix, it's a main question without parts
//       if (!suffix) {
//         questionsByMainNumber[mainNum].mainQuestion = {
//           id: Date.now() + Math.random(),
//           questionNumber: mainNum,
//           maxMarks: q.maxMarks,
//         };
//       } else {
//         // If has suffix, it's a subquestion
//         questionsByMainNumber[mainNum].subQuestions.push({
//           id: Date.now() + Math.random(),
//           questionNumber: q.questionNumber,
//           maxMarks: q.maxMarks,
//         });
//       }
//     });

//     // Convert to question groups array
//     const groups = [];

//     Object.keys(questionsByMainNumber)
//       .sort((a, b) => parseInt(a) - parseInt(b))
//       .forEach((mainNum) => {
//         const group = questionsByMainNumber[mainNum];

//         if (group.subQuestions.length === 0 && group.mainQuestion) {
//           // Simple question without parts
//           groups.push({
//             id: Date.now() + parseInt(mainNum),
//             questionNumber: mainNum,
//             maxMarks: group.mainQuestion.maxMarks,
//             subquestions: [],
//           });
//         } else if (group.subQuestions.length > 0) {
//           // Question with parts
//           groups.push({
//             id: Date.now() + parseInt(mainNum),
//             questionNumber: mainNum,
//             maxMarks: undefined,
//             subquestions: group.subQuestions,
//           });
//         }
//       });

//     return groups;
//   };

//   // Calculate total marks
//   const calculateTotalMarks = () => {
//     return questionGroups.reduce((total, group) => {
//       if (group.subquestions.length === 0) {
//         // If no subquestions, use the group's marks
//         return total + (parseFloat(group.maxMarks) || 0);
//       } else {
//         // Sum marks of all subquestions
//         const subquestionsTotal = group.subquestions.reduce(
//           (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
//           0
//         );
//         return total + subquestionsTotal;
//       }
//     }, 0);
//   };

//   // Flatten all questions for submission
//   const getAllQuestions = () => {
//     const allQuestions = [];

//     questionGroups.forEach((group) => {
//       if (group.subquestions.length === 0) {
//         // Main question with no subquestions
//         allQuestions.push({
//           questionNumber: group.questionNumber,
//           maxMarks: parseFloat(group.maxMarks) || 0,
//         });
//       } else {
//         // Add all subquestions
//         group.subquestions.forEach((sq) => {
//           allQuestions.push({
//             questionNumber: sq.questionNumber,
//             maxMarks: parseFloat(sq.maxMarks) || 0,
//           });
//         });
//       }
//     });

//     return allQuestions;
//   };

//   // Validate question structure before submission
//   const validateQuestionStructure = () => {
//     // Check if we have Question 1
//     const hasQuestion1 = questionGroups.some(
//       (group) =>
//         group.questionNumber === "1" || group.questionNumber.startsWith("1")
//     );

//     if (!hasQuestion1) {
//       toast.error("Question paper must start with Question 1");
//       return false;
//     }

//     // Extract all main question numbers and check for sequence
//     const mainNumbers = [
//       ...new Set(
//         questionGroups.map((group) => {
//           const match = group.questionNumber.match(/^(\d+)/);
//           return match ? parseInt(match[1]) : null;
//         })
//       ),
//     ]
//       .filter(Boolean)
//       .sort((a, b) => a - b);

//     // Check for sequential numbering (no gaps)
//     for (let i = 0; i < mainNumbers.length; i++) {
//       if (mainNumbers[i] !== i + 1) {
//         toast.error(`Question numbering must be sequential. Missing Q${i + 1}`);
//         return false;
//       }
//     }

//     return true;
//   };

//   // Handle form submission for editing
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate question structure
//     if (!validateQuestionStructure()) {
//       return;
//     }

//     // Show preview before submitting
//     setShowPreview(true);
//   };

//   // Updated handleFinalSubmit function
//   const handleFinalSubmit = async () => {
//     const totalMarks = calculateTotalMarks();
//     const maxMarks = parseFloat(formData.maxMarks);

//     if (totalMarks !== maxMarks) {
//       toast.error(
//         `Total question marks (${totalMarks}) don't match paper max marks (${maxMarks})`
//       );
//       return;
//     }

//     try {
//       setLoading(true);

//       // Submit updated fragmentation data
//       const fragmentationData = {
//         paperId: selectedPaperId,
//         questions: getAllQuestions(),
//       };

//       await api.put(
//         `/api/admin/papers/${selectedPaperId}/fragmentation`,
//         fragmentationData
//       );

//       // Close preview first to prevent UI glitches
//       setShowPreview(false);

//       toast.success("Fragmentation updated successfully");

//       // Refresh papers list
//       const response = await api.get("/api/admin/papers?fragmented=true");
//       setPapers(response.data);

//       // Reset form state after successful update and data refresh
//       setSelectedPaperId(null);
//       setSelectedPaper(null);
//       setQuestionGroups([]);
//     } catch (error) {
//       console.error("Error updating fragmentation:", error);
//       toast.error(
//         "Failed to update fragmentation: " +
//           (error.response?.data?.message || error.message)
//       );
//       // Keep the preview open if there's an error
//       setShowPreview(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle paper deletion
//   const handleDeletePaper = async (paperId, event) => {
//     event.stopPropagation();

//     if (
//       !confirm(
//         "Are you sure you want to delete this fragmentation? This cannot be undone."
//       )
//     ) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await api.delete(`/api/admin/papers/${paperId}/fragmentation`);

//       toast.success("Fragmentation deleted successfully");

//       // Update papers list
//       setPapers(papers.filter((paper) => paper.paperId !== paperId));

//       // If the deleted paper was selected, reset selection
//       if (selectedPaperId === paperId) {
//         setSelectedPaperId(null);
//         setSelectedPaper(null);
//         setQuestionGroups([]);
//       }
//     } catch (error) {
//       console.error("Error deleting fragmentation:", error);
//       toast.error("Failed to delete fragmentation");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // PDF viewer component
//   const PdfViewer = ({ paperId, onClose }) => {
//     if (!paperId) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg shadow-lg w-11/12 h-5/6 flex flex-col">
//           <div className="flex items-center justify-between p-4 border-b">
//             <h3 className="text-lg font-medium">Question Paper Preview</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//           <div className="flex-1 p-4">
//             <iframe
//               src={`${api.defaults.baseURL}/api/admin/papers/${paperId}/preview`}
//               className="w-full h-full border border-gray-300 rounded"
//               title="Question Paper Preview"
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // View question details component
//   const QuestionDetailsViewer = ({ paper, onClose }) => {
//     if (!paper) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] flex flex-col">
//           <div className="flex items-center justify-between p-4 border-b">
//             <h3 className="text-lg font-medium">Question Structure Details</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//           <div className="flex-1 p-6 overflow-y-auto">
//             <div className="mb-4">
//               <h4 className="text-md font-semibold text-gray-700">
//                 Paper Information
//               </h4>
//               <p className="text-sm text-gray-600 mt-1">
//                 Code: {paper.paperCode}
//               </p>
//               <p className="text-sm text-gray-600">Subject: {paper.subject}</p>
//               <p className="text-sm text-gray-600">
//                 Max Marks: {paper.maxMarks}
//               </p>
//             </div>

//             <div className="mt-6">
//               <h4 className="text-md font-semibold text-gray-700 mb-3">
//                 Question Structure
//               </h4>
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Question Number
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Marks
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {paper.questions.map((question, index) => (
//                     <tr
//                       key={index}
//                       className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {question.questionNumber}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {question.maxMarks}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div className="border-t border-gray-200 px-4 py-3">
//             <button
//               onClick={onClose}
//               className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6">
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-2">
//           Edit or Delete Fragmentation
//         </h2>
//         <p className="text-sm text-gray-600">
//           Manage existing question paper fragmentations. Select a paper to view,
//           edit, or delete its question structure.
//         </p>
//       </div>
//       {/* Papers List with Course Filter */}
//       <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//         <div className="px-4 py-3 border-b border-gray-100">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//             <h3 className="text-sm font-semibold text-gray-800">
//               Available Papers with Fragmentation
//             </h3>

//             {/* Course Filter Dropdown */}
//             <div className="w-full sm:w-64">
//               <select
//                 value={selectedCourse}
//                 onChange={(e) => handleCourseChange(e.target.value)}
//                 className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-md px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//               >
//                 <option value="">All Courses/Exams</option>
//                 {courses.map((course) => (
//                   <option key={course.courseId} value={course.courseId}>
//                     {course.courseName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="p-4">
//           {loading && !selectedPaperId ? (
//             <div className="text-center py-10">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//               <p className="mt-2 text-sm text-gray-600">Loading papers...</p>
//             </div>
//           ) : filteredPapers.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
//                 <svg
//                   className="w-6 h-6 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={1.5}
//                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//               </div>
//               <p className="text-sm text-gray-600 font-medium">
//                 {selectedCourse
//                   ? "No papers available for the selected course"
//                   : "No papers with fragmentation available"}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 {selectedCourse
//                   ? "Try selecting a different course or create fragmentations first"
//                   : 'Create question fragmentations first in the "Create Fragmentation" tab'}
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredPapers.map((paper) => (
//                 <div
//                   key={paper.paperId}
//                   className={`relative border rounded-lg overflow-hidden transition-all ${
//                     selectedPaperId === paper.paperId
//                       ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50"
//                       : "border-gray-200 hover:border-blue-300 hover:shadow-md"
//                   }`}
//                 >
//                   <div className="p-4">
//                     <div className="font-medium text-gray-900 mb-1">
//                       {paper.paperCode}
//                     </div>
//                     <div className="text-sm text-gray-600">{paper.subject}</div>
//                     <div className="text-sm text-gray-600">
//                       Course: {paper.courseName || "Unknown"}
//                     </div>
//                     <div className="text-sm text-gray-600 mt-1">
//                       Max Marks: {paper.maxMarks}
//                     </div>

//                     <div className="mt-4 flex flex-wrap gap-2">
//                       <button
//                         onClick={() => {
//                           handleSelectPaper(paper.paperId);
//                           setShowPdfPreview(false);
//                         }}
//                         className={`inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                           selectedPaperId === paper.paperId ? "bg-gray-100" : ""
//                         }`}
//                       >
//                         <EditIcon className="h-3.5 w-3.5 mr-1" />
//                         Edit
//                       </button>

//                       <button
//                         onClick={(e) => handleDeletePaper(paper.paperId, e)}
//                         className="inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                       >
//                         <DeleteIcon className="h-3.5 w-3.5 mr-1" />
//                         Delete
//                       </button>

//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleSelectPaper(paper.paperId);
//                           setShowPdfPreview(true);
//                         }}
//                         className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <PictureAsPdfIcon className="h-3.5 w-3.5 mr-1" />
//                         PDF
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Edit Form */}
//       {selectedPaperId && selectedPaper && !showPdfPreview && (
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-md font-medium text-blue-800">
//                   Editing: {selectedPaper.paperCode}
//                 </h3>
//                 <p className="text-sm text-blue-700 mt-1">
//                   Make changes to the question structure below
//                 </p>
//               </div>
//               <div className="text-sm text-blue-800">
//                 <span className="font-medium">Max Marks:</span>{" "}
//                 {selectedPaper.maxMarks}
//               </div>
//             </div>
//           </div>

//           {/* Question Structure Component */}
//           <QuestionStructure
//             questionGroups={questionGroups}
//             setQuestionGroups={setQuestionGroups}
//             maxMarks={formData.maxMarks}
//           />

//           <div className="flex justify-end pt-5">
//             <button
//               type="button"
//               className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               onClick={() => {
//                 setSelectedPaperId(null);
//                 setSelectedPaper(null);
//                 setQuestionGroups([]);
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`ml-3 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
//                 loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
//               } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//             >
//               {loading ? (
//                 <>
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <ListAltIcon className="h-4 w-4 mr-1" />
//                   Preview & Update
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       )}
//       {/* Preview Modal */}
//       <QuestionPaperPreview
//         isOpen={showPreview}
//         onClose={() => setShowPreview(false)}
//         onConfirm={handleFinalSubmit}
//         formData={formData}
//         selectedPaper={selectedPaper}
//         questionGroups={questionGroups}
//         file={null}
//         loading={loading}
//         isEditing={true}
//       />
//       {/* PDF Preview */}
//       {showPdfPreview && (
//         <PdfViewer
//           paperId={selectedPaperId}
//           onClose={() => setShowPdfPreview(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default EditFragmentation;
