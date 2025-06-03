/**
 * API Client for making HTTP requests using Axios
 */
import axios from "axios";

/**
 * Get the API base URL from environment or default
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Get the base URL for the server (without /api)
 */
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

/**
 * Format an image URL to ensure it includes the full server URL
 * @param {string} imageUrl - The relative image path or full URL
 * @returns {string} - Properly formatted image URL
 */
export const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;

  // Make sure the URL starts with a slash
  const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

  // Add crossorigin attribute to help with CORS
  const url = `${SERVER_BASE_URL}${normalizedPath}`;
  console.log("Formatted image URL:", url);
  return url;
};

/**
 * Creates a configured axios instance for API requests
 * @returns {Object} - Configured axios instance
 */
const createApiClient = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
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
