import { useEffect } from "react";
import { useAuth } from "../context/AuthContextNew";
import * as authService from "../services/authService";

/**
 * A debugging hook that logs authentication status on mount and when it changes
 * This helps troubleshoot issues with authentication persistence
 */
export const useAuthDebug = () => {
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Log authentication state
    console.log("Auth Debug:", {
      user: user ? { id: user.id, email: user.email } : null,
      isAuthenticated,
      loading,
      storageUser: !!localStorage.getItem("user"),
      authServiceCheck: authService.isAuthenticated(),
      timestamp: new Date().toISOString(),
    });

    // Add an event listener for storage changes (in case another tab changes auth)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        console.log('LocalStorage "user" changed:', {
          newValue: e.newValue ? "exists" : "removed",
          timestamp: new Date().toISOString(),
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user, isAuthenticated, loading]);

  return null;
};

export default useAuthDebug;
