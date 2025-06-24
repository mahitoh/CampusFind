import React from "react";
import { Pie } from "react-chartjs-2";

const DashboardHome = ({ stats, chartData, loading }) => {
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
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
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg">
        <div className="px-6 py-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-blue-100">
            Here's what's happening with your campus lost and found system
            today.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
              </div>
              <div className="ml-4 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Total Items
                  </dt>
                  <dd>
                    {loading ? (
                      <div className="h-8 bg-gray-700 rounded w-16 animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-bold text-white">
                        {stats.totalItems}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
              </div>
              <div className="ml-4 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Pending Approval
                  </dt>
                  <dd>
                    {loading ? (
                      <div className="h-8 bg-gray-700 rounded w-16 animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-bold text-white">
                        {stats.pendingApproval}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
              </div>
              <div className="ml-4 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Successful Matches
                  </dt>
                  <dd>
                    {loading ? (
                      <div className="h-8 bg-gray-700 rounded w-16 animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-bold text-white">
                        {stats.successfulMatches}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {" "}
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Active Users
                  </dt>
                  <dd>
                    {loading ? (
                      <div className="h-8 bg-gray-700 rounded w-16 animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-bold text-white">
                        {stats.activeUsers}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            System Overview
          </h3>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="h-80">
              <Pie data={chartData} options={chartOptions} />
            </div>
          )}
        </div>{" "}
        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Statistics
          </h3>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                <span className="text-sm font-medium text-gray-300">
                  Items Today
                </span>
                <span className="text-sm text-white font-semibold">
                  {Math.floor(stats.totalItems * 0.1)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                <span className="text-sm font-medium text-gray-300">
                  Match Rate
                </span>
                <span className="text-sm text-green-400 font-semibold">
                  {stats.totalItems > 0
                    ? (
                        (stats.successfulMatches / stats.totalItems) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>{" "}
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                <span className="text-sm font-medium text-gray-300">
                  Average Response Time
                </span>
                <span className="text-sm text-blue-400 font-semibold">
                  2.3 hours
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                <span className="text-sm font-medium text-gray-300">
                  User Satisfaction
                </span>
                <span className="text-sm text-purple-400 font-semibold">
                  94.2%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Action Required
        </h3>
        {loading ? (
          <LoadingSkeleton />
        ) : stats.pendingApproval > 0 ? (
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>{" "}
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-300">
                  Items Pending Approval
                </h3>
                <div className="mt-2 text-sm text-yellow-200">
                  <p>
                    You have {stats.pendingApproval} item
                    {stats.pendingApproval > 1 ? "s" : ""} waiting for approval.
                    Review and approve them to keep the system running smoothly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-300">
                  All Caught Up!
                </h3>
                <div className="mt-2 text-sm text-green-200">
                  <p>
                    Great job! There are no items pending approval at this time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
