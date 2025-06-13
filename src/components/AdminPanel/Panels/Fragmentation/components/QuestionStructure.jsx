// import { useState } from "react";

// const QuestionStructure = ({ questionGroups, setQuestionGroups, maxMarks }) => {


//   const addQuestionGroup = () => {
//     const newId = questionGroups.length > 0 
//       ? Math.max(...questionGroups.map(g => parseInt(g.questionNumber))) + 1 
//       : 1;

//     setQuestionGroups([
//       ...questionGroups,
//       {
//         id: Date.now(),
//         questionNumber: String(newId),
//         maxMarks: 10,
//         subquestions: []
//       }
//     ]);
//   };

//   // Add a subquestion to a question group
//   const addSubquestion = (groupId) => {
//     setQuestionGroups(questionGroups.map(group => {
//       if (group.id === groupId) {
//         const letters = 'abcdefghijklmnopqrstuvwxyz';
//         const nextIndex = group.subquestions.length;
//         const nextLetter = letters[nextIndex];
        
//         return {
//           ...group,
//           maxMarks: undefined, // Clear main question marks when adding parts
//           subquestions: [
//             ...group.subquestions,
//             {
//               id: Date.now(),
//               questionNumber: `${group.questionNumber}${nextLetter}`,
//               maxMarks: 5 // Default marks for new subquestion
//             }
//           ]
//         };
//       }
//       return group;
//     }));
//   };

//   // // Remove a question group
//   // const removeQuestionGroup = (groupId) => {
//   //   if (questionGroups.length > 1) {
//   //     setQuestionGroups(questionGroups.filter(group => group.id !== groupId));
//   //   }
//   // };

//   const removeQuestionGroup = (groupId) => {
//   // Get the question group being removed
//   const groupToRemove = questionGroups.find(group => group.id === groupId);
  
//   // If this is the only question, don't allow removal
//   if (questionGroups.length <= 1) {
//     return;
//   }
  
//   // Check if trying to remove Question 1
//   if (groupToRemove && groupToRemove.questionNumber === "1") {
//     toast.error("Question 1 cannot be removed from a question paper");
//     return;
//   }
  
//   // Remove the question
//   const filteredGroups = questionGroups.filter(group => group.id !== groupId);
  
//   // Ensure we have proper sequential numbering
//   // Sort the groups by question number first
//   const sortedGroups = [...filteredGroups].sort((a, b) => {
//     // Extract the numeric part of the question number
//     const aNumMatch = a.questionNumber.match(/^(\d+)/);
//     const bNumMatch = b.questionNumber.match(/^(\d+)/);
    
//     if (!aNumMatch || !bNumMatch) return 0;
    
//     const aNum = parseInt(aNumMatch[1]);
//     const bNum = parseInt(bNumMatch[1]);
    
//     return aNum - bNum;
//   });
  
//   // Now ensure sequential numbering
//   const renumberedGroups = sortedGroups.map((group, index) => {
//     // The new question number should be index + 1 (since we start from 1)
//     const oldNumber = group.questionNumber;
//     const oldNumberMatch = oldNumber.match(/^(\d+)(.*)/);
    
//     if (!oldNumberMatch) return group;
    
//     // Keep any suffix (like 'a', 'b') but update the main number
//     const newNumber = `${index + 1}${oldNumberMatch[2] || ''}`;
    
//     // Update the main group's question number
//     const updatedGroup = {
//       ...group,
//       questionNumber: newNumber
//     };
    
//     // Also update any subquestions
//     if (updatedGroup.subquestions.length > 0) {
//       updatedGroup.subquestions = group.subquestions.map((sq, sqIndex) => {
//         const letters = 'abcdefghijklmnopqrstuvwxyz';
//         return {
//           ...sq,
//           questionNumber: `${index + 1}${letters[sqIndex]}`
//         };
//       });
//     }
    
//     return updatedGroup;
//   });
  
//   setQuestionGroups(renumberedGroups);
// };

//   // Remove a subquestion
//   const removeSubquestion = (groupId, subquestionId) => {
//     setQuestionGroups(questionGroups.map(group => {
//       if (group.id === groupId) {
//         const updatedSubquestions = group.subquestions.filter(sq => sq.id !== subquestionId);
        
//         // If no subquestions left, restore main question marks
//         if (updatedSubquestions.length === 0) {
//           return {
//             ...group,
//             maxMarks: 10,
//             subquestions: []
//           };
//         }
        
//         // Recalculate letter suffixes
//         const updatedWithLetters = updatedSubquestions.map((sq, index) => {
//           const letters = 'abcdefghijklmnopqrstuvwxyz';
//           return {
//             ...sq,
//             questionNumber: `${group.questionNumber}${letters[index]}`
//           };
//         });
        
//         return {
//           ...group,
//           subquestions: updatedWithLetters
//         };
//       }
//       return group;
//     }));
//   };

//   // Update question number
//   const updateQuestionNumber = (groupId, newNumber) => {
//     setQuestionGroups(questionGroups.map(group => {
//       if (group.id === groupId) {
//         const updatedGroup = {
//           ...group,
//           questionNumber: newNumber
//         };
        
//         // Update subquestion numbers
//         updatedGroup.subquestions = group.subquestions.map((sq, index) => {
//           const letters = 'abcdefghijklmnopqrstuvwxyz';
//           return {
//             ...sq,
//             questionNumber: `${newNumber}${letters[index]}`
//           };
//         });
        
//         return updatedGroup;
//       }
//       return group;
//     }));
//   };

//   // Update marks
//   const updateMarks = (groupId, marks, subquestionId = null) => {
//     setQuestionGroups(questionGroups.map(group => {
//       if (group.id === groupId) {
//         if (subquestionId) {
//           // Update subquestion marks
//           return {
//             ...group,
//             subquestions: group.subquestions.map(sq => 
//               sq.id === subquestionId ? { ...sq, maxMarks: parseFloat(marks) || 0 } : sq
//             )
//           };
//         } else {
//           // Update main question marks
//           return { ...group, maxMarks: parseFloat(marks) || 0 };
//         }
//       }
//       return group;
//     }));
//   };

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







// //?v4 Trying moderate UI/UX
// return (
//   <div className="bg-white shadow-sm rounded-lg p-6 max-w-6xl mx-auto border border-gray-200">
//     {/* Header */}
//     <div className="flex items-center justify-between mb-6">
//       <h2 className="text-xl font-semibold text-gray-800">
//         Question Structure
//       </h2>
//       <div className="flex items-center gap-4">
//         <span
//           className={`px-3 py-1.5 rounded-md text-sm font-medium ${
//             totalMarks === parseFloat(maxMarks)
//               ? "bg-green-100 text-green-700 border border-green-200"
//               : "bg-amber-100 text-amber-700 border border-amber-200"
//           }`}
//         >
//           Total: {totalMarks}/{maxMarks} marks
//         </span>
//         <button
//           type="button"
//           onClick={addQuestionGroup}
//           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
//         >
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           Add Question
//         </button>
//       </div>
//     </div>

//     {/* Questions Table */}
//     <div className="border border-gray-200 rounded-lg overflow-hidden">
//       {/* Table Header */}
//       <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b border-gray-200 font-medium text-gray-700 text-sm">
//         <div className="col-span-2">Question No.</div>
//         <div className="col-span-2">Marks</div>
//         <div className="col-span-6">Parts</div>
//         <div className="col-span-2 text-center">Actions</div>
//       </div>

//       {/* Question Rows */}
//       <div className="divide-y divide-gray-100">
//         {questionGroups.map((group, index) => (
//           <div key={group.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
//             {/* Question Number */}
//             <div className="col-span-2 flex items-center">
//               <div className="flex items-center gap-2">
//                 <span className="text-base font-medium text-gray-900">Q.</span>
//                 <input
//                   type="text"
//                   value={group.questionNumber}
//                   onChange={(e) => updateQuestionNumber(group.id, e.target.value)}
//                   className="w-16 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
//                 />
//               </div>
//             </div>

//             {/* Main Question Marks */}
//             <div className="col-span-2 flex items-center">
//               {group.subquestions.length === 0 ? (
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="number"
//                     value={group.maxMarks || ""}
//                     onChange={(e) => updateMarks(group.id, e.target.value)}
//                     min="0"
//                     step="0.5"
//                     className="w-20 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
//                     placeholder="0"
//                   />
//                   <span className="text-sm text-gray-600">marks</span>
//                 </div>
//               ) : (
//                 <div className="px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
//                   <span className="font-semibold text-blue-800">
//                     {group.subquestions.reduce((sum, sq) => sum + (parseFloat(sq.maxMarks) || 0), 0)}
//                   </span>
//                   <span className="text-sm text-blue-600 ml-1">marks</span>
//                 </div>
//               )}
//             </div>

//             {/* Parts Section */}
//             <div className="col-span-6">
//               {group.subquestions.length === 0 ? (
//                 <div className="flex items-center h-10 text-gray-500 text-sm italic">
//                   No parts - single question
//                 </div>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {group.subquestions.map((subquestion) => (
//                     <div key={subquestion.id} className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:border-gray-400 transition-colors">
//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-800">
//                           {subquestion.questionNumber}
//                         </span>
//                         <div className="flex items-center gap-1">
//                           <input
//                             type="number"
//                             value={subquestion.maxMarks || ""}
//                             onChange={(e) => updateMarks(group.id, e.target.value, subquestion.id)}
//                             min="0"
//                             step="0.5"
//                             className="w-14 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="0"
//                           />
//                           <span className="text-xs text-gray-500">marks</span>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => removeSubquestion(group.id, subquestion.id)}
//                           className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
//                           title="Remove part"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Actions */}
//             <div className="col-span-2 flex flex-col items-center justify-center gap-2">
//               <button
//                 type="button"
//                 onClick={() => addSubquestion(group.id)}
//                 className="inline-flex items-center px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm"
//                 title="Add part"
//               >
//                 <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//                 Add Part
//               </button>

//               <button
//                 type="button"
//                 onClick={() => removeQuestionGroup(group.id)}
//                 disabled={questionGroups.length <= 1 || group.questionNumber === "1"}
//                 className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus:ring-2 transition-colors shadow-sm ${
//                   group.questionNumber === "1" || questionGroups.length <= 1
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
//                     : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-offset-2"
//                 }`}
//                 title={
//                   group.questionNumber === "1" 
//                     ? "Question 1 cannot be removed" 
//                     : questionGroups.length <= 1 
//                       ? "Cannot remove the only question" 
//                       : "Remove question"
//                 }
//               >
//                 <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>

//     {/* Summary */}
//     <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//       <div className="flex items-center justify-between">
//         <div className="text-sm text-blue-800">
//           <span className="font-medium">{questionGroups.length}</span> questions • 
//           <span className="font-medium ml-1">
//             {questionGroups.reduce((sum, g) => sum + g.subquestions.length, 0)}
//           </span> parts total
//         </div>
//         <div className="text-sm text-blue-800">
//           Total marks: <span className="font-bold text-lg">{totalMarks}</span>
//         </div>
//       </div>
//     </div>
//   </div>
// );


// };

// export default QuestionStructure;

//?v2

// import { useState } from "react";
// import toast from "react-hot-toast";
// import { calculateTotalMarks } from "../helper/calculateTotalMarks";
// import getEffectiveMarks from "../helper/getEffectiveMarks";

// const QuestionStructure = ({ questionGroups, setQuestionGroups, maxMarks }) => {

//   const [partMarks, setPartMarks] = useState(5); // Default marks for each part

//   const addQuestionGroup = () => {
//     const newId = questionGroups.length > 0 
//       ? Math.max(...questionGroups.map(g => parseInt(g.questionNumber))) + 1 
//       : 1;

//     setQuestionGroups([
//       ...questionGroups,
//       {
//         id: Date.now(),
//         questionNumber: String(newId),
//         maxMarks: 10,
//         subquestions: [],
//         choiceBased: false,
//         choiceCount: 0
//       }
//     ]);
//   };

//   // Add a subquestion to a question group
//   const addSubquestion = (groupId) => {
//     setQuestionGroups(questionGroups.map(group => {
//       if (group.id === groupId) {
//         const letters = 'abcdefghijklmnopqrstuvwxyz';
//         const nextIndex = group.subquestions.length;
//         const nextLetter = letters[nextIndex];
        
//         const updatedGroup = {
//           ...group,
//           maxMarks: undefined, // Clear main question marks when adding parts
//           subquestions: [
//             ...group.subquestions,
//             {
//               id: Date.now(),
//               questionNumber: `${group.questionNumber}${nextLetter}`,
//               maxMarks: partMarks // Use the partMarks state for new subquestion
//             }
//           ]
//         };

//         // For the first subquestion, set default choice count to total
//         if (updatedGroup.subquestions.length === 1) {
//           updatedGroup.choiceCount = 1;
//         }

//         return updatedGroup;
//       }
//       return group;
//     }));
//   };

//   const removeQuestionGroup = (groupId) => {
//     // Get the question group being removed
//     const groupToRemove = questionGroups.find(group => group.id === groupId);
    
//     // If this is the only question, don't allow removal
//     if (questionGroups.length <= 1) {
//       return;
//     }
    
//     // Check if trying to remove Question 1
//     if (groupToRemove && groupToRemove.questionNumber === "1") {
//       toast.error("Question 1 cannot be removed from a question paper");
//       return;
//     }
    
//     // Remove the question
//     const filteredGroups = questionGroups.filter(group => group.id !== groupId);
    
//     // Ensure we have proper sequential numbering
//     // Sort the groups by question number first
//     const sortedGroups = [...filteredGroups].sort((a, b) => {
//       // Extract the numeric part of the question number
//       const aNumMatch = a.questionNumber.match(/^(\d+)/);
//       const bNumMatch = b.questionNumber.match(/^(\d+)/);
      
//       if (!aNumMatch || !bNumMatch) return 0;
      
//       const aNum = parseInt(aNumMatch[1]);
//       const bNum = parseInt(bNumMatch[1]);
      
//       return aNum - bNum;
//     });
    
//     // Now ensure sequential numbering
//     const renumberedGroups = sortedGroups.map((group, index) => {
//       // The new question number should be index + 1 (since we start from 1)
//       const oldNumber = group.questionNumber;
//       const oldNumberMatch = oldNumber.match(/^(\d+)(.*)/);
      
//       if (!oldNumberMatch) return group;
      
//       // Keep any suffix (like 'a', 'b') but update the main number
//       const newNumber = `${index + 1}${oldNumberMatch[2] || ''}`;
      
//       // Update the main group's question number
//       const updatedGroup = {
//         ...group,
//         questionNumber: newNumber
//       };
      
//       // Also update any subquestions
//       if (updatedGroup.subquestions.length > 0) {
//         updatedGroup.subquestions = group.subquestions.map((sq, sqIndex) => {
//           const letters = 'abcdefghijklmnopqrstuvwxyz';
//           return {
//             ...sq,
//             questionNumber: `${index + 1}${letters[sqIndex]}`
//           };
//         });
//       }
      
//       return updatedGroup;
//     });
    
//     setQuestionGroups(renumberedGroups);
//   };

//   // Remove a subquestion
//   const removeSubquestion = (groupId, subquestionId) => {
//     setQuestionGroups(questionGroups.map(group => {
//       if (group.id === groupId) {
//         const updatedSubquestions = group.subquestions.filter(sq => sq.id !== subquestionId);
        
//         // If no subquestions left, restore main question marks and reset choice options
//         if (updatedSubquestions.length === 0) {
//           return {
//             ...group,
//             maxMarks: 10,
//             subquestions: [],
//             choiceBased: false,
//             choiceCount: 0
//           };
//         }
        
//         // Recalculate letter suffixes
//         const updatedWithLetters = updatedSubquestions.map((sq, index) => {
//           const letters = 'abcdefghijklmnopqrstuvwxyz';
//           return {
//             ...sq,
//             questionNumber: `${group.questionNumber}${letters[index]}`
//           };
//         });
        
//         // Ensure choiceCount doesn't exceed total subquestions
//         const updatedChoiceCount = Math.min(group.choiceCount || 0, updatedWithLetters.length);
        
//         return {
//           ...group,
//           subquestions: updatedWithLetters,
//           choiceCount: updatedChoiceCount
//         };
//       }
//       return group;
//     }));
//   };

//   // Update question number
//   const updateQuestionNumber = (groupId, newNumber) => {
//     setQuestionGroups(questionGroups.map(group => {
//       if (group.id === groupId) {
//         const updatedGroup = {
//           ...group,
//           questionNumber: newNumber
//         };
        
//         // Update subquestion numbers
//         updatedGroup.subquestions = group.subquestions.map((sq, index) => {
//           const letters = 'abcdefghijklmnopqrstuvwxyz';
//           return {
//             ...sq,
//             questionNumber: `${newNumber}${letters[index]}`
//           };
//         });
        
//         return updatedGroup;
//       }
//       return group;
//     }));
//   };

//   // Update marks
//   const updateMarks = (groupId, marks, subquestionId = null) => {
//     setQuestionGroups(questionGroups.map(group => {
//       if (group.id === groupId) {
//         if (subquestionId) {
//           // Update subquestion marks
//           return {
//             ...group,
//             subquestions: group.subquestions.map(sq => 
//               sq.id === subquestionId ? { ...sq, maxMarks: parseFloat(marks) || 0 } : sq
//             )
//           };
//         } else {
//           // Update main question marks
//           return { ...group, maxMarks: parseFloat(marks) || 0 };
//         }
//       }
//       return group;
//     }));
//   };

//   // Toggle choice-based question
//   const toggleChoiceBased = (groupId) => {
//     setQuestionGroups(questionGroups.map(group => {
//       if (group.id === groupId) {
//         // Only allow choice-based for questions with multiple subquestions
//         if (group.subquestions.length < 2 && !group.choiceBased) {
//           toast.error("Add at least 2 parts to enable choice-based selection");
//           return group;
//         }
        
//         // If enabling choice-based, set default choiceCount
//         const choiceCount = !group.choiceBased ? Math.max(1, Math.floor(group.subquestions.length / 2)) : group.choiceCount;
        
//         return {
//           ...group,
//           choiceBased: !group.choiceBased,
//           choiceCount: !group.choiceBased ? choiceCount : 0
//         };
//       }
//       return group;
//     }));
//   };

//   // Update choice count
//   const updateChoiceCount = (groupId, count) => {
//     setQuestionGroups(questionGroups.map(group => {
//       if (group.id === groupId) {
//         const totalSubquestions = group.subquestions.length;
        
//         // Validate choice count: must be between 1 and total
//         const validCount = Math.min(Math.max(1, parseInt(count) || 0), totalSubquestions);
        
//         if (validCount !== parseInt(count) && count !== '') {
//           toast.error(`Choice count must be between 1 and ${totalSubquestions}`);
//         }
        
//         return {
//           ...group,
//           choiceCount: validCount
//         };
//       }
//       return group;
//     }));
//   };

//   // Calculate total marks across all question groups using helper function
//   const totalMarks = calculateTotalMarks(questionGroups);

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6 max-w-6xl mx-auto border border-gray-200">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Question Structure
//         </h2>
//         <div className="flex items-center gap-4">
//           <span
//             className={`px-3 py-1.5 rounded-md text-sm font-medium ${
//               totalMarks === parseFloat(maxMarks)
//                 ? "bg-green-100 text-green-700 border border-green-200"
//                 : "bg-amber-100 text-amber-700 border border-amber-200"
//             }`}
//           >
//             Total: {totalMarks.toFixed(1)}/{maxMarks} marks
//           </span>
//           <button
//             type="button"
//             onClick={addQuestionGroup}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             Add Question
//           </button>
//         </div>
//       </div>

//       {/* Questions Table */}
//       <div className="border border-gray-200 rounded-lg overflow-hidden">
//         {/* Table Header */}
//         <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b border-gray-200 font-medium text-gray-700 text-sm">
//           <div className="col-span-1">Q No.</div>
//           <div className="col-span-2">Marks</div>
//           <div className="col-span-5">Parts</div>
//           <div className="col-span-2">Options</div>
//           <div className="col-span-2 text-center">Actions</div>
//         </div>

//         {/* Question Rows */}
//         <div className="divide-y divide-gray-100">
//           {questionGroups.map((group, index) => (
//             <div key={group.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
//               {/* Question Number */}
//               <div className="col-span-1 flex items-center">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="text"
//                     value={group.questionNumber}
//                     onChange={(e) => updateQuestionNumber(group.id, e.target.value)}
//                     className="w-14 px-2 py-1.5 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
//                   />
//                 </div>
//               </div>

//               {/* Main Question Marks */}
//               <div className="col-span-2 flex items-center">
//                 {group.subquestions.length === 0 ? (
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="number"
//                       value={group.maxMarks || ""}
//                       onChange={(e) => updateMarks(group.id, e.target.value)}
//                       min="0"
//                       step="0.5"
//                       className="w-20 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
//                       placeholder="0"
//                     />
//                     <span className="text-sm text-gray-600">marks</span>
//                   </div>
//                 ) : (
//                   <div className="px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
//                     <span className="font-semibold text-blue-800">
//                       {getEffectiveMarks(group).toFixed(1)}
//                     </span>
//                     <span className="text-sm text-blue-600 ml-1">marks</span>
//                   </div>
//                 )}
//               </div>

//               {/* Parts Section */}
//               <div className="col-span-5">
//                 {group.subquestions.length === 0 ? (
//                   <div className="flex items-center h-10 text-gray-500 text-sm italic">
//                     No parts - single question
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {group.subquestions.map((subquestion) => (
//                       <div key={subquestion.id} className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:border-gray-400 transition-colors">
//                         <div className="flex items-center gap-3">
//                           <span className="text-sm font-medium text-gray-800">
//                             {subquestion.questionNumber}
//                           </span>
//                           <div className="flex items-center gap-1">
//                             <input
//                               type="number"
//                               value={subquestion.maxMarks || ""}
//                               onChange={(e) => updateMarks(group.id, e.target.value, subquestion.id)}
//                               min="0"
//                               step="0.5"
//                               className="w-14 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                               placeholder="0"
//                             />
//                             <span className="text-xs text-gray-500">marks</span>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => removeSubquestion(group.id, subquestion.id)}
//                             className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
//                             title="Remove part"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
                
//                 {/* Choice-based indicator */}
//                 {group.choiceBased && group.subquestions.length > 0 && (
//                   <div className="mt-2 flex items-center">
//                     <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md">
//                       Choice: Answer {group.choiceCount} out of {group.subquestions.length} parts
//                     </span>
//                   </div>
//                 )}
//               </div>
              
//               {/* Options Section */}
//               <div className="col-span-2">
//                 <div className="flex flex-col gap-2">
//                   {/* Choice-based Question Toggle (only for questions with parts) */}
//                   {group.subquestions.length > 1 && (
//                     <div className="flex flex-col gap-1">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           id={`choice-${group.id}`}
//                           checked={group.choiceBased}
//                           onChange={() => toggleChoiceBased(group.id)}
//                           className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                         />
//                         <label htmlFor={`choice-${group.id}`} className="text-sm text-gray-700">
//                           Choice-based
//                         </label>
//                       </div>
                      
//                       {/* Choice Count Input (only if choice-based is enabled) */}
//                       {group.choiceBased && (
//                         <div className="flex items-center gap-2 pl-6">
//                           <input
//                             type="number"
//                             min="1"
//                             max={group.subquestions.length}
//                             value={group.choiceCount || ""}
//                             onChange={(e) => updateChoiceCount(group.id, e.target.value)}
//                             className="w-12 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
//                           />
//                           <span className="text-xs text-gray-600">
//                             out of {group.subquestions.length}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="col-span-2 flex flex-col items-center justify-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => addSubquestion(group.id)}
//                   className="inline-flex items-center px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm w-full justify-center"
//                   title="Add part"
//                 >
//                   <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                   </svg>
//                   Add Part
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => removeQuestionGroup(group.id)}
//                   disabled={questionGroups.length <= 1 || group.questionNumber === "1"}
//                   className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus:ring-2 transition-colors shadow-sm w-full justify-center ${
//                     group.questionNumber === "1" || questionGroups.length <= 1
//                       ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
//                       : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-offset-2"
//                   }`}
//                   title={
//                     group.questionNumber === "1" 
//                       ? "Question 1 cannot be removed" 
//                       : questionGroups.length <= 1 
//                         ? "Cannot remove the only question" 
//                         : "Remove question"
//                   }
//                 >
//                   <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                   </svg>
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//         <div className="flex items-center justify-between">
//           <div className="text-sm text-blue-800">
//             <span className="font-medium">{questionGroups.length}</span> questions • 
//             <span className="font-medium ml-1">
//               {questionGroups.reduce((sum, g) => sum + g.subquestions.length, 0)}
//             </span> parts • 
//             <span className="font-medium ml-1">
//               {questionGroups.filter(g => g.choiceBased).length}
//             </span> choice-based
//           </div>
//           <div className="text-sm text-blue-800">
//             Total marks: <span className="font-bold text-lg">{totalMarks.toFixed(1)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionStructure;



//?v3-> (working) synchronize the marks for all parts of a question and allow users to set the marks before adding parts.

import { useState } from "react";
import toast from "react-hot-toast";
import { calculateTotalMarks } from "../helper/calculateTotalMarks";
import getEffectiveMarks from "../helper/getEffectiveMarks";

const QuestionStructure = ({ questionGroups, setQuestionGroups, maxMarks }) => {

  const [partMarks, setPartMarks] = useState(5); // Default marks for each part
  const [showPartMarksDialog, setShowPartMarksDialog] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [tempPartMarks, setTempPartMarks] = useState(5);

  const addQuestionGroup = () => {
    const newId = questionGroups.length > 0 
      ? Math.max(...questionGroups.map(g => parseInt(g.questionNumber))) + 1 
      : 1;

    setQuestionGroups([
      ...questionGroups,
      {
        id: Date.now(),
        questionNumber: String(newId),
        maxMarks: 10,
        subquestions: [],
        choiceBased: false,
        choiceCount: 0
      }
    ]);
  };

  // Show dialog to set part marks before adding subquestion
  const handleAddSubquestion = (groupId) => {
    const group = questionGroups.find(g => g.id === groupId);
    
    // If this is the first part, ask for marks
    if (group.subquestions.length === 0) {
      setCurrentGroupId(groupId);
      setTempPartMarks(partMarks);
      setShowPartMarksDialog(true);
    } else {
      // Use existing part marks for additional parts
      const existingPartMarks = group.subquestions[0].maxMarks;
      addSubquestion(groupId, existingPartMarks);
    }
  };

  // Confirm and add subquestion with specified marks
  const confirmAddSubquestion = () => {
    if (tempPartMarks <= 0) {
      toast.error("Part marks must be greater than 0");
      return;
    }
    
    setPartMarks(tempPartMarks);
    addSubquestion(currentGroupId, tempPartMarks);
    setShowPartMarksDialog(false);
    setCurrentGroupId(null);
  };

  // Add a subquestion to a question group
  const addSubquestion = (groupId, marksPerPart = partMarks) => {
    setQuestionGroups(questionGroups.map(group => {
      if (group.id === groupId) {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const nextIndex = group.subquestions.length;
        const nextLetter = letters[nextIndex];
        
        const updatedGroup = {
          ...group,
          maxMarks: undefined, // Clear main question marks when adding parts
          subquestions: [
            ...group.subquestions,
            {
              id: Date.now(),
              questionNumber: `${group.questionNumber}${nextLetter}`,
              maxMarks: marksPerPart
            }
          ]
        };

        // For the first subquestion, set default choice count to total
        if (updatedGroup.subquestions.length === 1) {
          updatedGroup.choiceCount = 1;
        }

        return updatedGroup;
      }
      return group;
    }));
  };

  const removeQuestionGroup = (groupId) => {
    // Get the question group being removed
    const groupToRemove = questionGroups.find(group => group.id === groupId);
    
    // If this is the only question, don't allow removal
    if (questionGroups.length <= 1) {
      return;
    }
    
    // Check if trying to remove Question 1
    if (groupToRemove && groupToRemove.questionNumber === "1") {
      toast.error("Question 1 cannot be removed from a question paper");
      return;
    }
    
    // Remove the question
    const filteredGroups = questionGroups.filter(group => group.id !== groupId);
    
    // Ensure we have proper sequential numbering
    // Sort the groups by question number first
    const sortedGroups = [...filteredGroups].sort((a, b) => {
      // Extract the numeric part of the question number
      const aNumMatch = a.questionNumber.match(/^(\d+)/);
      const bNumMatch = b.questionNumber.match(/^(\d+)/);
      
      if (!aNumMatch || !bNumMatch) return 0;
      
      const aNum = parseInt(aNumMatch[1]);
      const bNum = parseInt(bNumMatch[1]);
      
      return aNum - bNum;
    });
    
    // Now ensure sequential numbering
    const renumberedGroups = sortedGroups.map((group, index) => {
      // The new question number should be index + 1 (since we start from 1)
      const oldNumber = group.questionNumber;
      const oldNumberMatch = oldNumber.match(/^(\d+)(.*)/);
      
      if (!oldNumberMatch) return group;
      
      // Keep any suffix (like 'a', 'b') but update the main number
      const newNumber = `${index + 1}${oldNumberMatch[2] || ''}`;
      
      // Update the main group's question number
      const updatedGroup = {
        ...group,
        questionNumber: newNumber
      };
      
      // Also update any subquestions
      if (updatedGroup.subquestions.length > 0) {
        updatedGroup.subquestions = group.subquestions.map((sq, sqIndex) => {
          const letters = 'abcdefghijklmnopqrstuvwxyz';
          return {
            ...sq,
            questionNumber: `${index + 1}${letters[sqIndex]}`
          };
        });
      }
      
      return updatedGroup;
    });
    
    setQuestionGroups(renumberedGroups);
  };

  // Remove a subquestion
  const removeSubquestion = (groupId, subquestionId) => {
    setQuestionGroups(questionGroups.map(group => {
      if (group.id === groupId) {
        const updatedSubquestions = group.subquestions.filter(sq => sq.id !== subquestionId);
        
        // If no subquestions left, restore main question marks and reset choice options
        if (updatedSubquestions.length === 0) {
          return {
            ...group,
            maxMarks: 10,
            subquestions: [],
            choiceBased: false,
            choiceCount: 0
          };
        }
        
        // Recalculate letter suffixes
        const updatedWithLetters = updatedSubquestions.map((sq, index) => {
          const letters = 'abcdefghijklmnopqrstuvwxyz';
          return {
            ...sq,
            questionNumber: `${group.questionNumber}${letters[index]}`
          };
        });
        
        // Ensure choiceCount doesn't exceed total subquestions
        const updatedChoiceCount = Math.min(group.choiceCount || 0, updatedWithLetters.length);
        
        return {
          ...group,
          subquestions: updatedWithLetters,
          choiceCount: updatedChoiceCount
        };
      }
      return group;
    }));
  };

  // Update question number
  const updateQuestionNumber = (groupId, newNumber) => {
    setQuestionGroups(questionGroups.map(group => {
      if (group.id === groupId) {
        const updatedGroup = {
          ...group,
          questionNumber: newNumber
        };
        
        // Update subquestion numbers
        updatedGroup.subquestions = group.subquestions.map((sq, index) => {
          const letters = 'abcdefghijklmnopqrstuvwxyz';
          return {
            ...sq,
            questionNumber: `${newNumber}${letters[index]}`
          };
        });
        
        return updatedGroup;
      }
      return group;
    }));
  };

  // Update marks with synchronization for parts
  const updateMarks = (groupId, marks, subquestionId = null) => {
    setQuestionGroups(questionGroups.map(group => {
      if (group.id === groupId) {
        if (subquestionId) {
          // Update ALL subquestion marks in the same group (sync all parts)
          return {
            ...group,
            subquestions: group.subquestions.map(sq => ({
              ...sq,
              maxMarks: parseFloat(marks) || 0
            }))
          };
        } else {
          // Update main question marks
          return { ...group, maxMarks: parseFloat(marks) || 0 };
        }
      }
      return group;
    }));
  };

  // Toggle choice-based question
  const toggleChoiceBased = (groupId) => {
    setQuestionGroups(questionGroups.map(group => {
      if (group.id === groupId) {
        // Only allow choice-based for questions with multiple subquestions
        if (group.subquestions.length < 2 && !group.choiceBased) {
          toast.error("Add at least 2 parts to enable choice-based selection");
          return group;
        }
        
        // If enabling choice-based, set default choiceCount
        const choiceCount = !group.choiceBased ? Math.max(1, Math.floor(group.subquestions.length / 2)) : group.choiceCount;
        
        return {
          ...group,
          choiceBased: !group.choiceBased,
          choiceCount: !group.choiceBased ? choiceCount : 0
        };
      }
      return group;
    }));
  };

  // Update choice count
  const updateChoiceCount = (groupId, count) => {
    setQuestionGroups(questionGroups.map(group => {
      if (group.id === groupId) {
        const totalSubquestions = group.subquestions.length;
        
        // Validate choice count: must be between 1 and total
        const validCount = Math.min(Math.max(1, parseInt(count) || 0), totalSubquestions);
        
        if (validCount !== parseInt(count) && count !== '') {
          toast.error(`Choice count must be between 1 and ${totalSubquestions}`);
        }
        
        return {
          ...group,
          choiceCount: validCount
        };
      }
      return group;
    }));
  };

  // Calculate total marks across all question groups using helper function
  const totalMarks = calculateTotalMarks(questionGroups);

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 max-w-6xl mx-auto border border-gray-200">
      {/* Part Marks Dialog */}
      {showPartMarksDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-opacity-55 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Set Marks for Question Parts
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              How many marks should each part of this question have? All parts will have the same marks.
            </p>
            <div className="mb-6">
              <label htmlFor="tempPartMarks" className="block text-sm font-medium text-gray-700 mb-2">
                Marks per part
              </label>
              <input
                type="number"
                id="tempPartMarks"
                value={tempPartMarks}
                onChange={(e) => setTempPartMarks(parseFloat(e.target.value) || 0)}
                min="0.5"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter marks"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPartMarksDialog(false);
                  setCurrentGroupId(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAddSubquestion}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Part
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Question Structure
        </h2>
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              totalMarks === parseFloat(maxMarks)
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-amber-100 text-amber-700 border border-amber-200"
            }`}
          >
            Total: {totalMarks.toFixed(1)}/{maxMarks} marks
          </span>
          <button
            type="button"
            onClick={addQuestionGroup}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
        </div>
      </div>

      {/* Questions Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b border-gray-200 font-medium text-gray-700 text-sm">
          <div className="col-span-1">Q No.</div>
          <div className="col-span-2">Marks</div>
          <div className="col-span-5">Parts</div>
          <div className="col-span-2">Options</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {/* Question Rows */}
        <div className="divide-y divide-gray-100">
          {questionGroups.map((group, index) => (
            <div key={group.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
              {/* Question Number */}
              <div className="col-span-1 flex items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={group.questionNumber}
                    onChange={(e) => updateQuestionNumber(group.id, e.target.value)}
                    className="w-14 px-2 py-1.5 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Main Question Marks */}
              <div className="col-span-2 flex items-center">
                {group.subquestions.length === 0 ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={group.maxMarks || ""}
                      onChange={(e) => updateMarks(group.id, e.target.value)}
                      min="0"
                      step="0.5"
                      className="w-20 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                      placeholder="0"
                    />
                    <span className="text-sm text-gray-600">marks</span>
                  </div>
                  
                ) : (
                  <div className="px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
                    <span className="font-semibold text-blue-800">
                      {getEffectiveMarks(group).toFixed(1)}
                    </span>
                    <span className="text-sm text-blue-600 ml-1">marks</span>
                  </div>
                )}
              </div>

              {/* Parts Section */}
              <div className="col-span-5">
                {group.subquestions.length === 0 ? (
                  <div className="flex items-center h-10 text-gray-500 text-sm italic">
                    No parts - single question
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {group.subquestions.map((subquestion, sqIndex) => (
                      <div key={subquestion.id} className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:border-gray-400 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-800">
                            {subquestion.questionNumber}
                          </span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={subquestion.maxMarks || ""}
                              onChange={(e) => updateMarks(group.id, e.target.value, subquestion.id)}
                              min="0"
                              step="0.5"
                              className="w-14 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                              title="Changing this will update all parts of this question"
                            />
                            <span className="text-xs text-gray-500">marks</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSubquestion(group.id, subquestion.id)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Remove part"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Sync indicator for parts */}
                    {group.subquestions.length > 1 && (
                      <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        All parts synced
                      </div>
                    )}
                  </div>
                )}
                
                {/* Choice-based indicator */}
                {group.choiceBased && group.subquestions.length > 0 && (
                  <div className="mt-2 flex items-center">
                    <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md">
                      Choice: Answer {group.choiceCount} out of {group.subquestions.length} parts
                    </span>
                  </div>
                )}
              </div>
              
              {/* Options Section */}
              <div className="col-span-2">
                <div className="flex flex-col gap-2">
                  {/* Choice-based Question Toggle (only for questions with parts) */}
                  {group.subquestions.length > 1 && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`choice-${group.id}`}
                          checked={group.choiceBased}
                          onChange={() => toggleChoiceBased(group.id)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor={`choice-${group.id}`} className="text-sm text-gray-700">
                          Choice-based
                        </label>
                      </div>
                      
                      {/* Choice Count Input (only if choice-based is enabled) */}
                      {group.choiceBased && (
                        <div className="flex items-center gap-2 pl-6">
                          <input
                            type="number"
                            min="1"
                            max={group.subquestions.length}
                            value={group.choiceCount || ""}
                            onChange={(e) => updateChoiceCount(group.id, e.target.value)}
                            className="w-12 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <span className="text-xs text-gray-600">
                            out of {group.subquestions.length}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex flex-col items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddSubquestion(group.id)}
                  className="inline-flex items-center px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm w-full justify-center"
                  title="Add part"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Part
                </button>

                <button
                  type="button"
                  onClick={() => removeQuestionGroup(group.id)}
                  disabled={questionGroups.length <= 1 || group.questionNumber === "1"}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus:ring-2 transition-colors shadow-sm w-full justify-center ${
                    group.questionNumber === "1" || questionGroups.length <= 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                      : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-offset-2"
                  }`}
                  title={
                    group.questionNumber === "1" 
                      ? "Question 1 cannot be removed" 
                      : questionGroups.length <= 1 
                        ? "Cannot remove the only question" 
                        : "Remove question"
                  }
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-800">
            <span className="font-medium">{questionGroups.length}</span> questions • 
            <span className="font-medium ml-1">
              {questionGroups.reduce((sum, g) => sum + g.subquestions.length, 0)}
            </span> parts • 
            <span className="font-medium ml-1">
              {questionGroups.filter(g => g.choiceBased).length}
            </span> choice-based
          </div>
          <div className="text-sm text-blue-800">
            Total marks: <span className="font-bold text-lg">{totalMarks.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionStructure;

