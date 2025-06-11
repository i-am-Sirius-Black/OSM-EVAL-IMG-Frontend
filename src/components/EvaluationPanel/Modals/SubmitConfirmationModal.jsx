//*With NA functionality

// import React from 'react';

// const SubmitConfirmationModal = ({ isOpen, onClose, onConfirm, marks, questions, isReevaluation }) => {
//   if (!isOpen) return null;

//   // Group questions by the numeric part of qNo (1a, 1b -> group 1)
//   const groups = questions.reduce((acc, q) => {
//     const groupNum = q.qNo.match(/^\d+/)[0]; // Extract the numeric part
//     if (!acc[groupNum]) acc[groupNum] = [];
//     acc[groupNum].push(q);
//     return acc;
//   }, {});

//   // Calculate total marks, excluding NA values
//   const totalMarks = Object.values(marks).reduce(
//     (sum, mark) => sum + (mark === "NA" ? 0 : (Number(mark) || 0)),
//     0
//   );

//   // Calculate max marks from all questions
//   const maxTotalMarks = questions.reduce(
//     (sum, q) => sum + q.maxMark,
//     0
//   );

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         {/* Background overlay */}
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
//           onClick={onClose}
//         ></div>

//         {/* Modal container */}
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                 <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Review Evaluation Marks
//                 </h3>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500 capitalize">
//                     Review before final submission. <span className='font-bold'>Total score:</span> <span className="font-bold text-blue-700">{totalMarks.toFixed(1)} / {maxTotalMarks.toFixed(1)}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Review table */}
//             <div className="mt-4 max-h-96 overflow-y-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Question
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Marks
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-red-500 uppercase tracking-wider">
//                       Max
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {Object.entries(groups).map(([groupNum, groupQuestions]) => {
//                     // Calculate group total marks, excluding NA values
//                     const groupTotal = groupQuestions.reduce(
//                       (sum, q) => sum + (marks[q.qNo] === "NA" ? 0 : (Number(marks[q.qNo]) || 0)),
//                       0
//                     );
//                     const groupMax = groupQuestions.reduce(
//                       (sum, q) => sum + q.maxMark,
//                       0
//                     );

//                     return (
//                       <React.Fragment key={groupNum}>
//                         <tr className="bg-gray-50">
//                           <td colSpan="3" className="px-3 py-2">
//                             <div className="font-medium text-sm text-gray-700">Section {groupNum}</div>
//                           </td>
//                         </tr>
//                         {groupQuestions.map((q) => (
//                           <tr
//                             key={q.sno}
//                             className={`hover:bg-gray-50 ${marks[q.qNo] === "NA" ? "text-gray-400" : ""}`}
//                           >
//                             <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
//                               {q.qNo}
//                             </td>
//                             <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
//                               {marks[q.qNo] === "NA" ? (
//                                 <span className="text-gray-400 italic">Not Attempted</span>
//                               ) : (
//                                 marks[q.qNo] || 0
//                               )}
//                             </td>
//                             <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                               {q.maxMark}
//                             </td>
//                           </tr>
//                         ))}
//                         <tr className="bg-gray-50">
//                           <td className="px-3 py-2 text-sm text-gray-600">Subtotal</td>
//                           <td className="px-3 py-2 text-sm text-right font-medium text-gray-900">{groupTotal.toFixed(1)}</td>
//                           <td className="px-3 py-2 text-sm text-right text-gray-500">{groupMax.toFixed(1)}</td>
//                         </tr>
//                       </React.Fragment>
//                     );
//                   })}
//                   <tr className="bg-blue-50">
//                     <td className="px-3 py-3 text-sm font-medium text-blue-800">Total</td>
//                     <td className="px-3 py-3 text-sm text-right font-bold text-blue-800">{totalMarks.toFixed(1)}</td>
//                     <td className="px-3 py-3 text-sm text-right font-medium text-blue-600">{maxTotalMarks.toFixed(1)}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             <button
//               type="button"
//               onClick={onConfirm}
//               className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               {isReevaluation ? 'Submit Reevaluation' : 'Submit Evaluation'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               Review Again
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmitConfirmationModal;

//?WIth ChoiceBased Questions and NA functionality
// import React from 'react';

// const SubmitConfirmationModal = ({ isOpen, onClose, onConfirm, marks, questions, isReevaluation }) => {
//   if (!isOpen) return null;

//   // Group questions by the numeric part of qNo (1a, 1b -> group 1)
//   const groups = questions.reduce((acc, q) => {
//     const groupNum = q.qNo.match(/^\d+/)[0]; // Extract the numeric part
//     if (!acc[groupNum]) acc[groupNum] = [];
//     acc[groupNum].push(q);
//     return acc;
//   }, {});

//   // Calculate total marks considering choice-based questions and NA values
//   const totalMarks = Object.entries(groups).reduce((total, [groupNum, groupQuestions]) => {
//     let groupTotal = 0;

//     // Find choice-based questions in this group
//     const choiceBasedQuestions = groupQuestions.filter(q => q.isChoiceBased && q.hasParts);
//     const regularQuestions = groupQuestions.filter(q => !q.isChoiceBased || !q.hasParts);

//     // Handle regular questions first
//     for (const q of regularQuestions) {
//       if (!q.hasParts) {
//         // Single question
//         const mark = marks[q.qNo];
//         if (mark !== "NA" && mark !== undefined && mark !== "") {
//           groupTotal += Number(mark) || 0;
//         }
//       } else {
//         // Regular question with parts
//         const letters = 'abcdefghijklmnopqrstuvwxyz';

//         for (let i = 0; i < q.partsCount; i++) {
//           const partQNo = `${q.qNo}${letters[i]}`;
//           const mark = marks[partQNo];

//           if (mark !== "NA" && mark !== undefined && mark !== "") {
//             groupTotal += Number(mark) || 0;
//           }
//         }
//       }
//     }

//     // Handle choice-based questions
//     for (const q of choiceBasedQuestions) {
//       const letters = 'abcdefghijklmnopqrstuvwxyz';
//       const partMarks = [];

//       // Collect all marked parts
//       for (let i = 0; i < q.partsCount; i++) {
//         const partQNo = `${q.qNo}${letters[i]}`;
//         const mark = marks[partQNo];

//         if (mark !== "NA" && mark !== undefined && mark !== "") {
//           partMarks.push(Number(mark) || 0);
//         }
//       }

//       // Take highest X marks (where X is choiceAttemptCount)
//       if (partMarks.length > 0) {
//         partMarks.sort((a, b) => b - a);
//         const choiceCount = Math.min(q.choiceAttemptCount, partMarks.length);

//         for (let i = 0; i < choiceCount; i++) {
//           groupTotal += partMarks[i];
//         }
//       }
//     }

//     return total + groupTotal;
//   }, 0);

//   // Calculate max marks from all questions
//   const maxTotalMarks = questions.reduce(
//     (sum, q) => sum + q.maxMark,
//     0
//   );

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         {/* Background overlay */}
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
//           onClick={onClose}
//         ></div>

//         {/* Modal container */}
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                 <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Review Evaluation Marks
//                 </h3>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500 capitalize">
//                     Review before final submission. <span className='font-bold'>Total score:</span> <span className="font-bold text-blue-700">{totalMarks.toFixed(1)} / {maxTotalMarks.toFixed(1)}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Review table */}
//             <div className="mt-4 max-h-96 overflow-y-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 sticky top-0 z-10">
//                   <tr>
//                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Question
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Marks
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-red-500 uppercase tracking-wider">
//                       Max
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {Object.entries(groups).map(([groupNum, groupQuestions]) => {
//                     // Find choice-based questions in this group
//                     const choiceBasedQuestions = groupQuestions.filter(q => q.isChoiceBased && q.hasParts);
//                     const regularQuestions = groupQuestions.filter(q => !q.isChoiceBased || !q.hasParts);

//                     // Calculate group total considering choice-based questions
//                     let groupTotal = 0;

//                     // Regular questions
//                     for (const q of regularQuestions) {
//                       if (!q.hasParts) {
//                         const mark = marks[q.qNo];
//                         if (mark !== "NA" && mark !== undefined && mark !== "") {
//                           groupTotal += Number(mark) || 0;
//                         }
//                       } else {
//                         const letters = 'abcdefghijklmnopqrstuvwxyz';
//                         for (let i = 0; i < q.partsCount; i++) {
//                           const partQNo = `${q.qNo}${letters[i]}`;
//                           const mark = marks[partQNo];
//                           if (mark !== "NA" && mark !== undefined && mark !== "") {
//                             groupTotal += Number(mark) || 0;
//                           }
//                         }
//                       }
//                     }

//                     // Choice-based questions
//                     for (const q of choiceBasedQuestions) {
//                       const letters = 'abcdefghijklmnopqrstuvwxyz';
//                       const partMarks = [];

//                       for (let i = 0; i < q.partsCount; i++) {
//                         const partQNo = `${q.qNo}${letters[i]}`;
//                         const mark = marks[partQNo];
//                         if (mark !== "NA" && mark !== undefined && mark !== "") {
//                           partMarks.push(Number(mark) || 0);
//                         }
//                       }

//                       if (partMarks.length > 0) {
//                         partMarks.sort((a, b) => b - a);
//                         const choiceCount = Math.min(q.choiceAttemptCount, partMarks.length);
//                         for (let i = 0; i < choiceCount; i++) {
//                           groupTotal += partMarks[i];
//                         }
//                       }
//                     }

//                     const groupMax = groupQuestions.reduce(
//                       (sum, q) => sum + q.maxMark,
//                       0
//                     );

//                     return (
//                       <React.Fragment key={groupNum}>
//                         <tr className="bg-gray-50">
//                           <td colSpan="3" className="px-3 py-2">
//                             <div className="font-medium text-sm text-gray-700">Section {groupNum}</div>
//                           </td>
//                         </tr>
//                         {groupQuestions.map((q) => {
//                           // For choice-based questions, add a note
//                           const isChoiceBased = q.isChoiceBased && q.hasParts;

//                           return (
//                             <tr
//                               key={q.sno}
//                               className={`hover:bg-gray-50 ${
//                                 marks[q.qNo] === "NA" ? "text-gray-400" : ""
//                               } ${isChoiceBased ? "bg-yellow-50" : ""}`}
//                             >
//                               <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
//                                 <div className="flex items-center">
//                                   <span>{q.qNo}</span>
//                                   {isChoiceBased && (
//                                     <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
//                                       Choice {q.choiceAttemptCount}/{q.partsCount}
//                                     </span>
//                                   )}
//                                 </div>
//                               </td>
//                               <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
//                                 {marks[q.qNo] === "NA" ? (
//                                   <span className="text-gray-400 italic">Not Attempted</span>
//                                 ) : isChoiceBased ? (
//                                   <span className="text-yellow-700 italic">Choice-based</span>
//                                 ) : (
//                                   marks[q.qNo] || 0
//                                 )}
//                               </td>
//                               <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                                 {q.maxMark}
//                               </td>
//                             </tr>
//                           );
//                         })}
//                         <tr className="bg-gray-50">
//                           <td className="px-3 py-2 text-sm text-gray-600">Subtotal</td>
//                           <td className="px-3 py-2 text-sm text-right font-medium text-gray-900">{groupTotal.toFixed(1)}</td>
//                           <td className="px-3 py-2 text-sm text-right text-gray-500">{groupMax.toFixed(1)}</td>
//                         </tr>
//                       </React.Fragment>
//                     );
//                   })}
//                   <tr className="bg-blue-50">
//                     <td className="px-3 py-3 text-sm font-medium text-blue-800">Total</td>
//                     <td className="px-3 py-3 text-sm text-right font-bold text-blue-800">{totalMarks.toFixed(1)}</td>
//                     <td className="px-3 py-3 text-sm text-right font-medium text-blue-600">{maxTotalMarks.toFixed(1)}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             <button
//               type="button"
//               onClick={onConfirm}
//               className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               {isReevaluation ? 'Submit Reevaluation' : 'Submit Evaluation'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               Review Again
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmitConfirmationModal;

//?without na functionality

// import React from 'react';

// const SubmitConfirmationModal = ({ isOpen, onClose, onConfirm, marks, questions, isReevaluation, obtMarks, maxTotalMarks }) => {
//   if (!isOpen) return null;

//   console.log("questions received in SubmitConfirmationModal:", questions);

//   // Group questions by the numeric part of qNo (1a, 1b -> group 1)
//   const groups = questions.reduce((acc, q) => {
//     const groupNum = q.qNo.match(/^\d+/)[0]; // Extract the numeric part
//     if (!acc[groupNum]) acc[groupNum] = [];
//     acc[groupNum].push(q);
//     return acc;
//   }, {});

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         {/* Background overlay */}
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
//           onClick={onClose}
//         ></div>

//         {/* Modal container */}
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                 <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Review Evaluation Marks
//                 </h3>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500 capitalize">
//                     Review before final submission. <span className='font-bold'>Total score:</span> <span className="font-bold text-blue-700">{obtMarks.toFixed(1)} / {maxTotalMarks.toFixed(1)}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Review table */}
//             <div className="mt-4 max-h-96 overflow-y-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 sticky top-0 z-10">
//                   <tr>
//                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Question
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Marks
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-red-500 uppercase tracking-wider">
//                       Max
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {Object.entries(groups).map(([groupNum, groupQuestions]) => {
//                     // Find choice-based questions in this group
//                     const choiceBasedQuestions = groupQuestions.filter(q => q.isChoiceBased && q.hasParts);
//                     const regularQuestions = groupQuestions.filter(q => !q.isChoiceBased || !q.hasParts);

//                     // Calculate group total considering choice-based questions
//                     let groupTotal = 0;

//                     // Regular questions
//                     for (const q of regularQuestions) {
//                       if (!q.hasParts) {
//                         const mark = marks[q.qNo];
//                         if (mark !== undefined && mark !== "") {
//                           groupTotal += Number(mark) || 0;
//                         }
//                       } else {
//                         const letters = 'abcdefghijklmnopqrstuvwxyz';
//                         for (let i = 0; i < q.partsCount; i++) {
//                           const partQNo = `${q.qNo}${letters[i]}`;
//                           const mark = marks[partQNo];
//                           if (mark !== undefined && mark !== "") {
//                             groupTotal += Number(mark) || 0;
//                           }
//                         }
//                       }
//                     }

//                     // Choice-based questions
//                     for (const q of choiceBasedQuestions) {
//                       const letters = 'abcdefghijklmnopqrstuvwxyz';
//                       const partMarks = [];

//                       for (let i = 0; i < q.partsCount; i++) {
//                         const partQNo = `${q.qNo}${letters[i]}`;
//                         const mark = marks[partQNo];
//                         if (mark !== undefined && mark !== "") {
//                           partMarks.push(Number(mark) || 0);
//                         }
//                       }

//                       if (partMarks.length > 0) {
//                         partMarks.sort((a, b) => b - a);
//                         const choiceCount = Math.min(q.choiceAttemptCount, partMarks.length);
//                         for (let i = 0; i < choiceCount; i++) {
//                           groupTotal += partMarks[i];
//                         }
//                       }
//                     }

//                     const groupMax = groupQuestions.reduce(
//                       (sum, q) => sum + q.maxMark,
//                       0
//                     );

//                     return (
//                       <React.Fragment key={groupNum}>
//                         <tr className="bg-blue-100">
//                           <td colSpan="3" className="px-3 py-2">
//                             <div className="font-medium text-sm text-gray-700">Question {groupNum}</div>

//                           </td>
//                         </tr>
//                         {groupQuestions.map((q) => {
//                           // For choice-based questions, add a note
//                           const isChoiceBased = q.isChoiceBased && q.hasParts;

//                           // Check if question is attempted
//                           const isAttempted = q.hasParts
//                             ? false // For questions with parts, we show individual parts
//                             : marks[q.qNo] !== undefined && marks[q.qNo] !== "";

//                           // For questions with parts, show parts only
//                           if (q.hasParts) {
//                             if (isChoiceBased) {
//                               // Show the main choice-based question
//                               const letters = 'abcdefghijklmnopqrstuvwxyz';
//                               const markedParts = [];

//                               // Collect all marked parts
//                               for (let i = 0; i < q.partsCount; i++) {
//                                 const partQNo = `${q.qNo}${letters[i]}`;
//                                 const mark = marks[partQNo];
//                                 if (mark !== undefined && mark !== "") {
//                                   markedParts.push({
//                                     qNo: partQNo,
//                                     mark: mark
//                                   });
//                                 }
//                               }

//                               return (
//                                 <React.Fragment key={q.sno}>
//                                   <tr className="bg-yellow-50">
//                                     <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
//                                       <div className="flex items-center">
//                                         <span>{q.qNo}</span>
//                                         <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
//                                           Choice {q.choiceAttemptCount}/{q.partsCount}
//                                         </span>
//                                       </div>
//                                     </td>
//                                     <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
//                                       <span className="text-yellow-700 italic">
//                                         {markedParts.length > 0
//                                           ? `${markedParts.length} part${markedParts.length !== 1 ? 's' : ''} marked`
//                                           : 'Not attempted'}
//                                       </span>
//                                     </td>
//                                     <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                                       {q.maxMark}
//                                     </td>
//                                   </tr>

//                                   {/* Show marked parts */}
//                                   {markedParts.map(part => (
//                                     <tr key={part.qNo} className="bg-yellow-50/50">
//                                       <td className="px-3 py-1 pl-6 whitespace-nowrap text-xs text-gray-600">
//                                         {part.qNo}
//                                       </td>
//                                       <td className="px-3 py-1 whitespace-nowrap text-xs text-right font-medium">
//                                         {part.mark}
//                                       </td>
//                                       <td className="px-3 py-1 whitespace-nowrap text-xs text-right text-gray-500">
//                                         {q.partMarks || (q.maxMark / q.partsCount).toFixed(1)}
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </React.Fragment>
//                               );
//                             } else {
//                               // Regular question with parts - handle each part
//                               const letters = 'abcdefghijklmnopqrstuvwxyz';
//                               return (
//                                 <React.Fragment key={q.sno}>
//                                   <tr>
//                                     <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
//                                       {q.qNo}
//                                     </td>
//                                     <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
//                                       {/* Empty cell for main question */}
//                                     </td>
//                                     <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                                       {q.maxMark}
//                                     </td>
//                                   </tr>

//                                   {/* Show parts */}
//                                   {Array.from({length: q.partsCount}, (_, i) => {
//                                     const partQNo = `${q.qNo}${letters[i]}`;
//                                     const mark = marks[partQNo];
//                                     const isPartAttempted = mark !== undefined && mark !== "";

//                                     return (
//                                       <tr key={partQNo} className="bg-gray-50/30">
//                                         <td className="px-3 py-1 pl-6 whitespace-nowrap text-xs text-gray-600">
//                                           {partQNo}
//                                         </td>
//                                         <td className="px-3 py-1 whitespace-nowrap text-xs text-right font-medium">
//                                           {isPartAttempted ? mark : (
//                                             <span className="text-gray-400 italic">Not attempted</span>
//                                           )}
//                                         </td>
//                                         <td className="px-3 py-1 whitespace-nowrap text-xs text-right text-gray-500">
//                                           {q.partMarks || (q.maxMark / q.partsCount).toFixed(1)}
//                                         </td>
//                                       </tr>
//                                     );
//                                   })}
//                                 </React.Fragment>
//                               );
//                             }
//                           } else {
//                             // Regular question without parts
//                             return (
//                               <tr key={q.sno} className="hover:bg-gray-50">
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
//                                   {q.qNo}
//                                 </td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
//                                   {isAttempted ? marks[q.qNo] : (
//                                     <span className="text-gray-400 italic">Not attempted</span>
//                                   )}
//                                 </td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                                   {q.maxMark}
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         })}
//                         <tr className="bg-gray-50">
//                           <td className="px-3 py-2 text-sm text-gray-600">Subtotal</td>
//                           <td className="px-3 py-2 text-sm text-right font-medium text-gray-900">{groupTotal.toFixed(1)}</td>
//                           <td className="px-3 py-2 text-sm text-right text-gray-500">{groupMax.toFixed(1)}</td>
//                         </tr>
//                       </React.Fragment>
//                     );
//                   })}
//                   <tr className="bg-blue-50">
//                     <td className="px-3 py-3 text-sm font-medium text-blue-800">Total</td>
//                     <td className="px-3 py-3 text-sm text-right font-bold text-blue-800">{obtMarks.toFixed(1)}</td>
//                     <td className="px-3 py-3 text-sm text-right font-medium text-blue-600">{maxTotalMarks.toFixed(1)}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             <button
//               type="button"
//               onClick={onConfirm}
//               className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               {isReevaluation ? 'Submit Reevaluation' : 'Submit Evaluation'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               Review Again
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmitConfirmationModal;

//?v2- simplified version without NA functionality (cleaned up)

// import React from 'react';

// const SubmitConfirmationModal = ({ isOpen, onClose, onConfirm, marks, questions, isReevaluation, obtMarks, maxTotalMarks }) => {
//   if (!isOpen) return null;

//   // Group questions by the numeric part of qNo (1a, 1b -> group 1)
//   const groups = questions.reduce((acc, q) => {
//     const groupNum = q.qNo.match(/^\d+/)[0];
//     if (!acc[groupNum]) acc[groupNum] = [];
//     acc[groupNum].push(q);
//     return acc;
//   }, {});

//   // Helper function to get mark value
//   const getMark = (qNo) => {
//     const mark = marks[qNo];
//     return mark !== undefined && mark !== "" ? Number(mark) || 0 : null;
//   };

//   // Helper function to render question row
//   const renderQuestionRow = (q, isSubQuestion = false) => {
//     const mark = getMark(q.qNo);
//     const isAttempted = mark !== null;

//     return (
//       <tr key={q.qNo} className={isSubQuestion ? "bg-gray-50/30" : "hover:bg-gray-50"}>
//         <td className={`px-3 py-2 whitespace-nowrap text-sm ${isSubQuestion ? 'pl-6 text-xs text-gray-600' : 'text-gray-600'}`}>
//           <div className="flex items-center gap-2">
//             Question <span>{q.qNo}</span>
//             {!isSubQuestion && q.isChoiceBased && q.hasParts && (
//               <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
//                 Choice {q.choiceAttemptCount}/{q.partsCount}
//               </span>
//             )}
//           </div>
//         </td>
//         <td className={`px-3 py-2 whitespace-nowrap ${isSubQuestion ? 'text-xs' : 'text-sm'} text-right font-medium`}>
//           {isAttempted ? mark : (
//             <span className="text-gray-400 italic">Not attempted</span>
//           )}
//         </td>
//         <td className={`px-3 py-2 whitespace-nowrap ${isSubQuestion ? 'text-xs' : 'text-sm'} text-right text-gray-500`}>
//           {isSubQuestion ? (q.partMarks || (q.maxMark / q.partsCount).toFixed(1)) : q.maxMark}
//         </td>
//       </tr>
//     );
//   };

//   // Helper function to calculate group total
//   const calculateGroupTotal = (groupQuestions) => {
//     let total = 0;

//     groupQuestions.forEach(q => {
//       if (!q.hasParts) {
//         // Simple question without parts
//         const mark = getMark(q.qNo);
//         if (mark !== null) total += mark;
//       } else if (q.isChoiceBased) {
//         // Choice-based question with parts
//         const letters = 'abcdefghijklmnopqrstuvwxyz';
//         const partMarks = [];

//         for (let i = 0; i < q.partsCount; i++) {
//           const partQNo = `${q.qNo}${letters[i]}`;
//           const mark = getMark(partQNo);
//           if (mark !== null) partMarks.push(mark);
//         }

//         if (partMarks.length > 0) {
//           partMarks.sort((a, b) => b - a);
//           const choiceCount = Math.min(q.choiceAttemptCount, partMarks.length);
//           for (let i = 0; i < choiceCount; i++) {
//             total += partMarks[i];
//           }
//         }
//       } else {
//         // Regular question with parts
//         const letters = 'abcdefghijklmnopqrstuvwxyz';
//         for (let i = 0; i < q.partsCount; i++) {
//           const partQNo = `${q.qNo}${letters[i]}`;
//           const mark = getMark(partQNo);
//           if (mark !== null) total += mark;
//         }
//       }
//     });

//     return total;
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         {/* Background overlay */}
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
//           onClick={onClose}
//         ></div>

//         {/* Modal container */}
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                 <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Review Evaluation Marks
//                 </h3>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500 capitalize">
//                     Review before final submission. <span className='font-bold'>Total score:</span> <span className="font-bold text-blue-700">{obtMarks.toFixed(1)} / {maxTotalMarks.toFixed(1)}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Review table */}
//             <div className="mt-4 max-h-96 overflow-y-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 sticky top-0 z-10">
//                   <tr>
//                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Question
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Marks
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-red-500 uppercase tracking-wider">
//                       Max
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {Object.entries(groups).map(([groupNum, groupQuestions]) => {
//                     const groupTotal = calculateGroupTotal(groupQuestions);
//                     const groupMax = groupQuestions.reduce((sum, q) => sum + q.maxMark, 0);

//                     return (
//                       <React.Fragment key={groupNum}>

//                         {/* Render questions */}
//                         {groupQuestions.map((q) => {
//                           const rows = [];

//                           if (!q.hasParts) {
//                             // Simple question without parts
//                             rows.push(renderQuestionRow(q));
//                           } else {
//                             // Question with parts - show main question first
//                             rows.push(
//                               <tr key={q.qNo} className={q.isChoiceBased ? "bg-yellow-50" : "bg-blue-50"}>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
//                                   <div className="flex items-center gap-2">
//                                     Question <span>{q.qNo}</span>
//                                     {q.isChoiceBased && (
//                                       <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
//                                         Choice {q.choiceAttemptCount}/{q.partsCount}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
//                                   {q.isChoiceBased ? (
//                                     <span className="text-yellow-700 italic">
//                                       {(() => {
//                                         const letters = 'abcdefghijklmnopqrstuvwxyz';
//                                         let markedCount = 0;
//                                         for (let i = 0; i < q.partsCount; i++) {
//                                           const partQNo = `${q.qNo}${letters[i]}`;
//                                           if (getMark(partQNo) !== null) markedCount++;
//                                         }
//                                         return markedCount > 0
//                                           ? `${markedCount} part${markedCount !== 1 ? 's' : ''} marked`
//                                           : 'Not attempted';
//                                       })()}
//                                     </span>
//                                   ) : ''}
//                                 </td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                                   {q.maxMark}
//                                 </td>
//                               </tr>
//                             );

//                             // Show parts
//                             const letters = 'abcdefghijklmnopqrstuvwxyz';
//                             for (let i = 0; i < q.partsCount; i++) {
//                               const partQNo = `${q.qNo}${letters[i]}`;
//                               const partQuestion = { ...q, qNo: partQNo };

//                               // For choice-based questions, only show marked parts
//                               if (q.isChoiceBased) {
//                                 if (getMark(partQNo) !== null) {
//                                   rows.push(
//                                     <tr key={partQNo} className="bg-yellow-50/50">
//                                       <td className="px-3 py-1 pl-6 whitespace-nowrap text-xs text-gray-600">
//                                         {partQNo}
//                                       </td>
//                                       <td className="px-3 py-1 whitespace-nowrap text-xs text-right font-medium">
//                                         {getMark(partQNo)}
//                                       </td>
//                                       <td className="px-3 py-1 whitespace-nowrap text-xs text-right text-gray-500">
//                                         {q.partMarks || (q.maxMark / q.partsCount).toFixed(1)}
//                                       </td>
//                                     </tr>
//                                   );
//                                 }
//                               } else {
//                                 // For regular questions, show all parts
//                                 rows.push(renderQuestionRow(partQuestion, true));
//                               }
//                             }
//                           }

//                           return rows;
//                         })}

//                         {/* Group subtotal */}
//                         <tr className="bg-gray-50">
//                           <td className="px-3 py-2 text-sm text-gray-600">Subtotal</td>
//                           <td className="px-3 py-2 text-sm text-right font-medium text-gray-900">{groupTotal.toFixed(1)}</td>
//                           <td className="px-3 py-2 text-sm text-right text-gray-500">{groupMax.toFixed(1)}</td>
//                         </tr>
//                       </React.Fragment>
//                     );
//                   })}

//                   {/* Final total */}
//                   <tr className="bg-blue-50">
//                     <td className="px-3 py-3 text-sm font-medium text-blue-800">Total</td>
//                     <td className="px-3 py-3 text-sm text-right font-bold text-blue-800">{obtMarks.toFixed(1)}</td>
//                     <td className="px-3 py-3 text-sm text-right font-medium text-blue-600">{maxTotalMarks.toFixed(1)}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             <button
//               type="button"
//               onClick={onConfirm}
//               className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               {isReevaluation ? 'Submit Reevaluation' : 'Submit Evaluation'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               Review Again
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmitConfirmationModal;

//?v3- simplified version without NA functionality (cleaned up)

// import React from 'react';

// const SubmitConfirmationModal = ({ isOpen, onClose, onConfirm, marks, questions, isReevaluation, obtMarks, maxTotalMarks }) => {
//   if (!isOpen) return null;

//   // Group questions by the numeric part of qNo
//   const groups = questions.reduce((acc, q) => {
//     const groupNum = q.qNo.match(/^\d+/)[0];
//     if (!acc[groupNum]) acc[groupNum] = [];
//     acc[groupNum].push(q);
//     return acc;
//   }, {});

//   // Helper to get mark value
//   const getMark = (qNo) => {
//     const mark = marks[qNo];
//     return mark !== undefined && mark !== "" ? Number(mark) || 0 : null;
//   };

//   // Calculate choice-based question total
//   const getChoiceTotal = (q) => {
//     const letters = 'abcdefghijklmnopqrstuvwxyz';
//     const partMarks = [];

//     for (let i = 0; i < q.partsCount; i++) {
//       const partQNo = `${q.qNo}${letters[i]}`;
//       const mark = getMark(partQNo);
//       if (mark !== null) partMarks.push(mark);
//     }

//     if (partMarks.length === 0) return 0;

//     partMarks.sort((a, b) => b - a);
//     const choiceCount = Math.min(q.choiceAttemptCount, partMarks.length);
//     return partMarks.slice(0, choiceCount).reduce((sum, mark) => sum + mark, 0);
//   };

//   // Calculate group total
//   const calculateGroupTotal = (groupQuestions) => {
//     return groupQuestions.reduce((total, q) => {
//       if (!q.hasParts) {
//         const mark = getMark(q.qNo);
//         return total + (mark || 0);
//       } else if (q.isChoiceBased) {
//         return total + getChoiceTotal(q);
//       } else {
//         // Regular question with parts
//         const letters = 'abcdefghijklmnopqrstuvwxyz';
//         let partTotal = 0;
//         for (let i = 0; i < q.partsCount; i++) {
//           const partQNo = `${q.qNo}${letters[i]}`;
//           const mark = getMark(partQNo);
//           partTotal += mark || 0;
//         }
//         return total + partTotal;
//       }
//     }, 0);
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         {/* Background overlay */}
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
//           onClick={onClose}
//         />

//         {/* Modal container */}
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                 <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Review Evaluation Marks
//                 </h3>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500">
//                     Review before final submission. <span className='font-medium'>Total score:</span> <span className="font-medium text-blue-600">{obtMarks.toFixed(1)} / {maxTotalMarks.toFixed(1)}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Review table */}
//             <div className="mt-4 max-h-96 overflow-y-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 sticky top-0 z-10">
//                   <tr>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Question
//                     </th>
//                     <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Marks
//                     </th>
//                     <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Max
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {Object.entries(groups).map(([groupNum, groupQuestions]) => {
//                     const groupTotal = calculateGroupTotal(groupQuestions);
//                     const groupMax = groupQuestions.reduce((sum, q) => sum + q.maxMark, 0);

//                     return (
//                       <React.Fragment key={groupNum}>
//                         {/* Group header */}
//                         <tr className="bg-gray-50">
//                           <td colSpan="3" className="px-3 py-2">
//                             <div className="text-sm font-medium text-gray-700">Question {groupNum}</div>
//                           </td>
//                         </tr>

//                         {/* Questions */}
//                         {groupQuestions.map((q) => {
//                           const questionRows = [];

//                           if (!q.hasParts) {
//                             // Simple question without parts
//                             const mark = getMark(q.qNo);
//                             questionRows.push(
//                               <tr key={q.qNo} className="hover:bg-gray-50">
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
//                                   {q.qNo}
//                                 </td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
//                                   {mark !== null ? mark : (
//                                     <span className="text-gray-400 italic">Not attempted</span>
//                                   )}
//                                 </td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                                   {q.maxMark}
//                                 </td>
//                               </tr>
//                             );
//                           } else if (q.isChoiceBased) {
//                             // Choice-based question - show main question and marked parts
//                             const letters = 'abcdefghijklmnopqrstuvwxyz';
//                             const markedParts = [];

//                             for (let i = 0; i < q.partsCount; i++) {
//                               const partQNo = `${q.qNo}${letters[i]}`;
//                               const mark = getMark(partQNo);
//                               if (mark !== null) {
//                                 markedParts.push({ qNo: partQNo, mark });
//                               }
//                             }

//                             const choiceTotal = getChoiceTotal(q);

//                             // Main question row
//                             questionRows.push(
//                               <tr key={q.qNo} className="bg-amber-50">
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
//                                   <div className="flex items-center gap-2">
//                                     <span>{q.qNo}</span>
//                                     <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
//                                       Choice {q.choiceAttemptCount}/{q.partsCount} • {markedParts.length} marked
//                                     </span>
//                                   </div>
//                                 </td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium text-amber-700">
//                                   {markedParts.length > 0 ? choiceTotal.toFixed(1) : (
//                                     <span className="text-gray-400 italic">Not attempted</span>
//                                   )}
//                                 </td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                                   {q.maxMark}
//                                 </td>
//                               </tr>
//                             );

//                             // Show marked parts
//                             markedParts.forEach((part, index) => {
//                               const isCountedTowardTotal = index < q.choiceAttemptCount;
//                               questionRows.push(
//                                 <tr key={part.qNo} className="bg-amber-25">
//                                   <td className="px-3 py-1 pl-6 whitespace-nowrap text-xs text-gray-600">
//                                     {part.qNo}
//                                   </td>
//                                   <td className="px-3 py-1 whitespace-nowrap text-xs text-right">
//                                     <span className={isCountedTowardTotal ? 'text-green-600 font-medium' : 'text-gray-400 line-through'}>
//                                       {part.mark}
//                                     </span>
//                                   </td>
//                                   <td className="px-3 py-1 whitespace-nowrap text-xs text-right text-gray-400">
//                                     {q.partMarks || (q.maxMark / q.partsCount).toFixed(1)}
//                                   </td>
//                                 </tr>
//                               );
//                             });
//                           } else {
//                             // Regular question with parts - show all parts
//                             const letters = 'abcdefghijklmnopqrstuvwxyz';

//                             // Main question row
//                             questionRows.push(
//                               <tr key={q.qNo} className="bg-blue-50">
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 font-medium">
//                                   {q.qNo}
//                                 </td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right"></td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                                   {q.maxMark}
//                                 </td>
//                               </tr>
//                             );

//                             // Show all parts
//                             for (let i = 0; i < q.partsCount; i++) {
//                               const partQNo = `${q.qNo}${letters[i]}`;
//                               const mark = getMark(partQNo);

//                               questionRows.push(
//                                 <tr key={partQNo} className="bg-gray-50/30">
//                                   <td className="px-3 py-1 pl-6 whitespace-nowrap text-xs text-gray-600">
//                                     {partQNo}
//                                   </td>
//                                   <td className="px-3 py-1 whitespace-nowrap text-xs text-right">
//                                     {mark !== null ? (
//                                       <span className="text-gray-800 font-medium">{mark}</span>
//                                     ) : (
//                                       <span className="text-gray-400 italic">Not attempted</span>
//                                     )}
//                                   </td>
//                                   <td className="px-3 py-1 whitespace-nowrap text-xs text-right text-gray-400">
//                                     {q.partMarks || (q.maxMark / q.partsCount).toFixed(1)}
//                                   </td>
//                                 </tr>
//                               );
//                             }
//                           }

//                           return questionRows;
//                         })}

//                         {/* Group subtotal */}
//                         <tr className="bg-gray-100 border-t border-gray-200">
//                           <td className="px-3 py-2 text-sm font-medium text-gray-700">Q{groupNum} Total</td>
//                           <td className="px-3 py-2 text-sm text-right font-bold text-gray-900">
//                             {groupTotal.toFixed(1)}
//                           </td>
//                           <td className="px-3 py-2 text-sm text-right font-medium text-gray-600">
//                             {groupMax.toFixed(1)}
//                           </td>
//                         </tr>
//                       </React.Fragment>
//                     );
//                   })}

//                   {/* Final total */}
//                   <tr className="bg-blue-50 border-t-2 border-blue-200">
//                     <td className="px-3 py-3 text-sm font-bold text-blue-800">Final Total</td>
//                     <td className="px-3 py-3 text-sm text-right font-bold text-blue-800">
//                       {obtMarks.toFixed(1)}
//                     </td>
//                     <td className="px-3 py-3 text-sm text-right font-bold text-blue-600">
//                       {maxTotalMarks.toFixed(1)}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             <button
//               type="button"
//               onClick={onConfirm}
//               className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               {isReevaluation ? 'Submit Reevaluation' : 'Submit Evaluation'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               Review Again
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmitConfirmationModal;

//?v4-> (working version with NA functionality removed, cleaned up, and optimized for readability)

import React from "react";

const SubmitConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  marks,
  questions,
  isReevaluation,
  obtMarks,
  maxTotalMarks,
}) => {
  if (!isOpen) return null;

  // Group questions by the numeric part of qNo
  const groups = questions.reduce((acc, q) => {
    const groupNum = q.qNo.match(/^\d+/)[0];
    if (!acc[groupNum]) acc[groupNum] = [];
    acc[groupNum].push(q);
    return acc;
  }, {});

  // Helper to get mark value
  const getMark = (qNo) => {
    const mark = marks[qNo];
    return mark !== undefined && mark !== "" ? Number(mark) || 0 : null;
  };

  // Calculate choice-based question total
  const getChoiceTotal = (q) => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const partMarks = [];

    for (let i = 0; i < q.partsCount; i++) {
      const partQNo = `${q.qNo}${letters[i]}`;
      const mark = getMark(partQNo);
      if (mark !== null) partMarks.push(mark);
    }

    if (partMarks.length === 0) return 0;

    partMarks.sort((a, b) => b - a);
    const choiceCount = Math.min(q.choiceAttemptCount, partMarks.length);
    return partMarks.slice(0, choiceCount).reduce((sum, mark) => sum + mark, 0);
  };

  // Calculate group total
  const calculateGroupTotal = (groupQuestions) => {
    return groupQuestions.reduce((total, q) => {
      if (!q.hasParts) {
        const mark = getMark(q.qNo);
        return total + (mark || 0);
      } else if (q.isChoiceBased) {
        return total + getChoiceTotal(q);
      } else {
        // Regular question with parts
        const letters = "abcdefghijklmnopqrstuvwxyz";
        let partTotal = 0;
        for (let i = 0; i < q.partsCount; i++) {
          const partQNo = `${q.qNo}${letters[i]}`;
          const mark = getMark(partQNo);
          partTotal += mark || 0;
        }
        return total + partTotal;
      }
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal container */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Review Evaluation Marks
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Review before final submission.{" "}
                    <span className="font-medium">Total score:</span>{" "}
                    <span className="font-medium text-blue-600">
                      {obtMarks.toFixed(1)} / {maxTotalMarks.toFixed(1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Review table */}
            <div className="mt-4 max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(groups).map(([groupNum, groupQuestions]) => {
                    const groupTotal = calculateGroupTotal(groupQuestions);
                    const groupMax = groupQuestions.reduce(
                      (sum, q) => sum + q.maxMark,
                      0
                    );

                    return (
                      <React.Fragment key={groupNum}>
                        {/* Group header */}
                        <tr className="bg-gray-50">
                          <td colSpan="3" className="px-3 py-2">
                            <div className="text-sm font-medium text-gray-800">
                              Question {groupNum}
                            </div>
                          </td>
                        </tr>

                        {/* Questions */}
                        {groupQuestions.map((q) => {
                          const questionRows = [];

                          if (!q.hasParts) {
                            // Simple question without parts
                            const mark = getMark(q.qNo);
                            questionRows.push(
                              <tr key={q.qNo} className="hover:bg-gray-50">
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                  {q.qNo}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                                  {mark !== null ? (
                                    mark
                                  ) : (
                                    <span className="text-gray-400 italic">
                                      Not attempted
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                                  {q.maxMark}
                                </td>
                              </tr>
                            );
                          } else if (q.isChoiceBased) {
                            // Choice-based question - show only marked parts directly
                            const letters = "abcdefghijklmnopqrstuvwxyz";
                            const markedParts = [];

                            for (let i = 0; i < q.partsCount; i++) {
                              const partQNo = `${q.qNo}${letters[i]}`;
                              const mark = getMark(partQNo);
                              if (mark !== null) {
                                markedParts.push({ qNo: partQNo, mark });
                              }
                            }

                            // Sort by marks to show which ones count toward total
                            markedParts.sort((a, b) => b.mark - a.mark);

                            // Show marked parts directly
                            markedParts.forEach((part, index) => {
                              const isCountedTowardTotal =
                                index < q.choiceAttemptCount;
                              questionRows.push(
                                <tr
                                  key={part.qNo}
                                  className="hover:bg-amber-50"
                                >
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                    {part.qNo}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                                    <span
                                      className={
                                        isCountedTowardTotal
                                          ? "text-green-600 font-medium"
                                          : "text-gray-400 line-through"
                                      }
                                    >
                                      {part.mark}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                                    {q.partMarks ||
                                      (q.maxMark / q.partsCount).toFixed(1)}
                                  </td>
                                </tr>
                              );
                            });

                            // Show "Not attempted" if no parts marked
                            if (markedParts.length === 0) {
                              questionRows.push(
                                <tr key={q.qNo} className="hover:bg-amber-50">
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                    {q.qNo}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                                    <span className="text-gray-400 italic">
                                      Not attempted
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                                    {q.maxMark}
                                  </td>
                                </tr>
                              );
                            }
                          } else {
                            // Regular question with parts - show main question and all parts
                            const letters = "abcdefghijklmnopqrstuvwxyz";

                            // Main question row
                            questionRows.push(
                              <tr key={q.qNo} className="bg-blue-50">
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 font-medium">
                                  {q.qNo}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-right"></td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                                  {q.maxMark}
                                </td>
                              </tr>
                            );

                            // Show all parts
                            for (let i = 0; i < q.partsCount; i++) {
                              const partQNo = `${q.qNo}${letters[i]}`;
                              const mark = getMark(partQNo);

                              questionRows.push(
                                <tr key={partQNo} className="bg-gray-50/30">
                                  <td className="px-3 py-1 pl-6 whitespace-nowrap text-xs text-gray-600">
                                    {partQNo}
                                  </td>
                                  <td className="px-3 py-1 whitespace-nowrap text-xs text-right">
                                    {mark !== null ? (
                                      <span className="text-gray-800 font-medium">
                                        {mark}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 italic">
                                        Not attempted
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-3 py-1 whitespace-nowrap text-xs text-right text-gray-400">
                                    {q.partMarks ||
                                      (q.maxMark / q.partsCount).toFixed(1)}
                                  </td>
                                </tr>
                              );
                            }
                          }

                          return questionRows;
                        })}

                        {/* Group subtotal */}
                        <tr>
                          <td colSpan="3" className="p-0">
                            <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 rounded-md mb-2">
                              <div className="flex justify-between text-sm">
                                <div className="font-medium text-gray-700">
                                  Subtotal-
                                </div>
                                <div className="font-bold text-gray-900">
                                  {groupTotal.toFixed(1)}
                                </div>
                                <div className="font-medium text-gray-600">
                                  {groupMax.toFixed(1)}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}

                  {/* Final total */}
                  <tr className="bg-blue-50 border-t-2 border-blue-200">
                    <td className="px-3 py-3 text-sm font-bold text-blue-800">
                      Final Total
                    </td>
                    <td className="px-3 py-3 text-sm text-right font-bold text-blue-800">
                      {obtMarks.toFixed(1)}
                    </td>
                    <td className="px-3 py-3 text-sm text-right font-bold text-blue-600">
                      {maxTotalMarks.toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isReevaluation ? "Submit Reevaluation" : "Submit Evaluation"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Review Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;
