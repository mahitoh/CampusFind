import React, { useState, useEffect } from "react";

const AuthConflictHandler = ({ children }) => {
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictMessage, setConflictMessage] = useState("");

  useEffect(() => {
    const handleAuthConflict = (event) => {
      if (event.detail && event.detail.type === "auth-conflict") {
        setConflictMessage(event.detail.message);
        setShowConflictModal(true);
      }
    };

    // Listen for custom auth conflict events
    window.addEventListener("authConflict", handleAuthConflict);

    return () => {
      window.removeEventListener("authConflict", handleAuthConflict);
    };
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowConflictModal(false);
  };

  return (
    <>
      {children}

      {/* Auth Conflict Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Authentication Conflict Detected
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              {conflictMessage ||
                "A different user has logged in from another tab. Please reload the page to sync your session."}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={handleReload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthConflictHandler;
