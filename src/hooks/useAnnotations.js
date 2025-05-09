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

//?v1.1 seprating out the logic of the drawing annotations(currently working)

import { useState, useCallback } from 'react';

const useAnnotations = () => {
  const [annotations, setAnnotations] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  
  // Add regular annotation
  const handleAnnotate = useCallback((type, pageNumber, position, text = '') => {
    // Skip draw annotations as they're handled separately
    if (type === 'draw') return;
    
    const newAnnotation = {
      id: `${pageNumber}-${Date.now()}`,
      type,
      page: pageNumber,
      position,
      text,
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
  }, []);

  // Special handler for draw annotations to manage them as single units
  const handleDrawAnnotation = useCallback((action, id, pageNumber, path) => {
    if (action === 'start') {
      // Create a new drawing annotation
      const newAnnotation = {
        id,
        type: 'draw',
        page: pageNumber,
        position: { path },
        text: '',
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
      
    } else if (action === 'update') {
      // Update existing drawing annotation
      setAnnotations((prev) => 
        prev.map((a) => 
          a.id === id ? { ...a, position: { ...a.position, path } } : a
        )
      );
    } else if (action === 'end') {
      // Finalize the drawing annotation (no changes needed here as we've been updating it)
      setAnnotations((prev) => 
        prev.map((a) => 
          a.id === id ? { ...a, position: { ...a.position, path } } : a
        )
      );
    }
  }, []);

  // Remove annotation by ID
  const handleRemoveAnnotation = useCallback((id) => {
    console.log("Removing annotation with ID:", id);
    
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Remove last annotation
  const handleRemoveLastAnnotation = useCallback(() => {
    setAnnotations((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  // Update annotation position (for dragging)
  const handleUpdateAnnotation = useCallback((id, newPosition) => {
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, position: newPosition } : a))
    );
  }, []);

  return {
    annotations,
    setAnnotations,
    selectedTool,
    setSelectedTool,
    handleAnnotate,
    handleDrawAnnotation,
    handleRemoveAnnotation,
    handleRemoveLastAnnotation,
    handleUpdateAnnotation,
  };
};

export default useAnnotations;