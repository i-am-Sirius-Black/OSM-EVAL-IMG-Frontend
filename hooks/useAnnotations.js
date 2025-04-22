// import { useState, useCallback } from 'react';

// const useAnnotations = () => {
//   const [annotations, setAnnotations] = useState([]);
//   const [selectedTool, setSelectedTool] = useState(null);

//   // Add annotation
//   const handleAnnotate = useCallback((type, pageNumber, position, text = '') => {
//     console.log("handle annotate type, pageNumber, position, text->", type, pageNumber, position, text);
    
//     const newAnnotation = {
//       id: `${pageNumber}-${Date.now()}`,
//       type,
//       page: pageNumber,
//       position,
//       text,
//     };
//     setAnnotations((prev) => [...prev, newAnnotation]);
//   }, []);

//   // Remove annotation by ID
//   const handleRemoveAnnotation = useCallback((id) => {
//     setAnnotations((prev) => prev.filter((a) => a.id !== id));
//   }, []);

//   // Remove last annotation
//   const handleRemoveLastAnnotation = useCallback(() => {
//     setAnnotations((prev) => prev.slice(0, -1));
//   }, []);

//   // Update annotation position (for dragging)
//   const handleUpdateAnnotation = useCallback((id, newPosition) => {
//     setAnnotations((prev) =>
//       prev.map((a) => (a.id === id ? { ...a, position: newPosition } : a))
//     );
//   }, []);

//   return {
//     annotations,
//     setAnnotations,
//     selectedTool,
//     setSelectedTool,
//     handleAnnotate,
//     handleRemoveAnnotation,
//     handleRemoveLastAnnotation,
//     handleUpdateAnnotation,
//   };
// };

// export default useAnnotations;


//? for dragging comment

// import { useState, useCallback } from 'react';

// const useAnnotations = () => {
//   const [annotations, setAnnotations] = useState([]);
//   const [selectedTool, setSelectedTool] = useState(null);

//   // Add annotation
//   const handleAnnotate = useCallback((type, pageNumber, position, text = '') => {
//     const newAnnotation = {
//       id: `${pageNumber}-${Date.now()}`,
//       type,
//       page: pageNumber,
//       position,
//       text,
//     };
//     setAnnotations((prev) => [...prev, newAnnotation]);
//   }, []);

//   // Remove annotation by ID
//   const handleRemoveAnnotation = useCallback((id) => {
//     setAnnotations((prev) => prev.filter((a) => a.id !== id));
//   }, []);

//   // Remove last annotation
//   const handleRemoveLastAnnotation = useCallback(() => {
//     setAnnotations((prev) => prev.slice(0, -1));
//   }, []);

//   // Update annotation (for dragging or drawing)
//   const handleUpdateAnnotation = useCallback((id, updates) => {
//     setAnnotations((prev) =>
//       prev.map((a) =>
//         a.id === id
//           ? {
//               ...a,
//               position: updates.x !== undefined && updates.y !== undefined
//                 ? { x: updates.x, y: updates.y }
//                 : { ...a.position, path: [...(a.position.path || []), updates] },
//             }
//           : a
//       )
//     );
//   }, []);

//   return {
//     annotations,
//     setAnnotations,
//     selectedTool,
//     setSelectedTool,
//     handleAnnotate,
//     handleRemoveAnnotation,
//     handleRemoveLastAnnotation,
//     handleUpdateAnnotation,
//   };
// };

// export default useAnnotations;


//? v3 drawing line
// Finally, let's update the useAnnotations hook to better handle drawing annotations:

import { useState, useCallback } from 'react';

const useAnnotations = () => {
  const [annotations, setAnnotations] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);

  // Add annotation
  const handleAnnotate = useCallback((type, pageNumber, position, text = '') => {
    const newAnnotation = {
      id: `${pageNumber}-${type}-${Date.now()}`,
      type,
      page: pageNumber,
      position,
      text,
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
    return newAnnotation.id; // Return the ID for reference
  }, []);

  // Remove annotation by ID
  const handleRemoveAnnotation = useCallback((id) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Remove last annotation
  const handleRemoveLastAnnotation = useCallback(() => {
    setAnnotations((prev) => prev.slice(0, -1));
  }, []);

  // Update annotation (for dragging or drawing)
  const handleUpdateAnnotation = useCallback((id, updates) => {
    setAnnotations((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        
        // Handle drawing updates
        if (a.type === 'draw' && updates.x !== undefined && updates.y !== undefined) {
          return {
            ...a,
            position: {
              ...a.position,
              path: [...(a.position.path || []), { x: updates.x, y: updates.y }]
            }
          };
        }
        
        // Handle position updates (dragging)
        return {
          ...a,
          position: updates.x !== undefined && updates.y !== undefined
            ? { ...a.position, x: updates.x, y: updates.y }
            : a.position
        };
      })
    );
  }, []);

  return {
    annotations,
    setAnnotations,
    selectedTool,
    setSelectedTool,
    handleAnnotate,
    handleRemoveAnnotation,
    handleRemoveLastAnnotation,
    handleUpdateAnnotation,
  };
};

export default useAnnotations;

