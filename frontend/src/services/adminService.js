/**
 * Admin Service - Handles communication with admin-specific API endpoints
 */

import apiClient from "./apiClient";

/**
 * Get system statistics
 * @returns {Promise<Object>} - Response with system stats
 */
export const getSystemStats = async () => {
  try {
    const response = await apiClient.get("/stats");
    return {
      success: true,
      data: response.data || response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get all users (admin only)
 * @returns {Promise<Object>} - Response with users list
 */
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    return {
      success: true,
      data: response.data || response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get all items with admin access
 * @returns {Promise<Object>} - Response with items list
 */
export const getAllItems = async () => {
  try {
    const response = await apiClient.get("/items");
    return {
      success: true,
      data: response.data || response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Update item status (admin only)
 * @param {string} itemId - Item ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Response with updated item
 */
export const updateItemStatus = async (itemId, updateData) => {
  try {
    const response = await apiClient.put(`/items/${itemId}`, updateData);
    return {
      success: true,
      data: response.data || response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Delete item (admin only)
 * @param {string} itemId - Item ID
 * @returns {Promise<Object>} - Response with deletion result
 */
export const deleteItem = async (itemId) => {
  try {
    const response = await apiClient.delete(`/items/${itemId}`);
    return {
      success: true,
      data: response.data || response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Update user role (admin only)
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Response with updated user
 */
export const updateUser = async (userId, updateData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, updateData);
    return {
      success: true,
      data: response.data || response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Delete user (admin only)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Response with deletion result
 */
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return {
      success: true,
      data: response.data || response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};
