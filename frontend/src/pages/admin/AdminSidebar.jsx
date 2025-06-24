import React from "react";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  stats,
  mobileMenuOpen,
  setMobileMenuOpen,
  handleLogout,
}) => {
  const navigation = [
    {
      name: "Dashboard",
      icon: HomeIcon,
      key: "dashboard",
      count: null,
    },
    {
      name: "Manage Items",
      icon: ClipboardDocumentListIcon,
      key: "items",
      count: stats.totalItems,
    },
    {
      name: "Pending Approval",
      icon: Cog6ToothIcon,
      key: "pending",
      count: stats.pendingApproval,
    },
    {
      name: "Users",
      icon: UsersIcon,
      key: "users",
      count: stats.activeUsers,
    },
    {
      name: "Settings",
      icon: Cog6ToothIcon,
      key: "settings",
      count: null,
    },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}{" "}
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20">
          {/* Mobile Navigation - No header needed since CampusFind is in main nav */}
          <div className="flex-1 flex flex-col overflow-y-auto pt-4">
            <nav className="flex-1 px-3 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setMobileMenuOpen(false); // Close mobile menu on selection
                    }}
                    className={`${
                      activeTab === item.key
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    } group w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200`}
                  >
                    <Icon
                      className={`${
                        activeTab === item.key
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-300"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.count !== null && (
                      <span
                        className={`${
                          activeTab === item.key
                            ? "bg-blue-800 text-blue-100"
                            : "bg-gray-800 text-gray-300 group-hover:bg-gray-700"
                        } ml-3 inline-block py-0.5 px-2.5 text-xs rounded-full font-medium`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile logout button */}
            <div className="px-3 py-4 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:top-20 z-30">
        <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
          {/* Desktop Scrollable Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto pt-4 pb-4">
            <nav className="flex-1 px-3 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`${
                      activeTab === item.key
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    } group w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200`}
                  >
                    <Icon
                      className={`${
                        activeTab === item.key
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-300"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.count !== null && (
                      <span
                        className={`${
                          activeTab === item.key
                            ? "bg-blue-800 text-blue-100"
                            : "bg-gray-800 text-gray-300 group-hover:bg-gray-700"
                        } ml-3 inline-block py-0.5 px-2.5 text-xs rounded-full font-medium`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Desktop footer */}
            <div className="px-3 py-4 border-t border-gray-800">
              <div className="text-xs text-gray-400 text-center">
                System Status: Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
