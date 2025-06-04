// import { useState, useEffect } from "react";
// import ListAltIcon from "@mui/icons-material/ListAlt";
// import api from "../../../../api/axios";
// import toast from "react-hot-toast";
// import QuestionStructure from "./components/QuestionStructure";
// import { QuestionPaperPreview } from "./components/QuestionPaperPreview";

// const QuestionFragmentation = () => {
//   const [loading, setLoading] = useState(false);
//   const [uploadedPapers, setUploadedPapers] = useState([]);
//   const [selectedPaperId, setSelectedPaperId] = useState(null);
//   const [selectedPaper, setSelectedPaper] = useState({});
//   const [showPreview, setShowPreview] = useState(false);

//   const [formData, setFormData] = useState({
//     maxMarks: 100,
//   });

//   // Fragmentation states
//   const [questionGroups, setQuestionGroups] = useState([
//     {
//       id: 1,
//       questionNumber: "1",
//       maxMarks: 10,
//       subquestions: [],
//     },
//   ]);

//   // Fetch all uploaded papers without fragmentation
//   useEffect(() => {
//     const fetchUploadedPapers = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get("/api/admin/papers?unfragmented=true");
//         setUploadedPapers(response.data);
//       } catch (error) {
//         console.error("Error fetching papers:", error);
//         toast.error("Failed to load papers");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUploadedPapers();
//   }, []);

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

//   const totalMarks = calculateTotalMarks();

//   // Handle selecting a paper for fragmentation
//   const handleSelectPaper = async (paperId) => {
//     const id = Number(paperId);
//     const paper = uploadedPapers.find((paper) => paper.paperId === id);

//     console.log("Selected paper:", paper);

//     setSelectedPaper(paper || {});

//     try {
//       setLoading(true);
//       setSelectedPaperId(paperId);

//       // Fetch paper details
//       const response = await api.get(`/api/admin/papers/${paperId}`);
//       const paper = response.data;

//       // Set max marks from the paper
//       setFormData((prev) => ({
//         ...prev,
//         maxMarks: paper.maxMarks,
//       }));

//       // Reset question groups
//       setQuestionGroups([
//         {
//           id: Date.now(),
//           questionNumber: "1",
//           maxMarks: 10,
//           subquestions: [],
//         },
//       ]);

//       toast.success(`Selected paper: ${paper.paperCode}`);
//     } catch (error) {
//       console.error("Error selecting paper:", error);
//       toast.error("Failed to load paper details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fragmentation form submission
//   const handleFragmentationSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedPaperId) {
//       toast.error("Please select a paper first");
//       return;
//     }

//     // Show preview instead of submitting directly
//     setShowPreview(true);
//   };

//   // Final submit from preview
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

//       // Submit the fragmentation data
//       const fragmentationData = {
//         paperId: selectedPaperId,
//         questions: getAllQuestions(),
//         fragmentation: true, // Set fragmentation flag to true
//       };

//       await api.post("/api/admin/create-fragmentation", fragmentationData);

//       toast.success("Question structure saved successfully");

//       // Reset fragmentation form
//       setSelectedPaperId(null);
//       setQuestionGroups([
//         {
//           id: Date.now(),
//           questionNumber: "1",
//           maxMarks: 10,
//           subquestions: [],
//         },
//       ]);

//       // Refresh the paper list
//       const response = await api.get("/api/admin/papers?unfragmented=true");
//       setUploadedPapers(response.data);

//       // Close preview
//       setShowPreview(false);
//     } catch (error) {
//       console.error("Error saving fragmentation:", error);
//       toast.error("Failed to save question structure");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Create Question Structure (Fragmentation)
//         </h2>
//         <span
//           className={`px-3 py-1 rounded-full text-sm font-medium ${
//             totalMarks === parseFloat(formData.maxMarks)
//               ? "bg-green-100 text-green-800"
//               : "bg-yellow-100 text-yellow-800"
//           }`}
//         >
//           Total: {totalMarks}/{formData.maxMarks} marks
//         </span>
//       </div>

//       {/* Paper Selection */}
//       <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
//         <h3 className="text-md font-medium text-gray-900 mb-4">
//           Select a Paper
//         </h3>

//         {uploadedPapers.length === 0 ? (
//           <div className="text-center py-6">
//             <p className="text-gray-500">
//               No papers available for fragmentation
//             </p>
//             <p className="text-sm text-gray-500 mt-2">
//               Please upload question papers first from the "Upload Paper" tab
//             </p>
//           </div>
//         ) : (
//           <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">

//             {uploadedPapers.length === 0 ? (
//               <div className="text-center py-6">
//                 <p className="text-gray-500">
//                   No papers available for fragmentation
//                 </p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Please upload question papers first from the "Upload Paper"
//                   tab
//                 </p>
//               </div>
//             ) : (
//               <div className="w-full max-w-md">
//                 <label
//                   htmlFor="paper-select"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Choose Paper
//                 </label>
//                 <select
//                   id="paper-select"
//                   value={selectedPaperId || ""}
//                   onChange={(e) => handleSelectPaper(e.target.value)}
//                   className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 >
//                   <option value="" disabled>
//                     Select a paper
//                   </option>
//                   {uploadedPapers.map((paper) => (
//                     <option key={paper.paperId} value={paper.paperId}>
//                       {paper.paperCode} — {paper.subject} ({paper.maxMarks}{" "}
//                       marks)
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>

//           //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           //     {uploadedPapers.map((paper) => (
//           //       <div
//           //         key={paper.paperId}
//           //         onClick={() => handleSelectPaper(paper.paperId)}
//           //         className={`cursor-pointer p-4 rounded-lg border ${
//           //           selectedPaperId === paper.paperId
//           //             ? "border-blue-500 bg-blue-50"
//           //             : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
//           //         } transition-colors`}
//           //       >
//           //         <div className="font-medium text-gray-900">{paper.paperCode}</div>
//           //         <div className="text-sm text-gray-500">{paper.subject}</div>
//           //         <div className="text-sm text-gray-500 mt-2">
//           //           Max Marks: {paper.maxMarks}
//           //         </div>
//           //       </div>
//           //     ))}
//           //   </div>
//         )}
//       </div>

//       {selectedPaperId && (
//         <form onSubmit={handleFragmentationSubmit} className="space-y-6">
//           {/* Question Structure Section */}
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
//                 setQuestionGroups([
//                   {
//                     id: Date.now(),
//                     questionNumber: "1",
//                     maxMarks: 10,
//                     subquestions: [],
//                   },
//                 ]);
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
//                   Preview & Save
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
//         file={null} // Not needed for fragmentation preview
//         loading={loading}
//       />
//     </div>
//   );
// };

// export default QuestionFragmentation;

//? Preventing Removing Question 1

import { useState, useEffect } from "react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import api from "../../../../api/axios";
import toast from "react-hot-toast";
import QuestionStructure from "./components/QuestionStructure";
import { QuestionPaperPreview } from "./components/QuestionPaperPreview";

const QuestionFragmentation = () => {
  const [loading, setLoading] = useState(false);
  const [uploadedPapers, setUploadedPapers] = useState([]);
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    maxMarks: 100,
  });

  // Fragmentation states
  const [questionGroups, setQuestionGroups] = useState([
    {
      id: 1,
      questionNumber: "1",
      maxMarks: 10,
      subquestions: [],
    },
  ]);

  // Fetch all uploaded papers without fragmentation
  useEffect(() => {
    const fetchUploadedPapers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/admin/papers?unfragmented=true");
        setUploadedPapers(response.data);
      } catch (error) {
        console.error("Error fetching papers:", error);
        toast.error("Failed to load papers");
      } finally {
        setLoading(false);
      }
    };

    fetchUploadedPapers();
  }, []);

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

  const totalMarks = calculateTotalMarks();

  // Handle selecting a paper for fragmentation
  const handleSelectPaper = async (paperId) => {
    const id = Number(paperId);
    const paper = uploadedPapers.find((paper) => paper.paperId === id);

    console.log("Selected paper:", paper);

    setSelectedPaper(paper || {});

    try {
      setLoading(true);
      setSelectedPaperId(paperId);

      // Fetch paper details
      const response = await api.get(`/api/admin/papers/${paperId}`);
      const paper = response.data;

      // Set max marks from the paper
      setFormData((prev) => ({
        ...prev,
        maxMarks: paper.maxMarks,
      }));

      // Reset question groups
      setQuestionGroups([
        {
          id: Date.now(),
          questionNumber: "1",
          maxMarks: 10,
          subquestions: [],
        },
      ]);

      toast.success(`Selected paper: ${paper.paperCode}`);
    } catch (error) {
      console.error("Error selecting paper:", error);
      toast.error("Failed to load paper details");
    } finally {
      setLoading(false);
    }
  };

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

  // Fragmentation form submission
  const handleFragmentationSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPaperId) {
      toast.error("Please select a paper first");
      return;
    }

    // Validate question structure
    if (!validateQuestionStructure()) {
      return;
    }

    // Show preview instead of submitting directly
    setShowPreview(true);
  };

  // Final submit from preview
  const handleFinalSubmit = async () => {
    const totalMarks = calculateTotalMarks();
    const maxMarks = parseFloat(formData.maxMarks);

    if (totalMarks !== maxMarks) {
      toast.error(
        `Total question marks (${totalMarks}) don't match paper max marks (${maxMarks})`
      );
      return;
    }

    // Validate question structure again before final submission
    if (!validateQuestionStructure()) {
      return;
    }

    try {
      setLoading(true);

      // Submit the fragmentation data
      const fragmentationData = {
        paperId: selectedPaperId,
        questions: getAllQuestions(),
        fragmentation: true, // Set fragmentation flag to true
      };

      await api.post("/api/admin/create-fragmentation", fragmentationData);

      toast.success("Question structure saved successfully");

      // Reset fragmentation form
      setSelectedPaperId(null);
      setQuestionGroups([
        {
          id: Date.now(),
          questionNumber: "1",
          maxMarks: 10,
          subquestions: [],
        },
      ]);

      // Refresh the paper list
      const response = await api.get("/api/admin/papers?unfragmented=true");
      setUploadedPapers(response.data);

      // Close preview
      setShowPreview(false);
    } catch (error) {
      console.error("Error saving fragmentation:", error);
      toast.error("Failed to save question structure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      {/* <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Paper Fragmentation
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            totalMarks === parseFloat(formData.maxMarks)
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          Total: {totalMarks}/{formData.maxMarks} marks
        </span>
      </div> */}

      {/* Paper Selection */}

      <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">
            Select Paper to Fragment
          </h3>
        </div>

        <div className="p-4">
          {uploadedPapers.length === 0 ? (
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
                No papers available
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Upload question papers first to begin fragmentation
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Available Papers ({uploadedPapers.length})
              </label>
              <div className="relative">
                <select
                  value={selectedPaperId || ""}
                  onChange={(e) => handleSelectPaper(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-gray-100"
                >
                  <option value="" disabled className="text-gray-500">
                    Choose a paper to fragment...
                  </option>
                  {uploadedPapers.map((paper) => (
                    <option
                      key={paper.paperId}
                      value={paper.paperId}
                      className="text-gray-900"
                    >
                      {paper.paperCode} • {paper.subject} • {paper.maxMarks}{" "}
                      marks
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedPaperId && (
        <form onSubmit={handleFragmentationSubmit} className="space-y-6">
          {/* Question Structure Section */}
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
                setQuestionGroups([
                  {
                    id: Date.now(),
                    questionNumber: "1",
                    maxMarks: 10,
                    subquestions: [],
                  },
                ]);
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
                  Preview & Save
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
        file={null} // Not needed for fragmentation preview
        loading={loading}
      />
    </div>
  );
};

export default QuestionFragmentation;
