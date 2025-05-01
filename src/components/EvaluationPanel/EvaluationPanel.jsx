
// import { memo, useState } from "react";
// import QuestionInput from "./QuestionInput";

// const EvaluationPanel = memo(({ marks, setMarks, annotations, saveAnnotations }) => {
//   const [activeTab, setActiveTab] = useState("Question");

//   const questions = [
//     { id: "Q1", maxMarks: 20 },
//     { id: "Q2", maxMarks: 20 },
//     { id: "Q3", maxMarks: 20 },
//     { id: "Q4A", maxMarks: 30 },
//     { id: "Q4B", maxMarks: 10 },
//   ];

//   const annotatedPages = Array.from(new Set(annotations.map((a) => a.page)));
//   const totalMarks = Object.values(marks).reduce(
//     (sum, mark) => sum + (Number(mark) || 0),
//     0
//   );

//   const totalPages = 36;
//   // Check if all pages are annotated
//   const allPagesAnnotated = annotatedPages.length === totalPages; // Assuming there are 36 pages

//   // Check if all marks are filled and do not exceed max marks
//   const allMarksValid = questions.every((q) => {
//     const mark = Number(marks[q.id]);
//     return mark >= 0 && mark <= q.maxMarks; // Ensure marks are within the valid range
//   });

//   // 🔍 Find unannotated pages  // future usage
//   const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
//   const notAnnotatedPages = allPages.filter((p) => !annotatedPages.includes(p));

//   const handleSubmit = () => {
//     if (!allPagesAnnotated || !allMarksValid) {
//       alert(
//         "Please ensure all pages are annotated and marks are filled correctly."
//       );
//       return;
//     }

//     const jsonObject = {
//       annotations: annotations.map((annotation) => ({
//         id: annotation.id,
//         type: annotation.type,
//         page: annotation.page,
//         position: annotation.position,
//         text: annotation.text,
//       })),
//     };
//     console.log("JSON Object to be sent to the API:", jsonObject);


//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "Q.Paper":
//         return (
//           <div className="text-gray-700 p-4">
//             <p>Question paper content goes here...</p>
//           </div>
//         );

//       case "Ans.Key":
//         return (
//           <div className="text-gray-700 p-4">
//             <p>Answer key content goes here...</p>
//           </div>
//         );

//       case "UncheckedPages":
//         return (
//           <div className="text-gray-700 p-1">
//             <div className="flex gap-2 overflow-x-auto pb-2  scroll-smooth">
//               {notAnnotatedPages.map((page) => (
//                 <span
//                   key={page}
//                   className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-red-100 text-red-700 text-sm font-medium"
//                 >
//                   {page}
//                 </span>
//               ))}
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };


//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-grow overflow-y-auto">
//         <div className="mb-4">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-semibold text-gray-600">
//               Total Marks:
//             </span>
//             <span className="text-lg font-bold text-red-600">
//               {totalMarks} / 100
//             </span>
//           </div>
//         </div>
//         <div className="space-y-3 h-85 overflow-auto">
//           {questions.map((q) => (
//             <QuestionInput
//               key={q.id}
//               question={q}
//               value={marks[q.id] || ""}
//               onChange={(value) =>
//                 setMarks((prev) => ({ ...prev, [q.id]: value }))
//               }
//             />
//           ))}
//         </div>
        
//         {/* <div className="mt-6 text-sm text-gray-600">
//           <span>Pages Annotated: </span>
//           <span className="font-medium">{annotatedPages.length} / 36</span>
//         </div> */}

    
//         <div className="mt-6 mb-3">
//           <nav className="flex gap-2 text-sm border-b pb-1">
//             {["Q.Paper", "Ans.Key", "UncheckedPages"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-3 py-1 rounded-t text-gray-700 border-b-2 ${
//                   activeTab === tab
//                     ? "border-blue-500 font-semibold"
//                     : "border-transparent hover:border-gray-300"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="tab-content mt-2">
//           {renderTabContent()}
//         </div>
//       </div>

//       <div className="flex items-center justify-center gap-2 mt-4">
//         <button
//           onClick={handleSubmit}
//           type="button"
//           className={`text-white font-medium rounded-full text-sm py-1 px-3.5 text-center me-2 mb-2 focus:outline-none focus:ring-4
//             ${
//               !allPagesAnnotated || !allMarksValid
//                 ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
//                 : "bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
//             }`}
//           disabled={!allPagesAnnotated || !allMarksValid}
//         >
//           Submit
//         </button>
//         <button
//           type="button"
//           onClick={()=>saveAnnotations()}
//           className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm py-1 px-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
//         >
//           Reject
//         </button>
//       </div>
//     </div>
//   );

// });

// export default EvaluationPanel;

//?v2 ui update


// import { memo, useState } from "react";
// import QuestionInput from "./QuestionInput";

// const EvaluationPanel = memo(({ marks, setMarks, annotations, saveAnnotations }) => {
//   const [activeTab, setActiveTab] = useState("marking");

//   const questions = [
//     // Sub-questions for Question 1
//     { id: "1A", maxMarks: 5, group: "Q1" },
//     { id: "1B", maxMarks: 5, group: "Q1" },
//     { id: "1C", maxMarks: 5, group: "Q1" },
//     { id: "1D", maxMarks: 5, group: "Q1" },
//     // Sub-questions for Question 2
//     { id: "2A", maxMarks: 10, group: "Q2" },
//     { id: "2B", maxMarks: 10, group: "Q2" },
//     // Question 3 and 4
//     { id: "3", maxMarks: 30, group: "Q3" },
//     { id: "4", maxMarks: 30, group: "Q4" },
//   ];

//   const annotatedPages = Array.from(new Set(annotations.map((a) => a.page)));
//   const totalMarks = Object.values(marks).reduce(
//     (sum, mark) => sum + (Number(mark) || 0),
//     0
//   );

//   const totalPages = 36;
//   const allPagesAnnotated = annotatedPages.length === totalPages;
//   const allMarksValid = questions.every((q) => {
//     const mark = Number(marks[q.id]);
//     return mark >= 0 && mark <= q.maxMarks;
//   });

//   const notAnnotatedPages = Array.from({ length: totalPages }, (_, i) => i + 1)
//     .filter((p) => !annotatedPages.includes(p));

//   return (
//     <div className="flex flex-col h-full bg-white">
//       {/* Header */}
//       <div className="flex-none p-4 border-b border-gray-200">
//         <div className="flex justify-between items-center mb-2">
//           <h2 className="text-lg font-semibold text-gray-800">Evaluation</h2>
//           <span className="text-sm text-gray-500">Total: {totalMarks}/100</span>
//         </div>
//         <div className="flex gap-2 text-sm">
//           <button
//             onClick={() => setActiveTab("marking")}
//             className={`px-3 py-1.5 rounded-md transition-colors ${
//               activeTab === "marking"
//                 ? "bg-blue-50 text-blue-600 font-medium"
//                 : "text-gray-600 hover:bg-gray-50"
//             }`}
//           >
//             Marking
//           </button>
//           <button
//             onClick={() => setActiveTab("pages")}
//             className={`px-3 py-1.5 rounded-md transition-colors ${
//               activeTab === "pages"
//                 ? "bg-blue-50 text-blue-600 font-medium"
//                 : "text-gray-600 hover:bg-gray-50"
//             }`}
//           >
//             Pages ({notAnnotatedPages.length})
//           </button>
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 overflow-y-auto">
//         {activeTab === "marking" ? (
//           <div className="p-4 space-y-6">
           
//             {["Q1", "Q2", "Q3", "Q4"].map((group) => {
//               const groupQuestions = questions.filter((q) => q.group === group);
//               const groupTotal = groupQuestions.reduce(
//                 (sum, q) => sum + (Number(marks[q.id]) || 0),
//                 0
//               );
//               const groupMax = groupQuestions.reduce(
//                 (sum, q) => sum + q.maxMarks,
//                 0
//               );

//               return (
//                 <div key={group} className="space-y-2">
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span className="font-medium">{group}</span>
//                     <span>{groupTotal}/{groupMax}</span>
//                   </div>
//                   <div className="space-y-2">
//                     {groupQuestions.map((q) => (
//                       <QuestionInput
//                         key={q.id}
//                         question={q}
//                         value={marks[q.id] || ""}
//                         onChange={(value) =>
//                           setMarks((prev) => ({ ...prev, [q.id]: value }))
//                         }
//                       />
//                     ))}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="p-4">
//             <div className="mb-3 text-sm text-gray-600">
//               Unchecked Pages: {notAnnotatedPages.length}
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {notAnnotatedPages.map((page) => (
//                 <span
//                   key={page}
//                   className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 text-sm font-medium border border-red-100"
//                 >
//                   {page}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Footer Actions */}
//       <div className="flex-none p-4 border-t border-gray-200 bg-gray-50">
//         <div className="flex gap-3 justify-end">
//           <button
//             onClick={saveAnnotations}
//             type="button"
//             className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
//           >
//             Reject
//           </button>
//           <button
//             onClick={() => {
//               if (!allPagesAnnotated || !allMarksValid) {
//                 alert("Please check all pages and fill marks correctly.");
//                 return;
//               }
//               // Handle submit
//             }}
//             type="button"
//             className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//               !allPagesAnnotated || !allMarksValid
//                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 text-white hover:bg-blue-700"
//             }`}
//             disabled={!allPagesAnnotated || !allMarksValid}
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default EvaluationPanel;


//? v2.1 ui update minimal

// import { memo, useState } from "react";
// import QuestionInput from "./QuestionInput";

// const EvaluationPanel = memo(({ marks, setMarks, annotations, saveAnnotations }) => {
//   const [activeTab, setActiveTab] = useState("marking");

//   // Updated questions structure with sections
//   const questions = [
//     { id: "1A", maxMarks: 5, section: "1" },
//     { id: "1B", maxMarks: 5, section: "1" },
//     { id: "1C", maxMarks: 5, section: "1" },
//     { id: "1D", maxMarks: 5, section: "1" },
//     { id: "2A", maxMarks: 10, section: "2" },
//     { id: "2B", maxMarks: 10, section: "2" },
//     { id: "3A", maxMarks: 15, section: "3" },
//     { id: "3B", maxMarks: 15, section: "3" },
//     { id: "4", maxMarks: 30, section: "4" },
//   ];

//   // Group questions by section
//   const sections = questions.reduce((acc, q) => {
//     if (!acc[q.section]) {
//       acc[q.section] = [];
//     }
//     acc[q.section].push(q);
//     return acc;
//   }, {});

//   // Calculate section totals
//   const getSectionTotal = (sectionQuestions) => {
//     return sectionQuestions.reduce((sum, q) => sum + (Number(marks[q.id]) || 0), 0);
//   };

//   const getSectionMaxTotal = (sectionQuestions) => {
//     return sectionQuestions.reduce((sum, q) => sum + q.maxMarks, 0);
//   };

//   // Calculate total marks
//   const totalMarks = Object.values(marks).reduce(
//     (sum, mark) => sum + (Number(mark) || 0),
//     0
//   );

//   return (
//     <div className="flex flex-col h-full bg-white">
//       {/* Header with total marks */}
//       <div className="flex-none p-4 border-b">
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-semibold text-gray-800">Evaluation</h2>
//           <div className="text-sm bg-gray-50 px-3 py-1 rounded-full">
//             <span className="font-medium text-gray-600">{totalMarks}</span>
//             <span className="text-gray-400">/100</span>
//           </div>
//         </div>
//       </div>

//       {/* Scrollable content area */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-4 space-y-6">
//           {Object.entries(sections).map(([sectionNum, sectionQuestions]) => (
//             <div key={sectionNum} className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-medium text-gray-700">
//                   Question {sectionNum}
//                 </h3>
//                 <span className="text-sm text-gray-500">
//                   {getSectionTotal(sectionQuestions)}/{getSectionMaxTotal(sectionQuestions)}
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-lg">
//                 {sectionQuestions.map((q) => (
//                   <QuestionInput
//                     key={q.id}
//                     question={q}
//                     value={marks[q.id] || ''}
//                     onChange={(value) => 
//                       setMarks(prev => ({ ...prev, [q.id]: value }))
//                     }
//                   />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer with actions */}
//       <div className="flex-none p-4 border-t bg-gray-50">
//         <div className="flex justify-between items-center">
//           <button
//             onClick={saveAnnotations}
//             className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
//           >
//             Reject
//           </button>
//           <button
//             onClick={() => {/* handle submit */}}
//             className="px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default EvaluationPanel;


//?

// import { memo, useState } from "react";
// import QuestionInput from "./QuestionInput";

// const EvaluationPanel = memo(({ marks, setMarks, annotations, saveAnnotations }) => {
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

//   return (
//     <div className="flex flex-col h-full bg-white">
//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
//         <div className="flex justify-between items-center">
//           <div className="text-sm text-gray-500">Total Score</div>
//           <div className="text-2xl font-semibold tabular-nums">
//             {totalMarks}
//             <span className="text-gray-400 text-lg ml-1">/100</span>
//           </div>
//         </div>
//       </div>

//       {/* Questions Grid */}
//       <div className="flex-1 overflow-y-auto px-4 py-2">
//         {Object.entries(groups).map(([groupNum, groupQuestions]) => (
//           <div 
//             key={groupNum}
//             className="py-3 first:pt-2 last:pb-2 border-b last:border-0"
//           >
//             <div className="flex items-baseline mb-2">
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

//       {/* Actions */}
//       <div className="sticky bottom-0 z-10 bg-white border-t px-4 py-3">
//         <div className="flex gap-3 justify-end">
//           <button
//             onClick={saveAnnotations}
//             className="px-4 h-9 text-sm font-medium text-red-600 hover:bg-red-50 
//               rounded-lg transition-colors"
//           >
//             Reject
//           </button>
//           <button
//             onClick={() => {/* handle submit */}}
//             className="px-6 h-9 text-sm font-medium bg-blue-600 text-white 
//               hover:bg-blue-700 rounded-lg transition-colors"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// });
// export default EvaluationPanel;

//? with tabs (currently working on this)

import { memo, useState } from "react";
import QuestionInput from "./QuestionInput";
import RejectModal from "./Modals/RejectModal";
import SubmitConfirmationModal from "./Modals/SubmitConfirmationModal";
import prepareAnnotationsForSave from "../../utils/FilterAnnotation";
import { useNavigate } from "react-router-dom";
import copyService from "../../services/copyService";
import toast from "react-hot-toast";



const EvaluationPanel = memo(({ marks, setMarks, annotations, submitCopy }) => {
  const copyId = "12345"; // Example copy ID, replace with actual data
  const [activeTab, setActiveTab] = useState("marking");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const navigate= useNavigate();
  
  const pdfUrl = "http://www.pdf995.com/samples/pdf.pdf"; // Example PDF URL, replace with actual data

  // Questions structure with sub-parts
  const questions = [
    { id: "1A", maxMarks: 5, group: 1 },
    { id: "1B", maxMarks: 5, group: 1 },
    { id: "1C", maxMarks: 5, group: 1 },
    { id: "1D", maxMarks: 5, group: 1 },
    { id: "2A", maxMarks: 10, group: 2 },
    { id: "2B", maxMarks: 10, group: 2 },
    { id: "3A", maxMarks: 15, group: 3 },
    { id: "3B", maxMarks: 15, group: 3 },
    { id: "4", maxMarks: 30, group: 4 },
  ];

  // Calculate total marks
  const totalMarks = Object.values(marks).reduce(
    (sum, mark) => sum + (Number(mark) || 0),
    0
  );

  // Group questions
  const groups = questions.reduce((acc, q) => {
    if (!acc[q.group]) acc[q.group] = [];
    acc[q.group].push(q);
    return acc;
  }, {});


  const validateEvaluation = () => {
    // Check if all required marks are entered and valid
    const marksValidation = questions.every(q => {
      const mark = Number(marks[q.id]);
      return !isNaN(mark) && mark >= 0 && mark <= q.maxMarks;
    });
    
    // Return validation result with specific issue if marks are invalid
    if (!marksValidation) {
      return { 
        valid: false, 
        issue: "marks",
        message: "Please ensure all marks are entered correctly and within allowed range."
      };
    }
    
    return { valid: true };
  };
  
  const validateAnnotations = () => {
    // Check if all pages are annotated
    const totalPages = 36; // Assuming there are 36 pages
    const annotatedPages = Array.from(new Set(annotations.map(a => a.page)));
    const allPagesAnnotated = annotatedPages.length === totalPages;
    
    // You could add more specific annotation validations here if needed
    // For example, check if certain types of annotations exist
    
    // Return validation result with specific issue if annotations are invalid
    if (!allPagesAnnotated) {
      const missingPages = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => !annotatedPages.includes(p));
        
      return { 
        valid: false, 
        issue: "annotations",
        message: `Please review all pages. Missing annotations on pages: ${missingPages.join(', ')}`,
        missingPages
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
    if (!annotationsValidationResult.valid) {
      return annotationsValidationResult;
    }
    
    // If both passed, return overall valid result
    return { valid: true };
  };

  const handleSubmitClick = () => {
    // Use combined validation
    // const validationResult = validateComplete();
    
    // if (!validationResult.valid) {
    //   // Show specific error based on what failed
    //   alert(validationResult.message);
      
    //   // Optionally switch to relevant tab if specific part failed
    //   if (validationResult.issue === "annotations") {
    //     setActiveTab("copy");
    //   } else if (validationResult.issue === "marks") {
    //     setActiveTab("marking");
    //   }
      
    //   return;
    // }
    
    // Show confirmation modal
    setShowSubmitModal(true);
  };



  // const handleFinalSubmit = async () => {
  //   const { annotations: regularAnnotations, drawAnnotations } =
  //     prepareAnnotationsForSave(annotations);

  //   const { uid } = JSON.parse(localStorage.getItem("evalUserData"));
    
      
  //   const submissionData = {
  //     copyId,
  //     totalMarks,
  //     userId: uid,
  //     annotations: regularAnnotations,
  //     drawAnnotations: drawAnnotations,
  //   };
  
  //   console.log('Submission Data:', submissionData);
  
  //   try {
  //     await submitCopy(submissionData);
  //     setShowSubmitModal(false);
  //   } catch (error) {
  //     console.error('Error submitting evaluation:', error);
  //     alert('Failed to submit evaluation. Please try again.');
  //   }
  // };

//?v2 testing phase.....
const handleFinalSubmit = async () => {
  
  try {
    const { annotations: regularAnnotations, drawAnnotations } =
      prepareAnnotationsForSave(annotations);

    const { uid } = JSON.parse(localStorage.getItem("evalUserData"));
    
    const submissionData = {
      copyId,
      totalMarks,
      userId: uid,
      annotations: regularAnnotations,
      drawAnnotations: drawAnnotations,
    };

    const success = await submitCopy(submissionData);
    console.log("submit copy response success", success);
    
    setShowSubmitModal(false);
    if (success) {
      navigate('/', { replace: true });
    }

  } catch (error) {
    console.error('Error submitting evaluation:', error);
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
      copyStatus: "REJECTED"       
    };

    console.log('Rejection Data:', rejectionData);
    
    const response = await copyService.rejectCopy(rejectionData);
    console.log('Rejection Response:', response);
    
    // Access fields based on API response structure
    if (response.success) {
      setShowRejectModal(false);
      toast.success('Copy rejected successfully.');
      
      // Navigate away after successful rejection
      navigate('/', { replace: true });
    } else {
      // Handle API success=false response
      toast.error(response.message || 'Failed to reject copy');
    }
  } catch (error) {
    console.error('Error rejecting copy:', error);
    toast.error('Failed to reject copy. Please try again.');
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



  // Calculate unchecked pages
  const allPages = Array.from({ length: 36 }, (_, i) => i + 1);
  const annotatedPages = Array.from(new Set(annotations.map((a) => a.page)));
  const notAnnotatedPages = allPages.filter((p) => !annotatedPages.includes(p));

  const renderTabContent = () => {
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
            <p className="text-gray-600 mb-2">This is the question paper content.</p>
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
            <div className="flex items-baseline mb-0">
              <span className="text-sm font-medium text-gray-900">Q -</span>
              <span className="ml-1 text-sm font-medium">{groupNum}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 px-2">
              {groupQuestions.map((q) => (
                <QuestionInput
                  key={q.id}
                  question={q}
                  value={marks[q.id] || ''}
                  onChange={(value) => 
                    setMarks(prev => ({ ...prev, [q.id]: value }))
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
            <div className="text-md text-gray-500">Total Score</div>
            <div className="text-xl font-semibold tabular-nums">
              {totalMarks}
              <span className="text-red-400 text-lg ml-1">/100</span>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            {[
              { id: "marking", label: "Marking" },
              { id: "copy", label: `Copy (${notAnnotatedPages.length})` },
              { id: "paper", label: "Q.Paper" },
              { id: "answer", label: "Ans.Key" }
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
      <div className="flex-1 overflow-y-auto">
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
});

export default EvaluationPanel;
