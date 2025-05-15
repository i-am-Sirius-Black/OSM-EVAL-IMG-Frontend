//*V4 Update the UI/UX to reduce clutter
import React, { useState, useEffect, useMemo } from 'react';
import { Search, FilterList, KeyboardArrowDown, KeyboardArrowUp, Flag, RemoveRedEye, Close } from '@mui/icons-material';


function StudentResults() {
    // Core state
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Selection state
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [flagThreshold, setFlagThreshold] = useState(30);
  
  // UI state for pagination and view control
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // New state for modal
  const [modalStudent, setModalStudent] = useState(null);


   // Fetch sessions - replace with API call
  useEffect(() => {
    setSessions(['2024-2025', '2023-2024', '2022-2023']);
  }, []);

  // Fetch courses when session changes
  useEffect(() => {
    if (!selectedSession) return;
    
    setLoading(true);
    setCourses([]);
    setStudents([]);
    setSelectedCourse('');
    setCurrentPage(1);
    setExpandedStudent(null);
    
    // Simulate API call - replace with actual API
    setTimeout(() => {
      setCourses([
        { id: 'CS101', name: 'Bachelor of Computer Science' },
        { id: 'EE101', name: 'Bachelor of Electrical Engineering' },
        { id: 'ME101', name: 'Bachelor of Mechanical Engineering' },
        { id: 'CE101', name: 'Bachelor of Civil Engineering' },
      ]);
      setLoading(false);
    }, 600);
  }, [selectedSession]);

  // Fetch students when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    
    setLoading(true);
    setStudents([]);
    setCurrentPage(1);
    setExpandedStudent(null);
    
    // In a real implementation, you would fetch from API
    // api.getStudentResults(selectedSession, selectedCourse)
    //   .then(data => {
    //     setStudents(data);
    //     setLoading(false);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching student data:', error);
    //     setLoading(false);
    //   });

    // Simulate API call with mock data
    setTimeout(() => {
      // Generate 60 students for realistic volume
      const mockStudents = [];
      for (let i = 1; i <= 60; i++) {
        const studentId = `S${i.toString().padStart(3, '0')}`;
        
        // Create some variation in marks to test flagging logic
        const baseMarks = Math.floor(Math.random() * 30) + 50; // Base score between 50-80
        
        // Create subject data with some random variation
        const subjects = [
          { code: 'CS201', name: 'Data Structures', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Wilson' },
          { code: 'CS202', name: 'Algorithms', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Brown' },
          { code: 'CS203', name: 'Database Systems', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Davis' },
          { code: 'CS204', name: 'Operating Systems', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Johnson' },
          { code: 'CS205', name: 'Computer Networks', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Miller' },
          { code: 'CS206', name: 'Web Development', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Clark' },
        ];
        
        // Create outlier scores for some students to test flagging
        if (i % 7 === 0) {
          subjects[Math.floor(Math.random() * subjects.length)].obtainedMarks = Math.floor(Math.random() * 30) + 10; // Very low score
        }
        if (i % 13 === 0) {
          subjects[Math.floor(Math.random() * subjects.length)].obtainedMarks = Math.floor(Math.random() * 10) + 90; // Very high score
        }
        
        mockStudents.push({
          id: studentId,
          name: `Student ${i}`,
          rollNumber: `2023CS${i.toString().padStart(3, '0')}`,
          subjects
        });
      }
      
      setStudents(mockStudents);
      setLoading(false);
    }, 800);
  }, [selectedCourse]);

  // HELPER FUNCTIONS
  
  // Calculate if a subject should be flagged based on deviation from average
  const shouldFlagSubject = (subject, allSubjects) => {
    if (!subject || !allSubjects || allSubjects.length === 0) return false;
    
    // Calculate average percentage across all subjects
    const totalScore = allSubjects.reduce((sum, s) => sum + (s.obtainedMarks / s.maxMarks) * 100, 0);
    const averageScore = totalScore / allSubjects.length;
    
    // Calculate this subject's percentage
    const subjectPercentage = (subject.obtainedMarks / subject.maxMarks) * 100;
    
    // Flag if the difference exceeds the threshold
    const difference = Math.abs(subjectPercentage - averageScore);
    return difference > flagThreshold;
  };

  // Calculate overall statistics for a student
  const calculateOverall = (subjects) => {
    if (!subjects || subjects.length === 0) return { percentage: 0, total: 0, obtained: 0 };
    
    const total = subjects.reduce((sum, subject) => sum + subject.maxMarks, 0);
    const obtained = subjects.reduce((sum, subject) => sum + subject.obtainedMarks, 0);
    const percentage = ((obtained / total) * 100).toFixed(2);
    
    return { percentage, total, obtained };
  };

  // Check if a student has any flagged subjects
  const hasAnyFlaggedSubject = (student) => {
    if (!student || !student.subjects) return false;
    return student.subjects.some(subject => shouldFlagSubject(subject, student.subjects));
  };

  // Count flagged subjects for a student
  const countFlaggedSubjects = (student) => {
    if (!student || !student.subjects) return 0;
    return student.subjects.filter(subject => shouldFlagSubject(subject, student.subjects)).length;
  };

  // Flag a subject for moderation
  const handleFlagForModeration = (studentId, subjectCode) => {
    // In a real implementation, call API to flag for moderation
    // api.flagForModeration(studentId, subjectCode)
    //   .then(response => {
    //     // Handle success
    //   })
    //   .catch(error => {
    //     // Handle error
    //   });
    
    alert(`Flagged ${subjectCode} for student ${studentId} for moderation review`);
  };


  // FILTERED AND SORTED DATA
  
  // Filter, sort and paginate students - using useMemo for performance
  const processedStudents = useMemo(() => {
    // First, filter based on search term
    let result = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filter to show only flagged if selected
    if (showFlaggedOnly) {
      result = result.filter(student => hasAnyFlaggedSubject(student));
    }
    
    // Sort students based on current sort configuration
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue, bValue;
        
        // Handle different sort keys
        if (sortConfig.key === 'name' || sortConfig.key === 'rollNumber') {
          aValue = a[sortConfig.key].toLowerCase();
          bValue = b[sortConfig.key].toLowerCase();
        } else if (sortConfig.key === 'overall') {
          aValue = parseFloat(calculateOverall(a.subjects).percentage);
          bValue = parseFloat(calculateOverall(b.subjects).percentage);
        } else if (sortConfig.key === 'flagged') {
          aValue = countFlaggedSubjects(a);
          bValue = countFlaggedSubjects(b);
        }
        
        // Determine sort direction
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [students, searchTerm, sortConfig, showFlaggedOnly, flagThreshold]);
  
  // Calculate pagination
  const totalPages = Math.ceil(processedStudents.length / studentsPerPage);
  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    return processedStudents.slice(startIndex, startIndex + studentsPerPage);
  }, [processedStudents, currentPage, studentsPerPage]);

  // Handle sorting by column
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get the sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' 
      ? <KeyboardArrowUp fontSize="small" className="text-blue-500" />
      : <KeyboardArrowDown fontSize="small" className="text-blue-500" />;
  };


  // Modified toggle function to use modal instead of inline expansion
  const toggleStudentExpansion = (studentId) => {
    setModalStudent(studentId ? students.find(s => s.id === studentId) : null);
  };

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          {/* <h2 className="text-xl font-semibold text-gray-800">Student Results Analysis</h2> */}
          <p className=" text-gray-700 mt-1">
            Review student performance and identify potential evaluation discrepancies
          </p>
        </div>
        <button 
          onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
          className={`inline-flex items-center px-3 py-1 border ${filterDrawerOpen ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'} rounded-md transition-colors hover:bg-blue-100`}
        >
          <FilterList className="h-5 w-5 mr-2" />
          Filters
          {filterDrawerOpen ? <KeyboardArrowUp className="ml-1" /> : <KeyboardArrowDown className="ml-1" />}
        </button>
      </div>
      
      {/* Filter Panel (Replaces Drawer) */}
      {filterDrawerOpen && (
        <div className="fixed top-0 right-0 z-50 w-full sm:w-80 bg-white shadow-lg border-l border-gray-200 h-80% overflow-y-auto transition-transform duration-300 transform translate-x-0">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Filter Options</h3>
            <button 
              onClick={() => setFilterDrawerOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Close className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Collapsible Session/Course Section */}
            <details className="border border-gray-200 rounded-md" open>
              <summary className="px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                Session & Course
              </summary>
              <div className="p-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Session/Year</label>
                  <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Session</option>
                    {sessions.map(session => (
                      <option key={session} value={session}>{session}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Course</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    disabled={!selectedSession || loading}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </details>
            
            {/* Collapsible Display Options Section */}
            <details className="border border-gray-200 rounded-md" open>
              <summary className="px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                Display Options
              </summary>
              <div className="p-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Flag Threshold: <span className="font-bold">{flagThreshold}%</span>
                  </label>
                  <input
                    type="range"
                    value={flagThreshold}
                    onChange={(e) => setFlagThreshold(Number(e.target.value))}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Flag subjects deviating &gt;{flagThreshold}% from average
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Results per page</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 20, 50, 100].map(size => (
                      <button
                        key={size}
                        onClick={() => {
                          setStudentsPerPage(size);
                          setCurrentPage(1);
                        }}
                        className={`py-1 text-xs rounded-md ${
                          studentsPerPage === size
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showFlagged"
                    checked={showFlaggedOnly}
                    onChange={() => setShowFlaggedOnly(!showFlaggedOnly)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showFlagged" className="ml-2 text-xs text-gray-700">
                    Show only flagged students
                  </label>
                </div>
              </div>
            </details>
          </div>
          
          {/* Sticky Footer for Actions */}
          <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowFlaggedOnly(false);
                  setSortConfig({ key: 'name', direction: 'ascending' });
                  setFlagThreshold(30);
                  setStudentsPerPage(10);
                }}
                className="px-3 py-1.5 text-xs text-gray-600 rounded-md hover:bg-gray-100"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="px-3 py-1.5 text-red-600 rounded-md text-xs hover:bg-red-100"
              >
                Close
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Search Bar */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            disabled={!selectedCourse}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Active Filters (Horizontal Scrollable) */}
        {(selectedSession || selectedCourse || showFlaggedOnly || searchTerm) && (
          <div className="mt-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
            <div className="flex gap-2">
              {selectedSession && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 whitespace-nowrap">
                  Session: {selectedSession}
                </span>
              )}
              {selectedCourse && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 whitespace-nowrap">
                  Course: {courses.find(c => c.id === selectedCourse)?.name || selectedCourse}
                </span>
              )}
              {showFlaggedOnly && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-800 whitespace-nowrap">
                  <Flag fontSize="small" className="h-3 w-3 mr-1" />
                  Flagged Only
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 whitespace-nowrap">
                  Search: "{searchTerm}"
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Results Table */}
      <div className="flex-grow overflow-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <span className="text-gray-500">Loading results...</span>
          </div>
        ) : !selectedSession || !selectedCourse ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <span className="mb-2">Please select session and course</span>
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100"
            >
              Open Filters
            </button>
          </div>
        ) : processedStudents.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <span className="mb-2">No students found</span>
            <span className="text-sm">Try adjusting your search or filters</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => requestSort('rollNumber')}>
                      Roll No. {getSortDirectionIndicator('rollNumber')}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => requestSort('name')}>
                      Name {getSortDirectionIndicator('name')}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => requestSort('overall')}>
                      Overall {getSortDirectionIndicator('overall')}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => requestSort('flagged')}>
                      Flagged {getSortDirectionIndicator('flagged')}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStudents.map(student => {
                  const overall = calculateOverall(student.subjects);
                  const flaggedCount = countFlaggedSubjects(student);
                  const hasFlagged = flaggedCount > 0;
                  
                  return (
                    <>
                    <tr key={student.id} className={`${hasFlagged ? 'bg-red-50' : ''} hover:bg-gray-50 transition-colors`}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{student.rollNumber}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{student.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-xs font-medium mr-2">{overall.percentage}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                overall.percentage >= 80 ? 'bg-green-600' : 
                                overall.percentage >= 60 ? 'bg-blue-600' : 
                                overall.percentage >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                              }`} 
                              style={{ width: `${overall.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {flaggedCount > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            <Flag fontSize="small" className="h-3 w-3 mr-1" />
                            {flaggedCount} {flaggedCount === 1 ? 'subject' : 'subjects'}
                          </span>
                        ) : (
                          <span className="text-gray-500">No flags</span>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => toggleStudentExpansion(student.id)}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <RemoveRedEye fontSize="small" className="h-3.5 w-3.5 mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Student Details Modal */}
      {modalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900 block">
                  {modalStudent.name} - {modalStudent.rollNumber}
                </span>
                <span className="text-xs text-gray-500">
                  Overall: {calculateOverall(modalStudent.subjects).percentage}% 
                  ({calculateOverall(modalStudent.subjects).obtained}/{calculateOverall(modalStudent.subjects).total})
                </span>
              </div>
              <button
                onClick={() => toggleStudentExpansion(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Code</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluator</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {modalStudent.subjects.map((subject, index) => {
                    const percentage = (subject.obtainedMarks / subject.maxMarks) * 100;
                    const isFlagged = shouldFlagSubject(subject, modalStudent.subjects);
                    return (
                      <tr key={subject.code} className={`${isFlagged ? 'bg-red-50' : ''} hover:bg-gray-50`}>
                        <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{subject.code}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{subject.name}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{subject.evaluator}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-xs mr-2">{subject.obtainedMarks}/{subject.maxMarks}</span>
                            <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-1">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  percentage >= 80 ? 'bg-green-600' : 
                                  percentage >= 60 ? 'bg-blue-600' : 
                                  percentage >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                                }`} 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className={`text-xs font-medium ${
                              percentage >= 80 ? 'text-green-600' : 
                              percentage >= 60 ? 'text-blue-600' : 
                              percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          <button 
                            onClick={() => handleFlagForModeration(modalStudent.id, subject.code)}
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              isFlagged 
                                ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Flag fontSize="small" className="h-3 w-3 mr-1" />
                            {isFlagged ? 'Flag for Moderation' : 'Request Review'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Pagination Footer */}
      {processedStudents.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-white sticky bottom-0 z-10">
          <div className="flex flex-wrap items-center justify-between">
            <div className="text-sm text-gray-500 mb-2 sm:mb-0">
              Showing {(currentPage - 1) * studentsPerPage + 1}-
              {Math.min(currentPage * studentsPerPage, processedStudents.length)} of {processedStudents.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentResults;















// import React, { useState, useEffect } from 'react'
// import { Search } from '@mui/icons-material'

// function StudentResults() {
//   const [loading, setLoading] = useState(false);
//   const [sessions, setSessions] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedSession, setSelectedSession] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [flagThreshold, setFlagThreshold] = useState(30); // Percentage difference to flag

//   // Mock data - replace with API calls
//   useEffect(() => {
//     // Fetch available sessions
//     setSessions(['2024-2025', '2023-2024', '2022-2023']);
//   }, []);

//   // Fetch courses when session changes
//   useEffect(() => {
//     if (!selectedSession) return;
    
//     setLoading(true);
//     setCourses([]);
//     setStudents([]);
//     setSelectedCourse('');
    
//     // Simulate API call
//     setTimeout(() => {
//       setCourses([
//         { id: 'CS101', name: 'Bachelor of Computer Science' },
//         { id: 'EE101', name: 'Bachelor of Electrical Engineering' },
//         { id: 'ME101', name: 'Bachelor of Mechanical Engineering' },
//         { id: 'CE101', name: 'Bachelor of Civil Engineering' },
//       ]);
//       setLoading(false);
//     }, 600);
//   }, [selectedSession]);

//   // Fetch students when course changes
//   useEffect(() => {
//     if (!selectedCourse) return;
    
//     setLoading(true);
//     setStudents([]);
    
//     // Simulate API call
//     setTimeout(() => {
//       setStudents([
//         {
//           id: 'S001',
//           name: 'John Smith',
//           rollNumber: '2023CS001',
//           subjects: [
//             { code: 'CS201', name: 'Data Structures', maxMarks: 100, obtainedMarks: 87, evaluator: 'Dr. Wilson' },
//             { code: 'CS202', name: 'Algorithms', maxMarks: 100, obtainedMarks: 92, evaluator: 'Dr. Brown' },
//             { code: 'CS203', name: 'Database Systems', maxMarks: 100, obtainedMarks: 78, evaluator: 'Dr. Davis' },
//             { code: 'CS204', name: 'Operating Systems', maxMarks: 100, obtainedMarks: 65, evaluator: 'Dr. Johnson' },
//             { code: 'CS205', name: 'Computer Networks', maxMarks: 100, obtainedMarks: 72, evaluator: 'Dr. Miller' },
//             { code: 'CS206', name: 'Web Development', maxMarks: 100, obtainedMarks: 88, evaluator: 'Dr. Clark' },
//           ]
//         },
//         {
//           id: 'S002',
//           name: 'Emily Johnson',
//           rollNumber: '2023CS002',
//           subjects: [
//             { code: 'CS201', name: 'Data Structures', maxMarks: 100, obtainedMarks: 92, evaluator: 'Dr. Wilson' },
//             { code: 'CS202', name: 'Algorithms', maxMarks: 100, obtainedMarks: 95, evaluator: 'Dr. Brown' },
//             { code: 'CS203', name: 'Database Systems', maxMarks: 100, obtainedMarks: 81, evaluator: 'Dr. Davis' },
//             { code: 'CS204', name: 'Operating Systems', maxMarks: 100, obtainedMarks: 88, evaluator: 'Dr. Johnson' },
//             { code: 'CS205', name: 'Computer Networks', maxMarks: 100, obtainedMarks: 85, evaluator: 'Dr. Miller' },
//             { code: 'CS206', name: 'Web Development', maxMarks: 100, obtainedMarks: 90, evaluator: 'Dr. Clark' },
//           ]
//         },
//         {
//           id: 'S003',
//           name: 'Michael Brown',
//           rollNumber: '2023CS003',
//           subjects: [
//             { code: 'CS201', name: 'Data Structures', maxMarks: 100, obtainedMarks: 76, evaluator: 'Dr. Wilson' },
//             { code: 'CS202', name: 'Algorithms', maxMarks: 100, obtainedMarks: 68, evaluator: 'Dr. Brown' },
//             { code: 'CS203', name: 'Database Systems', maxMarks: 100, obtainedMarks: 72, evaluator: 'Dr. Davis' },
//             { code: 'CS204', name: 'Operating Systems', maxMarks: 100, obtainedMarks: 45, evaluator: 'Dr. Johnson' }, // Flagged - very low
//             { code: 'CS205', name: 'Computer Networks', maxMarks: 100, obtainedMarks: 63, evaluator: 'Dr. Miller' },
//             { code: 'CS206', name: 'Web Development', maxMarks: 100, obtainedMarks: 82, evaluator: 'Dr. Clark' },
//           ]
//         },
//         {
//           id: 'S004',
//           name: 'Jessica Lee',
//           rollNumber: '2023CS004',
//           subjects: [
//             { code: 'CS201', name: 'Data Structures', maxMarks: 100, obtainedMarks: 83, evaluator: 'Dr. Wilson' },
//             { code: 'CS202', name: 'Algorithms', maxMarks: 100, obtainedMarks: 79, evaluator: 'Dr. Brown' },
//             { code: 'CS203', name: 'Database Systems', maxMarks: 100, obtainedMarks: 91, evaluator: 'Dr. Davis' },
//             { code: 'CS204', name: 'Operating Systems', maxMarks: 100, obtainedMarks: 85, evaluator: 'Dr. Johnson' },
//             { code: 'CS205', name: 'Computer Networks', maxMarks: 100, obtainedMarks: 77, evaluator: 'Dr. Miller' },
//             { code: 'CS206', name: 'Web Development', maxMarks: 100, obtainedMarks: 25, evaluator: 'Dr. Clark' }, // Flagged - very low
//           ]
//         },
//         {
//           id: 'S005',
//           name: 'Alex Martinez',
//           rollNumber: '2023CS005',
//           subjects: [
//             { code: 'CS201', name: 'Data Structures', maxMarks: 100, obtainedMarks: 71, evaluator: 'Dr. Wilson' },
//             { code: 'CS202', name: 'Algorithms', maxMarks: 100, obtainedMarks: 76, evaluator: 'Dr. Brown' },
//             { code: 'CS203', name: 'Database Systems', maxMarks: 100, obtainedMarks: 68, evaluator: 'Dr. Davis' },
//             { code: 'CS204', name: 'Operating Systems', maxMarks: 100, obtainedMarks: 72, evaluator: 'Dr. Johnson' },
//             { code: 'CS205', name: 'Computer Networks', maxMarks: 100, obtainedMarks: 65, evaluator: 'Dr. Miller' },
//             { code: 'CS206', name: 'Web Development', maxMarks: 100, obtainedMarks: 69, evaluator: 'Dr. Clark' },
//           ]
//         },
//       ]);
//       setLoading(false);
//     }, 800);
//   }, [selectedCourse]);

//   // Filter students based on search term
//   const filteredStudents = students.filter(student => 
//     student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Check if a subject should be flagged for moderation
//   const shouldFlagSubject = (subject, allSubjects) => {
//     if (!subject || !allSubjects || allSubjects.length === 0) return false;
    
//     // Calculate average score across all subjects
//     const totalScore = allSubjects.reduce((sum, s) => sum + (s.obtainedMarks / s.maxMarks) * 100, 0);
//     const averageScore = totalScore / allSubjects.length;
    
//     // Calculate this subject's percentage
//     const subjectPercentage = (subject.obtainedMarks / subject.maxMarks) * 100;
    
//     // Flag if the difference exceeds the threshold (both positive and negative)
//     const difference = Math.abs(subjectPercentage - averageScore);
//     return difference > flagThreshold;
//   };

//   // Calculate overall result for a student
//   const calculateOverall = (subjects) => {
//     if (!subjects || subjects.length === 0) return { percentage: 0, total: 0, obtained: 0 };
    
//     const total = subjects.reduce((sum, subject) => sum + subject.maxMarks, 0);
//     const obtained = subjects.reduce((sum, subject) => sum + subject.obtainedMarks, 0);
//     const percentage = ((obtained / total) * 100).toFixed(2);
    
//     return { percentage, total, obtained };
//   };

//   // Flag a subject for moderation
//   const handleFlagForModeration = (studentId, subjectCode) => {
//     // In a real implementation, you would call an API to flag this for moderation
//     alert(`Flagged ${subjectCode} for student ${studentId} for moderation review`);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-800">Student Results</h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Review student results and flag discrepancies for moderation
//         </p>
//       </div>
      
//       {/* Filters Section */}
//       <div className="p-6 border-b border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Session Selector */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Session/Year</label>
//             <select
//               value={selectedSession}
//               onChange={(e) => setSelectedSession(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             >
//               <option value="">Select Session</option>
//               {sessions.map(session => (
//                 <option key={session} value={session}>{session}</option>
//               ))}
//             </select>
//           </div>
          
//           {/* Course Selector */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
//             <select
//               value={selectedCourse}
//               onChange={(e) => setSelectedCourse(e.target.value)}
//               disabled={!selectedSession || loading}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
//             >
//               <option value="">Select Course</option>
//               {courses.map(course => (
//                 <option key={course.id} value={course.id}>{course.name}</option>
//               ))}
//             </select>
//           </div>
          
//           {/* Search */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by name or roll number"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 disabled={!selectedCourse}
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
//               />
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//             </div>
//           </div>
          
//           {/* Flag Threshold */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Flag Threshold (%)</label>
//             <input
//               type="number"
//               value={flagThreshold}
//               onChange={(e) => setFlagThreshold(Number(e.target.value))}
//               min={5}
//               max={50}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Flag subjects if they differ by more than this percentage from the student's average
//             </p>
//           </div>
//         </div>
//       </div>
      
//       {/* Content */}
//       <div className="p-6">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : !selectedSession ? (
//           <div className="text-center p-8 text-gray-500">
//             <p>Please select a session to view results</p>
//           </div>
//         ) : !selectedCourse ? (
//           <div className="text-center p-8 text-gray-500">
//             <p>Please select a course to view student results</p>
//           </div>
//         ) : filteredStudents.length === 0 ? (
//           <div className="text-center p-8 text-gray-500">
//             <p>No students found for the selected criteria</p>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {filteredStudents.map(student => {
//               const overall = calculateOverall(student.subjects);
              
//               return (
//                 <div key={student.id} className="border border-gray-200 rounded-lg overflow-hidden">
//                   {/* Student Header */}
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
//                       <p className="text-sm text-gray-600">Roll Number: {student.rollNumber}</p>
//                     </div>
//                     <div className="mt-2 sm:mt-0 flex items-center text-sm font-medium">
//                       <span className="text-gray-600 mr-2">Overall:</span>
//                       <span className={`font-semibold ${
//                         overall.percentage >= 80 ? 'text-green-600' : 
//                         overall.percentage >= 60 ? 'text-blue-600' : 
//                         overall.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
//                       }`}>
//                         {overall.percentage}%
//                       </span>
//                       <span className="text-gray-400 ml-2">
//                         ({overall.obtained}/{overall.total})
//                       </span>
//                     </div>
//                   </div>
                  
//                   {/* Subject Table */}
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Subject Code
//                           </th>
//                           <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Subject
//                           </th>
//                           <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Evaluator
//                           </th>
//                           <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Marks
//                           </th>
//                           <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Percentage
//                           </th>
//                           <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {student.subjects.map(subject => {
//                           const percentage = (subject.obtainedMarks / subject.maxMarks) * 100;
//                           const isFlagged = shouldFlagSubject(subject, student.subjects);
                          
//                           return (
//                             <tr key={subject.code} className={isFlagged ? "bg-red-50" : ""}>
//                               <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                                 {subject.code}
//                               </td>
//                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                                 {subject.name}
//                               </td>
//                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                                 {subject.evaluator}
//                               </td>
//                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                                 {subject.obtainedMarks}/{subject.maxMarks}
//                               </td>
//                               <td className="px-4 py-3 whitespace-nowrap">
//                                 <div className="flex items-center">
//                                   <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
//                                     <div 
//                                       className={`h-2.5 rounded-full ${
//                                         percentage >= 80 ? 'bg-green-600' : 
//                                         percentage >= 60 ? 'bg-blue-600' : 
//                                         percentage >= 40 ? 'bg-yellow-600' : 'bg-red-600'
//                                       }`} 
//                                       style={{ width: `${percentage}%` }}
//                                     ></div>
//                                   </div>
//                                   <span className={`text-xs font-medium ${
//                                     percentage >= 80 ? 'text-green-600' : 
//                                     percentage >= 60 ? 'text-blue-600' : 
//                                     percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
//                                   }`}>
//                                     {percentage.toFixed(1)}%
//                                   </span>
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
//                                 {isFlagged ? (
//                                   <button 
//                                     onClick={() => handleFlagForModeration(student.id, subject.code)}
//                                     className="text-red-600 hover:text-red-900 bg-white border border-red-300 rounded-md px-2 py-1 text-xs shadow-sm"
//                                   >
//                                     Flag for Moderation
//                                   </button>
//                                 ) : (
//                                   <button 
//                                     onClick={() => handleFlagForModeration(student.id, subject.code)}
//                                     className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-2 py-1 text-xs"
//                                   >
//                                     Request Review
//                                   </button>
//                                 )}
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default StudentResults;




//?V2.. More Versatile and future ready

// import React, { useState, useEffect, useMemo } from 'react';
// import { Search, FilterList, KeyboardArrowDown, KeyboardArrowUp, Flag, RemoveRedEye } from '@mui/icons-material';

// function StudentResults() {
//   // Core state
//   const [loading, setLoading] = useState(false);
//   const [sessions, setSessions] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
  
//   // Selection state
//   const [selectedSession, setSelectedSession] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [flagThreshold, setFlagThreshold] = useState(30);
  
//   // UI state for pagination and view control
//   const [currentPage, setCurrentPage] = useState(1);
//   const [studentsPerPage, setStudentsPerPage] = useState(10);
//   const [expandedStudent, setExpandedStudent] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
//   const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
//   const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // // Fetch sessions - replace with API call
  // useEffect(() => {
  //   setSessions(['2024-2025', '2023-2024', '2022-2023']);
  // }, []);

  // // Fetch courses when session changes
  // useEffect(() => {
  //   if (!selectedSession) return;
    
  //   setLoading(true);
  //   setCourses([]);
  //   setStudents([]);
  //   setSelectedCourse('');
  //   setCurrentPage(1);
  //   setExpandedStudent(null);
    
  //   // Simulate API call - replace with actual API
  //   setTimeout(() => {
  //     setCourses([
  //       { id: 'CS101', name: 'Bachelor of Computer Science' },
  //       { id: 'EE101', name: 'Bachelor of Electrical Engineering' },
  //       { id: 'ME101', name: 'Bachelor of Mechanical Engineering' },
  //       { id: 'CE101', name: 'Bachelor of Civil Engineering' },
  //     ]);
  //     setLoading(false);
  //   }, 600);
  // }, [selectedSession]);

  // // Fetch students when course changes
  // useEffect(() => {
  //   if (!selectedCourse) return;
    
  //   setLoading(true);
  //   setStudents([]);
  //   setCurrentPage(1);
  //   setExpandedStudent(null);
    
  //   // In a real implementation, you would fetch from API
  //   // api.getStudentResults(selectedSession, selectedCourse)
  //   //   .then(data => {
  //   //     setStudents(data);
  //   //     setLoading(false);
  //   //   })
  //   //   .catch(error => {
  //   //     console.error('Error fetching student data:', error);
  //   //     setLoading(false);
  //   //   });

  //   // Simulate API call with mock data
  //   setTimeout(() => {
  //     // Generate 60 students for realistic volume
  //     const mockStudents = [];
  //     for (let i = 1; i <= 60; i++) {
  //       const studentId = `S${i.toString().padStart(3, '0')}`;
        
  //       // Create some variation in marks to test flagging logic
  //       const baseMarks = Math.floor(Math.random() * 30) + 50; // Base score between 50-80
        
  //       // Create subject data with some random variation
  //       const subjects = [
  //         { code: 'CS201', name: 'Data Structures', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Wilson' },
  //         { code: 'CS202', name: 'Algorithms', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Brown' },
  //         { code: 'CS203', name: 'Database Systems', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Davis' },
  //         { code: 'CS204', name: 'Operating Systems', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Johnson' },
  //         { code: 'CS205', name: 'Computer Networks', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Miller' },
  //         { code: 'CS206', name: 'Web Development', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Clark' },
  //       ];
        
  //       // Create outlier scores for some students to test flagging
  //       if (i % 7 === 0) {
  //         subjects[Math.floor(Math.random() * subjects.length)].obtainedMarks = Math.floor(Math.random() * 30) + 10; // Very low score
  //       }
  //       if (i % 13 === 0) {
  //         subjects[Math.floor(Math.random() * subjects.length)].obtainedMarks = Math.floor(Math.random() * 10) + 90; // Very high score
  //       }
        
  //       mockStudents.push({
  //         id: studentId,
  //         name: `Student ${i}`,
  //         rollNumber: `2023CS${i.toString().padStart(3, '0')}`,
  //         subjects
  //       });
  //     }
      
  //     setStudents(mockStudents);
  //     setLoading(false);
  //   }, 800);
  // }, [selectedCourse]);

  // // HELPER FUNCTIONS
  
  // // Calculate if a subject should be flagged based on deviation from average
  // const shouldFlagSubject = (subject, allSubjects) => {
  //   if (!subject || !allSubjects || allSubjects.length === 0) return false;
    
  //   // Calculate average percentage across all subjects
  //   const totalScore = allSubjects.reduce((sum, s) => sum + (s.obtainedMarks / s.maxMarks) * 100, 0);
  //   const averageScore = totalScore / allSubjects.length;
    
  //   // Calculate this subject's percentage
  //   const subjectPercentage = (subject.obtainedMarks / subject.maxMarks) * 100;
    
  //   // Flag if the difference exceeds the threshold
  //   const difference = Math.abs(subjectPercentage - averageScore);
  //   return difference > flagThreshold;
  // };

  // // Calculate overall statistics for a student
  // const calculateOverall = (subjects) => {
  //   if (!subjects || subjects.length === 0) return { percentage: 0, total: 0, obtained: 0 };
    
  //   const total = subjects.reduce((sum, subject) => sum + subject.maxMarks, 0);
  //   const obtained = subjects.reduce((sum, subject) => sum + subject.obtainedMarks, 0);
  //   const percentage = ((obtained / total) * 100).toFixed(2);
    
  //   return { percentage, total, obtained };
  // };

  // // Check if a student has any flagged subjects
  // const hasAnyFlaggedSubject = (student) => {
  //   if (!student || !student.subjects) return false;
  //   return student.subjects.some(subject => shouldFlagSubject(subject, student.subjects));
  // };

  // // Count flagged subjects for a student
  // const countFlaggedSubjects = (student) => {
  //   if (!student || !student.subjects) return 0;
  //   return student.subjects.filter(subject => shouldFlagSubject(subject, student.subjects)).length;
  // };

  // // Flag a subject for moderation
  // const handleFlagForModeration = (studentId, subjectCode) => {
  //   // In a real implementation, call API to flag for moderation
  //   // api.flagForModeration(studentId, subjectCode)
  //   //   .then(response => {
  //   //     // Handle success
  //   //   })
  //   //   .catch(error => {
  //   //     // Handle error
  //   //   });
    
  //   alert(`Flagged ${subjectCode} for student ${studentId} for moderation review`);
  // };

  // // Toggle student details expansion
  // const toggleStudentExpansion = (studentId) => {
  //   setExpandedStudent(expandedStudent === studentId ? null : studentId);
  // };

  // // FILTERED AND SORTED DATA
  
  // // Filter, sort and paginate students - using useMemo for performance
  // const processedStudents = useMemo(() => {
  //   // First, filter based on search term
  //   let result = students.filter(student => 
  //     student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
    
  //   // Filter to show only flagged if selected
  //   if (showFlaggedOnly) {
  //     result = result.filter(student => hasAnyFlaggedSubject(student));
  //   }
    
  //   // Sort students based on current sort configuration
  //   if (sortConfig.key) {
  //     result.sort((a, b) => {
  //       let aValue, bValue;
        
  //       // Handle different sort keys
  //       if (sortConfig.key === 'name' || sortConfig.key === 'rollNumber') {
  //         aValue = a[sortConfig.key].toLowerCase();
  //         bValue = b[sortConfig.key].toLowerCase();
  //       } else if (sortConfig.key === 'overall') {
  //         aValue = parseFloat(calculateOverall(a.subjects).percentage);
  //         bValue = parseFloat(calculateOverall(b.subjects).percentage);
  //       } else if (sortConfig.key === 'flagged') {
  //         aValue = countFlaggedSubjects(a);
  //         bValue = countFlaggedSubjects(b);
  //       }
        
  //       // Determine sort direction
  //       if (aValue < bValue) {
  //         return sortConfig.direction === 'ascending' ? -1 : 1;
  //       }
  //       if (aValue > bValue) {
  //         return sortConfig.direction === 'ascending' ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }
    
  //   return result;
  // }, [students, searchTerm, sortConfig, showFlaggedOnly, flagThreshold]);
  
  // // Calculate pagination
  // const totalPages = Math.ceil(processedStudents.length / studentsPerPage);
  // const currentStudents = useMemo(() => {
  //   const startIndex = (currentPage - 1) * studentsPerPage;
  //   return processedStudents.slice(startIndex, startIndex + studentsPerPage);
  // }, [processedStudents, currentPage, studentsPerPage]);

  // // Handle sorting by column
  // const requestSort = (key) => {
  //   let direction = 'ascending';
  //   if (sortConfig.key === key && sortConfig.direction === 'ascending') {
  //     direction = 'descending';
  //   }
  //   setSortConfig({ key, direction });
  // };

  // // Get the sort direction indicator
  // const getSortDirectionIndicator = (key) => {
  //   if (sortConfig.key !== key) return null;
  //   return sortConfig.direction === 'ascending' 
  //     ? <KeyboardArrowUp fontSize="small" className="text-blue-500" />
  //     : <KeyboardArrowDown fontSize="small" className="text-blue-500" />;
  // };

//   return (
//     <div className="bg-white rounded-lg shadow h-full flex flex-col">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">Student Results Analysis</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Review student performance and identify potential evaluation discrepancies
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <button 
//             onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
//             className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <FilterList />
//           </button>
//         </div>
//       </div>
      
//       {/* Filters Section */}
//       <div className={`transition-all duration-300 overflow-hidden border-b border-gray-200 ${filterDrawerOpen ? 'max-h-96' : 'max-h-0 border-b-0'}`}>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Session Selector */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Session/Year</label>
//               <select
//                 value={selectedSession}
//                 onChange={(e) => setSelectedSession(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">Select Session</option>
//                 {sessions.map(session => (
//                   <option key={session} value={session}>{session}</option>
//                 ))}
//               </select>
//             </div>
            
//             {/* Course Selector */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
//               <select
//                 value={selectedCourse}
//                 onChange={(e) => setSelectedCourse(e.target.value)}
//                 disabled={!selectedSession || loading}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
//               >
//                 <option value="">Select Course</option>
//                 {courses.map(course => (
//                   <option key={course.id} value={course.id}>{course.name}</option>
//                 ))}
//               </select>
//             </div>
            
//             {/* Flag Threshold */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Flag Threshold (%)</label>
//               <input
//                 type="number"
//                 value={flagThreshold}
//                 onChange={(e) => setFlagThreshold(Number(e.target.value))}
//                 min={5}
//                 max={50}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Flag if deviation exceeds this % from student's average
//               </p>
//             </div>
            
//             {/* Results per page */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Results per page</label>
//               <select
//                 value={studentsPerPage}
//                 onChange={(e) => {
//                   setStudentsPerPage(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value={10}>10</option>
//                 <option value={20}>20</option>
//                 <option value={50}>50</option>
//                 <option value={100}>100</option>
//               </select>
//             </div>
//           </div>
          
//           <div className="mt-4 flex flex-wrap items-center gap-4">
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="showFlagged"
//                 checked={showFlaggedOnly}
//                 onChange={() => setShowFlaggedOnly(!showFlaggedOnly)}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label htmlFor="showFlagged" className="ml-2 text-sm text-gray-700">
//                 Show only students with flagged subjects
//               </label>
//             </div>
            
//             <button
//               onClick={() => {
//                 setSearchTerm('');
//                 setShowFlaggedOnly(false);
//                 setSortConfig({ key: 'name', direction: 'ascending' });
//                 setFlagThreshold(30);
//               }}
//               className="text-sm text-blue-600 hover:text-blue-800"
//             >
//               Reset filters
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Search Bar - Always visible for quick filtering */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search by name or roll number..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1); // Reset to first page on search
//             }}
//             disabled={!selectedCourse}
//             className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
//           />
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Search className="h-5 w-5 text-gray-400" />
//           </div>
//         </div>
//       </div>
      
//       {/* Results Content - Flex grow to take available space */}
//       <div className="flex-grow overflow-auto">
//         {loading ? (
//           <div className="flex flex-col justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
//             <span className="text-gray-500">Loading results...</span>
//           </div>
//         ) : !selectedSession ? (
//           <div className="flex flex-col justify-center items-center h-64 text-gray-500">
//             <span className="mb-2">Please select a session and course</span>
//             <span className="text-sm">Start by choosing an academic year from the dropdown</span>
//           </div>
//         ) : !selectedCourse ? (
//           <div className="flex flex-col justify-center items-center h-64 text-gray-500">
//             <span className="mb-2">Please select a course</span>
//             <span className="text-sm">Choose a course to view student results</span>
//           </div>
//         ) : processedStudents.length === 0 ? (
//           <div className="flex flex-col justify-center items-center h-64 text-gray-500">
//             <span className="mb-2">No students found</span>
//             <span className="text-sm">Try adjusting your search or filters</span>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50 sticky top-0 z-10">
//                 <tr>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button 
//                       className="flex items-center focus:outline-none" 
//                       onClick={() => requestSort('rollNumber')}
//                     >
//                       Roll No.
//                       {getSortDirectionIndicator('rollNumber')}
//                     </button>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button 
//                       className="flex items-center focus:outline-none" 
//                       onClick={() => requestSort('name')}
//                     >
//                       Name
//                       {getSortDirectionIndicator('name')}
//                     </button>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button 
//                       className="flex items-center focus:outline-none" 
//                       onClick={() => requestSort('overall')}
//                     >
//                       Overall
//                       {getSortDirectionIndicator('overall')}
//                     </button>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button 
//                       className="flex items-center focus:outline-none" 
//                       onClick={() => requestSort('flagged')}
//                     >
//                       Flagged
//                       {getSortDirectionIndicator('flagged')}
//                     </button>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentStudents.map(student => {
//                   const overall = calculateOverall(student.subjects);
//                   const flaggedCount = countFlaggedSubjects(student);
//                   const hasFlagged = flaggedCount > 0;
                  
//                   return (
//                     <React.Fragment key={student.id}>
//                       {/* Student Summary Row */}
//                       <tr className={`${hasFlagged ? 'bg-red-50' : ''} hover:bg-gray-50`}>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {student.rollNumber}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
//                           {student.name}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
//                               <div 
//                                 className={`h-1.5 rounded-full ${
//                                   overall.percentage >= 80 ? 'bg-green-600' : 
//                                   overall.percentage >= 60 ? 'bg-blue-600' : 
//                                   overall.percentage >= 40 ? 'bg-yellow-600' : 'bg-red-600'
//                                 }`} 
//                                 style={{ width: `${overall.percentage}%` }}
//                               ></div>
//                             </div>
//                             <span className={`text-xs font-medium ${
//                               overall.percentage >= 80 ? 'text-green-600' : 
//                               overall.percentage >= 60 ? 'text-blue-600' : 
//                               overall.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
//                             }`}>
//                               {overall.percentage}%
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm">
//                           {flaggedCount > 0 ? (
//                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
//                               <Flag fontSize="small" className="h-3 w-3 mr-1" />
//                               {flaggedCount} {flaggedCount === 1 ? 'subject' : 'subjects'}
//                             </span>
//                           ) : (
//                             <span className="text-gray-500">No flags</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
//                           <button
//                             onClick={() => toggleStudentExpansion(student.id)}
//                             className="text-blue-600 hover:text-blue-900 inline-flex items-center"
//                           >
//                             <RemoveRedEye fontSize="small" className="h-4 w-4 mr-1" />
//                             {expandedStudent === student.id ? 'Hide Details' : 'View Details'}
//                           </button>
//                         </td>
//                       </tr>
                      
//                       {/* Expanded Details Panel */}
//                       {expandedStudent === student.id && (
//                         <tr>
//                           <td colSpan={5} className="px-4 py-2 bg-gray-50">
//                             <div className="rounded-md overflow-hidden border border-gray-200">
//                               <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-100">
//                                   <tr>
//                                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Subject Code
//                                     </th>
//                                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Subject Name
//                                     </th>
//                                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Evaluator
//                                     </th>
//                                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Marks
//                                     </th>
//                                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Actions
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {student.subjects.map((subject, index) => {
//                                     const percentage = (subject.obtainedMarks / subject.maxMarks) * 100;
//                                     const isFlagged = shouldFlagSubject(subject, student.subjects);
                                    
//                                     return (
//                                       <tr key={subject.code} className={`${isFlagged ? 'bg-red-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}`}>
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
//                                           {subject.code}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
//                                           {subject.name}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
//                                           {subject.evaluator}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap">
//                                           <div className="flex items-center">
//                                             <span className="text-xs mr-2">
//                                               {subject.obtainedMarks}/{subject.maxMarks}
//                                             </span>
//                                             <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-1">
//                                               <div 
//                                                 className={`h-1.5 rounded-full ${
//                                                   percentage >= 80 ? 'bg-green-600' : 
//                                                   percentage >= 60 ? 'bg-blue-600' : 
//                                                   percentage >= 40 ? 'bg-yellow-600' : 'bg-red-600'
//                                                 }`} 
//                                                 style={{ width: `${percentage}%` }}
//                                               ></div>
//                                             </div>
//                                             <span className={`text-xs font-medium ${
//                                               percentage >= 80 ? 'text-green-600' : 
//                                               percentage >= 60 ? 'text-blue-600' : 
//                                               percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
//                                             }`}>
//                                               {percentage.toFixed(1)}%
//                                             </span>
//                                           </div>
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs">
//                                           <button 
//                                             onClick={() => handleFlagForModeration(student.id, subject.code)}
//                                             className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
//                                               isFlagged 
//                                                 ? 'bg-red-100 text-red-800 hover:bg-red-200' 
//                                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                             }`}
//                                           >
//                                             <Flag fontSize="small" className="h-3 w-3 mr-1" />
//                                             {isFlagged ? 'Flag for Moderation' : 'Request Review'}
//                                           </button>
//                                         </td>
//                                       </tr>
//                                     );
//                                   })}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
      
//       {/* Pagination Footer */}
//       {processedStudents.length > 0 && (
//         <div className="px-6 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between bg-white">
//           <div className="text-sm text-gray-500">
//             Showing <span className="font-medium">{currentStudents.length}</span> of <span className="font-medium">{processedStudents.length}</span> results
//             {showFlaggedOnly && (
//               <span className="ml-1">(filtered to show {processedStudents.length} students with flagged subjects)</span>
//             )}
//           </div>
          
//           <div className="flex mt-2 sm:mt-0">
//             <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//               <button
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <span className="sr-only">Previous</span>
//                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                   <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//               </button>
              
//               {/* Page numbers - show limited range around current page */}
//               {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
//                 // Calculate which page numbers to show
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   // Show all pages if 5 or fewer
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   // Near the start
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   // Near the end
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   // In the middle
//                   pageNum = currentPage - 2 + i;
//                 }
                
//                 // Only render if pageNum is valid
//                 if (pageNum > 0 && pageNum <= totalPages) {
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => setCurrentPage(pageNum)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                         currentPage === pageNum
//                           ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                       }`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 }
//                 return null;
//               })}
              
//               <button
//                 onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                 disabled={currentPage === totalPages}
//                 className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <span className="sr-only">Next</span>
//                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                   <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                 </svg>
//               </button>
//             </nav>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StudentResults;

//?v3 Update minor fixes of ui

// import React, { useState, useEffect, useMemo } from 'react';
// import { Search, FilterList, KeyboardArrowDown, KeyboardArrowUp, Flag, RemoveRedEye, Close } from '@mui/icons-material';

// function StudentResults() {
//   // Core state
//   const [loading, setLoading] = useState(false);
//   const [sessions, setSessions] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
  
//   // Selection state
//   const [selectedSession, setSelectedSession] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [flagThreshold, setFlagThreshold] = useState(30);
  
//   // UI state for pagination and view control
//   const [currentPage, setCurrentPage] = useState(1);
//   const [studentsPerPage, setStudentsPerPage] = useState(10);
//   const [expandedStudent, setExpandedStudent] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
//   const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
//   const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

//   // Fetch sessions - replace with API call
//   useEffect(() => {
//     setSessions(['2024-2025', '2023-2024', '2022-2023']);
//   }, []);

//   // Fetch courses when session changes
//   useEffect(() => {
//     if (!selectedSession) return;
    
//     setLoading(true);
//     setCourses([]);
//     setStudents([]);
//     setSelectedCourse('');
//     setCurrentPage(1);
//     setExpandedStudent(null);
    
//     // Simulate API call - replace with actual API
//     setTimeout(() => {
//       setCourses([
//         { id: 'CS101', name: 'Bachelor of Computer Science' },
//         { id: 'EE101', name: 'Bachelor of Electrical Engineering' },
//         { id: 'ME101', name: 'Bachelor of Mechanical Engineering' },
//         { id: 'CE101', name: 'Bachelor of Civil Engineering' },
//       ]);
//       setLoading(false);
//     }, 600);
//   }, [selectedSession]);

//   // Fetch students when course changes
//   useEffect(() => {
//     if (!selectedCourse) return;
    
//     setLoading(true);
//     setStudents([]);
//     setCurrentPage(1);
//     setExpandedStudent(null);
    
//     // In a real implementation, you would fetch from API
//     // api.getStudentResults(selectedSession, selectedCourse)
//     //   .then(data => {
//     //     setStudents(data);
//     //     setLoading(false);
//     //   })
//     //   .catch(error => {
//     //     console.error('Error fetching student data:', error);
//     //     setLoading(false);
//     //   });

//     // Simulate API call with mock data
//     setTimeout(() => {
//       // Generate 60 students for realistic volume
//       const mockStudents = [];
//       for (let i = 1; i <= 60; i++) {
//         const studentId = `S${i.toString().padStart(3, '0')}`;
        
//         // Create some variation in marks to test flagging logic
//         const baseMarks = Math.floor(Math.random() * 30) + 50; // Base score between 50-80
        
//         // Create subject data with some random variation
//         const subjects = [
//           { code: 'CS201', name: 'Data Structures', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Wilson' },
//           { code: 'CS202', name: 'Algorithms', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Brown' },
//           { code: 'CS203', name: 'Database Systems', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Davis' },
//           { code: 'CS204', name: 'Operating Systems', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Johnson' },
//           { code: 'CS205', name: 'Computer Networks', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Miller' },
//           { code: 'CS206', name: 'Web Development', maxMarks: 100, obtainedMarks: baseMarks + Math.floor(Math.random() * 20), evaluator: 'Dr. Clark' },
//         ];
        
//         // Create outlier scores for some students to test flagging
//         if (i % 7 === 0) {
//           subjects[Math.floor(Math.random() * subjects.length)].obtainedMarks = Math.floor(Math.random() * 30) + 10; // Very low score
//         }
//         if (i % 13 === 0) {
//           subjects[Math.floor(Math.random() * subjects.length)].obtainedMarks = Math.floor(Math.random() * 10) + 90; // Very high score
//         }
        
//         mockStudents.push({
//           id: studentId,
//           name: `Student ${i}`,
//           rollNumber: `2023CS${i.toString().padStart(3, '0')}`,
//           subjects
//         });
//       }
      
//       setStudents(mockStudents);
//       setLoading(false);
//     }, 800);
//   }, [selectedCourse]);

//   // HELPER FUNCTIONS
  
//   // Calculate if a subject should be flagged based on deviation from average
//   const shouldFlagSubject = (subject, allSubjects) => {
//     if (!subject || !allSubjects || allSubjects.length === 0) return false;
    
//     // Calculate average percentage across all subjects
//     const totalScore = allSubjects.reduce((sum, s) => sum + (s.obtainedMarks / s.maxMarks) * 100, 0);
//     const averageScore = totalScore / allSubjects.length;
    
//     // Calculate this subject's percentage
//     const subjectPercentage = (subject.obtainedMarks / subject.maxMarks) * 100;
    
//     // Flag if the difference exceeds the threshold
//     const difference = Math.abs(subjectPercentage - averageScore);
//     return difference > flagThreshold;
//   };

//   // Calculate overall statistics for a student
//   const calculateOverall = (subjects) => {
//     if (!subjects || subjects.length === 0) return { percentage: 0, total: 0, obtained: 0 };
    
//     const total = subjects.reduce((sum, subject) => sum + subject.maxMarks, 0);
//     const obtained = subjects.reduce((sum, subject) => sum + subject.obtainedMarks, 0);
//     const percentage = ((obtained / total) * 100).toFixed(2);
    
//     return { percentage, total, obtained };
//   };

//   // Check if a student has any flagged subjects
//   const hasAnyFlaggedSubject = (student) => {
//     if (!student || !student.subjects) return false;
//     return student.subjects.some(subject => shouldFlagSubject(subject, student.subjects));
//   };

//   // Count flagged subjects for a student
//   const countFlaggedSubjects = (student) => {
//     if (!student || !student.subjects) return 0;
//     return student.subjects.filter(subject => shouldFlagSubject(subject, student.subjects)).length;
//   };

//   // Flag a subject for moderation
//   const handleFlagForModeration = (studentId, subjectCode) => {
//     // In a real implementation, call API to flag for moderation
//     // api.flagForModeration(studentId, subjectCode)
//     //   .then(response => {
//     //     // Handle success
//     //   })
//     //   .catch(error => {
//     //     // Handle error
//     //   });
    
//     alert(`Flagged ${subjectCode} for student ${studentId} for moderation review`);
//   };

//   // Toggle student details expansion
//   const toggleStudentExpansion = (studentId) => {
//     setExpandedStudent(expandedStudent === studentId ? null : studentId);
//   };

//   // FILTERED AND SORTED DATA
  
//   // Filter, sort and paginate students - using useMemo for performance
//   const processedStudents = useMemo(() => {
//     // First, filter based on search term
//     let result = students.filter(student => 
//       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
//     );
    
//     // Filter to show only flagged if selected
//     if (showFlaggedOnly) {
//       result = result.filter(student => hasAnyFlaggedSubject(student));
//     }
    
//     // Sort students based on current sort configuration
//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         let aValue, bValue;
        
//         // Handle different sort keys
//         if (sortConfig.key === 'name' || sortConfig.key === 'rollNumber') {
//           aValue = a[sortConfig.key].toLowerCase();
//           bValue = b[sortConfig.key].toLowerCase();
//         } else if (sortConfig.key === 'overall') {
//           aValue = parseFloat(calculateOverall(a.subjects).percentage);
//           bValue = parseFloat(calculateOverall(b.subjects).percentage);
//         } else if (sortConfig.key === 'flagged') {
//           aValue = countFlaggedSubjects(a);
//           bValue = countFlaggedSubjects(b);
//         }
        
//         // Determine sort direction
//         if (aValue < bValue) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
    
//     return result;
//   }, [students, searchTerm, sortConfig, showFlaggedOnly, flagThreshold]);
  
//   // Calculate pagination
//   const totalPages = Math.ceil(processedStudents.length / studentsPerPage);
//   const currentStudents = useMemo(() => {
//     const startIndex = (currentPage - 1) * studentsPerPage;
//     return processedStudents.slice(startIndex, startIndex + studentsPerPage);
//   }, [processedStudents, currentPage, studentsPerPage]);

//   // Handle sorting by column
//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Get the sort direction indicator
//   const getSortDirectionIndicator = (key) => {
//     if (sortConfig.key !== key) return null;
//     return sortConfig.direction === 'ascending' 
//       ? <KeyboardArrowUp fontSize="small" className="text-blue-500" />
//       : <KeyboardArrowDown fontSize="small" className="text-blue-500" />;
//   };

//   return (
//     <div className="bg-white rounded-lg shadow h-full flex flex-col relative">
//       {/* Header with improved filter toggle button */}
//       <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">Student Results Analysis</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Review student performance and identify potential evaluation discrepancies
//           </p>
//         </div>
//         <button 
//           onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
//           className={`inline-flex items-center px-3 py-2 border ${filterDrawerOpen ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'} rounded-md transition-colors`}
//         >
//           <FilterList className="h-5 w-5 mr-2" />
//           Filters
//           {filterDrawerOpen ? <KeyboardArrowUp className="ml-1" /> : <KeyboardArrowDown className="ml-1" />}
//         </button>
//       </div>
      
//       {/* Fixed position filter drawer */}
//       {filterDrawerOpen && (
//         <div className="absolute top-20 right-4 z-50 w-96 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
//           <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
//             <h3 className="font-medium text-gray-700">Filter Options</h3>
//             <button 
//               onClick={() => setFilterDrawerOpen(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <Close className="h-5 w-5" />
//             </button>
//           </div>
          
//           <div className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto">
//             <div className="space-y-4">
//               {/* Session Selector */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Session/Year</label>
//                 <select
//                   value={selectedSession}
//                   onChange={(e) => setSelectedSession(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 >
//                   <option value="">Select Session</option>
//                   {sessions.map(session => (
//                     <option key={session} value={session}>{session}</option>
//                   ))}
//                 </select>
//               </div>
              
//               {/* Course Selector */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
//                 <select
//                   value={selectedCourse}
//                   onChange={(e) => setSelectedCourse(e.target.value)}
//                   disabled={!selectedSession || loading}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
//                 >
//                   <option value="">Select Course</option>
//                   {courses.map(course => (
//                     <option key={course.id} value={course.id}>{course.name}</option>
//                   ))}
//                 </select>
//               </div>
              
//               {/* Flag Threshold */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Flag Threshold: <span className="font-bold">{flagThreshold}%</span>
//                 </label>
//                 <input
//                   type="range"
//                   value={flagThreshold}
//                   onChange={(e) => setFlagThreshold(Number(e.target.value))}
//                   min={5}
//                   max={50}
//                   step={5}
//                   className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Flag subjects that deviate more than {flagThreshold}% from student's average
//                 </p>
//               </div>
              
//               {/* Results per page */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Results per page</label>
//                 <div className="flex space-x-2">
//                   {[10, 20, 50, 100].map(size => (
//                     <button
//                       key={size}
//                       onClick={() => {
//                         setStudentsPerPage(size);
//                         setCurrentPage(1);
//                       }}
//                       className={`flex-1 py-1.5 text-sm rounded-md ${
//                         studentsPerPage === size
//                           ? 'bg-blue-50 text-blue-600 border border-blue-200'
//                           : 'bg-gray-50 text-gray-600 border border-gray-200'
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Flagged Only */}
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="showFlagged"
//                   checked={showFlaggedOnly}
//                   onChange={() => setShowFlaggedOnly(!showFlaggedOnly)}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="showFlagged" className="ml-2 text-sm text-gray-700">
//                   Show only students with flagged subjects
//                 </label>
//               </div>
//             </div>
            
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => {
//                   setSearchTerm('');
//                   setShowFlaggedOnly(false);
//                   setSortConfig({ key: 'name', direction: 'ascending' });
//                   setFlagThreshold(30);
//                   setStudentsPerPage(10);
//                 }}
//                 className="text-sm text-gray-600 hover:text-gray-800 mr-3"
//               >
//                 Reset All
//               </button>
//               <button
//                 onClick={() => setFilterDrawerOpen(false)}
//                 className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Search Bar - Always visible and fixed at the top */}
//       <div className="px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-20">
//         <div className="relative max-w-xl">
//           <input
//             type="text"
//             placeholder="Search by name or roll number..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1); // Reset to first page on search
//             }}
//             disabled={!selectedCourse}
//             className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
//           />
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Search className="h-5 w-5 text-gray-400" />
//           </div>
//         </div>
        
//         {/* Active filters summary */}
//         {(selectedSession || selectedCourse || showFlaggedOnly || searchTerm) && (
//           <div className="flex flex-wrap gap-2 mt-2">
//             {selectedSession && (
//               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
//                 Session: {selectedSession}
//               </span>
//             )}
//             {selectedCourse && (
//               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
//                 Course: {courses.find(c => c.id === selectedCourse)?.name || selectedCourse}
//               </span>
//             )}
//             {showFlaggedOnly && (
//               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-800">
//                 <Flag fontSize="small" className="h-3 w-3 mr-1" />
//                 Flagged Only
//               </span>
//             )}
//             {searchTerm && (
//               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
//                 Search: "{searchTerm}"
//               </span>
//             )}
//           </div>
//         )}
//       </div>
      
//       {/* Results Content - Flex grow to take available space */}
//       <div className="flex-grow overflow-auto">
//         {loading ? (
//           <div className="flex flex-col justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
//             <span className="text-gray-500">Loading results...</span>
//           </div>
//         ) : !selectedSession || !selectedCourse ? (
//           <div className="flex flex-col justify-center items-center h-64 text-gray-500">
//             <span className="mb-2">Please select session and course</span>
//             <button
//               onClick={() => setFilterDrawerOpen(true)}
//               className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100"
//             >
//               Open Filters
//             </button>
//           </div>
//         ) : processedStudents.length === 0 ? (
//           <div className="flex flex-col justify-center items-center h-64 text-gray-500">
//             <span className="mb-2">No students found</span>
//             <span className="text-sm">Try adjusting your search or filters</span>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50 sticky top-0 z-10">
//                 <tr>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button 
//                       className="flex items-center focus:outline-none" 
//                       onClick={() => requestSort('rollNumber')}
//                     >
//                       Roll No.
//                       {getSortDirectionIndicator('rollNumber')}
//                     </button>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button 
//                       className="flex items-center focus:outline-none" 
//                       onClick={() => requestSort('name')}
//                     >
//                       Name
//                       {getSortDirectionIndicator('name')}
//                     </button>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button 
//                       className="flex items-center focus:outline-none" 
//                       onClick={() => requestSort('overall')}
//                     >
//                       Overall
//                       {getSortDirectionIndicator('overall')}
//                     </button>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button 
//                       className="flex items-center focus:outline-none" 
//                       onClick={() => requestSort('flagged')}
//                     >
//                       Flagged
//                       {getSortDirectionIndicator('flagged')}
//                     </button>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentStudents.map(student => {
//                   const overall = calculateOverall(student.subjects);
//                   const flaggedCount = countFlaggedSubjects(student);
//                   const hasFlagged = flaggedCount > 0;
                  
//                   return (
//                     <React.Fragment key={student.id}>
//                       {/* Student Summary Row */}
//                       <tr className={`${hasFlagged ? 'bg-red-50' : ''} hover:bg-gray-50`}>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {student.rollNumber}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
//                           {student.name}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <span className="text-xs font-medium mr-2">
//                               {overall.percentage}%
//                             </span>
//                             <div className="w-16 bg-gray-200 rounded-full h-1.5">
//                               <div 
//                                 className={`h-1.5 rounded-full ${
//                                   overall.percentage >= 80 ? 'bg-green-600' : 
//                                   overall.percentage >= 60 ? 'bg-blue-600' : 
//                                   overall.percentage >= 40 ? 'bg-yellow-600' : 'bg-red-600'
//                                 }`} 
//                                 style={{ width: `${overall.percentage}%` }}
//                               ></div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm">
//                           {flaggedCount > 0 ? (
//                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
//                               <Flag fontSize="small" className="h-3 w-3 mr-1" />
//                               {flaggedCount} {flaggedCount === 1 ? 'subject' : 'subjects'}
//                             </span>
//                           ) : (
//                             <span className="text-gray-500">No flags</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
//                           <button
//                             onClick={() => toggleStudentExpansion(student.id)}
//                             className={`inline-flex items-center px-2 py-1 rounded text-xs ${
//                               expandedStudent === student.id
//                                 ? 'bg-blue-100 text-blue-800'
//                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                           >
//                             <RemoveRedEye fontSize="small" className="h-3.5 w-3.5 mr-1" />
//                             {expandedStudent === student.id ? 'Hide Details' : 'View Details'}
//                           </button>
//                         </td>
//                       </tr>
                      
//                       {/* Expanded Details Section */}
//                       {expandedStudent === student.id && (
//                         <tr>
//                           <td colSpan={5} className="px-4 py-2 bg-gray-50">
//                             <div className="rounded-md overflow-hidden border border-gray-200 mb-1">
//                               <div className="p-3 bg-white border-b border-gray-200 flex items-center justify-between">
//                                 <div>
//                                   <span className="text-sm font-medium text-gray-900 block">
//                                     {student.name} - {student.rollNumber}
//                                   </span>
//                                   <span className="text-xs text-gray-500">
//                                     Overall: {overall.percentage}% ({overall.obtained}/{overall.total})
//                                   </span>
//                                 </div>
//                                 <button
//                                   onClick={() => toggleStudentExpansion(null)}
//                                   className="text-gray-400 hover:text-gray-600"
//                                 >
//                                   <Close className="h-4 w-4" />
//                                 </button>
//                               </div>
//                               <div className="max-h-64 overflow-y-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                   <thead className="bg-gray-100 sticky top-0 z-10">
//                                     <tr>
//                                       <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Subject Code
//                                       </th>
//                                       <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Subject Name
//                                       </th>
//                                       <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Evaluator
//                                       </th>
//                                       <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Marks
//                                       </th>
//                                       <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Actions
//                                       </th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     {student.subjects.map((subject, index) => {
//                                       const percentage = (subject.obtainedMarks / subject.maxMarks) * 100;
//                                       const isFlagged = shouldFlagSubject(subject, student.subjects);
                                      
//                                       return (
//                                         <tr key={subject.code} className={`${isFlagged ? 'bg-red-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}`}>
//                                           <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
//                                             {subject.code}
//                                           </td>
//                                           <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
//                                             {subject.name}
//                                           </td>
//                                           <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
//                                             {subject.evaluator}
//                                           </td>
//                                           <td className="px-3 py-2 whitespace-nowrap">
//                                             <div className="flex items-center">
//                                               <span className="text-xs mr-2">
//                                                 {subject.obtainedMarks}/{subject.maxMarks}
//                                               </span>
//                                               <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-1">
//                                                 <div 
//                                                   className={`h-1.5 rounded-full ${
//                                                     percentage >= 80 ? 'bg-green-600' : 
//                                                     percentage >= 60 ? 'bg-blue-600' : 
//                                                     percentage >= 40 ? 'bg-yellow-600' : 'bg-red-600'
//                                                   }`} 
//                                                   style={{ width: `${percentage}%` }}
//                                                 ></div>
//                                               </div>
//                                               <span className={`text-xs font-medium ${
//                                                 percentage >= 80 ? 'text-green-600' : 
//                                                 percentage >= 60 ? 'text-blue-600' : 
//                                                 percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
//                                               }`}>
//                                                 {percentage.toFixed(1)}%
//                                               </span>
//                                             </div>
//                                           </td>
//                                           <td className="px-3 py-2 whitespace-nowrap text-xs">
//                                             <button 
//                                               onClick={() => handleFlagForModeration(student.id, subject.code)}
//                                               className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
//                                                 isFlagged 
//                                                   ? 'bg-red-100 text-red-800 hover:bg-red-200' 
//                                                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                               }`}
//                                             >
//                                               <Flag fontSize="small" className="h-3 w-3 mr-1" />
//                                               {isFlagged ? 'Flag for Moderation' : 'Request Review'}
//                                             </button>
//                                           </td>
//                                         </tr>
//                                       );
//                                     })}
//                                   </tbody>
//                                 </table>
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
      
//       {/* Pagination Footer */}
//       {processedStudents.length > 0 && (
//         <div className="px-6 py-3 border-t border-gray-200 bg-white sticky bottom-0 z-10">
//           <div className="flex flex-wrap items-center justify-between">
//             <div className="text-sm text-gray-500 mb-2 sm:mb-0">
//               Showing {(currentPage - 1) * studentsPerPage + 1}-
//               {Math.min(currentPage * studentsPerPage, processedStudents.length)} of {processedStudents.length} results
//             </div>
            
//             <div className="flex">
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span className="sr-only">Previous</span>
//                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                     <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </button>
                
//                 {/* Simplified page number display for better mobile experience */}
//                 <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium">
//                   {currentPage} / {totalPages}
//                 </button>
                
//                 <button
//                   onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                   disabled={currentPage === totalPages}
//                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span className="sr-only">Next</span>
//                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                     <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StudentResults;



