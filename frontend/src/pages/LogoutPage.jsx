import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextNew";

const LogoutPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication
    localStorage.removeItem("user");
    signOut();

    // Show a message
    alert("You have been logged out successfully.");

    // Redirect to home page
    navigate("/");
  }, [navigate, signOut]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Logging Out...</h1>
        <p className="mb-4">Please wait while we log you out.</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default LogoutPage;
