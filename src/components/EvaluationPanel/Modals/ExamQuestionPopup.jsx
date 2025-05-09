// import { useEffect } from 'react';

// export default function ExamQuestionPopup({
//   isOpen,
//   onClose,
//   questionNumber = 1,
//   questionImageUrl,
//   position = 'right'
// }) {
//   // Close popup when Escape key is pressed
//   useEffect(() => {
//     const handleEscapeKey = (e) => {
//       if (isOpen && e.key === 'Escape') {
//         onClose();
//       }
//     };
    
//     window.addEventListener('keydown', handleEscapeKey);
//     return () => window.removeEventListener('keydown', handleEscapeKey);
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;
  
//   // Position styles
//   const positionStyles = {
//     right: 'right-10 top-1/2 transform -translate-y-1/2',
//     left: 'left-10 top-1/2 transform -translate-y-1/2',
//     center: 'left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
//   };

//   return (
//     <div className={`fixed ${positionStyles[position]} w-90 bg-white rounded-lg shadow-lg border border-gray-200 z-50 pointer-events-auto`}>
//       {/* Header */}
//       <div className="flex items-center justify-between p-2 px-4 border-b border-gray-200">
//         <h3 className="font-medium text-gray-800 uppercase"> {questionNumber}</h3>
//         <button 
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 focus:outline-none"
//         >
//          Close
//         </button>
//       </div>
      
//       {/* Content */}
//       <div className="">
//         {/* Image for exam question */}
//         <img 
//           src={questionImageUrl} 
//           alt={`Exam Question ${questionNumber}`} 
//           className="w-full h-auto rounded"
//         />
//       </div>
//     </div>
//   );
// }





//? zoom in and out

// import { useEffect, useState, useRef } from 'react';

// export default function ExamQuestionPopup({
//   isOpen,
//   onClose,
//   questionNumber = 1,
//   questionImageUrl,
//   position = 'right'
// }) {
//   const [isZoomed, setIsZoomed] = useState(false);
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
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
    
//     // Get image dimensions and position
//     const rect = imageRef.current.getBoundingClientRect();
    
//     // Calculate relative mouse position within image (0 to 1)
//     const x = (e.clientX - rect.left) / rect.width;
//     const y = (e.clientY - rect.top) / rect.height;
    
//     // Update zoom position
//     setZoomPosition({ x, y });
//   };

//   // Toggle zoom on click
//   const handleImageClick = () => {
//     setIsZoomed(!isZoomed);
//   };

//   return (
//     <div className={`fixed ${positionStyles[position]} w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 pointer-events-auto`}>
//       {/* Header */}
//       <div className="flex items-center justify-between p-2 px-4 border-b border-gray-200">
//         <h3 className="font-medium text-gray-800 uppercase"> {questionNumber}</h3>
//         <button 
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 focus:outline-none"
//         >
//          Close
//         </button>
//       </div>
      
//       {/* Content */}
//       <div 
//         className="relative overflow-hidden"
//         style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
//         onClick={handleImageClick}
//         onMouseMove={handleMouseMove}
//         ref={imageRef}
//       >
//         {/* Image for exam question */}
//         <img 
//           src={questionImageUrl} 
//           alt={`Exam Question ${questionNumber}`} 
//           className={`w-full h-auto rounded transition-transform duration-100 ${isZoomed ? 'scale-200' : ''}`}
//           style={
//             isZoomed ? {
//               transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`
//             } : {}
//           }
//         />
//       </div>
//     </div>
//   );
// }



//? popup ref close when clicked outside

import { useEffect, useState, useRef, forwardRef } from 'react';

const ExamQuestionPopup = forwardRef(function ExamQuestionPopup({
  isOpen,
  onClose,
  questionNumber = 1,
  questionImageUrl,
  position = 'right'
}, ref) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  
  // Close popup when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (isOpen && e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose, isZoomed]);

  if (!isOpen) return null;
  
  // Position styles
  const positionStyles = {
    right: 'right-10 top-1/2 transform -translate-y-1/2',
    left: 'left-10 top-1/2 transform -translate-y-1/2',
    center: 'left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  // Handle mouse move for zoom effect
  const handleMouseMove = (e) => {
    if (!isZoomed || !imageRef.current) return;
    
    // Get image dimensions and position
    const rect = imageRef.current.getBoundingClientRect();
    
    // Calculate relative mouse position within image (0 to 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Update zoom position
    setZoomPosition({ x, y });
  };

  // Toggle zoom on click
  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div 
      ref={ref}
      className={`fixed ${positionStyles[position]} w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 pointer-events-auto`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 px-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-800 uppercase"> {questionNumber}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
         Close
        </button>
      </div>
      
      {/* Content */}
      <div 
        className="relative overflow-hidden"
        style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
        onClick={handleImageClick}
        onMouseMove={handleMouseMove}
        ref={imageRef}
      >
        {/* Image for exam question */}
        <img 
          src={questionImageUrl} 
          alt={`Exam Question ${questionNumber}`} 
          className={`w-full h-auto rounded transition-transform duration-100 ${isZoomed ? 'scale-200' : ''}`}
          style={
            isZoomed ? {
              transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`
            } : {}
          }
        />
      </div>
    </div>
  );
});

export default ExamQuestionPopup;