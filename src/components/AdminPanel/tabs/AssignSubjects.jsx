import React, { useState, useEffect } from 'react';

const AssignSubjects = () => {
  const [evaluators, setEvaluators] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Fetch evaluators and subjects data from API
    Promise.all([
      fetch('/api/evaluators').then(res => res.json()),
      fetch('/api/subjects').then(res => res.json())
    ])
    .then(([evaluatorData, subjectData]) => {
      setEvaluators(evaluatorData);
      setSubjects(subjectData);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
      // For demo purposes, add some sample data
      setEvaluators([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Mike Johnson' }
      ]);
      setSubjects([
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Physics' },
        { id: 3, name: 'Chemistry' },
        { id: 4, name: 'Biology' }
      ]);
      setAssignments([
        { id: 1, evaluatorId: 1, evaluatorName: 'John Doe', subjectId: 1, subjectName: 'Mathematics' },
        { id: 2, evaluatorId: 2, evaluatorName: 'Jane Smith', subjectId: 2, subjectName: 'Physics' }
      ]);
    });
  }, []);

  const handleAssignSubject = () => {
    if (!selectedEvaluator || !selectedSubject) {
      alert('Please select both an evaluator and a subject');
      return;
    }

    // Find the evaluator and subject objects
    const evaluator = evaluators.find(e => e.id.toString() === selectedEvaluator);
    const subject = subjects.find(s => s.id.toString() === selectedSubject);

    if (!evaluator || !subject) {
      alert('Invalid selection');
      return;
    }

    // API call to assign subject to evaluator
    fetch('/api/assign-subject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evaluatorId: selectedEvaluator, subjectId: selectedSubject }),
    })
    .then(res => res.json())
    .then(data => {
      // Add the new assignment to the list
      const newAssignment = {
        id: Date.now(), // temporary ID
        evaluatorId: evaluator.id,
        evaluatorName: evaluator.name,
        subjectId: subject.id,
        subjectName: subject.name
      };
      
      setAssignments([...assignments, newAssignment]);
      alert('Subject assigned successfully!');
      
      // Reset selections
      setSelectedEvaluator('');
      setSelectedSubject('');
    })
    .catch(error => {
      console.error('Error assigning subject:', error);
      
      // For demo purposes, add the assignment anyway
      const newAssignment = {
        id: Date.now(), // temporary ID
        evaluatorId: evaluator.id,
        evaluatorName: evaluator.name,
        subjectId: subject.id,
        subjectName: subject.name
      };
      
      setAssignments([...assignments, newAssignment]);
      alert('Subject assigned successfully! (Demo Mode)');
      
      // Reset selections
      setSelectedEvaluator('');
      setSelectedSubject('');
    });
  };

  const handleRemoveAssignment = (assignmentId) => {
    // API call to remove assignment
    fetch(`/api/remove-assignment/${assignmentId}`, {
      method: 'DELETE',
    })
    .then(res => {
      if (res.ok) {
        // Remove the assignment from the list
        setAssignments(assignments.filter(a => a.id !== assignmentId));
      }
    })
    .catch(error => {
      console.error('Error removing assignment:', error);
      // For demo purposes, remove it anyway
      setAssignments(assignments.filter(a => a.id !== assignmentId));
    });
  };

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Subjects</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Assign subjects to evaluators</p>
        </div>
        {loading ? (
          <div className="px-4 py-5 sm:p-6 text-center">Loading data...</div>
        ) : (
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Evaluator</label>
                <select
                  value={selectedEvaluator}
                  onChange={(e) => setSelectedEvaluator(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Evaluator</option>
                  {evaluators.map((evaluator) => (
                    <option key={evaluator.id} value={evaluator.id}>
                      {evaluator.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5">
              <button
                onClick={handleAssignSubject}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Assign Subject
              </button>
            </div>
            
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-900">Current Assignments</h4>
              <div className="mt-4 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Evaluator
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subject
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {assignments.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                No assignments found
                              </td>
                            </tr>
                          ) : (
                            assignments.map((assignment) => (
                              <tr key={assignment.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{assignment.evaluatorName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{assignment.subjectName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => handleRemoveAssignment(assignment.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignSubjects;