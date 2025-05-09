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


import React, { useState, useEffect } from 'react';
import API_ROUTES from '../../../api/routes';
import api from '../../../api/axios.js';

const AssignSubjects = () => {
  // State for evaluator selection
  const [evaluators, setEvaluators] = useState([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);
  const [searchEvaluator, setSearchEvaluator] = useState('');
  
  // State for filters
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Selected filters
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  // Available copies after filtering
  const [availableCopies, setAvailableCopies] = useState([]);
  
  // Copies assigned to the selected evaluator
  const [assignedCopies, setAssignedCopies] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get evaluators
        const evaluatorsResponse = await api.get(API_ROUTES.ADMIN.GET_EVALUATORS);
        const evaluatorsData = evaluatorsResponse.data;
        
        const formattedEvaluators = evaluatorsData.map(evaluator => ({
          id: evaluator.uid,
          name: evaluator.name,
          email: evaluator.email
        }));
        
        setEvaluators(formattedEvaluators);
        
        // Fetch other filter data
        try {
          // Fetch courses
          const coursesResponse = await api.get('/api/courses');
          setCourses(coursesResponse.data);
          
          // Fetch sessions
          const sessionsResponse = await api.get('/api/sessions');
          setSessions(sessionsResponse.data);
          
          // Fetch semesters
          const semestersResponse = await api.get('/api/semesters');
          setSemesters(semestersResponse.data);
          
          // Fetch subjects
          const subjectsResponse = await api.get('/api/subjects');
          setSubjects(subjectsResponse.data);
        } catch (filterError) {
          console.warn('Using mock filter data due to API error:', filterError);
          // Mock data for filters
          setCourses([
            { id: 1, name: 'BSc CS' },
            { id: 2, name: 'BSc IT' },
            { id: 3, name: 'BCA' }
          ]);
          
          setSessions([
            { id: 1, name: 'May 2024' },
            { id: 2, name: 'December 2023' }
          ]);
          
          setSemesters([
            { id: 1, name: 'Semester 1' },
            { id: 2, name: 'Semester 2' },
            { id: 3, name: 'Semester 3' },
            { id: 4, name: 'Semester 4' }
          ]);
          
          setSubjects([
            { id: 1, code: 'MATH101', name: 'Mathematics' },
            { id: 2, code: 'PHY101', name: 'Physics' },
            { id: 3, code: 'CHEM101', name: 'Chemistry' },
            { id: 4, code: 'BIO101', name: 'Biology' }
          ]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        
        // Fallback data for demonstration
        setEvaluators([
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Fetch available copies when filters change
  useEffect(() => {
    const fetchCopies = async () => {
      // Only fetch if at least one filter is selected
      if (!selectedCourse && !selectedSession && !selectedSemester && !selectedSubject) {
        setAvailableCopies([]);
        return;
      }
      
      try {
        const params = {
          courseId: selectedCourse || undefined,
          sessionId: selectedSession || undefined,
          semesterId: selectedSemester || undefined,
          subjectId: selectedSubject || undefined
        };
        
        const response = await api.get('/api/copies/available', { params });
        setAvailableCopies(response.data);
      } catch (err) {
        console.error('Error fetching available copies:', err);
        
        // Mock data for demonstration
        setAvailableCopies([
          { id: 1, rollNo: '2023001', studentName: 'Student 1', marks: null },
          { id: 2, rollNo: '2023002', studentName: 'Student 2', marks: null },
          { id: 3, rollNo: '2023003', studentName: 'Student 3', marks: null },
          { id: 4, rollNo: '2023004', studentName: 'Student 4', marks: null },
          { id: 5, rollNo: '2023005', studentName: 'Student 5', marks: null }
        ]);
      }
    };
    
    fetchCopies();
  }, [selectedCourse, selectedSession, selectedSemester, selectedSubject]);
  
  // Filter evaluators based on search
  const filteredEvaluators = evaluators.filter(evaluator => 
    evaluator.name.toLowerCase().includes(searchEvaluator.toLowerCase()) ||
    (evaluator.email && evaluator.email.toLowerCase().includes(searchEvaluator.toLowerCase()))
  );
  
  // Handlers for assigning/unassigning copies
  const assignCopy = (copy) => {
    if (!selectedEvaluator) {
      alert('Please select an evaluator first');
      return;
    }
    
    setAssignedCopies([...assignedCopies, copy]);
    setAvailableCopies(availableCopies.filter(c => c.id !== copy.id));
  };
  
  const unassignCopy = (copy) => {
    setAvailableCopies([...availableCopies, copy]);
    setAssignedCopies(assignedCopies.filter(c => c.id !== copy.id));
  };
  
  // Handle final confirmation
  const handleConfirmAssignment = async () => {
    if (!selectedEvaluator) {
      alert('Please select an evaluator');
      return;
    }
    
    if (assignedCopies.length === 0) {
      alert('No copies selected for assignment');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare data for API
      const assignmentData = {
        evaluatorId: selectedEvaluator.id,
        copyIds: assignedCopies.map(copy => copy.id)
      };
      
      // Send assignment to API
      await api.post('/api/assign-copies', assignmentData);
      
      alert('Copies assigned successfully!');
      
      // Reset selection
      setSelectedEvaluator(null);
      setAssignedCopies([]);
      
      // Refresh available copies
      const params = {
        courseId: selectedCourse || undefined,
        sessionId: selectedSession || undefined,
        semesterId: selectedSemester || undefined,
        subjectId: selectedSubject || undefined
      };
      
      const response = await api.get('/api/copies/available', { params });
      setAvailableCopies(response.data);
    } catch (err) {
      console.error('Error assigning copies:', err);
      alert('Failed to assign copies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Copies To Evaluators</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Select evaluator and copies to assign for evaluation</p>
      </div>
      
      {loading ? (
        <div className="px-4 py-5 sm:p-6 text-center">
          <div className="spinner"></div>
          <p className="mt-2 text-sm text-gray-500">Loading data...</p>
        </div>
      ) : error ? (
        <div className="px-4 py-5 sm:p-6 text-center text-red-500">
          {error}
        </div>
      ) : (
        <div className="px-4 py-5 sm:p-6">
          {/* Evaluator Selection with Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Evaluator</label>
            <div className="relative">
              <input
                type="text"
                value={searchEvaluator}
                onChange={(e) => setSearchEvaluator(e.target.value)}
                placeholder="Search for evaluator..."
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {searchEvaluator && (
              <div className="mt-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                {filteredEvaluators.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">No evaluators found</div>
                ) : (
                  <ul>
                    {filteredEvaluators.map(evaluator => (
                      <li 
                        key={evaluator.id} 
                        onClick={() => {
                          setSelectedEvaluator(evaluator);
                          setSearchEvaluator('');
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {evaluator.name} {evaluator.email ? `(${evaluator.email})` : ''}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {selectedEvaluator && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md flex justify-between items-center">
                <div>
                  <div className="font-medium">{selectedEvaluator.name}</div>
                  {selectedEvaluator.email && (
                    <div className="text-sm text-gray-500">{selectedEvaluator.email}</div>
                  )}
                </div>
                <button 
                  onClick={() => {
                    setSelectedEvaluator(null);
                    setAssignedCopies([]);
                  }}
                  className="text-sm text-red-600 hover:text-red-900"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Sessions</option>
                {sessions.map(session => (
                  <option key={session.id} value={session.id}>{session.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Semesters</option>
                {semesters.map(semester => (
                  <option key={semester.id} value={semester.id}>{semester.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code ? `${subject.code} - ${subject.name}` : subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Assignment Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Copies Box */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Available Copies</h3>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {availableCopies.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No copies available with the selected filters
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {availableCopies.map(copy => (
                        <li key={copy.id} className="p-3 hover:bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{copy.rollNo}</div>
                              <div className="text-sm text-gray-500">{copy.studentName}</div>
                            </div>
                            <button
                              onClick={() => assignCopy(copy)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            
            {/* Assigned Copies Box */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Copies to Assign to Evaluator</h3>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {!selectedEvaluator ? (
                    <div className="p-4 text-center text-gray-500">
                      Please select an evaluator first
                    </div>
                  ) : assignedCopies.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No copies assigned yet
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {assignedCopies.map(copy => (
                        <li key={copy.id} className="p-3 hover:bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{copy.rollNo}</div>
                              <div className="text-sm text-gray-500">{copy.studentName}</div>
                            </div>
                            <button
                              onClick={() => unassignCopy(copy)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Confirmation Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleConfirmAssignment}
              disabled={!selectedEvaluator || assignedCopies.length === 0}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!selectedEvaluator || assignedCopies.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignSubjects;