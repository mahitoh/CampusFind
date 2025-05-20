import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const LinkTest = () => {
  const navigate = useNavigate();
  const [userAuth, setUserAuth] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUserAuth(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserAuth(null);
    alert("Logged out successfully! You can now access login/signup pages.");
    window.location.reload();
  };

  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#098dc1] via-[#098dc1] to-[#f417de]">
      {" "}
      <h1 className="text-3xl font-bold text-white mb-10">Navigation Test</h1>
      {userAuth && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Current User</h2>
          <div className="bg-yellow-100 p-4 rounded mb-4">
            <p className="font-semibold">You are currently logged in as:</p>
            <p>Username: {userAuth.username || "N/A"}</p>
            <p>Email: {userAuth.email || "N/A"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout (Clear Authentication)
          </button>
        </div>
      )}
      <div className="space-y-6 w-full max-w-md">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">React Router Link</h2>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Go to Signup
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">useNavigate Hook</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Navigate to Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Navigate to Signup
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Regular Anchor Tag</h2>
          <div className="flex space-x-4">
            <a
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Anchor to Login
            </a>
            <a
              href="/signup"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Anchor to Signup
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkTest;
