/**
 * Extracts error message from various error response formats
 * @param {Error} error - The error object from axios
 * @returns {string} - Extracted error message
 */
export const getErrorMessage = (error) => {
    return (
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        error.message ||
        'Operation Failed.'
    );
};