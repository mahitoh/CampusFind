import React from "react";
import { CheckIcon, XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";

const PendingApproval = ({
  pendingItems,
  handleApproveItem,
  handleRejectItem,
  loading,
}) => {
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Pending Approval</h2>
        <div className="bg-yellow-900 border border-yellow-700 px-3 py-1 rounded-full">
          <span className="text-yellow-300 text-sm font-medium">
            {pendingItems.length} items pending
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-900 rounded-lg">
              <svg
                className="h-6 w-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Items Waiting</p>
              <p className="text-2xl font-bold text-white">
                {pendingItems.length}
              </p>
            </div>
          </div>
        </div>{" "}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-900 rounded-lg">
              <svg
                className="h-6 w-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">
                Avg. Wait Time
              </p>
              <p className="text-2xl font-bold text-white">2.3h</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-900 rounded-lg">
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Approval Rate</p>{" "}
              <p className="text-2xl font-bold text-white">94%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-blue-900 border-l-4 border-blue-400 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>{" "}
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-300">
              Approval Guidelines
            </h3>
            <div className="mt-2 text-sm text-blue-200">
              <ul className="list-disc list-inside space-y-1">
                <li>Verify that item descriptions are clear and appropriate</li>
                <li>Check if images are relevant and not inappropriate</li>
                <li>Ensure location information is accurate</li>
                <li>Look for duplicate submissions</li>
                <li>Reject items with insufficient information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Items */}
      <div className="bg-gray-800 shadow-lg overflow-hidden sm:rounded-xl border border-gray-700">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-white mb-4">
            Items Awaiting Approval
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            These items need to be reviewed and approved.
          </p>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <LoadingSkeleton />
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : pendingItems.length > 0 ? (
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.type === "Missing"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Submitted by:</span>{" "}
                          {item.submittedBy}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {item.date}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>{" "}
                          {item.originalItem?.category || "Unknown"}
                        </div>
                      </div>

                      {item.originalItem?.description && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-700">
                            Description:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {item.originalItem.description}
                          </p>
                        </div>
                      )}

                      {item.originalItem?.location && (
                        <div className="mt-2">
                          <span className="font-medium text-gray-700">
                            Location:
                          </span>
                          <span className="text-gray-600 ml-2">
                            {item.originalItem.location}
                          </span>
                        </div>
                      )}

                      {item.originalItem?.images &&
                        item.originalItem.images.length > 0 && (
                          <div className="mt-3">
                            <span className="font-medium text-gray-700">
                              Images:
                            </span>
                            <div className="flex space-x-2 mt-2">
                              {item.originalItem.images
                                .slice(0, 3)
                                .map((image, index) => (
                                  <img
                                    key={index}
                                    src={`${
                                      import.meta.env.VITE_API_URL
                                    }/uploads/${image}`}
                                    alt={`${item.name} ${index + 1}`}
                                    className="h-16 w-16 rounded-lg object-cover border"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ))}
                              {item.originalItem.images.length > 3 && (
                                <div className="h-16 w-16 rounded-lg border border-gray-300 flex items-center justify-center bg-gray-50">
                                  <span className="text-xs text-gray-500">
                                    +{item.originalItem.images.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="flex space-x-2 ml-6">
                      <button
                        onClick={() => {
                          // TODO: Implement view details
                          alert(
                            `Item Details:\n\nName: ${item.name}\nType: ${
                              item.type
                            }\nSubmitted by: ${item.submittedBy}\nDate: ${
                              item.date
                            }\nCategory: ${
                              item.originalItem?.category || "Unknown"
                            }\nLocation: ${
                              item.originalItem?.location || "Unknown"
                            }\nDescription: ${
                              item.originalItem?.description || "No description"
                            }`
                          );
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => handleApproveItem(item.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectItem(item.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <CheckIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm">
                  There are no items pending approval at this time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {pendingItems.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to approve all ${pendingItems.length} pending items?`
                  )
                ) {
                  pendingItems.forEach((item) => handleApproveItem(item.id));
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Approve All
            </button>
            <button
              onClick={() => {
                alert(
                  "Bulk reject functionality will be implemented in a future update"
                );
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Bulk Actions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApproval;
