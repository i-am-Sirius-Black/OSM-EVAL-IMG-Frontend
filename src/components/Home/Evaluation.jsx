// src/components/Home/Evaluation.jsx
import { useState, useEffect } from 'react';
import { Pagination, TextField, InputAdornment } from '@mui/material';
import { Search, FilterList, SortByAlpha, ArrowForwardIos } from '@mui/icons-material';
import SubjectSelection from './SubjectSelection';

// Mock data
const subjects = [
  { subject: 'Mathematics', subjectId: 'SUB101' },
  { subject: 'Physics', subjectId: 'SUB102' },
  { subject: 'Chemistry', subjectId: 'SUB103' },
];

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

export default function Evaluation() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCopies, setFilteredCopies] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewType, setViewType] = useState('grid');
  const itemsPerPage = 12;

  useEffect(() => {
    if (selectedSubject) {
      let filtered = dummyCopies[selectedSubject];

      if (searchTerm) {
        filtered = filtered.filter((copy) =>
          copy.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      filtered = [...filtered].sort((a, b) => {
        return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
      });

      setFilteredCopies(filtered);
      setPage(1);
    }
  }, [selectedSubject, searchTerm, sortOrder]);

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const toggleViewType = () => {
    setViewType((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  const handleEvaluate = (copyId) => {
    console.log(`Navigating to evaluate copy: ${copyId}`);
  };

  const currentCopies = filteredCopies.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(filteredCopies.length / itemsPerPage);



//   return (
//     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//       <SubjectSelection
//         selectedSubject={selectedSubject}
//         handleSubjectChange={handleSubjectChange}
//         subjects={subjects}
//       />
//       {selectedSubject && (
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-4 py-2 border-b border-gray-200 sm:px-6">
//             <div className="flex flex-wrap items-center justify-between">
//               <h2 className="text-lg font-medium text-gray-900">
//                 Copies for {subjects.find((s) => s.subjectId === selectedSubject)?.subject}
//                 <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
//                   {filteredCopies.length} copies
//                 </span>
//               </h2>
//               <div className="flex gap-1 mt-3 sm:mt-0 space-x-3 flex-wrap">
//                 <TextField
//                   placeholder="Search copies..."
//                   size="small"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   slotProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Search fontSize="small" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{ width: '200px' }}
//                   className="mb-2 sm:mb-0"
//                 />
//                 <button
//                   onClick={toggleSort}
//                   className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <SortByAlpha fontSize="small" className="mr-1" />
//                   {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
//                 </button>
//                 <button
//                   onClick={toggleViewType}
//                   className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <FilterList fontSize="small" className="mr-1" />
//                   {viewType === 'grid' ? 'List View' : 'Grid View'}
//                 </button>
//               </div>
//             </div>
//           </div>
//           {filteredCopies.length > 0 ? (
//             <div className="p-4 ">
//               <div
//                 className={`grid ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'grid-cols-1 gap-2'} max-h-[30vh] overflow-y-auto pr-2`}
//               >
//                 {currentCopies.map((copyId) => (
//                   <div
//                     key={copyId}
//                     className={`${
//                       viewType === 'grid'
//                         ? 'p-4 border border-gray-200 rounded-lg hover:shadow-md transition bg-white'
//                         : 'p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition flex justify-between items-center'
//                     }`}
//                   >
//                     {viewType === 'grid' ? (
//                       <>
//                         <div className="flex items-center mb-3">
//                           <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                             <svg
//                               className="w-5 h-5 text-blue-600"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                               />
//                             </svg>
//                           </div>
//                           <div>
//                             <div className="font-medium text-gray-900">{copyId}</div>
//                             <div className="text-sm text-gray-500">
//                               {Math.random() > 0.3 ? (
//                                 <span className="text-green-600">Evaluated</span>
//                               ) : (
//                                 <span className="text-yellow-600">Pending</span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex justify-end">
//                           <button
//                             onClick={() => handleEvaluate(copyId)}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center text-sm"
//                           >
//                             {Math.random() > 0.3 ? 'View' : 'Evaluate'}
//                             <ArrowForwardIos fontSize="small" className="ml-1" style={{ fontSize: '14px' }} />
//                           </button>
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <div className="flex items-center">
//                           <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                             <svg
//                               className="w-4 h-4 text-blue-600"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                               />
//                             </svg>
//                           </div>
//                           <div>
//                             <div className="font-medium text-gray-900">{copyId}</div>
//                             <div className="text-xs text-gray-500">
//                               {Math.random() > 0.3 ? (
//                                 <span className="text-green-600">Evaluated</span>
//                               ) : (
//                                 <span className="text-yellow-600">Pending</span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => handleEvaluate(copyId)}
//                           className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center text-xs"
//                         >
//                           {Math.random() > 0.3 ? 'View' : 'Evaluate'}
//                           <ArrowForwardIos fontSize="small" className="ml-1" style={{ fontSize: '12px' }} />
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-6 flex justify-center">
//                 <Pagination
//                   count={pageCount}
//                   page={page}
//                   onChange={handlePageChange}
//                   color="primary"
//                   showFirstButton
//                   showLastButton
//                 />
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No copies found</h3>
//               <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
//             </div>
//           )}
//         </div>
//       )}
//     </main>
//   );

//? v2...

return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <SubjectSelection
        selectedSubject={selectedSubject}
        handleSubjectChange={handleSubjectChange}
        subjects={subjects}
      />
      {selectedSubject && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-2 border-b border-gray-200 sm:px-6">
            <div className="flex flex-wrap items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Copies for {subjects.find((s) => s.subjectId === selectedSubject)?.subject}
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {filteredCopies.length} copies
                </span>
              </h2>
              <div className="flex gap-1 mt-3 sm:mt-0 space-x-3 flex-wrap">
                <TextField
                  placeholder="Search copies..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  slotProps={{
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
              </div>
            </div>
          </div>
          {filteredCopies.length > 0 ? (
            <div className="p-4">
              <div className="max-h-[35vh] overflow-y-auto pr-2">
                {currentCopies.map((copyId) => (
                  <div
                    key={copyId}
                    className="flex justify-between items-center px-3 py-2 mb-1 border border-gray-200 rounded-md hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center">
                      <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <svg
                          className="w-3 h-3 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="font-medium text-gray-900">{copyId}</div>
                      <div className="ml-3 text-xs">
                        {Math.random() > 0.3 ? (
                          <span className="text-green-600">Evaluated</span>
                        ) : (
                          <span className="text-yellow-600">Pending</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEvaluate(copyId)}
                      className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center text-xs"
                    >
                      {Math.random() > 0.3 ? 'View' : 'Evaluate'}
                      <ArrowForwardIos fontSize="small" className="ml-1" style={{ fontSize: '10px' }} />
                    </button>
                  </div>
                ))}
              </div>
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
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No copies found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );

}