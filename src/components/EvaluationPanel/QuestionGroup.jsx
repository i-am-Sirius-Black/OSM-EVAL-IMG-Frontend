// import QuestionInput from './QuestionInput';

// const QuestionGroup = ({ question, marks, setMarks }) => {
//   // Early return if this isn't a question with parts
//   if (!question.hasParts) {
//     return (
//       <QuestionInput
//         key={question.sno}
//         question={question}
//         value={marks[question.qNo] || ""}
//         onChange={(value) => setMarks((prev) => ({ ...prev, [question.qNo]: value }))}
//       />
//     );
//   }
  
//   // For questions with parts, generate subparts dynamically
//   const letters = 'abcdefghijklmnopqrstuvwxyz';
//   const partMark = question.partMarks || (question.maxMark / question.partsCount);
  
//   // Generate all the parts
//   const parts = [];
//   for (let i = 0; i < question.partsCount; i++) {
//     const partQNo = `${question.qNo}${letters[i]}`;
//     parts.push({
//       sno: `${question.sno}-${i+1}`,
//       qNo: partQNo,
//       maxMark: partMark,
//       isSubpart: true,
//       parentQNo: question.qNo
//     });
//   }
  
//   return (
//     <div className="border-b pb-3 mb-3 last:border-0">
//       <div className="flex items-center mb-2">
//         <span className="text-sm font-semibold text-gray-800 mr-2">
//           Question {question.qNo}
//         </span>
        
//         {question.isChoiceBased && (
//           <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
//             Choose {question.choiceAttemptCount} of {question.partsCount}
//           </span>
//         )}
        
//         <span className="ml-auto text-xs text-gray-500">
//           {question.maxMark} marks
//         </span>
//       </div>
      
//       <div className="grid grid-cols-2 gap-3 pl-4">
//         {parts.map((part) => (
//           <QuestionInput
//             key={part.qNo}
//             question={part}
//             value={marks[part.qNo] || ""}
//             onChange={(value) => setMarks((prev) => ({ ...prev, [part.qNo]: value }))}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuestionGroup;


//?consitent ui/ux

// import React from 'react';
// import QuestionInput from './QuestionInput';

// const QuestionGroup = ({ question, marks, setMarks }) => {
//   // For questions without parts, render with consistent UI but as a single question
//   if (!question.hasParts) {
//     return (
//       <div className="border-b last:border-0">
//         <div className="flex items-center mb-2">
//           <span className="text-sm font-semibold text-gray-800 mr-2">
//             Question {question.qNo}
//           </span>
//           <span className="ml-auto text-xs text-gray-500">
//             {question.maxMark} marks
//           </span>
//         </div>
        
//         <div className="grid grid-cols-2 gap-3 pl-4">
//           <QuestionInput
//             key={question.sno}
//             question={question}
//             value={marks[question.qNo] || ""}
//             onChange={(value) => setMarks((prev) => ({ ...prev, [question.qNo]: value }))}
//           />
//         </div>
//       </div>
//     );
//   }
  
//   // For questions with parts, generate subparts dynamically
//   const letters = 'abcdefghijklmnopqrstuvwxyz';
//   const partMark = question.partMarks || (question.maxMark / question.partsCount);
  
//   // Generate all the parts
//   const parts = [];
//   for (let i = 0; i < question.partsCount; i++) {
//     const partQNo = `${question.qNo}${letters[i]}`;
//     parts.push({
//       sno: `${question.sno}-${i+1}`,
//       qNo: partQNo,
//       maxMark: partMark,
//       isSubpart: true,
//       parentQNo: question.qNo
//     });
//   }
  
//   return (
//     <div className="border-b last:border-0">
//       <div className="flex items-center mb-2">
//         <span className="text-sm font-semibold text-gray-800 mr-2">
//           Question {question.qNo}
//         </span>
        
//         {question.isChoiceBased && (
//           <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
//             Choose {question.choiceAttemptCount} of {question.partsCount}
//           </span>
//         )}
        
//         <span className="ml-auto text-xs text-gray-500">
//           {question.maxMark} marks
//         </span>
//       </div>
      
//       <div className="grid grid-cols-2 gap-3 pl-4">
//         {parts.map((part) => (
//           <QuestionInput
//             key={part.qNo}
//             question={part}
//             value={marks[part.qNo] || ""}
//             onChange={(value) => setMarks((prev) => ({ ...prev, [part.qNo]: value }))}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuestionGroup;

//?v2 more logic validation and consistent UI/UX

import React from 'react';
import QuestionInput from './QuestionInput';

const QuestionGroup = ({ question, marks, setMarks }) => {
  // For questions without parts, render with consistent UI but as a single question
  if (!question.hasParts) {
    return (
      <div>
        <div className="flex items-center mb-2">
          <span className="text-sm font-semibold text-gray-800 mr-2">
            Question {question.qNo}
          </span>
          <span className="ml-auto text-xs font-bold text-gray-500">
            {question.maxMark} marks
          </span>
        </div>
        
        <div className="pl-4">
          <QuestionInput
            key={question.sno}
            question={question}
            value={marks[question.qNo] || ""}
            onChange={(value) => setMarks((prev) => ({ ...prev, [question.qNo]: value }))}
          />
        </div>
      </div>
    );
  }
  
  // For questions with parts, generate subparts dynamically
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const partMark = question.partMarks || (question.maxMark / question.partsCount);
  
  // Generate all the parts
  const parts = [];
  for (let i = 0; i < question.partsCount; i++) {
    const partQNo = `${question.qNo}${letters[i]}`;
    parts.push({
      sno: `${question.sno}-${i+1}`,
      qNo: partQNo,
      maxMark: partMark,
      isSubpart: true,
      parentQNo: question.qNo
    });
  }

  // For choice-based questions, count how many parts have been marked
  const markedPartsCount = question.isChoiceBased ? 
    parts.filter(part => {
      const mark = marks[part.qNo];
      return mark !== undefined && mark !== "" && mark !== "NA";
    }).length : 0;
  
  // Check if we've exceeded the allowed number of marked parts
  const tooManyMarked = question.isChoiceBased && 
    markedPartsCount > question.choiceAttemptCount;
  
  return (
    <div>
      <div className="flex items-center mb-2">
        <span className="text-sm font-semibold text-gray-800 mr-2">
          Question {question.qNo}
        </span>
        
        {question.isChoiceBased && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            tooManyMarked ? 
              "bg-red-100 text-red-800" : 
              "bg-yellow-100 text-yellow-800"
          }`}>
            Choose {question.choiceAttemptCount} of {question.partsCount}
            {tooManyMarked && ` (${markedPartsCount} marked)`}
          </span>
        )}
        
        <span className="ml-auto text-xs font-bold text-gray-500">
          {question.maxMark} marks
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 pl-4">
        {parts.map((part) => (
          <QuestionInput
            key={part.qNo}
            question={part}
            value={marks[part.qNo] || ""}
            onChange={(value) => {
              // For choice-based questions, we might need to validate on change
              if (question.isChoiceBased) {
                const newMarks = { ...marks, [part.qNo]: value };
                
                // Count marked parts with the new value
                const markedCount = parts.filter(p => {
                  const mark = p.qNo === part.qNo ? value : newMarks[p.qNo];
                  return mark !== undefined && mark !== "" && mark !== "NA";
                }).length;
                
                // If we're about to exceed the limit and this is a new mark, show warning
                if (markedCount > question.choiceAttemptCount && value !== "" && value !== "NA") {
                  // We could show a toast here, but we'll let the validation logic handle it
                }
              }
              
              // Always update the marks
              setMarks((prev) => ({ ...prev, [part.qNo]: value }));
            }}
            isChoicePart={question.isChoiceBased}
            choiceAttemptCount={question.choiceAttemptCount}
            isOverLimit={tooManyMarked}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionGroup;


