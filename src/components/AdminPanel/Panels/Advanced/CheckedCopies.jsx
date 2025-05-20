// import React, { useState, useEffect, use } from 'react';
// import api from '../../../api/axios';
// import API_ROUTES from '../../../api/routes';

// const { COPIES, ADMIN } = API_ROUTES;

// const CheckedCopies = () => {
//   const [checkedCopies, setCheckedCopies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterEvaluator, setFilterEvaluator] = useState('');
//   const [filterSubject, setFilterSubject] = useState('');
//   const [evaluators, setEvaluators] = useState([]);
//   const [subjects, setSubjects] = useState([]);

// useEffect(() => {
//     // Fetch checked copies from API
//     const fetchCheckedCopies = async () => {
//       try {
//         const response = await api.get(ADMIN.GET_EVALUATED_COPIES);

//         console.log("response", response.data.copies);
        
//         if (response.status === 200) {
//           setCheckedCopies(response.data.copies);
//         }
//         else {
//           console.error('Failed to fetch checked copies:');
//         }
//       } catch (error) {
//         console.error('Error fetching checked copies:', error);
//       }
//     };
//     fetchCheckedCopies();
//   }, [])

//   useEffect(() => {
//     // Fetch checked copies data from API
//     Promise.all([
//       // fetch('/api/checked-copies').then(res => res.json()),
//       fetch('/api/evaluators').then(res => res.json()),
//       fetch('/api/subjects').then(res => res.json())
//     ])
//     .then(([copiesData, evaluatorData, subjectData]) => {
//       setCheckedCopies(copiesData);
//       setEvaluators(evaluatorData);
//       setSubjects(subjectData);
//       setLoading(false);
//     })
//     .catch(error => {
//       console.error('Error fetching data:', error);
//       setLoading(false);
//       // For demo purposes, add some sample data
//       // setCheckedCopies([
//       //   { id: 'CP001', evaluatorId: 1, evaluatorName: 'John Doe', subjectId: 1, subjectName: 'Mathematics', date: '2025-04-25', score: 85 },
//       //   { id: 'CP002', evaluatorId: 1, evaluatorName: 'John Doe', subjectId: 1, subjectName: 'Mathematics', date: '2025-04-26', score: 92 },
//       //   { id: 'CP003', evaluatorId: 2, evaluatorName: 'Jane Smith', subjectId: 2, subjectName: 'Physics', date: '2025-04-26', score: 78 },
//       //   { id: 'CP004', evaluatorId: 3, evaluatorName: 'Mike Johnson', subjectId: 3, subjectName: 'Chemistry', date: '2025-04-27', score: 88 }
//       // ]);
//       setEvaluators([
//         { id: 1, name: 'John Doe' },
//         { id: 2, name: 'Jane Smith' },
//         { id: 3, name: 'Mike Johnson' }
//       ]);
//       setSubjects([
//         { id: 1, name: 'Mathematics' },
//         { id: 2, name: 'Physics' },
//         { id: 3, name: 'Chemistry' },
//         { id: 4, name: 'Biology' }
//       ]);
//     });
//   }, []);


//   const handleViewCopy = async (copyId) => {
//     try {
//       // Set a loading state for visual feedback
//       const viewButton = document.getElementById(`view-btn-${copyId}`);
//       if (viewButton) {
//         viewButton.innerText = 'Loading...';
//         viewButton.disabled = true;
//       }
      
//       // Use your API instance to ensure proper headers
//       const response = await api.get(COPIES.DOWNLOAD_PDF(copyId), {
//         responseType: 'blob',
//         timeout: 60000,
//       });
      
//       // Create a blob URL for the PDF data
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
      
//       // Open the PDF in a new tab
//       window.open(url, '_blank');
      
//       // In a web app, we would need to clean up the blob URL when the tab is closed
//       // But in Electron, you'll handle this differently with native windows
//     } catch (error) {
//       console.error('Error viewing PDF:', error);
//       alert(`Failed to view the PDF for copy ${copyId}. Please try again.`);
//     } finally {
//       // Reset the button state
//       const viewButton = document.getElementById(`view-btn-${copyId}`);
//       if (viewButton) {
//         viewButton.innerText = 'View';
//         viewButton.disabled = false;
//       }
//     }
//   };


// //   // For Electron (future implementation)
// // const handleViewCopy = async (copyId) => {
// //   try {
// //     const viewButton = document.getElementById(`view-btn-${copyId}`);
// //     if (viewButton) {
// //       viewButton.innerText = 'Loading...';
// //       viewButton.disabled = true;
// //     }
    
// //     // In Electron, you might want to download to a temp file first
// //     const response = await api.get(`/api/copies/download-pdf/${copyId}`, {
// //       responseType: 'blob',
// //       timeout: 60000,
// //     });
    
// //     // This would be replaced with Electron's IPC to main process
// //     // where you'd save to temp file and open with:
// //     // electron.shell.openPath(tempFilePath)
    
// //     // For now, use the web approach
// //     const blob = new Blob([response.data], { type: 'application/pdf' });
// //     const url = window.URL.createObjectURL(blob);
// //     window.open(url, '_blank');
    
// //   } catch (error) {
// //     console.error('Error viewing PDF:', error);
// //     alert(`Failed to view the PDF for copy ${copyId}. Please try again.`);
// //   } finally {
// //     const viewButton = document.getElementById(`view-btn-${copyId}`);
// //     if (viewButton) {
// //       viewButton.innerText = 'View';
// //       viewButton.disabled = false;
// //     }
// //   }
// // };

//   const handleDownloadCopy = async (copyId) => {
//     try {
//       // Set a loading state for visual feedback
//       const downloadButton = document.getElementById(`download-btn-${copyId}`);
//       if (downloadButton) {
//         downloadButton.innerText = 'Generating...';
//         downloadButton.disabled = true;
//       }
      
//       // Use your API instance to ensure proper headers
//       const response = await api.get(COPIES.DOWNLOAD_PDF(copyId), {
//         responseType: 'blob',
//         timeout: 60000,
//       });
      
//       // Create a blob URL for the PDF data
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
      
//       // Create a link to trigger the download with the filename from the server
//       const a = document.createElement('a');
//       a.style.display = 'none';
//       a.href = url;
//       a.download = `Copy_${copyId}.pdf`;
//       document.body.appendChild(a);
//       a.click();
      
//       // Clean up
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
      
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//       alert(`Failed to download the PDF for copy ${copyId}. Please try again.`);
//     } finally {
//       // Reset the button state
//       const downloadButton = document.getElementById(`download-btn-${copyId}`);
//       if (downloadButton) {
//         downloadButton.innerText = 'Download';
//         downloadButton.disabled = false;
//       }
//     }
//   };



//   // Filter copies based on selected evaluator and subject
//   // const filteredCopies = checkedCopies.filter(copy => {
//   //   return (filterEvaluator === '' || copy.evaluatorId.toString() === filterEvaluator) &&
//   //          (filterSubject === '' || copy.subjectId.toString() === filterSubject);
//   // });

//   return (
//     <div>
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <div className="px-4 py-5 sm:px-6">
//           <h3 className="text-lg leading-6 font-medium text-gray-900">Checked Copies</h3>
//           <p className="mt-1 max-w-2xl text-sm text-gray-500">View and download evaluated answer copies</p>
//         </div>
//         {loading ? (
//           <div className="px-4 py-5 sm:p-6 text-center">Loading checked copies...</div>
//         ) : (
//           <div className="px-4 py-5 sm:p-6">
//             {/* Filters */}
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Filter by Evaluator</label>
//                 <select
//                   value={filterEvaluator}
//                   onChange={(e) => setFilterEvaluator(e.target.value)}
//                   className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                 >
//                   <option value="">All Evaluators</option>
//                   {evaluators.map((evaluator) => (
//                     <option key={evaluator.id} value={evaluator.id}>
//                       {evaluator.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Filter by Subject</label>
//                 <select
//                   value={filterSubject}
//                   onChange={(e) => setFilterSubject(e.target.value)}
//                   className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                 >
//                   <option value="">All Subjects</option>
//                   {subjects.map((subject) => (
//                     <option key={subject.id} value={subject.id}>
//                       {subject.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Copies Table */}
//             <div className="mt-4 flex flex-col">
//               <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//                 <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
//                   <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Copy ID
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Subject
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Evaluator
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Date
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Score
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {checkedCopies.length === 0 ? (
//                           <tr>
//                             <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
//                               No checked copies found
//                             </td>
//                           </tr>
//                         ) : (
//                           checkedCopies.map((copyid) => (
//                             <tr key={copyid}>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">{copyid}</div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">-</div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">-</div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">-</div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">-</div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//   <div className="flex space-x-3">
//     <button
//       id={`view-btn-${copyid}`}
//       onClick={() => handleViewCopy(copyid)}
//       className="text-green-600 hover:text-green-900"
//     >
//       View
//     </button>
//     <button
//       id={`download-btn-${copyid}`}
//       onClick={() => handleDownloadCopy(copyid)}
//       className="text-blue-600 hover:text-blue-900"
//     >
//       Download
//     </button>
//   </div>
// </td>
//                             </tr>
//                           ))
//                         )}
//                       </tbody>
//                     </table>
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

// export default CheckedCopies;



//*v2 New api for Evaluated copies

import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';
import API_ROUTES from '../../../../api/routes';

const { COPIES, ADMIN } = API_ROUTES;

const CheckedCopies = () => {
  const [checkedCopies, setCheckedCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEvaluator, setFilterEvaluator] = useState('');
  const [evaluators, setEvaluators] = useState([]);

  useEffect(() => {
    // Fetch checked copies from API
    const fetchCheckedCopies = async () => {
      try {
        setLoading(true);
        const response = await api.get(ADMIN.GET_EVALUATED_COPIES);
        
        if (response.status === 200) {
          setCheckedCopies(response.data.copies);
          
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
  }, []);

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

  // Filter copies based on selected evaluator
  const filteredCopies = checkedCopies.filter(copy => {
    return filterEvaluator === '' || copy.evaluatorId === filterEvaluator;
  });


  function formatEvalTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDateTime(dateString) {
    const date = new Date(dateString);

    const options = {
        day: '2-digit',
        month: 'short', // or 'long' for full month name
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    return date.toLocaleString('en-US', options);
}


  return (
    <div >
      <div className=" bg-white shadow overflow-hidden sm:rounded-lg">
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
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
                            Evaluator ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Time
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
                            <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
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
                                <div className="text-sm text-gray-900">{copy.evaluatorId}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatDateTime(copy.updatedAt)}</div>
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