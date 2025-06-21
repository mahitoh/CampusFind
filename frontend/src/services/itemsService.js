/**
 * Items Service - Handles communication with the items API endpoints
 */
import apiClient from "./apiClient";

/**
 * Get all items with optional filters
 * @param {Object} params - Optional filter parameters
 * @returns {Promise<Array>} - Array of item objects
 */
export const getItems = async (params = {}) => {
  try {
    const response = await apiClient.get("/items", { params });
    return response;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    throw error;
  }
};

/**
 * Get items for the current user
 * @returns {Promise<Array>} - Array of user's item objects
 */
export const getUserItems = async () => {
  try {
    const response = await apiClient.get("/items/my-items");
    return response;
  } catch (error) {
    console.error("Failed to fetch user items:", error);
    throw error;
  }
};

/**
 * Get a single item by ID
 * @param {String} id - Item ID
 * @returns {Promise<Object>} - Item object
 */
export const getItemById = async (id) => {
  try {
    const response = await apiClient.get(`/items/${id}`);
    return response;
  } catch (error) {
    console.error(`Failed to fetch item ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new lost item
 * @param {Object} itemData - Item data to create
 * @returns {Promise<Object>} - Created item object
 */
export const createLostItem = async (itemData) => {
  try {
    // Set status to Lost for lost items
    const formData = new FormData();

    // Add all text fields to formData
    Object.keys(itemData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, itemData[key]);
      }
    });

    // Add status
    formData.append("status", "Lost");

    // Add images if any
    if (itemData.images && itemData.images.length > 0) {
      for (let i = 0; i < itemData.images.length; i++) {
        formData.append("images", itemData.images[i]);
      }
    }

    const response = await apiClient.post("/items", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Failed to create lost item:", error);
    throw error;
  }
};

/**
 * Create a new found item
 * @param {Object} itemData - Item data to create
 * @returns {Promise<Object>} - Created item object
 */
export const createFoundItem = async (itemData) => {
  try {
    // Set status to Found for found items
    const formData = new FormData();

    // Add all text fields to formData
    Object.keys(itemData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, itemData[key]);
      }
    });

    // Add status
    formData.append("status", "Found");

    // Add images if any
    if (itemData.images && itemData.images.length > 0) {
      for (let i = 0; i < itemData.images.length; i++) {
        formData.append("images", itemData.images[i]);
      }
    }

    const response = await apiClient.post("/items", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Failed to create found item:", error);
    throw error;
  }
};

/**
 * Update an existing item
 * @param {String} id - Item ID
 * @param {Object} itemData - Updated item data
 * @returns {Promise<Object>} - Updated item object
 */
export const updateItem = async (id, itemData) => {
  try {
    const formData = new FormData();

    // Add all text fields to formData
    Object.keys(itemData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, itemData[key]);
      }
    });

    // Add images if any
    if (itemData.images && itemData.images.length > 0) {
      for (let i = 0; i < itemData.images.length; i++) {
        formData.append("images", itemData.images[i]);
      }
    }

    const response = await apiClient.put(`/items/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error(`Failed to update item ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an item
 * @param {String} id - Item ID
 * @returns {Promise<void>}
 */
export const deleteItem = async (id) => {
  try {
    await apiClient.delete(`/items/${id}`);
  } catch (error) {
    console.error(`Failed to delete item ${id}:`, error);
    throw error;
  }
};
