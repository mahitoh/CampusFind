import React from "react";
import { EyeIcon, UsersIcon } from "@heroicons/react/24/outline";

const ManageUsers = ({
  // Data
  filteredUsers,
  paginatedUsers,
  selectedUsers,
  // Filter states
  userSearchTerm,
  setUserSearchTerm,
  userFilterRole,
  setUserFilterRole,
  userFilterStatus,
  setUserFilterStatus,
  userSortBy,
  setUserSortBy,
  userSortOrder,
  setUserSortOrder,
  showUserFilters,
  setShowUserFilters,
  // Pagination
  userCurrentPage,
  setUserCurrentPage,
  usersPerPage,
  setUsersPerPage,
  userTotalPages,
  // Selection
  toggleSelectUser,
  toggleSelectAllUsers,
  setSelectedUsers,
  // Actions
  handleViewUser,
  handleEditUser,
  handleDeleteUser,
  clearUserFilters,
  exportUserData,
  loading,
}) => {
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUserFilters(!showUserFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
              />
            </svg>
            {showUserFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={exportUserData}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      {showUserFilters && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={userFilterRole}
                onChange={(e) => setUserFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={userFilterStatus}
                onChange={(e) => setUserFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  value={userSortBy}
                  onChange={(e) => setUserSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt">Join Date</option>
                  <option value="username">Username</option>
                  <option value="email">Email</option>
                  <option value="role">Role</option>
                  <option value="lastLogin">Last Login</option>
                </select>
                <button
                  onClick={() =>
                    setUserSortOrder(userSortOrder === "asc" ? "desc" : "asc")
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {userSortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearUserFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-3 border-b border-gray-200 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Users ({filteredUsers.length})
            </h3>
            {selectedUsers.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    alert("Bulk activate functionality will be implemented")
                  }
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Activate Selected
                </button>
                <button
                  onClick={() =>
                    alert("Bulk deactivate functionality will be implemented")
                  }
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                >
                  Deactivate Selected
                </button>
                <button
                  onClick={() =>
                    alert("Bulk delete functionality will be implemented")
                  }
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length}
                    onChange={toggleSelectAllUsers}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <LoadingSkeleton />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleSelectUser(user._id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {(
                              user.firstName?.[0] ||
                              user.username?.[0] ||
                              user.email?.[0] ||
                              "?"
                            ).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.username || user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username || user.email?.split("@")[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                        >
                          <EyeIcon className="h-4 w-4" />
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
                  <td colSpan="8" className="py-12 px-4 text-center">
                    <div className="text-gray-500">
                      <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No users found</p>
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
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Showing{" "}
              {Math.min(
                (userCurrentPage - 1) * usersPerPage + 1,
                filteredUsers.length
              )}{" "}
              to{" "}
              {Math.min(userCurrentPage * usersPerPage, filteredUsers.length)}{" "}
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
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  alert("Bulk activate functionality will be implemented")
                }
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() =>
                  alert("Bulk deactivate functionality will be implemented")
                }
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
              >
                Deactivate
              </button>
              <button
                onClick={() =>
                  alert("Bulk delete functionality will be implemented")
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

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Recent User Activity
          </h4>
          <div className="space-y-4">
            {filteredUsers.slice(0, 5).map((user) => (
              <div key={user._id} className="flex items-center space-x-3">
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
                    Joined {new Date(user.createdAt).toLocaleDateString()} •{" "}
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
                <div key={role} className="flex items-center justify-between">
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
                    <span className="text-sm text-gray-500">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
