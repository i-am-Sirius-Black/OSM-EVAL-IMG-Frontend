import api from '../api/axios.js';
import API_ROUTES from '../api/routes.js';
const { ANNOTATIONS } = API_ROUTES;

// Save annotations to the backend
export const saveAnnotations = async (copyId, { annotations, drawAnnotations }) => {
  try {
    // Send the prepared data directly to the backend
    const response = await api.post(ANNOTATIONS.SAVE, {
      copyId,
      annotations,
      drawAnnotations,
    });

    console.log('Annotations saved successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error saving annotations:', error);
    throw error;
  }
};

// Load annotations from the backend
export const loadAnnotations = async (copyId) => {
  try {
    const response = await api.get(ANNOTATIONS.GET_BY_COPY_ID(copyId));

    // Combine the two types of annotations for the frontend
    const allAnnotations = [
      ...(response.data.annotations || []),
      ...(response.data.drawAnnotations || []),
    ];

    return allAnnotations;
  } catch (error) {
    console.error('Error loading annotations:', error);
    throw error;
  }
};