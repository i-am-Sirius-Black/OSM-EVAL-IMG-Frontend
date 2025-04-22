// import { memo, useRef } from 'react';
// import { Page } from 'react-pdf';
// import checkImage from '/check.png';
// import cancelImage from '/cross.png';

// const SinglePage = memo(
//   ({ pageNumber, width, onPageClick, annotations, selectedTool, handleRemoveAnnotation }) => {
//     const pageRef = useRef(null);

//     const getPositionStyle = (position) => {
//       return {
//         position: 'absolute',
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//         transform: 'translate(-50%, -50%)',
//         width: '30px',
//         height: '30px',
//       };
//     };

//     return (
//       <div className="relative mb-6 bg-white rounded-md shadow-sm">
//         <Page
//           pageNumber={pageNumber}
//           width={width}
//           onClick={onPageClick}
//           onContextMenu={onPageClick}
//           renderAnnotationLayer={false}
//           renderTextLayer={false}
//           loading={null}
//           className="border border-gray-100"
//           inputRef={pageRef}
//         />
//         {annotations.map((a) => (
//           <div
//             key={a.id}
//             style={getPositionStyle(a.position)}
//             className="absolute cursor-pointer"
//             onClick={(e) => {
//               e.stopPropagation();
//               if (selectedTool === 'erase') {
//                 handleRemoveAnnotation(a.id);
//               }
//             }}
//           >
//             {a.type === 'comment' ? (
//               <div className=" h-auto w-max p-2 text-sm text-red-500 italic shadow-xl max-w-xs">
//                 <p className="capitalize font-medium">{a.position.text}</p>
//               </div>
//             ) : (
//               <img
//                 src={a.type === 'check' ? checkImage : cancelImage}
//                 alt={a.type === 'check' ? 'Check' : 'Cancel'}
//                 className="w-full h-full"
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   }
// );

// export default SinglePage;



//? stream image working fine
// import { memo, useRef, useEffect, useState } from 'react';
// import checkImage from '/check.png';
// import cancelImage from '/cross.png';
// import LoadingSpinner from '../Common/LoadingSpinner';

// // SinglePage component for rendering individual image pages
// const SinglePage = memo(
//   ({ pageNumber, imageUrl, width, onPageClick, annotations, selectedTool, handleRemoveAnnotation, handleUpdateAnnotation }) => {
//     const pageRef = useRef(null);
//     const [isVisible, setIsVisible] = useState(false);


//     // Lazy load images using Intersection Observer
//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//             observer.disconnect();
//           }
//         },
//         { threshold: 0.1 }
//       );

//       if (pageRef.current) {
//         observer.observe(pageRef.current);
//       }

//       return () => observer.disconnect();
//     }, []);

//     // Handle drawing updates (for 'draw' tool)
//     const handleMouseMove = (e) => {
//       if (selectedTool !== 'draw') return;
//       const rect = pageRef.current.getBoundingClientRect();
//       const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//       const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;
//       handleUpdateAnnotation(pageNumber, { x, y });
//     };

//     // Render annotations
//     const renderAnnotation = (annotation) => {
//       const { id, type, position, path, text } = annotation;
//       console.log(annotation);
      
//       const style = {
//         position: 'absolute',
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//         transform: 'translate(-50%, -50%)',
//       };

//       if (type === 'check') {
//         return (
//           <img
//             key={id}
//             src={checkImage}
//             alt="Check"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === 'cancel') {
//         return (
//           <img
//             key={id}
//             src={cancelImage}
//             alt="Cross"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === 'comment') {
//         return (
//           <div
//             key={id}
//             className="p-2 rounded text-xl font-semibold text-red-500 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           >
//             {text}
//           </div>
//         );
//       } else if (type === 'draw' && path) {
//         return (
//           <svg
//             key={id}
//             className="absolute top-0 left-0 w-full h-full pointer-events-none"
//             style={{ zIndex: 10 }}
//           >
//             <polyline
//               points={path.map((p) => `${p.x * width / 100},${p.y * width / 100}`).join(' ')}
//               stroke="red"
//               strokeWidth="2"
//               fill="none"
//             />
//           </svg>
//         );
//       }
//       return null;
//     };




// //?v2
// return (
  
//   <div className="relative mb-8"> {/* Increased bottom margin for page number */}
//     <div
//       ref={pageRef}
//       className="relative bg-white shadow-md mx-auto"
//       style={{ width: `${width}px` }}
//       onClick={onPageClick}
//       onMouseMove={selectedTool === 'draw' ? handleMouseMove : undefined}
//       onContextMenu={onPageClick}
//     >
//       {isVisible ? (
      
//         <img
//           src={imageUrl}
//           alt={`Page ${pageNumber}`}
//           style={{ width: '100%', display: 'block' }}
//           loading="lazy"
//         />
//       ) : (
//         <div style={{ width: '100%', height: `${width * 1.414}px`, background: '#f0f0f0' }} />
//       )}
//       {annotations.map(renderAnnotation)}
//     </div>
    
//     {/* Page number indicator */}
//     <div className="text-center mt-2 text-gray-500 text-sm">
//       Page {pageNumber}
//     </div>
//   </div>
// );


// //?old return
//     // return (
//     //   <div
//     //     ref={pageRef}
//     //     className="relative mb-4 bg-white shadow-md"
//     //     style={{ width: `${width}px`, margin: '0 auto' }}
//     //     onClick={onPageClick}
//     //     onMouseMove={selectedTool === 'draw' ? handleMouseMove : undefined}
//     //     onContextMenu={onPageClick}
//     //   >
//     //     {isVisible ? (
//     //       <>
//     //       <img
//     //         src={imageUrl}
//     //         alt={`Page ${pageNumber}`}
//     //         style={{ width: '100%', display: 'block' }}
//     //         loading="lazy"
//     //       />

          
//     //       </>
//     //     ) : (
//     //       <div style={{ width: '100%', height: `${width * 1.414}px`, background: '#f0f0f0' }} />
//     //     )}
//     //     {annotations.map(renderAnnotation)}
//     //   </div>
//     // );
//   }
// );

// export default SinglePage;


//?v2 with draggable comment
// import { memo, useRef, useEffect, useState, useCallback } from 'react';
// import checkImage from '/check.png';
// import cancelImage from '/cross.png';
// import LoadingSpinner from '../Common/LoadingSpinner';

// // SinglePage component for rendering individual image pages
// const SinglePage = memo(
//   ({ pageNumber, imageUrl, width, onPageClick, annotations, selectedTool, handleRemoveAnnotation, handleUpdateAnnotation }) => {
//     const pageRef = useRef(null);
//     const [isVisible, setIsVisible] = useState(false);
//     const dragState = useRef(null); // Track dragging state

//     // Lazy load images using Intersection Observer
//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//             observer.disconnect();
//           }
//         },
//         { threshold: 0.1 }
//       );

//       if (pageRef.current) {
//         observer.observe(pageRef.current);
//       }

//       return () => observer.disconnect();
//     }, []);

//     // Handle drawing updates (for 'draw' tool) and dragging
//     const handleMouseMove = useCallback(
//       (e) => {
//         if (selectedTool === 'draw') {
//           const rect = pageRef.current.getBoundingClientRect();
//           const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//           const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;
//           handleUpdateAnnotation(pageNumber, { x, y });
//         } else if (dragState.current) {
//           const rect = pageRef.current.getBoundingClientRect();
//           let x = ((e.clientX - rect.left) / rect.width) * 100;
//           let y = ((e.clientY - rect.top) / rect.height) * 100;
//           // Constrain x and y to 0-100%
//           x = Math.max(0, Math.min(100, Math.round(x * 10) / 10));
//           y = Math.max(0, Math.min(100, Math.round(y * 10) / 10));
//           dragState.current = { ...dragState.current, x, y, clientX: e.clientX, clientY: e.clientY };
//           // Update annotation position
//           handleUpdateAnnotation(dragState.current.id, { x, y });
//         }
//       },
//       [selectedTool, handleUpdateAnnotation, pageNumber]
//     );

//     // Stop dragging
//     const handleMouseUp = useCallback(() => {
//       if (dragState.current) {
//         // Finalize position
//         handleUpdateAnnotation(dragState.current.id, {
//           x: dragState.current.x,
//           y: dragState.current.y,
//         });
//         // Calculate drag distance to determine if it was a drag or click
//         const dx = Math.abs(dragState.current.clientX - dragState.current.startX);
//         const dy = Math.abs(dragState.current.clientY - dragState.current.startY);
//         dragState.current = { ...dragState.current, wasDragged: dx > 5 || dy > 5 };
//       }
//       // Remove global listeners
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     }, [handleUpdateAnnotation, handleMouseMove]);

//     // Start dragging
//     const startDragging = useCallback(
//       (e, annotationId) => {
//         e.stopPropagation(); // Prevent triggering onPageClick
//         const rect = pageRef.current.getBoundingClientRect();
//         const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//         const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;
//         dragState.current = {
//           id: annotationId,
//           x,
//           y,
//           startX: e.clientX,
//           startY: e.clientY,
//           clientX: e.clientX,
//           clientY: e.clientY,
//           wasDragged: false,
//         };
//         // Add global listeners for smooth dragging
//         window.addEventListener('mousemove', handleMouseMove);
//         window.addEventListener('mouseup', handleMouseUp);
//       },
//       [handleMouseMove, handleMouseUp]
//     );

//     // Handle click to remove annotation
//     const handleAnnotationClick = useCallback(
//       (e, id) => {
//         e.stopPropagation();
//         // Only remove if it wasn't a drag
//         if (!dragState.current?.wasDragged) {
//           handleRemoveAnnotation(id);
//         }
//         // Reset drag state after click
//         dragState.current = null;
//       },
//       [handleRemoveAnnotation]
//     );

//     // Render annotations
//     const renderAnnotation = (annotation) => {
//       const { id, type, position, path, text } = annotation;
//       const style = {
//         position: 'absolute',
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//         transform: 'translate(-50%, -50%)',
//       };

//       if (type === 'check') {
//         return (
//           <img
//             key={id}
//             src={checkImage}
//             alt="Check"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === 'cancel') {
//         return (
//           <img
//             key={id}
//             src={cancelImage}
//             alt="Cross"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === 'comment') {
//         return (
//           <div
//             key={id}
//             className="p-2 rounded text-xl font-semibold text-red-500 cursor-move select-none"
//             style={style}
//             onMouseDown={(e) => startDragging(e, id)}
//             onClick={(e) => handleAnnotationClick(e, id)}
//           >
//             {text}
//           </div>
//         );
//       } else if (type === 'draw' && path) {
//         return (
//           <svg
//             key={id}
//             className="absolute top-0 left-0 w-full h-full pointer-events-none"
//             style={{ zIndex: 10 }}
//           >
//             <polyline
//               points={path.map((p) => `${p.x * width / 100},${p.y * width / 100}`).join(' ')}
//               stroke="red"
//               strokeWidth="2"
//               fill="none"
//             />
//           </svg>
//         );
//       }
//       return null;
//     };

//     return (
//       <div className="relative mb-8">
//         <div
//           ref={pageRef}
//           className="relative bg-white shadow-md mx-auto"
//           style={{ width: `${width}px` }}
//           onClick={onPageClick}
//           onMouseMove={handleMouseMove}
//           onContextMenu={onPageClick}
//         >
//           {isVisible ? (
//             <img
//               src={imageUrl}
//               alt={`Page ${pageNumber}`}
//               style={{ width: '100%', display: 'block' }}
//               loading="lazy"
//             />
//           ) : (
//             <div style={{ width: '100%', height: `${width * 1.414}px`, background: '#f0f0f0' }} />
//           )}
//           {annotations.map(renderAnnotation)}
//         </div>
//         <div className="text-center mt-2 text-gray-500 text-sm">Page {pageNumber}</div>
//       </div>
//     );
//   }
// );

// export default SinglePage;

//?v3 with draw (bug-> only draws small area top left corner)
// First, let's update the SinglePage component to handle drawing:

// import { memo, useRef, useEffect, useState, useCallback } from 'react';
// import checkImage from '/check.png';
// import cancelImage from '/cross.png';
// import LoadingSpinner from '../Common/LoadingSpinner';

// // SinglePage component for rendering individual image pages
// const SinglePage = memo(
//   ({ pageNumber, imageUrl, width, onPageClick, annotations, selectedTool, handleRemoveAnnotation, handleAnnotate, handleUpdateAnnotation }) => {
//     const pageRef = useRef(null);
//     const [isVisible, setIsVisible] = useState(false);
//     const dragState = useRef(null); // Track dragging state
//     const isDrawing = useRef(false); // Track drawing state
//     const currentDrawingId = useRef(null); // Track current drawing annotation ID

//     // Lazy load images using Intersection Observer
//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//             observer.disconnect();
//           }
//         },
//         { threshold: 0.1 }
//       );

//       if (pageRef.current) {
//         observer.observe(pageRef.current);
//       }

//       return () => observer.disconnect();
//     }, []);

//     // Start drawing
//     const handleMouseDown = useCallback(
//       (e) => {
//       // Only proceed if left mouse button is pressed
//       if (e.button !== 0) return;
        
//         if (selectedTool === 'draw') {
//           e.preventDefault();
//           isDrawing.current = true;
          
//           const rect = pageRef.current.getBoundingClientRect();
//           const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//           const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;
          
//           // Create a new drawing annotation
//           currentDrawingId.current = `${pageNumber}-draw-${Date.now()}`;
//           const newAnnotation = {
//             id: currentDrawingId.current,
//             type: 'draw',
//             page: pageNumber,
//             position: { x, y, path: [{ x, y }] }
//           };
          
//           // Add the new annotation
//           handleAnnotate('draw', pageNumber, { x, y, path: [{ x, y }] });
//         }
//       },
//       [selectedTool, pageNumber, handleAnnotate]
//     );

//     // Handle drawing updates (for 'draw' tool) and dragging
//     const handleMouseMove = useCallback(
//       (e) => {
//         if (selectedTool === 'draw' && isDrawing.current && currentDrawingId.current) {
//           const rect = pageRef.current.getBoundingClientRect();
//           const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//           const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;
          
//           // Update the path of the current drawing annotation
//           handleUpdateAnnotation(currentDrawingId.current, { x, y });
//         } else if (dragState.current) {
//           const rect = pageRef.current.getBoundingClientRect();
//           let x = ((e.clientX - rect.left) / rect.width) * 100;
//           let y = ((e.clientY - rect.top) / rect.height) * 100;
//           // Constrain x and y to 0-100%
//           x = Math.max(0, Math.min(100, Math.round(x * 10) / 10));
//           y = Math.max(0, Math.min(100, Math.round(y * 10) / 10));
//           dragState.current = { ...dragState.current, x, y, clientX: e.clientX, clientY: e.clientY };
//           // Update annotation position
//           handleUpdateAnnotation(dragState.current.id, { x, y });
//         }
//       },
//       [selectedTool, handleUpdateAnnotation]
//     );

//     // Stop dragging or drawing
//     const handleMouseUp = useCallback(() => {
//       if (isDrawing.current) {
//         isDrawing.current = false;
//         currentDrawingId.current = null;
//       }
      
//       if (dragState.current) {
//         // Finalize position
//         handleUpdateAnnotation(dragState.current.id, {
//           x: dragState.current.x,
//           y: dragState.current.y,
//         });
//         // Calculate drag distance to determine if it was a drag or click
//         const dx = Math.abs(dragState.current.clientX - dragState.current.startX);
//         const dy = Math.abs(dragState.current.clientY - dragState.current.startY);
//         dragState.current = { ...dragState.current, wasDragged: dx > 5 || dy > 5 };
//       }
      
//       // Remove global listeners
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     }, [handleUpdateAnnotation, handleMouseMove]);

//     // Setup global event listeners for drawing outside the page
//     useEffect(() => {
//       if (isDrawing.current || dragState.current) {
//         window.addEventListener('mousemove', handleMouseMove);
//         window.addEventListener('mouseup', handleMouseUp);
        
//         return () => {
//           window.removeEventListener('mousemove', handleMouseMove);
//           window.removeEventListener('mouseup', handleMouseUp);
//         };
//       }
//     }, [handleMouseMove, handleMouseUp, isDrawing.current, dragState.current]);

//     // Start dragging
//     const startDragging = useCallback(
//       (e, annotationId) => {
//         e.stopPropagation(); // Prevent triggering onPageClick
//         const rect = pageRef.current.getBoundingClientRect();
//         const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//         const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;
//         dragState.current = {
//           id: annotationId,
//           x,
//           y,
//           startX: e.clientX,
//           startY: e.clientY,
//           clientX: e.clientX,
//           clientY: e.clientY,
//           wasDragged: false,
//         };
//         // Add global listeners for smooth dragging
//         window.addEventListener('mousemove', handleMouseMove);
//         window.addEventListener('mouseup', handleMouseUp);
//       },
//       [handleMouseMove, handleMouseUp]
//     );

//     // Handle click to remove annotation
//     const handleAnnotationClick = useCallback(
//       (e, id) => {
//         e.stopPropagation();
//         // Only remove if it wasn't a drag
//         if (!dragState.current?.wasDragged) {
//           handleRemoveAnnotation(id);
//         }
//         // Reset drag state after click
//         dragState.current = null;
//       },
//       [handleRemoveAnnotation]
//     );

//     // Render annotations
//     const renderAnnotation = (annotation) => {
//       const { id, type, position, text } = annotation;
//       const style = {
//         position: 'absolute',
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//         transform: 'translate(-50%, -50%)',
//       };

//       if (type === 'check') {
//         return (
//           <img
//             key={id}
//             src={checkImage}
//             alt="Check"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === 'cancel') {
//         return (
//           <img
//             key={id}
//             src={cancelImage}
//             alt="Cross"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === 'comment') {
//         return (
//           <div
//             key={id}
//             className="p-2 rounded text-xl font-semibold text-red-500 cursor-move select-none"
//             style={style}
//             onMouseDown={(e) => startDragging(e, id)}
//             onClick={(e) => handleAnnotationClick(e, id)}
//           >
//             {text}
//           </div>
//         );
//       } else if (type === 'draw' && position.path) {
//         return (
//           <svg
//             key={id}
//             className="absolute top-0 left-0 w-full h-full pointer-events-none"
//             style={{ zIndex: 10 }}
//           >
//             <polyline
//             points={position.path.map((p) => `${p.x},${p.y}`).join(' ')}
//             stroke="red"
//             strokeWidth="2"
//             fill="none"
//           />


//           </svg>
//         );
//       }
//       return null;
//     };

//     return (
//       <div className="relative mb-8">
//         <div
//           ref={pageRef}
//           className="relative bg-white shadow-md mx-auto"
//           style={{ width: `${width}px` }}
//           onClick={onPageClick}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onContextMenu={onPageClick}
//         >
//           {isVisible ? (
//             <img
//               src={imageUrl}
//               alt={`Page ${pageNumber}`}
//               style={{ width: '100%', display: 'block' }}
//               loading="lazy"
//             />
//           ) : (
//             <div style={{ width: '100%', height: `${width * 1.414}px`, background: '#f0f0f0' }} />
//           )}
//           {annotations.map(renderAnnotation)}
//         </div>
//         <div className="text-center mt-2 text-gray-500 text-sm">Page {pageNumber}</div>
//       </div>
//     );
//   }
// );

// export default SinglePage;


//? fixing draw bug

// import { memo, useRef, useEffect, useState, useCallback } from 'react';
// import checkImage from '/check.png';
// import cancelImage from '/cross.png';
// import LoadingSpinner from '../Common/LoadingSpinner';

// const SinglePage = memo(
//   ({ pageNumber, imageUrl, width, onPageClick, annotations, selectedTool, handleRemoveAnnotation, handleAnnotate, handleUpdateAnnotation }) => {
//     const pageRef = useRef(null);
//     const [isVisible, setIsVisible] = useState(false);
//     const dragState = useRef(null);
//     const isDrawing = useRef(false);
//     const currentDrawingId = useRef(null);
//     const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });

//     // Lazy load images and track page dimensions
//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//             observer.disconnect();
//           }
//         },
//         { threshold: 0.1 }
//       );

//       if (pageRef.current) {
//         observer.observe(pageRef.current);
//         // Set initial dimensions
//         const updateDimensions = () => {
//           const rect = pageRef.current.getBoundingClientRect();
//           setPageDimensions({
//             width: rect.width,
//             height: rect.height
//           });
//         };
//         updateDimensions();
//         window.addEventListener('resize', updateDimensions);
//         return () => {
//           observer.disconnect();
//           window.removeEventListener('resize', updateDimensions);
//         };
//       }
//     }, []);

//     // Convert mouse coordinates to percentage
//     const getPositionPercentage = useCallback((clientX, clientY) => {
//       if (!pageRef.current) return { x: 0, y: 0 };
      
//       const rect = pageRef.current.getBoundingClientRect();
//       const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
//       const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
      
//       return {
//         x: Math.round(x * 10) / 10,
//         y: Math.round(y * 10) / 10
//       };
//     }, []);

//     // Start drawing
//     const handleMouseDown = useCallback(
//       (e) => {
//         if (e.button !== 0) return;
        
//         if (selectedTool === 'draw') {
//           e.preventDefault();
//           isDrawing.current = true;
          
//           const { x, y } = getPositionPercentage(e.clientX, e.clientY);
          
//           currentDrawingId.current = `${pageNumber}-draw-${Date.now()}`;
//           const newAnnotation = {
//             id: currentDrawingId.current,
//             type: 'draw',
//             page: pageNumber,
//             position: { 
//               x, 
//               y, 
//               path: [{ x, y }],
//               pageWidth: pageDimensions.width,
//               pageHeight: pageDimensions.height
//             }
//           };
          
//           handleAnnotate('draw', pageNumber, newAnnotation.position);
//         }
//       },
//       [selectedTool, pageNumber, handleAnnotate, getPositionPercentage, pageDimensions]
//     );

//     // Handle drawing updates
//     const handleMouseMove = useCallback(
//       (e) => {
//         if (selectedTool === 'draw' && isDrawing.current && currentDrawingId.current) {
//           const { x, y } = getPositionPercentage(e.clientX, e.clientY);
//           handleUpdateAnnotation(currentDrawingId.current, { x, y });
//         } else if (dragState.current) {
//           const { x, y } = getPositionPercentage(e.clientX, e.clientY);
//           dragState.current = { 
//             ...dragState.current, 
//             x, 
//             y, 
//             clientX: e.clientX, 
//             clientY: e.clientY 
//           };
//           handleUpdateAnnotation(dragState.current.id, { x, y });
//         }
//       },
//       [selectedTool, handleUpdateAnnotation, getPositionPercentage]
//     );

//     // Stop drawing/dragging
//     const handleMouseUp = useCallback(() => {
//       if (isDrawing.current) {
//         isDrawing.current = false;
//         currentDrawingId.current = null;
//       }
      
//       if (dragState.current) {
//         const dx = Math.abs(dragState.current.clientX - dragState.current.startX);
//         const dy = Math.abs(dragState.current.clientY - dragState.current.startY);
//         dragState.current = { ...dragState.current, wasDragged: dx > 5 || dy > 5 };
//       }
      
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     }, [handleMouseMove]);

//     // Setup global event listeners
//     useEffect(() => {
//       if (isDrawing.current || dragState.current) {
//         window.addEventListener('mousemove', handleMouseMove);
//         window.addEventListener('mouseup', handleMouseUp);
        
//         return () => {
//           window.removeEventListener('mousemove', handleMouseMove);
//           window.removeEventListener('mouseup', handleMouseUp);
//         };
//       }
//     }, [handleMouseMove, handleMouseUp, isDrawing.current, dragState.current]);

//     const startDragging = useCallback(
//       (e, annotationId) => {
//         e.stopPropagation();
//         const { x, y } = getPositionPercentage(e.clientX, e.clientY);
//         dragState.current = {
//           id: annotationId,
//           x,
//           y,
//           startX: e.clientX,
//           startY: e.clientY,
//           clientX: e.clientX,
//           clientY: e.clientY,
//           wasDragged: false,
//         };
//         window.addEventListener('mousemove', handleMouseMove);
//         window.addEventListener('mouseup', handleMouseUp);
//       },
//       [handleMouseMove, handleMouseUp, getPositionPercentage]
//     );

//     const handleAnnotationClick = useCallback(
//       (e, id) => {
//         e.stopPropagation();
//         if (!dragState.current?.wasDragged) {
//           handleRemoveAnnotation(id);
//         }
//         dragState.current = null;
//       },
//       [handleRemoveAnnotation]
//     );

//     // Render annotations
//     const renderAnnotation = (annotation) => {
//       const { id, type, position, text } = annotation;
//       const style = {
//         position: 'absolute',
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//         transform: 'translate(-50%, -50%)',
//       };

//       if (type === 'check') {
//         return (
//           <img
//             key={id}
//             src={checkImage}
//             alt="Check"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === 'cancel') {
//         return (
//           <img
//             key={id}
//             src={cancelImage}
//             alt="Cross"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === 'comment') {
//         return (
//           <div
//             key={id}
//             className="p-2 rounded text-xl font-semibold text-red-500 cursor-move select-none"
//             style={style}
//             onMouseDown={(e) => startDragging(e, id)}
//             onClick={(e) => handleAnnotationClick(e, id)}
//           >
//             {text}
//           </div>
//         );
//       } else if (type === 'draw' && position.path) {
//         // Convert percentage coordinates to pixel coordinates for SVG
//         const points = position.path.map(p => {
//           const x = (p.x / 100) * pageDimensions.width;
//           const y = (p.y / 100) * pageDimensions.height;
//           return `${x},${y}`;
//         }).join(' ');

//         return (
//           <svg
//             key={id}
//             className="absolute top-0 left-0 w-full h-full pointer-events-none"
//             style={{ zIndex: 10 }}
//             viewBox={`0 0 ${pageDimensions.width} ${pageDimensions.height}`}
//             preserveAspectRatio="none"
//           >
//             <polyline
//               points={points}
//               stroke="red"
//               strokeWidth="2"
//               fill="none"
//             />
//           </svg>
//         );
//       }
//       return null;
//     };

//     return (
//       <div className="relative mb-8">
//         <div
//           ref={pageRef}
//           className={`relative bg-white shadow-md mx-auto ${
//             selectedTool === 'draw' ? 'draw-cursor' : 'cursor-pointer'
//           }`}
//           style={{ width: `${width}px` }}
//           onClick={onPageClick}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onContextMenu={onPageClick}
//         >
//           {isVisible ? (
//             <img
//               src={imageUrl}
//               alt={`Page ${pageNumber}`}
//               style={{ width: '100%', display: 'block' }}
//               loading="lazy"
//             />
//           ) : (
//             <div style={{ width: '100%', height: `${width * 1.414}px`, background: '#f0f0f0' }} />
//           )}
//           {annotations.map(renderAnnotation)}
//         </div>
//         <div className="text-center mt-2 text-gray-500 text-sm">Page {pageNumber}</div>
//       </div>
//     );
//   }
// );

// export default SinglePage;

//??? fixed draw bug --- working


import { memo, useRef, useEffect, useState, useCallback } from 'react';
import checkImage from '/check.png';
import cancelImage from '/cross.png';
import LoadingSpinner from '../Common/LoadingSpinner';

const SinglePage = memo(
  ({ pageNumber, imageUrl, width, onPageClick, annotations, selectedTool, handleRemoveAnnotation, handleAnnotate, handleUpdateAnnotation }) => {
    const pageRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const dragState = useRef(null);
    const isDrawing = useRef(false);
    const currentDrawingId = useRef(null);
    const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });

    // Lazy load images and track page dimensions
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (pageRef.current) {
        observer.observe(pageRef.current);
        // Set initial dimensions
        const updateDimensions = () => {
          const rect = pageRef.current.getBoundingClientRect();
          setPageDimensions({
            width: rect.width,
            height: rect.height
          });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => {
          observer.disconnect();
          window.removeEventListener('resize', updateDimensions);
        };
      }
    }, []);

    // Convert mouse coordinates to percentage
    const getPositionPercentage = useCallback((clientX, clientY) => {
      if (!pageRef.current) return { x: 0, y: 0 };
      
      const rect = pageRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
      
      return {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10
      };
    }, []);



    // Handle drawing updates
    const handleMouseMove = useCallback(
      (e) => {
        if (selectedTool === 'draw' && isDrawing.current && currentDrawingId.current) {
          const { x, y } = getPositionPercentage(e.clientX, e.clientY);
          handleUpdateAnnotation(currentDrawingId.current, { x, y });
        } else if (dragState.current) {
          const { x, y } = getPositionPercentage(e.clientX, e.clientY);
          dragState.current = { 
            ...dragState.current, 
            x, 
            y, 
            clientX: e.clientX, 
            clientY: e.clientY 
          };
          handleUpdateAnnotation(dragState.current.id, { x, y });
        }
      },
      [selectedTool, handleUpdateAnnotation, getPositionPercentage]
    );

    // Stop drawing/dragging
    const handleMouseUp = useCallback(() => {
      if (isDrawing.current) {
        isDrawing.current = false;
        currentDrawingId.current = null;
      }
    
      if (dragState.current) {
        const dx = Math.abs(dragState.current.clientX - dragState.current.startX);
        const dy = Math.abs(dragState.current.clientY - dragState.current.startY);
        dragState.current = { ...dragState.current, wasDragged: dx > 5 || dy > 5 };
      }
    
      // ✅ Always remove listeners after mouse up
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);


        // Start drawing
        const handleMouseDown = useCallback(
          (e) => {
            if (e.button !== 0) return;
        
            if (selectedTool === 'draw') {
              e.preventDefault();
              isDrawing.current = true;
        
              const { x, y } = getPositionPercentage(e.clientX, e.clientY);
              currentDrawingId.current = `${pageNumber}-draw-${Date.now()}`;
        
              const newAnnotation = {
                id: currentDrawingId.current,
                type: 'draw',
                page: pageNumber,
                position: { 
                  x, 
                  y, 
                  path: [{ x, y }],
                  pageWidth: pageDimensions.width,
                  pageHeight: pageDimensions.height
                }
              };
        
              handleAnnotate('draw', pageNumber, newAnnotation.position);
        
              // ✅ Immediately attach listeners when drawing starts
              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }
          },
          [selectedTool, pageNumber, handleAnnotate, getPositionPercentage, pageDimensions, handleMouseMove, handleMouseUp]
        );
        
    

    // Setup global event listeners
    useEffect(() => {
      if (isDrawing.current || dragState.current) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [handleMouseMove, handleMouseUp, isDrawing.current, dragState.current]);

    const startDragging = useCallback(
      (e, annotationId) => {
        e.stopPropagation();
        const { x, y } = getPositionPercentage(e.clientX, e.clientY);
        dragState.current = {
          id: annotationId,
          x,
          y,
          startX: e.clientX,
          startY: e.clientY,
          clientX: e.clientX,
          clientY: e.clientY,
          wasDragged: false,
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      },
      [handleMouseMove, handleMouseUp, getPositionPercentage]
    );

    const handleAnnotationClick = useCallback(
      (e, id) => {
        e.stopPropagation();
        if (!dragState.current?.wasDragged) {
          handleRemoveAnnotation(id);
        }
        dragState.current = null;
      },
      [handleRemoveAnnotation]
    );

    // Render annotations
    const renderAnnotation = (annotation) => {
      const { id, type, position, text } = annotation;
      const style = {
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      };

      if (type === 'check') {
        return (
          <img
            key={id}
            src={checkImage}
            alt="Check"
            className="w-6 h-6 cursor-pointer"
            style={style}
            onClick={() => handleRemoveAnnotation(id)}
          />
        );
      } else if (type === 'cancel') {
        return (
          <img
            key={id}
            src={cancelImage}
            alt="Cross"
            className="w-6 h-6 cursor-pointer"
            style={style}
            onClick={() => handleRemoveAnnotation(id)}
          />
        );
      } else if (type === 'comment') {
        return (
          <div
            key={id}
            className="p-2 rounded text-xl font-semibold text-red-500 cursor-move select-none"
            style={style}
            onMouseDown={(e) => startDragging(e, id)}
            onClick={(e) => handleAnnotationClick(e, id)}
          >
            {text}
          </div>
        );
      } else if (type === 'draw' && position.path) {
        // Convert percentage coordinates to pixel coordinates for SVG
        const points = position.path.map(p => {
          const x = (p.x / 100) * pageDimensions.width;
          const y = (p.y / 100) * pageDimensions.height;
          return `${x},${y}`;
        }).join(' ');

        return (
          <svg
            key={id}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
            viewBox={`0 0 ${pageDimensions.width} ${pageDimensions.height}`}
            preserveAspectRatio="none"
          >
            <polyline
              points={points}
              stroke="red"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
      }
      return null;
    };

    return (
      <div className="relative mb-8">
        <div
          ref={pageRef}
          className={`relative bg-white shadow-md mx-auto ${
            selectedTool === 'draw' ? 'draw-cursor' : 'cursor-pointer'
          }`}
          style={{ width: `${width}px` }}
          onClick={onPageClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onContextMenu={onPageClick}
        >
          {isVisible ? (
            <img
              src={imageUrl}
              alt={`Page ${pageNumber}`}
              style={{ width: '100%', display: 'block' }}
              loading="lazy"
            />
          ) : (
            <div style={{ width: '100%', height: `${width * 1.414}px`, background: '#f0f0f0' }} />
          )}
          {annotations.map(renderAnnotation)}
        </div>
        <div className="text-center mt-2 text-gray-500 text-sm">Page {pageNumber}</div>
      </div>
    );
  }
);

export default SinglePage;



