//? with tabs (currently working on this)

// import { memo, useState } from "react";
// import QuestionInput from "./QuestionInput";
// import RejectModal from "./Modals/RejectModal";
// import SubmitConfirmationModal from "./Modals/SubmitConfirmationModal";
// import prepareAnnotationsForSave from "../../utils/FilterAnnotation";
// import { useNavigate } from "react-router-dom";
// import copyService from "../../services/copyService";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";

// const EvaluationPanel = memo(({ marks, setMarks, annotations, submitCopy, copyId }) => {
//   const [activeTab, setActiveTab] = useState("marking");
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);

//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const pdfUrl = "http://www.pdf995.com/samples/pdf.pdf"; // Example PDF URL, replace with actual data

//   console.log("Eval Panel rerendering");

//   // Questions structure with sub-parts
//   const questions = [
//     { id: "1A", maxMarks: 5, group: 1 },
//     { id: "1B", maxMarks: 5, group: 1 },
//     { id: "1C", maxMarks: 5, group: 1 },
//     { id: "1D", maxMarks: 5, group: 1 },
//     { id: "2A", maxMarks: 10, group: 2 },
//     { id: "2B", maxMarks: 10, group: 2 },
//     { id: "3A", maxMarks: 15, group: 3 },
//     { id: "3B", maxMarks: 15, group: 3 },
//     { id: "4", maxMarks: 30, group: 4 },
//   ];

//   // Calculate total marks
//   const totalMarks = Object.values(marks).reduce(
//     (sum, mark) => sum + (Number(mark) || 0),
//     0
//   );

//   // Group questions
//   const groups = questions.reduce((acc, q) => {
//     if (!acc[q.group]) acc[q.group] = [];
//     acc[q.group].push(q);
//     return acc;
//   }, {});

//   const validateEvaluation = () => {
//     // Check if all required marks are entered and valid
//     const marksValidation = questions.every(q => {
//       const mark = Number(marks[q.id]);
//       return !isNaN(mark) && mark >= 0 && mark <= q.maxMarks;
//     });

//     // Return validation result with specific issue if marks are invalid
//     if (!marksValidation) {
//       return {
//         valid: false,
//         issue: "marks",
//         message: "Please ensure all marks are entered correctly and within allowed range."
//       };
//     }

//     return { valid: true };
//   };

//   const validateAnnotations = () => {
//     // Check if all pages are annotated
//     const totalPages = 36; // Assuming there are 36 pages
//     const annotatedPages = Array.from(new Set(annotations.map(a => a.page)));
//     const allPagesAnnotated = annotatedPages.length === totalPages;

//     // You could add more specific annotation validations here if needed
//     // For example, check if certain types of annotations exist

//     // Return validation result with specific issue if annotations are invalid
//     if (!allPagesAnnotated) {
//       const missingPages = Array.from({ length: totalPages }, (_, i) => i + 1)
//         .filter(p => !annotatedPages.includes(p));

//       return {
//         valid: false,
//         issue: "annotations",
//         message: `Please review all pages. Missing annotations on pages: ${missingPages.join(', ')}`,
//         missingPages
//       };
//     }

//     return { valid: true };
//   };

//   const validateComplete = () => {
//     // First check marks
//     const marksValidationResult = validateEvaluation();
//     if (!marksValidationResult.valid) {
//       return marksValidationResult;
//     }

//     // Then check annotations
//     const annotationsValidationResult = validateAnnotations();
//     if (!annotationsValidationResult.valid) {
//       return annotationsValidationResult;
//     }

//     // If both passed, return overall valid result
//     return { valid: true };
//   };

//   const handleSubmitClick = () => {
//     // Use combined validation
//     // const validationResult = validateComplete();

//     // if (!validationResult.valid) {
//     //   // Show specific error based on what failed
//     //   alert(validationResult.message);

//     //   // Optionally switch to relevant tab if specific part failed
//     //   if (validationResult.issue === "annotations") {
//     //     setActiveTab("copy");
//     //   } else if (validationResult.issue === "marks") {
//     //     setActiveTab("marking");
//     //   }

//     //   return;
//     // }

//     // Show confirmation modal
//     setShowSubmitModal(true);
//   };

// //?v2 testing phase.....
// const handleFinalSubmit = async () => {

//   try {
//     const { annotations: regularAnnotations, drawAnnotations } =
//       prepareAnnotationsForSave(annotations);

//     const submissionData = {
//       copyId,
//       totalMarks,
//       userId: user.uid,
//       annotations: regularAnnotations,
//       drawAnnotations: drawAnnotations,
//     };

//     const success = await submitCopy(submissionData);
//     console.log("submit copy response success", success);

//     setShowSubmitModal(false);
//     if (success) {
//       navigate('/', { replace: true });
//     }

//   } catch (error) {
//     console.error('Error submitting evaluation:', error);
//   }
// };

// const handleReject = async ({ reason, description }) => {
//   try {
//     const { uid } = JSON.parse(localStorage.getItem("evalUserData"));

//     const rejectReason = description ? reason + ", " + description : reason;

//     const rejectionData = {
//       copyId: copyId,
//       reason: rejectReason,
//       userId: uid,
//       bagId: "testBagId",
//       copyStatus: "REJECTED"
//     };

//     console.log('Rejection Data:', rejectionData);

//     const response = await copyService.rejectCopy(rejectionData);
//     console.log('Rejection Response:', response);

//     // Access fields based on API response structure
//     if (response.success) {
//       setShowRejectModal(false);
//       toast.success('Copy rejected successfully.');

//       // Navigate away after successful rejection
//       navigate('/', { replace: true });
//     } else {
//       // Handle API success=false response
//       toast.error(response.message || 'Failed to reject copy');
//     }
//   } catch (error) {
//     console.error('Error rejecting copy:', error);
//     toast.error('Failed to reject copy. Please try again.');
//   }
// };

//   const handleOpenPDFWindow = () => {
//     const width = 800;
//     const height = 600;
//     const left = window.screenX + 100;
//     const top = window.screenY + 100;
//     window.open(
//       pdfUrl,
//       "QuestionPaperWindow", // <-- window name
//       `width=${width},height=${height},left=${left},top=${top},resizable=no,toolbar=no,menubar=no,location=no,status=no,scrollbars=yes`
//     );
//   };

//   // Calculate unchecked pages
//   const allPages = Array.from({ length: 36 }, (_, i) => i + 1);
//   const annotatedPages = Array.from(new Set(annotations.map((a) => a.page)));
//   const notAnnotatedPages = allPages.filter((p) => !annotatedPages.includes(p));

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "copy":
//         return (
//           <div className="p-4">
//             <div className="mb-2 text-sm text-gray-600">
//               Unchecked Pages ({notAnnotatedPages.length})
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {notAnnotatedPages.map((page) => (
//                 <span
//                   key={page}
//                   className="flex-shrink-0 w-8 h-8 flex items-center justify-center
//                     rounded-full bg-red-50 text-red-600 text-sm font-medium
//                     border border-red-100"
//                 >
//                   {page}
//                 </span>
//               ))}
//             </div>
//           </div>
//         );
//         case "paper":
//         return (
//           <div className="p-4">
//             <p className="text-gray-600 mb-2">This is the question paper content.</p>
//             <button
//             onClick={handleOpenPDFWindow}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             View Question Paper
//           </button>
//           </div>
//         );
//       case "answer":
//         return (
//           <div className="p-4">
//             <p className="text-gray-600">This is the answer paper content.</p>
//             {/* You can add a similar drawer for answer key if needed */}
//           </div>
//         );
//       default:
//         return (
//           <div className="px-4 py-2 space-y-4">
//         {Object.entries(groups).map(([groupNum, groupQuestions]) => (
//           <div
//             key={groupNum}
//             className="py-3 first:pt-2 last:pb-2 border-b last:border-0"
//           >
//             <div className="flex items-baseline mb-0">
//               <span className="text-sm font-medium text-gray-900">Q -</span>
//               <span className="ml-1 text-sm font-medium">{groupNum}</span>
//             </div>
//             <div className="grid grid-cols-2 gap-2 px-2">
//               {groupQuestions.map((q) => (
//                 <QuestionInput
//                   key={q.id}
//                   question={q}
//                   value={marks[q.id] || ''}
//                   onChange={(value) =>
//                     setMarks(prev => ({ ...prev, [q.id]: value }))
//                   }
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//         );
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-white">
//       {/* Header with total marks and tabs */}
//       <div className="sticky top-0 z-10 bg-white border-b">
//         <div className="px-4 pt-3 pb-2">
//           <div className="flex justify-between items-center mb-3">
//             <div className="text-md text-gray-500">Total Score</div>
//             <div className="text-xl font-semibold tabular-nums">
//               {totalMarks}
//               <span className="text-red-400 text-lg ml-1">/100</span>
//             </div>
//           </div>
//           <div className="flex gap-4 text-sm">
//             {[
//               { id: "marking", label: "Marking" },
//               { id: "copy", label: `Copy (${notAnnotatedPages.length})` },
//               { id: "paper", label: "Q.Paper" },
//               { id: "answer", label: "Ans.Key" }
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`pb-2 px-1 border-b-2 transition-colors ${
//                   activeTab === tab.id
//                     ? "border-blue-500 text-blue-600 font-medium"
//                     : "border-transparent text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Dynamic Content Area */}
//       <div className="flex-1 overflow-y-auto">
//         {renderTabContent()}
//       </div>

//       {/* Actions */}
//       <div className="sticky bottom-0 z-10 bg-white border-t px-4 py-3">
//         <div className="flex gap-3 justify-end">
//           <button
//             onClick={() => setShowRejectModal(true)}
//             className="px-4 h-9 text-sm font-medium text-red-600 hover:bg-red-50
//               rounded-lg transition-colors"
//           >
//             Reject
//           </button>
//           <button
//             onClick={handleSubmitClick}
//             className="px-6 h-9 text-sm font-medium bg-blue-600 text-white
//               hover:bg-blue-700 rounded-lg transition-colors"
//           >
//             Submit
//           </button>
//         </div>
//       </div>

//         {/* Reject Modal */}
//         <RejectModal
//         copyId={copyId} // Replace with actual copy ID
//         isOpen={showRejectModal}
//         onClose={() => setShowRejectModal(false)}
//         onConfirm={handleReject}
//       />

//       {/* Submit Confirmation Modal */}
//       <SubmitConfirmationModal
//         isOpen={showSubmitModal}
//         onClose={() => setShowSubmitModal(false)}
//         onConfirm={handleFinalSubmit}
//         marks={marks}
//         questions={questions}
//       />
//     </div>
//   );
// });

// export default EvaluationPanel;

//? QuestionInput update now from backend (working)

// import { memo, use, useEffect, useState } from "react";
// import QuestionInput from "./QuestionInput";
// import RejectModal from "./Modals/RejectModal";
// import SubmitConfirmationModal from "./Modals/SubmitConfirmationModal";
// import prepareAnnotationsForSave from "../../utils/FilterAnnotation";
// import { useNavigate } from "react-router-dom";
// import copyService from "../../services/copyService";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";
// import api from "../../api/axios";
// import SettingsIcon from "@mui/icons-material/Settings";
// import CachedIcon from "@mui/icons-material/Cached";

// const EvaluationPanel = memo(
//   ({ marks, setMarks, annotations, submitCopy, copyId, handleReset }) => {
//     const [activeTab, setActiveTab] = useState("marking");
//     const [showRejectModal, setShowRejectModal] = useState(false);
//     const [showSubmitModal, setShowSubmitModal] = useState(false);
//     const [questions, setQuestions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [paperId, setPaperId] = useState(1); //using hardcoded value for now
//     const [showMarksReset, setShowMarksReset] = useState(false);

//     const navigate = useNavigate();
//     const { user } = useAuth();

//     const pdfUrl = "http://www.pdf995.com/samples/pdf.pdf"; // Example PDF URL, replace with actual data

//     console.log("Eval Panel rerendering");

//     //Todo: move this and paperId to its parent as pass question..
//     // Fetch questions when paperId changes
//     useEffect(() => {
//       const fetchQuestions = async () => {
//         try {
//           setLoading(true);
//           const response = await api.get(
//             `/api/evaluations/questions/${paperId}`
//           );

//           if (response.data.success) {
//             setQuestions(response.data.data);
//           } else {
//             setError("Failed to load questions");
//             toast.error("Failed to load questions");
//           }
//         } catch (err) {
//           console.error("Error fetching questions:", err);
//           setError("Failed to load questions");
//           toast.error("Failed to load questions");
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchQuestions();
//     }, [paperId]);

//     // Mock data based on your database structure
//     // const questions = [
//     //   { sno: 1, paperId: 101, qNo: "1a", maxMark: 5.0 },
//     //   { sno: 2, paperId: 101, qNo: "1b", maxMark: 5.0 },
//     //   { sno: 3, paperId: 101, qNo: "1c", maxMark: 5.0 },
//     //   { sno: 4, paperId: 101, qNo: "1d", maxMark: 5.0 },
//     //   { sno: 5, paperId: 101, qNo: "2a", maxMark: 7.5 }, // Demonstrating decimal marks
//     //   { sno: 6, paperId: 101, qNo: "2b", maxMark: 7.5 },
//     //   { sno: 7, paperId: 101, qNo: "2c", maxMark: 5.0 },
//     //   { sno: 8, paperId: 101, qNo: "3a", maxMark: 15.0 },
//     //   { sno: 9, paperId: 101, qNo: "3b", maxMark: 15.0 },
//     //   { sno: 10, paperId: 101, qNo: "4a", maxMark: 15.0 },
//     //   { sno: 11, paperId: 101, qNo: "4b", maxMark: 15.0 },
//     // ];

//     // Group questions by the numeric part of qNo (1a, 1b -> group 1)
//     const groups = questions.reduce((acc, q) => {
//       const groupNum = q.qNo.match(/^\d+/)[0]; // Extract the numeric part
//       if (!acc[groupNum]) acc[groupNum] = [];
//       acc[groupNum].push(q);
//       return acc;
//     }, {});

//     // Update the totalMarks calculation
//     const totalMarks = Object.values(marks).reduce(
//       (sum, mark) => sum + (Number(mark) || 0),
//       0
//     );

//     // Calculate max marks from all questions
//     const maxTotalMarks = questions.reduce((sum, q) => sum + q.maxMark, 0);

//     const validateEvaluation = () => {
//       // Check if all required marks are entered and valid
//       const marksValidation = questions.every((q) => {
//         const mark = Number(marks[q.qNo]);
//         return !isNaN(mark) && mark >= 0 && mark <= q.maxMark;
//       });

//       // Return validation result with specific issue if marks are invalid
//       if (!marksValidation) {
//         return {
//           valid: false,
//           issue: "marks",
//           message:
//             "Please ensure all marks are entered correctly and within allowed range.",
//         };
//       }

//       return { valid: true };
//     };

//     const validateAnnotations = () => {
//       // Check if all pages are annotated
//       const totalPages = 36; // Assuming there are 36 pages
//       const annotatedPages = Array.from(
//         new Set(annotations.map((a) => a.page))
//       );
//       const allPagesAnnotated = annotatedPages.length === totalPages;

//       // You could add more specific annotation validations here if needed
//       // For example, check if certain types of annotations exist

//       // Return validation result with specific issue if annotations are invalid
//       if (!allPagesAnnotated) {
//         const missingPages = Array.from(
//           { length: totalPages },
//           (_, i) => i + 1
//         ).filter((p) => !annotatedPages.includes(p));

//         return {
//           valid: false,
//           issue: "annotations",
//           message: `Please review all pages. Missing annotations on pages`,
//           missingPages,
//         };
//       }

//       return { valid: true };
//     };

//     const validateComplete = () => {
//       // First check marks
//       const marksValidationResult = validateEvaluation();
//       if (!marksValidationResult.valid) {
//         return marksValidationResult;
//       }

//       // Then check annotations
//       const annotationsValidationResult = validateAnnotations();
//       // if (!annotationsValidationResult.valid) {
//       //   return annotationsValidationResult;
//       // }

//       // If both passed, return overall valid result
//       return { valid: true };
//     };

//     const handleSubmitClick = () => {
//       // Use combined validation
//       const validationResult = validateComplete();

//       if (!validationResult.valid) {
//         // Show specific error based on what failed
//         toast.error(validationResult.message);
//         console.log("validationResult", validationResult.issue);

//         // Optionally switch to relevant tab if specific part failed
//         if (validationResult.issue === "annotations") {
//           setActiveTab("copy");
//         } else if (validationResult.issue === "marks") {
//           setActiveTab("marking");
//         }

//         return;
//       }

//       // Show confirmation modal
//       setShowSubmitModal(true);
//     };

//     const handleFinalSubmit = async () => {
//       try {
//         const { annotations: regularAnnotations, drawAnnotations } =
//           prepareAnnotationsForSave(annotations);

//         const submissionData = {
//           copyId,
//           totalMarks,
//           userId: user.uid,
//           annotations: regularAnnotations,
//           drawAnnotations: drawAnnotations,
//         };

//         const success = await submitCopy(submissionData);
//         console.log("submit copy response success", success);

//         setShowSubmitModal(false);
//         if (success) {
//           navigate("/", { replace: true });
//         }
//       } catch (error) {
//         console.error("Error submitting evaluation:", error);
//       }
//     };

//     const handleReject = async ({ reason, description }) => {
//       try {
//         const { uid } = JSON.parse(localStorage.getItem("evalUserData"));

//         const rejectReason = description ? reason + ", " + description : reason;

//         const rejectionData = {
//           copyId: copyId,
//           reason: rejectReason,
//           userId: uid,
//           bagId: "testBagId",
//           copyStatus: "REJECTED",
//         };

//         console.log("Rejection Data:", rejectionData);

//         const response = await copyService.rejectCopy(rejectionData);
//         console.log("Rejection Response:", response);

//         // Access fields based on API response structure
//         if (response.success) {
//           setShowRejectModal(false);
//           toast.success("Copy rejected successfully.");

//           // Navigate away after successful rejection
//           navigate("/", { replace: true });
//         } else {
//           // Handle API success=false response
//           toast.error(response.message || "Failed to reject copy");
//         }
//       } catch (error) {
//         console.error("Error rejecting copy:", error);
//         toast.error("Failed to reject copy. Please try again.");
//       }
//     };

//     const handleOpenPDFWindow = () => {
//       const width = 800;
//       const height = 600;
//       const left = window.screenX + 100;
//       const top = window.screenY + 100;
//       window.open(
//         pdfUrl,
//         "QuestionPaperWindow", // <-- window name
//         `width=${width},height=${height},left=${left},top=${top},resizable=no,toolbar=no,menubar=no,location=no,status=no,scrollbars=yes`
//       );
//     };

//     // Calculate unchecked pages
//     const allPages = Array.from({ length: 36 }, (_, i) => i + 1);
//     const annotatedPages = Array.from(new Set(annotations.map((a) => a.page)));
//     const notAnnotatedPages = allPages.filter(
//       (p) => !annotatedPages.includes(p)
//     );

//     const renderTabContent = () => {
//       // If questions are still loading
//       if (loading) {
//         return (
//           <div className="p-4 flex justify-center items-center h-full">
//             <div className="text-gray-500">Loading questions...</div>
//           </div>
//         );
//       }

//       // If there was an error loading questions
//       if (error && questions.length === 0) {
//         return (
//           <div className="p-4 flex justify-center items-center h-full">
//             <div className="text-red-500">{error}</div>
//           </div>
//         );
//       }
//       switch (activeTab) {
//         case "copy":
//           return (
//             <div className="p-4">
//               <div className="mb-2 text-sm text-gray-600">
//                 Unchecked Pages ({notAnnotatedPages.length})
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {notAnnotatedPages.map((page) => (
//                   <span
//                     key={page}
//                     className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
//                     rounded-full bg-red-50 text-red-600 text-sm font-medium 
//                     border border-red-100"
//                   >
//                     {page}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           );
//         case "paper":
//           return (
//             <div className="p-4">
//               <p className="text-gray-600 mb-2">
//                 This is the question paper content.
//               </p>
//               <button
//                 onClick={handleOpenPDFWindow}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 View Question Paper
//               </button>
//             </div>
//           );
//         case "answer":
//           return (
//             <div className="p-4">
//               <p className="text-gray-600">This is the answer paper content.</p>
//               {/* You can add a similar drawer for answer key if needed */}
//             </div>
//           );
//         default:
//           return (
//             // <div className="px-4 py-2 space-y-4">
//             //   {Object.entries(groups).map(([groupNum, groupQuestions]) => (
//             //     <div
//             //       key={groupNum}
//             //       className="py-3 first:pt-2 last:pb-2 border-b last:border-0"
//             //     >
//             //       <div className="flex items-baseline mb-0">
//             //         <span className="text-sm font-medium text-gray-900">
//             //           Q -
//             //         </span>
//             //         <span className="ml-1 text-sm font-medium">{groupNum}</span>
//             //       </div>
//             //       <div className="grid grid-cols-2 gap-2 px-2">
//             //         {groupQuestions.map((q) => (
//             //           <QuestionInput
//             //             key={q.id}
//             //             question={q}
//             //             value={marks[q.id] || ""}
//             //             onChange={(value) =>
//             //               setMarks((prev) => ({ ...prev, [q.id]: value }))
//             //             }
//             //           />
//             //         ))}
//             //       </div>
//             //     </div>
//             //   ))}
//             // </div>
//             <div className="px-4 py-2 space-y-4">
//               {Object.entries(groups).map(([groupNum, groupQuestions]) => (
//                 <div
//                   key={groupNum}
//                   className="py-3 first:pt-2 last:pb-2 border-b last:border-0"
//                 >
//                   <div className="flex items-baseline mb-2">
//                     <span className="text-sm font-semibold text-gray-800">
//                       Q-{groupNum}
//                     </span>
//                     <span className="ml-auto text-xs text-gray-500">
//                       {groupQuestions.reduce((sum, q) => sum + q.maxMark, 0)}{" "}
//                       marks
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-3 px-2">
//                     {groupQuestions.map((q) => (
//                       <QuestionInput
//                         key={q.sno}
//                         question={q}
//                         value={marks[q.qNo] || ""}
//                         onChange={(value) =>
//                           setMarks((prev) => ({ ...prev, [q.qNo]: value }))
//                         }
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           );
//       }
//     };

//     return (
//       <div className="flex flex-col h-full bg-white">
//         {/* Header with total marks and tabs */}
//         <div className="sticky top-0 z-10 bg-white border-b">
//           <div className="px-4 pt-3 pb-2">
//             {/* <div className="flex justify-between items-center mb-3">
//               <div className="text-md text-gray-500">Total Score</div>
//               <div className="text-xl font-semibold tabular-nums">
//                 {totalMarks}
//                 <span className="text-red-400 text-lg ml-1">/{maxTotalMarks}</span>
//               </div>
//             </div> */}

//             {/* <div className="flex justify-between items-center mb-3">
//   <div className="flex items-center gap-1">
//     <div className="text-md text-gray-500">Total Score</div>
    
//     <div className="relative group">
//       <button 
//         className="ml-1 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
//         title="Reset marks options"
//         onClick={() => setShowMarksReset(!showMarksReset)}
//       >
//         <SettingsIcon fontSize="4"/>
//       </button>
      
//       {showMarksReset && (
//         <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md border border-gray-200 p-2 z-20 min-w-[160px] text-sm">
//           <button 
//             onClick={handleReset}
//             className="flex items-center gap-2 w-full text-left px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
//           >
//             <CachedIcon fontSize="4" />
//             Reset All Marks
//           </button>
//         </div>
//       )}
//     </div>
//   </div>

//   <div className="text-xl font-semibold tabular-nums">
//     {totalMarks}
//     <span className="text-red-400 text-lg ml-1">/{maxTotalMarks}</span>
//   </div>
// </div> */}

//             <div className="flex justify-between items-center mb-3">
//               <div className="flex items-center gap-1">
//                 <div className="text-md text-gray-500">Total Score</div>

//                 <div className="relative">
//                   <button
//                     className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
//                     title="Options"
//                     onClick={() => setShowMarksReset(!showMarksReset)}
//                   >
//                     <SettingsIcon sx={{ fontSize: 14 }} /> {/* Smaller icon */}
//                   </button>

//                   {showMarksReset && (
//                     <div className="absolute top-full left-0 mt-1 bg-white shadow-sm rounded-md border border-gray-200 py-1 z-20 min-w-[140px] text-xs">
//                       <button
//                         onClick={() => {
//                           handleReset();
//                           setShowMarksReset(false); // Auto-close after clicking
//                         }}
//                         className="flex items-center gap-1.5 w-full text-left px-2 py-1.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
//                       >
//                         <CachedIcon sx={{ fontSize: 14 }} />
//                         <span>Reset All Marks</span>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="text-xl font-semibold tabular-nums">
//                 {totalMarks}
//                 <span className="text-red-400 text-lg ml-1">
//                   /{maxTotalMarks}
//                 </span>
//               </div>
//             </div>
//             <div className="flex gap-4 text-sm">
//               {[
//                 { id: "marking", label: "Marking" },
//                 { id: "copy", label: `Copy (${notAnnotatedPages.length})` },
//                 { id: "paper", label: "Q.Paper" },
//                 { id: "answer", label: "Ans.Key" },
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`pb-2 px-1 border-b-2 transition-colors ${
//                     activeTab === tab.id
//                       ? "border-blue-500 text-blue-600 font-medium"
//                       : "border-transparent text-gray-600 hover:text-gray-900"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Dynamic Content Area */}
//         <div className="custom-scrollbar flex-1 overflow-y-auto">
//           {renderTabContent()}
//         </div>

//         {/* Actions */}
//         <div className="sticky bottom-0 z-10 bg-white border-t px-4 py-3">
//           <div className="flex gap-3 justify-end">
//             <button
//               onClick={() => setShowRejectModal(true)}
//               className="px-4 h-9 text-sm font-medium text-red-600 hover:bg-red-50 
//               rounded-lg transition-colors"
//             >
//               Reject
//             </button>
//             <button
//               onClick={handleSubmitClick}
//               className="px-6 h-9 text-sm font-medium bg-blue-600 text-white 
//               hover:bg-blue-700 rounded-lg transition-colors"
//             >
//               Submit
//             </button>
//           </div>
//         </div>

//         {/* Reject Modal */}
//         <RejectModal
//           copyId={copyId} // Replace with actual copy ID
//           isOpen={showRejectModal}
//           onClose={() => setShowRejectModal(false)}
//           onConfirm={handleReject}
//         />

//         {/* Submit Confirmation Modal */}
//         <SubmitConfirmationModal
//           isOpen={showSubmitModal}
//           onClose={() => setShowSubmitModal(false)}
//           onConfirm={handleFinalSubmit}
//           marks={marks}
//           questions={questions}
//         />
//       </div>
//     );
//   }
// );

// export default EvaluationPanel;


//? (testing) skip page1 page2 unchecked cacualtion and validation

import { memo, use, useEffect, useState } from "react";
import QuestionInput from "./QuestionInput";
import RejectModal from "./Modals/RejectModal";
import SubmitConfirmationModal from "./Modals/SubmitConfirmationModal";
import prepareAnnotationsForSave from "../../utils/FilterAnnotation";
import { useNavigate } from "react-router-dom";
import copyService from "../../services/copyService";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../../api/axios";
import SettingsIcon from "@mui/icons-material/Settings";
import CachedIcon from "@mui/icons-material/Cached";

// Define pages to skip from annotation checking
const PAGES_TO_SKIP = [1, 2]; // Skip pages 1 and 2 

const EvaluationPanel = memo(
  ({ marks, setMarks, annotations, submitCopy, copyId, handleReset }) => {
    const [activeTab, setActiveTab] = useState("marking");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paperId, setPaperId] = useState(1); //using hardcoded value for now
    const [showMarksReset, setShowMarksReset] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();

    const pdfUrl = "http://www.pdf995.com/samples/pdf.pdf"; // Example PDF URL, replace with actual data

    console.log("Eval Panel rerendering");

    //Todo: move this and paperId to its parent as pass question..
    // Fetch questions when paperId changes
    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          setLoading(true);
          const response = await api.get(
            `/api/evaluations/questions/${paperId}`
          );

          if (response.data.success) {
            setQuestions(response.data.data);
          } else {
            setError("Failed to load questions");
            toast.error("Failed to load questions");
          }
        } catch (err) {
          console.error("Error fetching questions:", err);
          setError("Failed to load questions");
          toast.error("Failed to load questions");
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    }, [paperId]);

    // Group questions by the numeric part of qNo (1a, 1b -> group 1)
    const groups = questions.reduce((acc, q) => {
      const groupNum = q.qNo.match(/^\d+/)[0]; // Extract the numeric part
      if (!acc[groupNum]) acc[groupNum] = [];
      acc[groupNum].push(q);
      return acc;
    }, {});

    // Update the totalMarks calculation
    const totalMarks = Object.values(marks).reduce(
      (sum, mark) => sum + (Number(mark) || 0),
      0
    );

    // Calculate max marks from all questions
    const maxTotalMarks = questions.reduce((sum, q) => sum + q.maxMark, 0);

    const validateEvaluation = () => {
      // Check if all required marks are entered and valid
      const marksValidation = questions.every((q) => {
        const mark = Number(marks[q.qNo]);
        return !isNaN(mark) && mark >= 0 && mark <= q.maxMark;
      });

      // Return validation result with specific issue if marks are invalid
      if (!marksValidation) {
        return {
          valid: false,
          issue: "marks",
          message:
            "Please ensure all marks are entered correctly and within allowed range.",
        };
      }

      return { valid: true };
    };

    // const validateAnnotations = () => {
    //   // Check if all pages are annotated
    //   const totalPages = 36; // Assuming there are 36 pages
    //   const annotatedPages = Array.from(
    //     new Set(annotations.map((a) => a.page))
    //   );
    //   const allPagesAnnotated = annotatedPages.length === totalPages;

    //   // You could add more specific annotation validations here if needed
    //   // For example, check if certain types of annotations exist

    //   // Return validation result with specific issue if annotations are invalid
    //   if (!allPagesAnnotated) {
    //     const missingPages = Array.from(
    //       { length: totalPages },
    //       (_, i) => i + 1
    //     ).filter((p) => !annotatedPages.includes(p));

    //     return {
    //       valid: false,
    //       issue: "annotations",
    //       message: `Please review all pages. Missing annotations on pages`,
    //       missingPages,
    //     };
    //   }

    //   return { valid: true };
    // };

    const validateAnnotations = () => {
      // Check if all required pages are annotated (excluding skipped pages)
      const totalPages = 36; // Assuming there are 36 pages
      const annotatedPages = Array.from(
        new Set(annotations.map((a) => a.page))
      );
      
      // Create array of pages that need to be checked (excluding skipped pages)
      const pagesToCheck = Array.from(
        { length: totalPages }, 
        (_, i) => i + 1
      ).filter(page => !PAGES_TO_SKIP.includes(page));
      
      // Check if all required pages are annotated
      const missingPages = pagesToCheck.filter(p => !annotatedPages.includes(p));
      
      // Return validation result with specific issue if annotations are invalid
      if (missingPages.length > 0) {
        return {
          valid: false,
          issue: "annotations",
          message: `Please review all pages. Missing annotations on pages`,
          missingPages,
        };
      }
    
      return { valid: true };
    };


    const validateComplete = () => {
      // First check marks
      const marksValidationResult = validateEvaluation();
      if (!marksValidationResult.valid) {
        return marksValidationResult;
      }

      // Then check annotations
      const annotationsValidationResult = validateAnnotations();
      // if (!annotationsValidationResult.valid) {
      //   return annotationsValidationResult;
      // }

      // If both passed, return overall valid result
      return { valid: true };
    };

    const handleSubmitClick = () => {
      // Use combined validation
      const validationResult = validateComplete();

      if (!validationResult.valid) {
        // Show specific error based on what failed
        toast.error(validationResult.message);
        console.log("validationResult", validationResult.issue);

        // Optionally switch to relevant tab if specific part failed
        if (validationResult.issue === "annotations") {
          setActiveTab("copy");
        } else if (validationResult.issue === "marks") {
          setActiveTab("marking");
        }

        return;
      }

      // Show confirmation modal
      setShowSubmitModal(true);
    };

    const handleFinalSubmit = async () => {
      try {
        const { annotations: regularAnnotations, drawAnnotations } =
          prepareAnnotationsForSave(annotations);

        const submissionData = {
          copyId,
          totalMarks,
          userId: user.uid,
          annotations: regularAnnotations,
          drawAnnotations: drawAnnotations,
        };

        const success = await submitCopy(submissionData);
        console.log("submit copy response success", success);

        setShowSubmitModal(false);
        if (success) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error submitting evaluation:", error);
      }
    };

    const handleReject = async ({ reason, description }) => {
      try {
        const { uid } = JSON.parse(localStorage.getItem("evalUserData"));

        const rejectReason = description ? reason + ", " + description : reason;

        const rejectionData = {
          copyId: copyId,
          reason: rejectReason,
          userId: uid,
          bagId: "testBagId",
          copyStatus: "REJECTED",
        };

        console.log("Rejection Data:", rejectionData);

        const response = await copyService.rejectCopy(rejectionData);
        console.log("Rejection Response:", response);

        // Access fields based on API response structure
        if (response.success) {
          setShowRejectModal(false);
          toast.success("Copy rejected successfully.");

          // Navigate away after successful rejection
          navigate("/", { replace: true });
        } else {
          // Handle API success=false response
          toast.error(response.message || "Failed to reject copy");
        }
      } catch (error) {
        console.error("Error rejecting copy:", error);
        toast.error("Failed to reject copy. Please try again.");
      }
    };

    const handleOpenPDFWindow = () => {
      const width = 800;
      const height = 600;
      const left = window.screenX + 100;
      const top = window.screenY + 100;
      window.open(
        pdfUrl,
        "QuestionPaperWindow", // <-- window name
        `width=${width},height=${height},left=${left},top=${top},resizable=no,toolbar=no,menubar=no,location=no,status=no,scrollbars=yes`
      );
    };

    // // Calculate unchecked pages
    // const allPages = Array.from({ length: 36 }, (_, i) => i + 1);
    // const annotatedPages = Array.from(new Set(annotations.map((a) => a.page)));
    // const notAnnotatedPages = allPages.filter(
    //   (p) => !annotatedPages.includes(p)
    // );

    //* Calculate unchecked pages (excluding pages we want to skip)
    const allPages = Array.from({ length: 36 }, (_, i) => i + 1)
    .filter(page => !PAGES_TO_SKIP.includes(page)); // Filter out skipped pages

    const annotatedPages = Array.from(new Set(annotations.map((a) => a.page)));
    const notAnnotatedPages = allPages.filter(
    (p) => !annotatedPages.includes(p)
    );

    const renderTabContent = () => {
      // If questions are still loading
      if (loading) {
        return (
          <div className="p-4 flex justify-center items-center h-full">
            <div className="text-gray-500">Loading questions...</div>
          </div>
        );
      }

      // If there was an error loading questions
      if (error && questions.length === 0) {
        return (
          <div className="p-4 flex justify-center items-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        );
      }
      switch (activeTab) {
        case "copy":
          return (
            <div className="p-4">
              <div className="mb-2 text-sm text-gray-600">
                Unchecked Pages ({notAnnotatedPages.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {notAnnotatedPages.map((page) => (
                  <span
                    key={page}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
                    rounded-full bg-red-50 text-red-600 text-sm font-medium 
                    border border-red-100"
                  >
                    {page}
                  </span>
                ))}
              </div>
            </div>
          );
        case "paper":
          return (
            <div className="p-4">
              <p className="text-gray-600 mb-2">
                This is the question paper content.
              </p>
              <button
                onClick={handleOpenPDFWindow}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Question Paper
              </button>
            </div>
          );
        case "answer":
          return (
            <div className="p-4">
              <p className="text-gray-600">This is the answer paper content.</p>
              {/* You can add a similar drawer for answer key if needed */}
            </div>
          );
        default:
          return (
            <div className="px-4 py-2 space-y-4">
              {Object.entries(groups).map(([groupNum, groupQuestions]) => (
                <div
                  key={groupNum}
                  className="py-3 first:pt-2 last:pb-2 border-b last:border-0"
                >
                  <div className="flex items-baseline mb-2">
                    <span className="text-sm font-semibold text-gray-800">
                      Q-{groupNum}
                    </span>
                    <span className="ml-auto text-xs text-gray-500">
                      {groupQuestions.reduce((sum, q) => sum + q.maxMark, 0)}{" "}
                      marks
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 px-2">
                    {groupQuestions.map((q) => (
                      <QuestionInput
                        key={q.sno}
                        question={q}
                        value={marks[q.qNo] || ""}
                        onChange={(value) =>
                          setMarks((prev) => ({ ...prev, [q.qNo]: value }))
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
      }
    };

    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header with total marks and tabs */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="px-4 pt-3 pb-2">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1">
                <div className="text-md text-gray-500">Total Score</div>

                <div className="relative">
                  <button
                    className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
                    title="Options"
                    onClick={() => setShowMarksReset(!showMarksReset)}
                  >
                    <SettingsIcon sx={{ fontSize: 14 }} /> {/* Smaller icon */}
                  </button>

                  {showMarksReset && (
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-sm rounded-md border border-gray-200 py-1 z-20 min-w-[140px] text-xs">
                      <button
                        onClick={() => {
                          handleReset();
                          setShowMarksReset(false); // Auto-close after clicking
                        }}
                        className="flex items-center gap-1.5 w-full text-left px-2 py-1.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <CachedIcon sx={{ fontSize: 14 }} />
                        <span>Reset All Marks</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xl font-semibold tabular-nums">
                {totalMarks}
                <span className="text-red-400 text-lg ml-1">
                  /{maxTotalMarks}
                </span>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              {[
                { id: "marking", label: "Marking" },
                { id: "copy", label: `Pages (${notAnnotatedPages.length})` },
                { id: "paper", label: "Q.Paper" },
                { id: "answer", label: "Ans.Key" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 font-medium"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="custom-scrollbar flex-1 overflow-y-auto">
          {renderTabContent()}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 z-10 bg-white border-t px-4 py-3">
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-4 h-9 text-sm font-medium text-red-600 hover:bg-red-50 
              rounded-lg transition-colors"
            >
              Reject
            </button>
            <button
              onClick={handleSubmitClick}
              className="px-6 h-9 text-sm font-medium bg-blue-600 text-white 
              hover:bg-blue-700 rounded-lg transition-colors"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Reject Modal */}
        <RejectModal
          copyId={copyId} // Replace with actual copy ID
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleReject}
        />

        {/* Submit Confirmation Modal */}
        <SubmitConfirmationModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onConfirm={handleFinalSubmit}
          marks={marks}
          questions={questions}
        />
      </div>
    );
  }
);

export default EvaluationPanel;

