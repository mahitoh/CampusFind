import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

const ManageItems = ({
  // Data
  filteredItems,
  paginatedItems,
  selectedItems,
  // Filter states
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  dateRange,
  setDateRange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  showFilters,
  setShowFilters,
  // Pagination
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalPages,
  // Selection
  toggleSelectItem,
  toggleSelectAll,
  setSelectedItems,
  // Actions
  handleViewItem,
  handleEditItem,
  handleDeleteItem,
  handleBulkStatusUpdate,
  handleBulkDelete,
  clearFilters,
  exportData,
  loading,
}) => {
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Items
            </h2>
            <p className="text-gray-600">
              Monitor and manage all lost and found items in the system
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
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
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
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
      </div>{" "}
      {/* Enhanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Filter Options
            </h3>
            <p className="text-sm text-gray-600">
              Use the filters below to narrow down your search results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Search Items
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description..."
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="all">All Statuses</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
                <option value="Claimed">Claimed</option>
                <option value="Returned">Returned</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Accessories">Accessories</option>
                <option value="Documents">Documents</option>
                <option value="Keys">Keys</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="dateReported">Date</option>
                  <option value="title">Title</option>
                  <option value="status">Status</option>
                  <option value="category">Category</option>
                  <option value="location">Location</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:max-w-md">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
              </div>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}{" "}
      {/* Enhanced Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Items Overview
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Total: {filteredItems.length} items found
              </p>
            </div>
            {selectedItems.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  <span className="font-medium">
                    {selectedItems.length} selected
                  </span>
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkStatusUpdate(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Update Status</option>
                  <option value="Lost">Mark as Lost</option>
                  <option value="Found">Mark as Found</option>
                  <option value="Claimed">Mark as Claimed</option>
                  <option value="Returned">Mark as Returned</option>
                </select>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>{" "}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === filteredItems.length &&
                      filteredItems.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date Reported
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
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
              ) : paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleSelectItem(item._id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {item.images && item.images.length > 0 ? (
                          <div className="flex-shrink-0">
                            <img
                              src={`${import.meta.env.VITE_API_URL}/uploads/${
                                item.images[0]
                              }`}
                              alt={item.title}
                              className="h-12 w-12 rounded-lg object-cover ring-2 ring-gray-200"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="h-6 w-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {item.description?.substring(0, 60)}
                            {item.description?.length > 60 ? "..." : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === "Lost"
                            ? "bg-red-100 text-red-800 ring-1 ring-red-200"
                            : item.status === "Found"
                            ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                            : item.status === "Claimed"
                            ? "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200"
                            : item.status === "Returned"
                            ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                            : "bg-gray-100 text-gray-800 ring-1 ring-gray-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <svg
                          className="h-4 w-4 text-gray-400 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {item.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {item.reportedBy?.name ||
                          item.user?.username ||
                          "Unknown User"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(item.dateReported).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewItem(item)}
                          className="inline-flex items-center p-1.5 border border-transparent rounded-lg text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="inline-flex items-center p-1.5 border border-transparent rounded-lg text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                          title="Edit Item"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="inline-flex items-center p-1.5 border border-transparent rounded-lg text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                          title="Delete Item"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-16 px-4 text-center">
                    <div className="text-gray-500">
                      <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No items found
                      </h3>
                      <p className="text-gray-500 max-w-sm mx-auto">
                        No items match your current filter criteria. Try
                        adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>{" "}
        {/* Enhanced Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filteredItems.length
                )}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredItems.length)}
              </span>{" "}
              of <span className="font-medium">{filteredItems.length}</span>{" "}
              items
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors duration-150"
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
                  className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors duration-150 ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
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
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors duration-150"
            >
              Next
            </button>
          </div>
        </div>
      </div>{" "}
      {/* Enhanced Bulk Actions Footer */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-4 max-w-2xl">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {selectedItems.length} item
                  {selectedItems.length > 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkStatusUpdate(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Update Status</option>
                  <option value="Lost">Mark as Lost</option>
                  <option value="Found">Mark as Found</option>
                  <option value="Claimed">Mark as Claimed</option>
                  <option value="Returned">Mark as Returned</option>
                </select>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItems;
