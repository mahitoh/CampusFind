const path = require("path");
const fs = require("fs");

/**
 * Delete file from server
 * @param {string} filePath Path to the file
 * @returns {Promise<void>}
 */
exports.deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    // Check if file exists
    if (!filePath) {
      return resolve();
    }

    // Get absolute path
    const fullPath = path.join(__dirname, "..", filePath);

    // Delete file
    fs.unlink(fullPath, (err) => {
      if (err) {
        // If file doesn't exist, don't throw error
        if (err.code === "ENOENT") {
          return resolve();
        }
        return reject(err);
      }
      resolve();
    });
  });
};

/**
 * Format error message
 * @param {Error} error Error object
 * @returns {string} Formatted error message
 */
exports.formatError = (error) => {
  if (error.name === "ValidationError") {
    return Object.values(error.errors)
      .map((val) => val.message)
      .join(", ");
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return `Duplicate value entered for ${field}`;
  }

  return error.message || "Server Error";
};

/**
 * Format date to yyyy-mm-dd
 * @param {Date} date Date object
 * @returns {string} Formatted date
 */
exports.formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};
