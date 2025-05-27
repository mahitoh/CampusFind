/**
 * Type definitions for the CampusFind application
 * This file can be used for JSDoc type annotations or TypeScript interfaces
 */

/**
 * @typedef {Object} User
 * @property {string} id - User unique identifier
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {string} token - Authentication token
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user - Current authenticated user or null
 * @property {boolean} loading - Authentication loading state
 * @property {boolean} isAuthenticated - Whether a user is currently authenticated
 * @property {Function} signIn - Function to sign in a user
 * @property {Function} signUp - Function to register a new user
 * @property {Function} signOut - Function to sign out the current user
 */

/**
 * @typedef {Object} Listing
 * @property {string} id - Listing unique identifier
 * @property {string} title - Listing title
 * @property {string} description - Listing description
 * @property {number} price - Listing price
 * @property {string[]} images - Array of image URLs
 * @property {string} location - Location name
 * @property {Object} coordinates - Geographic coordinates
 * @property {number} coordinates.latitude - Latitude
 * @property {number} coordinates.longitude - Longitude
 * @property {string} userId - ID of user who created the listing
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} Review
 * @property {string} id - Review unique identifier
 * @property {string} userId - ID of the user who wrote the review
 * @property {string} listingId - ID of the listing being reviewed
 * @property {number} rating - Rating (1-5)
 * @property {string} comment - Review text
 * @property {Date} createdAt - Creation timestamp
 */

// Export empty objects for TypeScript compatibility if needed
export {};
