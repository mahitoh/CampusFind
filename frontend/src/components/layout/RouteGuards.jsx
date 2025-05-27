import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContextNew";

/**
 * Protected Route component that redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
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
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export { ProtectedRoute, PublicRoute };
