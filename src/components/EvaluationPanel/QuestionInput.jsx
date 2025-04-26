// import { useState } from "react";

// function QuestionInput({ question, value, onChange }) {
//     const [warning, setWarning] = useState(null);
  
//     const handleChange = (e) => {
//       const val = Number(e.target.value);
//       if (val > question.maxMarks) {
//         setWarning(`Marks cannot exceed ${question.maxMarks}.`);
//       } else {
//         setWarning(null);
//         onChange(val);
//       }
//     };
  
//     return (
//       <div className="flex items-center justify-between  bg-gray-50 p-3 rounded-lg shadow-sm">
//         <span className="text-sm font-medium text-gray-700">{question.id}</span>
//         <div className="flex items-center space-x-2">
//           <input
//             type="number"
//             min="0"
//             max={question.maxMarks}
//             value={value}
//             onChange={handleChange}
//             className="w-16 p-2 text-xs text-center border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="0"
//           />
//           <span className="text-sm text-gray-500">/ {question.maxMarks}</span>
//         </div>
//         {warning && (
//           <div className="absolute mt-12 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md text-xs">
//             {warning}
//           </div>
//         )}
//       </div>
//     );
//   }
  
//   export default QuestionInput;


//?v2 ui update data update
// import { useState } from "react";

// function QuestionInput({ question, value, onChange }) {
//   const [warning, setWarning] = useState(null);

//   const handleChange = (e) => {
//     const val = Number(e.target.value);
//     if (val > question.maxMarks) {
//       setWarning(`Max ${question.maxMarks} marks`);
//     } else {
//       setWarning(null);
//       onChange(val);
//     }
//   };

//   return (
//     <div className="flex items-center bg-white border border-gray-200 rounded-md relative group">
//       <span className="px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50 rounded-l-md w-16">
//         {question.id}
//       </span>
//       <input
//         type="number"
//         min="0"
//         max={question.maxMarks}
//         value={value}
//         onChange={handleChange}
//         className="w-full p-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-md"
//         placeholder="0"
//       />
//       <span className="absolute right-2 text-xs text-gray-400">
//         /{question.maxMarks}
//       </span>
//       {warning && (
//         <div className="absolute -bottom-6 left-0 right-0 text-xs text-red-500 text-center">
//           {warning}
//         </div>
//       )}
//     </div>
//   );
// }

// export default QuestionInput;


//? v2.1 ui update minimal

// import { useState, useRef } from "react";

// function QuestionInput({ question, value, onChange }) {
//   const [error, setError] = useState(null);
//   const inputRef = useRef(null);

//   const handleChange = (e) => {
//     const val = e.target.value;
//     // Allow empty value for initial state
//     if (val === '') {
//       onChange('');
//       setError(null);
//       return;
//     }

//     const numVal = Number(val);
//     // Basic validation
//     if (isNaN(numVal) || numVal < 0) {
//       return;
//     }

//     onChange(val);
//     setError(null);
//   };

//   const handleBlur = () => {
//     const numVal = Number(value);
//     if (numVal > question.maxMarks) {
//       setError(`Maximum marks is ${question.maxMarks}`);
//       inputRef.current?.focus();
//     }
//   };

//   return (
//     <div className={`relative p-2 rounded-lg transition-colors ${error ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
//       <div className="flex items-center justify-between gap-2">
//         <span className="text-sm font-medium text-gray-700 min-w-[40px]">
//           {question.id}
//         </span>
//         <div className="flex items-center gap-1">
//           <input
//             ref={inputRef}
//             type="number"
//             min="0"
//             value={value}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className={`w-14 p-1.5 text-sm text-center border rounded-md focus:outline-none focus:ring-2 
//               ${error 
//                 ? 'border-red-300 focus:ring-red-200' 
//                 : 'border-gray-200 focus:ring-blue-100'}`}
//             placeholder="-"
//           />
//           <span className="text-xs text-gray-400 min-w-[24px]">
//             /{question.maxMarks}
//           </span>
//         </div>
//       </div>
//       {error && (
//         <div className="absolute -bottom-1 left-0 right-0 transform translate-y-full px-2 py-1 bg-red-100 text-red-700 text-xs rounded mt-1 z-10">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// }

// export default QuestionInput;


//?

import { useState, useRef } from "react";

const QuestionInput = ({ question, value, onChange }) => {
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      onChange('');
      setError(false);
      return;
    }

    const numVal = Number(val);
    if (isNaN(numVal) || numVal < 0) return;
    
    onChange(val);
    setError(false);
  };

  const handleBlur = () => {
    const numVal = Number(value);
    if (numVal > question.maxMarks) {
      setError(true);
      inputRef.current?.focus();
    }
  };

  return (
    <div className={`relative flex items-center ${error ? 'animate-shake' : ''}`}>
      <div className="w-8 text-sm font-semibold text-red-700">{question.id}</div>
      <input
        ref={inputRef}
        type="number"
        min="0"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-14 h-8 text-sm text-center rounded border 
          transition-colors focus:outline-none focus:ring-1
          ${error 
            ? 'border-red-200 bg-red-50 focus:border-red-400 focus:ring-red-200' 
            : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
          }`}
        placeholder="-"
      />
      <div className="w-8 text-xs pl-2 text-blue-700 font-semibold">/{question.maxMarks}</div>
    </div>
  );
};

export default QuestionInput;


