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
//   };

//   const closePopup = () => {
//     setPopupOpen(false);
//   };

//   const showErrorToast = (question) => {
//     toast.error("Marks cannot exceed " + question.maxMark, {
//       duration: 3000,
//     });
//   };

//   // Toggle Not Attempted state
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
//       className={`relative flex items-center ${error ? "animate-shake" : ""}`}
//     >
//       <div
//         onClick={() => handleQuestionClick(question.qNo)}
//         className={`w-6 text-sm font-medium uppercase
//           hover:text-blue-500 hover:cursor-pointer
//           flex items-center transition-colors duration-150 relative
//           ${value === "NA" ? "text-gray-400" : "text-gray-700"}`}
//         title="Click to view question"
//       >
//         <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:left-0 after:bottom-0 after:transition-all after:duration-200 hover:after:w-full">
//           {question.qNo}
//         </span>
//       </div>

//       <div className="flex items-center">
//         <input
//           ref={inputRef}
//           type={value === "NA" ? "text" : "number"}
//           min="0"
//           step="0.5"
//           value={value}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           disabled={value === "NA"}
//           className={`w-14 h-9 text-sm text-center rounded border
//             transition-colors focus:outline-none focus:ring-2
//             ${
//               value === "NA"
//                 ? "bg-gray-100 text-gray-500 border-gray-200"
//                 : error
//                 ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
//                 : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100"
//             }`}
//           placeholder="-"
//           readOnly={value === "NA"}
//         />
//         <div className={`text-xs pl-1 font-semibold ${value === "NA" ? "text-gray-400" : "text-blue-700"}`}>
//           /{question.maxMark}
//         </div>
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
//         position="right"
//       />
//     </div>
//   );
// };

// export default QuestionInput;

//?v2 (testing) -show a visual indicator for choice-based questions

// import { useState, useRef, useEffect } from "react";
// import toast from "react-hot-toast";
// import ExamQuestionPopup from "./Modals/ExamQuestionPopup";

// const QuestionInput = ({
//   question,
//   value,
//   onChange,
//   isChoicePart = false,
//   choiceAttemptCount = 0,
//   isOverLimit = false,
// }) => {
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
//   };

//   const closePopup = () => {
//     setPopupOpen(false);
//   };

//   const showErrorToast = (question) => {
//     toast.error("Marks cannot exceed " + question.maxMark, {
//       duration: 3000,
//     });
//   };

//   // Toggle Not Attempted state
//   const toggleNotAttempted = () => {
//     if (value === "NA") {
//       // If already NA, set it back to empty
//       onChange("");
//     } else {
//       // Set to NA
//       onChange("NA");
//     }
//   };


//   //?v2

//     return (
//     <div
//       className={`relative flex items-center ${error ? "animate-shake" : ""} 
//         ${isChoicePart && isOverLimit && value && value !== "NA" ? "bg-red-50 rounded p-1" : ""}`}
//     >
//       <div
//         onClick={() => handleQuestionClick(question.qNo)}
//         className={`w-6 text-sm font-medium uppercase 
//           hover:text-blue-500 hover:cursor-pointer
//           flex items-center transition-colors duration-150 relative
//           ${value === "NA" ? "text-gray-400" : 
//             isChoicePart && isOverLimit && value && value !== "NA" ? "text-red-600" : "text-gray-700"}`}
//         title="Click to view question"
//       >
//         <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:left-0 after:bottom-0 after:transition-all after:duration-200 hover:after:w-full">
//           {question.qNo}
//         </span>
//       </div>

//       <div className="flex items-center">
//         <input
//           ref={inputRef}
//           type={value === "NA" ? "text" : "number"}
//           min="0"
//           step="0.5"
//           value={value}
//           onChange={handleChange}
//           onBlur={handleBlur} 
//           disabled={value === "NA"}
//           className={`w-14 h-9 text-sm text-center rounded border 
//             transition-colors focus:outline-none focus:ring-2
//             ${
//               value === "NA"
//                 ? "bg-gray-100 text-gray-500 border-gray-200"
//                 : error || (isChoicePart && isOverLimit && value)
//                 ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
//                 : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100"
//             }`}
//           placeholder="-"
//           readOnly={value === "NA"}
//         />
//         <div className={`text-xs pl-1 font-semibold ${
//           value === "NA" ? "text-gray-400" : 
//           isChoicePart && isOverLimit && value ? "text-red-700" : "text-blue-700"
//         }`}>
//           /{question.maxMark}
//         </div>
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

//       {/* Visual indicator for choice-based questions */}
//       {isChoicePart && isOverLimit && value && value !== "NA" && (
//         <span className="absolute -top-1 -right-1 flex h-3 w-3">
//           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//           <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//         </span>
//       )}

//       {/* The popup component */}
//       <ExamQuestionPopup
//         ref={popupRef}
//         isOpen={popupOpen}
//         onClose={closePopup}
//         questionNumber={currentQuestion.number}
//         questionText={currentQuestion.text}
//         questionImageUrl={currentQuestion.imageUrl}
//         position="right"
//       />
//     </div>
//   );

//   // return (
//   //   <div
//   //     className={`relative flex items-center ${error ? "animate-shake" : ""}`}
//   //   >
//   //     <div
//   //       onClick={() => handleQuestionClick(question.qNo)}
//   //       className={`w-6 text-sm font-medium uppercase 
//   //         hover:text-blue-500 hover:cursor-pointer
//   //         flex items-center transition-colors duration-150 relative
//   //         ${value === "NA" ? "text-gray-400" : "text-gray-700"}`}
//   //       title="Click to view question"
//   //     >
//   //       <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:left-0 after:bottom-0 after:transition-all after:duration-200 hover:after:w-full">
//   //         {question.qNo}
//   //       </span>
//   //     </div>

//   //     <div className="flex items-center">
//   //       <input
//   //         ref={inputRef}
//   //         type={value === "NA" ? "text" : "number"}
//   //         min="0"
//   //         step="0.5"
//   //         value={value}
//   //         onChange={handleChange}
//   //         onBlur={handleBlur}
//   //         disabled={value === "NA"}
//   //         className={`w-14 h-9 text-sm text-center rounded border 
//   //           transition-colors focus:outline-none focus:ring-2
//   //           ${
//   //             value === "NA"
//   //               ? "bg-gray-100 text-gray-500 border-gray-200"
//   //               : error
//   //               ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
//   //               : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100"
//   //           }`}
//   //         placeholder="-"
//   //         readOnly={value === "NA"}
//   //       />
//   //       <div
//   //         className={`text-xs pl-1 font-semibold ${
//   //           value === "NA" ? "text-gray-400" : "text-blue-700"
//   //         }`}
//   //       >
//   //         /{question.maxMark}
//   //       </div>
//   //     </div>

//   //     {/* NA Toggle Button */}
//   //     <button
//   //       onClick={toggleNotAttempted}
//   //       type="button"
//   //       className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
//   //         value === "NA"
//   //           ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
//   //           : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//   //       }`}
//   //       title={value === "NA" ? "Mark as attempted" : "Mark as not attempted"}
//   //     >
//   //       NA
//   //     </button>

//   //     {/* The popup component */}
//   //     <ExamQuestionPopup
//   //       ref={popupRef}
//   //       isOpen={popupOpen}
//   //       onClose={closePopup}
//   //       questionNumber={currentQuestion.number}
//   //       questionText={currentQuestion.text}
//   //       questionImageUrl={currentQuestion.imageUrl}
//   //       position="right"
//   //     />
//   //   </div>
//   // );
// };

// export default QuestionInput;

//?v3 removing na and simple visual indicator for choice-based questions

// import { useState, useRef, useEffect } from "react";
// import toast from "react-hot-toast";
// import ExamQuestionPopup from "./Modals/ExamQuestionPopup";

// const QuestionInput = ({
//   question,
//   value,
//   onChange,
//   isChoicePart = false,
//   choiceAttemptCount = 0,
//   isOverLimit = false,
// }) => {
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
//     if (!value) return;
    
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
//     <div className={`relative flex items-center ${error ? "animate-shake" : ""}`}>
//       <div
//         onClick={() => handleQuestionClick(question.qNo)}
//         className="w-6 text-sm font-medium uppercase hover:text-blue-500 hover:cursor-pointer flex items-center transition-colors duration-150 relative text-gray-700"
//         title="Click to view question"
//       >
//         <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:left-0 after:bottom-0 after:transition-all after:duration-200 hover:after:w-full">
//           {question.qNo}
//         </span>
//       </div>

//       <div className="flex items-center">
//         <input
//           ref={inputRef}
//           type="number"
//           min="0"
//           step="0.5"
//           value={value}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           className={`w-14 h-9 text-sm text-center rounded border transition-colors focus:outline-none focus:ring-2 ${
//             error
//               ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
//               : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100"
//           }`}
//           placeholder="-"
//         />
//         <div className="text-xs pl-1 font-semibold text-blue-700">
//           /{question.maxMark}
//         </div>
//       </div>

//       {/* The popup component */}
//       <ExamQuestionPopup
//         ref={popupRef}
//         isOpen={popupOpen}
//         onClose={closePopup}
//         questionNumber={currentQuestion.number}
//         questionText={currentQuestion.text}
//         questionImageUrl={currentQuestion.imageUrl}
//         position="right"
//       />
//     </div>
//   );
// };

// export default QuestionInput;

//?v4 - ui/ux update to clear input to default easily

// import { useState, useRef, useEffect } from "react";
// import toast from "react-hot-toast";
// import ExamQuestionPopup from "./Modals/ExamQuestionPopup";

// const QuestionInput = ({
//   question,
//   value,
//   onChange,
//   isChoicePart = false,
//   choiceAttemptCount = 0,
//   isOverLimit = false,
// }) => {
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
//     if (!value) return;
    
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
//   };

//   const closePopup = () => {
//     setPopupOpen(false);
//   };

//   const showErrorToast = (question) => {
//     toast.error("Marks cannot exceed " + question.maxMark, {
//       duration: 3000,
//     });
//   };

//   // Function to clear the input value
//   const clearValue = () => {
//     onChange("");
//   };

//   return (
//     <div className={`relative flex items-center ${error ? "animate-shake" : ""}`}>
//       <div
//         onClick={() => handleQuestionClick(question.qNo)}
//         className="w-6 text-sm font-medium uppercase hover:text-blue-500 hover:cursor-pointer flex items-center transition-colors duration-150 relative text-gray-700"
//         title="Click to view question"
//       >
//         <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:left-0 after:bottom-0 after:transition-all after:duration-200 hover:after:w-full">
//           {question.qNo}
//         </span>
//       </div>

//       <div className="flex items-center">
//         <div className="relative">
//           <input
//             ref={inputRef}
//             type="number"
//             min="0"
//             step="0.5"
//             value={value}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className={`w-14 h-9 text-sm text-center rounded border transition-colors focus:outline-none focus:ring-2 ${
//               error
//                 ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
//                 : isChoicePart && isOverLimit && value
//                 ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
//                 : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100"
//             }`}
//             placeholder="-"
//           />
          
//           {/* Clear button for choice-based questions that are over limit */}
//           {isChoicePart && isOverLimit && value && (
//             <button
//               type="button"
//               onClick={clearValue}
//               className="absolute right-0 top-0 h-full flex items-center justify-center w-6 text-red-500 hover:text-red-700"
//               title="Clear value"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </button>
//           )}
//         </div>
//         <div className={`text-xs pl-1 font-semibold ${
//           isChoicePart && isOverLimit && value ? "text-red-700" : "text-blue-700"
//         }`}>
//           /{question.maxMark}
//         </div>
//       </div>

//       {/* The popup component */}
//       <ExamQuestionPopup
//         ref={popupRef}
//         isOpen={popupOpen}
//         onClose={closePopup}
//         questionNumber={currentQuestion.number}
//         questionText={currentQuestion.text}
//         questionImageUrl={currentQuestion.imageUrl}
//         position="right"
//       />
//     </div>
//   );
// };

// export default QuestionInput;


//? v5 (trying new ui/ux)

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ExamQuestionPopup from "./Modals/ExamQuestionPopup";

const QuestionInput = ({
  question,
  value,
  onChange,
  isChoicePart = false,
  choiceAttemptCount = 0,
  isOverLimit = false,
}) => {
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

    if (popupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

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

    onChange(val);
    setError(false);
  };

  const handleBlur = () => {
    if (!value) return;
    
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

  // Clear function for error states
  const clearValue = () => {
    onChange("");
    setError(false);
  };

  // Only show clear button on actual error states
  const isErrorState = error || (isChoicePart && isOverLimit && value);

  return (
    <div className={`relative flex items-center ${error ? "animate-shake" : ""}`}>
      <div
        onClick={() => handleQuestionClick(question.qNo)}
        className="w-6 text-sm font-medium uppercase hover:text-blue-500 hover:cursor-pointer flex items-center transition-colors duration-150 relative text-gray-700"
        title="Click to view question"
      >
        <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:left-0 after:bottom-0 after:transition-all after:duration-200 hover:after:w-full">
          {question.qNo}
        </span>
      </div>

      <div className="flex items-center">
        <input
          ref={inputRef}
          type="number"
          min="0"
          step="0.5"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-14 h-9 text-sm text-center rounded border transition-colors focus:outline-none focus:ring-2 ${
            error
              ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
              : isChoicePart && isOverLimit && value
              ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
              : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100"
          }`}
          placeholder="-"
        />
        
        {/* Clear button - outside input, only visible on error states */}
        {isErrorState && (
          <button
            type="button"
            onClick={clearValue}
            className="ml-1 text-red-400 hover:text-red-600 transition-colors duration-150 p-1 rounded hover:bg-red-100"
            title="Clear invalid value"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3.5 w-3.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <div className={`text-xs pl-1 font-semibold ${
          isChoicePart && isOverLimit && value ? "text-red-700" : "text-blue-700"
        }`}>
          /{question.maxMark}
        </div>
      </div>

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