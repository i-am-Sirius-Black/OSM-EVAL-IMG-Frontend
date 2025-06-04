import { useState } from "react";

const QuestionStructure = ({ questionGroups, setQuestionGroups, maxMarks }) => {


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
        subquestions: []
      }
    ]);
  };

  // Add a subquestion to a question group
  const addSubquestion = (groupId) => {
    setQuestionGroups(questionGroups.map(group => {
      if (group.id === groupId) {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const nextIndex = group.subquestions.length;
        const nextLetter = letters[nextIndex];
        
        return {
          ...group,
          maxMarks: undefined, // Clear main question marks when adding parts
          subquestions: [
            ...group.subquestions,
            {
              id: Date.now(),
              questionNumber: `${group.questionNumber}${nextLetter}`,
              maxMarks: 5 // Default marks for new subquestion
            }
          ]
        };
      }
      return group;
    }));
  };

  // // Remove a question group
  // const removeQuestionGroup = (groupId) => {
  //   if (questionGroups.length > 1) {
  //     setQuestionGroups(questionGroups.filter(group => group.id !== groupId));
  //   }
  // };

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
        
        // If no subquestions left, restore main question marks
        if (updatedSubquestions.length === 0) {
          return {
            ...group,
            maxMarks: 10,
            subquestions: []
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
        
        return {
          ...group,
          subquestions: updatedWithLetters
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

  // Update marks
  const updateMarks = (groupId, marks, subquestionId = null) => {
    setQuestionGroups(questionGroups.map(group => {
      if (group.id === groupId) {
        if (subquestionId) {
          // Update subquestion marks
          return {
            ...group,
            subquestions: group.subquestions.map(sq => 
              sq.id === subquestionId ? { ...sq, maxMarks: parseFloat(marks) || 0 } : sq
            )
          };
        } else {
          // Update main question marks
          return { ...group, maxMarks: parseFloat(marks) || 0 };
        }
      }
      return group;
    }));
  };

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







//?v4 Trying moderate UI/UX
return (
  <div className="bg-white shadow-sm rounded-lg p-6 max-w-6xl mx-auto border border-gray-200">
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
          Total: {totalMarks}/{maxMarks} marks
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
        <div className="col-span-2">Question No.</div>
        <div className="col-span-2">Marks</div>
        <div className="col-span-6">Parts</div>
        <div className="col-span-2 text-center">Actions</div>
      </div>

      {/* Question Rows */}
      <div className="divide-y divide-gray-100">
        {questionGroups.map((group, index) => (
          <div key={group.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
            {/* Question Number */}
            <div className="col-span-2 flex items-center">
              <div className="flex items-center gap-2">
                <span className="text-base font-medium text-gray-900">Q.</span>
                <input
                  type="text"
                  value={group.questionNumber}
                  onChange={(e) => updateQuestionNumber(group.id, e.target.value)}
                  className="w-16 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
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
                    {group.subquestions.reduce((sum, sq) => sum + (parseFloat(sq.maxMarks) || 0), 0)}
                  </span>
                  <span className="text-sm text-blue-600 ml-1">marks</span>
                </div>
              )}
            </div>

            {/* Parts Section */}
            <div className="col-span-6">
              {group.subquestions.length === 0 ? (
                <div className="flex items-center h-10 text-gray-500 text-sm italic">
                  No parts - single question
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {group.subquestions.map((subquestion) => (
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
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="col-span-2 flex flex-col items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => addSubquestion(group.id)}
                className="inline-flex items-center px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm"
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
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus:ring-2 transition-colors shadow-sm ${
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
          </span> parts total
        </div>
        <div className="text-sm text-blue-800">
          Total marks: <span className="font-bold text-lg">{totalMarks}</span>
        </div>
      </div>
    </div>
  </div>
);

//?v3(very much minimalist ui/ux)
// return (
//   <div className="bg-white border border-gray-200 rounded-lg max-w-6xl mx-auto">
//     {/* Header */}
//     <div className="flex items-center justify-between p-4 border-b border-gray-200">
//       <h2 className="text-lg font-medium text-gray-900">Question Structure</h2>
//       <div className="flex items-center gap-4">
//         <span className="text-sm text-gray-600">
//           Total: <span className="font-medium">{totalMarks}/{maxMarks}</span> marks
//         </span>
//         <button
//           type="button"
//           onClick={addQuestionGroup}
//           className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
//         >
//           + Add Question
//         </button>
//       </div>
//     </div>

//     {/* Questions */}
//     <div className="divide-y divide-gray-100">
//       {questionGroups.map((group, index) => (
//         <div key={group.id} className="p-4">
//           <div className="flex items-start gap-4">
//             {/* Question Number & Marks */}
//             <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
//               <div className="flex items-center gap-2">
//                 <label className="text-sm font-medium text-gray-700">Q.</label>
//                 <input
//                   type="text"
//                   value={group.questionNumber}
//                   onChange={(e) => updateQuestionNumber(group.id, e.target.value)}
//                   className="w-12 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
              
//               {group.subquestions.length === 0 ? (
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="number"
//                     value={group.maxMarks || ""}
//                     onChange={(e) => updateMarks(group.id, e.target.value)}
//                     min="0"
//                     step="0.5"
//                     className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="0"
//                   />
//                   <span className="text-sm text-gray-500">marks</span>
//                 </div>
//               ) : (
//                 <div className="text-sm text-gray-600">
//                   <span className="font-medium">
//                     {group.subquestions.reduce((sum, sq) => sum + (parseFloat(sq.maxMarks) || 0), 0)}
//                   </span> marks
//                 </div>
//               )}
//             </div>

//             {/* Parts */}
//             <div className="flex-1 min-w-0">
//               {group.subquestions.length === 0 ? (
//                 <div className="text-sm text-gray-400 py-1">Single question</div>
//               ) : (
//                 <div className="space-y-2">
//                   {group.subquestions.map((subquestion) => (
//                     <div key={subquestion.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded border">
//                       <span className="text-sm font-medium text-gray-700 min-w-0 flex-shrink-0">
//                         {subquestion.questionNumber}
//                       </span>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="number"
//                           value={subquestion.maxMarks || ""}
//                           onChange={(e) => updateMarks(group.id, e.target.value, subquestion.id)}
//                           min="0"
//                           step="0.5"
//                           className="w-14 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="0"
//                         />
//                         <span className="text-xs text-gray-500">marks</span>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => removeSubquestion(group.id, subquestion.id)}
//                         className="ml-auto text-gray-400 hover:text-red-600 p-1"
//                         title="Remove part"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Actions */}
//             <div className="flex items-center gap-2 flex-shrink-0">
//               <button
//                 type="button"
//                 onClick={() => addSubquestion(group.id)}
//                 className="px-2 py-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500"
//                 title="Add part"
//               >
//                 + Part
//               </button>
              
//               <button
//                 type="button"
//                 onClick={() => removeQuestionGroup(group.id)}
//                 disabled={questionGroups.length <= 1 || group.questionNumber === "1"}
//                 className={`px-2 py-1 text-xs rounded focus:outline-none focus:ring-1 ${
//                   group.questionNumber === "1" || questionGroups.length <= 1
//                     ? "text-gray-400 bg-gray-100 cursor-not-allowed" 
//                     : "text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 focus:ring-red-500"
//                 }`}
//                 title={
//                   group.questionNumber === "1" 
//                     ? "Question 1 cannot be removed" 
//                     : questionGroups.length <= 1 
//                       ? "Cannot remove the only question" 
//                       : "Remove question"
//                 }
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>

//     {/* Footer Summary */}
//     <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200 text-sm">
//       <div className="text-gray-600">
//         {questionGroups.length} questions • {questionGroups.reduce((sum, g) => sum + g.subquestions.length, 0)} parts
//       </div>
//       <div className="font-medium text-gray-900">
//         Total: {totalMarks} marks
//       </div>
//     </div>
//   </div>
// );

//?V2 (very advanced ui)
// return (
//   <div className="bg-white shadow-lg rounded-xl p-8 max-w-7xl mx-auto border border-gray-100">
//     {/* Header */}
//     <div className="flex items-center justify-between mb-8">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900 mb-1">
//           Question Structure
//         </h2>
//         <p className="text-sm text-gray-600">Configure your exam questions and marking scheme</p>
//       </div>
//       <div className="flex items-center gap-6">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//           <span className="text-sm font-medium text-gray-700">Progress</span>
//         </div>
//         <div
//           className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm ${
//             totalMarks === parseFloat(maxMarks)
//               ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
//               : "bg-amber-100 text-amber-800 border border-amber-200"
//           }`}
//         >
//           <span className="text-lg">{totalMarks}</span>
//           <span className="text-gray-600">/{maxMarks}</span>
//           <span className="ml-1">marks</span>
//         </div>
//         <button
//           type="button"
//           onClick={addQuestionGroup}
//           className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
//         >
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           Add Question
//         </button>
//       </div>
//     </div>

//     {/* Questions Table */}
//     <div className="bg-gray-50 rounded-xl p-1 shadow-inner">
//       <div className="bg-white rounded-lg overflow-hidden shadow-sm">
//         {/* Table Header */}
//         <div className="grid grid-cols-12 gap-6 bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 border-b border-gray-200">
//           <div className="col-span-2 font-semibold text-gray-800 text-sm uppercase tracking-wide">Question No.</div>
//           <div className="col-span-2 font-semibold text-gray-800 text-sm uppercase tracking-wide">Marks</div>
//           <div className="col-span-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">Parts</div>
//           <div className="col-span-2 font-semibold text-gray-800 text-sm uppercase tracking-wide text-center">Actions</div>
//         </div>

//         {/* Question Rows */}
//         <div className="divide-y divide-gray-100">
//           {questionGroups.map((group, index) => (
//             <div key={group.id} className="grid grid-cols-12 gap-6 px-6 py-6 hover:bg-blue-50/30 transition-all duration-200 group">
//               {/* Question Number */}
//               <div className="col-span-2 flex items-center">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
//                     <span className="text-blue-700 font-bold text-sm">Q</span>
//                   </div>
//                   <input
//                     type="text"
//                     value={group.questionNumber}
//                     onChange={(e) => updateQuestionNumber(group.id, e.target.value)}
//                     className="w-16 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-900 shadow-sm hover:border-gray-400 transition-colors"
//                   />
//                 </div>
//               </div>

//               {/* Main Question Marks */}
//               <div className="col-span-2 flex items-center">
//                 {group.subquestions.length === 0 ? (
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="number"
//                       value={group.maxMarks || ""}
//                       onChange={(e) => updateMarks(group.id, e.target.value)}
//                       min="0"
//                       step="0.5"
//                       className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold shadow-sm hover:border-gray-400 transition-colors"
//                       placeholder="0"
//                     />
//                     <span className="text-sm text-gray-600 font-medium">marks</span>
//                   </div>
//                 ) : (
//                   <div className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
//                     <span className="font-bold text-gray-900">
//                       {group.subquestions.reduce((sum, sq) => sum + (parseFloat(sq.maxMarks) || 0), 0)}
//                     </span>
//                     <span className="text-sm text-gray-600 ml-1">marks total</span>
//                   </div>
//                 )}
//               </div>

//               {/* Parts Section */}
//               <div className="col-span-6">
//                 {group.subquestions.length === 0 ? (
//                   <div className="flex items-center justify-center h-12 border-2 border-dashed border-gray-300 rounded-lg">
//                     <span className="text-gray-500 text-sm font-medium">No parts - single question</span>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                     {group.subquestions.map((subquestion) => (
//                       <div key={subquestion.id} className="relative group/part">
//                         <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200">
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between mb-2">
//                               <span className="text-sm font-bold text-gray-800 bg-blue-100 px-2 py-1 rounded">
//                                 {subquestion.questionNumber}
//                               </span>
//                               <button
//                                 type="button"
//                                 onClick={() => removeSubquestion(group.id, subquestion.id)}
//                                 className="opacity-0 group-hover/part:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-all duration-200"
//                                 title="Remove part"
//                               >
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                               </button>
//                             </div>
//                             <div className="flex items-center">
//                               <input
//                                 type="number"
//                                 value={subquestion.maxMarks || ""}
//                                 onChange={(e) => updateMarks(group.id, e.target.value, subquestion.id)}
//                                 min="0"
//                                 step="0.5"
//                                 className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold shadow-sm"
//                                 placeholder="0"
//                               />
//                               <span className="ml-2 text-xs text-gray-600 font-medium">marks</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Actions */}
//               <div className="col-span-2 flex flex-col items-center justify-center gap-3">
//                 <button
//                   type="button"
//                   onClick={() => addSubquestion(group.id)}
//                   className="group/btn inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg min-w-[100px]"
//                   title="Add part"
//                 >
//                   <svg className="w-4 h-4 mr-2 group-hover/btn:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                   </svg>
//                   Add Part
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => removeQuestionGroup(group.id)}
//                   disabled={questionGroups.length <= 1 || group.questionNumber === "1"}
//                   className={`group/btn inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg focus:outline-none focus:ring-4 transition-all duration-200 shadow-md min-w-[100px] ${
//                     group.questionNumber === "1" 
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
//                       : questionGroups.length <= 1
//                         ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                         : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-200 transform hover:scale-105 hover:shadow-lg"
//                   }`}
//                   title={
//                     group.questionNumber === "1" 
//                       ? "Question 1 cannot be removed" 
//                       : questionGroups.length <= 1 
//                         ? "Cannot remove the only question" 
//                         : "Remove question"
//                   }
//                 >
//                   <svg className={`w-4 h-4 mr-2 transition-transform duration-200 ${
//                     group.questionNumber !== "1" && questionGroups.length > 1 ? "group-hover/btn:scale-110" : ""
//                   }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                   </svg>
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>

//     {/* Summary */}
//     <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-6">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-800">{questionGroups.length}</div>
//             <div className="text-sm text-blue-600 font-medium">Questions</div>
//           </div>
//           <div className="w-px h-12 bg-blue-200"></div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-800">
//               {questionGroups.reduce((sum, g) => sum + g.subquestions.length, 0)}
//             </div>
//             <div className="text-sm text-blue-600 font-medium">Total Parts</div>
//           </div>
//         </div>
//         <div className="text-right">
//           <div className="text-sm text-blue-600 font-medium mb-1">Total Marks</div>
//           <div className="text-3xl font-bold text-blue-800">{totalMarks}</div>
//         </div>
//       </div>
//     </div>
//   </div>
// );


//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6 max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Question Structure
//         </h2>
//         <div className="flex items-center gap-4">
//           <span
//             className={`px-3 py-1 rounded-full text-sm font-medium ${
//               totalMarks === parseFloat(maxMarks)
//                 ? "bg-green-100 text-green-800"
//                 : "bg-yellow-100 text-yellow-800"
//             }`}
//           >
//             Total: {totalMarks}/{maxMarks} marks
//           </span>
//           <button
//             type="button"
//             onClick={addQuestionGroup}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             Add Question
//           </button>
//         </div>
//       </div>

//       {/* Questions Table */}
//       <div className="overflow-x-auto">
//         <div className="min-w-full">
//           {/* Table Header */}
//           <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 rounded-t-lg border-b font-medium text-gray-700 text-sm">
//             <div className="col-span-2">Q. No.</div>
//             <div className="col-span-2">Marks</div>
//             <div className="col-span-6">Parts</div>
//             <div className="col-span-2 text-center">Actions</div>
//           </div>

//           {/* Question Rows */}
//           <div className="divide-y divide-gray-200">
//             {questionGroups.map((group, index) => (
//               <div key={group.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors">
//                 {/* Question Number */}
//                 <div className="col-span-2 flex items-center">
//                   <div className="flex items-center">
//                     <span className="text-lg font-medium text-gray-900 mr-2">Q.</span>
//                     <input
//                       type="text"
//                       value={group.questionNumber}
//                       onChange={(e) => updateQuestionNumber(group.id, e.target.value)}
//                       className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>

//                 {/* Main Question Marks */}
//                 <div className="col-span-2 flex items-center">
//                   {group.subquestions.length === 0 ? (
//                     <div className="flex items-center">
//                       <input
//                         type="number"
//                         value={group.maxMarks || ""}
//                         onChange={(e) => updateMarks(group.id, e.target.value)}
//                         min="0"
//                         step="0.5"
//                         className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="0"
//                       />
//                       <span className="ml-1 text-sm text-gray-500">marks</span>
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-500">
//                       <span className="font-medium">
//                         {group.subquestions.reduce((sum, sq) => sum + (parseFloat(sq.maxMarks) || 0), 0)}
//                       </span> marks total
//                     </div>
//                   )}
//                 </div>

//                 {/* Parts Section */}
//                 <div className="col-span-6">
//                   {group.subquestions.length === 0 ? (
//                     <div className="flex items-center text-gray-400 text-sm">
//                       <span>No parts - single question</span>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
//                       {group.subquestions.map((subquestion) => (
//                         <div key={subquestion.id} className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border">
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm font-medium text-gray-700">
//                                 {subquestion.questionNumber}
//                               </span>
//                               <button
//                                 type="button"
//                                 onClick={() => removeSubquestion(group.id, subquestion.id)}
//                                 className="text-red-500 hover:text-red-700 p-1"
//                                 title="Remove part"
//                               >
//                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                               </button>
//                             </div>
//                             <div className="flex items-center mt-1">
//                               <input
//                                 type="number"
//                                 value={subquestion.maxMarks || ""}
//                                 onChange={(e) => updateMarks(group.id, e.target.value, subquestion.id)}
//                                 min="0"
//                                 step="0.5"
//                                 className="w-14 px-1 py-0.5 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="0"
//                               />
//                               <span className="ml-1 text-xs text-gray-500">marks</span>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="col-span-2 flex flex-col items-center justify-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => addSubquestion(group.id)}
//                     className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
//                     title="Add part"
//                   >
//                     <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     Part
//                   </button>

//                   <button
//   type="button"
//   onClick={() => removeQuestionGroup(group.id)}
//   disabled={questionGroups.length <= 1 || group.questionNumber === "1"}
//   className={`inline-flex items-center px-3 py-1.5 ${
//     group.questionNumber === "1" 
//       ? "bg-gray-400 cursor-not-allowed" 
//       : "bg-red-600 hover:bg-red-700"
//   } text-white text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
//   title={
//     group.questionNumber === "1" 
//       ? "Question 1 cannot be removed" 
//       : questionGroups.length <= 1 
//         ? "Cannot remove the only question" 
//         : "Remove question"
//   }
// >
//   <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//   </svg>
//   Remove
// </button>

//                   {/* <button
//                     type="button"
//                     onClick={() => removeQuestionGroup(group.id)}
//                     disabled={questionGroups.length === 1}
//                     className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     title="Remove question"
//                   >
//                     <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                     </svg>
//                     Remove
//                   </button> */}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//         <div className="flex items-center justify-between">
//           <div className="text-sm text-blue-800">
//             <span className="font-medium">{questionGroups.length}</span> questions • 
//             <span className="font-medium ml-1">
//               {questionGroups.reduce((sum, g) => sum + g.subquestions.length, 0)}
//             </span> parts total
//           </div>
//           <div className="text-sm text-blue-800">
//             Total marks: <span className="font-bold text-lg">{totalMarks}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
};

export default QuestionStructure;