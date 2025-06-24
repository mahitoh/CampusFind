import React from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const AdminHeader = ({
  user,
  handleLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="flex justify-between items-center py-5 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {/* Mobile hamburger menu */}
          <div className="md:hidden mr-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`block h-6 w-6 transition-transform duration-200 ${
                  mobileMenuOpen ? "rotate-90" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>{" "}
          {/* CampusFind brand - Always visible */}
          <div className="flex items-center">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">CF</span>
            </div>{" "}
            <div className="ml-3">
              <h1 className="text-xl font-bold text-white tracking-tight">
                CampusFind
              </h1>
              <p className="text-xs text-gray-400 hidden md:block">
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>{" "}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username || user?.email}
              </p>
              <p className="text-xs text-gray-400">{user?.role || "Admin"}</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {(
                  user?.firstName?.[0] ||
                  user?.username?.[0] ||
                  user?.email?.[0] ||
                  "A"
                ).toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-2 border border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
