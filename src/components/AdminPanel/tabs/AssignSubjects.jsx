// import React, { useState, useEffect } from 'react';
// import API_ROUTES from '../../../api/routes';
// import api from '../../../api/axios.js';

// const AssignSubjects = () => {
//   const [evaluators, setEvaluators] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedEvaluator, setSelectedEvaluator] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [assignments, setAssignments] = useState([]);
//   const [error, setError] = useState(null);

//   // Fetch evaluators and subjects
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Get evaluators from API
//         const evaluatorsResponse = await api.get(API_ROUTES.ADMIN.GET_EVALUATORS);
//         const evaluatorsData = evaluatorsResponse.data;
        
//         // Map the response to match component's expected format
//         const formattedEvaluators = evaluatorsData.map(evaluator => ({
//           id: evaluator.uid,
//           name: evaluator.name,
//           email: evaluator.email
//         }));
        
//         // For subjects, using the fallback approach for now
//         let subjectsData;
//         try {
//           const subjectsResponse = await api.get('/api/subjects');
//           subjectsData = subjectsResponse.data;
//         } catch (subjectError) {
//           console.warn('Using mock subject data due to API error:', subjectError);
//           subjectsData = [
//             { id: 1, name: 'Mathematics' },
//             { id: 2, name: 'Physics' },
//             { id: 3, name: 'Chemistry' },
//             { id: 4, name: 'Biology' }
//           ];
//         }
        
//         // Update state with fetched data
//         setEvaluators(formattedEvaluators);
//         setSubjects(subjectsData);
        
//         // Fetch current assignments if API endpoint exists
//         try {
//           const assignmentsResponse = await api.get('/api/assignments');
//           setAssignments(assignmentsResponse.data);
//         } catch (assignmentError) {
//           console.warn('Using mock assignment data due to API error:', assignmentError);
//           setAssignments([
//             { id: 1, evaluatorId: formattedEvaluators[0]?.id, evaluatorName: formattedEvaluators[0]?.name, subjectId: 1, subjectName: 'Mathematics' }
//           ]);
//         }
        
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load evaluators. Please try again later.');
        
//         // Fallback data for demonstration purposes
//         setEvaluators([
//           { id: 1, name: 'John Doe' },
//           { id: 2, name: 'Jane Smith' },
//           { id: 3, name: 'Mike Johnson' }
//         ]);
        
//         setSubjects([
//           { id: 1, name: 'Mathematics' },
//           { id: 2, name: 'Physics' },
//           { id: 3, name: 'Chemistry' },
//           { id: 4, name: 'Biology' }
//         ]);
        
//         setAssignments([
//           { id: 1, evaluatorId: 1, evaluatorName: 'John Doe', subjectId: 1, subjectName: 'Mathematics' },
//           { id: 2, evaluatorId: 2, evaluatorName: 'Jane Smith', subjectId: 2, subjectName: 'Physics' }
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleAssignSubject = async () => {
//     if (!selectedEvaluator || !selectedSubject) {
//       alert('Please select both an evaluator and a subject');
//       return;
//     }

//     // Find the evaluator and subject objects
//     const evaluator = evaluators.find(e => e.id.toString() === selectedEvaluator);
//     const subject = subjects.find(s => s.id.toString() === selectedSubject);

//     if (!evaluator || !subject) {
//       alert('Invalid selection');
//       return;
//     }

//     try {
//       // API call to assign subject to evaluator
//       const response = await api.post('/api/assign-subject', {
//         evaluatorId: selectedEvaluator,
//         subjectId: selectedSubject
//       });
      
//       // Create new assignment object (use response data if available)
//       const newAssignment = response.data || {
//         id: Date.now(), // temporary ID if API doesn't provide one
//         evaluatorId: evaluator.id,
//         evaluatorName: evaluator.name,
//         subjectId: subject.id,
//         subjectName: subject.name
//       };
      
//       setAssignments([...assignments, newAssignment]);
//       alert('Subject assigned successfully!');
      
//       // Reset selections
//       setSelectedEvaluator('');
//       setSelectedSubject('');
//     } catch (err) {
//       console.error('Error assigning subject:', err);
      
//       // For demo purposes, add the assignment anyway
//       const newAssignment = {
//         id: Date.now(),
//         evaluatorId: evaluator.id,
//         evaluatorName: evaluator.name,
//         subjectId: subject.id,
//         subjectName: subject.name
//       };
      
//       setAssignments([...assignments, newAssignment]);
//       alert('Subject assigned successfully! (Demo Mode)');
      
//       // Reset selections
//       setSelectedEvaluator('');
//       setSelectedSubject('');
//     }
//   };

//   const handleRemoveAssignment = async (assignmentId) => {
//     try {
//       // API call to remove assignment
//       await api.delete(`/api/remove-assignment/${assignmentId}`);
      
//       // Remove the assignment from the list
//       setAssignments(assignments.filter(a => a.id !== assignmentId));
//     } catch (err) {
//       console.error('Error removing assignment:', err);
//       // For demo purposes, remove it anyway
//       setAssignments(assignments.filter(a => a.id !== assignmentId));
//     }
//   };

//   return (
//     <div>
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <div className="px-4 py-5 sm:px-6">
//           <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Subjects To Evaluators</h3>
//           {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">Assign subjects to evaluators</p> */}
//         </div>
        
//         {loading ? (
//           <div className="px-4 py-5 sm:p-6 text-center">
//             <div className="spinner"></div>
//             <p className="mt-2 text-sm text-gray-500">Loading data...</p>
//           </div>
//         ) : error ? (
//           <div className="px-4 py-5 sm:p-6 text-center text-red-500">
//             {error}
//           </div>
//         ) : (
//           <div className="px-4 py-5 sm:p-6">
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Select Evaluator</label>
//                 <select
//                   value={selectedEvaluator}
//                   onChange={(e) => setSelectedEvaluator(e.target.value)}
//                   className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                 >
//                   <option value="">Select Evaluator</option>
//                   {evaluators.map((evaluator) => (
//                     <option key={evaluator.id} value={evaluator.id}>
//                       {evaluator.name} {evaluator.email ? `(${evaluator.email})` : ''}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Select Subject</label>
//                 <select
//                   value={selectedSubject}
//                   onChange={(e) => setSelectedSubject(e.target.value)}
//                   className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                 >
//                   <option value="">Select Subject</option>
//                   {subjects.map((subject) => (
//                     <option key={subject.id} value={subject.id}>
//                       {subject.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="mt-5">
//               <button
//                 onClick={handleAssignSubject}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Assign Subject
//               </button>
//             </div>
            
//             <div className="mt-8">
//               <h4 className="text-md font-medium text-gray-900">Current Assignments</h4>
//               <div className="mt-4 flex flex-col">
//                 <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//                   <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
//                     <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Evaluator
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Subject
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {assignments.length === 0 ? (
//                             <tr>
//                               <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
//                                 No assignments found
//                               </td>
//                             </tr>
//                           ) : (
//                             assignments.map((assignment) => (
//                               <tr key={assignment.id}>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <div className="text-sm text-gray-900">{assignment.evaluatorName}</div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <div className="text-sm text-gray-900">{assignment.subjectName}</div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                   <button
//                                     onClick={() => handleRemoveAssignment(assignment.id)}
//                                     className="text-red-600 hover:text-red-900"
//                                   >
//                                     Remove
//                                   </button>
//                                 </td>
//                               </tr>
//                             ))
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssignSubjects;


//? 


// import React, { useState, useEffect } from 'react';
// import API_ROUTES from '../../../api/routes';
// import api from '../../../api/axios.js';

// const AssignSubjects = () => {
//   // State for evaluator selection
//   const [evaluators, setEvaluators] = useState([]);
//   const [selectedEvaluator, setSelectedEvaluator] = useState(null);
//   const [searchEvaluator, setSearchEvaluator] = useState('');
  
//   // State for filters
//   const [courses, setCourses] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [subjects, setSubjects] = useState([]);
  
//   // Selected filters
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedSession, setSelectedSession] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
  
//   // Available copies after filtering
//   const [availableCopies, setAvailableCopies] = useState([]);
  
//   // Copies assigned to the selected evaluator
//   const [assignedCopies, setAssignedCopies] = useState([]);
  
//   // UI state
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Fetch initial data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Get evaluators
//         const evaluatorsResponse = await api.get(API_ROUTES.ADMIN.GET_EVALUATORS);
//         const evaluatorsData = evaluatorsResponse.data;
        
//         const formattedEvaluators = evaluatorsData.map(evaluator => ({
//           id: evaluator.uid,
//           name: evaluator.name,
//           email: evaluator.email
//         }));
        
//         setEvaluators(formattedEvaluators);
        
//         // Fetch other filter data
//         try {
//           // Fetch courses
//           const coursesResponse = await api.get('/api/courses');
//           setCourses(coursesResponse.data);
          
//           // Fetch sessions
//           const sessionsResponse = await api.get('/api/sessions');
//           setSessions(sessionsResponse.data);
          
//           // Fetch semesters
//           const semestersResponse = await api.get('/api/semesters');
//           setSemesters(semestersResponse.data);
          
//           // Fetch subjects
//           const subjectsResponse = await api.get('/api/subjects');
//           setSubjects(subjectsResponse.data);
//         } catch (filterError) {
//           console.warn('Using mock filter data due to API error:', filterError);
//           // Mock data for filters
//           setCourses([
//             { id: 1, name: 'BSc CS' },
//             { id: 2, name: 'BSc IT' },
//             { id: 3, name: 'BCA' }
//           ]);
          
//           setSessions([
//             { id: 1, name: 'May 2024' },
//             { id: 2, name: 'December 2023' }
//           ]);
          
//           setSemesters([
//             { id: 1, name: 'Semester 1' },
//             { id: 2, name: 'Semester 2' },
//             { id: 3, name: 'Semester 3' },
//             { id: 4, name: 'Semester 4' }
//           ]);
          
//           setSubjects([
//             { id: 1, code: 'MATH101', name: 'Mathematics' },
//             { id: 2, code: 'PHY101', name: 'Physics' },
//             { id: 3, code: 'CHEM101', name: 'Chemistry' },
//             { id: 4, code: 'BIO101', name: 'Biology' }
//           ]);
//         }
        
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load data. Please try again later.');
        
//         // Fallback data for demonstration
//         setEvaluators([
//           { id: 1, name: 'John Doe', email: 'john@example.com' },
//           { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
//           { id: 3, name: 'Mike Johnson', email: 'mike@example.com' }
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);
  
//   // Fetch available copies when filters change
//   useEffect(() => {
//     const fetchCopies = async () => {
//       // Only fetch if at least one filter is selected
//       if (!selectedCourse && !selectedSession && !selectedSemester && !selectedSubject) {
//         setAvailableCopies([]);
//         return;
//       }
      
//       try {
//         const params = {
//           courseId: selectedCourse || undefined,
//           sessionId: selectedSession || undefined,
//           semesterId: selectedSemester || undefined,
//           subjectId: selectedSubject || undefined
//         };
        
//         const response = await api.get('/api/copies/available', { params });
//         setAvailableCopies(response.data);
//       } catch (err) {
//         console.error('Error fetching available copies:', err);
        
//         // Mock data for demonstration
//         setAvailableCopies([
//           { id: 1, rollNo: '2023001', studentName: 'Student 1', marks: null },
//           { id: 2, rollNo: '2023002', studentName: 'Student 2', marks: null },
//           { id: 3, rollNo: '2023003', studentName: 'Student 3', marks: null },
//           { id: 4, rollNo: '2023004', studentName: 'Student 4', marks: null },
//           { id: 5, rollNo: '2023005', studentName: 'Student 5', marks: null }
//         ]);
//       }
//     };
    
//     fetchCopies();
//   }, [selectedCourse, selectedSession, selectedSemester, selectedSubject]);
  
//   // Filter evaluators based on search
//   const filteredEvaluators = evaluators.filter(evaluator => 
//     evaluator.name.toLowerCase().includes(searchEvaluator.toLowerCase()) ||
//     (evaluator.email && evaluator.email.toLowerCase().includes(searchEvaluator.toLowerCase()))
//   );
  
//   // Handlers for assigning/unassigning copies
//   const assignCopy = (copy) => {
//     if (!selectedEvaluator) {
//       alert('Please select an evaluator first');
//       return;
//     }
    
//     setAssignedCopies([...assignedCopies, copy]);
//     setAvailableCopies(availableCopies.filter(c => c.id !== copy.id));
//   };
  
//   const unassignCopy = (copy) => {
//     setAvailableCopies([...availableCopies, copy]);
//     setAssignedCopies(assignedCopies.filter(c => c.id !== copy.id));
//   };
  
//   // Handle final confirmation
//   const handleConfirmAssignment = async () => {
//     if (!selectedEvaluator) {
//       alert('Please select an evaluator');
//       return;
//     }
    
//     if (assignedCopies.length === 0) {
//       alert('No copies selected for assignment');
//       return;
//     }
    
//     try {
//       setLoading(true);
      
//       // Prepare data for API
//       const assignmentData = {
//         evaluatorId: selectedEvaluator.id,
//         copyIds: assignedCopies.map(copy => copy.id)
//       };
      
//       // Send assignment to API
//       await api.post('/api/assign-copies', assignmentData);
      
//       alert('Copies assigned successfully!');
      
//       // Reset selection
//       setSelectedEvaluator(null);
//       setAssignedCopies([]);
      
//       // Refresh available copies
//       const params = {
//         courseId: selectedCourse || undefined,
//         sessionId: selectedSession || undefined,
//         semesterId: selectedSemester || undefined,
//         subjectId: selectedSubject || undefined
//       };
      
//       const response = await api.get('/api/copies/available', { params });
//       setAvailableCopies(response.data);
//     } catch (err) {
//       console.error('Error assigning copies:', err);
//       alert('Failed to assign copies. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//       <div className="px-4 py-5 sm:px-6">
//         <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Copies To Evaluators</h3>
//         <p className="mt-1 max-w-2xl text-sm text-gray-500">Select evaluator and copies to assign for evaluation</p>
//       </div>
      
//       {loading ? (
//         <div className="px-4 py-5 sm:p-6 text-center">
//           <div className="spinner"></div>
//           <p className="mt-2 text-sm text-gray-500">Loading data...</p>
//         </div>
//       ) : error ? (
//         <div className="px-4 py-5 sm:p-6 text-center text-red-500">
//           {error}
//         </div>
//       ) : (
//         <div className="px-4 py-5 sm:p-6">
//           {/* Evaluator Selection with Search */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Select Evaluator</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={searchEvaluator}
//                 onChange={(e) => setSearchEvaluator(e.target.value)}
//                 placeholder="Search for evaluator..."
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//             </div>
            
//             {searchEvaluator && (
//               <div className="mt-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md">
//                 {filteredEvaluators.length === 0 ? (
//                   <div className="px-4 py-2 text-sm text-gray-500">No evaluators found</div>
//                 ) : (
//                   <ul>
//                     {filteredEvaluators.map(evaluator => (
//                       <li 
//                         key={evaluator.id} 
//                         onClick={() => {
//                           setSelectedEvaluator(evaluator);
//                           setSearchEvaluator('');
//                         }}
//                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                       >
//                         {evaluator.name} {evaluator.email ? `(${evaluator.email})` : ''}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             )}
            
//             {selectedEvaluator && (
//               <div className="mt-3 p-3 bg-blue-50 rounded-md flex justify-between items-center">
//                 <div>
//                   <div className="font-medium">{selectedEvaluator.name}</div>
//                   {selectedEvaluator.email && (
//                     <div className="text-sm text-gray-500">{selectedEvaluator.email}</div>
//                   )}
//                 </div>
//                 <button 
//                   onClick={() => {
//                     setSelectedEvaluator(null);
//                     setAssignedCopies([]);
//                   }}
//                   className="text-sm text-red-600 hover:text-red-900"
//                 >
//                   Clear
//                 </button>
//               </div>
//             )}
//           </div>
          
//           {/* Filters */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
//               <select
//                 value={selectedCourse}
//                 onChange={(e) => setSelectedCourse(e.target.value)}
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               >
//                 <option value="">All Courses</option>
//                 {courses.map(course => (
//                   <option key={course.id} value={course.id}>{course.name}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
//               <select
//                 value={selectedSession}
//                 onChange={(e) => setSelectedSession(e.target.value)}
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               >
//                 <option value="">All Sessions</option>
//                 {sessions.map(session => (
//                   <option key={session.id} value={session.id}>{session.name}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
//               <select
//                 value={selectedSemester}
//                 onChange={(e) => setSelectedSemester(e.target.value)}
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               >
//                 <option value="">All Semesters</option>
//                 {semesters.map(semester => (
//                   <option key={semester.id} value={semester.id}>{semester.name}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
//               <select
//                 value={selectedSubject}
//                 onChange={(e) => setSelectedSubject(e.target.value)}
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               >
//                 <option value="">All Subjects</option>
//                 {subjects.map(subject => (
//                   <option key={subject.id} value={subject.id}>
//                     {subject.code ? `${subject.code} - ${subject.name}` : subject.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           {/* Assignment Boxes */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Available Copies Box */}
//             <div>
//               <h3 className="text-md font-medium text-gray-900 mb-2">Available Copies</h3>
//               <div className="border border-gray-300 rounded-md overflow-hidden">
//                 <div className="max-h-96 overflow-y-auto">
//                   {availableCopies.length === 0 ? (
//                     <div className="p-4 text-center text-gray-500">
//                       No copies available with the selected filters
//                     </div>
//                   ) : (
//                     <ul className="divide-y divide-gray-200">
//                       {availableCopies.map(copy => (
//                         <li key={copy.id} className="p-3 hover:bg-gray-50">
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <div className="font-medium">{copy.rollNo}</div>
//                               <div className="text-sm text-gray-500">{copy.studentName}</div>
//                             </div>
//                             <button
//                               onClick={() => assignCopy(copy)}
//                               className="text-blue-600 hover:text-blue-800"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                               </svg>
//                             </button>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             {/* Assigned Copies Box */}
//             <div>
//               <h3 className="text-md font-medium text-gray-900 mb-2">Copies to Assign to Evaluator</h3>
//               <div className="border border-gray-300 rounded-md overflow-hidden">
//                 <div className="max-h-96 overflow-y-auto">
//                   {!selectedEvaluator ? (
//                     <div className="p-4 text-center text-gray-500">
//                       Please select an evaluator first
//                     </div>
//                   ) : assignedCopies.length === 0 ? (
//                     <div className="p-4 text-center text-gray-500">
//                       No copies assigned yet
//                     </div>
//                   ) : (
//                     <ul className="divide-y divide-gray-200">
//                       {assignedCopies.map(copy => (
//                         <li key={copy.id} className="p-3 hover:bg-gray-50">
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <div className="font-medium">{copy.rollNo}</div>
//                               <div className="text-sm text-gray-500">{copy.studentName}</div>
//                             </div>
//                             <button
//                               onClick={() => unassignCopy(copy)}
//                               className="text-red-600 hover:text-red-800"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                               </svg>
//                             </button>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Confirmation Button */}
//           <div className="mt-6 flex justify-end">
//             <button
//               onClick={handleConfirmAssignment}
//               disabled={!selectedEvaluator || assignedCopies.length === 0}
//               className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!selectedEvaluator || assignedCopies.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
//             >
//               Confirm Assignment
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssignSubjects;



//?v2(Testing) assign subjects from api



// import React, { useState, useEffect } from 'react';
// import API_ROUTES from '../../../api/routes';
// import api from '../../../api/axios.js';

// const AssignSubjects = () => {
//   // State for evaluator selection
//   const [evaluators, setEvaluators] = useState([]);
//   const [selectedEvaluator, setSelectedEvaluator] = useState(null);
//   const [searchEvaluator, setSearchEvaluator] = useState('');
  
//   // State for courses and subjects
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
  
//   // Selected filters
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState(null);
  
//   // Available copies after filtering
//   const [availableCopies, setAvailableCopies] = useState([]);
  
//   // Copies assigned to the selected evaluator
//   const [assignedCopies, setAssignedCopies] = useState([]);
  
//   // UI state
//   const [loading, setLoading] = useState(true);
//   const [subjectsLoading, setSubjectsLoading] = useState(false);
//   const [copiesLoading, setCopiesLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   // Fetch evaluators and courses on initial load
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch evaluators
//         const evaluatorsResponse = await api.get(API_ROUTES.ADMIN.GET_EVALUATORS);
//         const evaluatorsData = evaluatorsResponse.data;
        
//         const formattedEvaluators = evaluatorsData.map(evaluator => ({
//           id: evaluator.uid,
//           name: evaluator.name,
//           email: evaluator.email
//         }));
        
//         setEvaluators(formattedEvaluators);
        
//         // Fetch courses
//         const coursesResponse = await api.get('/api/exams');
//         setCourses(coursesResponse.data);
        
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching initial data:', err);
//         setError('Failed to load courses and evaluators. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);
  
//   // Fetch subjects when course is selected
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       if (!selectedCourse) {
//         setSubjects([]);
//         return;
//       }
      
//       try {
//         setSubjectsLoading(true);
//         const response = await api.get(`/api/exams/${selectedCourse}/subjects`);
//         setSubjects(response.data);
//       } catch (err) {
//         console.error('Error fetching subjects:', err);
//         setError(`Failed to load subjects for course: ${selectedCourse}`);
//         setSubjects([]);
//       } finally {
//         setSubjectsLoading(false);
//       }
//     };
    
//     fetchSubjects();
//   }, [selectedCourse]);
  
//   // Fetch copies when subject is selected
//   useEffect(() => {
//     const fetchCopies = async () => {
//       if (!selectedSubject) {
//         setAvailableCopies([]);
//         return;
//       }
      
//       try {
//         setCopiesLoading(true);
//         const response = await api.get(`/api/copies/subject`, {
//           params: { packingId: selectedSubject.packingId }
//         });
        
//         // Transform copy IDs into objects we can display and work with
//         const copyObjects = response.data.map(copyId => ({
//           id: copyId,
//           rollNo: copyId,
//           studentName: `Copy ${copyId}`
//         }));
        
//         setAvailableCopies(copyObjects);
//       } catch (err) {
//         console.error('Error fetching copies:', err);
//         setError(`Failed to load copies for subject: ${selectedSubject.subject}`);
//         setAvailableCopies([]);
//       } finally {
//         setCopiesLoading(false);
//       }
//     };
    
//     fetchCopies();
//   }, [selectedSubject]);
  
//   // Filter evaluators based on search
//   const filteredEvaluators = evaluators.filter(evaluator => 
//     evaluator.name.toLowerCase().includes(searchEvaluator.toLowerCase()) ||
//     (evaluator.email && evaluator.email.toLowerCase().includes(searchEvaluator.toLowerCase()))
//   );
  
//   // Handlers for assigning/unassigning copies
//   const assignCopy = (copy) => {
//     if (!selectedEvaluator) {
//       alert('Please select an evaluator first');
//       return;
//     }
    
//     setAssignedCopies([...assignedCopies, copy]);
//     setAvailableCopies(availableCopies.filter(c => c.id !== copy.id));
//   };
  
//   const unassignCopy = (copy) => {
//     setAvailableCopies([...availableCopies, copy]);
//     setAssignedCopies(assignedCopies.filter(c => c.id !== copy.id));
//   };
  
//   // Handle selection of a subject
//   const handleSubjectSelect = (subjectData) => {
//     setSelectedSubject(subjectData);
//   };
  
//   // Handle final confirmation
//   const handleConfirmAssignment = async () => {
//     if (!selectedEvaluator) {
//       alert('Please select an evaluator');
//       return;
//     }
    
//     if (assignedCopies.length === 0) {
//       alert('No copies selected for assignment');
//       return;
//     }
    
//     try {
//       setLoading(true);
      
//       // Prepare data for API
//       const assignmentData = {
//         evaluatorId: selectedEvaluator.id,
//         copyIds: assignedCopies.map(copy => copy.id)
//       };
      
//       // Send assignment to API
//       await api.post('/api/assign-copies', assignmentData);
      
//       alert('Copies assigned successfully!');
      
//       // Reset selection
//       setAssignedCopies([]);
      
//       // Refresh available copies if a subject is selected
//       if (selectedSubject) {
//         const response = await api.get(`/api/copies/subject`, {
//           params: { packingId: selectedSubject.packingId }
//         });
        
//         const copyObjects = response.data.map(copyId => ({
//           id: copyId,
//           rollNo: copyId,
//           studentName: `Copy ${copyId}`
//         }));
        
//         setAvailableCopies(copyObjects);
//       }
//     } catch (err) {
//       console.error('Error assigning copies:', err);
//       alert('Failed to assign copies. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//       <div className="px-4 py-5 sm:px-6">
//         <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Copies To Evaluators</h3>
//         <p className="mt-1 max-w-2xl text-sm text-gray-500">Select evaluator and copies to assign for evaluation</p>
//       </div>
      
//       {loading ? (
//         <div className="px-4 py-5 sm:p-6 text-center">
//           <div className="spinner"></div>
//           <p className="mt-2 text-sm text-gray-500">Loading data...</p>
//         </div>
//       ) : error ? (
//         <div className="px-4 py-5 sm:p-6 text-center text-red-500">
//           {error}
//         </div>
//       ) : (
//         <div className="px-4 py-5 sm:p-6">
//           {/* Evaluator Selection with Search */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Select Evaluator</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={searchEvaluator}
//                 onChange={(e) => setSearchEvaluator(e.target.value)}
//                 placeholder="Search for evaluator..."
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//             </div>
            
//             {searchEvaluator && (
//               <div className="mt-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md">
//                 {filteredEvaluators.length === 0 ? (
//                   <div className="px-4 py-2 text-sm text-gray-500">No evaluators found</div>
//                 ) : (
//                   <ul>
//                     {filteredEvaluators.map(evaluator => (
//                       <li 
//                         key={evaluator.id} 
//                         onClick={() => {
//                           setSelectedEvaluator(evaluator);
//                           setSearchEvaluator('');
//                         }}
//                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                       >
//                         {evaluator.name} {evaluator.email ? `(${evaluator.email})` : ''}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             )}
            
//             {selectedEvaluator && (
//               <div className="mt-3 p-3 bg-blue-50 rounded-md flex justify-between items-center">
//                 <div>
//                   <div className="font-medium">{selectedEvaluator.name}</div>
//                   {selectedEvaluator.email && (
//                     <div className="text-sm text-gray-500">{selectedEvaluator.email}</div>
//                   )}
//                 </div>
//                 <button 
//                   onClick={() => {
//                     setSelectedEvaluator(null);
//                     setAssignedCopies([]);
//                   }}
//                   className="text-sm text-red-600 hover:text-red-900"
//                 >
//                   Clear
//                 </button>
//               </div>
//             )}
//           </div>
          
//           {/* Course and Subject Filters */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
//               <select
//                 value={selectedCourse}
//                 onChange={(e) => {
//                   setSelectedCourse(e.target.value);
//                   setSelectedSubject(null);
//                 }}
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               >
//                 <option value="">Select Course</option>
//                 {courses.map(course => (
//                   <option key={course.courseId} value={course.courseId}>
//                     {course.courseName}
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
//               <select
//                 value={selectedSubject ? JSON.stringify(selectedSubject) : ""}
//                 onChange={(e) => handleSubjectSelect(e.target.value ? JSON.parse(e.target.value) : null)}
//                 disabled={!selectedCourse || subjectsLoading}
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               >
//                 <option value="">Select Subject</option>
//                 {subjects.map(subject => (
//                   <option 
//                     key={subject.subjectId} 
//                     value={JSON.stringify({
//                       subject: subject.subject,
//                       subjectId: subject.subjectId,
//                       packingId: subject.packingId
//                     })}
//                   >
//                     {subject.subject} ({subject.subjectId})
//                   </option>
//                 ))}
//               </select>
//               {subjectsLoading && (
//                 <div className="mt-1 text-sm text-gray-500">Loading subjects...</div>
//               )}
//             </div>
//           </div>
          
//           {/* Assignment Boxes */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Available Copies Box */}
//             <div>
//               <h3 className="text-md font-medium text-gray-900 mb-2">Available Copies</h3>
//               <div className="border border-gray-300 rounded-md overflow-hidden">
//                 <div className="max-h-96 overflow-y-auto">
//                   {!selectedSubject ? (
//                     <div className="p-4 text-center text-gray-500">
//                       Please select a subject to see available copies
//                     </div>
//                   ) : copiesLoading ? (
//                     <div className="p-4 text-center text-gray-500">
//                       Loading copies...
//                     </div>
//                   ) : availableCopies.length === 0 ? (
//                     <div className="p-4 text-center text-gray-500">
//                       No copies available for this subject
//                     </div>
//                   ) : (
//                     <ul className="divide-y divide-gray-200">
//                       {availableCopies.map(copy => (
//                         <li key={copy.id} className="p-3 hover:bg-gray-50">
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <div className="font-medium">Copy ID: {copy.id}</div>
//                             </div>
//                             <button
//                               onClick={() => assignCopy(copy)}
//                               className="text-blue-600 hover:text-blue-800"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                               </svg>
//                             </button>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             {/* Assigned Copies Box */}
//             <div>
//               <h3 className="text-md font-medium text-gray-900 mb-2">Copies to Assign to Evaluator</h3>
//               <div className="border border-gray-300 rounded-md overflow-hidden">
//                 <div className="max-h-96 overflow-y-auto">
//                   {!selectedEvaluator ? (
//                     <div className="p-4 text-center text-gray-500">
//                       Please select an evaluator first
//                     </div>
//                   ) : assignedCopies.length === 0 ? (
//                     <div className="p-4 text-center text-gray-500">
//                       No copies assigned yet
//                     </div>
//                   ) : (
//                     <ul className="divide-y divide-gray-200">
//                       {assignedCopies.map(copy => (
//                         <li key={copy.id} className="p-3 hover:bg-gray-50">
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <div className="font-medium">Copy ID: {copy.id}</div>
//                             </div>
//                             <button
//                               onClick={() => unassignCopy(copy)}
//                               className="text-red-600 hover:text-red-800"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                               </svg>
//                             </button>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Confirmation Button */}
//           <div className="mt-6 flex justify-end">
//             <button
//               onClick={handleConfirmAssignment}
//               disabled={!selectedEvaluator || assignedCopies.length === 0}
//               className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!selectedEvaluator || assignedCopies.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
//             >
//               Confirm Assignment
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssignSubjects;


//?v3(testing new ui)

// import React, { useState, useEffect } from 'react';
// import API_ROUTES from '../../../api/routes';
// import api from '../../../api/axios.js';
// import { Transition } from '@headlessui/react';

// const AssignSubjects = () => {
//   // State management
//   const [evaluators, setEvaluators] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [availableCopies, setAvailableCopies] = useState([]);
//   const [selectedEvaluator, setSelectedEvaluator] = useState(null);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [selectedCopies, setSelectedCopies] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
  
//   // UI state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState({
//     initial: true,
//     subjects: false,
//     copies: false,
//     assignment: false
//   });
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [activeView, setActiveView] = useState('selection'); // 'selection' or 'review'
  
//   // Fetch initial data: evaluators and courses
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         // Fetch evaluators
//         const evaluatorsResponse = await api.get(API_ROUTES.ADMIN.GET_EVALUATORS);
//         setEvaluators(evaluatorsResponse.data.map(evaluator => ({
//           id: evaluator.uid,
//           name: evaluator.name,
//           email: evaluator.email,
//           copyCount: 0 // Will track assigned copies count
//         })));
        
//         // Fetch courses
//         const coursesResponse = await api.get('/api/exams');
//         setCourses(coursesResponse.data);
        
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching initial data:', err);
//         setError('Failed to load initial data. Please refresh the page.');
//       } finally {
//         setLoading(prev => ({ ...prev, initial: false }));
//       }
//     };

//     fetchInitialData();
//   }, []);
  
//   // Fetch subjects when course changes
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       if (!selectedCourse) {
//         setSubjects([]);
//         return;
//       }
      
//       try {
//         setLoading(prev => ({ ...prev, subjects: true }));
//         const response = await api.get(`/api/exams/${selectedCourse}/subjects`);
//         setSubjects(response.data);
//       } catch (err) {
//         console.error('Error fetching subjects:', err);
//         setError(`Could not retrieve subjects for ${selectedCourse}`);
//         setSubjects([]);
//       } finally {
//         setLoading(prev => ({ ...prev, subjects: false }));
//       }
//     };
    
//     fetchSubjects();
//   }, [selectedCourse]);
  
//   // Fetch copies when subject changes
//   useEffect(() => {
//     const fetchCopies = async () => {
//       if (!selectedSubject) {
//         setAvailableCopies([]);
//         return;
//       }
      
//       try {
//         setLoading(prev => ({ ...prev, copies: true }));
//         const response = await api.get('/api/copies/subject', {
//           params: { packingId: selectedSubject.packingId }
//         });
        
//         setAvailableCopies(response.data.map(copyId => ({
//           id: copyId,
//           barcode: copyId
//         })));
//       } catch (err) {
//         console.error('Error fetching copies:', err);
//         setError(`Could not retrieve copies for ${selectedSubject.subject}`);
//         setAvailableCopies([]);
//       } finally {
//         setLoading(prev => ({ ...prev, copies: false }));
//       }
//     };
    
//     if (selectedSubject) {
//       fetchCopies();
//     }
//   }, [selectedSubject]);
  
//   // Handle select all copies toggle
//   useEffect(() => {
//     if (selectAll) {
//       setSelectedCopies(availableCopies.map(copy => copy.id));
//     } else if (selectedCopies.length === availableCopies.length) {
//       // Only clear if we're explicitly unselecting all
//       setSelectedCopies([]);
//     }
//   }, [selectAll, availableCopies]);
  
//   // Filter evaluators based on search
//   const filteredEvaluators = evaluators.filter(evaluator => 
//     evaluator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (evaluator.email && evaluator.email.toLowerCase().includes(searchTerm.toLowerCase()))
//   );
  
//   // Toggle selection of a copy
//   const toggleCopySelection = (copyId) => {
//     if (selectedCopies.includes(copyId)) {
//       setSelectedCopies(selectedCopies.filter(id => id !== copyId));
//     } else {
//       setSelectedCopies([...selectedCopies, copyId]);
//     }
//   };
  
//   // Handle checkbox change for "Select All"
//   const handleSelectAllChange = (e) => {
//     setSelectAll(e.target.checked);
//   };
  
//   // Move to review step
//   const proceedToReview = () => {
//     if (!selectedEvaluator) {
//       setError('Please select an evaluator');
//       return;
//     }
    
//     if (selectedCopies.length === 0) {
//       setError('Please select at least one copy');
//       return;
//     }
    
//     setActiveView('review');
//   };
  
//   // Go back to selection step
//   const backToSelection = () => {
//     setActiveView('selection');
//     setError(null);
//   };
  
//   // Handle subject selection
//   const handleSubjectSelect = (e) => {
//     const value = e.target.value;
//     if (!value) {
//       setSelectedSubject(null);
//       return;
//     }
    
//     try {
//       setSelectedSubject(JSON.parse(value));
//       setSelectedCopies([]);
//       setSelectAll(false);
//     } catch (err) {
//       console.error('Error parsing subject:', err);
//     }
//   };
  
//   // Submit assignment
//   const handleSubmitAssignment = async () => {
//     if (selectedCopies.length === 0 || !selectedEvaluator) {
//       setError('Please select evaluator and copies to assign');
//       return;
//     }
    
//     try {
//       setLoading(prev => ({ ...prev, assignment: true }));
      
//       // Prepare data for API
//       const assignmentData = {
//         evaluatorId: selectedEvaluator.id,
//         copyIds: selectedCopies
//       };
      
//       // Call API to assign copies
//       await api.post('/api/assign-copies', assignmentData);
      
//       // Update UI with success message
//       setSuccess(`Successfully assigned ${selectedCopies.length} copies to ${selectedEvaluator.name}`);
      
//       // Reset selection state
//       setSelectedCopies([]);
//       setSelectAll(false);
//       setActiveView('selection');
      
//       // Refetch available copies to update list
//       if (selectedSubject) {
//         const response = await api.get('/api/copies/subject', {
//           params: { packingId: selectedSubject.packingId }
//         });
        
//         setAvailableCopies(response.data.map(copyId => ({
//           id: copyId,
//           barcode: copyId
//         })));
//       }
      
//       // Update evaluator's copy count for UI feedback
//       setEvaluators(prev => 
//         prev.map(evaluator => 
//           evaluator.id === selectedEvaluator.id 
//             ? { ...evaluator, copyCount: evaluator.copyCount + selectedCopies.length }
//             : evaluator
//         )
//       );
      
//       // Clear success message after 5 seconds
//       setTimeout(() => setSuccess(null), 5000);
//     } catch (err) {
//       console.error('Error assigning copies:', err);
//       setError('Failed to assign copies. Please try again.');
//     } finally {
//       setLoading(prev => ({ ...prev, assignment: false }));
//     }
//   };

//   return (
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       {/* Page Header */}
//       <div className="px-6 py-5 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-800">Assign Copies to Evaluators</h2>
//         <p className="mt-1 text-sm text-gray-600">Select copies from subjects and assign them to evaluators</p>
//       </div>
      
//       {loading.initial ? (
//         <div className="flex justify-center items-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       ) : error ? (
//         <div className="px-6 py-4 bg-red-50 border-l-4 border-red-500 my-4 mx-6">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//             <div className="ml-auto pl-3">
//               <div className="-mx-1.5 -my-1.5">
//                 <button onClick={() => setError(null)} className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
//                   <span className="sr-only">Dismiss</span>
//                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : success ? (
//         <div className="px-6 py-4 bg-green-50 border-l-4 border-green-500 my-4 mx-6">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-green-700">{success}</p>
//             </div>
//             <div className="ml-auto pl-3">
//               <div className="-mx-1.5 -my-1.5">
//                 <button onClick={() => setSuccess(null)} className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
//                   <span className="sr-only">Dismiss</span>
//                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {/* Selection View */}
//       <Transition
//         show={activeView === 'selection'}
//         enter="transition ease-out duration-200"
//         enterFrom="opacity-0 translate-y-1"
//         enterTo="opacity-100 translate-y-0"
//         leave="transition ease-in duration-150"
//         leaveFrom="opacity-100 translate-y-0"
//         leaveTo="opacity-0 translate-y-1"
//       >
//         <div className="p-6">
//           <div className="mb-8">
//             <h3 className="text-lg font-medium text-gray-900 mb-3">1. Select Evaluator</h3>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="block w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Search evaluators by name or email..."
//               />
//               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                 </svg>
//               </div>
//             </div>

//             <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {filteredEvaluators.length === 0 ? (
//                 <div className="col-span-full py-4 text-center text-gray-500">
//                   {searchTerm ? "No evaluators match your search" : "No evaluators available"}
//                 </div>
//               ) : (
//                 filteredEvaluators.map(evaluator => (
//                   <div 
//                     key={evaluator.id}
//                     onClick={() => setSelectedEvaluator(evaluator)}
//                     className={`cursor-pointer rounded-lg border p-4 transition-all ${
//                       selectedEvaluator?.id === evaluator.id
//                         ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
//                         : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
//                     }`}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h4 className="font-medium text-gray-900">{evaluator.name}</h4>
//                         {evaluator.email && (
//                           <p className="text-sm text-gray-500 mt-1">{evaluator.email}</p>
//                         )}
//                       </div>
//                       {selectedEvaluator?.id === evaluator.id && (
//                         <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                         </svg>
//                       )}
//                     </div>
//                     {evaluator.copyCount > 0 && (
//                       <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {evaluator.copyCount} {evaluator.copyCount === 1 ? 'copy' : 'copies'} assigned
//                       </div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-lg font-medium text-gray-900 mb-3">2. Select Course and Subject</h3>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div>
//                 <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Course</label>
//                 <select
//                   id="course"
//                   value={selectedCourse}
//                   onChange={(e) => {
//                     setSelectedCourse(e.target.value);
//                     setSelectedSubject(null);
//                   }}
//                   className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                 >
//                   <option value="">Select a course</option>
//                   {courses.map(course => (
//                     <option key={course.courseId} value={course.courseId}>
//                       {course.courseName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
//                 <div className="relative">
//                   <select
//                     id="subject"
//                     value={selectedSubject ? JSON.stringify(selectedSubject) : ""}
//                     onChange={handleSubjectSelect}
//                     disabled={!selectedCourse || loading.subjects}
//                     className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:text-gray-500"
//                   >
//                     <option value="">Select a subject</option>
//                     {subjects.map(subject => (
//                       <option 
//                         key={subject.subjectId} 
//                         value={JSON.stringify({
//                           subject: subject.subject,
//                           subjectId: subject.subjectId,
//                           packingId: subject.packingId
//                         })}
//                       >
//                         {subject.subject} ({subject.subjectId})
//                       </option>
//                     ))}
//                   </select>
//                   {loading.subjects && (
//                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                       <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {selectedSubject && (
//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-lg font-medium text-gray-900">3. Select Copies</h3>
//                 <div className="flex items-center">
//                   <input
//                     id="select-all"
//                     type="checkbox"
//                     checked={selectAll}
//                     onChange={handleSelectAllChange}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
//                     Select All ({availableCopies.length})
//                   </label>
//                 </div>
//               </div>

//               {loading.copies ? (
//                 <div className="flex justify-center items-center py-12">
//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
//                   <span className="ml-3 text-gray-600">Loading copies...</span>
//                 </div>
//               ) : availableCopies.length === 0 ? (
//                 <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
//                   <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   <h3 className="mt-2 text-base font-medium text-gray-900">No copies available</h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     There are no copies available for this subject.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//                   <div className="max-h-96 overflow-y-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50 sticky top-0">
//                         <tr>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
//                             Select
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Copy ID
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {availableCopies.map((copy) => (
//                           <tr 
//                             key={copy.id} 
//                             className={selectedCopies.includes(copy.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}
//                           >
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedCopies.includes(copy.id)}
//                                 onChange={() => toggleCopySelection(copy.id)}
//                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                               />
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                               {copy.barcode}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                   <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
//                     <span className="text-sm text-gray-700">
//                       {selectedCopies.length} of {availableCopies.length} copies selected
//                     </span>
//                     <button
//                       type="button"
//                       onClick={proceedToReview}
//                       disabled={selectedCopies.length === 0 || !selectedEvaluator}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
//                     >
//                       Review Assignment
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </Transition>

//       {/* Review View */}
//       <Transition
//         show={activeView === 'review'}
//         enter="transition ease-out duration-200"
//         enterFrom="opacity-0 translate-y-1"
//         enterTo="opacity-100 translate-y-0"
//         leave="transition ease-in duration-150"
//         leaveFrom="opacity-100 translate-y-0"
//         leaveTo="opacity-0 translate-y-1"
//       >
//         <div className="p-6">
//           <div className="mb-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-3">Review Assignment</h3>
//             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-yellow-700">
//                     Please review the assignment details before confirming. This action cannot be undone.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//               <div className="px-6 py-4 border-b border-gray-200">
//                 <h4 className="text-base font-medium text-gray-900">Assignment Details</h4>
//               </div>
//               <div className="px-6 py-4">
//                 <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
//                   <div className="sm:col-span-1">
//                     <dt className="text-sm font-medium text-gray-500">Evaluator</dt>
//                     <dd className="mt-1 text-sm text-gray-900">{selectedEvaluator?.name}</dd>
//                   </div>
//                   <div className="sm:col-span-1">
//                     <dt className="text-sm font-medium text-gray-500">Email</dt>
//                     <dd className="mt-1 text-sm text-gray-900">{selectedEvaluator?.email || "N/A"}</dd>
//                   </div>
//                   <div className="sm:col-span-1">
//                     <dt className="text-sm font-medium text-gray-500">Course</dt>
//                     <dd className="mt-1 text-sm text-gray-900">
//                       {courses.find(c => c.courseId === selectedCourse)?.courseName || selectedCourse}
//                     </dd>
//                   </div>
//                   <div className="sm:col-span-1">
//                     <dt className="text-sm font-medium text-gray-500">Subject</dt>
//                     <dd className="mt-1 text-sm text-gray-900">{selectedSubject?.subject}</dd>
//                   </div>
//                   <div className="sm:col-span-2">
//                     <dt className="text-sm font-medium text-gray-500">Number of Copies</dt>
//                     <dd className="mt-1 text-sm text-gray-900">{selectedCopies.length}</dd>
//                   </div>
//                 </dl>
//               </div>
//             </div>

//             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//               <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                 <h4 className="text-base font-medium text-gray-900">Selected Copies</h4>
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                   {selectedCopies.length} copies
//                 </span>
//               </div>
//               <div className="max-h-80 overflow-y-auto">
//                 <ul className="divide-y divide-gray-200">
//                   {selectedCopies.map(copyId => {
//                     const copy = availableCopies.find(c => c.id === copyId);
//                     return (
//                       <li key={copyId} className="px-6 py-3 flex items-center text-sm">
//                         <svg className="text-blue-500 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
//                         </svg>
//                         <span className="font-medium text-gray-900">{copy?.barcode || copyId}</span>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={backToSelection}
//               className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Back
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmitAssignment}
//               disabled={loading.assignment}
//               className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
//             >
//               {loading.assignment ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : 'Confirm Assignment'}
//             </button>
//           </div>
//         </div>
//       </Transition>
//     </div>
//   );
// };

// export default AssignSubjects;


//? v4 (ui update, )

import React, { useState, useEffect } from 'react';
import API_ROUTES from '../../../api/routes';
import api from '../../../api/axios.js';
import EvaluatorSelector from './AssignSubjectComponents/EvaluatorSelector.jsx';
import CopySelector from './AssignSubjectComponents/CopySelector.jsx';

// Main Component
const AssignSubjects = () => {
  // State management
  const [evaluators, setEvaluators] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [availableCopies, setAvailableCopies] = useState([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCopies, setSelectedCopies] = useState([]);
  const [viewMode, setViewMode] = useState('select'); // 'select' or 'review'
  
  // Loading states
  const [loading, setLoading] = useState({
    initial: true,
    subjects: false,
    copies: false,
    submit: false
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
          copyCount: 0 // Track assigned copies
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
  
  // Fetch copies when subject changes
  useEffect(() => {
    if (!selectedSubject) {
      setAvailableCopies([]);
      setSelectedCopies([]);
      return;
    }
    
    const fetchCopies = async () => {
      try {
        setLoading(prev => ({ ...prev, copies: true }));
        const response = await api.get('/api/copies/subject', {
          params: { packingId: selectedSubject.packingId }
        });
        
        setAvailableCopies(response.data.map(copyId => ({
          id: copyId,
          barcode: copyId
        })));
      } catch (err) {
        console.error('Error fetching copies:', err);
        setError('Failed to load copies for the selected subject');
        setAvailableCopies([]);
      } finally {
        setLoading(prev => ({ ...prev, copies: false }));
      }
    };
    
    fetchCopies();
  }, [selectedSubject]);
  
  // Handle subject selection from dropdown
  const handleSubjectSelect = (e) => {
    const value = e.target.value;
    if (!value) {
      setSelectedSubject(null);
      return;
    }
    
    try {
      setSelectedSubject(JSON.parse(value));
      setSelectedCopies([]);
    } catch (err) {
      console.error('Error parsing subject data:', err);
    }
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
    
    if (selectedCopies.length === 0) {
      setError('Please select at least one copy');
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
        copyIds: selectedCopies,
        assignedBy: 'Javed',  // Replace with actual admin name or ID
      };
      
      // Call API to assign copies
      await api.post('/api/admin/evaluator/assign-copies', assignmentData);
      
      
      // Update UI with success message
      setSuccess(`Successfully assigned ${selectedCopies.length} copies to ${selectedEvaluator.name}`);
      // Update evaluator's copy count
      setEvaluators(prevEvaluators => 
        prevEvaluators.map(evaluator => 
          evaluator.id === selectedEvaluator.id 
            ? { ...evaluator, copyCount: evaluator.copyCount + selectedCopies.length }
            : evaluator
        )
      );
      
      // Reset selection state
      setSelectedCopies([]);
      setViewMode('select');
      
      // Refetch available copies to update list
      if (selectedSubject) {
        const response = await api.get('/api/copies/subject', {
          params: { packingId: selectedSubject.packingId }
        });
        
        setAvailableCopies(response.data.map(copyId => ({
          id: copyId,
          barcode: copyId
        })));
      }
      
      // Auto clear success after delay
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('Error assigning copies:', err);
      setError('Failed to assign copies. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  if (loading.initial) {
    return (
      <div className="bg-white shadow rounded-md p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-md">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Assign Copies</h2>
        {viewMode === 'review' && (
          <button 
            onClick={() => setViewMode('select')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Back to Selection
          </button>
        )}
      </div>
      
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Column 1: Evaluator Selection */}
              <div>
                <EvaluatorSelector 
                  evaluators={evaluators}
                  selectedEvaluator={selectedEvaluator}
                  setSelectedEvaluator={setSelectedEvaluator}
                />
              </div>
              
              {/* Column 2: Course Selection */}
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => {
                      setSelectedCourse(e.target.value);
                      setSelectedSubject(null);
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
              </div>
              
              {/* Column 3: Subject Selection */}
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <div className="relative">
                    <select
                      value={selectedSubject ? JSON.stringify(selectedSubject) : ""}
                      onChange={handleSubjectSelect}
                      disabled={!selectedCourse || loading.subjects}
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option 
                          key={subject.subjectId} 
                          value={JSON.stringify({
                            subject: subject.subject,
                            subjectId: subject.subjectId,
                            packingId: subject.packingId
                          })}
                        >
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
              </div>
            </div>
            
            {/* Copy Selection Section */}
            {selectedSubject && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Available Copies</h3>
                  {selectedCopies.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {selectedCopies.length} selected
                    </span>
                  )}
                </div>
                
                <CopySelector 
                  copies={availableCopies}
                  selectedCopies={selectedCopies}
                  setSelectedCopies={setSelectedCopies}
                  loading={loading.copies}
                />
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleProceedToReview}
                    disabled={!selectedEvaluator || !selectedSubject || selectedCopies.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Review Assignment
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Review Section */}
            <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-700">
              <p>Please review your assignment before confirming. This action cannot be undone.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Assignment Details</h3>
                </div>
                <div className="p-4">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-gray-500">Evaluator:</dt>
                    <dd className="text-gray-900 font-medium">{selectedEvaluator?.name}</dd>
                    
                    <dt className="text-gray-500">Course:</dt>
                    <dd className="text-gray-900">
                      {courses.find(c => c.courseId === selectedCourse)?.courseName}
                    </dd>
                    
                    <dt className="text-gray-500">Subject:</dt>
                    <dd className="text-gray-900">{selectedSubject?.subject}</dd>
                    
                    <dt className="text-gray-500">Copies:</dt>
                    <dd className="text-gray-900">{selectedCopies.length}</dd>
                  </dl>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between">
                  <h3 className="text-sm font-medium text-gray-700">Selected Copies</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {selectedCopies.length} copies
                  </span>
                </div>
                <div className="p-2 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {selectedCopies.map(copyId => (
                      <div key={copyId} className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded">
                        {copyId}
                      </div>
                    ))}
                  </div>
                </div>
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