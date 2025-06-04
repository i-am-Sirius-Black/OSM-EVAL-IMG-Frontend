
// export const QuestionPaperPreview = ({ 
//   isOpen, 
//   onClose, 
//   onConfirm, 
//   formData, 
//   questionGroups, 
//   file,
//   loading 
// }) => {
//   if (!isOpen) return null;

//   // Calculate total marks
//   const calculateTotalMarks = () => {
//     return questionGroups.reduce((total, group) => {
//       if (group.subquestions.length === 0) {
//         return total + (parseFloat(group.maxMarks) || 0);
//       } else {
//         const subquestionsTotal = group.subquestions.reduce(
//           (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
//           0
//         );
//         return total + subquestionsTotal;
//       }
//     }, 0);
//   };

//   const totalMarks = calculateTotalMarks();
//   const totalParts = questionGroups.reduce((sum, g) => sum + g.subquestions.length, 0);

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white px-6 py-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-bold text-gray-100">Question Paper And Fragmentation Preview</h2>
//               <p className="text-gray-100 mt-1 text-xs">Review your question paper before submission</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-white hover:text-gray-200 p-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
//           <div className="p-6">
//             {/* Paper Information */}
//             <div className="bg-gray-50 rounded-lg p-6 mb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 Paper Information
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-3">
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">Course</label>
//                     <p className="text-gray-900 font-medium">{formData.course}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">Subject</label>
//                     <p className="text-gray-900 font-medium">{formData.subject}</p>
//                     <p className="text-xs text-gray-500">ID: {formData.subjectId}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">Paper Code</label>
//                     <p className="text-gray-900 font-medium">{formData.paperCode}</p>
//                   </div>
//                 </div>
                
//                 <div className="space-y-3">
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">Paper Title</label>
//                     <p className="text-gray-900 font-medium">{formData.title || "Not specified"}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">Maximum Marks</label>
//                     <p className="text-gray-900 font-medium">{formData.maxMarks} marks</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">PDF File</label>
//                     <p className="text-gray-900 font-medium">{file?.name}</p>
//                     <p className="text-xs text-gray-500">{(file?.size / 1024 / 1024).toFixed(2)} MB</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Question Structure */}
//             <div className="bg-white border rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 Question Structure
//               </h3>

//               {/* Summary Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                   <div className="text-blue-600 text-sm font-medium">Total Questions</div>
//                   <div className="text-2xl font-bold text-blue-900">{questionGroups.length}</div>
//                 </div>
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                   <div className="text-green-600 text-sm font-medium">Total Parts</div>
//                   <div className="text-2xl font-bold text-green-900">{totalParts}</div>
//                 </div>
//                 <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
//                   <div className="text-purple-600 text-sm font-medium">Total Marks</div>
//                   <div className="text-2xl font-bold text-purple-900">{totalMarks}</div>
//                 </div>
//               </div>

//               {/* Questions List */}
//               <div className="space-y-4">
//                 {questionGroups.map((group, index) => (
//                   <div key={group.id} className="border border-gray-200 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-3">
//                       <h4 className="text-lg font-semibold text-gray-800">
//                         Question {group.questionNumber}
//                       </h4>
//                       <div className="flex items-center space-x-4">
//                         {group.subquestions.length > 0 && (
//                           <span className="text-sm text-gray-500">
//                             {group.subquestions.length} part{group.subquestions.length > 1 ? 's' : ''}
//                           </span>
//                         )}
//                         <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
//                           {group.subquestions.length === 0 
//                             ? `${group.maxMarks || 0} marks`
//                             : `${group.subquestions.reduce((sum, sq) => sum + (parseFloat(sq.maxMarks) || 0), 0)} marks total`
//                           }
//                         </span>
//                       </div>
//                     </div>

//                     {group.subquestions.length > 0 && (
//                       <div className="ml-4 space-y-2">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                           {group.subquestions.map((subquestion) => (
//                             <div key={subquestion.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
//                               <div className="flex items-center justify-between">
//                                 <span className="font-medium text-gray-700">
//                                   Part {subquestion.questionNumber}
//                                 </span>
//                                 <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                                   {subquestion.maxMarks || 0} marks
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Validation Alerts */}
//             <div className="mt-6">
//               {totalMarks !== parseFloat(formData.maxMarks) && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
//                   <div className="flex items-center">
//                     <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <div>
//                       <h4 className="text-red-800 font-medium">Marks Mismatch</h4>
//                       <p className="text-red-700 text-sm">
//                         Question marks total ({totalMarks}) doesn't match paper max marks ({formData.maxMarks})
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {totalMarks === parseFloat(formData.maxMarks) && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                   <div className="flex items-center">
//                     <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <div>
//                       <h4 className="text-green-800 font-medium">Ready for Submission</h4>
//                       <p className="text-green-700 text-sm">
//                         All validations passed. Question paper is ready to be uploaded.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="bg-gray-50 px-6 py-2 border-t flex items-center justify-between">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//           >
//             Back to Edit
//           </button>
          
//           <button
//             type="button"
//             onClick={onConfirm}
//             disabled={loading || totalMarks !== parseFloat(formData.maxMarks)}
//             className={`px-6 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//               loading || totalMarks !== parseFloat(formData.maxMarks)
//                 ? "bg-gray-400 text-white cursor-not-allowed"
//                 : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
//             }`}
//           >
//             {loading ? (
//               <div className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Uploading...
//               </div>
//             ) : (
//               "Confirm & Submit"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };



//?V2 simple UI

// export const QuestionPaperPreview = ({ 
//   isOpen, 
//   onClose, 
//   onConfirm, 
//   formData, 
//   questionGroups, 
//   file,
//   loading 
// }) => {
//   if (!isOpen) return null;

//   // Calculate total marks
//   const calculateTotalMarks = () => {
//     return questionGroups.reduce((total, group) => {
//       if (group.subquestions.length === 0) {
//         return total + (parseFloat(group.maxMarks) || 0);
//       } else {
//         const subquestionsTotal = group.subquestions.reduce(
//           (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
//           0
//         );
//         return total + subquestionsTotal;
//       }
//     }, 0);
//   };

//   const totalMarks = calculateTotalMarks();

//   return (
//     <div className="fixed inset-2 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-2xl w-full h-full flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-4 flex-shrink-0">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-semibold">Question Paper Preview</h2>
//               <p className="text-slate-300 text-sm mt-1">Review before submission</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {/* Paper Information - Compact */}
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 Paper Details
//               </h3>
//               <div className="flex items-center space-x-4">
//                 <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
//                   Total: {totalMarks} marks
//                 </div>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//               <div>
//                 <span className="text-gray-500 font-medium">{formData.course}</span>
//                 <p className="text-gray-900 font-semibold">{formData.subject}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500 font-medium">Code</span>
//                 <p className="text-gray-900 font-semibold">{formData.paperCode}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500 font-medium">Max Marks</span>
//                 <p className="text-gray-900 font-semibold">{formData.maxMarks}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500 font-medium">File</span>
//                 <p className="text-gray-900 font-semibold truncate">{file?.name}</p>
//               </div>
//             </div>
//           </div>

//           {/* Question Structure - Simplified */}
//           <div className="bg-white border border-gray-200 rounded-xl p-5">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//               <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Question Structure ({questionGroups.length} questions)
//             </h3>

//             {/* Questions List - Compact */}
//             <div className="space-y-3">
//               {questionGroups.map((group, index) => (
//                 <div key={group.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold">
//                         {group.questionNumber}
//                       </div>
//                       <div>
//                         <span className="font-medium text-gray-800">Question {group.questionNumber}</span>
//                         {group.subquestions.length > 0 && (
//                           <span className="text-sm text-gray-500 ml-2">
//                             ({group.subquestions.length} parts)
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
//                         {group.subquestions.length === 0 
//                           ? `${group.maxMarks || 0} marks`
//                           : `${group.subquestions.reduce((sum, sq) => sum + (parseFloat(sq.maxMarks) || 0), 0)} marks`
//                         }
//                       </span>
//                     </div>
//                   </div>

//                   {group.subquestions.length > 0 && (
//                     <div className="mt-3 ml-11">
//                       <div className="flex flex-wrap gap-2">
//                         {group.subquestions.map((subquestion) => (
//                           <div key={subquestion.id} className="bg-white border border-gray-200 rounded-md px-3 py-1 text-sm">
//                             <span className="text-gray-600">({subquestion.questionNumber})</span>
//                             <span className="text-gray-800 ml-1">{subquestion.maxMarks || 0}m</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Validation Status */}
//           <div className="mt-6">
//             {totalMarks !== parseFloat(formData.maxMarks) ? (
//               <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <div>
//                     <h4 className="text-red-800 font-medium">Marks Mismatch</h4>
//                     <p className="text-red-700 text-sm">
//                       Question total ({totalMarks}) ≠ Paper max ({formData.maxMarks})
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <div>
//                     <h4 className="text-green-800 font-medium">Ready to Submit</h4>
//                     <p className="text-green-700 text-sm">All validations passed</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="bg-gray-50 px-6 py-4 border-t flex-shrink-0">
//           <div className="flex items-center justify-between">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
//             >
//               Back to Edit
//             </button>
            
//             <button
//               type="button"
//               onClick={onConfirm}
//               disabled={loading || totalMarks !== parseFloat(formData.maxMarks)}
//               className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//                 loading || totalMarks !== parseFloat(formData.maxMarks)
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-lg hover:shadow-xl"
//               }`}
//             >
//               {loading ? (
//                 <div className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Uploading...
//                 </div>
//               ) : (
//                 "Confirm & Submit"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


//?v3 more Simple UI

export const QuestionPaperPreview = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  formData, 
  questionGroups, 
  file,
  selectedPaper,
  loading 
}) => {
  if (!isOpen) return null;

  // Calculate total marks
  const calculateTotalMarks = () => {
    return questionGroups.reduce((total, group) => {
      if (group.subquestions.length === 0) {
        return total + (parseFloat(group.maxMarks) || 0);
      } else {
        const subquestionsTotal = group.subquestions.reduce(
          (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
          0
        );
        return total + subquestionsTotal;
      }
    }, 0);
  };

  const totalMarks = calculateTotalMarks();

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Paper Fragmentation Preview</h2>
              <p className="text-sm text-gray-500">Review and confirm submission</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                {totalMarks} marks
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Paper Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium">Code</div>
                <div className="text-gray-900 font-medium mt-1">{selectedPaper.paperCode}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium">Subject</div>
                <div className="text-gray-900 font-medium mt-1">{selectedPaper.subject}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium">Title</div>
                <div className="text-gray-900 font-medium mt-1">{selectedPaper?.title || "Untitled"}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium">Max Marks</div>
                <div className="text-gray-900 font-medium mt-1">{selectedPaper?.maxMarks}</div>
              </div>
            </div>
          </div>

          {/* Question Structure */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900">Questions ({questionGroups.length})</h3>
            </div>

            <div className="space-y-2">
              {questionGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {group.questionNumber}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-900 font-medium">Question {group.questionNumber}</span>
                      {group.subquestions.length > 0 && (
                        <span className="text-gray-500 ml-1">• {group.subquestions.length} parts</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {group.subquestions.length > 0 && (
                      <div className="flex space-x-1">
                        {group.subquestions.map((sq) => (
                          <span key={sq.id} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            <span className="text-gray-700 font-semibold">{sq.questionNumber}</span>: {sq.maxMarks}m
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {group.subquestions.length === 0 
                        ? `${group.maxMarks || 0} marks`
                        : `${group.subquestions.reduce((sum, sq) => sum + (parseFloat(sq.maxMarks) || 0), 0)} marks`
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Status */}
          {totalMarks !== parseFloat(formData.maxMarks) ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800">
                  Marks don't match: {totalMarks} ≠ {formData.maxMarks}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800">Ready to submit</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading || totalMarks !== parseFloat(formData.maxMarks)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                loading || totalMarks !== parseFloat(formData.maxMarks)
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};