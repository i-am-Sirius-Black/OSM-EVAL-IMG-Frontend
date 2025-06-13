// import { useState, useEffect, useRef } from "react";
// import { toast } from "react-hot-toast";
// import api from "../../../../api/axios";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import ImageIcon from "@mui/icons-material/Image";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import DeleteIcon from "@mui/icons-material/Delete";

// const QuestionImageManager = () => {
//   const [loading, setLoading] = useState(false);
//   const [papers, setPapers] = useState([]);
//   const [selectedPaper, setSelectedPaper] = useState(null);
//   const [selectedPaperId, setSelectedPaperId] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [filteredPapers, setFilteredPapers] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [uploadingQuestions, setUploadingQuestions] = useState(new Set());
//   const [previewImage, setPreviewImage] = useState(null);

//   const fileInputRefs = useRef({});

//   // Fetch all available courses
//   const fetchCourses = async () => {
//     try {
//       const response = await api.get("/api/exams/");
//       setCourses(response.data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       toast.error("Failed to load courses");
//     }
//   };

//   // Fetch all data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         await fetchCourses();
//         const response = await api.get("/api/admin/papers?fragmented=true");
//         setPapers(response.data);
//         setFilteredPapers(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle course filter change
//   const handleCourseChange = (courseId) => {
//     setSelectedCourse(courseId);

//     if (!courseId) {
//       setFilteredPapers(papers);
//     } else {
//       const filtered = papers.filter((paper) => paper.courseId === courseId);
//       setFilteredPapers(filtered);
//     }

//     // Clear selection when changing courses
//     setSelectedPaperId(null);
//     setSelectedPaper(null);
//     setQuestions([]);
//   };

//   // Load paper details and questions
//   const handleSelectPaper = async (paperId) => {
//     try {
//       setLoading(true);
//       setSelectedPaperId(paperId);

//       const response = await api.get(`/api/admin/papers/${paperId}`);
//       const paper = response.data;
//       setSelectedPaper(paper);

//       if (paper.questions && paper.questions.length > 0) {
//         // Group questions by main number and flatten for display
//         const allQuestions = [];

//         paper.questions.forEach((q) => {
//           // Add main questions (no parts or with parts)
//           if (!q.qNo.match(/[a-z]$/)) {
//             allQuestions.push({
//               id: `main-${q.qNo}`,
//               questionNumber: q.qNo,
//               maxMark: q.maxMark,
//               questionImage: q.questionImage || null,
//               type: q.hasParts ? 'main-with-parts' : 'simple',
//               isChoiceBased: q.isChoiceBased,
//               choiceAttemptCount: q.choiceAttemptCount,
//               partsCount: q.partsCount
//             });
//           } else {
//             // Add part questions (1a, 1b, etc.)
//             allQuestions.push({
//               id: `part-${q.qNo}`,
//               questionNumber: q.qNo,
//               maxMark: q.maxMark,
//               questionImage: q.questionImage || null,
//               type: 'part',
//               isChoiceBased: false,
//               choiceAttemptCount: null
//             });
//           }
//         });

//         // Sort questions naturally (1, 1a, 1b, 2, 2a, etc.)
//         allQuestions.sort((a, b) => {
//           const aMatch = a.questionNumber.match(/^(\d+)([a-z]*)$/);
//           const bMatch = b.questionNumber.match(/^(\d+)([a-z]*)$/);

//           if (!aMatch || !bMatch) return 0;

//           const aNum = parseInt(aMatch[1]);
//           const bNum = parseInt(bMatch[1]);

//           if (aNum !== bNum) return aNum - bNum;

//           const aSuffix = aMatch[2] || '';
//           const bSuffix = bMatch[2] || '';

//           return aSuffix.localeCompare(bSuffix);
//         });

//         setQuestions(allQuestions);
//       } else {
//         setQuestions([]);
//         toast.warning("No questions found for this paper.");
//       }
//     } catch (error) {
//       console.error("Error loading paper details:", error);
//       toast.error("Failed to load paper details: " + (error.response?.data?.message || error.message));
//       setSelectedPaperId(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle image upload
//   const handleImageUpload = async (questionId, questionNumber, file) => {
//     if (!file) return;

//     // Validate file
//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select an image file');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('Image size should be less than 5MB');
//       return;
//     }

//     try {
//       setUploadingQuestions(prev => new Set(prev).add(questionId));

//       const formData = new FormData();
//       formData.append('questionImage', file);
//       formData.append('questionNumber', questionNumber);
//       formData.append('paperId', selectedPaperId);

//       const response = await api.post('/api/question-images/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.data.success) {
//         // Update the question with new image URL
//         setQuestions(prev => prev.map(q =>
//           q.id === questionId
//             ? { ...q, questionImage: response.data.imageUrl }
//             : q
//         ));

//         toast.success(`Image uploaded for question ${questionNumber}`);
//       } else {
//         throw new Error(response.data.message || 'Upload failed');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Failed to upload image: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setUploadingQuestions(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(questionId);
//         return newSet;
//       });

//       // Clear file input
//       if (fileInputRefs.current[questionId]) {
//         fileInputRefs.current[questionId].value = '';
//       }
//     }
//   };

//   // Handle image removal
//   const handleImageRemove = async (questionId, questionNumber) => {
//     try {
//       setUploadingQuestions(prev => new Set(prev).add(questionId));

//       await api.delete(`/api/question-images/${selectedPaperId}/${questionNumber}`);

//       // Update the question to remove image
//       setQuestions(prev => prev.map(q =>
//         q.id === questionId
//           ? { ...q, questionImage: null }
//           : q
//       ));

//       toast.success(`Image removed for question ${questionNumber}`);
//     } catch (error) {
//       console.error('Remove error:', error);
//       toast.error('Failed to remove image: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setUploadingQuestions(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(questionId);
//         return newSet;
//       });
//     }
//   };

//   // Image preview modal
//   const ImagePreviewModal = ({ imageUrl, questionNumber, onClose }) => {
//     if (!imageUrl) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
//         <div className="bg-white rounded-lg shadow-lg max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
//           <div className="flex items-center justify-between p-4 border-b">
//             <h3 className="text-lg font-medium">Question {questionNumber}</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//           <div className="flex-1 p-4 overflow-auto">
//             <img
//               src={imageUrl}
//               alt={`Question ${questionNumber}`}
//               className="max-w-full h-auto mx-auto"
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const getQuestionTypeColor = (type) => {
//     switch (type) {
//       case 'simple':
//         return 'bg-gray-100 text-gray-800';
//       case 'main-with-parts':
//         return 'bg-blue-100 text-blue-800';
//       case 'part':
//         return 'bg-green-100 text-green-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getQuestionTypeLabel = (question) => {
//     if (question.type === 'simple') return 'Simple';
//     if (question.type === 'main-with-parts') {
//       return question.isChoiceBased
//         ? `Choice (${question.choiceAttemptCount}/${question.partsCount})`
//         : `Multi-part (${question.partsCount})`;
//     }
//     if (question.type === 'part') return 'Part';
//     return 'Unknown';
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6">
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-2">
//           Question Images Manager
//         </h2>
//         <p className="text-sm text-gray-600">
//           Upload and manage images for individual questions in fragmented papers.
//         </p>
//       </div>

//       {/* Papers List */}
//       <div className="mb-6">
//         {/* Filter Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <FilterListIcon className="h-5 w-5 text-gray-500" />
//             <h3 className="text-sm font-semibold text-gray-800">
//               Available Papers ({filteredPapers.length})
//             </h3>
//           </div>

//           <select
//             value={selectedCourse}
//             onChange={(e) => handleCourseChange(e.target.value)}
//             className="text-sm border-gray-300 rounded-md px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="">All Courses</option>
//             {courses.map((course) => (
//               <option key={course.courseId} value={course.courseId}>
//                 {course.courseName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Papers Grid */}
//         {loading && !selectedPaperId ? (
//           <div className="text-center py-8">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
//             <p className="mt-2 text-sm text-gray-600">Loading papers...</p>
//           </div>
//         ) : filteredPapers.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
//             <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
//             <p className="text-sm text-gray-600 font-medium">
//               {selectedCourse ? "No papers found for selected course" : "No fragmented papers available"}
//             </p>
//             <p className="text-xs text-gray-500 mt-1">
//               Create fragmentations first or select a different course
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredPapers.map((paper) => (
//               <div
//                 key={paper.paperId}
//                 onClick={() => handleSelectPaper(paper.paperId)}
//                 className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
//                   selectedPaperId === paper.paperId
//                     ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
//                     : "border-gray-200 hover:border-gray-300 bg-white"
//                 }`}
//               >
//                 <h4 className="font-semibold text-gray-900 mb-2">{paper.paperCode}</h4>
//                 <p className="text-sm text-gray-600 mb-1">{paper.subject}</p>
//                 <p className="text-xs text-gray-500">{paper.courseName || "Unknown Course"}</p>
//                 <div className="mt-3 flex items-center justify-between">
//                   <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
//                     {paper.maxMarks} marks
//                   </span>
//                   {selectedPaperId === paper.paperId && (
//                     <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                       Selected
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Questions List */}
//       {selectedPaper && (
//         <div className="border-t pt-6">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-md font-medium text-blue-800">
//                   Managing Images: {selectedPaper.paperCode}
//                 </h3>
//                 <p className="text-sm text-blue-700 mt-1">
//                   Upload images for individual questions and parts
//                 </p>
//               </div>
//               <div className="text-sm text-blue-800">
//                 <span className="font-medium">{questions.length}</span> questions
//               </div>
//             </div>
//           </div>

//           {questions.length === 0 ? (
//             <div className="text-center py-8 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-600">No questions found for this paper.</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {questions.map((question) => (
//                 <div
//                   key={question.id}
//                   className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
//                 >
//                   {/* Question Info */}
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-3">
//                       <span className="font-semibold text-gray-900 text-lg w-12">
//                         {question.questionNumber}
//                       </span>
//                       <div className="flex flex-col">
//                         <span className={`text-xs font-medium px-2 py-1 rounded-full ${getQuestionTypeColor(question.type)}`}>
//                           {getQuestionTypeLabel(question)}
//                         </span>
//                         <span className="text-xs text-gray-500 mt-1">
//                           {question.maxMark} marks
//                         </span>
//                       </div>
//                     </div>

//                     {/* Image Status */}
//                     <div className="flex items-center gap-2">
//                       {question.questionImage ? (
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                           <span className="text-sm text-green-700 font-medium">Image uploaded</span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
//                           <span className="text-sm text-gray-500">No image</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center gap-2">
//                     {/* Preview Button */}
//                     {question.questionImage && (
//                       <button
//                         onClick={() => setPreviewImage({ url: question.questionImage, number: question.questionNumber })}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
//                         title="Preview image"
//                       >
//                         <VisibilityIcon className="h-4 w-4" />
//                       </button>
//                     )}

//                     {/* Upload Button */}
//                     <button
//                       onClick={() => fileInputRefs.current[question.id]?.click()}
//                       disabled={uploadingQuestions.has(question.id)}
//                       className={`p-2 rounded-md transition-colors ${
//                         question.questionImage
//                           ? 'text-orange-600 hover:bg-orange-50'
//                           : 'text-green-600 hover:bg-green-50'
//                       }`}
//                       title={question.questionImage ? "Change image" : "Upload image"}
//                     >
//                       {uploadingQuestions.has(question.id) ? (
//                         <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                       ) : (
//                         <CloudUploadIcon className="h-4 w-4" />
//                       )}
//                     </button>

//                     {/* Remove Button */}
//                     {question.questionImage && (
//                       <button
//                         onClick={() => handleImageRemove(question.id, question.questionNumber)}
//                         disabled={uploadingQuestions.has(question.id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
//                         title="Remove image"
//                       >
//                         <DeleteIcon className="h-4 w-4" />
//                       </button>
//                     )}

//                     {/* Hidden File Input */}
//                     <input
//                       ref={el => fileInputRefs.current[question.id] = el}
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (file) {
//                           handleImageUpload(question.id, question.questionNumber, file);
//                         }
//                       }}
//                       className="hidden"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Image Preview Modal */}
//       {previewImage && (
//         <ImagePreviewModal
//           imageUrl={previewImage.url}
//           questionNumber={previewImage.number}
//           onClose={() => setPreviewImage(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default QuestionImageManager;

//?v2- testing

// import { useState, useEffect, useRef } from "react";
// import { toast } from "react-hot-toast";
// import api from "../../../../api/axios";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import ImageIcon from "@mui/icons-material/Image";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useQuestionImages } from "../../../../hooks/UseQuestionImages";

// const QuestionImageManager = () => {
//   const [loading, setLoading] = useState(false);
//   const [papers, setPapers] = useState([]);
//   const [selectedPaper, setSelectedPaper] = useState(null);
//   const [selectedPaperId, setSelectedPaperId] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [filteredPapers, setFilteredPapers] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [uploadingQuestions, setUploadingQuestions] = useState(new Set());
//   const [previewImage, setPreviewImage] = useState(null);

//   const fileInputRefs = useRef({});

//     const {
//     images: questionImages,
//     updateLocalImage,
//     removeLocalImage
//   } = useQuestionImages(selectedPaperId);

//   // Fetch all available courses
//   const fetchCourses = async () => {
//     try {
//       const response = await api.get("/api/exams/");
//       setCourses(response.data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       toast.error("Failed to load courses");
//     }
//   };

//   // Fetch all data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         await fetchCourses();
//         const response = await api.get("/api/admin/papers?fragmented=true");
//         setPapers(response.data);
//         setFilteredPapers(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle course filter change
//   const handleCourseChange = (courseId) => {
//     setSelectedCourse(courseId);

//     if (!courseId) {
//       setFilteredPapers(papers);
//     } else {
//       const filtered = papers.filter((paper) => paper.courseId === courseId);
//       setFilteredPapers(filtered);
//     }

//     // Clear selection when changing courses
//     setSelectedPaperId(null);
//     setSelectedPaper(null);
//     setQuestions([]);
//   };

// // Update handleSelectPaper to use the new dedicated API
// const handleSelectPaper = async (paperId) => {
//   try {
//     setLoading(true);
//     setSelectedPaperId(paperId);

//     // Get paper details
//     const paperResponse = await api.get(`/api/admin/papers/${paperId}`);
//     const paper = paperResponse.data;
//     setSelectedPaper(paper);

//     // Get question images separately
//     const imagesResponse = await api.get(`/api/question-images/paper/${paperId}`);
//     const questionImages = imagesResponse.data.success ? imagesResponse.data.images : {};

//     if (paper.questions && paper.questions.length > 0) {
//       const allQuestions = [];

//       paper.questions.forEach((q) => {
//         // If it's a simple question (no parts)
//         if (!q.hasParts) {
//           allQuestions.push({
//             id: `simple-${q.qNo}`,
//             questionNumber: q.qNo,
//             maxMark: q.maxMark,
//             questionImage: questionImages[q.qNo]?.main || null, // Get main image from separate API
//             type: 'simple',
//             isChoiceBased: q.isChoiceBased,
//             choiceAttemptCount: q.choiceAttemptCount,
//             originalQuestion: q
//           });
//         } else {
//           // If it has parts, generate parts dynamically
//           const partsCount = q.partsCount || 0;

//           for (let i = 0; i < partsCount; i++) {
//             const partLetter = String.fromCharCode(97 + i); // 'a', 'b', 'c', etc.
//             const partNumber = `${q.qNo}${partLetter}`;

//             allQuestions.push({
//               id: `part-${q.qNo}-${partLetter}`,
//               questionNumber: partNumber,
//               maxMark: q.partMarks || (q.maxMark / partsCount),
//               questionImage: questionImages[q.qNo]?.parts?.[partLetter] || null, // Get part-specific image from separate API
//               type: 'part',
//               isChoiceBased: q.isChoiceBased,
//               choiceAttemptCount: q.choiceAttemptCount,
//               parentQuestion: q.qNo,
//               originalQuestion: q,
//               partIndex: i,
//               partLetter: partLetter
//             });
//           }
//         }
//       });

//       // Sort questions naturally
//       allQuestions.sort((a, b) => {
//         const aMatch = a.questionNumber.match(/^(\d+)([a-z]*)$/);
//         const bMatch = b.questionNumber.match(/^(\d+)([a-z]*)$/);

//         if (!aMatch || !bMatch) return 0;

//         const aNum = parseInt(aMatch[1]);
//         const bNum = parseInt(bMatch[1]);

//         if (aNum !== bNum) return aNum - bNum;

//         const aSuffix = aMatch[2] || '';
//         const bSuffix = bMatch[2] || '';

//         return aSuffix.localeCompare(bSuffix);
//       });

//       setQuestions(allQuestions);
//     } else {
//       setQuestions([]);
//       toast.warning("No questions found for this paper.");
//     }
//   } catch (error) {
//     console.error("Error loading paper details:", error);
//     toast.error("Failed to load paper details: " + (error.response?.data?.message || error.message));
//     setSelectedPaperId(null);
//   } finally {
//     setLoading(false);
//   }
// };

// // Update the handleImageUpload function
// const handleImageUpload = async (questionId, questionNumber, file) => {
//   if (!file) return;

//   // Validate file
//   if (!file.type.startsWith('image/')) {
//     toast.error('Please select an image file');
//     return;
//   }

//   if (file.size > 5 * 1024 * 1024) {
//     toast.error('Image size should be less than 5MB');
//     return;
//   }

//   try {
//     setUploadingQuestions(prev => new Set(prev).add(questionId));

//     const formData = new FormData();
//     formData.append('questionImage', file);
//     formData.append('paperId', selectedPaperId);

//     // Find the question to determine if it's a part or main question
//     const question = questions.find(q => q.id === questionId);

//     if (question.type === 'part') {
//       // For parts: send parent question number and part letter
//       formData.append('questionNumber', question.parentQuestion);
//       formData.append('partLetter', question.questionNumber.slice(-1)); // Get the letter (a, b, c, etc.)
//     } else {
//       // For simple questions: send question number only
//       formData.append('questionNumber', questionNumber);
//     }

//     const response = await api.post('/api/question-images/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//   if (response.data.success) {
//     // Update local state
//     setQuestions(prev => prev.map(q =>
//       q.id === questionId
//         ? { ...q, questionImage: response.data.imageUrl }
//         : q
//     ));

//         // Update hook state
//     if (question.type === 'part') {
//       updateLocalImage(question.parentQuestion, question.partLetter, response.data.imageUrl);
//     } else {
//       updateLocalImage(questionNumber, null, response.data.imageUrl);
//     }

//       toast.success(`Image uploaded for question ${questionNumber}`);
//     } else {
//       throw new Error(response.data.message || 'Upload failed');
//     }
//   } catch (error) {
//     console.error('Upload error:', error);
//     toast.error('Failed to upload image: ' + (error.response?.data?.message || error.message));
//   } finally {
//     setUploadingQuestions(prev => {
//       const newSet = new Set(prev);
//       newSet.delete(questionId);
//       return newSet;
//     });

//     // Clear file input
//     if (fileInputRefs.current[questionId]) {
//       fileInputRefs.current[questionId].value = '';
//     }
//   }
// };

// // Update the handleImageRemove function
// const handleImageRemove = async (questionId, questionNumber) => {
//   try {
//     setUploadingQuestions(prev => new Set(prev).add(questionId));

//     const question = questions.find(q => q.id === questionId);
//     let url = `/api/question-images/${selectedPaperId}/${questionNumber}`;

//     if (question.type === 'part') {
//       // For parts, add part letter as query parameter
//       const partLetter = questionNumber.slice(-1);
//       url += `?partLetter=${partLetter}`;
//       // Also update the URL to use parent question number
//       url = `/api/question-images/${selectedPaperId}/${question.parentQuestion}?partLetter=${partLetter}`;
//     }

//     await api.delete(url);

//     // Update the question to remove image
//     setQuestions(prev => prev.map(q =>
//       q.id === questionId
//         ? { ...q, questionImage: null }
//         : q
//     ));

//       // After successful deletion:
//   if (question.type === 'part') {
//     removeLocalImage(question.parentQuestion, question.partLetter);
//   } else {
//     removeLocalImage(questionNumber, null);
//   }

//     toast.success(`Image removed for question ${questionNumber}`);
//   } catch (error) {
//     console.error('Remove error:', error);
//     toast.error('Failed to remove image: ' + (error.response?.data?.message || error.message));
//   } finally {
//     setUploadingQuestions(prev => {
//       const newSet = new Set(prev);
//       newSet.delete(questionId);
//       return newSet;
//     });
//   }
// };

//   // Image preview modal
//   const ImagePreviewModal = ({ imageUrl, questionNumber, onClose }) => {
//     if (!imageUrl) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
//         <div className="bg-white rounded-lg shadow-lg max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
//           <div className="flex items-center justify-between p-4 border-b">
//             <h3 className="text-lg font-medium">Question {questionNumber}</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//           <div className="flex-1 p-4 overflow-auto">
//             <img
//               src={imageUrl}
//               alt={`Question ${questionNumber}`}
//               className="max-w-full h-auto mx-auto"
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//  // Update the helper functions to handle the new structure
// const getQuestionTypeColor = (type) => {
//   switch (type) {
//     case 'simple':
//       return 'bg-gray-100 text-gray-800';
//     case 'part':
//       return 'bg-green-100 text-green-800';
//     default:
//       return 'bg-gray-100 text-gray-800';
//   }
// };

// const getQuestionTypeLabel = (question) => {
//   if (question.type === 'simple') {
//     return question.isChoiceBased
//       ? `Simple - Choice (${question.choiceAttemptCount})`
//       : 'Simple Question';
//   }
//   if (question.type === 'part') {
//     const parentQ = question.originalQuestion;
//     return parentQ.isChoiceBased
//       ? `Question Part - Choice (${parentQ.choiceAttemptCount}/${parentQ.partsCount})`
//       : 'Question Part';
//   }
//   return 'Unknown';
// };

// // Helper function to get upload stats
// const getUploadStats = () => {
//   const totalQuestions = questions.length;
//   const questionsWithImages = questions.filter(q => q.questionImage).length;
//   return { total: totalQuestions, uploaded: questionsWithImages };
// };

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6">
// <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//   <div className="flex items-center justify-between">
//     <div>
//       <h3 className="text-md font-medium text-blue-800">
//         {/* Managing Images: {selectedPaper.paperCode} */}
//       </h3>
//       <p className="text-sm text-blue-700 mt-1">
//         Upload images for individual questions and parts
//       </p>
//     </div>
//     <div className="text-sm text-blue-800">
//       <span className="font-medium">{questions.length}</span> questions •{' '}
//       <span className="font-medium text-green-700">
//         {getUploadStats().uploaded}/{getUploadStats().total}
//       </span>{' '}
//       images uploaded
//     </div>
//   </div>
// </div>

//       {/* Papers List */}
//       <div className="mb-6">
//         {/* Filter Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <FilterListIcon className="h-5 w-5 text-gray-500" />
//             <h3 className="text-sm font-semibold text-gray-800">
//               Available Papers ({filteredPapers.length})
//             </h3>
//           </div>

//           <select
//             value={selectedCourse}
//             onChange={(e) => handleCourseChange(e.target.value)}
//             className="text-sm border-gray-300 rounded-md px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="">All Courses</option>
//             {courses.map((course) => (
//               <option key={course.courseId} value={course.courseId}>
//                 {course.courseName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Papers Grid */}
//         {loading && !selectedPaperId ? (
//           <div className="text-center py-8">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
//             <p className="mt-2 text-sm text-gray-600">Loading papers...</p>
//           </div>
//         ) : filteredPapers.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
//             <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
//             <p className="text-sm text-gray-600 font-medium">
//               {selectedCourse ? "No papers found for selected course" : "No fragmented papers available"}
//             </p>
//             <p className="text-xs text-gray-500 mt-1">
//               Create fragmentations first or select a different course
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredPapers.map((paper) => (
//               <div
//                 key={paper.paperId}
//                 onClick={() => handleSelectPaper(paper.paperId)}
//                 className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
//                   selectedPaperId === paper.paperId
//                     ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
//                     : "border-gray-200 hover:border-gray-300 bg-white"
//                 }`}
//               >
//                 <h4 className="font-semibold text-gray-900 mb-2">{paper.paperCode}</h4>
//                 <p className="text-sm text-gray-600 mb-1">{paper.subject}</p>
//                 <p className="text-xs text-gray-500">{paper.courseName || "Unknown Course"}</p>
//                 <div className="mt-3 flex items-center justify-between">
//                   <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
//                     {paper.maxMarks} marks
//                   </span>
//                   {selectedPaperId === paper.paperId && (
//                     <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                       Selected
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Questions List */}
//       {selectedPaper && (
//         <div className="border-t pt-6">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-md font-medium text-blue-800">
//                   Managing Images: {selectedPaper.paperCode}
//                 </h3>
//                 <p className="text-sm text-blue-700 mt-1">
//                   Upload images for individual questions and parts
//                 </p>
//               </div>
//               <div className="text-sm text-blue-800">
//                 <span className="font-medium">{questions.length}</span> questions •{' '}
//                 <span className="font-medium text-green-700">
//                   {getUploadStats().uploaded}/{getUploadStats().total}
//                 </span>{' '}
//                 images uploaded
//               </div>
//             </div>
//           </div>

// {questions.length === 0 ? (
//   <div className="text-center py-8 bg-gray-50 rounded-lg">
//     <p className="text-sm text-gray-600">No questions found for this paper.</p>
//   </div>
// ) : (
//   <div className="space-y-3">
//     {questions.map((question) => (
//       <div
//         key={question.id}
//         className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
//       >
//         {/* Question Info with Hierarchy Display */}
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-3 min-w-0">
//             {/* Question Number with Hierarchy */}
//             <div className="flex items-center gap-2">
//               {question.type === 'part' ? (
//                 // Part questions with hierarchy: "Q1 → 1a"
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <span className="text-sm font-medium w-8">Q{question.parentQuestion}</span>
//                   <span className="text-gray-400">→</span>
//                   <span className="font-semibold text-gray-900 text-lg w-10">
//                     {question.questionNumber}
//                   </span>
//                 </div>
//               ) : (
//                 // Simple questions: just the number
//                 <span className="font-semibold text-gray-900 text-lg w-10 text-center">
//                   {question.questionNumber}
//                 </span>
//               )}
//             </div>

//             {/* Question Type and Marks */}
//             <div className="flex flex-col">
//               <span className={`text-xs font-medium px-2 py-1 rounded-full ${getQuestionTypeColor(question.type)}`}>
//                 {getQuestionTypeLabel(question)}
//               </span>
//               <span className="text-xs text-gray-500 mt-1">
//                 {question.maxMark} marks
//               </span>
//             </div>
//           </div>

//           {/* Image Status */}
//           <div className="flex items-center gap-2">
//             {question.questionImage ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                 <span className="text-sm text-green-700 font-medium">Image uploaded</span>
//               </div>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
//                 <span className="text-sm text-gray-500">No image</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Actions - same as before */}
//         <div className="flex items-center gap-2">
//           {/* Preview Button */}
//           {question.questionImage && (
//             <button
//               onClick={() => setPreviewImage({ url: question.questionImage, number: question.questionNumber })}
//               className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
//               title="Preview image"
//             >
//               <VisibilityIcon className="h-4 w-4" />
//             </button>
//           )}

//           {/* Upload Button */}
//           <button
//             onClick={() => fileInputRefs.current[question.id]?.click()}
//             disabled={uploadingQuestions.has(question.id)}
//             className={`p-2 rounded-md transition-colors ${
//               question.questionImage
//                 ? 'text-orange-600 hover:bg-orange-50'
//                 : 'text-green-600 hover:bg-green-50'
//             }`}
//             title={question.questionImage ? "Change image" : "Upload image"}
//           >
//             {uploadingQuestions.has(question.id) ? (
//               <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//             ) : (
//               <CloudUploadIcon className="h-4 w-4" />
//             )}
//           </button>

//           {/* Remove Button */}
//           {question.questionImage && (
//             <button
//               onClick={() => handleImageRemove(question.id, question.questionNumber)}
//               disabled={uploadingQuestions.has(question.id)}
//               className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
//               title="Remove image"
//             >
//               <DeleteIcon className="h-4 w-4" />
//             </button>
//           )}

//           {/* Hidden File Input */}
//           <input
//             ref={el => fileInputRefs.current[question.id] = el}
//             type="file"
//             accept="image/*"
//             onChange={(e) => {
//               const file = e.target.files[0];
//               if (file) {
//                 handleImageUpload(question.id, question.questionNumber, file);
//               }
//             }}
//             className="hidden"
//           />
//         </div>
//       </div>
//     ))}
//   </div>
// )}
//         </div>
//       )}

//       {/* Image Preview Modal */}
//       {previewImage && (
//         <ImagePreviewModal
//           imageUrl={previewImage.url}
//           questionNumber={previewImage.number}
//           onClose={() => setPreviewImage(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default QuestionImageManager;

//?v3-> Batch upload

// import { useState, useEffect, useRef } from "react";
// import { toast } from "react-hot-toast";
// import api from "../../../../api/axios";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import ImageIcon from "@mui/icons-material/Image";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
// import SaveIcon from "@mui/icons-material/Save";

// const QuestionImageManager = () => {
//   const [loading, setLoading] = useState(false);
//   const [papers, setPapers] = useState([]);
//   const [selectedPaper, setSelectedPaper] = useState(null);
//   const [selectedPaperId, setSelectedPaperId] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [filteredPapers, setFilteredPapers] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);

//   // Batch upload states
//   const [questionImages, setQuestionImages] = useState({}); // Store selected files
//   const [skippedQuestions, setSkippedQuestions] = useState(new Set());
//   const [batchUploading, setBatchUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState({}); // Track individual upload progress

//   const fileInputRefs = useRef({});

//   // Fetch all available courses
//   const fetchCourses = async () => {
//     try {
//       const response = await api.get("/api/exams/");
//       setCourses(response.data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       toast.error("Failed to load courses");
//     }
//   };

//   // Fetch all data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         await fetchCourses();
//         const response = await api.get("/api/admin/papers?fragmented=true");
//         setPapers(response.data);
//         setFilteredPapers(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle course filter change
//   const handleCourseChange = (courseId) => {
//     setSelectedCourse(courseId);

//     if (!courseId) {
//       setFilteredPapers(papers);
//     } else {
//       const filtered = papers.filter((paper) => paper.courseId === courseId);
//       setFilteredPapers(filtered);
//     }

//     // Clear selection when changing courses
//     setSelectedPaperId(null);
//     setSelectedPaper(null);
//     setQuestions([]);
//     resetBatchUploadState();
//   };

//   // Reset batch upload state
//   const resetBatchUploadState = () => {
//     setQuestionImages({});
//     setSkippedQuestions(new Set());
//     setUploadProgress({});
//   };

//   // Load paper details and questions
//   const handleSelectPaper = async (paperId) => {
//     try {
//       setLoading(true);
//       setSelectedPaperId(paperId);
//       resetBatchUploadState();

//       // Get paper details
//       const paperResponse = await api.get(`/api/admin/papers/${paperId}`);
//       const paper = paperResponse.data;
//       setSelectedPaper(paper);

//       // Get existing question images
//       const imagesResponse = await api.get(
//         `/api/question-images/paper/${paperId}`
//       );
//       const existingImages = imagesResponse.data.success
//         ? imagesResponse.data.images
//         : {};

//       if (paper.questions && paper.questions.length > 0) {
//         const allQuestions = [];

//         paper.questions.forEach((q) => {
//           // If it's a simple question (no parts)
//           if (!q.hasParts) {
//             allQuestions.push({
//               id: `simple-${q.qNo}`,
//               questionNumber: q.qNo,
//               maxMark: q.maxMark,
//               questionImage: existingImages[q.qNo]?.main || null,
//               type: "simple",
//               isChoiceBased: q.isChoiceBased,
//               choiceAttemptCount: q.choiceAttemptCount,
//               originalQuestion: q,
//             });
//           } else {
//             // If it has parts, generate parts dynamically
//             const partsCount = q.partsCount || 0;

//             for (let i = 0; i < partsCount; i++) {
//               const partLetter = String.fromCharCode(97 + i); // 'a', 'b', 'c', etc.
//               const partNumber = `${q.qNo}${partLetter}`;

//               allQuestions.push({
//                 id: `part-${q.qNo}-${partLetter}`,
//                 questionNumber: partNumber,
//                 maxMark: q.partMarks || q.maxMark / partsCount,
//                 questionImage:
//                   existingImages[q.qNo]?.parts?.[partLetter] || null,
//                 type: "part",
//                 isChoiceBased: q.isChoiceBased,
//                 choiceAttemptCount: q.choiceAttemptCount,
//                 parentQuestion: q.qNo,
//                 originalQuestion: q,
//                 partIndex: i,
//                 partLetter: partLetter,
//               });
//             }
//           }
//         });

//         // Sort questions naturally
//         allQuestions.sort((a, b) => {
//           const aMatch = a.questionNumber.match(/^(\d+)([a-z]*)$/);
//           const bMatch = b.questionNumber.match(/^(\d+)([a-z]*)$/);

//           if (!aMatch || !bMatch) return 0;

//           const aNum = parseInt(aMatch[1]);
//           const bNum = parseInt(bMatch[1]);

//           if (aNum !== bNum) return aNum - bNum;

//           const aSuffix = aMatch[2] || "";
//           const bSuffix = bMatch[2] || "";

//           return aSuffix.localeCompare(bSuffix);
//         });

//         setQuestions(allQuestions);
//       } else {
//         setQuestions([]);
//         toast.warning("No questions found for this paper.");
//       }
//     } catch (error) {
//       console.error("Error loading paper details:", error);
//       toast.error(
//         "Failed to load paper details: " +
//           (error.response?.data?.message || error.message)
//       );
//       setSelectedPaperId(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle file selection for a question
//   const handleFileSelect = (questionId, file) => {
//     if (!file) return;

//     // Validate file
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select an image file");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image size should be less than 5MB");
//       return;
//     }

//     // Store the file for batch upload
//     setQuestionImages((prev) => ({
//       ...prev,
//       [questionId]: file,
//     }));

//     // Remove from skipped list if it was there
//     setSkippedQuestions((prev) => {
//       const newSet = new Set(prev);
//       newSet.delete(questionId);
//       return newSet;
//     });
//   };

//   // Handle skip toggle
//   const handleSkipToggle = (questionId) => {
//     setSkippedQuestions((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(questionId)) {
//         newSet.delete(questionId);
//       } else {
//         newSet.add(questionId);
//         // Remove from selected images if skipped
//         setQuestionImages((prevImages) => {
//           const newImages = { ...prevImages };
//           delete newImages[questionId];
//           return newImages;
//         });
//       }
//       return newSet;
//     });
//   };

//   // Remove selected file
//   const handleRemoveFile = (questionId) => {
//     setQuestionImages((prev) => {
//       const newImages = { ...prev };
//       delete newImages[questionId];
//       return newImages;
//     });

//     // Clear file input
//     if (fileInputRefs.current[questionId]) {
//       fileInputRefs.current[questionId].value = "";
//     }
//   };

//   const handleBatchUpload = async () => {
//     const imagesToUpload = Object.keys(questionImages);

//     if (imagesToUpload.length === 0) {
//       toast.error("No images selected for upload");
//       return;
//     }

//     try {
//       setBatchUploading(true);
//       setUploadProgress({});

//       // Prepare FormData for batch upload
//       const formData = new FormData();
//       formData.append("paperId", selectedPaperId);

//       // Prepare question data array
//       const questionDataArray = [];

//       // Add files and corresponding question data
//       imagesToUpload.forEach((questionId, index) => {
//         const file = questionImages[questionId];
//         const question = questions.find((q) => q.id === questionId);

//         // Add file to FormData
//         formData.append("questionImages", file);

//         // Prepare question info
//         const questionInfo = {
//           questionId: questionId,
//           questionNumber: question.questionNumber,
//           type: question.type,
//           parentQuestion: question.parentQuestion || null,
//           partLetter: question.partLetter || null,
//         };

//         questionDataArray.push(questionInfo);

//         // Set uploading status
//         setUploadProgress((prev) => ({ ...prev, [questionId]: "uploading" }));
//       });

//       // Add question data as JSON string
//       formData.append("questionData", JSON.stringify(questionDataArray));

//       // Make batch upload request
//       const response = await api.post(
//         "/api/question-images/batch-upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         const { results, summary } = response.data;

//         // Update progress for each result
//         results.forEach((result) => {
//           if (result.success) {
//             setUploadProgress((prev) => ({
//               ...prev,
//               [result.questionId]: "success",
//             }));

//             // Update question with new image URL
//             setQuestions((prev) =>
//               prev.map((q) =>
//                 q.id === result.questionId
//                   ? { ...q, questionImage: result.imageUrl }
//                   : q
//               )
//             );
//           } else {
//             setUploadProgress((prev) => ({
//               ...prev,
//               [result.questionId]: "error",
//             }));
//           }
//         });

//         // Show summary toast
//         if (summary.successful > 0) {
//           toast.success(
//             `Successfully uploaded ${summary.successful} image(s)${
//               summary.failed > 0 ? `, ${summary.failed} failed` : ""
//             }`
//           );
//         }

//         if (summary.failed > 0 && response.data.errors.length > 0) {
//           // Show first few errors
//           const errorMessage = response.data.errors.slice(0, 3).join("; ");
//           toast.error(
//             `Upload errors: ${errorMessage}${
//               response.data.errors.length > 3 ? "..." : ""
//             }`
//           );
//         }

//         // Clear successfully uploaded images from selection
//         setQuestionImages((prev) => {
//           const newImages = { ...prev };
//           results.forEach((result) => {
//             if (result.success) {
//               delete newImages[result.questionId];
//               // Clear file input
//               if (fileInputRefs.current[result.questionId]) {
//                 fileInputRefs.current[result.questionId].value = "";
//               }
//             }
//           });
//           return newImages;
//         });
//       } else {
//         throw new Error(response.data.message || "Batch upload failed");
//       }
//     } catch (error) {
//       console.error("Batch upload error:", error);
//       toast.error(
//         "Failed to upload images: " +
//           (error.response?.data?.message || error.message)
//       );

//       // Set all as error
//       Object.keys(questionImages).forEach((questionId) => {
//         setUploadProgress((prev) => ({ ...prev, [questionId]: "error" }));
//       });
//     } finally {
//       setBatchUploading(false);
//     }
//   };


//   const getImageUrl = (imagePath) => {
//   if (!imagePath) return null;
  
//   // If it's already a full URL, return as is
//   if (imagePath.startsWith('http')) {
//     return imagePath;
//   }
  
//   // If it's a streaming URL, prepend backend URL
//   if (imagePath.startsWith('/api/question-images/stream')) {
//     const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//     return `${backendUrl}${imagePath}`;
//   }
  
//   return imagePath;
// };

//   // Helper functions
//   const getQuestionTypeColor = (type) => {
//     switch (type) {
//       case "simple":
//         return "bg-gray-100 text-gray-800";
//       case "part":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getQuestionTypeLabel = (question) => {
//     if (question.type === "simple") {
//       return question.isChoiceBased
//         ? `Simple - Choice (${question.choiceAttemptCount})`
//         : "Simple Question";
//     }
//     if (question.type === "part") {
//       const parentQ = question.originalQuestion;
//       return parentQ.isChoiceBased
//         ? `Question Part - Choice (${parentQ.choiceAttemptCount}/${parentQ.partsCount})`
//         : "Question Part";
//     }
//     return "Unknown";
//   };

//   const getUploadStats = () => {
//     const totalQuestions = questions.length;
//     const questionsWithImages = questions.filter((q) => q.questionImage).length;
//     const selectedForUpload = Object.keys(questionImages).length;
//     const skippedCount = skippedQuestions.size;

//     return {
//       total: totalQuestions,
//       uploaded: questionsWithImages,
//       selected: selectedForUpload,
//       skipped: skippedCount,
//     };
//   };

//   const getProgressIcon = (questionId) => {
//     const progress = uploadProgress[questionId];

//     switch (progress) {
//       case "uploading":
//         return (
//           <svg
//             className="w-4 h-4 animate-spin text-blue-500"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             ></circle>
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//             ></path>
//           </svg>
//         );
//       case "success":
//         return (
//           <svg
//             className="w-4 h-4 text-green-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         );
//       case "error":
//         return (
//           <svg
//             className="w-4 h-4 text-red-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         );
//       default:
//         return null;
//     }
//   };

//   // Update the ImagePreviewModal component with error handling
//   const ImagePreviewModal = ({ imageUrl, questionNumber, onClose }) => {
//     if (!imageUrl) return null;

//     return (
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//         onClick={onClose}
//       >
//         <div
//           className="bg-white rounded-lg shadow-lg max-w-4xl max-h-[90vh] flex flex-col"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="flex items-center justify-between p-4 border-b">
//             <h3 className="text-lg font-medium">Question {questionNumber}</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//           <div className="flex-1 p-4 overflow-auto">
//             <img
//               src={imageUrl}
//               alt={`Question ${questionNumber}`}
//               className="max-w-full h-auto mx-auto"
//               onError={(e) => {
//                 console.error("Image failed to load:", imageUrl);
//                 e.target.src =
//                   "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=";
//               }}
//               onLoad={() => {
//                 console.log("Image loaded successfully:", imageUrl);
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6">
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-2">
//           Question Images Manager (Batch Upload)
//         </h2>
//         <p className="text-sm text-gray-600">
//           Select images for multiple questions and upload them all at once. Skip
//           questions that don't have images.
//         </p>
//       </div>

//       {/* Papers List */}
//       <div className="mb-6">
//         {/* Filter Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <FilterListIcon className="h-5 w-5 text-gray-500" />
//             <h3 className="text-sm font-semibold text-gray-800">
//               Available Papers ({filteredPapers.length})
//             </h3>
//           </div>

//           <select
//             value={selectedCourse}
//             onChange={(e) => handleCourseChange(e.target.value)}
//             className="text-sm border-gray-300 rounded-md px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="">All Courses</option>
//             {courses.map((course) => (
//               <option key={course.courseId} value={course.courseId}>
//                 {course.courseName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Papers Grid */}
//         {loading && !selectedPaperId ? (
//           <div className="text-center py-8">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
//             <p className="mt-2 text-sm text-gray-600">Loading papers...</p>
//           </div>
//         ) : filteredPapers.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
//             <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
//             <p className="text-sm text-gray-600 font-medium">
//               {selectedCourse
//                 ? "No papers found for selected course"
//                 : "No fragmented papers available"}
//             </p>
//             <p className="text-xs text-gray-500 mt-1">
//               Create fragmentations first or select a different course
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredPapers.map((paper) => (
//               <div
//                 key={paper.paperId}
//                 onClick={() => handleSelectPaper(paper.paperId)}
//                 className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
//                   selectedPaperId === paper.paperId
//                     ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
//                     : "border-gray-200 hover:border-gray-300 bg-white"
//                 }`}
//               >
//                 <h4 className="font-semibold text-gray-900 mb-2">
//                   {paper.paperCode}
//                 </h4>
//                 <p className="text-sm text-gray-600 mb-1">{paper.subject}</p>
//                 <p className="text-xs text-gray-500">
//                   {paper.courseName || "Unknown Course"}
//                 </p>
//                 <div className="mt-3 flex items-center justify-between">
//                   <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
//                     {paper.maxMarks} marks
//                   </span>
//                   {selectedPaperId === paper.paperId && (
//                     <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                       Selected
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Questions List */}
//       {selectedPaper && (
//         <div className="border-t pt-6">
//           {/* Header with Batch Upload Controls */}
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-md font-medium text-blue-800">
//                   Managing Images: {selectedPaper.paperCode}
//                 </h3>
//                 <p className="text-sm text-blue-700 mt-1">
//                   Select images for questions and upload them all at once
//                 </p>
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="text-sm text-blue-800">
//                   <span className="font-medium">{getUploadStats().total}</span>{" "}
//                   questions •{" "}
//                   <span className="font-medium text-green-700">
//                     {getUploadStats().uploaded}
//                   </span>{" "}
//                   uploaded •{" "}
//                   <span className="font-medium text-blue-700">
//                     {getUploadStats().selected}
//                   </span>{" "}
//                   selected •{" "}
//                   <span className="font-medium text-orange-700">
//                     {getUploadStats().skipped}
//                   </span>{" "}
//                   skipped
//                 </div>
//                 <button
//                   onClick={handleBatchUpload}
//                   disabled={
//                     batchUploading || Object.keys(questionImages).length === 0
//                   }
//                   className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                     batchUploading || Object.keys(questionImages).length === 0
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : "bg-blue-600 text-white hover:bg-blue-700"
//                   }`}
//                 >
//                   {batchUploading ? (
//                     <>
//                       <svg
//                         className="w-4 h-4 animate-spin"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Uploading...
//                     </>
//                   ) : (
//                     <>
//                       <SaveIcon className="w-4 h-4" />
//                       Upload All ({Object.keys(questionImages).length})
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {questions.length === 0 ? (
//             <div className="text-center py-8 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-600">
//                 No questions found for this paper.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {questions.map((question) => (
//                 <div
//                   key={question.id}
//                   className={`flex items-center justify-between p-4 bg-white border rounded-lg transition-all ${
//                     skippedQuestions.has(question.id)
//                       ? "border-orange-200 bg-orange-50"
//                       : questionImages[question.id]
//                       ? "border-blue-200 bg-blue-50"
//                       : question.questionImage
//                       ? "border-green-200 bg-green-50"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   {/* Question Info */}
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-3 min-w-0">
//                       {/* Question Number with Hierarchy */}
//                       <div className="flex items-center gap-2">
//                         {question.type === "part" ? (
//                           <div className="flex items-center gap-2 text-gray-600">
//                             <span className="text-sm font-medium w-8">
//                               Q{question.parentQuestion}
//                             </span>
//                             <span className="text-gray-400">→</span>
//                             <span className="font-semibold text-gray-900 text-lg w-10">
//                               {question.questionNumber}
//                             </span>
//                           </div>
//                         ) : (
//                           <span className="font-semibold text-gray-900 text-lg w-10 text-center">
//                             {question.questionNumber}
//                           </span>
//                         )}
//                       </div>

//                       {/* Question Type and Marks */}
//                       <div className="flex flex-col">
//                         <span
//                           className={`text-xs font-medium px-2 py-1 rounded-full ${getQuestionTypeColor(
//                             question.type
//                           )}`}
//                         >
//                           {getQuestionTypeLabel(question)}
//                         </span>
//                         <span className="text-xs text-gray-500 mt-1">
//                           {question.maxMark} marks
//                         </span>
//                       </div>
//                     </div>

//                     {/* Status Indicators */}
//                     <div className="flex items-center gap-3">
//                       {/* Upload Progress */}
//                       {getProgressIcon(question.id)}

//                       {/* Image Status */}
//                       <div className="flex items-center gap-2">
//                         {skippedQuestions.has(question.id) ? (
//                           <div className="flex items-center gap-2">
//                             <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                             <span className="text-sm text-orange-700 font-medium">
//                               Skipped
//                             </span>
//                           </div>
//                         ) : questionImages[question.id] ? (
//                           <div className="flex items-center gap-2">
//                             <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                             <span className="text-sm text-blue-700 font-medium">
//                               Selected
//                             </span>
//                           </div>
//                         ) : question.questionImage ? (
//                           <div className="flex items-center gap-2">
//                             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                             <span className="text-sm text-green-700 font-medium">
//                               Uploaded
//                             </span>
//                           </div>
//                         ) : (
//                           <div className="flex items-center gap-2">
//                             <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
//                             <span className="text-sm text-gray-500">
//                               No image
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center gap-2">
//                     {/* Skip Checkbox */}
//                     <button
//                       onClick={() => handleSkipToggle(question.id)}
//                       className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
//                       title={
//                         skippedQuestions.has(question.id)
//                           ? "Unmark as skipped"
//                           : "Skip this question"
//                       }
//                       disabled={batchUploading}
//                     >
//                       {skippedQuestions.has(question.id) ? (
//                         <CheckBoxIcon className="h-4 w-4" />
//                       ) : (
//                         <CheckBoxOutlineBlankIcon className="h-4 w-4" />
//                       )}
//                     </button>

//                     {/* Preview Button */}
//                     {(question.questionImage ||
//                       questionImages[question.id]) && (
//                       <button
//                         onClick={() => {
//                           if (questionImages[question.id]) {
//                             // Preview selected file
//                             const fileUrl = URL.createObjectURL(
//                               questionImages[question.id]
//                             );
//                             setPreviewImage({
//                               url: fileUrl,
//                               number: question.questionNumber,
//                             });
//                           } else {
//                             // Preview existing image from database
//                             const imageUrl = getImageUrl(
//                               question.questionImage
//                             );
//                             setPreviewImage({
//                               url: imageUrl,
//                               number: question.questionNumber,
//                             });
//                           }
//                         }}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
//                         title="Preview image"
//                       >
//                         <VisibilityIcon className="h-4 w-4" />
//                       </button>
//                     )}

//                     {/* Upload/Select Button */}
//                     {!skippedQuestions.has(question.id) && (
//                       <button
//                         onClick={() =>
//                           fileInputRefs.current[question.id]?.click()
//                         }
//                         disabled={batchUploading}
//                         className={`p-2 rounded-md transition-colors ${
//                           questionImages[question.id]
//                             ? "text-blue-600 hover:bg-blue-50"
//                             : question.questionImage
//                             ? "text-orange-600 hover:bg-orange-50"
//                             : "text-green-600 hover:bg-green-50"
//                         }`}
//                         title={
//                           questionImages[question.id]
//                             ? "Change selected image"
//                             : question.questionImage
//                             ? "Replace existing image"
//                             : "Select image"
//                         }
//                       >
//                         <CloudUploadIcon className="h-4 w-4" />
//                       </button>
//                     )}

//                     {/* Remove Button */}
//                     {questionImages[question.id] && (
//                       <button
//                         onClick={() => handleRemoveFile(question.id)}
//                         disabled={batchUploading}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
//                         title="Remove selected image"
//                       >
//                         <DeleteIcon className="h-4 w-4" />
//                       </button>
//                     )}

//                     {/* Hidden File Input */}
//                     <input
//                       ref={(el) => (fileInputRefs.current[question.id] = el)}
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (file) {
//                           handleFileSelect(question.id, file);
//                         }
//                       }}
//                       className="hidden"
//                       disabled={
//                         skippedQuestions.has(question.id) || batchUploading
//                       }
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Image Preview Modal */}
//       {previewImage && (
//         <ImagePreviewModal
//           imageUrl={previewImage.url}
//           questionNumber={previewImage.number}
//           onClose={() => setPreviewImage(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default QuestionImageManager;


//?V4- Batch Upload - and stream images (clean code, removed unused code)

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import api from "../../../../api/axios";
import FilterListIcon from "@mui/icons-material/FilterList";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import SaveIcon from "@mui/icons-material/Save";

const QuestionImageManager = () => {
  // Core state
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questions, setQuestions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // Batch upload state
  const [questionImages, setQuestionImages] = useState({});
  const [skippedQuestions, setSkippedQuestions] = useState(new Set());
  const [batchUploading, setBatchUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const fileInputRefs = useRef({});

  // API calls
  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/exams/");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    }
  };

  const fetchPapers = async () => {
    try {
      const response = await api.get("/api/admin/papers?fragmented=true");
      setPapers(response.data);
    } catch (error) {
      console.error("Error fetching papers:", error);
      toast.error("Failed to load papers");
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchCourses(), fetchPapers()]);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  // Filter papers by course
  const filteredPapers = selectedCourse
    ? papers.filter(paper => paper.courseId === selectedCourse)
    : papers;

  // Handle course filter
  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    resetSelection();
  };

  // Reset all selections
  const resetSelection = () => {
    setSelectedPaper(null);
    setQuestions([]);
    setQuestionImages({});
    setSkippedQuestions(new Set());
    setUploadProgress({});
  };

  // Load paper and questions
  const handleSelectPaper = async (paperId) => {
    try {
      setLoading(true);
      resetSelection();

      const [paperResponse, imagesResponse] = await Promise.all([
        api.get(`/api/admin/papers/${paperId}`),
        api.get(`/api/question-images/paper/${paperId}`)
      ]);

      const paper = paperResponse.data;
      const existingImages = imagesResponse.data.success ? imagesResponse.data.images : {};

      setSelectedPaper(paper);
      setQuestions(generateQuestionsList(paper.questions || [], existingImages));
    } catch (error) {
      console.error("Error loading paper:", error);
      toast.error("Failed to load paper details");
    } finally {
      setLoading(false);
    }
  };

  // Generate questions list from paper data
  const generateQuestionsList = (paperQuestions, existingImages) => {
    const allQuestions = [];

    paperQuestions.forEach((q) => {
      if (!q.hasParts) {
        // Simple question
        allQuestions.push({
          id: `simple-${q.qNo}`,
          questionNumber: q.qNo,
          maxMark: q.maxMark,
          questionImage: existingImages[q.qNo]?.main || null,
          type: "simple",
          isChoiceBased: q.isChoiceBased,
          choiceAttemptCount: q.choiceAttemptCount,
          originalQuestion: q,
        });
      } else {
        // Question with parts
        const partsCount = q.partsCount || 0;
        for (let i = 0; i < partsCount; i++) {
          const partLetter = String.fromCharCode(97 + i);
          const partNumber = `${q.qNo}${partLetter}`;

          allQuestions.push({
            id: `part-${q.qNo}-${partLetter}`,
            questionNumber: partNumber,
            maxMark: q.partMarks || q.maxMark / partsCount,
            questionImage: existingImages[q.qNo]?.parts?.[partLetter] || null,
            type: "part",
            isChoiceBased: q.isChoiceBased,
            choiceAttemptCount: q.choiceAttemptCount,
            parentQuestion: q.qNo,
            originalQuestion: q,
            partLetter: partLetter,
          });
        }
      }
    });

    // Sort questions naturally
    return allQuestions.sort((a, b) => {
      const aMatch = a.questionNumber.match(/^(\d+)([a-z]*)$/);
      const bMatch = b.questionNumber.match(/^(\d+)([a-z]*)$/);

      if (!aMatch || !bMatch) return 0;

      const aNum = parseInt(aMatch[1]);
      const bNum = parseInt(bMatch[1]);

      if (aNum !== bNum) return aNum - bNum;
      
      const aSuffix = aMatch[2] || "";
      const bSuffix = bMatch[2] || "";
      return aSuffix.localeCompare(bSuffix);
    });
  };

  // File selection
  const handleFileSelect = (questionId, file) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setQuestionImages(prev => ({ ...prev, [questionId]: file }));
    setSkippedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
  };

  // Toggle skip status
  const handleSkipToggle = (questionId) => {
    setSkippedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
        setQuestionImages(prevImages => {
          const newImages = { ...prevImages };
          delete newImages[questionId];
          return newImages;
        });
      }
      return newSet;
    });
  };

  // Remove selected file
  const handleRemoveFile = (questionId) => {
    setQuestionImages(prev => {
      const newImages = { ...prev };
      delete newImages[questionId];
      return newImages;
    });

    if (fileInputRefs.current[questionId]) {
      fileInputRefs.current[questionId].value = "";
    }
  };

  // Batch upload
  const handleBatchUpload = async () => {
    const imagesToUpload = Object.keys(questionImages);

    if (imagesToUpload.length === 0) {
      toast.error("No images selected for upload");
      return;
    }

    try {
      setBatchUploading(true);
      setUploadProgress({});

      const formData = new FormData();
      formData.append("paperId", selectedPaper.paperId);

      const questionDataArray = imagesToUpload.map((questionId) => {
        const file = questionImages[questionId];
        const question = questions.find(q => q.id === questionId);

        formData.append("questionImages", file);
        setUploadProgress(prev => ({ ...prev, [questionId]: "uploading" }));

        return {
          questionId,
          questionNumber: question.questionNumber,
          type: question.type,
          parentQuestion: question.parentQuestion || null,
          partLetter: question.partLetter || null,
        };
      });

      formData.append("questionData", JSON.stringify(questionDataArray));

      const response = await api.post("/api/question-images/batch-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const { results, summary } = response.data;

        // Update progress and questions
        results.forEach((result) => {
          const status = result.success ? "success" : "error";
          setUploadProgress(prev => ({ ...prev, [result.questionId]: status }));

          if (result.success) {
            setQuestions(prev =>
              prev.map(q =>
                q.id === result.questionId
                  ? { ...q, questionImage: result.imageUrl }
                  : q
              )
            );
          }
        });

        // Show results
        if (summary.successful > 0) {
          toast.success(`Successfully uploaded ${summary.successful} image(s)`);
        }

        if (summary.failed > 0) {
          toast.error(`${summary.failed} uploads failed`);
        }

        // Clear successful uploads
        setQuestionImages(prev => {
          const newImages = { ...prev };
          results.forEach(result => {
            if (result.success) {
              delete newImages[result.questionId];
              if (fileInputRefs.current[result.questionId]) {
                fileInputRefs.current[result.questionId].value = "";
              }
            }
          });
          return newImages;
        });
      }
    } catch (error) {
      console.error("Batch upload error:", error);
      toast.error("Failed to upload images");
      
      // Mark all as error
      Object.keys(questionImages).forEach(questionId => {
        setUploadProgress(prev => ({ ...prev, [questionId]: "error" }));
      });
    } finally {
      setBatchUploading(false);
    }
  };

  // Utility functions
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/api/question-images/stream')) {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      return `${backendUrl}${imagePath}`;
    }
    return imagePath;
  };

  const getUploadStats = () => {
    const total = questions.length;
    const uploaded = questions.filter(q => q.questionImage).length;
    const selected = Object.keys(questionImages).length;
    const skipped = skippedQuestions.size;

    return { total, uploaded, selected, skipped };
  };

  const getProgressIcon = (questionId) => {
    const progress = uploadProgress[questionId];
    const iconClass = "w-4 h-4";

    switch (progress) {
      case "uploading":
        return <div className={`${iconClass} animate-spin border-2 border-blue-500 border-t-transparent rounded-full`} />;
      case "success":
        return <div className={`${iconClass} text-green-500`}>✓</div>;
      case "error":
        return <div className={`${iconClass} text-red-500`}>✗</div>;
      default:
        return null;
    }
  };

  const getQuestionStatus = (question) => {
    if (skippedQuestions.has(question.id)) {
      return { color: "orange", text: "Skipped" };
    }
    if (questionImages[question.id]) {
      return { color: "blue", text: "Selected" };
    }
    if (question.questionImage) {
      return { color: "green", text: "Uploaded" };
    }
    return { color: "gray", text: "No image" };
  };

  // Image Preview Modal
  const ImagePreviewModal = ({ imageUrl, questionNumber, onClose }) => {
    if (!imageUrl) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-lg max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Question {questionNumber}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <img
              src={imageUrl}
              alt={`Question ${questionNumber}`}
              className="max-w-full h-auto mx-auto"
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=";
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const stats = getUploadStats();

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Question Images Manager
        </h2>
        <p className="text-sm text-gray-600">
          Select images for multiple questions and upload them all at once.
        </p>
      </div>

      {/* Course Filter and Papers */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FilterListIcon className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-800">
              Available Papers ({filteredPapers.length})
            </h3>
          </div>

          <select
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="text-sm border-gray-300 rounded-md px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Papers Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-gray-600">Loading papers...</p>
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-600 font-medium">No papers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPapers.map((paper) => (
              <div
                key={paper.paperId}
                onClick={() => handleSelectPaper(paper.paperId)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedPaper?.paperId === paper.paperId
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <h4 className="font-semibold text-gray-900 mb-2">{paper.paperCode}</h4>
                <p className="text-sm text-gray-600 mb-1">{paper.subject}</p>
                <p className="text-xs text-gray-500">{paper.courseName || "Unknown Course"}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {paper.maxMarks} marks
                  </span>
                  {selectedPaper?.paperId === paper.paperId && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Questions Section */}
      {selectedPaper && (
        <div className="border-t pt-6">
          {/* Batch Upload Controls */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-blue-800">
                  Managing Images: {selectedPaper.paperCode}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  {stats.total} questions • {stats.uploaded} uploaded • {stats.selected} selected • {stats.skipped} skipped
                </p>
              </div>
              <button
                onClick={handleBatchUpload}
                disabled={batchUploading || stats.selected === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  batchUploading || stats.selected === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {batchUploading ? (
                  <>
                    <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-4 h-4" />
                    Upload All ({stats.selected})
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Questions List */}
          {questions.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">No questions found for this paper.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question) => {
                const status = getQuestionStatus(question);
                
                return (
                  <div
                    key={question.id}
                    className={`flex items-center justify-between p-4 bg-white border rounded-lg transition-all border-${status.color}-200 bg-${status.color}-50`}
                  >
                    {/* Question Info */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {/* Question Number */}
                        <span className="font-semibold text-gray-900 text-lg w-12 text-center">
                          {question.questionNumber}
                        </span>

                        {/* Question Type */}
                        <div className="flex flex-col">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                            {question.type === "simple" ? "Simple" : "Part"} Question
                          </span>
                          <span className="text-xs text-gray-500 mt-1">{question.maxMark} marks</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        {getProgressIcon(question.id)}
                        <div className={`w-3 h-3 bg-${status.color}-500 rounded-full`}></div>
                        <span className={`text-sm text-${status.color}-700 font-medium`}>
                          {status.text}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Skip Toggle */}
                      <button
                        onClick={() => handleSkipToggle(question.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                        disabled={batchUploading}
                        title={skippedQuestions.has(question.id) ? "Unmark as skipped" : "Skip this question"}
                      >
                        {skippedQuestions.has(question.id) ? 
                          <CheckBoxIcon className="h-4 w-4" /> : 
                          <CheckBoxOutlineBlankIcon className="h-4 w-4" />
                        }
                      </button>

                      {/* Preview Button */}
                      {(question.questionImage || questionImages[question.id]) && (
                        <button
                          onClick={() => {
                            const imageUrl = questionImages[question.id] 
                              ? URL.createObjectURL(questionImages[question.id])
                              : getImageUrl(question.questionImage);
                            setPreviewImage({ url: imageUrl, number: question.questionNumber });
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Preview image"
                        >
                          <VisibilityIcon className="h-4 w-4" />
                        </button>
                      )}

                      {/* Upload Button */}
                      {!skippedQuestions.has(question.id) && (
                        <button
                          onClick={() => fileInputRefs.current[question.id]?.click()}
                          disabled={batchUploading}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          title="Select image"
                        >
                          <CloudUploadIcon className="h-4 w-4" />
                        </button>
                      )}

                      {/* Remove Button */}
                      {questionImages[question.id] && (
                        <button
                          onClick={() => handleRemoveFile(question.id)}
                          disabled={batchUploading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Remove selected image"
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </button>
                      )}

                      {/* Hidden File Input */}
                      <input
                        ref={(el) => (fileInputRefs.current[question.id] = el)}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleFileSelect(question.id, file);
                        }}
                        className="hidden"
                        disabled={skippedQuestions.has(question.id) || batchUploading}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage.url}
          questionNumber={previewImage.number}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
};

export default QuestionImageManager;
