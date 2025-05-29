import React from "react";
import useAuthDebug from "../../hooks/useAuthDebug";

/**
 * AuthDebugger component
 * Wraps the useAuthDebug hook in a component for use in the app
 */
const AuthDebugger = () => {
  useAuthDebug();
  return null;
};

export default AuthDebugger;
