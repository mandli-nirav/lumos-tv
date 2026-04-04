import axios from 'axios';

/**
 * Creates a configured Axios instance for API calls.
 * Includes timeout, error normalization, and optional interceptors.
 * @param {Object} config - Configuration object
 * @param {string} config.baseURL - Base URL for the API
 * @param {number} config.timeout - Request timeout in milliseconds (default: 10000)
 * @param {Object} config.headers - Additional headers to include
 * @param {Function} config.onError - Optional error callback
 * @returns {AxiosInstance}
 */
export const createApiClient = (config = {}) => {
  const {
    baseURL = '',
    timeout = 10000,
    headers = {},
    onError,
  } = config;

  const instance = axios.create({
    baseURL,
    timeout,
    headers,
  });

  // Response interceptor for error normalization
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Normalize error shape for consistent handling across the app
      const normalizedError = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        originalError: error,
      };

      if (onError) {
        onError(normalizedError);
      }

      return Promise.reject(normalizedError);
    }
  );

  return instance;
};
