/**
 * Custom hook to handle authentication persistence
 * This helps ensure the auth state is properly maintained between page refreshes
 */
import { useEffect } from "react";
import * as authService from "../services/authService";
import { useAuth } from "../context/AuthContextNew";

/**
 * Hook to synchronize authentication state with localStorage
 */
export default function useAuthPersistence() {
  const { user, setUser } = useAuth();

  useEffect(() => {
    // Check if there's authentication data in localStorage
    const storedUser = authService.getCurrentUser();

    // Only update if we don't already have a user in state
    // but we do have one in localStorage
    if (!user && storedUser) {
      console.log("Restoring user session from localStorage");
      setUser(storedUser);
    }
  }, [user, setUser]);

  return null;
}
