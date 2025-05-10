// import React from 'react';

// const SubmitConfirmationModal = ({ isOpen, onClose, onConfirm, marks, questions }) => {
//   if (!isOpen) return null;

//   // Group questions
//   const groups = questions.reduce((acc, q) => {
//     if (!acc[q.group]) acc[q.group] = [];
//     acc[q.group].push(q);
//     return acc;
//   }, {});

//   // Calculate total marks
//   const totalMarks = Object.values(marks).reduce(
//     (sum, mark) => sum + (Number(mark) || 0),
//     0
//   );

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         {/* Background overlay */}
//         <div 
//           className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
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
//                   Review Evaluation
//                 </h3>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500">
//                     Please review the marks before final submission. Total score: <span className="font-semibold">{totalMarks}/100</span>
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
//                     <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Max
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {Object.entries(groups).map(([groupNum, groupQuestions]) => {
//                     const groupTotal = groupQuestions.reduce(
//                       (sum, q) => sum + (Number(marks[q.id]) || 0),
//                       0
//                     );
//                     const groupMax = groupQuestions.reduce(
//                       (sum, q) => sum + q.maxMarks,
//                       0
//                     );
                    
//                     return (
//                       <React.Fragment key={groupNum}>
//                         <tr className="bg-gray-50">
//                           <td colSpan="3" className="px-3 py-2">
//                             <div className="font-medium text-sm text-gray-700">Question {groupNum}</div>
//                           </td>
//                         </tr>
//                         {groupQuestions.map((q) => (
//                           <tr key={q.id} className="hover:bg-gray-50">
//                             <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
//                               {q.id}
//                             </td>
//                             <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium text-gray-900">
//                               {marks[q.id] || 0}
//                             </td>
//                             <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                               {q.maxMarks}
//                             </td>
//                           </tr>
//                         ))}
//                         <tr className="bg-gray-50">
//                           <td className="px-3 py-2 text-sm text-gray-600">Subtotal</td>
//                           <td className="px-3 py-2 text-sm text-right font-medium text-gray-900">{groupTotal}</td>
//                           <td className="px-3 py-2 text-sm text-right text-gray-500">{groupMax}</td>
//                         </tr>
//                       </React.Fragment>
//                     );
//                   })}
//                   <tr className="bg-blue-50">
//                     <td className="px-3 py-3 text-sm font-medium text-blue-800">Total</td>
//                     <td className="px-3 py-3 text-sm text-right font-bold text-blue-800">{totalMarks}</td>
//                     <td className="px-3 py-3 text-sm text-right font-medium text-blue-600">100</td>
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
//               Submit Evaluation
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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


//?v2 update to match new question data

import React from 'react';

const SubmitConfirmationModal = ({ isOpen, onClose, onConfirm, marks, questions }) => {
  if (!isOpen) return null;

  // Group questions by the numeric part of qNo (1a, 1b -> group 1)
  const groups = questions.reduce((acc, q) => {
    const groupNum = q.qNo.match(/^\d+/)[0]; // Extract the numeric part
    if (!acc[groupNum]) acc[groupNum] = [];
    acc[groupNum].push(q);
    return acc;
  }, {});

  // Calculate total marks
  const totalMarks = Object.values(marks).reduce(
    (sum, mark) => sum + (Number(mark) || 0),
    0
  );

  // Calculate max marks from all questions
  const maxTotalMarks = questions.reduce(
    (sum, q) => sum + q.maxMark,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Modal container */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Review Evaluation
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 capitalize">
                    Review before final submission. <span className='font-bold'>Total score:</span> <span className="font-bold text-blue-700">{totalMarks} / {maxTotalMarks}</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Review table */}
            <div className="mt-4 max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-red-500 uppercase tracking-wider">
                      Max
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(groups).map(([groupNum, groupQuestions]) => {
                    const groupTotal = groupQuestions.reduce(
                      (sum, q) => sum + (Number(marks[q.qNo]) || 0),
                      0
                    );
                    const groupMax = groupQuestions.reduce(
                      (sum, q) => sum + q.maxMark,
                      0
                    );
                    
                    return (
                      <React.Fragment key={groupNum}>
                        <tr className="bg-gray-50">
                          <td colSpan="3" className="px-3 py-2">
                            <div className="font-medium text-sm text-gray-700">Section {groupNum}</div>
                          </td>
                        </tr>
                        {groupQuestions.map((q) => (
                          <tr key={q.sno} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                              {q.qNo}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                              {marks[q.qNo] || 0}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                              {q.maxMark}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-600">Subtotal</td>
                          <td className="px-3 py-2 text-sm text-right font-medium text-gray-900">{groupTotal.toFixed(1)}</td>
                          <td className="px-3 py-2 text-sm text-right text-gray-500">{groupMax.toFixed(1)}</td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                  <tr className="bg-blue-50">
                    <td className="px-3 py-3 text-sm font-medium text-blue-800">Total</td>
                    <td className="px-3 py-3 text-sm text-right font-bold text-blue-800">{totalMarks.toFixed(1)}</td>
                    <td className="px-3 py-3 text-sm text-right font-medium text-blue-600">{maxTotalMarks.toFixed(1)}</td>
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
              Submit Evaluation
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


//? making collapsible question groups

// import React, { useState } from 'react';

// const SubmitConfirmationModal = ({ isOpen, onClose, onConfirm, marks, questions }) => {
//   if (!isOpen) return null;

//   // Group questions by the numeric part of qNo (1a, 1b -> group 1)
//   const groups = questions.reduce((acc, q) => {
//     const groupNum = q.qNo.match(/^\d+/)[0]; // Extract the numeric part
//     if (!acc[groupNum]) acc[groupNum] = [];
//     acc[groupNum].push(q);
//     return acc;
//   }, {});

//   // State for tracking which groups are expanded/collapsed
//   const [expandedGroups, setExpandedGroups] = useState(Object.keys(groups).reduce((acc, groupNum) => {
//     acc[groupNum] = true; // All groups expanded by default
//     return acc;
//   }, {}));

//   // Toggle group expansion
//   const toggleGroup = (groupNum) => {
//     setExpandedGroups(prev => ({
//       ...prev,
//       [groupNum]: !prev[groupNum]
//     }));
//   };

//   // Calculate total marks
//   const totalMarks = Object.values(marks).reduce(
//     (sum, mark) => sum + (Number(mark) || 0),
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
//           className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
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
//                   Review Evaluation
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
//                     const groupTotal = groupQuestions.reduce(
//                       (sum, q) => sum + (Number(marks[q.qNo]) || 0),
//                       0
//                     );
//                     const groupMax = groupQuestions.reduce(
//                       (sum, q) => sum + q.maxMark,
//                       0
//                     );
                    
//                     return (
//                       <React.Fragment key={groupNum}>
//                         <tr 
//                           className="bg-gray-50 cursor-pointer hover:bg-gray-100"
//                           onClick={() => toggleGroup(groupNum)}
//                         >
//                           <td colSpan="3" className="px-3 py-2">
//                             <div className="font-medium text-sm text-gray-700 flex items-center justify-between">
//                               <span>Question {groupNum}</span>
//                               <div className="flex items-center">
//                                 <span className="text-sm text-gray-600 mr-2">
//                                   {groupTotal.toFixed(1)} / {groupMax.toFixed(1)}
//                                 </span>
//                                 <svg 
//                                   className={`h-4 w-4 text-gray-500 transform transition-transform ${expandedGroups[groupNum] ? 'rotate-180' : 'rotate-0'}`} 
//                                   fill="none" 
//                                   viewBox="0 0 24 24" 
//                                   stroke="currentColor"
//                                 >
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                 </svg>
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
                        
//                         {/* Collapsible content */}
//                         {expandedGroups[groupNum] && (
//                           <>
//                             {groupQuestions.map((q) => (
//                               <tr key={q.sno} className="hover:bg-gray-50">
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
//                                   {q.qNo}
//                                 </td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium text-gray-900">
//                                   {marks[q.qNo] || 0}
//                                 </td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                                   {q.maxMark}
//                                 </td>
//                               </tr>
//                             ))}
//                             <tr className="bg-gray-50">
//                               <td className="px-3 py-2 text-sm text-gray-600 pl-5">Subtotal</td>
//                               <td className="px-3 py-2 text-sm text-right font-medium text-gray-900">{groupTotal.toFixed(1)}</td>
//                               <td className="px-3 py-2 text-sm text-right text-gray-500">{groupMax.toFixed(1)}</td>
//                             </tr>
//                           </>
//                         )}
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
//               Submit Evaluation
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