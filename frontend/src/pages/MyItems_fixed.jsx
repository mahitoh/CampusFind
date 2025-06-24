import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, BellIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useItems } from "../context/ItemsContext";
import { useAuth } from "../context/AuthContextNew";

/**
 * My Items page component
 * Displays all user items (both lost and found)
 */
const MyItems = () => {
  const { user } = useAuth();
  const { items, userItems, fetchUserItems, userItemsLoading } = useItems();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Simple effect that runs only when user changes and hasn't loaded yet
  useEffect(() => {
    if (user?.id && fetchUserItems && !hasLoadedOnce) {
      fetchUserItems();
      setHasLoadedOnce(true);
    }
  }, [user?.id, hasLoadedOnce]); // Only user ID and load flag as dependencies

  // Filter items for current user if userItems is not available
  const myItems =
    userItems?.length > 0
      ? userItems
      : items.filter(
          (item) =>
            item.reportedBy === user?.id ||
            item.userId === user?.id ||
            item.user === user?.id
        );

  // Navigation items for sidebar
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Lost Items", href: "/lost-items", icon: MagnifyingGlassIcon },
    { name: "Report Missing", href: "/report-missing", icon: BellIcon },
    { name: "Submit Found", href: "/submit-found", icon: MapPinIcon },
    { name: "My Items", href: "/my-items", icon: UserIcon, active: true },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
        <div className="flex items-center p-4 border-b">
          <Link to="/dashboard">
            <span className="text-lg font-semibold">Dashboard</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1 flex-grow">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-3 rounded-md ${
                  item.active
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t mt-auto">
          <Link
            to="/logout"
            className="flex items-center p-3 text-red-600 hover:text-red-700 rounded-md"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">Log Out</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-xl font-medium text-gray-900">
                My Items {user?.username && `- ${user.username}`}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all your reported lost and found items
              </p>

              {/* Summary Stats */}
              {userItemsLoading ? (
                // Skeleton loading for stats
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="ml-3">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-8 bg-gray-200 rounded w-8"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                myItems.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <BellIcon className="h-8 w-8 text-amber-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-amber-800">
                            Missing Items
                          </p>
                          <p className="text-2xl font-semibold text-amber-900">
                            {
                              myItems.filter(
                                (item) =>
                                  item.status === "Missing" ||
                                  item.status === "Lost"
                              ).length
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <MapPinIcon className="h-8 w-8 text-green-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Found Items
                          </p>
                          <p className="text-2xl font-semibold text-green-900">
                            {
                              myItems.filter((item) => item.status === "Found")
                                .length
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <UserIcon className="h-8 w-8 text-blue-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-800">
                            Total Items
                          </p>
                          <p className="text-2xl font-semibold text-blue-900">
                            {myItems.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* My Items Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {userItemsLoading ? (
                  // Skeleton loading state
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Skeleton rows */}
                        {[...Array(3)].map((_, index) => (
                          <tr key={index} className="animate-pulse">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-200 rounded w-36"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 bg-gray-200 rounded w-56"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-4">
                                <div className="h-4 bg-blue-200 rounded w-12"></div>
                                <div className="h-4 bg-red-200 rounded w-12"></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : myItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Item Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Location
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {myItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name || item.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.status === "Missing" ||
                                  item.status === "Lost"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.date ||
                                new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.location}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div className="max-w-xs truncate">
                                {item.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link
                                to={`/item-details/${item.id}`}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this item?"
                                    )
                                  ) {
                                    console.log("Delete item:", item.id);
                                  }
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No items found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't reported any items yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyItems;
