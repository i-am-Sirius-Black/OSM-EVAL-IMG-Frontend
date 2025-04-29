/**
 * Service to handle image-related API calls.
 */
const BASE_URL = "http://localhost:3000/api/copies";

/**
 * Get the URL for fetching an image.
 * @param {string} copyId - The ID of the copy.
 * @param {number} page - The page number.
 * @returns {string} - The constructed image URL.
 */
export const getImageUrl = (copyId, page) => {
  if (!copyId || !page) {
    throw new Error("copyId and page are required to construct the image URL.");
  }

  return `${BASE_URL}/image?copyId=${copyId}&page=${page}`;
};