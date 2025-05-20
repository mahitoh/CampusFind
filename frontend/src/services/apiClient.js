/**
 * API Client for making HTTP requests using Axios
 */
import axios from "axios";

/**
 * Creates a configured axios instance for API requests
 * @returns {Object} - Configured axios instance
 */
const createApiClient = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : null;

      // If token exists, add to headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      // Enhanced error logging
      console.error("API Request Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });

      // Handle specific error status codes
      if (error.response) {
        switch (error.response.status) {
          case 401: // Unauthorized
            // Handle unauthorized (e.g., redirect to login)
            console.warn(
              "Unauthorized access detected, clearing authentication"
            );
            localStorage.removeItem("user");
            break;
          case 403: // Forbidden
            console.warn("Forbidden access detected");
            break;
          case 404: // Not found
            console.warn("Resource not found");
            break;
          case 500: // Server error
            console.error("Server error occurred");
            break;
          default:
            // Handle other errors
            console.warn(`HTTP Error ${error.response.status} occurred`);
            break;
        }

        // Return a structured error for easier handling in components
        return Promise.reject({
          ...error,
          isAxiosError: true,
          response: error.response,
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create and export the API client instance
const apiClient = createApiClient();

export default apiClient;
