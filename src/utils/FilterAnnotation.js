// Utility to separate annotations by type for database storage
const prepareAnnotationsForSave = (annotations) => {
    // Separate regular annotations from drawings
    const regularAnnotations = annotations.filter(
      (anno) => anno.type !== 'draw'
    );
  
    const drawAnnotations = annotations.filter(
      (anno) => anno.type === 'draw'
    );
  
    return {
      annotations: regularAnnotations,
      drawAnnotations: drawAnnotations,
    };
  };
  export default prepareAnnotationsForSave;