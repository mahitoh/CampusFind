import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextNew";
import * as adminService from "../services/adminService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Import modular components
import {
  AdminSidebar,
  AdminHeader,
  DashboardHome,
  ManageItems,
  PendingApproval,
  ManageUsers,
} from "./admin";

// Import helper functions
import {
  filterItems,
  sortItems,
  filterUsers,
  sortUsers,
  paginateData,
  getTotalPages,
  exportToCsv,
  generateChartData,
} from "./admin/adminHelpers";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Main state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    pendingApproval: 0,
    successfulMatches: 0,
    activeUsers: 0,
  });

  // Data state
  const [pendingItems, setPendingItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ["Lost Items", "Found Items", "Claimed Items", "Returned Items"],
    datasets: [
      {
        data: [25, 35, 15, 8],
        backgroundColor: ["#EF4444", "#10B981", "#F59E0B", "#6366F1"],
        borderColor: ["#DC2626", "#059669", "#D97706", "#4F46E5"],
        borderWidth: 2,
        hoverBackgroundColor: ["#F87171", "#34D399", "#FBBF24", "#818CF8"],
      },
    ],
  });

  // Items filter state
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

  // Users filter state
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
        }

        // Load all items
        const itemsResult = await adminService.getAllItems();
        if (itemsResult.success) {
          const items = itemsResult.data.data || itemsResult.data;
          setAllItems(items);

          // Update chart data
          setChartData(generateChartData(items));

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
          ); // Update stats
          const claimedCount = items.filter(
            (item) => item.status === "Claimed"
          ).length;
          const returnedCount = items.filter(
            (item) => item.status === "Returned"
          ).length;

          setStats((prevStats) => ({
            ...prevStats,
            totalItems: items.length,
            pendingApproval: pending.length,
            successfulMatches: claimedCount + returnedCount,
          }));
        }

        // Load all users
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

  // Computed values for items
  const itemFilters = { searchTerm, filterStatus, filterCategory, dateRange };
  const filteredItems = sortItems(
    filterItems(allItems, itemFilters),
    sortBy,
    sortOrder
  );
  const totalPages = getTotalPages(filteredItems.length, itemsPerPage);
  const paginatedItems = paginateData(filteredItems, currentPage, itemsPerPage);

  // Computed values for users
  const userFilters = { userSearchTerm, userFilterRole, userFilterStatus };
  const filteredUsers = sortUsers(
    filterUsers(allUsers, userFilters),
    userSortBy,
    userSortOrder
  );
  const userTotalPages = getTotalPages(filteredUsers.length, usersPerPage);
  const paginatedUsers = paginateData(
    filteredUsers,
    userCurrentPage,
    usersPerPage
  );

  // Handlers
  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const handleApproveItem = async (itemId) => {
    try {
      const item = pendingItems.find((p) => p.id === itemId);
      if (item && item.originalItem) {
        const result = await adminService.updateItemStatus(itemId, {
          status: "Active",
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

  // Items handlers
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
    const headers = [
      "title",
      "status",
      "category",
      "location",
      "reportedBy",
      "dateReported",
      "description",
    ];
    const data = filteredItems.map((item) => ({
      title: item.title,
      status: item.status,
      category: item.category,
      location: item.location,
      reportedBy: item.reportedBy?.name || item.user?.username || "Unknown",
      dateReported: new Date(item.dateReported).toLocaleDateString(),
      description: item.description || "",
    }));

    exportToCsv(
      data,
      `campus_find_items_${new Date().toISOString().split("T")[0]}.csv`,
      headers
    );
  };

  const handleEditItem = (item) => {
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

  // Users handlers
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
    const headers = [
      "username",
      "email",
      "firstName",
      "lastName",
      "role",
      "isActive",
      "createdAt",
      "lastLogin",
    ];
    const data = filteredUsers.map((user) => ({
      username: user.username || "",
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: user.role || "user",
      isActive: user.isActive !== false ? "Active" : "Inactive",
      createdAt: new Date(user.createdAt).toLocaleDateString(),
      lastLogin: user.lastLogin
        ? new Date(user.lastLogin).toLocaleDateString()
        : "Never",
    }));

    exportToCsv(
      data,
      `campus_find_users_${new Date().toISOString().split("T")[0]}.csv`,
      headers
    );
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
        />

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Header */}
          <AdminHeader user={user} handleLogout={handleLogout} />

          {/* Main content area */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {activeTab === "dashboard" && (
                  <DashboardHome
                    stats={stats}
                    chartData={chartData}
                    loading={loading}
                  />
                )}

                {activeTab === "items" && (
                  <ManageItems
                    // Data
                    filteredItems={filteredItems}
                    paginatedItems={paginatedItems}
                    selectedItems={selectedItems}
                    // Filter states
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    // Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    totalPages={totalPages}
                    // Selection
                    toggleSelectItem={toggleSelectItem}
                    toggleSelectAll={toggleSelectAll}
                    setSelectedItems={setSelectedItems}
                    // Actions
                    handleViewItem={handleViewItem}
                    handleEditItem={handleEditItem}
                    handleDeleteItem={handleDeleteItem}
                    handleBulkStatusUpdate={handleBulkStatusUpdate}
                    handleBulkDelete={handleBulkDelete}
                    clearFilters={clearFilters}
                    exportData={exportData}
                    loading={loading}
                  />
                )}

                {activeTab === "pending" && (
                  <PendingApproval
                    pendingItems={pendingItems}
                    handleApproveItem={handleApproveItem}
                    handleRejectItem={handleRejectItem}
                    loading={loading}
                  />
                )}

                {activeTab === "users" && (
                  <ManageUsers
                    // Data
                    filteredUsers={filteredUsers}
                    paginatedUsers={paginatedUsers}
                    selectedUsers={selectedUsers}
                    // Filter states
                    userSearchTerm={userSearchTerm}
                    setUserSearchTerm={setUserSearchTerm}
                    userFilterRole={userFilterRole}
                    setUserFilterRole={setUserFilterRole}
                    userFilterStatus={userFilterStatus}
                    setUserFilterStatus={setUserFilterStatus}
                    userSortBy={userSortBy}
                    setUserSortBy={setUserSortBy}
                    userSortOrder={userSortOrder}
                    setUserSortOrder={setUserSortOrder}
                    showUserFilters={showUserFilters}
                    setShowUserFilters={setShowUserFilters}
                    // Pagination
                    userCurrentPage={userCurrentPage}
                    setUserCurrentPage={setUserCurrentPage}
                    usersPerPage={usersPerPage}
                    setUsersPerPage={setUsersPerPage}
                    userTotalPages={userTotalPages}
                    // Selection
                    toggleSelectUser={toggleSelectUser}
                    toggleSelectAllUsers={toggleSelectAllUsers}
                    setSelectedUsers={setSelectedUsers}
                    // Actions
                    handleViewUser={handleViewUser}
                    handleEditUser={handleEditUser}
                    handleDeleteUser={handleDeleteUser}
                    clearUserFilters={clearUserFilters}
                    exportUserData={exportUserData}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
