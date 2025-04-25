// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
// import { ArrowForwardIos } from '@mui/icons-material';

// const subjects = [
//   { subject: 'Mathematics', subjectId: 'SUB101' },
//   { subject: 'Physics', subjectId: 'SUB102' },
//   { subject: 'Chemistry', subjectId: 'SUB103' },
// ];

// const dummyCopies = {
//   SUB101: ['copy101A', 'copy101B'],
//   SUB102: ['copy102A', 'copy102B'],
//   SUB103: ['copy103A', 'copy103B'],
// };

// export default function SubjectSelectionPage() {
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const navigate = useNavigate();

//   const handleSubjectChange = (event) => {
//     setSelectedSubject(event.target.value);
//   };

//   const handleEvaluate = (copyId) => {
//     navigate(`/?copyId=${copyId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Select Subject to Evaluate</h1>

//       <FormControl className="w-full max-w-md mb-8" fullWidth>
//         <InputLabel id="subject-select-label">Subject</InputLabel>
//         <Select
//           labelId="subject-select-label"
//           value={selectedSubject}
//           label="Subject"
//           onChange={handleSubjectChange}
//           className="bg-white rounded-lg shadow-sm"
//         >
//           {subjects.map((sub) => (
//             <MenuItem key={sub.subjectId} value={sub.subjectId}>
//               {sub.subject}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {selectedSubject && (
//         <div className="w-full max-w-md bg-white rounded-xl shadow-md p-4">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Copies for {subjects.find(s => s.subjectId === selectedSubject)?.subject}</h2>
//           <ul className="space-y-3">
//             {dummyCopies[selectedSubject].map(copyId => (
//               <li key={copyId} className="flex justify-between items-center border p-3 rounded-lg">
//                 <span className="text-gray-600">{copyId}</span>
//                 <button
//                   onClick={() => handleEvaluate(copyId)}
//                   className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//                 >
//                   Evaluate <ArrowForwardIos style={{ fontSize: '16px' }} />
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }



//?v1

// import { useState } from 'react';

// const subjects = [
//   { subject: 'Mathematics', subjectId: 'SUB101' },
//   { subject: 'Physics', subjectId: 'SUB102' },
//   { subject: 'Chemistry', subjectId: 'SUB103' },
// ];

// const dummyCopies = {
//   SUB101: ['copy101A', 'copy101B'],
//   SUB102: ['copy102A', 'copy102B'],
//   SUB103: ['copy103A', 'copy103B'],
// };

// export default function SubjectSelectionPage() {
//   const [selectedSubject, setSelectedSubject] = useState('');
  
//   // Mock navigate function since we can't use react-router here
//   const handleEvaluate = (copyId) => {
//     console.log(`Navigating to copy: ${copyId}`);
//     // In a real app: navigate(`/?copyId=${copyId}`);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
//       <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Subject Evaluation Portal</h1>
      
//       <div className="mb-8">
//         <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-2">
//           Select Subject
//         </label>
//         <div className="relative">
//           <select
//             id="subject-select"
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//             className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
//           >
//             <option value="">Choose a subject</option>
//             {subjects.map((sub) => (
//               <option key={sub.subjectId} value={sub.subjectId}>
//                 {sub.subject}
//               </option>
//             ))}
//           </select>
//           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {selectedSubject && (
//         <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Copies for {subjects.find(s => s.subjectId === selectedSubject)?.subject}
//           </h2>
          
//           <div className="space-y-3">
//             {dummyCopies[selectedSubject].map(copyId => (
//               <div key={copyId} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
//                 <div className="flex items-center">
//                   <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                   </div>
//                   <span className="font-medium text-gray-700">{copyId}</span>
//                 </div>
//                 <button
//                   onClick={() => handleEvaluate(copyId)}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
//                 >
//                   Evaluate
//                   <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



//?v2...

import { useState, useEffect } from 'react';
import { Pagination, TextField, InputAdornment } from '@mui/material';
import { 
  Person, 
  Logout, 
  Search, 
  FilterList, 
  SortByAlpha, 
  ArrowForwardIos, 
  Dashboard, 
  Assignment, 
  Settings 
} from '@mui/icons-material';

// Mock data generation for many copies
const subjects = [
  { subject: 'Mathematics', subjectId: 'SUB101' },
  { subject: 'Physics', subjectId: 'SUB102' },
  { subject: 'Chemistry', subjectId: 'SUB103' },
];

// Generate 100+ copies for each subject
const generateDummyCopies = (subjectId) => {
  const copies = [];
  for (let i = 1; i <= 120; i++) {
    copies.push(`${subjectId}-Copy-${i.toString().padStart(3, '0')}`);
  }
  return copies;
};

const dummyCopies = {
  SUB101: generateDummyCopies('SUB101'),
  SUB102: generateDummyCopies('SUB102'),
  SUB103: generateDummyCopies('SUB103'),
};

export default function EvaluationPortal() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCopies, setFilteredCopies] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewType, setViewType] = useState('grid');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const itemsPerPage = 12;
  const username = "John Evaluator";

  useEffect(() => {
    if (selectedSubject) {
      let filtered = dummyCopies[selectedSubject];
      
      if (searchTerm) {
        filtered = filtered.filter(copy => 
          copy.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Sort the copies
      filtered = [...filtered].sort((a, b) => {
        return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
      });
      
      setFilteredCopies(filtered);
      setPage(1);  // Reset to first page when filters change
    }
  }, [selectedSubject, searchTerm, sortOrder]);

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const toggleViewType = () => {
    setViewType(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const handleEvaluate = (copyId) => {
    console.log(`Navigating to evaluate copy: ${copyId}`);
    // In a real app: navigate(`/evaluate?copyId=${copyId}`);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // In a real app: perform logout actions
  };

  // Calculate pagination
  const currentCopies = filteredCopies.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const pageCount = Math.ceil(filteredCopies.length / itemsPerPage);

  const evaluationStatus = {
    pending: Math.floor(Math.random() * 50) + 30,
    completed: Math.floor(Math.random() * 50) + 70,
    total: 120
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Dashboard className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">EvaluPortal</span>
              </div>
              <nav className="ml-6 flex space-x-8">
                <a href="#" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <Assignment className="mr-1" fontSize="small" />
                  Evaluation
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Reports
                </a>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Person className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="ml-2 mr-1 text-gray-700">{username}</span>
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={handleLogout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
              >
                <Logout className="mr-1" fontSize="small" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard Summary */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Copies</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{evaluationStatus.total}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Evaluated</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{evaluationStatus.completed}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      {Math.round((evaluationStatus.completed / evaluationStatus.total) * 100)}%
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{evaluationStatus.pending}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Selection */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select Subject to Evaluate</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject-select"
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a subject</option>
                  {subjects.map((sub) => (
                    <option key={sub.subjectId} value={sub.subjectId}>
                      {sub.subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {selectedSubject && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex flex-wrap items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Copies for {subjects.find(s => s.subjectId === selectedSubject)?.subject}
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {filteredCopies.length} copies
                  </span>
                </h2>
                
                {/* Action Bar */}
                <div className="flex mt-3 sm:mt-0 space-x-3 flex-wrap">
                  <TextField
                    placeholder="Search copies..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: '200px' }}
                    className="mb-2 sm:mb-0"
                  />
                  
                  <button
                    onClick={toggleSort}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <SortByAlpha fontSize="small" className="mr-1" /> 
                    {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
                  </button>
                  
                  <button
                    onClick={toggleViewType}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FilterList fontSize="small" className="mr-1" /> 
                    {viewType === 'grid' ? 'List View' : 'Grid View'}
                  </button>
                </div>
              </div>
            </div>
            
            {filteredCopies.length > 0 ? (
              <div className="p-4">
                {/* Grid or List View */}
                <div className={`grid ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'grid-cols-1 gap-2'}`}>
                  {currentCopies.map(copyId => (
                    <div 
                      key={copyId} 
                      className={`${
                        viewType === 'grid' 
                          ? 'p-4 border border-gray-200 rounded-lg hover:shadow-md transition bg-white' 
                          : 'p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition flex justify-between items-center'
                      }`}
                    >
                      {viewType === 'grid' ? (
                        <>
                          <div className="flex items-center mb-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{copyId}</div>
                              <div className="text-sm text-gray-500">
                                {Math.random() > 0.3 ? 
                                  <span className="text-green-600">Evaluated</span> : 
                                  <span className="text-yellow-600">Pending</span>
                                }
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleEvaluate(copyId)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center text-sm"
                            >
                              {Math.random() > 0.3 ? 'View' : 'Evaluate'}
                              <ArrowForwardIos fontSize="small" className="ml-1" style={{ fontSize: '14px' }} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{copyId}</div>
                              <div className="text-xs text-gray-500">
                                {Math.random() > 0.3 ? 
                                  <span className="text-green-600">Evaluated</span> : 
                                  <span className="text-yellow-600">Pending</span>
                                }
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEvaluate(copyId)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center text-xs"
                          >
                            {Math.random() > 0.3 ? 'View' : 'Evaluate'}
                            <ArrowForwardIos fontSize="small" className="ml-1" style={{ fontSize: '12px' }} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="mt-6 flex justify-center">
                  <Pagination 
                    count={pageCount} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary"
                    showFirstButton 
                    showLastButton
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No copies found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}