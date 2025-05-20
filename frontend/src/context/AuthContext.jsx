import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../services/apiClient";

// Create the Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider component that wraps the application and provides authentication state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem("user");

        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        // Clear potentially corrupt data
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // Sign in function
  const signIn = async (credentials) => {
    try {
      // Make an API call to the backend
      const response = await apiClient.post("/auth/login", credentials);

      if (response && response.success) {
        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        return { success: true };
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "An error occurred during login",
      };
    }
  }; // Sign up function
  const signUp = async (userData) => {
    try {
      // Make an API call to the backend
      const response = await apiClient.post("/auth/register", userData);

      if (response && response.success) {
        return {
          success: true,
          data: response.data,
          message: "Registration successful! You can now log in.",
        };
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "An error occurred during registration",
      };
    }
  };

  // Sign out function
  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook that provides access to the auth context
 * @returns {Object} - Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
