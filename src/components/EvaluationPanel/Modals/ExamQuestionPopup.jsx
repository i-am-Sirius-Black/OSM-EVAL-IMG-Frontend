
//?Stream images from server (working)

// import { useEffect, useState, useRef, forwardRef } from 'react';

// const ExamQuestionPopup = forwardRef(function ExamQuestionPopup({
//   isOpen,
//   onClose,
//   questionNumber = 1,
//   paperId,
//   partLetter = null,
//   position = 'right'
// }, ref) {
//   const [isZoomed, setIsZoomed] = useState(false);
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
//   const [imageUrl, setImageUrl] = useState(null);
//   const [imageLoading, setImageLoading] = useState(false);
//   const [imageError, setImageError] = useState(false);
//   const imageRef = useRef(null);
  
//   // Close popup when Escape key is pressed
//   useEffect(() => {
//     const handleEscapeKey = (e) => {
//       if (isOpen && e.key === 'Escape') {
//         if (isZoomed) {
//           setIsZoomed(false);
//         } else {
//           onClose();
//         }
//       }
//     };
    
//     window.addEventListener('keydown', handleEscapeKey);
//     return () => window.removeEventListener('keydown', handleEscapeKey);
//   }, [isOpen, onClose, isZoomed]);

//   // Load question image when popup opens
//   useEffect(() => {
//     if (isOpen && paperId && questionNumber) {
//       setImageLoading(true);
//       setImageError(false);
      
//       // Extract the base question number (remove letters for parts)
//       const baseQuestionNumber = questionNumber.toString().match(/^\d+/)?.[0];
      
//       // Build the streaming URL
//       const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//       let streamUrl = `${backendUrl}/api/question-images/stream/${paperId}/${baseQuestionNumber}`;
      
//       // Add part letter if this is a question part
//       if (partLetter) {
//         streamUrl += `?partLetter=${partLetter}`;
//       }
      
//       setImageUrl(streamUrl);
//     }
//   }, [isOpen, paperId, questionNumber, partLetter]);

//   // Reset states when popup closes
//   useEffect(() => {
//     if (!isOpen) {
//       setIsZoomed(false);
//       setImageUrl(null);
//       setImageError(false);
//       setImageLoading(false);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;
  
//   // Position styles
//   const positionStyles = {
//     right: 'right-10 top-1/2 transform -translate-y-1/2',
//     left: 'left-10 top-1/2 transform -translate-y-1/2',
//     center: 'left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
//   };

//   // Handle mouse move for zoom effect
//   const handleMouseMove = (e) => {
//     if (!isZoomed || !imageRef.current) return;
    
//     const rect = imageRef.current.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / rect.width;
//     const y = (e.clientY - rect.top) / rect.height;
    
//     setZoomPosition({ x, y });
//   };

//   // Toggle zoom on click
//   const handleImageClick = () => {
//     if (!imageError) {
//       setIsZoomed(!isZoomed);
//     }
//   };

//   // Handle image load success
//   const handleImageLoad = () => {
//     setImageLoading(false);
//     setImageError(false);
//   };

//   // Handle image load error
//   const handleImageError = () => {
//     setImageLoading(false);
//     setImageError(true);
//   };

//   return (
//     <div 
//       ref={ref}
//       className={`fixed ${positionStyles[position]} w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 pointer-events-auto`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-2 px-4 border-b border-gray-200">
//         <h3 className="font-medium text-gray-800 uppercase">
//           Question {questionNumber}
//         </h3>
//         <button 
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 focus:outline-none"
//         >
//           Close
//         </button>
//       </div>
      
//       {/* Content */}
//       <div 
//         className="relative overflow-hidden min-h-[200px] flex items-center justify-center"
//         style={{ cursor: imageError ? 'default' : (isZoomed ? 'zoom-out' : 'zoom-in') }}
//         onClick={handleImageClick}
//         onMouseMove={handleMouseMove}
//         ref={imageRef}
//       >
//         {/* Loading State */}
//         {imageLoading && (
//           <div className="flex flex-col items-center justify-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
//             <p className="text-sm text-gray-500">Loading image...</p>
//           </div>
//         )}

//         {/* Error State */}
//         {imageError && !imageLoading && (
//           <div className="flex flex-col items-center justify-center py-8 text-gray-500">
//             <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                 d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <p className="text-sm">No image available</p>
//             <p className="text-xs text-gray-400 mt-1">Question {questionNumber}</p>
//           </div>
//         )}

//         {/* Image */}
//         {imageUrl && !imageError && (
//           <img 
//             src={imageUrl} 
//             alt={`Question ${questionNumber}`} 
//             className={`w-full h-auto rounded transition-transform duration-100 ${isZoomed ? 'scale-200' : ''}`}
//             style={
//               isZoomed ? {
//                 transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`
//               } : {}
//             }
//             onLoad={handleImageLoad}
//             onError={handleImageError}
//             loading="lazy"
//           />
//         )}
//       </div>
//     </div>
//   );
// });

// export default ExamQuestionPopup;

//?v2- (testing) draggable, resizable window-style popup

// import { useEffect, useState, useRef, forwardRef } from 'react';

// const ExamQuestionWindow = forwardRef(function ExamQuestionWindow({
//   isOpen,
//   onClose,
//   questionNumber = 1,
//   paperId,
//   partLetter = null,
//   initialPosition = { x: 100, y: 100 },
//   initialSize = { width: 400, height: 500 }
// }, ref) {
//   const [position, setPosition] = useState(initialPosition);
//   const [size, setSize] = useState(initialSize);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isResizing, setIsResizing] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
//   const [imageUrl, setImageUrl] = useState(null);
//   const [imageLoading, setImageLoading] = useState(false);
//   const [imageError, setImageError] = useState(false);
  
//   const windowRef = useRef(null);
//   const headerRef = useRef(null);
//   const resizeRef = useRef(null);

//   // Close window when Escape key is pressed
//   useEffect(() => {
//     const handleEscapeKey = (e) => {
//       if (isOpen && e.key === 'Escape') {
//         onClose();
//       }
//     };
    
//     window.addEventListener('keydown', handleEscapeKey);
//     return () => window.removeEventListener('keydown', handleEscapeKey);
//   }, [isOpen, onClose]);

//   // Load question image when window opens
//   useEffect(() => {
//     if (isOpen && paperId && questionNumber) {
//       setImageLoading(true);
//       setImageError(false);
      
//       const baseQuestionNumber = questionNumber.toString().match(/^\d+/)?.[0];
//       const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//       let streamUrl = `${backendUrl}/api/question-images/stream/${paperId}/${baseQuestionNumber}`;
      
//       if (partLetter) {
//         streamUrl += `?partLetter=${partLetter}`;
//       }
      
//       setImageUrl(streamUrl);
//     }
//   }, [isOpen, paperId, questionNumber, partLetter]);

//   // Reset states when window closes
//   useEffect(() => {
//     if (!isOpen) {
//       setImageUrl(null);
//       setImageError(false);
//       setImageLoading(false);
//       setIsDragging(false);
//       setIsResizing(false);
//     }
//   }, [isOpen]);

//   // Mouse move handler for dragging and resizing
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (isDragging) {
//         setPosition({
//           x: e.clientX - dragStart.x,
//           y: e.clientY - dragStart.y
//         });
//       } else if (isResizing) {
//         const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x));
//         const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y));
//         setSize({ width: newWidth, height: newHeight });
//       }
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//       setIsResizing(false);
//     };

//     if (isDragging || isResizing) {
//       window.addEventListener('mousemove', handleMouseMove);
//       window.addEventListener('mouseup', handleMouseUp);
//       return () => {
//         window.removeEventListener('mousemove', handleMouseMove);
//         window.removeEventListener('mouseup', handleMouseUp);
//       };
//     }
//   }, [isDragging, isResizing, dragStart, resizeStart]);

//   // Handle drag start
//   const handleDragStart = (e) => {
//     if (e.target === headerRef.current || headerRef.current?.contains(e.target)) {
//       setIsDragging(true);
//       setDragStart({
//         x: e.clientX - position.x,
//         y: e.clientY - position.y
//       });
//     }
//   };

//   // Handle resize start
//   const handleResizeStart = (e) => {
//     e.stopPropagation();
//     setIsResizing(true);
//     setResizeStart({
//       x: e.clientX,
//       y: e.clientY,
//       width: size.width,
//       height: size.height
//     });
//   };

//   // Handle image load success
//   const handleImageLoad = () => {
//     setImageLoading(false);
//     setImageError(false);
//   };

//   // Handle image load error
//   const handleImageError = () => {
//     setImageLoading(false);
//     setImageError(true);
//   };

//   if (!isOpen) return null;

//   return (
//     <div 
//       ref={windowRef}
//       className="fixed bg-white rounded-lg shadow-2xl border border-gray-300 z-50 select-none"
//       style={{
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//         width: `${size.width}px`,
//         height: `${size.height}px`,
//         minWidth: '300px',
//         minHeight: '200px'
//       }}
//     >
//       {/* Window Header */}
//       <div 
//         ref={headerRef}
//         className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 rounded-t-lg cursor-move"
//         onMouseDown={handleDragStart}
//       >
//         <div className="flex items-center space-x-2">
//           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//           <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//           <h3 className="ml-2 font-medium text-gray-800 text-sm">
//             Question {questionNumber}
//           </h3>
//         </div>
//         <button 
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded hover:bg-gray-200"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       </div>
      
//       {/* Window Content */}
//       <div 
//         className="flex-1 overflow-auto p-4"
//         style={{ height: `${size.height - 60}px` }}
//       >
//         {/* Loading State */}
//         {imageLoading && (
//           <div className="flex flex-col items-center justify-center h-full">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
//             <p className="text-sm text-gray-500">Loading image...</p>
//           </div>
//         )}

//         {/* Error State */}
//         {imageError && !imageLoading && (
//           <div className="flex flex-col items-center justify-center h-full text-gray-500">
//             <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                 d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <p className="text-sm">No image available</p>
//             <p className="text-xs text-gray-400 mt-1">Question {questionNumber}</p>
//           </div>
//         )}

//         {/* Image */}
//         {imageUrl && !imageError && (
//           <div className="flex justify-center">
//             <img 
//               src={imageUrl} 
//               alt={`Question ${questionNumber}`} 
//               className="max-w-full h-auto rounded shadow-sm"
//               onLoad={handleImageLoad}
//               onError={handleImageError}
//               loading="lazy"
//             />
//           </div>
//         )}
//       </div>

//       {/* Resize Handle */}
//       <div 
//         ref={resizeRef}
//         className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
//         onMouseDown={handleResizeStart}
//       >
//         <div className="absolute bottom-1 right-1">
//           <div className="w-0 h-0 border-l-4 border-b-4 border-gray-400 border-l-transparent"></div>
//         </div>
//         <div className="absolute bottom-2 right-2">
//           <div className="w-0 h-0 border-l-3 border-b-3 border-gray-300 border-l-transparent"></div>
//         </div>
//       </div>
//     </div>
//   );
// });


// export default ExamQuestionWindow;


//?v3 - simple, optimized draggable window that reuses the same instance and just updates the image when clicking different questions.
// import { useEffect, useState, useRef, forwardRef } from 'react';

// const ExamQuestionWindow = forwardRef(function ExamQuestionWindow({
//   isOpen,
//   onClose,
//   questionNumber = 1,
//   paperId,
//   partLetter = null
// }, ref) {
//   const [position, setPosition] = useState({ x: 200, y: 100 });
//   const [size, setSize] = useState({ width: 600, height: 700 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [isResizing, setIsResizing] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
//   const [imageUrl, setImageUrl] = useState(null);
//   const [imageLoading, setImageLoading] = useState(false);
//   const [imageError, setImageError] = useState(false);
  
//   const windowRef = useRef(null);

//   // Close on Escape
//   useEffect(() => {
//     const handleEscapeKey = (e) => {
//       if (isOpen && e.key === 'Escape') {
//         onClose();
//       }
//     };
    
//     window.addEventListener('keydown', handleEscapeKey);
//     return () => window.removeEventListener('keydown', handleEscapeKey);
//   }, [isOpen, onClose]);

//   // Load image when question changes
//   useEffect(() => {
//     if (isOpen && paperId && questionNumber) {
//       setImageLoading(true);
//       setImageError(false);
      
//       const baseQuestionNumber = questionNumber.toString().match(/^\d+/)?.[0];
//       const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//       let streamUrl = `${backendUrl}/api/question-images/stream/${paperId}/${baseQuestionNumber}`;
      
//       if (partLetter) {
//         streamUrl += `?partLetter=${partLetter}`;
//       }
      
//       setImageUrl(streamUrl);
//     }
//   }, [isOpen, paperId, questionNumber, partLetter]);

//   // Mouse handlers
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (isDragging) {
//         setPosition({
//           x: e.clientX - dragStart.x,
//           y: e.clientY - dragStart.y
//         });
//       } else if (isResizing) {
//         const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x));
//         const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y));
//         setSize({ width: newWidth, height: newHeight });
//       }
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//       setIsResizing(false);
//     };

//     if (isDragging || isResizing) {
//       window.addEventListener('mousemove', handleMouseMove);
//       window.addEventListener('mouseup', handleMouseUp);
//       return () => {
//         window.removeEventListener('mousemove', handleMouseMove);
//         window.removeEventListener('mouseup', handleMouseUp);
//       };
//     }
//   }, [isDragging, isResizing, dragStart, resizeStart]);

//   const handleDragStart = (e) => {
//     setIsDragging(true);
//     setDragStart({
//       x: e.clientX - position.x,
//       y: e.clientY - position.y
//     });
//   };

//   const handleResizeStart = (e) => {
//     e.stopPropagation();
//     setIsResizing(true);
//     setResizeStart({
//       x: e.clientX,
//       y: e.clientY,
//       width: size.width,
//       height: size.height
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div 
//       ref={windowRef}
//       className="fixed bg-white rounded-lg shadow-xl border border-gray-300 z-50"
//       style={{
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//         width: `${size.width}px`,
//         height: `${size.height}px`
//       }}
//     >
//       {/* Header */}
//       <div 
//         className="flex items-center justify-between p-3 bg-gray-50 border-b rounded-t-lg cursor-move select-none"
//         onMouseDown={handleDragStart}
//       >
//         <h3 className="font-medium text-gray-800">
//           Question {questionNumber}{partLetter || ''}
//         </h3>
//         <button 
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200"
//         >
//           ✕
//         </button>
//       </div>
      
//       {/* Content */}
//       <div 
//         className="overflow-auto p-4"
//         style={{ height: `${size.height - 60}px` }}
//       >
//         {imageLoading && (
//           <div className="flex items-center justify-center h-full">
//             <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
//           </div>
//         )}

//         {imageError && !imageLoading && (
//           <div className="flex flex-col items-center justify-center h-full text-gray-500">
//             <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
//             </svg>
//             <p>Image not available</p>
//           </div>
//         )}

//         {imageUrl && !imageError && (
//           <img 
//             src={imageUrl} 
//             alt={`Question ${questionNumber}${partLetter || ''}`} 
//             className="w-full h-auto rounded"
//             onLoad={() => {
//               setImageLoading(false);
//               setImageError(false);
//             }}
//             onError={() => {
//               setImageLoading(false);
//               setImageError(true);
//             }}
//           />
//         )}
//       </div>

//       {/* Resize handle */}
//       <div 
//         className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
//         onMouseDown={handleResizeStart}
//       >
//         <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400"></div>
//       </div>
//     </div>
//   );
// });

// export default ExamQuestionWindow;

//?v4->

import { useEffect, useState, useRef, forwardRef } from 'react';

const ExamQuestionWindow = forwardRef(function ExamQuestionWindow({
  isOpen,
  onClose,
  questionNumber = 1,
  paperId,
  partLetter = null
}, ref) {
  const [position, setPosition] = useState({ x: 850, y: 50 });
  const [size, setSize] = useState({ width: 500, height: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const windowRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  // Load image when question changes
  useEffect(() => {
    if (isOpen && paperId && questionNumber) {
      setImageLoading(true);
      setImageError(false);
      
      const baseQuestionNumber = questionNumber.toString().match(/^\d+/)?.[0];
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      let streamUrl = `${backendUrl}/api/question-images/stream/${paperId}/${baseQuestionNumber}`;
      
      if (partLetter) {
        streamUrl += `?partLetter=${partLetter}`;
      }
      
      setImageUrl(streamUrl);
    }
  }, [isOpen, paperId, questionNumber, partLetter]);

  // Mouse handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      } else if (isResizing) {
        const newWidth = Math.max(500, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(400, resizeStart.height + (e.clientY - resizeStart.y));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={windowRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-300 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 bg-gray-50 border-b rounded-t-lg cursor-move select-none"
        onMouseDown={handleDragStart}
      >
        <h3 className="font-medium text-gray-800">
          Question {questionNumber}{partLetter || ''}
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500">Press ESC to close</span>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 flex items-center space-x-1"
          >
            <span className="text-xs">Close</span>
            <span>✕</span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div 
        className="overflow-auto p-4"
        style={{ height: `${size.height - 120}px` }}
      >
        {imageLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {imageError && !imageLoading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p>Image not available</p>
          </div>
        )}

        {imageUrl && !imageError && (
          <img 
            src={imageUrl} 
            alt={`Question ${questionNumber}${partLetter || ''}`} 
            className="w-full h-auto rounded"
            onLoad={() => {
              setImageLoading(false);
              setImageError(false);
            }}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
        )}
      </div>

      {/* Bottom bar with close button */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-t rounded-b-lg">
        <span className="text-xs text-gray-500">Drag header to move • Drag corner to resize</span>
        <button 
          onClick={onClose}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
        >
          Close Window
        </button>
      </div>

      {/* Resize handle */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeStart}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400"></div>
      </div>
    </div>
  );
});

export default ExamQuestionWindow;