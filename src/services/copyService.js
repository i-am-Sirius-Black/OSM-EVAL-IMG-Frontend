import api from '../api/axios';
import API_ROUTES from '../api/routes';

const { COPY_MANAGEMENT, COPIES } = API_ROUTES;

const copyService = {
  /**
   * Reject a copy with the given reason
   * @param {Object} rejectionData - Data for copy rejection
   * @param {string} rejectionData.copyId - The ID of the copy to reject
   * @param {string} rejectionData.reason - The reason for rejection
   * @param {string} rejectionData.userId - The ID of the user making the rejection
   * @returns {Promise<Object>} - Response from the API
   */
  rejectCopy: async (rejectionData) => {
    try {
      const response = await api.post(COPY_MANAGEMENT.REJECT, rejectionData);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to reject copy');
      }
      return response.data;
    } catch (error) {
      console.error('Error rejecting copy:', error);
      throw error;
    }
  },
  
  /**
   * Get rejection history for a specific copy
   * @param {string} copyId - The ID of the copy
   * @returns {Promise<Object>} - Rejection history from the API
   */
  getRejectHistory: async (copyId) => {
    try {
      const response = await api.get(COPIES.GET_REJECTION_HISTORY(copyId));
      if (response.status !== 200) {
        throw new Error('Failed to fetch rejection history');
      }
      return response.data;
    } catch (error) {
      console.error('Error getting rejection history:', error);
      throw error;
    }
  }
};

export default copyService;