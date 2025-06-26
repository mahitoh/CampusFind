import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

// Create the Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage to avoid flashing login screen
  const [user, setUser] = useState(() => {
    try {
      return authService.getCurrentUser();
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [tabId] = useState(() => Math.random().toString(36).substr(2, 9)); // Unique tab ID

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

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only respond to user data changes
      if (e.key === "user") {
        if (e.newValue === null) {
          // User was logged out in another tab
          setUser(null);
        } else {
          // User data was updated in another tab
          try {
            const newUserData = JSON.parse(e.newValue);
            // Only update if it's different from current user
            if (
              !user ||
              user.id !== newUserData.id ||
              user.role !== newUserData.role
            ) {
              if (user && user.id !== newUserData.id) {
                // Different user logged in
                window.dispatchEvent(
                  new CustomEvent("authConflict", {
                    detail: {
                      type: "auth-conflict",
                      message: `A different user (${
                        newUserData.username || newUserData.email
                      }) has logged in from another tab. Please reload to sync your session.`,
                    },
                  })
                );
              } else if (user && user.role !== newUserData.role) {
                // Same user but role changed
                window.dispatchEvent(
                  new CustomEvent("authConflict", {
                    detail: {
                      type: "auth-conflict",
                      message: `Your user role has changed from ${user.role} to ${newUserData.role}. Please reload to access the correct dashboard.`,
                    },
                  })
                );
              }
              setUser(newUserData);
            }
          } catch (error) {
            console.error("Error parsing user data from storage event:", error);
          }
        }
      }
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user]);

  // Sign in function
  const signIn = async (credentials) => {
    try {
      const result = await authService.signIn(credentials);
      if (result.success) {
        setUser(result.data);
        // Store tab-specific information
        sessionStorage.setItem(
          `tabAuth_${tabId}`,
          JSON.stringify({
            userId: result.data.id,
            role: result.data.role,
            loginTime: Date.now(),
          })
        );
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
    // Clear tab-specific auth data
    sessionStorage.removeItem(`tabAuth_${tabId}`);
  };

  // Enhanced isAuthenticated check
  const isAuthenticated = () => {
    if (!user) return false;

    // Check if current user data is still valid
    const currentStoredUser = authService.getCurrentUser();
    if (!currentStoredUser) return false;

    // Verify that this tab's user matches the stored user
    if (
      user.id !== currentStoredUser.id ||
      user.role !== currentStoredUser.role
    ) {
      // User data mismatch - reload to sync
      window.location.reload();
      return false;
    }

    return authService.isAuthenticated();
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: isAuthenticated(),
    tabId, // Expose tab ID for debugging
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
