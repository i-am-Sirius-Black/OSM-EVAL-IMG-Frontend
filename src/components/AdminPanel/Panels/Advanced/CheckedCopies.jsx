

import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';
import API_ROUTES from '../../../../api/routes';
import formatDateTime from '../../../../utils/formattedDateTime';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const { COPIES, ADMIN } = API_ROUTES;

const CheckedCopies = () => {
  const [checkedCopies, setCheckedCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  // Filter states
  const [filterEvaluator, setFilterEvaluator] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterSession, setFilterSession] = useState('');
  
  // Filter options
  const [evaluators, setEvaluators] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Fetch checked copies from API
    const fetchCheckedCopies = async () => {
      try {
        setLoading(true);
        // Build query params for filters
        const queryParams = new URLSearchParams();
        if (filterEvaluator) queryParams.append('evaluatorId', filterEvaluator);
        if (filterCourse) queryParams.append('course', filterCourse);
        if (filterSubject) queryParams.append('subject', filterSubject);
        if (filterSession) queryParams.append('session', filterSession);
        
        const url = `${ADMIN.GET_EVALUATED_COPIES}?${queryParams.toString()}`;
        const response = await api.get(url);
        
        if (response.status === 200) {
          setCheckedCopies(response.data.copies);
          
          // Extract filter options
          if (response.data.filters) {
            setCourses(response.data.filters.courses || []);
            setSubjects(response.data.filters.subjects || []);
            
            // When extracting sessions from API response
            if (response.data.filters.sessions) {
              setSessions(response.data.filters.sessions);
            } else {
              // Create session options from the examDate of each copy
              const uniqueSessions = [...new Set(response.data.copies
                .filter(copy => copy.examDate)
                .map(copy => formatDateTime(copy.examDate, 'year'))
              )];
              setSessions(uniqueSessions);
            }
          }
          
          // Extract unique evaluator IDs for the filter dropdown
          const uniqueEvaluators = [...new Set(response.data.copies.map(copy => copy.evaluatorId))]
            .map(evalId => ({
              id: evalId,
              name: evalId // Using ID as name since we don't have actual names
            }));
          
          setEvaluators(uniqueEvaluators);
        } else {
          console.error('Failed to fetch checked copies');
        }
      } catch (error) {
        console.error('Error fetching checked copies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCheckedCopies();
  }, [filterEvaluator, filterCourse, filterSubject, filterSession]);

  const handleViewCopy = async (copyId) => {
    try {
      // Set a loading state for visual feedback
      const viewButton = document.getElementById(`view-btn-${copyId}`);
      if (viewButton) {
        viewButton.innerText = 'Loading...';
        viewButton.disabled = true;
      }
      
      // Use your API instance to ensure proper headers
      const response = await api.get(COPIES.DOWNLOAD_PDF(copyId), {
        responseType: 'blob',
        timeout: 60000,
      });
      
      // Create a blob URL for the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open the PDF in a new tab
      window.open(url, '_blank');
      
    } catch (error) {
      console.error('Error viewing PDF:', error);
      alert(`Failed to view the PDF for copy ${copyId}. Please try again.`);
    } finally {
      // Reset the button state
      const viewButton = document.getElementById(`view-btn-${copyId}`);
      if (viewButton) {
        viewButton.innerText = 'View';
        viewButton.disabled = false;
      }
    }
  };

  const handleDownloadCopy = async (copyId) => {
    try {
      // Set a loading state for visual feedback
      const downloadButton = document.getElementById(`download-btn-${copyId}`);
      if (downloadButton) {
        downloadButton.innerText = 'Generating...';
        downloadButton.disabled = true;
      }
      
      // Use your API instance to ensure proper headers
      const response = await api.get(COPIES.DOWNLOAD_PDF(copyId), {
        responseType: 'blob',
        timeout: 60000,
      });
      
      // Create a blob URL for the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link to trigger the download with the filename from the server
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Copy_${copyId}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert(`Failed to download the PDF for copy ${copyId}. Please try again.`);
    } finally {
      // Reset the button state
      const downloadButton = document.getElementById(`download-btn-${copyId}`);
      if (downloadButton) {
        downloadButton.innerText = 'Download';
        downloadButton.disabled = false;
      }
    }
  };

  // Download all visible/filtered copies
  const handleDownloadAllCopies = async () => {
    if (filteredCopies.length === 0) {
      alert('No copies to download.');
      return;
    }
    
    try {
      setDownloadingAll(true);
      setDownloadProgress(0);
      
      // Create a new JSZip instance
      const zip = new JSZip();
      
      // Determine folder name based on filters
      let folderName = 'Evaluated-Copies';
      if (filterSession) folderName = `${filterSession}`;
      if (filterCourse) folderName += `/${filterCourse}`;
      if (filterSubject) folderName += `/${filterSubject}`;
      
      // Create a folder in the zip
      const folder = zip.folder(folderName);
      
      // Download each copy and add to zip
      for (let i = 0; i < filteredCopies.length; i++) {
        const copy = filteredCopies[i];
        try {
          const response = await api.get(COPIES.DOWNLOAD_PDF(copy.copyId), {
            responseType: 'blob',
            timeout: 60000,
          });
          
          // Add the PDF to the zip folder
          folder.file(`Copy_${copy.copyId}.pdf`, response.data);
          
          // Update progress
          setDownloadProgress(Math.round(((i + 1) / filteredCopies.length) * 100));
        } catch (error) {
          console.error(`Error downloading copy ${copy.copyId}:`, error);
          // Continue with other copies
        }
      }
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Save the zip file
      saveAs(content, `${folderName.replace(/\//g, '-')}.zip`);
      
    } catch (error) {
      console.error('Error downloading all copies:', error);
      alert('Failed to download all copies. Please try again.');
    } finally {
      setDownloadingAll(false);
    }
  };

const filteredCopies = checkedCopies.filter(copy => {
  return (filterEvaluator === '' || copy.evaluatorId === filterEvaluator) &&
         (filterCourse === '' || copy.course === filterCourse) &&
         (filterSubject === '' || copy.subject === filterSubject) &&
         (filterSession === '' || (copy.examDate && 
            formatDateTime(copy.examDate, 'year') === filterSession)
         );
});

  function formatEvalTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Checked Copies</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">View and download evaluated answer copies</p>
        </div>
        {loading ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <div className="flex justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading checked copies...</span>
            </div>
          </div>
        ) : (
          <div className="px-4 py-5 sm:py-1 sm:px-6">
            {/* Filters */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Filter by Session</label>
                <select
                  value={filterSession}
                  onChange={(e) => setFilterSession(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Sessions</option>
                  {sessions.map((session) => (
                    <option key={session} value={session}>
                      {session}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Filter by Course</label>
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Filter by Subject</label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Filter by Evaluator</label>
                <select
                  value={filterEvaluator}
                  onChange={(e) => setFilterEvaluator(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Evaluators</option>
                  {evaluators.map((evaluator) => (
                    <option key={evaluator.id} value={evaluator.id}>
                      {evaluator.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Bulk Download Button */}
            <div className="mb-4">
              <button
                onClick={handleDownloadAllCopies}
                disabled={downloadingAll || filteredCopies.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {downloadingAll ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading ({downloadProgress}%)
                  </>
                ) : (
                  `Download All (${filteredCopies.length} copies)`
                )}
              </button>
            </div>

            {/* Copies Table */}
            <div className="mt-4 flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Copy ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Evaluator ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Eval Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCopies.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                              No checked copies found
                            </td>
                          </tr>
                        ) : (
                          filteredCopies.map((copy) => (
                            <tr key={copy.copyId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{copy.copyId}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{copy.course || '-'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{copy.subject || '-'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{copy.evaluatorId}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatDateTime(copy.updatedAt)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{copy.status}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {copy.obtainedMarks} / {copy.maxMarks}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatEvalTime(copy.evaluationTime)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-3">
                                  <button
                                    id={`view-btn-${copy.copyId}`}
                                    onClick={() => handleViewCopy(copy.copyId)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    View
                                  </button>
                                  <button
                                    id={`download-btn-${copy.copyId}`}
                                    onClick={() => handleDownloadCopy(copy.copyId)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Download
                                  </button>
                                </div>
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
        )}
      </div>
    </div>
  );
};

export default CheckedCopies;