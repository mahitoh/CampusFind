import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextNew";

/**
 * Dashboard page component
 */
const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Log Out
          </button>
        </div>

        <div className="mb-6 p-4 border rounded-lg bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">{userData.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium">{userData.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-medium">{userData.id}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>You are currently logged in.</p>
            <p className="text-sm mt-1">
              localStorage has saved your authentication token.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
