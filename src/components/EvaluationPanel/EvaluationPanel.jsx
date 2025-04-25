// import { memo, useEffect, useState } from 'react';
// import QuestionInput from './QuestionInput';

// const EvaluationPanel = memo(({ marks, setMarks, annotations }) => {

//   const questions = [
//     { id: 'Q1', maxMarks: 20 },
//     { id: 'Q2', maxMarks: 20 },
//     { id: 'Q3', maxMarks: 20 },
//     { id: 'Q4A', maxMarks: 30 },
//     { id: 'Q4B', maxMarks: 10 },
//   ];

//   const annotatedPages = Array.from(new Set(annotations.map((a) => a.page)));
//   const totalMarks = Object.values(marks).reduce((sum, mark) => sum + (Number(mark) || 0), 0);

// 🔍 Find unannotated pages  // future usage
// const totalPages = 36;
// const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
// const notAnnotatedPages = allPages.filter((p) => !annotatedPages.includes(p));

//     const handleSubmit = () => {
// const jsonObject = {
//   annotations: annotations.map(annotation => ({
//     id: annotation.id,
//     type: annotation.type,
//     page: annotation.page,
//     position: annotation.position,
//     text: annotation.text,
//   })),
// };
// console.log("JSON Object to be sent to the API:", jsonObject);
//     };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-grow overflow-y-auto">
//         <div className="mb-4">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-semibold text-gray-600">Total Marks:</span>
//             <span className="text-lg font-bold text-red-600">{totalMarks} / 100</span>
//           </div>
//         </div>
//         <div className="space-y-3">
//           {questions.map((q) => (
//             <QuestionInput
//               key={q.id}
//               question={q}
//               value={marks[q.id] || ''}
//               onChange={(value) => setMarks((prev) => ({ ...prev, [q.id]: value }))}
//             />
//           ))}
//         </div>
//         <div className="mt-6 text-sm text-gray-600">
//           <span>Pages Annotated: </span>
//           <span className="font-medium">{annotatedPages.length} / 36</span>
//         </div>
//       </div>

//       <div className='flex items-center justify-center gap-2'>
//       <button onClick={handleSubmit} type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm py-1 px-3.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Submit</button>
//       <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm py-1 px-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Reject</button>
//       </div>
//     </div>
//   );
// });

// export default EvaluationPanel;



//?v1
// import { memo, useState } from "react";
// import QuestionInput from "./QuestionInput";

// const EvaluationPanel = memo(({ marks, setMarks, annotations }) => {
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

//   console.log("not annotated pages->", notAnnotatedPages);

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
//           <div className="text-gray-700 p-4 overflow-x-auto">
//             <div className="flex gap-2 flex-wrap  max-h-5 max-w-full">
//               {notAnnotatedPages.map((page) => (
//                 <span
//                   key={page}
//                   className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100 text-red-700 text-sm font-medium"
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
//         <div className="mt-6 text-sm text-gray-600">
//           <span>Pages Annotated: </span>
//           <span className="font-medium">{annotatedPages.length} / 36</span>
//         </div>

    
//         <div className="mb-3">
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
//         {renderTabContent()}
//       </div>

//       <div className="flex items-center justify-center gap-2">
//         {/* <button 
//           onClick={handleSubmit} 
//           type="button" 
//           className={`text-white ${allPagesAnnotated && allMarksValid ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm py-1 px-3.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`} 
//           disabled={!allPagesAnnotated || !allMarksValid}
//         > */}
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
//           className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm py-1 px-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
//         >
//           Reject
//         </button>
//       </div>
//     </div>
//   );

// });

// export default EvaluationPanel;

//?v2 little bit tabs update
import { memo, useState } from "react";
import QuestionInput from "./QuestionInput";

const EvaluationPanel = memo(({ marks, setMarks, annotations, saveAnnotations }) => {
  const [activeTab, setActiveTab] = useState("Question");

  const questions = [
    { id: "Q1", maxMarks: 20 },
    { id: "Q2", maxMarks: 20 },
    { id: "Q3", maxMarks: 20 },
    { id: "Q4A", maxMarks: 30 },
    { id: "Q4B", maxMarks: 10 },
  ];

  const annotatedPages = Array.from(new Set(annotations.map((a) => a.page)));
  const totalMarks = Object.values(marks).reduce(
    (sum, mark) => sum + (Number(mark) || 0),
    0
  );

  const totalPages = 36;
  // Check if all pages are annotated
  const allPagesAnnotated = annotatedPages.length === totalPages; // Assuming there are 36 pages

  // Check if all marks are filled and do not exceed max marks
  const allMarksValid = questions.every((q) => {
    const mark = Number(marks[q.id]);
    return mark >= 0 && mark <= q.maxMarks; // Ensure marks are within the valid range
  });

  // 🔍 Find unannotated pages  // future usage
  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const notAnnotatedPages = allPages.filter((p) => !annotatedPages.includes(p));

  const handleSubmit = () => {
    if (!allPagesAnnotated || !allMarksValid) {
      alert(
        "Please ensure all pages are annotated and marks are filled correctly."
      );
      return;
    }

    const jsonObject = {
      annotations: annotations.map((annotation) => ({
        id: annotation.id,
        type: annotation.type,
        page: annotation.page,
        position: annotation.position,
        text: annotation.text,
      })),
    };
    console.log("JSON Object to be sent to the API:", jsonObject);


  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Q.Paper":
        return (
          <div className="text-gray-700 p-4">
            <p>Question paper content goes here...</p>
          </div>
        );

      case "Ans.Key":
        return (
          <div className="text-gray-700 p-4">
            <p>Answer key content goes here...</p>
          </div>
        );

      case "UncheckedPages":
        return (
          <div className="text-gray-700 p-1">
            <div className="flex gap-2 overflow-x-auto pb-2  scroll-smooth">
              {notAnnotatedPages.map((page) => (
                <span
                  key={page}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-red-100 text-red-700 text-sm font-medium"
                >
                  {page}
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">
              Total Marks:
            </span>
            <span className="text-lg font-bold text-red-600">
              {totalMarks} / 100
            </span>
          </div>
        </div>
        <div className="space-y-3 h-85 overflow-auto">
          {questions.map((q) => (
            <QuestionInput
              key={q.id}
              question={q}
              value={marks[q.id] || ""}
              onChange={(value) =>
                setMarks((prev) => ({ ...prev, [q.id]: value }))
              }
            />
          ))}
        </div>
        
        {/* <div className="mt-6 text-sm text-gray-600">
          <span>Pages Annotated: </span>
          <span className="font-medium">{annotatedPages.length} / 36</span>
        </div> */}

    
        <div className="mt-6 mb-3">
          <nav className="flex gap-2 text-sm border-b pb-1">
            {["Q.Paper", "Ans.Key", "UncheckedPages"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-t text-gray-700 border-b-2 ${
                  activeTab === tab
                    ? "border-blue-500 font-semibold"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="tab-content mt-2">
          {renderTabContent()}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          onClick={handleSubmit}
          type="button"
          className={`text-white font-medium rounded-full text-sm py-1 px-3.5 text-center me-2 mb-2 focus:outline-none focus:ring-4
            ${
              !allPagesAnnotated || !allMarksValid
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            }`}
          disabled={!allPagesAnnotated || !allMarksValid}
        >
          Submit
        </button>
        <button
          type="button"
          onClick={()=>saveAnnotations()}
          className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm py-1 px-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          Reject
        </button>
      </div>
    </div>
  );

});

export default EvaluationPanel;

