// import { useState, useEffect } from 'react';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import PlusIcon from '@mui/icons-material/Add';
// import MinusIcon from '@mui/icons-material/Remove';
// import DocumentIcon from '@mui/icons-material/Description';
// import api from '../../../../api/axios';
// import toast from 'react-hot-toast';

// const UploadEvalData = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);

//   const [formData, setFormData] = useState({
//     course: '',
//     subject: '',
//     subjectId: '',
//     paperCode: '',
//     examDate: '',
//     maxMarks: 100,
//     durationMinutes: 180,
//     title: '',
//   });

//   const [questions, setQuestions] = useState([
//     { id: 1, questionNumber: '1', maxMarks: 10, subQuestions: [] }
//   ]);

// // fetch courses then subjects
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       // First get all courses
//       const courseResponse = await api.get('/api/exams');
//       setCourses(courseResponse.data.map(course => course.courseName));

//       // Don't fetch subjects until a course is selected

//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       toast.error('Failed to load courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, []);

// // Then when a course is selected
// useEffect(() => {
//   const fetchSubjects = async () => {
//     if (!formData.course) return;

//     try {
//       setLoading(true);
//       const response = await api.get(`/api/exams/${formData.course}/subjects`);
//       setSubjects(response.data.map(subject => ({
//         SubjectID: subject.subjectId,
//         Subject: subject.subject,
//         Course: formData.course
//       })));
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//       toast.error('Failed to load subjects');
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchSubjects();
// }, [formData.course]);

//   // Filter subjects when course changes
//   const filteredSubjects = subjects.filter(
//     subject => subject.Course === formData.course
//   );

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });

//     // Auto-set subjectId when subject is selected
//     if (name === 'subject') {
//       const selectedSubject = subjects.find(s => s.Subject === value);
//       if (selectedSubject) {
//         setFormData(prev => ({
//           ...prev,
//           subject: value,
//           subjectId: selectedSubject.SubjectID
//         }));
//       }
//     }
//   };

//   // Handle file upload
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === 'application/pdf') {
//       setFile(selectedFile);
//     } else {
//       toast.error('Please select a valid PDF file');
//       setFile(null);
//       e.target.value = '';
//     }
//   };

//   // Question management functions
//   const addQuestion = () => {
//     const newId = questions.length > 0
//       ? Math.max(...questions.map(q => q.id)) + 1
//       : 1;

//     setQuestions([
//       ...questions,
//       { id: newId, questionNumber: `${newId}`, maxMarks: 10, subQuestions: [] }
//     ]);
//   };

//   const addSubQuestion = (parentId) => {
//     const parent = questions.find(q => q.id === parentId);
//     if (!parent) return;

//     const subQuestions = parent.subQuestions || [];
//     const subQuestionLetter = String.fromCharCode(97 + subQuestions.length); // a, b, c, ...

//     const newSubQuestion = {
//       id: Date.now(), // unique temporary id
//       questionNumber: `${parent.questionNumber}${subQuestionLetter}`,
//       maxMarks: 5,
//     };

//     setQuestions(questions.map(q =>
//       q.id === parentId
//         ? { ...q, subQuestions: [...subQuestions, newSubQuestion] }
//         : q
//     ));
//   };

//   const removeQuestion = (id) => {
//     setQuestions(questions.filter(q => q.id !== id));
//   };

//   const removeSubQuestion = (parentId, subQuestionId) => {
//     setQuestions(questions.map(q =>
//       q.id === parentId
//         ? {
//             ...q,
//             subQuestions: q.subQuestions.filter(sq => sq.id !== subQuestionId)
//           }
//         : q
//     ));
//   };

//   const updateQuestion = (id, field, value) => {
//     setQuestions(questions.map(q =>
//       q.id === id ? { ...q, [field]: value } : q
//     ));
//   };

//   const updateSubQuestion = (parentId, subQuestionId, field, value) => {
//     setQuestions(questions.map(q =>
//       q.id === parentId
//         ? {
//             ...q,
//             subQuestions: q.subQuestions.map(sq =>
//               sq.id === subQuestionId ? { ...sq, [field]: value } : sq
//             )
//           }
//         : q
//     ));
//   };

//   // Calculate total marks
//   const totalMarks = questions.reduce((sum, question) => {
//     const questionMarks = parseFloat(question.maxMarks) || 0;

//     const subQuestionMarks = question.subQuestions?.reduce(
//       (subSum, subQ) => subSum + (parseFloat(subQ.maxMarks) || 0),
//       0
//     ) || 0;

//     return sum + (subQuestionMarks > 0 ? subQuestionMarks : questionMarks);
//   }, 0);

//   // Submit the form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       toast.error('Please upload a question paper PDF');
//       return;
//     }

//     if (totalMarks !== parseFloat(formData.maxMarks)) {
//       toast.error(`Total question marks (${totalMarks}) don't match paper max marks (${formData.maxMarks})`);
//       return;
//     }

//     try {
//       setLoading(true);

//       // First, upload the file
//       const fileFormData = new FormData();
//       fileFormData.append('file', file);
//       fileFormData.append('paperCode', formData.paperCode);
//       fileFormData.append('subjectId', formData.subjectId);

//       const fileResponse = await api.post('/api/admin/upload-question-paper', fileFormData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       // Then, create the paper record with questions
//       const paperData = {
//         ...formData,
//         filePath: fileResponse.data.filePath,
//         questions: questions.flatMap(q => {
//           // Process main question
//           const mainQuestion = {
//             questionNumber: q.questionNumber,
//             maxMarks: q.maxMarks,
//             isSubQuestion: false,
//             parentId: null
//           };

//           // Process sub-questions if any
//           const subQuestions = (q.subQuestions || []).map(sq => ({
//             questionNumber: sq.questionNumber,
//             maxMarks: sq.maxMarks,
//             isSubQuestion: true,
//             parentId: q.questionNumber // Will be replaced with actual ID after insertion
//           }));

//           return [mainQuestion, ...subQuestions];
//         })
//       };

//       await api.post('/api/admin/create-exam-paper', paperData);

//       toast.success('Question paper uploaded successfully');

//       // Reset form
//       setFormData({
//         course: '',
//         subject: '',
//         subjectId: '',
//         paperCode: '',
//         examDate: '',
//         maxMarks: 100,
//         durationMinutes: 180,
//         title: '',
//       });
//       setFile(null);
//       setQuestions([{ id: 1, questionNumber: '1', maxMarks: 10, subQuestions: [] }]);

//       // Reset file input
//       document.getElementById('paperFile').value = '';

//     } catch (error) {
//       console.error('Error uploading question paper:', error);
//       toast.error('Failed to upload question paper');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">Upload Question Paper</h2>
//         <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//           totalMarks === parseFloat(formData.maxMarks)
//             ? 'bg-green-100 text-green-800'
//             : 'bg-yellow-100 text-yellow-800'
//         }`}>
//           Total: {totalMarks}/{formData.maxMarks} marks
//         </span>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Course Selection */}
//           <div>
//             <label htmlFor="course" className="block text-sm font-medium text-gray-700">
//               Course
//             </label>
//             <select
//               id="course"
//               name="course"
//               value={formData.course}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//             >
//               <option value="">Select Course</option>
//               {courses.map(course => (
//                 <option key={course} value={course}>{course}</option>
//               ))}
//             </select>
//           </div>

//           {/* Subject Selection */}
//           <div>
//             <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
//               Subject
//             </label>
//             <select
//               id="subject"
//               name="subject"
//               value={formData.subject}
//               onChange={handleInputChange}
//               required
//               disabled={!formData.course}
//               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//             >
//               <option value="">Select Subject</option>
//               {filteredSubjects.map(subject => (
//                 <option key={subject.SubjectID} value={subject.Subject}>
//                   {subject.Subject} ({subject.SubjectID})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Paper Code */}
//           <div>
//             <label htmlFor="paperCode" className="block text-sm font-medium text-gray-700">
//               Paper Code
//             </label>
//             <input
//               type="text"
//               id="paperCode"
//               name="paperCode"
//               value={formData.paperCode}
//               onChange={handleInputChange}
//               required
//               className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Exam Date */}
//           <div>
//             <label htmlFor="examDate" className="block text-sm font-medium text-gray-700">
//               Exam Date
//             </label>
//             <input
//               type="date"
//               id="examDate"
//               name="examDate"
//               value={formData.examDate}
//               onChange={handleInputChange}
//               required
//               className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Paper Title */}
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//               Paper Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Max Marks */}
//           <div>
//             <label htmlFor="maxMarks" className="block text-sm font-medium text-gray-700">
//               Max Marks
//             </label>
//             <input
//               type="number"
//               id="maxMarks"
//               name="maxMarks"
//               value={formData.maxMarks}
//               onChange={handleInputChange}
//               required
//               min="1"
//               className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Duration */}
//           <div>
//             <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700">
//               Duration (minutes)
//             </label>
//             <input
//               type="number"
//               id="durationMinutes"
//               name="durationMinutes"
//               value={formData.durationMinutes}
//               onChange={handleInputChange}
//               required
//               min="1"
//               className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//             />
//           </div>

//           {/* PDF Upload */}
//           <div>
//             <label htmlFor="paperFile" className="block text-sm font-medium text-gray-700">
//               Question Paper (PDF)
//             </label>
//             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//               <div className="space-y-1 text-center">
//                 <svg
//                   className="mx-auto h-12 w-12 text-gray-400"
//                   stroke="currentColor"
//                   fill="none"
//                   viewBox="0 0 48 48"
//                   aria-hidden="true"
//                 >
//                   <path
//                     d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                     strokeWidth={2}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 <div className="flex text-sm text-gray-600">
//                   <label
//                     htmlFor="paperFile"
//                     className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
//                   >
//                     <span>Upload a file</span>
//                     <input
//                       id="paperFile"
//                       name="paperFile"
//                       type="file"
//                       className="sr-only"
//                       accept=".pdf"
//                       onChange={handleFileChange}
//                       required
//                     />
//                   </label>
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs text-gray-500">PDF up to 10MB</p>
//                 {file && (
//                   <p className="text-sm text-green-600">{file.name} selected</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Question Structure Section */}
//         <div className="mt-8">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-medium text-gray-900">Question Structure</h3>
//             <button
//               type="button"
//               onClick={addQuestion}
//               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <PlusIcon className="h-4 w-4 mr-1" /> Add Question
//             </button>
//           </div>

//           <div className="space-y-4">
//             {questions.map((question) => (
//               <div key={question.id} className="bg-gray-50 p-4 rounded-md border border-gray-200">
//                 <div className="flex items-center justify-between mb-2">
//                   <h4 className="text-md font-medium text-gray-700">Question {question.questionNumber}</h4>
//                   <div className="flex space-x-2">
//                     <button
//                       type="button"
//                       onClick={() => addSubQuestion(question.id)}
//                       className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                     >
//                       <PlusIcon className="h-3 w-3 mr-1" /> Sub-question
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => removeQuestion(question.id)}
//                       className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     >
//                       <MinusIcon className="h-3 w-3 mr-1" /> Remove
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-500">
//                       Question Number
//                     </label>
//                     <input
//                       type="text"
//                       value={question.questionNumber}
//                       onChange={(e) => updateQuestion(question.id, 'questionNumber', e.target.value)}
//                       className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-500">
//                       Max Marks
//                     </label>
//                     <input
//                       type="number"
//                       value={question.maxMarks}
//                       onChange={(e) => updateQuestion(question.id, 'maxMarks', e.target.value)}
//                       min="0"
//                       step="0.5"
//                       className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
//                     />
//                   </div>
//                 </div>

//                 {/* Sub-questions */}
//                 {question.subQuestions && question.subQuestions.length > 0 && (
//                   <div className="mt-3 pl-6 space-y-3 border-l-2 border-gray-200">
//                     {question.subQuestions.map((subQ) => (
//                       <div key={subQ.id} className="bg-white p-3 rounded shadow-sm">
//                         <div className="flex items-center justify-between mb-2">
//                           <h5 className="text-sm font-medium text-gray-600">
//                             Sub-question {subQ.questionNumber}
//                           </h5>
//                           <button
//                             type="button"
//                             onClick={() => removeSubQuestion(question.id, subQ.id)}
//                             className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                           >
//                             <MinusIcon className="h-3 w-3 mr-1" /> Remove
//                           </button>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-xs font-medium text-gray-500">
//                               Question Number
//                             </label>
//                             <input
//                               type="text"
//                               value={subQ.questionNumber}
//                               onChange={(e) => updateSubQuestion(question.id, subQ.id, 'questionNumber', e.target.value)}
//                               className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-medium text-gray-500">
//                               Max Marks
//                             </label>
//                             <input
//                               type="number"
//                               value={subQ.maxMarks}
//                               onChange={(e) => updateSubQuestion(question.id, subQ.id, 'maxMarks', e.target.value)}
//                               min="0"
//                               step="0.5"
//                               className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-xs border-gray-300 rounded-md"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-end pt-5">
//           <button
//             type="button"
//             className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             onClick={() => {
//               setFormData({
//                 course: '',
//                 subject: '',
//                 subjectId: '',
//                 paperCode: '',
//                 examDate: '',
//                 maxMarks: 100,
//                 durationMinutes: 180,
//                 title: '',
//               });
//               setFile(null);
//               setQuestions([{ id: 1, questionNumber: '1', maxMarks: 10, subQuestions: [] }]);
//               document.getElementById('paperFile').value = '';
//             }}
//           >
//             Reset
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
//               loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
//             } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CloudUploadIcon className="h-4 w-4 mr-1" />
//                 Upload Question Paper
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UploadEvalData;

//?

// import { useState, useEffect } from "react";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import PlusIcon from "@mui/icons-material/Add";
// import MinusIcon from "@mui/icons-material/Remove";
// import DocumentIcon from "@mui/icons-material/Description";
// import api from "../../../../api/axios";
// import toast from "react-hot-toast";
// import Checkbox from "@mui/material/Checkbox";
// import FormControlLabel from "@mui/material/FormControlLabel";

// const UploadEvalData = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);

//   const [formData, setFormData] = useState({
//     course: "",
//     subject: "",
//     subjectId: "",
//     paperCode: "",
//     examDate: "",
//     maxMarks: 100,
//     durationMinutes: 180,
//     title: "",
//   });

//   const [questions, setQuestions] = useState([
//     {
//       id: 1,
//       questionNumber: "1",
//       maxMarks: 10,
//       subQuestions: [],
//       isChoiceBased: false,
//       choiceCount: 1,
//       totalChoices: 1,
//     },
//   ]);

//   // Fetch courses then subjects
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // First get all courses
//         const courseResponse = await api.get("/api/exams");
//         setCourses(courseResponse.data.map((course) => course.courseName));
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         toast.error("Failed to load courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Then when a course is selected
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       if (!formData.course) return;

//       try {
//         setLoading(true);
//         const response = await api.get(
//           `/api/exams/${formData.course}/subjects`
//         );
//         setSubjects(
//           response.data.map((subject) => ({
//             SubjectID: subject.subjectId,
//             Subject: subject.subject,
//             Course: formData.course,
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         toast.error("Failed to load subjects");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubjects();
//   }, [formData.course]);

//   // Filter subjects when course changes
//   const filteredSubjects = subjects.filter(
//     (subject) => subject.Course === formData.course
//   );

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Auto-set subjectId when subject is selected
//     if (name === "subject") {
//       const selectedSubject = subjects.find((s) => s.Subject === value);
//       if (selectedSubject) {
//         setFormData((prev) => ({
//           ...prev,
//           subject: value,
//           subjectId: selectedSubject.SubjectID,
//         }));
//       }
//     }
//   };

//   // Handle file upload
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "application/pdf") {
//       setFile(selectedFile);
//     } else {
//       toast.error("Please select a valid PDF file");
//       setFile(null);
//       e.target.value = "";
//     }
//   };

//   // Question management functions
//   const addQuestion = () => {
//     const newId =
//       questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;

//     setQuestions([
//       ...questions,
//       {
//         id: newId,
//         questionNumber: `${newId}`,
//         maxMarks: 10,
//         subQuestions: [],
//         isChoiceBased: false,
//         choiceCount: 1,
//         totalChoices: 1,
//       },
//     ]);
//   };

//   const addSubQuestion = (parentId) => {
//     const parent = questions.find((q) => q.id === parentId);
//     if (!parent) return;

//     const subQuestions = parent.subQuestions || [];
//     const subQuestionLetter = String.fromCharCode(97 + subQuestions.length); // a, b, c, ...

//     const newSubQuestion = {
//       id: Date.now(), // unique temporary id
//       questionNumber: `${parent.questionNumber}${subQuestionLetter}`,
//       maxMarks: 5,
//       isOptional: false,
//     };

//     setQuestions(
//       questions.map((q) =>
//         q.id === parentId
//           ? { ...q, subQuestions: [...subQuestions, newSubQuestion] }
//           : q
//       )
//     );
//   };

//   const removeQuestion = (id) => {
//     setQuestions(questions.filter((q) => q.id !== id));
//   };

//   const removeSubQuestion = (parentId, subQuestionId) => {
//     setQuestions(
//       questions.map((q) =>
//         q.id === parentId
//           ? {
//               ...q,
//               subQuestions: q.subQuestions.filter(
//                 (sq) => sq.id !== subQuestionId
//               ),
//             }
//           : q
//       )
//     );
//   };

//   const updateQuestion = (id, field, value) => {
//     setQuestions(
//       questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
//     );
//   };

//   const updateSubQuestion = (parentId, subQuestionId, field, value) => {
//     setQuestions(
//       questions.map((q) =>
//         q.id === parentId
//           ? {
//               ...q,
//               subQuestions: q.subQuestions.map((sq) =>
//                 sq.id === subQuestionId ? { ...sq, [field]: value } : sq
//               ),
//             }
//           : q
//       )
//     );
//   };

//   // Toggle choice-based questions
//   const toggleChoiceBased = (id, isChecked) => {
//     setQuestions(
//       questions.map((q) =>
//         q.id === id
//           ? {
//               ...q,
//               isChoiceBased: isChecked,
//               // If it's choice-based, set default values, otherwise null them out
//               choiceCount: isChecked ? 1 : null,
//               totalChoices: isChecked ? q.subQuestions.length : null,
//               // Remove any optional flags on subquestions when switching to choice-based
//               subQuestions: q.subQuestions.map((sq) => ({
//                 ...sq,
//                 isOptional: isChecked ? false : sq.isOptional,
//               })),
//             }
//           : q
//       )
//     );
//   };

//   // Validate choice-based questions configuration
//   const validateChoiceBasedConfig = (question) => {
//     if (!question.isChoiceBased) return true;

//     return (
//       question.choiceCount < question.subQuestions.length &&
//       question.choiceCount >= 1
//     );
//   };

//   // Calculate total marks for a question including all its subquestions
//   const calculateQuestionTotalMarks = (question) => {
//     // If it has subquestions, handle based on question type
//     if (question.subQuestions && question.subQuestions.length > 0) {
//       // For choice-based questions, multiply the average marks by the choice count
//       if (question.isChoiceBased && question.choiceCount) {
//         const totalSubMarks = question.subQuestions.reduce(
//           (sum, subQ) => sum + (parseFloat(subQ.maxMarks) || 0),
//           0
//         );

//         // If all subquestions have equal marks, this works perfectly
//         // Otherwise, it's an approximation based on the choice count
//         return (
//           (totalSubMarks / question.subQuestions.length) * question.choiceCount
//         );
//       }

//       // For regular questions with subquestions, sum all subquestion marks
//       return question.subQuestions.reduce(
//         (sum, subQ) => sum + (parseFloat(subQ.maxMarks) || 0),
//         0
//       );
//     }

//     // For questions without subquestions, return the question's own marks
//     return parseFloat(question.maxMarks) || 0;
//   };

//   // Calculate total marks for the entire paper
//   const totalMarks = questions.reduce((sum, question) => {
//     return sum + calculateQuestionTotalMarks(question);
//   }, 0);

//   // Submit the form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       toast.error("Please upload a question paper PDF");
//       return;
//     }

//     if (totalMarks !== parseFloat(formData.maxMarks)) {
//       toast.error(
//         `Total question marks (${totalMarks}) don't match paper max marks (${formData.maxMarks})`
//       );
//       return;
//     }

//     // Validate choice-based questions configuration
//     const invalidChoiceConfig = questions.some(
//       (q) => q.isChoiceBased && !validateChoiceBasedConfig(q)
//     );

//     if (invalidChoiceConfig) {
//       toast.error(
//         "Invalid choice configuration: You must select fewer questions than total available"
//       );
//       return;
//     }

//     try {
//       setLoading(true);

//       // First, upload the file
//       const fileFormData = new FormData();
//       fileFormData.append("file", file);
//       fileFormData.append("paperCode", formData.paperCode);
//       fileFormData.append("subjectId", formData.subjectId);

//       // const fileResponse = await api.post(
//       //   "/api/admin/upload-question-paper",
//       //   fileFormData,
//       //   {
//       //     headers: { "Content-Type": "multipart/form-data" },
//       //   }
//       // );

//       const fileResponse = {
//         data: {
//           filePath: "C:/Users/khanj/Desktop/Evaluation Apps/OSM-IMG-STRUCTURED/server/uploads/papers/paper-undefined-undefined-1748942578728-311500889.pdf",
//         },
//       };

//       // Then, create the paper record with questions
//       const paperData = {
//         ...formData,
//         filePath: fileResponse.data.filePath,
//         hasChoiceBasedQuestions: questions.some((q) => q.isChoiceBased),
//         questions: questions.flatMap((q) => {
//           // Process main question
//           const mainQuestion = {
//             questionNumber: q.questionNumber,
//             maxMarks:
//               q.subQuestions.length > 0
//                 ? calculateQuestionTotalMarks(q)
//                 : q.maxMarks,
//             isSubQuestion: false,
//             parentId: null,
//             isChoiceBased: q.isChoiceBased,
//             choiceCount: q.isChoiceBased ? q.choiceCount : null,
//           };

//           // Process sub-questions if any
//           const subQuestions = (q.subQuestions || []).map((sq) => ({
//             questionNumber: sq.questionNumber,
//             maxMarks: sq.maxMarks,
//             isSubQuestion: true,
//             parentId: q.questionNumber,
//           }));

//           return [mainQuestion, ...subQuestions];
//         }),
//       };

//       // await api.post("/api/admin/create-exam-paper", paperData);

//       console.log("Paper Data to be sent:", paperData);

//       toast.success("Question paper uploaded successfully");

//       // Reset form
//       setFormData({
//         course: "",
//         subject: "",
//         subjectId: "",
//         paperCode: "",
//         examDate: "",
//         maxMarks: 100,
//         durationMinutes: 180,
//         title: "",
//       });
//       setFile(null);
//       setQuestions([
//         {
//           id: 1,
//           questionNumber: "1",
//           maxMarks: 10,
//           subQuestions: [],
//           isChoiceBased: false,
//         },
//       ]);

//       // Reset file input
//       document.getElementById("paperFile").value = "";
//     } catch (error) {
//       console.error("Error uploading question paper:", error);
//       toast.error("Failed to upload question paper");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Upload Question Paper
//         </h2>
//         <span
//           className={`px-3 py-1 rounded-full text-sm font-medium ${
//             totalMarks === parseFloat(formData.maxMarks)
//               ? "bg-green-100 text-green-800"
//               : "bg-yellow-100 text-yellow-800"
//           }`}
//         >
//           Total: {totalMarks}/{formData.maxMarks} marks
//         </span>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Course Selection */}
//           <div>
//             <label
//               htmlFor="course"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Course
//             </label>
//             <select
//               id="course"
//               name="course"
//               value={formData.course}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//             >
//               <option value="">Select Course</option>
//               {courses.map((course) => (
//                 <option key={course} value={course}>
//                   {course}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Subject Selection */}
//           <div>
//             <label
//               htmlFor="subject"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Subject
//             </label>
//             <select
//               id="subject"
//               name="subject"
//               value={formData.subject}
//               onChange={handleInputChange}
//               required
//               disabled={!formData.course}
//               className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${!formData.course ? "opacity-50 cursor-not-allowed" : ""}`}
//             >
//               <option value="">Select Subject</option>
//               {filteredSubjects.map((subject) => (
//                 <option key={subject.SubjectID} value={subject.Subject}>
//                   {subject.Subject} ({subject.SubjectID})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Paper Code */}
//           <div>
//             <label
//               htmlFor="paperCode"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Paper Code
//             </label>
//             <input
//               type="text"
//               id="paperCode"
//               name="paperCode"
//               value={formData.paperCode}
//               onChange={handleInputChange}
//               required
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Exam Date */}
//           {/* <div>
//             <label
//               htmlFor="examDate"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Exam Date
//             </label>
//             <input
//               type="date"
//               id="examDate"
//               name="examDate"
//               value={formData.examDate}
//               onChange={handleInputChange}
//               required
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div> */}

//           {/* Paper Title */}
//           <div>
//             <label
//               htmlFor="title"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Paper Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Max Marks */}
//           <div>
//             <label
//               htmlFor="maxMarks"
//               className="block text-sm font-medium text-gray-700"
//             >
//             <span className="text-red-500">*</span>Max Marks (Question Paper)
//             </label>
//             <input
//               type="number"
//               id="maxMarks"
//               name="maxMarks"
//               value={formData.maxMarks}
//               onChange={handleInputChange}
//               required
//               min="1"
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Duration */}
//           {/* <div>
//             <label
//               htmlFor="durationMinutes"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Duration (minutes)
//             </label>
//             <input
//               type="number"
//               id="durationMinutes"
//               name="durationMinutes"
//               value={formData.durationMinutes}
//               onChange={handleInputChange}
//               required
//               min="1"
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div> */}

//           {/* PDF Upload */}
//           <div>
//             <label
//               htmlFor="paperFile"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Question Paper (PDF)
//             </label>
//             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//               <div className="space-y-1 text-center">
//                 {/* <svg
//                   className="mx-auto h-12 w-12 text-gray-400"
//                   stroke="currentColor"
//                   fill="none"
//                   viewBox="0 0 48 48"
//                   aria-hidden="true"
//                 >
//                   <path
//                     d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                     strokeWidth={2}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg> */}
//                 <div className="flex text-sm text-gray-600">
//                   <label
//                     htmlFor="paperFile"
//                     className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
//                   >
//                     <span>Upload a file</span>
//                     <input
//                       id="paperFile"
//                       name="paperFile"
//                       type="file"
//                       className="sr-only"
//                       accept=".pdf"
//                       onChange={handleFileChange}
//                       required
//                     />
//                   </label>
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs text-gray-500">PDF up to 10MB</p>
//                 {file && (
//                   <p className="text-sm text-green-600">{file.name} selected</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Question Structure Section */}
//         <div className="mt-8">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-medium text-gray-900">
//               Question Structure
//             </h3>
//             <button
//               type="button"
//               onClick={addQuestion}
//               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <PlusIcon className="h-4 w-4 mr-1" /> Add Question
//             </button>
//           </div>

//           <div className="space-y-4">
//             {questions.map((question) => {
//               const hasSubQuestions =
//                 question.subQuestions && question.subQuestions.length > 0;
//               const questionTotalMarks = calculateQuestionTotalMarks(question);

//               return (
//                 <div
//                   key={question.id}
//                   className="bg-gray-50 p-4 rounded-md border border-gray-200"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center">
//                       <h4 className="text-md font-medium text-gray-700">
//                         Question {question.questionNumber}
//                       </h4>
//                       {hasSubQuestions && (
//                         <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
//                           Total: {questionTotalMarks} marks
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         type="button"
//                         onClick={() => addSubQuestion(question.id)}
//                         className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                       >
//                         <PlusIcon className="h-3 w-3 mr-1" /> Sub-question
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => removeQuestion(question.id)}
//                         className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                       >
//                         <MinusIcon className="h-3 w-3 mr-1" /> Remove
//                       </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500">
//                         Question Number
//                       </label>
//                       <input
//                         type="text"
//                         value={question.questionNumber}
//                         onChange={(e) =>
//                           updateQuestion(
//                             question.id,
//                             "questionNumber",
//                             e.target.value
//                           )
//                         }
//                         className="mt-1 p-2 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-xs border border-gray-300 rounded-md"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500">
//                         Max Marks {hasSubQuestions ? "(auto-calculated)" : ""}
//                       </label>
//                       <input
//                         type="number"
//                         value={
//                           hasSubQuestions
//                             ? questionTotalMarks
//                             : question.maxMarks
//                         }
//                         onChange={(e) =>
//                           updateQuestion(
//                             question.id,
//                             "maxMarks",
//                             e.target.value
//                           )
//                         }
//                         min="0"
//                         step="0.5"
//                         disabled={hasSubQuestions}
//                         className={`mt-1 p-2 px-3 block w-full shadow-sm sm:text-xs border border-gray-300 rounded-md ${
//                           hasSubQuestions
//                             ? "bg-gray-100"
//                             : "focus:ring-blue-500 focus:border-blue-500"
//                         }`}
//                       />
//                     </div>
//                   </div>

//                   {/* Choice-based question options - only show if there are subquestions */}
//                   {/* Choice-based question options - only show if there are multiple subquestions */}
//                   {hasSubQuestions && question.subQuestions.length > 1 && (
//                     <div className="mt-3 bg-blue-50 p-3 rounded-md">
//                       <div className="flex flex-wrap items-center gap-4">
//                         <FormControlLabel
//                           control={
//                             <Checkbox
//                               checked={question.isChoiceBased}
//                               onChange={(e) =>
//                                 toggleChoiceBased(question.id, e.target.checked)
//                               }
//                               size="small"
//                             />
//                           }
//                           label={
//                             <span className="text-sm font-medium text-gray-700">
//                               Choice-based question
//                             </span>
//                           }
//                         />

//                         {question.isChoiceBased && (
//                           <>
//                             <div className="flex items-center">
//                               <span className="text-sm text-gray-700 mr-2">
//                                 Answer
//                               </span>
//                               <input
//                                 type="number"
//                                 min="1"
//                                 max={question.subQuestions.length - 1}
//                                 value={question.choiceCount}
//                                 onChange={(e) =>
//                                   updateQuestion(
//                                     question.id,
//                                     "choiceCount",
//                                     Math.min(
//                                       Math.max(
//                                         1,
//                                         parseInt(e.target.value) || 1
//                                       ),
//                                       question.subQuestions.length - 1
//                                     )
//                                   )
//                                 }
//                                 className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                               />
//                               <span className="text-sm text-gray-700 mx-2">
//                                 out of
//                               </span>
//                               <span className="text-sm font-medium text-gray-700">
//                                 {question.subQuestions.length}
//                               </span>
//                               <span className="text-sm text-gray-700 ml-2">
//                                 subquestions
//                               </span>
//                             </div>

//                             {question.choiceCount >=
//                               question.subQuestions.length && (
//                               <div className="w-full text-xs text-red-600">
//                                 You must answer fewer questions than the total
//                                 available.
//                               </div>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Sub-questions */}
//                   {hasSubQuestions && (
//                     <div className="mt-3 pl-6 space-y-3 border-l-2 border-gray-200">
//                       {question.subQuestions.map((subQ) => (
//                         <div
//                           key={subQ.id}
//                           className="bg-white p-3 rounded shadow-sm"
//                         >
//                           <div className="flex items-center justify-between mb-2">
//                             <h5 className="text-sm font-medium text-gray-600">
//                               Sub-question {subQ.questionNumber}
//                             </h5>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 removeSubQuestion(question.id, subQ.id)
//                               }
//                               className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                             >
//                               <MinusIcon className="h-3 w-3 mr-1" /> Remove
//                             </button>
//                           </div>

//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block text-xs font-medium text-gray-500">
//                                 Question Number
//                               </label>
//                               <input
//                                 type="text"
//                                 value={subQ.questionNumber}
//                                 onChange={(e) =>
//                                   updateSubQuestion(
//                                     question.id,
//                                     subQ.id,
//                                     "questionNumber",
//                                     e.target.value
//                                   )
//                                 }
//                                 className="mt-1 p-2 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-xs border border-gray-300 rounded-md"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-xs font-medium text-gray-500">
//                                 Max Marks
//                               </label>
//                               <input
//                                 type="number"
//                                 value={subQ.maxMarks}
//                                 onChange={(e) =>
//                                   updateSubQuestion(
//                                     question.id,
//                                     subQ.id,
//                                     "maxMarks",
//                                     e.target.value
//                                   )
//                                 }
//                                 min="0"
//                                 step="0.5"
//                                 className="mt-1 p-2 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-xs border border-gray-300 rounded-md"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="flex justify-end pt-5">
//           <button
//             type="button"
//             className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             onClick={() => {
//               setFormData({
//                 course: "",
//                 subject: "",
//                 subjectId: "",
//                 paperCode: "",
//                 examDate: "",
//                 maxMarks: 100,
//                 durationMinutes: 180,
//                 title: "",
//               });
//               setFile(null);
//               setQuestions([
//                 {
//                   id: 1,
//                   questionNumber: "1",
//                   maxMarks: 10,
//                   subQuestions: [],
//                   isChoiceBased: false,
//                 },
//               ]);
//               document.getElementById("paperFile").value = "";
//             }}
//           >
//             Reset
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
//               loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
//             } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CloudUploadIcon className="h-4 w-4 mr-1" />
//                 Upload Question Paper
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UploadEvalData;

//? Simplified version of the UploadEvalData

// import { useState, useEffect } from "react";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import PlusIcon from "@mui/icons-material/Add";
// import MinusIcon from "@mui/icons-material/Remove";
// import api from "../../../../api/axios";
// import toast from "react-hot-toast";
// import Checkbox from "@mui/material/Checkbox";
// import FormControlLabel from "@mui/material/FormControlLabel";

// const UploadEvalData = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);

//   const [formData, setFormData] = useState({
//     course: "",
//     subject: "",
//     subjectId: "",
//     paperCode: "",
//     examDate: "",
//     maxMarks: 100,
//     durationMinutes: 180,
//     title: "",
//   });

//   const [questions, setQuestions] = useState([
//     {
//       id: 1,
//       questionNumber: "1",
//       maxMarks: 10,
//     },
//   ]);

//   // Fetch courses then subjects
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // First get all courses
//         const courseResponse = await api.get("/api/exams");
//         setCourses(courseResponse.data.map((course) => course.courseName));
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         toast.error("Failed to load courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Then when a course is selected
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       if (!formData.course) return;

//       try {
//         setLoading(true);
//         const response = await api.get(
//           `/api/exams/${formData.course}/subjects`
//         );
//         setSubjects(
//           response.data.map((subject) => ({
//             SubjectID: subject.subjectId,
//             Subject: subject.subject,
//             Course: formData.course,
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         toast.error("Failed to load subjects");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubjects();
//   }, [formData.course]);

//   // Filter subjects when course changes
//   const filteredSubjects = subjects.filter(
//     (subject) => subject.Course === formData.course
//   );

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Auto-set subjectId when subject is selected
//     if (name === "subject") {
//       const selectedSubject = subjects.find((s) => s.Subject === value);
//       if (selectedSubject) {
//         setFormData((prev) => ({
//           ...prev,
//           subject: value,
//           subjectId: selectedSubject.SubjectID,
//         }));
//       }
//     }
//   };

//   // Handle file upload
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "application/pdf") {
//       setFile(selectedFile);
//     } else {
//       toast.error("Please select a valid PDF file");
//       setFile(null);
//       e.target.value = "";
//     }
//   };

//   // Simplified question management functions
//   const addQuestion = () => {
//     const newId =
//       questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;

//     setQuestions([
//       ...questions,
//       {
//         id: newId,
//         questionNumber: `${newId}`,
//         maxMarks: 10,
//       },
//     ]);
//   };

//   const removeQuestion = (id) => {
//     setQuestions(questions.filter((q) => q.id !== id));
//   };

//   const updateQuestion = (id, field, value) => {
//     setQuestions(
//       questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
//     );
//   };

//   // Calculate total marks - much simpler now
//   const totalMarks = questions.reduce(
//     (sum, q) => sum + (parseFloat(q.maxMarks) || 0),
//     0
//   );

//   // Simplified form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       toast.error("Please upload a question paper PDF");
//       return;
//     }

//     if (totalMarks !== parseFloat(formData.maxMarks)) {
//       toast.error(
//         `Total question marks (${totalMarks}) don't match paper max marks (${formData.maxMarks})`
//       );
//       return;
//     }

//     try {
//       setLoading(true);

//       // First, upload the file
//       const fileFormData = new FormData();
//       fileFormData.append("file", file);
//       fileFormData.append("paperCode", formData.paperCode);
//       fileFormData.append("subjectId", formData.subjectId);

//       const fileResponse = await api.post(
//         "/api/admin/upload-question-paper",
//         fileFormData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       // Then, create the paper record with questions
//       const paperData = {
//         ...formData,
//         filePath: fileResponse.data.filePath,
//         questions: questions.map((q) => ({
//           questionNumber: q.questionNumber,
//           maxMarks: q.maxMarks,
//         })),
//       };

//       await api.post("/api/admin/create-exam-paper", paperData);

//       toast.success("Question paper uploaded successfully");

//       // Reset form
//       setFormData({
//         course: "",
//         subject: "",
//         subjectId: "",
//         paperCode: "",
//         examDate: "",
//         maxMarks: 100,
//         durationMinutes: 180,
//         title: "",
//       });
//       setFile(null);
//       setQuestions([
//         {
//           id: 1,
//           questionNumber: "1",
//           maxMarks: 10,
//         },
//       ]);

//       // Reset file input
//       document.getElementById("paperFile").value = "";
//     } catch (error) {
//       console.error("Error uploading question paper:", error);
//       toast.error("Failed to upload question paper");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Upload Question Paper
//         </h2>
//         <span
//           className={`px-3 py-1 rounded-full text-sm font-medium ${
//             totalMarks === parseFloat(formData.maxMarks)
//               ? "bg-green-100 text-green-800"
//               : "bg-yellow-100 text-yellow-800"
//           }`}
//         >
//           Total: {totalMarks}/{formData.maxMarks} marks
//         </span>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Course Selection */}
//           <div>
//             <label
//               htmlFor="course"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Course
//             </label>
//             <select
//               id="course"
//               name="course"
//               value={formData.course}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//             >
//               <option value="">Select Course</option>
//               {courses.map((course) => (
//                 <option key={course} value={course}>
//                   {course}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Subject Selection */}
//           <div>
//             <label
//               htmlFor="subject"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Subject
//             </label>
//             <select
//               id="subject"
//               name="subject"
//               value={formData.subject}
//               onChange={handleInputChange}
//               required
//               disabled={!formData.course}
//               className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
//                 !formData.course ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               <option value="">Select Subject</option>
//               {filteredSubjects.map((subject) => (
//                 <option key={subject.SubjectID} value={subject.Subject}>
//                   {subject.Subject} ({subject.SubjectID})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Paper Code */}
//           <div>
//             <label
//               htmlFor="paperCode"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Paper Code
//             </label>
//             <input
//               type="text"
//               id="paperCode"
//               name="paperCode"
//               value={formData.paperCode}
//               onChange={handleInputChange}
//               required
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Exam Date */}
//           {/* <div>
//             <label
//               htmlFor="examDate"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Exam Date
//             </label>
//             <input
//               type="date"
//               id="examDate"
//               name="examDate"
//               value={formData.examDate}
//               onChange={handleInputChange}
//               required
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div> */}

//           {/* Paper Title */}
//           <div>
//             <label
//               htmlFor="title"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Paper Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Max Marks */}
//           <div>
//             <label
//               htmlFor="maxMarks"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Max Marks (Question Paper)
//             </label>
//             <input
//               type="number"
//               id="maxMarks"
//               name="maxMarks"
//               value={formData.maxMarks}
//               onChange={handleInputChange}
//               required
//               min="1"
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Duration */}
//           {/* <div>
//             <label
//               htmlFor="durationMinutes"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Duration (minutes)
//             </label>
//             <input
//               type="number"
//               id="durationMinutes"
//               name="durationMinutes"
//               value={formData.durationMinutes}
//               onChange={handleInputChange}
//               required
//               min="1"
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div> */}

//           {/* PDF Upload */}
//           <div>
//             <label
//               htmlFor="paperFile"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Question Paper (PDF)
//             </label>
//             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//               <div className="space-y-1 text-center">
//                 {/* <svg
//                   className="mx-auto h-12 w-12 text-gray-400"
//                   stroke="currentColor"
//                   fill="none"
//                   viewBox="0 0 48 48"
//                   aria-hidden="true"
//                 >
//                   <path
//                     d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                     strokeWidth={2}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg> */}
//                 <div className="flex text-sm text-gray-600">
//                   <label
//                     htmlFor="paperFile"
//                     className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
//                   >
//                     <span>Upload a file</span>
//                     <input
//                       id="paperFile"
//                       name="paperFile"
//                       type="file"
//                       className="sr-only"
//                       accept=".pdf"
//                       onChange={handleFileChange}
//                       required
//                     />
//                   </label>
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs text-gray-500">PDF up to 10MB</p>
//                 {file && (
//                   <p className="text-sm text-green-600">{file.name} selected</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Question Structure Section */}
//         <div className="mt-8">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-medium text-gray-900">
//               Question Structure
//             </h3>
//             <button
//               type="button"
//               onClick={addQuestion}
//               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <PlusIcon className="h-4 w-4 mr-1" /> Add Question
//             </button>
//           </div>

//           <div className="space-y-4">
//             {questions.map((question) => (
//               <div
//                 key={question.id}
//                 className="bg-gray-50 p-4 rounded-md border border-gray-200"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <h4 className="text-md font-medium text-gray-700">
//                     Question {question.questionNumber}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeQuestion(question.id)}
//                     className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                   >
//                     <MinusIcon className="h-3 w-3 mr-1" /> Remove
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-500">
//                       Question Number
//                     </label>
//                     <input
//                       type="text"
//                       value={question.questionNumber}
//                       onChange={(e) =>
//                         updateQuestion(
//                           question.id,
//                           "questionNumber",
//                           e.target.value
//                         )
//                       }
//                       className="mt-1 p-2 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-xs border border-gray-300 rounded-md"
//                       placeholder="e.g., 1 or 1a or 2b"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-500">
//                       Max Marks
//                     </label>
//                     <input
//                       type="number"
//                       value={question.maxMarks}
//                       onChange={(e) =>
//                         updateQuestion(question.id, "maxMarks", e.target.value)
//                       }
//                       min="0"
//                       step="0.5"
//                       className="mt-1 p-2 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-xs border border-gray-300 rounded-md"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-end pt-5">
//           <button
//             type="button"
//             className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             onClick={() => {
//               setFormData({
//                 course: "",
//                 subject: "",
//                 subjectId: "",
//                 paperCode: "",
//                 examDate: "",
//                 maxMarks: 100,
//                 durationMinutes: 180,
//                 title: "",
//               });
//               setFile(null);
//               setQuestions([
//                 {
//                   id: 1,
//                   questionNumber: "1",
//                   maxMarks: 10,
//                   subQuestions: [],
//                   isChoiceBased: false,
//                 },
//               ]);
//               document.getElementById("paperFile").value = "";
//             }}
//           >
//             Reset
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
//               loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
//             } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CloudUploadIcon className="h-4 w-4 mr-1" />
//                 Upload Question Paper
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UploadEvalData;

//? Question number pattern with auto subquestion lettering.

// import { useState, useEffect } from "react";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import api from "../../../../api/axios";
// import toast from "react-hot-toast";
// import QuestionStructure from "./components/QuestionStructure";
// import { QuestionPaperPreview } from "./components/QuestionPaperPreview";

// const UploadEvalData = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);

//   const [formData, setFormData] = useState({
//     course: "",
//     subject: "",
//     subjectId: "",
//     paperCode: "",
//     maxMarks: 100,
//     title: "",
//   });

//   // Store questions grouped by main question number
//   const [questionGroups, setQuestionGroups] = useState([
//     {
//       id: 1,
//       questionNumber: "1",
//       subquestions: [],
//     },
//   ]);

//   const [showPreview, setShowPreview] = useState(false);

//   // Fetch courses then subjects
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const courseResponse = await api.get("/api/exams");
//         setCourses(courseResponse.data.map((course) => course.courseName));
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         toast.error("Failed to load courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Then when a course is selected
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       if (!formData.course) return;

//       try {
//         setLoading(true);
//         const response = await api.get(
//           `/api/exams/${formData.course}/subjects`
//         );
//         setSubjects(
//           response.data.map((subject) => ({
//             SubjectID: subject.subjectId,
//             Subject: subject.subject,
//             Course: formData.course,
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         toast.error("Failed to load subjects");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubjects();
//   }, [formData.course]);

//   // Filter subjects when course changes
//   const filteredSubjects = subjects.filter(
//     (subject) => subject.Course === formData.course
//   );

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Auto-set subjectId when subject is selected
//     if (name === "subject") {
//       const selectedSubject = subjects.find((s) => s.Subject === value);
//       if (selectedSubject) {
//         setFormData((prev) => ({
//           ...prev,
//           subject: value,
//           subjectId: selectedSubject.SubjectID,
//         }));
//       }
//     }
//   };

//   // Handle file upload
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "application/pdf") {
//       setFile(selectedFile);
//     } else {
//       toast.error("Please select a valid PDF file");
//       setFile(null);
//       e.target.value = "";
//     }
//   };

//   // Flatten all questions for submission
//   const getAllQuestions = () => {
//     const allQuestions = [];

//     questionGroups.forEach((group) => {
//       if (group.subquestions.length === 0) {
//         // Main question with no subquestions
//         allQuestions.push({
//           questionNumber: group.questionNumber,
//           maxMarks: parseFloat(group.maxMarks) || 0,
//         });
//       } else {
//         // Add all subquestions
//         group.subquestions.forEach((sq) => {
//           allQuestions.push({
//             questionNumber: sq.questionNumber,
//             maxMarks: parseFloat(sq.maxMarks) || 0,
//           });
//         });
//       }
//     });

//     return allQuestions;
//   };

//   // Calculate total marks
//   const calculateTotalMarks = () => {
//     return questionGroups.reduce((total, group) => {
//       if (group.subquestions.length === 0) {
//         // If no subquestions, use the group's marks
//         return total + (parseFloat(group.maxMarks) || 0);
//       } else {
//         // Sum marks of all subquestions
//         const subquestionsTotal = group.subquestions.reduce(
//           (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
//           0
//         );
//         return total + subquestionsTotal;
//       }
//     }, 0);
//   };

//   const totalMarks = calculateTotalMarks();

//   // Form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validations
//     if (!file) {
//       toast.error("Please upload a question paper PDF");
//       return;
//     }

//     // Show preview instead of submitting directly
//     setShowPreview(true);
//   };

//   const handleFinalSubmit = async (e) => {
//     const totalMarks = calculateTotalMarks();

//     if (totalMarks !== parseFloat(formData.maxMarks)) {
//       toast.error(
//         `Total question marks (${totalMarks}) don't match paper max marks (${formData.maxMarks})`
//       );
//       return;
//     }

//     try {
//       setLoading(true);

//       // Upload the file
//       const fileFormData = new FormData();
//       fileFormData.append("file", file);
//       fileFormData.append("paperCode", formData.paperCode);
//       fileFormData.append("subjectId", formData.subjectId);

//       const fileResponse = await api.post(
//         "/api/admin/upload-question-paper",
//         fileFormData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       // Create the paper with questions
//       const paperData = {
//         ...formData,
//         filePath: fileResponse.data.filePath,
//         questions: getAllQuestions(),
//       };

//       await api.post("/api/admin/create-exam-paper", paperData);

//       toast.success("Question paper uploaded successfully");

//       // Reset form
//       setFormData({
//         course: "",
//         subject: "",
//         subjectId: "",
//         paperCode: "",
//         maxMarks: 100,
//         title: "",
//       });
//       setFile(null);
//       setQuestionGroups([
//         {
//           id: Date.now(),
//           questionNumber: "1",
//           maxMarks: 10,
//           subquestions: [],
//         },
//       ]);
//       document.getElementById("paperFile").value = "";
//     } catch (error) {
//       console.error("Error uploading question paper:", error);
//       toast.error("Failed to upload question paper");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Upload Question Paper
//         </h2>
//         <span
//           className={`px-3 py-1 rounded-full text-sm font-medium ${
//             totalMarks === parseFloat(formData.maxMarks)
//               ? "bg-green-100 text-green-800"
//               : "bg-yellow-100 text-yellow-800"
//           }`}
//         >
//           Total: {totalMarks}/{formData.maxMarks} marks
//         </span>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Form fields (course, subject, etc.) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Course Selection */}
//           <div>
//             <label
//               htmlFor="course"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Course
//             </label>
//             <select
//               id="course"
//               name="course"
//               value={formData.course}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//             >
//               <option value="">Select Course</option>
//               {courses.map((course) => (
//                 <option key={course} value={course}>
//                   {course}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Subject Selection */}
//           <div>
//             <label
//               htmlFor="subject"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Subject
//             </label>
//             <select
//               id="subject"
//               name="subject"
//               value={formData.subject}
//               onChange={handleInputChange}
//               required
//               disabled={!formData.course}
//               className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
//                 !formData.course ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               <option value="">Select Subject</option>
//               {filteredSubjects.map((subject) => (
//                 <option key={subject.SubjectID} value={subject.Subject}>
//                   {subject.Subject} ({subject.SubjectID})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Paper Code */}
//           <div>
//             <label
//               htmlFor="paperCode"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Paper Code
//             </label>
//             <input
//               type="text"
//               id="paperCode"
//               name="paperCode"
//               value={formData.paperCode}
//               onChange={handleInputChange}
//               required
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Paper Title */}
//           <div>
//             <label
//               htmlFor="title"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Paper Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Max Marks */}
//           <div>
//             <label
//               htmlFor="maxMarks"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Max Marks (Question Paper)
//             </label>
//             <input
//               type="number"
//               id="maxMarks"
//               name="maxMarks"
//               value={formData.maxMarks}
//               onChange={handleInputChange}
//               required
//               min="1"
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* PDF Upload */}
//           <div>
//             <label
//               htmlFor="paperFile"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Question Paper (PDF)
//             </label>
//             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//               <div className="space-y-1 text-center">
//                 <div className="flex text-sm text-gray-600">
//                   <label
//                     htmlFor="paperFile"
//                     className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
//                   >
//                     <span>Upload a file</span>
//                     <input
//                       id="paperFile"
//                       name="paperFile"
//                       type="file"
//                       className="sr-only"
//                       accept=".pdf"
//                       onChange={handleFileChange}
//                       required
//                     />
//                   </label>
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs text-gray-500">PDF up to 10MB</p>
//                 {file && (
//                   <p className="text-sm text-green-600">{file.name} selected</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Question Structure Section */}

//         <QuestionStructure
//           questionGroups={questionGroups}
//           setQuestionGroups={setQuestionGroups}
//           maxMarks={formData.maxMarks}
//         />

//         <div className="flex justify-end pt-5">
//           <button
//             type="button"
//             className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             onClick={() => {
//               setFormData({
//                 course: "",
//                 subject: "",
//                 subjectId: "",
//                 paperCode: "",
//                 maxMarks: 100,
//                 title: "",
//               });
//               setFile(null);
//               setQuestionGroups([
//                 {
//                   id: Date.now(),
//                   questionNumber: "1",
//                   maxMarks: 10,
//                   subquestions: [],
//                 },
//               ]);
//               document.getElementById("paperFile").value = "";
//             }}
//           >
//             Reset
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`ml-3 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
//               loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
//             } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CloudUploadIcon className="h-4 w-4 mr-1" />
//                 Preview & Submit
//               </>
//             )}
//           </button>
//         </div>
//       </form>

//       <QuestionPaperPreview
//         isOpen={showPreview}
//         onClose={() => setShowPreview(false)}
//         onConfirm={handleFinalSubmit}
//         formData={formData}
//         questionGroups={questionGroups}
//         file={file}
//         loading={loading}
//       />
//     </div>
//   );
// };

// export default UploadEvalData;


//?Two tab

import { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ListAltIcon from "@mui/icons-material/ListAlt";
import api from "../../../../api/axios";
import toast from "react-hot-toast";
import QuestionStructure from "../Fragmentation/components/QuestionStructure";
import { QuestionPaperPreview } from "../Fragmentation/components/QuestionPaperPreview";

const UploadEvalData = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "fragmentation"
  
  // Upload paper states
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadedPapers, setUploadedPapers] = useState([]);
  const [selectedPaperId, setSelectedPaperId] = useState(null);

  const [formData, setFormData] = useState({
    course: "",
    subject: "",
    subjectId: "",
    paperCode: "",
    maxMarks: 100,
    title: "",
  });

  // Fragmentation states
  const [questionGroups, setQuestionGroups] = useState([
    {
      id: 1,
      questionNumber: "1",
      maxMarks: 10,
      subquestions: [],
    },
  ]);

  const [showPreview, setShowPreview] = useState(false);

  // Fetch courses then subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const courseResponse = await api.get("/api/exams");
        setCourses(courseResponse.data.map((course) => course.courseName));
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Then when a course is selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!formData.course) return;

      try {
        setLoading(true);
        const response = await api.get(
          `/api/exams/${formData.course}/subjects`
        );
        setSubjects(
          response.data.map((subject) => ({
            SubjectID: subject.subjectId,
            Subject: subject.subject,
            Course: formData.course,
          }))
        );
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [formData.course]);

  // Fetch all uploaded papers without fragmentation
  useEffect(() => {
    const fetchUploadedPapers = async () => {
      if (activeTab !== "fragmentation") return;

      try {
        setLoading(true);
        const response = await api.get("/api/admin/papers?unfragmented=true");
        setUploadedPapers(response.data);
      } catch (error) {
        console.error("Error fetching papers:", error);
        toast.error("Failed to load papers");
      } finally {
        setLoading(false);
      }
    };

    fetchUploadedPapers();
  }, [activeTab]);

  // Filter subjects when course changes
  const filteredSubjects = subjects.filter(
    (subject) => subject.Course === formData.course
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-set subjectId when subject is selected
    if (name === "subject") {
      const selectedSubject = subjects.find((s) => s.Subject === value);
      if (selectedSubject) {
        setFormData((prev) => ({
          ...prev,
          subject: value,
          subjectId: selectedSubject.SubjectID,
        }));
      }
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast.error("Please select a valid PDF file");
      setFile(null);
      e.target.value = "";
    }
  };

  // Flatten all questions for submission
  const getAllQuestions = () => {
    const allQuestions = [];

    questionGroups.forEach((group) => {
      if (group.subquestions.length === 0) {
        // Main question with no subquestions
        allQuestions.push({
          questionNumber: group.questionNumber,
          maxMarks: parseFloat(group.maxMarks) || 0,
        });
      } else {
        // Add all subquestions
        group.subquestions.forEach((sq) => {
          allQuestions.push({
            questionNumber: sq.questionNumber,
            maxMarks: parseFloat(sq.maxMarks) || 0,
          });
        });
      }
    });

    return allQuestions;
  };

  // Calculate total marks
  const calculateTotalMarks = () => {
    return questionGroups.reduce((total, group) => {
      if (group.subquestions.length === 0) {
        // If no subquestions, use the group's marks
        return total + (parseFloat(group.maxMarks) || 0);
      } else {
        // Sum marks of all subquestions
        const subquestionsTotal = group.subquestions.reduce(
          (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
          0
        );
        return total + subquestionsTotal;
      }
    }, 0);
  };

  const totalMarks = calculateTotalMarks();

  // Upload paper form submission
  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a question paper PDF");
      return;
    }

    try {
      setLoading(true);

      // Upload the file
      const fileFormData = new FormData();
      fileFormData.append("file", file);
      fileFormData.append("paperCode", formData.paperCode);
      fileFormData.append("subjectId", formData.subjectId);

      const fileResponse = await api.post(
        "/api/admin/upload-question-paper",
        fileFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Create the paper record without questions yet
      const paperData = {
        ...formData,
        filePath: fileResponse.data.filePath,
        fragmentation: false, // Set to false initially
      };

      const result = await api.post("/api/admin/create-paper", paperData);

      toast.success("Question paper uploaded successfully");

      // Reset form
      setFormData({
        course: "",
        subject: "",
        subjectId: "",
        paperCode: "",
        maxMarks: 100,
        title: "",
      });
      setFile(null);
      document.getElementById("paperFile").value = "";
      
      // Suggest moving to fragmentation tab
      toast.success("Now you can create the fragmentation structure", {
        duration: 5000,
        icon: '📋'
      });
      
      // Switch to fragmentation tab after a delay
      setTimeout(() => {
        setActiveTab("fragmentation");
      }, 1500);
      
    } catch (error) {
      console.error("Error uploading question paper:", error);
      toast.error("Failed to upload question paper");
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting a paper for fragmentation
  const handleSelectPaper = async (paperId) => {
    try {
      setLoading(true);
      setSelectedPaperId(paperId);
      
      // Fetch paper details
      const response = await api.get(`/api/admin/papers/${paperId}`);
      const paper = response.data;
      
      // Set max marks from the paper
      setFormData(prev => ({
        ...prev,
        maxMarks: paper.maxMarks
      }));
      
      // Reset question groups
      setQuestionGroups([
        {
          id: Date.now(),
          questionNumber: "1",
          maxMarks: 10,
          subquestions: [],
        },
      ]);
      
      toast.success(`Selected paper: ${paper.paperCode}`);
    } catch (error) {
      console.error("Error selecting paper:", error);
      toast.error("Failed to load paper details");
    } finally {
      setLoading(false);
    }
  };

  // Fragmentation form submission
  const handleFragmentationSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPaperId) {
      toast.error("Please select a paper first");
      return;
    }

    // Show preview instead of submitting directly
    setShowPreview(true);
  };

  // Final submit from preview
  const handleFinalSubmit = async () => {
    const totalMarks = calculateTotalMarks();
    const maxMarks = parseFloat(formData.maxMarks);

    if (totalMarks !== maxMarks) {
      toast.error(
        `Total question marks (${totalMarks}) don't match paper max marks (${maxMarks})`
      );
      return;
    }

    try {
      setLoading(true);

      // Submit the fragmentation data
      const fragmentationData = {
        paperId: selectedPaperId,
        questions: getAllQuestions(),
        fragmentation: true // Set fragmentation flag to true
      };

      await api.post("/api/admin/create-fragmentation", fragmentationData);

      toast.success("Question structure saved successfully");

      // Reset fragmentation form
      setSelectedPaperId(null);
      setQuestionGroups([
        {
          id: Date.now(),
          questionNumber: "1",
          maxMarks: 10,
          subquestions: [],
        },
      ]);
      
      // Refresh the paper list
      const response = await api.get("/api/admin/papers?unfragmented=true");
      setUploadedPapers(response.data);
      
      // Close preview
      setShowPreview(false);
      
    } catch (error) {
      console.error("Error saving fragmentation:", error);
      toast.error("Failed to save question structure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("upload")}
              className={`inline-flex items-center px-4 py-2 border-b-2 rounded-t-lg ${
                activeTab === "upload"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              <CloudUploadIcon className="h-4 w-4 mr-2" />
              Upload Paper
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("fragmentation")}
              className={`inline-flex items-center px-4 py-2 border-b-2 rounded-t-lg ${
                activeTab === "fragmentation"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              <ListAltIcon className="h-4 w-4 mr-2" />
              Question Structure
            </button>
          </li>
        </ul>
      </div>

      {/* Upload Paper Tab */}
      {activeTab === "upload" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Upload Question Paper
            </h2>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Selection */}
              <div>
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700"
                >
                  <span className="text-red-500">*</span>Course
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Selection */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  <span className="text-red-500">*</span>Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.course}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                    !formData.course ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Select Subject</option>
                  {filteredSubjects.map((subject) => (
                    <option key={subject.SubjectID} value={subject.Subject}>
                      {subject.Subject} ({subject.SubjectID})
                    </option>
                  ))}
                </select>
              </div>

              {/* Paper Code */}
              <div>
                <label
                  htmlFor="paperCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  <span className="text-red-500">*</span>Paper Code
                </label>
                <input
                  type="text"
                  id="paperCode"
                  name="paperCode"
                  value={formData.paperCode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                />
              </div>

              {/* Paper Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Paper Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                />
              </div>

              {/* Max Marks */}
              <div>
                <label
                  htmlFor="maxMarks"
                  className="block text-sm font-medium text-gray-700"
                >
                  <span className="text-red-500">*</span>Max Marks
                </label>
                <input
                  type="number"
                  id="maxMarks"
                  name="maxMarks"
                  value={formData.maxMarks}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                />
              </div>

              {/* PDF Upload */}
              <div>
                <label
                  htmlFor="paperFile"
                  className="block text-sm font-medium text-gray-700"
                >
                  <span className="text-red-500">*</span>Question Paper (PDF)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="paperFile"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="paperFile"
                          name="paperFile"
                          type="file"
                          className="sr-only"
                          accept=".pdf"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    {file && (
                      <p className="text-sm text-green-600">{file.name} selected</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-5">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setFormData({
                    course: "",
                    subject: "",
                    subjectId: "",
                    paperCode: "",
                    maxMarks: 100,
                    title: "",
                  });
                  setFile(null);
                  document.getElementById("paperFile").value = "";
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`ml-3 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CloudUploadIcon className="h-4 w-4 mr-1" />
                    Upload Paper
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      )}

      {/* Fragmentation Tab */}
      {activeTab === "fragmentation" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Create Question Structure
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                totalMarks === parseFloat(formData.maxMarks)
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              Total: {totalMarks}/{formData.maxMarks} marks
            </span>
          </div>
          
          {/* Paper Selection */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select a Paper</h3>
            
            {uploadedPapers.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No papers available for fragmentation</p>
                <button 
                  onClick={() => setActiveTab("upload")}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CloudUploadIcon className="h-4 w-4 mr-1" />
                  Upload a new paper
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedPapers.map((paper) => (
                  <div 
                    key={paper.paperId}
                    onClick={() => handleSelectPaper(paper.paperId)}
                    className={`cursor-pointer p-4 rounded-lg border ${
                      selectedPaperId === paper.paperId 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    } transition-colors`}
                  >
                    <div className="font-medium text-gray-900">{paper.paperCode}</div>
                    <div className="text-sm text-gray-500">{paper.subject}</div>
                    <div className="text-sm text-gray-500 mt-2">
                      Max Marks: {paper.maxMarks}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {selectedPaperId && (
            <form onSubmit={handleFragmentationSubmit} className="space-y-6">
              {/* Question Structure Section */}
              <QuestionStructure
                questionGroups={questionGroups}
                setQuestionGroups={setQuestionGroups}
                maxMarks={formData.maxMarks}
              />

              <div className="flex justify-end pt-5">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    setSelectedPaperId(null);
                    setQuestionGroups([
                      {
                        id: Date.now(),
                        questionNumber: "1",
                        maxMarks: 10,
                        subquestions: [],
                      },
                    ]);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-3 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ListAltIcon className="h-4 w-4 mr-1" />
                      Preview & Save
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {/* Preview Modal */}
      <QuestionPaperPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleFinalSubmit}
        formData={formData}
        questionGroups={questionGroups}
        file={null} // Not needed for fragmentation preview
        loading={loading}
      />
    </div>
  );
};

export default UploadEvalData;
