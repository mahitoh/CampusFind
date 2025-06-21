import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContextNew";

/**
 * Protected Route component that redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Check if there's a token in localStorage to prevent flash of login screen
  const hasToken = localStorage.getItem("user") !== null;

  // If still loading, show nothing or a loading spinner
  if (loading && !hasToken) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Public Route component that redirects to dashboard if user is authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const PublicRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Check if there's a token in localStorage
  const hasToken = localStorage.getItem("user") !== null;

  // If loading and has token, show loading indicator
  if (loading && hasToken) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  // Redirect to appropriate dashboard if authenticated
  if (isAuthenticated || hasToken) {
    // Check if user is admin and redirect accordingly
    if (user && user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

/**
 * Admin Route component that only allows admin users to access
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Check if there's a token in localStorage
  const hasToken = localStorage.getItem("user") !== null;

  // If loading and has token, show loading indicator
  if (loading && hasToken) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to regular dashboard if not admin
  if (user && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export { ProtectedRoute, PublicRoute, AdminRoute };
