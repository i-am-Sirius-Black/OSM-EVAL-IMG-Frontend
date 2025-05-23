import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../../api/axios';

const ReevaluationAssignment = () => {
  // Form data and selections
  const [formData, setFormData] = useState({
    copyId: '',
    assignedEvaluatorId: ''
  });
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Data for dropdowns
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [evaluatedCopies, setEvaluatedCopies] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  
  // Selection states
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Load courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/exams');
        setCourses(response.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    
    // Load evaluators
    const fetchEvaluators = async () => {
      try {
        const response = await api.get('/api/admin/evaluators');
        setEvaluators(response.data || []);
      } catch (error) {
        console.error('Error fetching evaluators:', error);
        toast.error('Failed to load evaluators');
      }
    };
    
    // Call functions to load data
    fetchCourses();
    fetchEvaluators();
  }, []);

  // Load subjects when a course is selected
  useEffect(() => {
    if (!selectedCourse) {
      setSubjects([]);
      return;
    }
    
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/exams/${selectedCourse}/subjects`);
        setSubjects(response.data || []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, [selectedCourse]);

  // Load evaluated copies when a subject is selected
  useEffect(() => {
    if (!selectedSubject) {
      setEvaluatedCopies([]);
      return;
    }
    
    const fetchEvaluatedCopies = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/admin/checked-copies/${selectedSubject}`);
        setEvaluatedCopies(response.data.data.checkedCopies || []);
      } catch (error) {
        console.error('Error fetching evaluated copies:', error);
        toast.error('Failed to load evaluated copies');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvaluatedCopies();
  }, [selectedSubject]);

  // Handle course change
  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedSubject('');
    setFormData(prev => ({ ...prev, copyId: '' }));
  };

  // Handle subject change
  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setFormData(prev => ({ ...prev, copyId: '' }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.copyId || !formData.assignedEvaluatorId) {
      toast.error('Please select both a copy and an evaluator');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await api.post('/api/admin/assign-reevaluation', formData);
      
      if (response.data && response.data.message) {
        toast.success(response.data.message);
        
        // Reset form
        setFormData({
          copyId: '',
          assignedEvaluatorId: ''
        });
        setSelectedCourse('');
        setSelectedSubject('');
      }
    } catch (error) {
      console.error('Error assigning reevaluation:', error);
      const errorMsg = error.response?.data?.error || 'Failed to assign copy for reevaluation';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

return (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800">Re-evaluation Assignment</h2>
      <p className="mt-1 text-sm text-gray-500">
        Assign evaluated answer scripts for re-evaluation to evaluators
      </p>
    </div>

    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Course & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="course" className="block text-sm text-gray-700 mb-1">Course</label>
            <select
              id="course"
              value={selectedCourse}
              onChange={handleCourseChange}
              disabled={loading || submitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.courseId} value={course.courseId}>{course.courseName}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm text-gray-700 mb-1">Subject</label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={handleSubjectChange}
              disabled={!selectedCourse || loading || submitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.subjectId} value={subject.packingId}>{subject.subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Copy ID & Evaluator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="copyId" className="block text-sm text-gray-700 mb-1">Copy</label>
            <select
              id="copyId"
              name="copyId"
              value={formData.copyId}
              onChange={handleInputChange}
              disabled={!selectedSubject || loading || submitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a copy</option>
              {evaluatedCopies.map(copy => (
                <option key={copy.copyId} value={copy.copyId}>
                  {copy.copyId} - Evaluated by {copy.evaluatorName} ({copy.evaluatorId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="assignedEvaluatorId" className="block text-sm text-gray-700 mb-1">Evaluator</label>
            <select
              id="assignedEvaluatorId"
              name="assignedEvaluatorId"
              value={formData.assignedEvaluatorId}
              onChange={handleInputChange}
              disabled={!formData.copyId || loading || submitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select an evaluator</option>
              {evaluators.map(evaluator => (
                <option key={evaluator.uid} value={evaluator.uid}>
                  {evaluator.name} ({evaluator.uid})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || submitting || !formData.copyId || !formData.assignedEvaluatorId}
            className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Assigning...
              </span>
            ) : (
              'Assign for Re-evaluation'
            )}
          </button>
        </div>
      </form>
    </div>

    {/* Notes */}
    <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600 rounded-b-lg">
      <h4 className="font-medium text-gray-700 mb-1">Notes:</h4>
      <ul className="list-disc ml-5 space-y-1 text-xs">
        <li>Only evaluated copies can be re-assigned.</li>
        <li>Original evaluator cannot be re-assigned.</li>
        <li>Use re-evaluation for valid reasons only.</li>
      </ul>
    </div>
  </div>
);
};

export default ReevaluationAssignment;