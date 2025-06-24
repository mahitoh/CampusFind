import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get user data from localStorage (which contains the token)
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('user');
      localStorage.removeItem('userSession');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Profile API functions
export const profileAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', { profile: profileData });
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    const response = await api.post('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Settings API functions
export const settingsAPI = {
  // Get user settings
  getSettings: async () => {
    const response = await api.get('/users/settings');
    return response.data;
  },

  // Update all settings
  updateSettings: async (settings) => {
    const response = await api.put('/users/settings', settings);
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/users/settings/preferences', preferences);
    return response.data;
  },

  // Update privacy settings
  updatePrivacy: async (privacy) => {
    const response = await api.put('/users/settings/privacy', privacy);
    return response.data;
  },

  // Update notification settings
  updateNotifications: async (notifications) => {
    const response = await api.put('/users/settings/notifications', notifications);
    return response.data;
  },
};

// Auth API functions
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api; 