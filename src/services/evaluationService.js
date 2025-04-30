// This service handles the evaluation-related API calls
import api from '../api/axios';

const evaluationService = {
  /**
   * Save evaluation data to the backend
   * @param {Object} evaluationData - The evaluation data to save
   * @param {string} evaluationData.copyid - Copy ID
   * @param {number} evaluationData.obt_mark - Obtained marks
   * @param {number} evaluationData.max_mark - Maximum marks
   * @param {string} evaluationData.status - Evaluation status
   * @param {number} evaluationData.eval_time - Evaluation time in seconds
   * @param {string} evaluationData.eval_id - Evaluator ID (User ID)
   * @param {string} evaluationData.bag_id - Bag ID
   * @returns {Promise<Object>} - Response from the API
   */
  saveEvaluation: async (evaluationData) => {
    try {
      const response = await api.post('/api/evaluation/save', evaluationData);
      if(response.status !== 201) {
        throw new Error('Failed to save evaluation data');
      }
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error saving evaluation:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  },
};

export default evaluationService;