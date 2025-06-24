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
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

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
  const [chartData, setChartData] = useState({
    labels: ["Lost Items", "Found Items", "Claimed Items", "Returned Items"],
    datasets: [
      {
        data: [25, 35, 15, 8], // Sample data for demonstration
        backgroundColor: [
          "#EF4444", // Red for lost items
          "#10B981", // Green for found items
          "#F59E0B", // Yellow for claimed items
          "#6366F1", // Blue for returned items
        ],
        borderColor: ["#DC2626", "#059669", "#D97706", "#4F46E5"],
        borderWidth: 2,
        hoverBackgroundColor: ["#F87171", "#34D399", "#FBBF24", "#818CF8"],
      },
    ],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("dateReported");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // User management state
  const [allUsers, setAllUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userFilterRole, setUserFilterRole] = useState("all");
  const [userFilterStatus, setUserFilterStatus] = useState("all");
  const [userSortBy, setUserSortBy] = useState("createdAt");
  const [userSortOrder, setUserSortOrder] = useState("desc");
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserFilters, setShowUserFilters] = useState(false);

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
        } // Load all items
        const itemsResult = await adminService.getAllItems();
        if (itemsResult.success) {
          const items = itemsResult.data.data || itemsResult.data;
          setAllItems(items);

          // Calculate item statistics for chart
          const lostCount = items.filter(
            (item) => item.status === "Lost"
          ).length;
          const foundCount = items.filter(
            (item) => item.status === "Found"
          ).length;
          const claimedCount = items.filter(
            (item) => item.status === "Claimed"
          ).length;
          const returnedCount = items.filter(
            (item) => item.status === "Returned"
          ).length;

          // Update chart data
          setChartData((prevData) => ({
            ...prevData,
            datasets: [
              {
                ...prevData.datasets[0],
                data: [lostCount, foundCount, claimedCount, returnedCount],
              },
            ],
          }));

          // Filter pending items
          const pending = items.filter(
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

          // Update stats
          setStats((prevStats) => ({
            ...prevStats,
            totalItems: items.length,
            pendingApproval: pending.length,
            successfulMatches: claimedCount + returnedCount,
          }));
        } // Load all users
        const usersResult = await adminService.getAllUsers();
        if (usersResult.success) {
          const users = usersResult.data.data || usersResult.data;
          setAllUsers(users);
          setStats((prev) => ({
            ...prev,
            activeUsers: users.length,
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

  // Helper functions for Manage Items functionality
  const filteredItems = allItems
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || item.status === filterStatus;
      const matchesCategory =
        filterCategory === "all" || item.category === filterCategory;

      let matchesDateRange = true;
      if (dateRange.start && dateRange.end) {
        const itemDate = new Date(item.dateReported);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDateRange = itemDate >= startDate && itemDate <= endDate;
      }

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesDateRange
      );
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "category":
          aValue = a.category;
          bValue = b.category;
          break;
        case "location":
          aValue = a.location;
          bValue = b.location;
          break;
        default:
          aValue = new Date(a.dateReported);
          bValue = new Date(b.dateReported);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item._id));
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterCategory("all");
    setDateRange({ start: "", end: "" });
    setSortBy("dateReported");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,Status,Category,Location,Reporter,Date Reported,Description\n" +
      filteredItems
        .map(
          (item) =>
            `"${item.title}","${item.status}","${item.category}","${
              item.location
            }","${item.reportedBy?.name || "Unknown"}","${new Date(
              item.dateReported
            ).toLocaleDateString()}","${
              item.description?.replace(/"/g, '""') || ""
            }"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `campus_find_items_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditItem = (item) => {
    // TODO: Implement edit item modal/page
    console.log("Edit item:", item);
    alert("Edit functionality will be implemented in a future update");
  };

  const handleDeleteItem = async (itemId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this item? This action cannot be undone."
      )
    ) {
      try {
        const result = await adminService.deleteItem(itemId);
        if (result.success) {
          setAllItems((prev) => prev.filter((item) => item._id !== itemId));
          setSelectedItems((prev) => prev.filter((id) => id !== itemId));
          alert("Item deleted successfully");
        } else {
          alert("Failed to delete item: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item");
      }
    }
  };

  const handleViewItem = (item) => {
    // TODO: Implement view item modal/page
    console.log("View item:", item);
    navigate(`/item/${item._id}`);
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedItems.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to mark ${selectedItems.length} item(s) as ${newStatus}?`
      )
    ) {
      try {
        const updatePromises = selectedItems.map((itemId) =>
          adminService.updateItemStatus(itemId, { status: newStatus })
        );

        const results = await Promise.all(updatePromises);
        const successCount = results.filter((result) => result.success).length;

        if (successCount > 0) {
          // Refresh items data
          const itemsResult = await adminService.getAllItems();
          if (itemsResult.success) {
            setAllItems(itemsResult.data.data || itemsResult.data);
          }
          setSelectedItems([]);
          alert(`${successCount} item(s) updated successfully`);
        } else {
          alert("Failed to update items");
        }
      } catch (error) {
        console.error("Error updating items:", error);
        alert("Failed to update items");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedItems.length} item(s)? This action cannot be undone.`
      )
    ) {
      try {
        const deletePromises = selectedItems.map((itemId) =>
          adminService.deleteItem(itemId)
        );

        const results = await Promise.all(deletePromises);
        const successCount = results.filter((result) => result.success).length;

        if (successCount > 0) {
          setAllItems((prev) =>
            prev.filter((item) => !selectedItems.includes(item._id))
          );
          setSelectedItems([]);
          alert(`${successCount} item(s) deleted successfully`);
        } else {
          alert("Failed to delete items");
        }
      } catch (error) {
        console.error("Error deleting items:", error);
        alert("Failed to delete items");
      }
    }
  };

  // Helper functions for User Management functionality
  const filteredUsers = allUsers
    .filter((user) => {
      const matchesSearch =
        user.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(userSearchTerm.toLowerCase());

      const matchesRole =
        userFilterRole === "all" || user.role === userFilterRole;
      const matchesStatus =
        userFilterStatus === "all" ||
        (userFilterStatus === "active" && user.isActive !== false) ||
        (userFilterStatus === "inactive" && user.isActive === false);

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (userSortBy) {
        case "username":
          aValue = a.username?.toLowerCase() || "";
          bValue = b.username?.toLowerCase() || "";
          break;
        case "email":
          aValue = a.email?.toLowerCase() || "";
          bValue = b.email?.toLowerCase() || "";
          break;
        case "role":
          aValue = a.role || "";
          bValue = b.role || "";
          break;
        case "lastLogin":
          aValue = new Date(a.lastLogin || 0);
          bValue = new Date(b.lastLogin || 0);
          break;
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
      }

      if (userSortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const userTotalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (userCurrentPage - 1) * usersPerPage,
    userCurrentPage * usersPerPage
  );

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user._id));
    }
  };

  const clearUserFilters = () => {
    setUserSearchTerm("");
    setUserFilterRole("all");
    setUserFilterStatus("all");
    setUserSortBy("createdAt");
    setUserSortOrder("desc");
    setUserCurrentPage(1);
  };

  const exportUserData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Username,Email,First Name,Last Name,Role,Status,Created Date,Last Login\n" +
      filteredUsers
        .map(
          (user) =>
            `"${user.username || ""}","${user.email || ""}","${
              user.firstName || ""
            }","${user.lastName || ""}","${user.role || "user"}","${
              user.isActive !== false ? "Active" : "Inactive"
            }","${new Date(user.createdAt).toLocaleDateString()}","${
              user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString()
                : "Never"
            }"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `campus_find_users_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditUser = (user) => {
    console.log("Edit user:", user);
    alert("Edit user functionality will be implemented in a future update");
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        const result = await adminService.deleteUser(userId);
        if (result.success) {
          setAllUsers((prev) => prev.filter((user) => user._id !== userId));
          setSelectedUsers((prev) => prev.filter((id) => id !== userId));
          alert("User deleted successfully");
        } else {
          alert("Failed to delete user: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const handleViewUser = (user) => {
    console.log("View user:", user);
    alert(
      `User Details:\n\nUsername: ${user.username}\nEmail: ${
        user.email
      }\nRole: ${user.role}\nStatus: ${
        user.isActive !== false ? "Active" : "Inactive"
      }\nJoined: ${new Date(user.createdAt).toLocaleDateString()}`
    );
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#D1D5DB",
          padding: 20,
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#374151",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        borderColor: "#6B7280",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const hasChartData = chartData.datasets[0].data.some((value) => value > 0);

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
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white shadow-sm">
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <nav className="mt-8 space-y-2 px-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center p-3 rounded">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mr-3"></div>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          {/* Header Skeleton */}
          <header className="bg-white shadow-sm border-b p-6">
            <div className="flex items-center justify-between">
              <div className="w-96 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex space-x-4">
                <div className="w-32 h-9 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-28 h-9 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </header>

          {/* Dashboard Content Skeleton */}
          <main className="flex-1 p-6">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-lg p-6 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-24 h-5 bg-gray-300 rounded"></div>
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-16 h-8 bg-gray-300 rounded mb-2"></div>
                  <div className="w-32 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-200 rounded-lg p-6 animate-pulse">
                <div className="w-32 h-6 bg-gray-300 rounded mb-4"></div>
                <div className="w-48 h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-64 bg-gray-300 rounded flex items-center justify-center">
                  <div className="w-48 h-48 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg p-6 animate-pulse">
                <div className="w-40 h-6 bg-gray-300 rounded mb-4"></div>
                <div className="w-56 h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-64 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-gray-200 rounded-lg p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-48 h-6 bg-gray-300 rounded"></div>
                <div className="flex space-x-2">
                  <div className="w-24 h-8 bg-gray-300 rounded"></div>
                  <div className="w-20 h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="w-64 h-4 bg-gray-300 rounded mb-6"></div>

              {/* Table Header */}
              <div className="flex space-x-4 mb-4 pb-3 border-b border-gray-300">
                {["ITEM", "TYPE", "SUBMITTED BY", "DATE", "ACTIONS"].map(
                  (header, i) => (
                    <div key={i} className="w-24 h-4 bg-gray-300 rounded"></div>
                  )
                )}
              </div>

              {/* Table Rows */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4 mb-4 py-3">
                  <div className="w-32 h-4 bg-gray-300 rounded"></div>
                  <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                  <div className="w-24 h-4 bg-gray-300 rounded"></div>
                  <div className="w-20 h-4 bg-gray-300 rounded"></div>
                  <div className="flex space-x-2">
                    <div className="w-16 h-6 bg-gray-300 rounded"></div>
                    <div className="w-14 h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading Text with Pulse Animation */}
            <div className="fixed bottom-8 right-8">
              <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  Loading dashboard...
                </span>
              </div>
            </div>
          </main>
        </div>
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
              </div>{" "}
              {/* Charts Placeholders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900 text-white rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">System Overview</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Item distribution by status across the system.
                  </p>{" "}
                  <div className="h-64 flex items-center justify-center">
                    {hasChartData ? (
                      <div className="w-64 h-64">
                        <Pie data={chartData} options={chartOptions} />
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-400 mb-2">No data available</p>
                        <p className="text-sm text-gray-500">
                          Chart will display when items are added to the system
                        </p>
                      </div>
                    )}
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
          )}{" "}
          {activeTab === "pending-approval" && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Items Awaiting Approval
                    </h3>
                    <p className="text-sm text-gray-600">
                      Review and approve newly reported items before they appear
                      in the public system
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option value="all">All Types</option>
                      <option value="lost">Lost Items</option>
                      <option value="found">Found Items</option>
                    </select>
                    <button
                      onClick={() => {
                        if (pendingItems.length > 0) {
                          const confirmApprove = window.confirm(
                            `Approve all ${pendingItems.length} pending items?`
                          );
                          if (confirmApprove) {
                            pendingItems.forEach((item) =>
                              handleApproveItem(item.id)
                            );
                          }
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50"
                      disabled={pendingItems.length === 0}
                    >
                      Approve All ({pendingItems.length})
                    </button>
                  </div>
                </div>

                {/* Pending Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {pendingItems.length}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Total Pending
                        </p>
                        <p className="text-xs text-yellow-600">
                          Items awaiting review
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {
                            pendingItems.filter(
                              (item) => item.type === "Missing"
                            ).length
                          }
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Lost Reports
                        </p>
                        <p className="text-xs text-red-600">
                          Missing item reports
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {
                            pendingItems.filter((item) => item.type === "Found")
                              .length
                          }
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Found Items
                        </p>
                        <p className="text-xs text-green-600">
                          Items found and reported
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Item Details
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Submitted By
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Location
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Date Submitted
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingItems.length > 0 ? (
                        pendingItems.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                {item.originalItem?.images &&
                                item.originalItem.images.length > 0 ? (
                                  <img
                                    src={`http://localhost:5000/uploads/${item.originalItem.images[0]}`}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-lg object-cover mr-3"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-gray-400 text-xs">
                                      No Img
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {item.name}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate max-w-xs">
                                    {item.originalItem?.description ||
                                      "No description provided"}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Category:{" "}
                                    {item.originalItem?.category ||
                                      "Uncategorized"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  item.type === "Found"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item.type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {item.submittedBy}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.originalItem?.user?.email || "No email"}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">
                              {item.originalItem?.location || "Not specified"}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">
                              {item.date}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApproveItem(item.id)}
                                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectItem(item.id)}
                                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() =>
                                    handleViewItem(item.originalItem)
                                  }
                                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-12 px-4 text-center">
                            <div className="text-gray-500">
                              <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg font-medium">
                                No items pending approval
                              </p>
                              <p className="text-sm">
                                All reported items have been reviewed and
                                approved
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Approval Guidelines
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>
                        Verify that item descriptions are detailed and accurate
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>
                        Check that images are clear and show the actual item
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>Ensure location information is specific and helpful</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>Reject items with inappropriate content or spam</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>Reject duplicate or clearly false reports</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h4>
                  <div className="space-y-3">
                    {pendingItems.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.type === "Found"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            New {item.type.toLowerCase()} item: {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Submitted by {item.submittedBy} • {item.date}
                          </p>
                        </div>
                      </div>
                    ))}
                    {pendingItems.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No recent pending items
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "manage-items" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Manage Items</h3>
                <div className="flex space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
                    />
                    <svg
                      className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                    <option value="Claimed">Claimed</option>
                    <option value="Returned">Returned</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Documents">Documents</option>
                    <option value="Books">Books</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                  >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Range
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) =>
                            setDateRange({
                              ...dateRange,
                              start: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
                        />
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, end: e.target.value })
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="dateReported">Date Reported</option>
                        <option value="title">Title</option>
                        <option value="status">Status</option>
                        <option value="category">Category</option>
                        <option value="location">Location</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order
                      </label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={exportData}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Export Data
                    </button>
                  </div>
                </div>
              )}

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        <input
                          type="checkbox"
                          checked={
                            selectedItems.length === filteredItems.length &&
                            filteredItems.length > 0
                          }
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Item
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Reporter
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedItems.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => toggleSelectItem(item._id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {item.images && item.images.length > 0 && (
                              <img
                                src={`http://localhost:5000/uploads/${item.images[0]}`}
                                alt={item.title}
                                className="h-10 w-10 rounded-lg object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {item.title}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {item.description?.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === "Lost"
                                ? "bg-red-100 text-red-800"
                                : item.status === "Found"
                                ? "bg-green-100 text-green-800"
                                : item.status === "Claimed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {item.category}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {item.location}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-900">
                            {item.reportedBy?.name || "Unknown"}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {item.reportedBy?.email}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(item.dateReported).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="text-red-600 hover:text-red-700 text-xs font-medium"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleViewItem(item)}
                              className="text-gray-600 hover:text-gray-700 text-xs font-medium"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      filteredItems.length
                    )}{" "}
                    to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredItems.length)}{" "}
                    of {filteredItems.length} items
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = Math.max(
                      1,
                      Math.min(totalPages, currentPage - 2 + i)
                    );
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border rounded text-sm ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedItems.length > 0 && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">
                      {selectedItems.length} item
                      {selectedItems.length > 1 ? "s" : ""} selected
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkStatusUpdate("Found")}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Mark Found
                      </button>
                      <button
                        onClick={() => handleBulkStatusUpdate("Returned")}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Mark Returned
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete Selected
                      </button>
                      <button
                        onClick={() => setSelectedItems([])}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      User Management
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage all users, roles, and permissions in the system
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
                      />
                      <svg
                        className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <select
                      value={userFilterRole}
                      onChange={(e) => setUserFilterRole(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Roles</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                    <select
                      value={userFilterStatus}
                      onChange={(e) => setUserFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <button
                      onClick={() => setShowUserFilters(!showUserFilters)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                    >
                      {showUserFilters ? "Hide Filters" : "Show Filters"}
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {filteredUsers.length}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Total Users
                        </p>
                        <p className="text-xs text-blue-600">
                          Registered accounts
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {
                            filteredUsers.filter(
                              (user) => user.isActive !== false
                            ).length
                          }
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Active Users
                        </p>
                        <p className="text-xs text-green-600">
                          Currently active
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {
                            filteredUsers.filter(
                              (user) => user.role === "admin"
                            ).length
                          }
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-800">
                          Administrators
                        </p>
                        <p className="text-xs text-purple-600">
                          Admin accounts
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {
                            filteredUsers.filter((user) => user.role === "user")
                              .length
                          }
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Regular Users
                        </p>
                        <p className="text-xs text-yellow-600">
                          Standard accounts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Filters */}
                {showUserFilters && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sort By
                        </label>
                        <select
                          value={userSortBy}
                          onChange={(e) => setUserSortBy(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="createdAt">Join Date</option>
                          <option value="username">Username</option>
                          <option value="email">Email</option>
                          <option value="role">Role</option>
                          <option value="lastLogin">Last Login</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order
                        </label>
                        <select
                          value={userSortOrder}
                          onChange={(e) => setUserSortOrder(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="desc">Newest First</option>
                          <option value="asc">Oldest First</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <div className="flex space-x-2 w-full">
                          <button
                            onClick={clearUserFilters}
                            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 flex-1"
                          >
                            Clear Filters
                          </button>
                          <button
                            onClick={exportUserData}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex-1"
                          >
                            Export Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          <input
                            type="checkbox"
                            checked={
                              selectedUsers.length === filteredUsers.length &&
                              filteredUsers.length > 0
                            }
                            onChange={toggleSelectAllUsers}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          User
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Joined
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Last Login
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => toggleSelectUser(user._id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-medium text-sm">
                                    {(
                                      user.firstName?.[0] ||
                                      user.username?.[0] ||
                                      user.email?.[0] ||
                                      "?"
                                    ).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {user.firstName && user.lastName
                                      ? `${user.firstName} ${user.lastName}`
                                      : user.username || "Unknown"}
                                  </div>
                                  <div className="text-gray-500 text-xs">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === "admin"
                                    ? "bg-red-100 text-red-800"
                                    : user.role === "moderator"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {user.role || "user"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.isActive !== false
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {user.isActive !== false
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {user.lastLogin
                                ? new Date(user.lastLogin).toLocaleDateString()
                                : "Never"}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewUser(user)}
                                  className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="text-green-600 hover:text-green-700 text-xs font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="text-red-600 hover:text-red-700 text-xs font-medium"
                                  disabled={user._id === user._id}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="py-12 px-4 text-center">
                            <div className="text-gray-500">
                              <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg font-medium">
                                No users found
                              </p>
                              <p className="text-sm">
                                No users match your current filter criteria
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                      Showing{" "}
                      {Math.min(
                        (userCurrentPage - 1) * usersPerPage + 1,
                        filteredUsers.length
                      )}{" "}
                      to{" "}
                      {Math.min(
                        userCurrentPage * usersPerPage,
                        filteredUsers.length
                      )}{" "}
                      of {filteredUsers.length} users
                    </span>
                    <select
                      value={usersPerPage}
                      onChange={(e) => {
                        setUsersPerPage(Number(e.target.value));
                        setUserCurrentPage(1);
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        setUserCurrentPage(Math.max(1, userCurrentPage - 1))
                      }
                      disabled={userCurrentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {[...Array(Math.min(5, userTotalPages))].map((_, i) => {
                      const pageNum = Math.max(
                        1,
                        Math.min(userTotalPages, userCurrentPage - 2 + i)
                      );
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setUserCurrentPage(pageNum)}
                          className={`px-3 py-1 border rounded text-sm ${
                            userCurrentPage === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setUserCurrentPage(
                          Math.min(userTotalPages, userCurrentPage + 1)
                        )
                      }
                      disabled={userCurrentPage === userTotalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-700">
                        {selectedUsers.length} user
                        {selectedUsers.length > 1 ? "s" : ""} selected
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            alert(
                              "Bulk activate functionality will be implemented"
                            )
                          }
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() =>
                            alert(
                              "Bulk deactivate functionality will be implemented"
                            )
                          }
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                        >
                          Deactivate
                        </button>
                        <button
                          onClick={() =>
                            alert(
                              "Bulk delete functionality will be implemented"
                            )
                          }
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Delete Selected
                        </button>
                        <button
                          onClick={() => setSelectedUsers([])}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                        >
                          Clear Selection
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Recent User Activity
                  </h4>
                  <div className="space-y-4">
                    {filteredUsers.slice(0, 5).map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-xs">
                            {(
                              user.firstName?.[0] ||
                              user.username?.[0] ||
                              user.email?.[0] ||
                              "?"
                            ).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.username || user.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString()} •{" "}
                            {user.role || "user"}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive !== false
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    User Role Distribution
                  </h4>
                  <div className="space-y-3">
                    {["admin", "moderator", "user"].map((role) => {
                      const count = filteredUsers.filter(
                        (user) => (user.role || "user") === role
                      ).length;
                      const percentage =
                        filteredUsers.length > 0
                          ? (count / filteredUsers.length) * 100
                          : 0;
                      return (
                        <div
                          key={role}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {role}s
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  role === "admin"
                                    ? "bg-red-600"
                                    : role === "moderator"
                                    ? "bg-yellow-600"
                                    : "bg-green-600"
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {count}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
