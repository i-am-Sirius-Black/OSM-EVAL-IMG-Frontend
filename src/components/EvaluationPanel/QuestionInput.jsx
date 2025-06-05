// import { useState, useRef, useEffect } from "react";
// import toast from "react-hot-toast";
// import ExamQuestionPopup from "./Modals/ExamQuestionPopup";

// const QuestionInput = ({ question, value, onChange }) => {
//   const [error, setError] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState({
//     number: 1,
//     imageUrl:
//       "https://media.cheggcdn.com/media/a7e/a7e0b2cb-aa80-4954-b88e-ef05e1dd9629/php7dZMd8",
//   });
//   const [popupOpen, setPopupOpen] = useState(false);

//   const inputRef = useRef(null);
//   const popupRef = useRef(null);

//   // Handle outside click to close popup
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(event.target) &&
//         popupOpen
//       ) {
//         closePopup();
//       }
//     }

//     // Add event listener when popup is open
//     if (popupOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     // Cleanup event listener
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [popupOpen]);

//   const handleChange = (e) => {
//     const val = e.target.value;
//     if (val === "") {
//       onChange("");
//       setError(false);
//       return;
//     }

//     const numVal = Number(val);
//     if (isNaN(numVal) || numVal < 0) return;

//     // Allow decimal values if maxMarks has decimals
//     onChange(val);
//     setError(false);
//   };

//   const handleBlur = () => {
//     const numVal = Number(value);
//     if (numVal > question.maxMark) {
//       setError(true);
//       inputRef.current?.focus();
//       showErrorToast(question);
//     }
//   };

//   const handleQuestionClick = (qNo) => {
//     setCurrentQuestion({
//       number: qNo, 
//       imageUrl:
//         "https://media.cheggcdn.com/media/a7e/a7e0b2cb-aa80-4954-b88e-ef05e1dd9629/php7dZMd8",
//     });
//     setPopupOpen(true);
//     toast.success(`Question ${qNo} clicked`);
//   };

//   const closePopup = () => {
//     setPopupOpen(false);
//   };


//   const showErrorToast = (question) => {
//     toast.error("Marks cannot exceed " + question.maxMark, {
//       duration: 3000,
//     });
//   };

//   return (
//     <div
//       className={`relative flex items-center ${error ? "animate-shake" : ""} `}
//     >
//       {/* <div onClick={() => handleQuestionClick(question.qNo)} className="w-10 text-sm font-medium text-gray-800 uppercase hover:cursor-pointer">{question.qNo}</div> */}

//       <div
//         onClick={() => handleQuestionClick(question.qNo)}
//         className="w-10 text-sm font-medium text-gray-700 uppercase 
//   hover:text-blue-500 hover:cursor-pointer
//   flex items-center transition-colors duration-150 relative"
//         title="Click to view question"
//       >
//         <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:left-0 after:bottom-0 after:transition-all after:duration-200 hover:after:w-full">
//           {question.qNo}
//         </span>
//       </div>

//       <input
//         ref={inputRef}
//         type="number"
//         min="0"
//         step="0.5" // Allow decimal input for partial marks
//         value={value}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         className={`w-14 h-9 text-sm text-center rounded border 
//           transition-colors focus:outline-none focus:ring-2
//           ${
//             error
//               ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
//               : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100"
//           }`}
//         placeholder="-"
//       />
//       <div className="w-12 text-xs pl-2 text-blue-700 font-semibold">
//         /{question.maxMark}
//       </div>

//       {/* The popup component */}
//       <ExamQuestionPopup
//         ref={popupRef}
//         isOpen={popupOpen}
//         onClose={closePopup}
//         questionNumber={currentQuestion.number}
//         questionText={currentQuestion.text}
//         questionImageUrl={currentQuestion.imageUrl}
//         position="right" // 'right', 'left', or 'center'
//       />
//     </div>
//   );
// };

// export default QuestionInput;




//? v3 "NA" Option Implementation

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ExamQuestionPopup from "./Modals/ExamQuestionPopup";

const QuestionInput = ({ question, value, onChange }) => {
  const [error, setError] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    number: 1,
    imageUrl:
      "https://media.cheggcdn.com/media/a7e/a7e0b2cb-aa80-4954-b88e-ef05e1dd9629/php7dZMd8",
  });
  const [popupOpen, setPopupOpen] = useState(false);

  const inputRef = useRef(null);
  const popupRef = useRef(null);

  // Handle outside click to close popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        popupOpen
      ) {
        closePopup();
      }
    }

    // Add event listener when popup is open
    if (popupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupOpen]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      onChange("");
      setError(false);
      return;
    }

    const numVal = Number(val);
    if (isNaN(numVal) || numVal < 0) return;

    // Allow decimal values if maxMarks has decimals
    onChange(val);
    setError(false);
  };

  const handleBlur = () => {
    // Skip validation for NA values
    if (value === "NA") return;
    
    const numVal = Number(value);
    if (numVal > question.maxMark) {
      setError(true);
      inputRef.current?.focus();
      showErrorToast(question);
    }
  };

  const handleQuestionClick = (qNo) => {
    setCurrentQuestion({
      number: qNo, 
      imageUrl:
        "https://media.cheggcdn.com/media/a7e/a7e0b2cb-aa80-4954-b88e-ef05e1dd9629/php7dZMd8",
    });
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const showErrorToast = (question) => {
    toast.error("Marks cannot exceed " + question.maxMark, {
      duration: 3000,
    });
  };

  // Toggle Not Attempted state
  const toggleNotAttempted = () => {
    if (value === "NA") {
      // If already NA, set it back to empty
      onChange("");
    } else {
      // Set to NA
      onChange("NA");
    }
  };

  return (
    <div
      className={`relative flex items-center ${error ? "animate-shake" : ""}`}
    >
      <div
        onClick={() => handleQuestionClick(question.qNo)}
        className={`w-6 text-sm font-medium uppercase 
          hover:text-blue-500 hover:cursor-pointer
          flex items-center transition-colors duration-150 relative
          ${value === "NA" ? "text-gray-400" : "text-gray-700"}`}
        title="Click to view question"
      >
        <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:left-0 after:bottom-0 after:transition-all after:duration-200 hover:after:w-full">
          {question.qNo}
        </span>
      </div>

      <div className="flex items-center">
        <input
          ref={inputRef}
          type={value === "NA" ? "text" : "number"}
          min="0"
          step="0.5"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={value === "NA"}
          className={`w-14 h-9 text-sm text-center rounded border 
            transition-colors focus:outline-none focus:ring-2
            ${
              value === "NA"
                ? "bg-gray-100 text-gray-500 border-gray-200"
                : error
                ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
                : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100"
            }`}
          placeholder="-"
          readOnly={value === "NA"}
        />
        <div className={`text-xs pl-1 font-semibold ${value === "NA" ? "text-gray-400" : "text-blue-700"}`}>
          /{question.maxMark}
        </div>
      </div>

      {/* NA Toggle Button */}
      <button
        onClick={toggleNotAttempted}
        type="button"
        className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
          value === "NA"
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
        title={value === "NA" ? "Mark as attempted" : "Mark as not attempted"}
      >
        NA
      </button>

      {/* The popup component */}
      <ExamQuestionPopup
        ref={popupRef}
        isOpen={popupOpen}
        onClose={closePopup}
        questionNumber={currentQuestion.number}
        questionText={currentQuestion.text}
        questionImageUrl={currentQuestion.imageUrl}
        position="right"
      />
    </div>
  );
};

export default QuestionInput;



//?V2: Enhanced QuestionInput Component with "NA" Option

// import { useState, useRef, useEffect } from "react";
// import toast from "react-hot-toast";
// import ExamQuestionPopup from "./Modals/ExamQuestionPopup";

// const QuestionInput = ({ question, value, onChange }) => {
//   const [error, setError] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState({
//     number: 1,
//     imageUrl:
//       "https://media.cheggcdn.com/media/a7e/a7e0b2cb-aa80-4954-b88e-ef05e1dd9629/php7dZMd8",
//   });
//   const [popupOpen, setPopupOpen] = useState(false);

//   const inputRef = useRef(null);
//   const popupRef = useRef(null);

//   // Handle outside click to close popup
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(event.target) &&
//         popupOpen
//       ) {
//         closePopup();
//       }
//     }

//     // Add event listener when popup is open
//     if (popupOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     // Cleanup event listener
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [popupOpen]);

//   const handleChange = (e) => {
//     const val = e.target.value;
//     if (val === "") {
//       onChange("");
//       setError(false);
//       return;
//     }

//     // If NA is typed in, convert it to the NA special value
//     if (val.toUpperCase() === "NA") {
//       toggleNotAttempted();
//       return;
//     }

//     const numVal = Number(val);
//     if (isNaN(numVal) || numVal < 0) return;

//     // Allow decimal values if maxMarks has decimals
//     onChange(val);
//     setError(false);
//   };

//   const handleBlur = () => {
//     // Skip validation for NA values
//     if (value === "NA") return;
    
//     const numVal = Number(value);
//     if (numVal > question.maxMark) {
//       setError(true);
//       inputRef.current?.focus();
//       showErrorToast(question);
//     }
//   };

//   const handleQuestionClick = (qNo) => {
//     setCurrentQuestion({
//       number: qNo,
//       imageUrl:
//         "https://media.cheggcdn.com/media/a7e/a7e0b2cb-aa80-4954-b88e-ef05e1dd9629/php7dZMd8",
//     });
//     setPopupOpen(true);
//     toast.success(`Question ${qNo} clicked`);
//   };

//   const closePopup = () => {
//     setPopupOpen(false);
//   };

//   const showErrorToast = (question) => {
//     toast.error("Marks cannot exceed " + question.maxMark, {
//       duration: 3000,
//     });
//   };

//   // New function to toggle between NA and normal input
//   const toggleNotAttempted = () => {
//     if (value === "NA") {
//       // If already NA, set it back to empty
//       onChange("");
//     } else {
//       // Set to NA
//       onChange("NA");
//     }
//   };

//   return (
//     <div
//       className={`relative flex items-center ${error ? "animate-shake" : ""} `}
//     >
//       <div
//         onClick={() => handleQuestionClick(question.qNo)}
//         className={`w-10 text-sm font-medium uppercase 
//           hover:text-blue-500 hover:cursor-pointer
//           flex items-center transition-colors duration-150 relative
//           ${value === "NA" ? "text-gray-400" : "text-gray-700"}`}
//         title="Click to view question"
//       >
//         <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:left-0 after:bottom-0 after:transition-all after:duration-200 hover:after:w-full">
//           {question.qNo}
//         </span>
//       </div>

//       <input
//         ref={inputRef}
//         type="text" // Changed to text to support "NA"
//         min="0"
//         step="0.5" // Allow decimal input for partial marks
//         value={value}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         disabled={value === "NA"}
//         className={`w-14 h-9 text-sm text-center rounded border 
//           transition-colors focus:outline-none focus:ring-2
//           ${
//             value === "NA"
//               ? "bg-gray-100 text-gray-500 border-gray-200"
//               : error
//               ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
//               : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100"
//           }`}
//         placeholder="-"
//       />
      
//       <div className={`w-12 text-xs pl-2 font-semibold ${value === "NA" ? "text-gray-400" : "text-blue-700"}`}>
//         /{question.maxMark}
//       </div>

//       {/* NA Toggle Button */}
//       <button
//         onClick={toggleNotAttempted}
//         type="button"
//         className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
//           value === "NA"
//             ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//         }`}
//         title={value === "NA" ? "Mark as attempted" : "Mark as not attempted"}
//       >
//         NA
//       </button>

//       {/* The popup component */}
//       <ExamQuestionPopup
//         ref={popupRef}
//         isOpen={popupOpen}
//         onClose={closePopup}
//         questionNumber={currentQuestion.number}
//         questionText={currentQuestion.text}
//         questionImageUrl={currentQuestion.imageUrl}
//         position="right" // 'right', 'left', or 'center'
//       />
//     </div>
//   );
// };

// export default QuestionInput;