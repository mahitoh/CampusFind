/**
 * Authentication Service - Handles communication with the authentication API endpoints
 */

import apiClient from "./apiClient";

/**
 * Sign in a user with email and password
 * @param {Object} credentials - User credentials with email and password
 * @returns {Promise<Object>} - Response with user data or error
 */
export const signIn = async (credentials) => {
  try {
    console.log("Sending login request with credentials:", {
      ...credentials,
      password: credentials.password ? "[REDACTED]" : undefined, // Don't log actual password
    });

    const response = await apiClient.post("/auth/login", credentials);
    console.log("Login API response:", response);

    if (response && response.success) {
      // Make sure we have both token and user data
      if (!response.token || !response.user) {
        console.warn("Login response missing token or user data:", response);
        return {
          success: false,
          error: "Incomplete login data received from server",
        };
      }

      // Construct the data to store in localStorage
      const userData = {
        token: response.token,
        ...response.user,
      }; // Save user data to both localStorage and sessionStorage
      const userDataString = JSON.stringify(userData);
      localStorage.setItem("user", userDataString);
      sessionStorage.setItem("userSession", userDataString);

      console.log("Authentication successful: User data saved to storage");
      return { success: true, data: userData };
    } else {
      console.error("Login API returned non-success:", response);
      return {
        success: false,
        error: response.error || response.message || "Login failed",
      };
    }
  } catch (error) {
    console.error("Login request failed:", error);

    // Handle axios error format
    if (error.response) {
      console.error("Error response data:", error.response.data);
      return {
        success: false,
        error:
          error.response.data?.error ||
          error.response.data?.message ||
          "Server error during login",
      };
    }

    return {
      success: false,
      error: error.message || "An error occurred during login",
    };
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Response with success status or error
 */
export const signUp = async (userData) => {
  try {
    console.log("Sending registration request with data:", {
      ...userData,
      password: userData.password ? "[REDACTED]" : undefined,
    });
    const response = await apiClient.post("/auth/register", userData);
    console.log("Registration API response:", response);

    if (response && response.success) {
      return {
        success: true,
        data: response.user || response.data,
        message: "Registration successful! You can now log in.",
      };
    } else {
      console.error("Registration API returned non-success:", response);
      return {
        success: false,
        error: response.error || response.message || "Registration failed",
      };
    }
  } catch (error) {
    console.error("Registration request failed:", error);

    // Handle axios error format
    if (error.response) {
      console.error("Error response data:", error.response.data);
      return {
        success: false,
        error:
          error.response.data?.error ||
          error.response.data?.message ||
          "Server error during registration",
      };
    }

    return {
      success: false,
      error: error.message || "An error occurred during registration",
    };
  }
};

/**
 * Sign out the current user
 * @returns {void}
 */
export const signOut = () => {
  localStorage.removeItem("user");
  sessionStorage.removeItem("userSession");
};

/**
 * Get the current authenticated user from storage
 * Checks both localStorage (for persistent login) and sessionStorage (for current session)
 * @returns {Object|null} - User object or null if not authenticated
 */
export const getCurrentUser = () => {
  // Try localStorage first
  const userData = localStorage.getItem("user");

  if (userData) {
    // Also ensure the session is maintained
    sessionStorage.setItem("userSession", userData);
    return JSON.parse(userData);
  }

  // Fall back to sessionStorage (useful for page refreshes)
  const sessionData = sessionStorage.getItem("userSession");
  return sessionData ? JSON.parse(sessionData) : null;
};

/**
 * Check if a user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  const user = getCurrentUser();
  return !!user && !!user.token;
};

/**
 * Update user profile
 * @param {Object} userData - User profile data to update
 * @returns {Promise<Object>} - Response with updated user data
 */
export const updateProfile = async (userData) => {
  try {
    const response = await apiClient.put("/auth/profile", userData);

    if (response && response.success) {
      // Update stored user data
      const currentUser = getCurrentUser();
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return { success: true, data: updatedUser };
    } else {
      throw new Error(response.message || "Profile update failed");
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
