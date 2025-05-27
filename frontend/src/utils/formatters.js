/**
 * Utility functions for formatting data
 */

/**
 * Format a date string to a localized date format
 * @param {string|Date} date - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Date(date).toLocaleDateString(undefined, defaultOptions);
};

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Truncate a string to a maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add when truncated (default: '...')
 * @returns {string} - Truncated string
 */
export const truncateText = (text, maxLength, suffix = "...") => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}${suffix}`;
};

/**
 * Convert a kebab-case or snake_case string to camelCase
 * @param {string} str - String to convert
 * @returns {string} - camelCase string
 */
export const toCamelCase = (str) => {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toLowerCase());
};

/**
 * Convert a string to sentence case
 * @param {string} str - String to convert
 * @returns {string} - Sentence case string
 */
export const toSentenceCase = (str) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};
