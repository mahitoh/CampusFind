import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

// Create the Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const userData = authService.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        authService.signOut();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Sign in function
  const signIn = async (credentials) => {
    try {
      const result = await authService.signIn(credentials);
      if (result.success) {
        setUser(result.data);
      }
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: error.message || "An error occurred during login",
      };
    }
  };

  // Sign up function
  const signUp = async (userData) => {
    return authService.signUp(userData);
  };

  // Sign out function
  const signOut = () => {
    authService.signOut();
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

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
