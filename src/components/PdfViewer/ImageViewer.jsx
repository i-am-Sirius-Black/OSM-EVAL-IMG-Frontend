// import { memo, useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import SinglePage from './SinglePage';
// import LoadingSpinner from '../Common/LoadingSpinner';


// // ImageViewer component to display 36 pages as images
// const ImageViewer = memo(
//   ({ copyId, annotations, selectedTool, handleAnnotate, handleRemoveAnnotation, handleUpdateAnnotation }) => {
//     const [zoom, setZoom] = useState(1);
//     const [containerWidth, setContainerWidth] = useState(0);
//     const [commentPosition, setCommentPosition] = useState(null);
//     const [commentText, setCommentText] = useState('');
//     const containerRef = useRef(null);

//     // Generate pages 1 to 36
//     const pages = useMemo(() => 
//       Array.from({ length: 36 }, (_, i) => ({
//         page_number: i + 1,
//       })),
//       []
//     );



//     // Group annotations by page
//     const annotationsByPage = useMemo(() => {
//       const map = {};
//       annotations.forEach((a) => {
//         if (!map[a.page]) map[a.page] = [];
//         map[a.page].push(a);
//       });
//       return map;
//     }, [annotations]);

//     // Update container width on resize
//     useEffect(() => {
//       const updateWidth = () => {
//         if (containerRef.current) {
//           setContainerWidth(containerRef.current.clientWidth * 0.95);
//         }
//       };
//       updateWidth();
//       window.addEventListener('resize', updateWidth);
//       return () => window.removeEventListener('resize', updateWidth);
//     }, []);

//     // Handle clicks on pages for annotations
//     const handlePageClick = useCallback(
//       (e, pageNumber) => {
//         e.preventDefault();
//         const rect = e.currentTarget.getBoundingClientRect();
//         const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//         const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;

//         const pageAnnotations = annotationsByPage[pageNumber] || [];
//         const hasAnnotation = pageAnnotations.some(
//           (a) => Math.abs(a.position.x - x) < 5 && Math.abs(a.position.y - y) < 5
//         );

//         if (hasAnnotation) return;

//         if (selectedTool === 'comment') {
//           setCommentPosition({ x: e.clientX, y: e.clientY, pageNumber });
//         } else if (selectedTool === 'check' || selectedTool === 'cancel') {
//           handleAnnotate(selectedTool, pageNumber, { x, y });
//         } else if (selectedTool === 'mouse') {
//           handleAnnotate(e.type === 'contextmenu' ? 'cancel' : 'check', pageNumber, { x, y });
//         } else if (selectedTool === 'draw') {
//           handleAnnotate('draw', pageNumber, { x, y, path: [{ x, y }] });
//         }
//       },
//       [selectedTool, annotationsByPage, handleAnnotate]
//     );

//     // Handle comment submission
//     const handleCommentSubmit = useCallback(() => {
//       if (!commentText || !commentPosition) return;
//       const rect = containerRef.current.getBoundingClientRect();
//       const x = Math.round(((commentPosition.x - rect.left) / rect.width) * 100 * 10) / 10;
//       const y = Math.round(((commentPosition.y - rect.top) / rect.height) * 100 * 10) / 10;
//       handleAnnotate('comment', commentPosition.pageNumber, { x, y }, commentText);   //updated
//       setCommentPosition(null);
//       setCommentText('');
//     }, [commentText, commentPosition, handleAnnotate]);

//     // Render pages with lazy loading
//     const renderedPages = useMemo(
//       () =>
//         pages.map(({ page_number }) => (
//           <SinglePage
//             key={page_number}
//             pageNumber={page_number}
//             imageUrl={`http://localhost:3000/api/copies/image?copyId=${copyId}&page=${page_number}`}
//             width={containerWidth * zoom}
//             onPageClick={(e) => handlePageClick(e, page_number)}
//             annotations={annotationsByPage[page_number] || []}
//             selectedTool={selectedTool}
//             handleRemoveAnnotation={handleRemoveAnnotation}
//             handleUpdateAnnotation={handleUpdateAnnotation}
//           />
//         )),
//       [
//         pages,
//         copyId,
//         containerWidth,
//         zoom,
//         handlePageClick,
//         annotationsByPage,
//         selectedTool,
//         handleRemoveAnnotation,
//         handleUpdateAnnotation,
//       ]
//     );


//     //zooming in/out with ctrl + scroll
//     useEffect(() => {
//         const handleWheel = (e) => {
//           if (e.ctrlKey) {
//             e.preventDefault(); // prevent browser default zoom
//             setZoom((prevZoom) => {
//               let newZoom = e.deltaY < 0 ? prevZoom + 0.1 : prevZoom - 0.1;
//               return Math.max(0.5, Math.min(2, parseFloat(newZoom.toFixed(2))));
//             });
//           }
//         };
    
//         window.addEventListener("wheel", handleWheel, { passive: false });
    
//         return () => {
//           window.removeEventListener("wheel", handleWheel);
//         };
//       }, []);

//     return (
//       <div ref={containerRef} className="w-full h-full bg-white rounded-lg shadow-sm overflow-y-auto">
//         {/* Zoom Controls */}
//         <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-200 flex justify-end gap-2">
//           <button
//             onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
//             className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//           >
//             -
//           </button>
//           <span className="px-3 py-1 bg-gray-100 rounded text-sm">{Math.round(zoom * 100)}%</span>
//           <button
//             onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}
//             className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//           >
//             +
//           </button>
//         </div>
//         {pages.length === 0 ? <LoadingSpinner /> : renderedPages}
//         {commentPosition && (
//           <div
//             className="absolute bg-white border border-gray-200 rounded-md shadow-lg p-3 flex gap-2 z-50"
//             style={{ top: commentPosition.y, left: commentPosition.x }}
//           >
//             <input
//               type="text"
//               value={commentText}
//               onChange={(e) => setCommentText(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
//               placeholder="Enter comment"
//               className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
//               autoFocus
//             />
//             <button
//               onClick={handleCommentSubmit}
//               className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//             >
//               Add
//             </button>
//             <button
//               onClick={() => setCommentPosition(null)}
//               className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// export default ImageViewer;


//?v2 comment position fix

// import { memo, useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import SinglePage from './SinglePage';
// import LoadingSpinner from '../Common/LoadingSpinner';


// // ImageViewer component to display 36 pages as images
// const ImageViewer = memo(
//   ({ copyId, annotations, selectedTool, handleAnnotate, handleRemoveAnnotation, handleUpdateAnnotation }) => {
//     const [zoom, setZoom] = useState(1);
//     const [containerWidth, setContainerWidth] = useState(0);
//     const [commentPosition, setCommentPosition] = useState(null);
//     const [commentText, setCommentText] = useState('');
//     const containerRef = useRef(null);

//     // Generate pages 1 to 36
//     const pages = useMemo(() => 
//       Array.from({ length: 36 }, (_, i) => ({
//         page_number: i + 1,
//       })),
//       []
//     );



//     // Group annotations by page
//     const annotationsByPage = useMemo(() => {
//       const map = {};
//       annotations.forEach((a) => {
//         if (!map[a.page]) map[a.page] = [];
//         map[a.page].push(a);
//       });
//       return map;
//     }, [annotations]);

//     // Update container width on resize
//     useEffect(() => {
//       const updateWidth = () => {
//         if (containerRef.current) {
//           setContainerWidth(containerRef.current.clientWidth * 0.95);
//         }
//       };
//       updateWidth();
//       window.addEventListener('resize', updateWidth);
//       return () => window.removeEventListener('resize', updateWidth);
//     }, []);

//     const handlePageClick = useCallback(
//         (e, pageNumber) => {
//           e.preventDefault();
//           const rect = e.currentTarget.getBoundingClientRect();
//           const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//           const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;
      
//           const pageAnnotations = annotationsByPage[pageNumber] || [];
//           const hasAnnotation = pageAnnotations.some(
//             (a) => Math.abs(a.position.x - x) < 5 && Math.abs(a.position.y - y) < 5
//           );
      
//           if (hasAnnotation) return;
      
//           if (selectedTool === 'comment') {
//             setCommentPosition({
//               x: e.clientX,
//               y: e.clientY,
//               pageNumber,
//               pageRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }, // Store page rect
//             });
//           } else if (selectedTool === 'check' || selectedTool === 'cancel') {
//             handleAnnotate(selectedTool, pageNumber, { x, y });
//           } else if (selectedTool === 'mouse') {
//             handleAnnotate(e.type === 'contextmenu' ? 'cancel' : 'check', pageNumber, { x, y });
//           } else if (selectedTool === 'draw') {
//             handleAnnotate('draw', pageNumber, { x, y, path: [{ x, y }] });
//           }
//         },
//         [selectedTool, annotationsByPage, handleAnnotate]
//       );




//     // Handle comment submission
//    const handleCommentSubmit = useCallback(() => {
//   if (!commentText || !commentPosition) return;
//   const { x, y, pageNumber, pageRect } = commentPosition;
//   const calcX = Math.round(((x - pageRect.left) / pageRect.width) * 100 * 10) / 10;
//   const calcY = Math.round(((y - pageRect.top) / pageRect.height) * 100 * 10) / 10;
//   handleAnnotate('comment', pageNumber, { x: calcX, y: calcY }, commentText);
//   setCommentPosition(null);
//   setCommentText('');
// }, [commentText, commentPosition, handleAnnotate]);

//     // Render pages with lazy loading
//     const renderedPages = useMemo(
//       () =>
//         pages.map(({ page_number }) => (
//           <SinglePage
//             key={page_number}
//             pageNumber={page_number}
//             imageUrl={`http://localhost:3000/api/copies/image?copyId=${copyId}&page=${page_number}`}
//             width={containerWidth * zoom}
//             onPageClick={(e) => handlePageClick(e, page_number)}
//             annotations={annotationsByPage[page_number] || []}
//             selectedTool={selectedTool}
//             handleRemoveAnnotation={handleRemoveAnnotation}
//             handleUpdateAnnotation={handleUpdateAnnotation}
//           />
//         )),
//       [
//         pages,
//         copyId,
//         containerWidth,
//         zoom,
//         handlePageClick,
//         annotationsByPage,
//         selectedTool,
//         handleRemoveAnnotation,
//         handleUpdateAnnotation,
//       ]
//     );


//     //zooming in/out with ctrl + scroll
//     useEffect(() => {
//         const handleWheel = (e) => {
//           if (e.ctrlKey) {
//             e.preventDefault(); // prevent browser default zoom
//             setZoom((prevZoom) => {
//               let newZoom = e.deltaY < 0 ? prevZoom + 0.1 : prevZoom - 0.1;
//               return Math.max(0.5, Math.min(2, parseFloat(newZoom.toFixed(2))));
//             });
//           }
//         };
    
//         window.addEventListener("wheel", handleWheel, { passive: false });
    
//         return () => {
//           window.removeEventListener("wheel", handleWheel);
//         };
//       }, []);

//     return (
//       <div ref={containerRef} className="w-full h-full bg-white rounded-lg shadow-sm overflow-y-auto">
//         {/* Zoom Controls */}
//         <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-200 flex justify-end gap-2">
//           <button
//             onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
//             className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//           >
//             -
//           </button>
//           <span className="px-3 py-1 bg-gray-100 rounded text-sm">{Math.round(zoom * 100)}%</span>
//           <button
//             onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}
//             className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//           >
//             +
//           </button>
//         </div>
//         {pages.length === 0 ? <LoadingSpinner /> : renderedPages}
//         {commentPosition && (
//           <div
//             className="absolute bg-white border border-gray-200 rounded-md shadow-lg p-3 flex gap-2 z-50"
//             style={{ top: commentPosition.y, left: commentPosition.x }}
//           >
//             <input
//               type="text"
//               value={commentText}
//               onChange={(e) => setCommentText(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
//               placeholder="Enter comment"
//               className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
//               autoFocus
//             />
//             <button
//               onClick={handleCommentSubmit}
//               className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//             >
//               Add
//             </button>
//             <button
//               onClick={() => setCommentPosition(null)}
//               className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// export default ImageViewer;

//?v3 with draw
// Now, let's update the ImageViewer component to pass the handleAnnotate function correctly:

import { memo, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import SinglePage from './SinglePage';
import LoadingSpinner from '../Common/LoadingSpinner';

// ImageViewer component to display 36 pages as images
const ImageViewer = memo(
  ({ copyId, annotations, selectedTool, handleAnnotate, handleRemoveAnnotation, handleUpdateAnnotation }) => {
    const [zoom, setZoom] = useState(1);
    const [containerWidth, setContainerWidth] = useState(0);
    const [commentPosition, setCommentPosition] = useState(null);
    const [commentText, setCommentText] = useState('');
    const containerRef = useRef(null);
    const isDrawing = useRef(false);
    const currentDrawingId = useRef(null);

    // Generate pages 1 to 36
    const pages = useMemo(() => 
      Array.from({ length: 36 }, (_, i) => ({
        page_number: i + 1,
      })),
      []
    );

    // Group annotations by page
    const annotationsByPage = useMemo(() => {
      const map = {};
      annotations.forEach((a) => {
        if (!map[a.page]) map[a.page] = [];
        map[a.page].push(a);
      });
      return map;
    }, [annotations]);

    // Update container width on resize
    useEffect(() => {
      const updateWidth = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.clientWidth * 0.95);
        }
      };
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handlePageClick = useCallback(
      (e, pageNumber) => {
        e.preventDefault();
        
        // Skip if we're in drawing mode - handled by the SinglePage component
        if (selectedTool === 'draw') {
          return;
        }
        
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;
    
        const pageAnnotations = annotationsByPage[pageNumber] || [];
        const hasAnnotation = pageAnnotations.some(
          (a) => Math.abs(a.position.x - x) < 5 && Math.abs(a.position.y - y) < 5
        );
    
        if (hasAnnotation) return;
    
        if (selectedTool === 'comment') {
          setCommentPosition({
            x: e.clientX,
            y: e.clientY,
            pageNumber,
            pageRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }, // Store page rect
          });
        } else if (selectedTool === 'check' || selectedTool === 'cancel') {
          handleAnnotate(selectedTool, pageNumber, { x, y });
        } else if (selectedTool === 'mouse') {
          handleAnnotate(e.type === 'contextmenu' ? 'cancel' : 'check', pageNumber, { x, y });
        }
      },
      [selectedTool, annotationsByPage, handleAnnotate]
    );

    // Handle comment submission
    const handleCommentSubmit = useCallback(() => {
      if (!commentText || !commentPosition) return;
      const { x, y, pageNumber, pageRect } = commentPosition;
      const calcX = Math.round(((x - pageRect.left) / pageRect.width) * 100 * 10) / 10;
      const calcY = Math.round(((y - pageRect.top) / pageRect.height) * 100 * 10) / 10;
      handleAnnotate('comment', pageNumber, { x: calcX, y: calcY }, commentText);
      setCommentPosition(null);
      setCommentText('');
    }, [commentText, commentPosition, handleAnnotate]);

    // Render pages with lazy loading
    const renderedPages = useMemo(
      () =>
        pages.map(({ page_number }) => (
          <SinglePage
            key={page_number}
            pageNumber={page_number}
            imageUrl={`http://localhost:3000/api/copies/image?copyId=${copyId}&page=${page_number}`}
            width={containerWidth * zoom}
            onPageClick={(e) => handlePageClick(e, page_number)}
            annotations={annotationsByPage[page_number] || []}
            selectedTool={selectedTool}
            handleAnnotate={handleAnnotate}
            handleRemoveAnnotation={handleRemoveAnnotation}
            handleUpdateAnnotation={handleUpdateAnnotation}
          />
        )),
      [
        pages,
        copyId,
        containerWidth,
        zoom,
        handlePageClick,
        annotationsByPage,
        selectedTool,
        handleAnnotate,
        handleRemoveAnnotation,
        handleUpdateAnnotation,
      ]
    );

    //zooming in/out with ctrl + scroll
    useEffect(() => {
      const handleWheel = (e) => {
        if (e.ctrlKey) {
          e.preventDefault(); // prevent browser default zoom
          setZoom((prevZoom) => {
            let newZoom = e.deltaY < 0 ? prevZoom + 0.1 : prevZoom - 0.1;
            return Math.max(0.5, Math.min(2, parseFloat(newZoom.toFixed(2))));
          });
        }
      };
  
      window.addEventListener("wheel", handleWheel, { passive: false });
  
      return () => {
        window.removeEventListener("wheel", handleWheel);
      };
    }, []);

    return (
      <div ref={containerRef} className="w-full h-full bg-white rounded-lg shadow-sm overflow-y-auto">
        {/* Zoom Controls */}
        <div className="sticky top-0 z-20 bg-white p-2 border-b border-gray-200 flex justify-end gap-2">
          <button
            onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            -
          </button>
          <span className="px-3 py-1 bg-gray-100 rounded text-sm">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            +
          </button>
        </div>
        {pages.length === 0 ? <LoadingSpinner /> : renderedPages}
        {commentPosition && (
          <div
            className="absolute bg-white border border-gray-200 rounded-md shadow-lg p-3 flex gap-2 z-50"
            style={{ top: commentPosition.y, left: commentPosition.x }}
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
              placeholder="Enter comment"
              className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
              autoFocus
            />
            <button
              onClick={handleCommentSubmit}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setCommentPosition(null)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default ImageViewer;





