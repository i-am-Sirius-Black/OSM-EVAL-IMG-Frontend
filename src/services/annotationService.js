import api from '../api/axios.js';

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
    drawAnnotations: drawAnnotations
  };
};

// Save annotations to the backend
export const saveAnnotations = async (copyId, annotations) => {
  try {
    const preparedData = prepareAnnotationsForSave(annotations);
    console.log('Prepared data for save:', preparedData);
    
    
    const response = await api.post('/api/annotations/save', {
      copyId,
      ...preparedData
    });
    return response;
  } catch (error) {
    console.error('Error saving annotations:', error);
    throw error;
  }
};

// Load annotations from the backend
export const loadAnnotations = async (copyId) => {
  try {
    const response = await api.get(`/api/annotations/${copyId}`);
    
    // Combine the two types of annotations for the frontend
    const allAnnotations = [
      ...(response.data.annotations || []),
      ...(response.data.drawAnnotations || [])
    ];
    
    return allAnnotations;
  } catch (error) {
    console.error('Error loading annotations:', error);
    throw error;
  }
};