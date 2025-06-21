import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContextNew";
import * as adminService from "../services/adminService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    pendingApproval: 0,
    successfulMatches: 0,
    activeUsers: 0,
  });

  const [pendingItems, setPendingItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Load admin data
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);

        // Load stats
        const statsResult = await adminService.getSystemStats();
        if (statsResult.success) {
          setStats((prevStats) => ({
            ...prevStats,
            ...statsResult.data,
          }));
        }

        // Load all items
        const itemsResult = await adminService.getAllItems();
        if (itemsResult.success) {
          setAllItems(itemsResult.data.data || itemsResult.data);

          // Filter pending items
          const pending = (itemsResult.data.data || itemsResult.data).filter(
            (item) =>
              item.status === "Pending" || item.status === "Under Review"
          );
          setPendingItems(
            pending.map((item) => ({
              id: item._id,
              name: item.title || item.name,
              type: item.status === "Lost" ? "Missing" : "Found",
              submittedBy: item.user?.username || "Unknown",
              date: new Date(item.createdAt).toLocaleDateString(),
              originalItem: item,
            }))
          );
        }

        // Load all users
        const usersResult = await adminService.getAllUsers();
        if (usersResult.success) {
          setAllUsers(usersResult.data.data || usersResult.data);
          setStats((prev) => ({
            ...prev,
            activeUsers: (usersResult.data.data || usersResult.data).length,
          }));
        }
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "admin") {
      loadAdminData();
    }
  }, [user]);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };
  const handleApproveItem = async (itemId) => {
    try {
      const item = pendingItems.find((p) => p.id === itemId);
      if (item && item.originalItem) {
        const result = await adminService.updateItemStatus(itemId, {
          status: "Active", // or "Found"/"Lost" depending on the type
        });

        if (result.success) {
          setPendingItems(pendingItems.filter((item) => item.id !== itemId));
          setStats((prev) => ({
            ...prev,
            pendingApproval: prev.pendingApproval - 1,
          }));
        } else {
          alert("Failed to approve item: " + result.error);
        }
      }
    } catch (error) {
      console.error("Error approving item:", error);
      alert("Failed to approve item");
    }
  };

  const handleRejectItem = async (itemId) => {
    try {
      const result = await adminService.deleteItem(itemId);

      if (result.success) {
        setPendingItems(pendingItems.filter((item) => item.id !== itemId));
        setStats((prev) => ({
          ...prev,
          pendingApproval: prev.pendingApproval - 1,
        }));
      } else {
        alert("Failed to reject item: " + result.error);
      }
    } catch (error) {
      console.error("Error rejecting item:", error);
      alert("Failed to reject item");
    }
  };

  const navigation = [
    { name: "Dashboard", href: "#", icon: HomeIcon, id: "dashboard" },
    {
      name: "Manage Items",
      href: "#",
      icon: ClipboardDocumentListIcon,
      id: "manage-items",
    },
    {
      name: "Pending Approval",
      href: "#",
      icon: ClipboardDocumentListIcon,
      id: "pending-approval",
    },
    { name: "Users", href: "#", icon: UsersIcon, id: "users" },
    { name: "Settings", href: "#", icon: Cog6ToothIcon, id: "settings" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
        </div>

        <nav className="mt-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium ${
                  activeTab === item.id
                    ? "bg-blue-50 border-r-2 border-blue-500 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back! Here's an overview of the campus lost and found
                system.
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Review Pending Items
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800">
                Manage Settings
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-900 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Total Items</h3>
                    <ClipboardDocumentListIcon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold">{stats.totalItems}</div>
                  <p className="text-sm text-gray-400">56 lost, 72 found</p>
                </div>

                <div className="bg-gray-900 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Pending Approval</h3>
                    <ClipboardDocumentListIcon className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold">
                    {stats.pendingApproval}
                  </div>
                  <p className="text-sm text-gray-400">
                    14 found items, 10 reports
                  </p>
                </div>

                <div className="bg-gray-900 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Successful Matches</h3>
                    <CheckIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold">
                    {stats.successfulMatches}
                  </div>
                  <p className="text-sm text-gray-400">+12% from last month</p>
                </div>

                <div className="bg-gray-900 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Active Users</h3>
                    <UsersIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold">{stats.activeUsers}</div>
                  <p className="text-sm text-gray-400">+24 new this week</p>
                </div>
              </div>

              {/* Charts Placeholders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900 text-white rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">System Overview</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Monthly item trends for lost, found, and claimed items.
                  </p>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">
                      Monthly statistics chart would display here
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900 text-white rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">
                    Item Location Heatmap
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Where items are most commonly lost on campus.
                  </p>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">
                      Campus map heatmap would display here
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900 text-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">
                    Items Awaiting Approval
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab("pending-approval")}
                      className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                      Pending Approval
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded">
                      Recent Activity
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  These items need to be reviewed and approved.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">
                          ITEM
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">
                          TYPE
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">
                          SUBMITTED BY
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">
                          DATE
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingItems.slice(0, 3).map((item) => (
                        <tr key={item.id} className="border-b border-gray-800">
                          <td className="py-3 px-4 text-white">{item.name}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                item.type === "Found"
                                  ? "bg-green-900 text-green-300"
                                  : "bg-yellow-900 text-yellow-300"
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {item.submittedBy}
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {item.date}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveItem(item.id)}
                                className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                              >
                                Review
                              </button>
                              <button
                                onClick={() => handleRejectItem(item.id)}
                                className="px-3 py-1 text-xs bg-red-900 text-red-300 rounded hover:bg-red-800"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pending-approval" && (
            <div className="bg-gray-900 text-white rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">
                Items Awaiting Approval
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                These items need to be reviewed and approved.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">
                        ITEM
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">
                        TYPE
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">
                        SUBMITTED BY
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">
                        DATE
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-white">{item.name}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              item.type === "Found"
                                ? "bg-green-900 text-green-300"
                                : "bg-yellow-900 text-yellow-300"
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {item.submittedBy}
                        </td>
                        <td className="py-3 px-4 text-gray-300">{item.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveItem(item.id)}
                              className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleRejectItem(item.id)}
                              className="px-3 py-1 text-xs bg-red-900 text-red-300 rounded hover:bg-red-800"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "manage-items" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Manage Items</h3>
              <p className="text-gray-600">
                Item management functionality will be implemented here.
              </p>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">User Management</h3>
              <p className="text-gray-600">
                User management functionality will be implemented here.
              </p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">System Settings</h3>
              <p className="text-gray-600">
                System settings will be implemented here.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
