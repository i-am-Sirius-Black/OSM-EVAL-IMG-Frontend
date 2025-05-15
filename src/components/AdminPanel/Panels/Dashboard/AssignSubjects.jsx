//* v4 (ui update, improved layout)

import React, { useState, useEffect } from 'react';
import API_ROUTES from '../../../../api/routes.js';
import api from '../../../../api/axios.js';
import EvaluatorSelector from '../Dashboard/AssignSubjectComponents/EvaluatorSelector.jsx';
import CopySelector from '../Dashboard/AssignSubjectComponents/CopySelector.jsx';

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