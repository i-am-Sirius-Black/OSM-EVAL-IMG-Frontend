// // This service handles the evaluation-related API calls
// import api from '../api/axios';
// import API_ROUTES from '../api/routes';

// const { EVALUATION } = API_ROUTES;

// const evaluationService = {
//   /**
//    * Save evaluation data to the backend
//    * @param {Object} evaluationData - The evaluation data to save
//    * @param {string} evaluationData.copyid - Copy ID
//    * @param {number} evaluationData.obt_mark - Obtained marks
//    * @param {number} evaluationData.max_mark - Maximum marks
//    * @param {string} evaluationData.status - Evaluation status
//    * @param {number} evaluationData.eval_time - Evaluation time in seconds
//    * @param {string} evaluationData.eval_id - Evaluator ID (User ID)
//    * @param {string} evaluationData.bag_id - Bag ID
//    * @returns {Promise<Object>} - Response from the API
//    */
//   saveEvaluation: async (evaluationData) => {
//     try {
//       const response = await api.post(EVALUATION.SAVE, evaluationData);
//       if(response.status !== 201) {
//         throw new Error('Failed to save evaluation data');
//       }
//       return response.data; // Return the response data
//     } catch (error) {
//       console.error('Error saving evaluation:', error);
//       throw error; // Rethrow the error for the caller to handle
//     }
//   },
// };

// export default evaluationService;


//?v2 with both eval+annotation save (single)

import api from '../api/axios';
import API_ROUTES from '../api/routes';

const { EVALUATION } = API_ROUTES;

const evaluationService = {
  saveEvaluationAndAnnotations: async (payload) => {
    // payload should include all fields: copyid, obt_mark, ..., annotations, drawAnnotations
    const response = await api.post(EVALUATION.SAVE, payload);

    return response.data;
  },


   /**
   * Submit re-evaluation data to the backend
   * @param {Object} payload - The re-evaluation data
   * @returns {Promise<Object>} - Response from the API
   */
  submitReevaluation: async (payload) => {
    // POST to /api/reeval/submit
    const response = await api.post('/api/reeval/submit', payload);
    return response.data;
  }

};

export default evaluationService;