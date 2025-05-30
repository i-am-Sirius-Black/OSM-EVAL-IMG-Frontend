// import React, { useState, useEffect } from 'react';
// import API_ROUTES from '../../../../api/routes.js';
// import api from '../../../../api/axios.js';

// const AssignSubjects = () => {
//   // State management
//   const [evaluators, setEvaluators] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedEvaluator, setSelectedEvaluator] = useState(null);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [viewMode, setViewMode] = useState('select'); // 'select' or 'review'
//   const [assignedSubjects, setAssignedSubjects] = useState([]);
  
//   // Loading states
//   const [loading, setLoading] = useState({
//     initial: true,
//     subjects: false,
//     submit: false,
//     assignedSubjects: false
//   });
  
//   // Status messages
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
  
//   // Fetch initial data
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         // Get evaluators
//         const evaluatorsResponse = await api.get(API_ROUTES.ADMIN.GET_EVALUATORS);
//         setEvaluators(evaluatorsResponse.data.map(evaluator => ({
//           id: evaluator.uid,
//           name: evaluator.name,
//           email: evaluator.email,
//           subjectCount: 0 // Track assigned subjects
//         })));
        
//         // Get courses
//         const coursesResponse = await api.get('/api/exams');
//         setCourses(coursesResponse.data);
        
//       } catch (err) {
//         console.error('Error loading initial data:', err);
//         setError('Failed to load data. Please refresh to try again.');
//       } finally {
//         setLoading(prev => ({ ...prev, initial: false }));
//       }
//     };

//     fetchInitialData();
//   }, []);

  
//   // Fetch subjects when course changes
//   useEffect(() => {
//     if (!selectedCourse) {
//       setSubjects([]);
//       return;
//     }
    
//     const fetchSubjects = async () => {
//       try {
//         setLoading(prev => ({ ...prev, subjects: true }));
//         const response = await api.get(`/api/exams/${selectedCourse}/subjects`);
//         setSubjects(response.data);
//       } catch (err) {
//         console.error('Error fetching subjects:', err);
//         setError(`Failed to load subjects for the selected course`);
//         setSubjects([]);
//       } finally {
//         setLoading(prev => ({ ...prev, subjects: false }));
//       }
//     };
    
//     fetchSubjects();
//   }, [selectedCourse]);

  
  
//   // Fetch already assigned subjects for an evaluator when selected
//   useEffect(() => {
//     if (!selectedEvaluator) {
//       setAssignedSubjects([]);
//       return;
//     }
    
//     const fetchAssignedSubjects = async () => {
//       try {
//         setLoading(prev => ({ ...prev, assignedSubjects: true }));
//         // Assuming there's an API endpoint to get assigned subjects for an evaluator
//         const response = await api.get(`/api/evaluator/assigned-subjects/${selectedEvaluator.id}`);
//         console.log(`Fetched assigned subjects: for ${selectedEvaluator.name}`, response.data.subjects);

//         setAssignedSubjects(response.data.subjects || []);
//       } catch (err) {
//         console.error('Error fetching assigned subjects:', err);
//         // Don't show error to user, just set empty array
//         setAssignedSubjects([]);
//       } finally {
//         setLoading(prev => ({ ...prev, assignedSubjects: false }));
//       }
//     };
    
//     fetchAssignedSubjects();
//   }, [selectedEvaluator]);
   
//   // Handle subject selection from dropdown
//   const handleSubjectSelect = (e) => {
//     setSelectedSubject(e.target.value);
//   };
  
//   // Validate and proceed to review
//   const handleProceedToReview = () => {
//     if (!selectedEvaluator) {
//       setError('Please select an evaluator');
//       return;
//     }
    
//     if (!selectedSubject) {
//       setError('Please select a subject');
//       return;
//     }
    
//     // Check if subject is already assigned to this evaluator
//     const isAlreadyAssigned = assignedSubjects.some(
//       subject => subject.subjectCode === selectedSubject
//     );
    
//     if (isAlreadyAssigned) {
//       setError('This subject is already assigned to the selected evaluator');
//       return;
//     }
    
//     setError(null);
//     setViewMode('review');
//   };
  
// // Submit assignment
// const handleSubmitAssignment = async () => {
//   try {
//     setLoading(prev => ({ ...prev, submit: true }));
    
//     // Prepare data for API
//     const assignmentData = {
//       evaluatorId: selectedEvaluator.id,
//       subjectCode: selectedSubject,
//       examName: selectedCourse,
//     };
    
//     // Call API to assign subject
//     await api.post('/api/admin/assign-subject', assignmentData);
    
//     // Update assigned subjects list
//     const subjectDetails = subjects.find(s => s.subjectId === selectedSubject);
//     if (subjectDetails) {
//       setAssignedSubjects(prev => [...prev, {
//         subjectCode: selectedSubject,
//         subjectName: subjectDetails.subject
//       }]);
//     }
    
//     // Update UI with success message (FIXED)
//     setSuccess(`Successfully assigned ${subjectDetails?.subject || selectedSubject} to ${selectedEvaluator.name}`);
    
//     // Reset all selection states
//     setSelectedSubject('');
//     setSelectedCourse('');
//     setSubjects([]); // Clear subjects since no course is selected
//     setViewMode('select');
    
//     // Optionally, keep the same evaluator selected to allow multiple assignments to the same person
//     // If you prefer to reset everything, uncomment the next line:
//     // setSelectedEvaluator(null);
    
//     // Auto clear success after delay
//     setTimeout(() => setSuccess(null), 5000);
//   } catch (err) {
//     console.error('Error assigning subject:', err);
//     setError('Failed to assign subject. Please try again.');
//   } finally {
//     setLoading(prev => ({ ...prev, submit: false }));
//   }
// };

//   // Render loading indicator
//   if (loading.initial) {
//     return (
//       <div className="bg-white shadow rounded-md p-4 flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//         <span className="ml-2 text-gray-600">Loading...</span>
//       </div>
//     );
//   }

//   // Main component render
//   return (
//     <div className="bg-white shadow rounded-md">
//       <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//         <h2 className="text-lg font-medium text-gray-800">Assign Subjects</h2>
//         {viewMode === 'review' && (
//           <button 
//             onClick={() => setViewMode('select')}
//             className="text-sm text-blue-600 hover:text-blue-800"
//           >
//             Back to Selection
//           </button>
//         )}
//       </div>
      
//       {/* Error message */}
//       {error && (
//         <div className="mx-4 my-2 p-2 bg-red-50 border-l-4 border-red-500 text-sm text-red-700 flex items-start">
//           <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//           </svg>
//           <div className="flex-1">{error}</div>
//           <button 
//             onClick={() => setError(null)}
//             className="text-red-500 hover:text-red-700"
//           >
//             <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </button>
//         </div>
//       )}
      
//       {/* Success message */}
//       {success && (
//         <div className="mx-4 my-2 p-2 bg-green-50 border-l-4 border-green-500 text-sm text-green-700 flex items-start">
//           <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <div className="flex-1">{success}</div>
//           <button 
//             onClick={() => setSuccess(null)}
//             className="text-green-500 hover:text-green-700"
//           >
//             <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </button>
//         </div>
//       )}
      
//       <div className="p-4">
//         {viewMode === 'select' ? (
//           <div className="space-y-4">
//             {/* Selection Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Column 1: Evaluator Selection */}
//               <div>
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Evaluator</label>
//                   <div className="relative">
//                     <select
//                       value={selectedEvaluator ? selectedEvaluator.id : ""}
//                       onChange={(e) => {
//                         const id = e.target.value;
//                         if (!id) {
//                           setSelectedEvaluator(null);
//                           return;
//                         }
//                         const evaluator = evaluators.find(ev => ev.id === id);
//                         setSelectedEvaluator(evaluator);
//                       }}
//                       className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     >
//                       <option value="">Select Evaluator</option>
//                       {evaluators.map(evaluator => (
//                         <option key={evaluator.id} value={evaluator.id}>
//                           {evaluator.name} ({evaluator.email})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Currently assigned subjects */}
//                 {selectedEvaluator && (
//                   <div className="mt-4">
//                     <h3 className="text-sm font-medium text-gray-700 mb-2">Currently Assigned Subjects</h3>
//                     {loading.assignedSubjects ? (
//                       <div className="flex items-center justify-center h-24 bg-gray-50 rounded-md">
//                         <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
//                         <span className="ml-2 text-sm text-gray-500">Loading assignments...</span>
//                       </div>
//                     ) : assignedSubjects.length > 0 ? (
//                       <div className="bg-gray-50 rounded-md p-3 max-h-48 overflow-y-auto">
//                         <ul className="space-y-1">
//                           {assignedSubjects.map((subject, index) => (
//                             <li key={index} className="text-sm flex items-center">
//                               <span className="h-1.5 w-1.5 bg-blue-500 rounded-full mr-2"></span>
//                               <span>{subject.subjectName} ({subject.subjectCode})</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ) : (
//                       <div className="text-sm text-gray-500 italic">No subjects assigned yet</div>
//                     )}
//                   </div>
//                 )}
//               </div>
              
//               {/* Column 2: Course and Subject Selection */}
//               <div>
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Course/Exam</label>
//                   <select
//                     value={selectedCourse}
//                     onChange={(e) => {
//                       setSelectedCourse(e.target.value);
//                       setSelectedSubject('');
//                     }}
//                     className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
//                   >
//                     <option value="">Select Course</option>
//                     {courses.map(course => (
//                       <option key={course.courseId} value={course.courseId}>
//                         {course.courseName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
//                   <div className="relative">
//                     <select
//                       value={selectedSubject}
//                       onChange={handleSubjectSelect}
//                       disabled={!selectedCourse || loading.subjects}
//                       className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
//                     >
//                       <option value="">Select Subject</option>
//                       {subjects.map(subject => (
//                         <option key={subject.subjectId} value={subject.subjectId}>
//                           {subject.subject} ({subject.subjectId})
//                         </option>
//                       ))}
//                     </select>
//                     {loading.subjects && (
//                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                         <div className="animate-spin h-4 w-4 border-2 border-b-0 border-gray-500 rounded-full"></div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-4 flex justify-end">
//                   <button
//                     onClick={handleProceedToReview}
//                     disabled={!selectedEvaluator || !selectedSubject}
//                     className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
//                   >
//                     Review Assignment
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {/* Review Section */}
//             <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-700">
//               <p>Please review the subject assignment before confirming.</p>
//             </div>
            
//             <div className="border border-gray-200 rounded-md overflow-hidden">
//               <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
//                 <h3 className="text-sm font-medium text-gray-700">Assignment Details</h3>
//               </div>
//               <div className="p-4">
//                 <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
//                   <dt className="text-gray-500">Evaluator:</dt>
//                   <dd className="text-gray-900 font-medium">{selectedEvaluator?.name}</dd>
                  
//                   <dt className="text-gray-500">Evaluator Email:</dt>
//                   <dd className="text-gray-900">{selectedEvaluator?.email}</dd>
                  
//                   <dt className="text-gray-500">Course/Exam:</dt>
//                   <dd className="text-gray-900">
//                     {courses.find(c => c.courseId === selectedCourse)?.courseName}
//                   </dd>
                  
//                   <dt className="text-gray-500">Subject:</dt>
//                   <dd className="text-gray-900">
//                     {subjects.find(s => s.subjectId === selectedSubject)?.subject} ({selectedSubject})
//                   </dd>
//                 </dl>
//               </div>
//             </div>
            
//             <div className="mt-4 flex justify-end space-x-3">
//               <button
//                 onClick={() => setViewMode('select')}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={handleSubmitAssignment}
//                 disabled={loading.submit}
//                 className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
//               >
//                 {loading.submit ? (
//                   <span className="flex items-center">
//                     <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                     Processing...
//                   </span>
//                 ) : 'Confirm Assignment'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssignSubjects;




//? Proper Error Handling to show if subject has any copies before assigning

import React, { useState, useEffect } from 'react';
import API_ROUTES from '../../../../api/routes.js';
import api from '../../../../api/axios.js';

const AssignSubjects = () => {
  // State management
  const [evaluators, setEvaluators] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [viewMode, setViewMode] = useState('select'); // 'select' or 'review'
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [subjectAllocation, setSubjectAllocation] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState({
    initial: true,
    subjects: false,
    submit: false,
    assignedSubjects: false,
    allocation: false
  });
  
  // Status messages
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Get evaluators
        const evaluatorsResponse = await api.get(API_ROUTES.ADMIN.GET_EVALUATORS);
        setEvaluators(evaluatorsResponse.data.map(evaluator => ({
          id: evaluator.uid,
          name: evaluator.name,
          email: evaluator.email,
          subjectCount: 0 // Track assigned subjects
        })));
        
        // Get courses
        const coursesResponse = await api.get('/api/exams');
        setCourses(coursesResponse.data);
        
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load data. Please refresh to try again.');
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    fetchInitialData();
  }, []);

  
  // Fetch subjects when course changes
  useEffect(() => {
    if (!selectedCourse) {
      setSubjects([]);
      return;
    }
    
    const fetchSubjects = async () => {
      try {
        setLoading(prev => ({ ...prev, subjects: true }));
        const response = await api.get(`/api/exams/${selectedCourse}/subjects`);
        setSubjects(response.data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError(`Failed to load subjects for the selected course`);
        setSubjects([]);
      } finally {
        setLoading(prev => ({ ...prev, subjects: false }));
      }
    };
    
    fetchSubjects();
  }, [selectedCourse]);

  
  
  // Fetch already assigned subjects for an evaluator when selected
  useEffect(() => {
    if (!selectedEvaluator) {
      setAssignedSubjects([]);
      return;
    }
    
    const fetchAssignedSubjects = async () => {
      try {
        setLoading(prev => ({ ...prev, assignedSubjects: true }));
        // Assuming there's an API endpoint to get assigned subjects for an evaluator
        const response = await api.get(`/api/evaluator/assigned-subjects/${selectedEvaluator.id}`);
        console.log(`Fetched assigned subjects: for ${selectedEvaluator.name}`, response.data.subjects);

        setAssignedSubjects(response.data.subjects || []);
      } catch (err) {
        console.error('Error fetching assigned subjects:', err);
        // Don't show error to user, just set empty array
        setAssignedSubjects([]);
      } finally {
        setLoading(prev => ({ ...prev, assignedSubjects: false }));
      }
    };
    
    fetchAssignedSubjects();
  }, [selectedEvaluator]);
   
  // Fetch subject allocation status when subject changes
  useEffect(() => {
    if (!selectedSubject || !selectedCourse) {
      setSubjectAllocation(null);
      return;
    }
    
    const fetchSubjectAllocation = async () => {
      try {
        setLoading(prev => ({ ...prev, allocation: true }));
        const response = await api.get(`/api/admin/subject-allocation/${selectedSubject}/${selectedCourse}`);
        setSubjectAllocation(response.data.data);
      } catch (err) {
        console.error('Error fetching subject allocation:', err);
        setSubjectAllocation(null);
      } finally {
        setLoading(prev => ({ ...prev, allocation: false }));
      }
    };
    
    fetchSubjectAllocation();
  }, [selectedSubject, selectedCourse]);
  
  // Handle subject selection from dropdown
  const handleSubjectSelect = (e) => {
    setSelectedSubject(e.target.value);
  };
  
  // Validate and proceed to review
  const handleProceedToReview = () => {
    if (!selectedEvaluator) {
      setError('Please select an evaluator');
      return;
    }
    
    if (!selectedSubject) {
      setError('Please select a subject');
      return;
    }
    
    // Check if subject is already assigned to this evaluator
    const isAlreadyAssigned = assignedSubjects.some(
      subject => subject.subjectCode === selectedSubject
    );
    
    if (isAlreadyAssigned) {
      setError('This subject is already assigned to the selected evaluator');
      return;
    }
    
    // Check if there are available copies
    if (subjectAllocation && subjectAllocation.availableCopies <= 0) {
      setError('There are no available copies for this subject. Cannot assign to evaluator.');
      return;
    }
    
    setError(null);
    setViewMode('review');
  };
  
// Submit assignment
const handleSubmitAssignment = async () => {
  try {
    setLoading(prev => ({ ...prev, submit: true }));
    
    // Prepare data for API
    const assignmentData = {
      evaluatorId: selectedEvaluator.id,
      subjectCode: selectedSubject,
      examName: selectedCourse,
    };
    
    // Call API to assign subject
    await api.post('/api/admin/assign-subject', assignmentData);
    
    // Update assigned subjects list
    const subjectDetails = subjects.find(s => s.subjectId === selectedSubject);
    if (subjectDetails) {
      setAssignedSubjects(prev => [...prev, {
        subjectCode: selectedSubject,
        subjectName: subjectDetails.subject
      }]);
    }
    
    // Update UI with success message
    setSuccess(`Successfully assigned ${subjectDetails?.subject || selectedSubject} to ${selectedEvaluator.name}`);
    
    // Reset all selection states
    setSelectedSubject('');
    setSelectedCourse('');
    setSubjects([]); // Clear subjects since no course is selected
    setViewMode('select');
    setSubjectAllocation(null);
    
    // Optionally, keep the same evaluator selected to allow multiple assignments to the same person
    // If you prefer to reset everything, uncomment the next line:
    // setSelectedEvaluator(null);
    
    // Auto clear success after delay
    setTimeout(() => setSuccess(null), 5000);
  } catch (err) {
    console.error('Error assigning subject:', err);
    if (err.response && err.response.data && err.response.data.message) {
      setError(err.response.data.message);
    } else {
      setError('Failed to assign subject. Please try again.');
    }
  } finally {
    setLoading(prev => ({ ...prev, submit: false }));
  }
};

  // Render loading indicator
  if (loading.initial) {
    return (
      <div className="bg-white shadow rounded-md p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Main component render
  return (
    <div className="bg-white shadow rounded-md">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Assign Subjects</h2>
        {viewMode === 'review' && (
          <button 
            onClick={() => setViewMode('select')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Back to Selection
          </button>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mx-4 my-2 p-2 bg-red-50 border-l-4 border-red-500 text-sm text-red-700 flex items-start">
          <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">{error}</div>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="mx-4 my-2 p-2 bg-green-50 border-l-4 border-green-500 text-sm text-green-700 flex items-start">
          <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">{success}</div>
          <button 
            onClick={() => setSuccess(null)}
            className="text-green-500 hover:text-green-700"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="p-4">
        {viewMode === 'select' ? (
          <div className="space-y-4">
            {/* Selection Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column 1: Evaluator Selection */}
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evaluator</label>
                  <div className="relative">
                    <select
                      value={selectedEvaluator ? selectedEvaluator.id : ""}
                      onChange={(e) => {
                        const id = e.target.value;
                        if (!id) {
                          setSelectedEvaluator(null);
                          return;
                        }
                        const evaluator = evaluators.find(ev => ev.id === id);
                        setSelectedEvaluator(evaluator);
                      }}
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select Evaluator</option>
                      {evaluators.map(evaluator => (
                        <option key={evaluator.id} value={evaluator.id}>
                          {evaluator.name} ({evaluator.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Currently assigned subjects */}
                {selectedEvaluator && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Currently Assigned Subjects</h3>
                    {loading.assignedSubjects ? (
                      <div className="flex items-center justify-center h-24 bg-gray-50 rounded-md">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        <span className="ml-2 text-sm text-gray-500">Loading assignments...</span>
                      </div>
                    ) : assignedSubjects.length > 0 ? (
                      <div className="bg-gray-50 rounded-md p-3 max-h-48 overflow-y-auto">
                        <ul className="space-y-1">
                          {assignedSubjects.map((subject, index) => (
                            <li key={index} className="text-sm flex items-center">
                              <span className="h-1.5 w-1.5 bg-blue-500 rounded-full mr-2"></span>
                              <span>{subject.subjectName} ({subject.subjectCode})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">No subjects assigned yet</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Column 2: Course and Subject Selection */}
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course/Exam</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => {
                      setSelectedCourse(e.target.value);
                      setSelectedSubject('');
                      setSubjectAllocation(null);
                    }}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.courseId} value={course.courseId}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <div className="relative">
                    <select
                      value={selectedSubject}
                      onChange={handleSubjectSelect}
                      disabled={!selectedCourse || loading.subjects}
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject.subjectId} value={subject.subjectId}>
                          {subject.subject} ({subject.subjectId})
                        </option>
                      ))}
                    </select>
                    {loading.subjects && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="animate-spin h-4 w-4 border-2 border-b-0 border-gray-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject Allocation Status */}
                {selectedSubject && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Subject Availability</h3>
                    {loading.allocation ? (
                      <div className="flex items-center justify-center h-16 bg-gray-50 rounded-md">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        <span className="ml-2 text-sm text-gray-500">Loading availability...</span>
                      </div>
                    ) : subjectAllocation ? (
                      <div className="bg-gray-50 rounded-md p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-600">Total copies:</span>
                            <span className="ml-2 font-semibold">{subjectAllocation.totalCopies}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600">Available:</span>
                            <span className={`ml-2 font-semibold ${subjectAllocation.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {subjectAllocation.availableCopies}
                            </span>
                          </div>
                          
                        </div>
                        {subjectAllocation.availableCopies <= 0 && (
                          <div className="mt-2 text-xs text-red-600">
                            No copies available for assignment. All copies have been assigned.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">Select a subject to see availability</div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleProceedToReview}
                    disabled={
                      !selectedEvaluator || 
                      !selectedSubject || 
                      (subjectAllocation && subjectAllocation.availableCopies <= 0)
                    }
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Review Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Review Section */}
            <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-700">
              <p>Please review the subject assignment before confirming.</p>
            </div>
            
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Assignment Details</h3>
              </div>
              <div className="p-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-gray-500">Evaluator:</dt>
                  <dd className="text-gray-900 font-medium">{selectedEvaluator?.name}</dd>
                  
                  <dt className="text-gray-500">Evaluator Email:</dt>
                  <dd className="text-gray-900">{selectedEvaluator?.email}</dd>
                  
                  <dt className="text-gray-500">Course/Exam:</dt>
                  <dd className="text-gray-900">
                    {courses.find(c => c.courseId === selectedCourse)?.courseName}
                  </dd>
                  
                  <dt className="text-gray-500">Subject:</dt>
                  <dd className="text-gray-900">
                    {subjects.find(s => s.subjectId === selectedSubject)?.subject} ({selectedSubject})
                  </dd>
                  
                  {subjectAllocation && (
                    <>
                      <dt className="text-gray-500">Available Copies:</dt>
                      <dd className="text-gray-900 font-medium">
                        {subjectAllocation.availableCopies} of {subjectAllocation.totalCopies}
                      </dd>
                    </>
                  )}
                </dl>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setViewMode('select')}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmitAssignment}
                disabled={loading.submit}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading.submit ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignSubjects;