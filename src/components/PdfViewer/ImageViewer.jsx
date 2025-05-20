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

//?v2 comment position fix (last working code)

// import { memo, useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import SinglePage from './SinglePage';
// import LoadingSpinner from '../Common/LoadingSpinner';
// import axios from '../../axiosConfig.js';

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
//           );    //preventing annotating near an existing annotation (within ~5px) 5×5 pixel square

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
//             height={containerWidth * zoom * 1.414} // A4 aspect ratio
//             onPageClick={(e) => handlePageClick(e, page_number)}
//             annotations={annotationsByPage[page_number] || []}
//             selectedTool={selectedTool}
//             handleRemoveAnnotation={handleRemoveAnnotation}
//             handleUpdateAnnotation={handleUpdateAnnotation}
//             handleAnnotate={handleAnnotate} // test Pass handleAnnot
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

//?v2.2 (currently working)
import { memo, useState, useRef, useEffect, useCallback, useMemo } from "react";
import SinglePage from "./SinglePage";
import LoadingSpinner from "../Common/LoadingSpinner";
import { getImageUrl } from "../../services/imageService";
import { constants } from "../../utils/constants";

const { COPY_PAGE_COUNT } = constants;

// ImageViewer component to display 36 pages as images
const ImageViewer = memo(
  ({
    copyId,
    annotations,
    selectedTool,
    handleAnnotate,
    handleRemoveAnnotation,
    handleUpdateAnnotation,
    handleDrawAnnotation,
  }) => {
    const [zoom, setZoom] = useState(1); //made default zoom 100%
    const [containerWidth, setContainerWidth] = useState(1);
    const [commentPosition, setCommentPosition] = useState(null);
    const [commentText, setCommentText] = useState("");

    const containerRef = useRef(null);

    const pageHeight = containerWidth * zoom * 1.414; // A4 aspect ratio

    // Generate pages 1 to 36
    const pages = useMemo(
      () =>
        Array.from({ length: COPY_PAGE_COUNT }, (_, i) => ({
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
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const handlePageClick = useCallback(
      (e, pageNumber) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const x =
          Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
        const y =
          Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;

        const pageAnnotations = annotationsByPage[pageNumber] || [];
        const hasAnnotation = pageAnnotations.some(
          (a) =>
            Math.abs(a.position.x - x) < 5 && Math.abs(a.position.y - y) < 5
        ); //preventing annotating near an existing annotation (within ~5px) 5×5 pixel square

        if (hasAnnotation) return;

        if (selectedTool === "comment") {
          setCommentPosition({
            x: e.clientX,
            y: e.clientY,
            pageNumber,
            pageRect: {
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
            },
          });
        } else if (selectedTool === "check" || selectedTool === "cancel") {
          handleAnnotate(selectedTool, pageNumber, { x, y });
        } else if (selectedTool === "mouse") {
          handleAnnotate(
            e.type === "contextmenu" ? "cancel" : "check",
            pageNumber,
            { x, y }
          );
        }
        // Note: draw handling is now done in SinglePage component
      },
      [selectedTool, annotationsByPage, handleAnnotate]
    );

    // Handle comment submission
    const handleCommentSubmit = useCallback(() => {
      if (!commentText || !commentPosition) return;
      const { x, y, pageNumber, pageRect } = commentPosition;
      const calcX =
        Math.round(((x - pageRect.left) / pageRect.width) * 100 * 10) / 10;
      const calcY =
        Math.round(((y - pageRect.top) / pageRect.height) * 100 * 10) / 10;
      handleAnnotate(
        "comment",
        pageNumber,
        { x: calcX, y: calcY },
        commentText
      );
      setCommentPosition(null);
      setCommentText("");
    }, [commentText, commentPosition, handleAnnotate]);

    // Render pages with lazy loading
    const renderedPages = useMemo(
      () =>
        pages.map(({ page_number }) => (
          <SinglePage
            key={page_number}
            pageNumber={page_number}
            imageUrl={getImageUrl(copyId, page_number)} // Dynamically generate the URL
            // imageUrl={`http://localhost:3000/api/copies/image?copyId=${copyId}&page=${page_number}`}
            width={containerWidth * zoom}
            height={pageHeight} // A4 aspect ratio
            onPageClick={(e) => handlePageClick(e, page_number)}
            annotations={annotationsByPage[page_number] || []}
            selectedTool={selectedTool}
            handleRemoveAnnotation={handleRemoveAnnotation}
            handleUpdateAnnotation={handleUpdateAnnotation}
            handleDrawAnnotation={handleDrawAnnotation} // Pass the new draw handler
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
        handleRemoveAnnotation,
        handleUpdateAnnotation,
        handleDrawAnnotation,
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
      <div
        ref={containerRef}
        className="w-full h-full bg-zinc-700 rounded-lg shadow-sm overflow-y-auto"
      >
        {/* Zoom Controls */}
        {/* <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-200 flex justify-end gap-2">
          <button onClick={() => setZoom(1)}>reset zoom</button>
          <button
            onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
            className="px-3 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            -
          </button>
          <span className="px-3 py-0.5 bg-gray-100 rounded text-sm">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}
            className="px-3 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            +
          </button>
        </div> */}

        {/* Zoom Controls */}
        <div className="sticky top-0 z-20 bg-white px-2 py-1 border-b border-gray-200 flex justify-end items-center">
          <div className="flex items-center bg-gray-50 rounded-md border border-gray-200 shadow-sm">
            <button
              onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
              className="p-1 hover:bg-gray-100 text-gray-600"
              title="Zoom out"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,13H5V11H19V13Z" />
              </svg>
            </button>
            <button
              onClick={() => setZoom(1)}
              className="px-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}
              className="p-1 hover:bg-gray-100 text-gray-600"
              title="Zoom in"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                />
              </svg>
            </button>
          </div>
        </div>

        {pages.length === 0 ? <LoadingSpinner /> : renderedPages}
          
        {/* {commentPosition && (
          <div
            className="absolute bg-white border border-gray-200 rounded-md shadow-lg p-3 flex gap-2 z-50"
            style={{ top: commentPosition.y, left: commentPosition.x }}
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
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
        )} */}

{/* v2.3 updated ui comment input popup */}
{commentPosition && (
  <div
    className="absolute bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md z-50"
    style={{ 
      top: commentPosition.y, 
      left: commentPosition.x,
      transform: 'translate(-50%, -100%)',
      maxWidth: '280px'
    }}
  >
    <div className="flex flex-col w-full p-2 gap-2">
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
        placeholder="Add a comment..."
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setCommentPosition(null)}
          className="px-2.5 py-1 bg-white/90 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-xs font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCommentSubmit}
          className="px-2.5 py-1 bg-blue-500/90 text-white rounded-md hover:bg-blue-600 text-xs font-medium transition-colors"
        >
          Add
        </button>
      </div>
    </div>
    {/* Triangle pointer that accurately shows click position */}
    <div 
      className="absolute w-3 h-3 bg-white/95 transform rotate-45 border-r border-b border-gray-200"
      style={{ 
        bottom: '-6px', 
        left: '50%', 
        marginLeft: '-6px' 
      }}
    ></div>
  </div>
)}

      </div>
    );
  }
);

export default ImageViewer;






//?v2.4(beta) update the ImageViewer component to preload images in the background after the initial render. (currently testing)
// import { memo, useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import SinglePage from './SinglePage';
// import LoadingSpinner from '../Common/LoadingSpinner';
// import { getImageUrl } from '../../services/imageService';

// const ImageViewer = memo(
//   ({ copyId, annotations, selectedTool, handleAnnotate, handleRemoveAnnotation, handleUpdateAnnotation, handleDrawAnnotation }) => {
//     const [zoom, setZoom] = useState(1);
//     const [containerWidth, setContainerWidth] = useState(1);
//     const [preloadedImages, setPreloadedImages] = useState({});
//     const containerRef = useRef(null);

//     // Generate pages 1 to 36
//     const pages = useMemo(() => Array.from({ length: 36 }, (_, i) => ({ page_number: i + 1 })), []);

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

//     // Preload images in the background
//     useEffect(() => {
//       const preloadImages = async () => {
//         const newPreloadedImages = {};
//         for (let i = 1; i <= 36; i++) {
//           const img = new Image();
//           img.src = getImageUrl(copyId, i);
//           await img.decode(); // Wait for the image to load
//           newPreloadedImages[i] = img.src;
//         }
//         setPreloadedImages(newPreloadedImages);
//       };

//       preloadImages();
//     }, [copyId]);

//     // Render pages
//     const renderedPages = useMemo(
//       () =>
//         pages.map(({ page_number }) => (
//           <SinglePage
//             key={page_number}
//             pageNumber={page_number}
//             imageUrl={preloadedImages[page_number] || getImageUrl(copyId, page_number)} // Use preloaded image if available
//             width={containerWidth * zoom}
//             height={containerWidth * zoom * 1.414} // A4 aspect ratio
//             onPageClick={(e) => handlePageClick(e, page_number)}
//             annotations={annotationsByPage[page_number] || []}
//             selectedTool={selectedTool}
//             handleRemoveAnnotation={handleRemoveAnnotation}
//             handleUpdateAnnotation={handleUpdateAnnotation}
//             handleDrawAnnotation={handleDrawAnnotation}
//           />
//         )),
//       [
//         pages,
//         copyId,
//         containerWidth,
//         zoom,
//         preloadedImages,
//         annotationsByPage,
//         selectedTool,
//         handleRemoveAnnotation,
//         handleUpdateAnnotation,
//         handleDrawAnnotation,
//       ]
//     );

//     return (
//       <div ref={containerRef} className="w-full h-full bg-white rounded-lg shadow-sm overflow-y-auto">
//         {/* Zoom Controls */}
//         <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-200 flex justify-end gap-2">
//           <button
//             onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
//             className="px-3 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//           >
//             -
//           </button>
//           <span className="px-3 py-0.5 bg-gray-100 rounded text-sm">{Math.round(zoom * 100)}%</span>
//           <button
//             onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}
//             className="px-3 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//           >
//             +
//           </button>
//         </div>

//         {pages.length === 0 ? <LoadingSpinner /> : renderedPages}
//       </div>
//     );
//   }
// );

// export default ImageViewer;
