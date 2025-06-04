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

  // Fetch all papers with fragmentation
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        // Get papers that already have fragmentation
        const response = await api.get("/api/admin/papers?fragmented=true");
        setPapers(response.data);
      } catch (error) {
        console.error("Error fetching papers:", error);
        toast.error("Failed to load papers");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Load paper details and questions
  const handleSelectPaper = async (paperId) => {
    try {
      setLoading(true);
      setSelectedPaperId(paperId);

      // Fetch paper with its questions
      const response = await api.get(`/api/admin/papers/${paperId}/questions`);
      const paper = response.data;
      setSelectedPaper(paper);

      // Convert questions to the format expected by QuestionStructure
      const questionData = convertQuestionsToGroups(paper.questions);
      setQuestionGroups(questionData);

      // Set form data
      setFormData({
        maxMarks: paper.maxMarks,
      });

      toast.success(`Loaded paper: ${paper.paperCode}`);
    } catch (error) {
      console.error("Error loading paper details:", error);
      toast.error("Failed to load paper details");
      setSelectedPaperId(null);
    } finally {
      setLoading(false);
    }
  };

  // Convert DB questions to question groups format
  const convertQuestionsToGroups = (questions) => {
    // Group questions by their main number
    const questionsByMainNumber = {};
    
    questions.forEach(q => {
      // Extract main question number and any suffix (a, b, c, etc.)
      const match = q.questionNumber.match(/^(\d+)([a-z]*)$/);
      if (!match) return;
      
      const mainNum = match[1];
      const suffix = match[2] || '';
      
      if (!questionsByMainNumber[mainNum]) {
        questionsByMainNumber[mainNum] = {
          mainQuestion: null,
          subQuestions: []
        };
      }
      
      // If no suffix, it's a main question without parts
      if (!suffix) {
        questionsByMainNumber[mainNum].mainQuestion = {
          id: Date.now() + Math.random(),
          questionNumber: mainNum,
          maxMarks: q.maxMarks
        };
      } else {
        // If has suffix, it's a subquestion
        questionsByMainNumber[mainNum].subQuestions.push({
          id: Date.now() + Math.random(),
          questionNumber: q.questionNumber,
          maxMarks: q.maxMarks
        });
      }
    });
    
    // Convert to question groups array
    const groups = [];
    
    Object.keys(questionsByMainNumber).sort((a, b) => parseInt(a) - parseInt(b)).forEach(mainNum => {
      const group = questionsByMainNumber[mainNum];
      
      if (group.subQuestions.length === 0 && group.mainQuestion) {
        // Simple question without parts
        groups.push({
          id: Date.now() + parseInt(mainNum),
          questionNumber: mainNum,
          maxMarks: group.mainQuestion.maxMarks,
          subquestions: []
        });
      } else if (group.subQuestions.length > 0) {
        // Question with parts
        groups.push({
          id: Date.now() + parseInt(mainNum),
          questionNumber: mainNum,
          maxMarks: undefined,
          subquestions: group.subQuestions
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

  // Final submit after preview
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

      await api.put(`/api/admin/papers/${selectedPaperId}/fragmentation`, fragmentationData);

      toast.success("Fragmentation updated successfully");

      // Reset form and refresh papers list
      setSelectedPaperId(null);
      setSelectedPaper(null);
      setQuestionGroups([]);
      
      // Refresh papers list
      const response = await api.get("/api/admin/papers?fragmented=true");
      setPapers(response.data);
      
      // Close preview
      setShowPreview(false);
    } catch (error) {
      console.error("Error updating fragmentation:", error);
      toast.error("Failed to update fragmentation");
    } finally {
      setLoading(false);
    }
  };

  // Handle paper deletion
  const handleDeletePaper = async (paperId, event) => {
    event.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this fragmentation? This cannot be undone.")) {
      return;
    }
    
    try {
      setLoading(true);
      await api.delete(`/api/admin/papers/${paperId}/fragmentation`);
      
      toast.success("Fragmentation deleted successfully");
      
      // Update papers list
      setPapers(papers.filter(paper => paper.paperId !== paperId));
      
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 h-5/6 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Question Paper Preview</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 p-4">
            <iframe
              src={`${api.defaults.baseURL}/api/admin/papers/${paperId}/preview`}
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
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-700">Paper Information</h4>
              <p className="text-sm text-gray-600 mt-1">Code: {paper.paperCode}</p>
              <p className="text-sm text-gray-600">Subject: {paper.subject}</p>
              <p className="text-sm text-gray-600">Max Marks: {paper.maxMarks}</p>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-700 mb-3">Question Structure</h4>
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
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
          Manage existing question paper fragmentations. Select a paper to view, edit, or delete its question structure.
        </p>
      </div>

      {/* Papers List */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">
            Available Papers with Fragmentation
          </h3>
        </div>

        <div className="p-4">
          {loading && !selectedPaperId ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-600">Loading papers...</p>
            </div>
          ) : papers.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
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
                No papers with fragmentation available
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Create question fragmentations first in the "Create Fragmentation" tab
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers.map((paper) => (
                <div 
                  key={paper.paperId}
                  className={`relative border rounded-lg overflow-hidden transition-all ${
                    selectedPaperId === paper.paperId 
                      ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="p-4">
                    <div className="font-medium text-gray-900 mb-1">
                      {paper.paperCode}
                    </div>
                    <div className="text-sm text-gray-600">
                      {paper.subject}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Max Marks: {paper.maxMarks}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          handleSelectPaper(paper.paperId);
                          setShowPdfPreview(false);
                        }}
                        className={`inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          selectedPaperId === paper.paperId ? "bg-gray-100" : ""
                        }`}
                      >
                        <EditIcon className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </button>
                      
                      <button
                        onClick={(e) => handleDeletePaper(paper.paperId, e)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <DeleteIcon className="h-3.5 w-3.5 mr-1" />
                        Delete
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPaper(paper.paperId);
                          setShowPdfPreview(true);
                        }}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PictureAsPdfIcon className="h-3.5 w-3.5 mr-1" />
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {selectedPaperId && selectedPaper && !showPdfPreview && (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <span className="font-medium">Max Marks:</span> {selectedPaper.maxMarks}
              </div>
            </div>
          </div>

          {/* Question Structure Component */}
          <QuestionStructure
            questionGroups={questionGroups}
            setQuestionGroups={setQuestionGroups}
            maxMarks={formData.maxMarks}
          />

          <div className="flex justify-end pt-5">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              className={`ml-3 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
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
                  <ListAltIcon className="h-4 w-4 mr-1" />
                  Preview & Update
                </>
              )}
            </button>
          </div>
        </form>
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
      />

      {/* PDF Preview */}
      {showPdfPreview && (
        <PdfViewer 
          paperId={selectedPaperId} 
          onClose={() => setShowPdfPreview(false)} 
        />
      )}
    </div>
  );
};

export default EditFragmentation;