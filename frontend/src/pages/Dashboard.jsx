import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BellIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContextNew";
import { useItems } from "../context/ItemsContext";

const Dashboard = ({ activeTab = "dashboard" }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { items, userItems, fetchUserItems } = useItems();
  const [stats, setStats] = useState({
    reportedItems: 0,
    foundSubmissions: 0,
    itemsFoundToday: 0,
    itemsAwaitingClaim: 0,
  });

  // Fetch user items when component mounts or user changes
  useEffect(() => {
    if (user && fetchUserItems) {
      fetchUserItems();
    }
  }, [user, fetchUserItems]);
  // Calculate stats based on user items and all items
  useEffect(() => {
    if (user && userItems && items) {
      // Separate user's lost and found items
      const myLostItems = userItems.filter(
        (item) => item.status === "Missing" || item.status === "Lost"
      );
      const myFoundItems = userItems.filter((item) => item.status === "Found");

      // Today's items (items from last 24 hours)
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const todayItems = items.filter((item) => {
        const itemDate = new Date(item.date || item.createdAt);
        return itemDate >= yesterday;
      });

      setStats({
        reportedItems: myLostItems.length,
        foundSubmissions: myFoundItems.length,
        itemsFoundToday: todayItems.filter((item) => item.status === "Found")
          .length,
        itemsAwaitingClaim: items.filter(
          (item) => item.status === "Found" && !item.claimed
        ).length,
      });
    }
  }, [user, userItems, items]);

  // Get recent items for dashboard display
  const recentlyLostItems = items
    .filter((item) => item.status === "Missing" || item.status === "Lost")
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      name: item.name || item.title,
      location: item.location,
      time: new Date(item.date || item.createdAt).toLocaleDateString(),
    }));

  const recentlyFoundItems = items
    .filter((item) => item.status === "Found")
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      name: item.name || item.title,
      location: item.location,
      time: new Date(item.date || item.createdAt).toLocaleDateString(),
    }));

  useEffect(() => {
    const tabElement = document.getElementById(activeTab);
    if (tabElement) {
      tabElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Lost Items", href: "/lost-items", icon: MagnifyingGlassIcon },
    { name: "Report Missing", href: "/report-missing", icon: BellIcon },
    { name: "Submit Found", href: "/submit-found", icon: MapPinIcon },
    { name: "My Items", href: "/my-items", icon: UserIcon },
  ];

  const isActive = (path) => {
    if (path === "/my-items") {
      return (
        location.pathname === path ||
        (location.pathname === "/dashboard" && activeTab === "my-items")
      );
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 h-screen fixed bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center p-4 border-b">
          <Link to="/">
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
                  isActive(item.href)
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
        <div className="p-4 border-t">
          <Link
            to="/logout"
            className="flex items-center p-3 text-red-600 hover:text-red-700 rounded-md"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
            <span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Fixed Header */}
        <header className="bg-white border-b border-gray-200 py-3 px-6 fixed top-0 left-64 right-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-blue-600">
                <MapPinIcon className="h-5 w-5 mr-1" />
                <span>Location</span>
              </Link>
              <Link
                to="/campus-map"
                className="text-gray-600 hover:text-gray-800"
              >
                Campus Map
              </Link>
              <Link
                to="/locations"
                className="text-gray-600 hover:text-gray-800"
              >
                Locations
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/notifications"
                className="text-gray-600 hover:text-gray-800"
              >
                <BellIcon className="h-5 w-5" />
              </Link>{" "}
              <Link
                to="/profile"
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                {" "}
                <div className="bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
                  <span className="text-sm font-medium">
                    {user?.username
                      ? user.username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </span>
                </div>
                <span>Profile</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable Main Section */}
        <main className="flex-1 p-6 mt-16 overflow-y-auto">
          {" "}
          <div className="flex justify-between items-center mb-6">
            {" "}
            <h1 className="text-lg font-normal text-gray-600">
              Welcome back,{" "}
              {user?.username || user?.name?.split(" ")[0] || "User"}! Manage
              your lost and found items.
            </h1>
            <div className="flex space-x-4">
              <Link
                to="/report-missing"
                className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-black hover:bg-gray-50"
              >
                <BellIcon className="h-5 w-5 mr-2" />
                <span>Report Missing Item</span>
              </Link>
              <Link
                to="/submit-found"
                className="flex items-center px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
              >
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>Submit Found Item</span>
              </Link>
            </div>
          </div>{" "}
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              {
                title: "My Reported Items",
                value: stats.reportedItems,
                description: `${stats.reportedItems} reported`,
                icon: BellIcon,
              },
              {
                title: "My Found Submissions",
                value: stats.foundSubmissions,
                description: `${stats.foundSubmissions} submitted`,
                icon: MapPinIcon,
              },
              {
                title: "Items Found Today",
                value: stats.itemsFoundToday,
                description: "Campus-wide",
                icon: CheckCircleIcon,
              },
              {
                title: "Items Awaiting Claim",
                value: stats.itemsAwaitingClaim,
                description: "Check if yours is found",
                icon: ExclamationCircleIcon,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-black text-white rounded-lg p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">{stat.title}</h3>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-semibold mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>{" "}
          {/* Recently Lost & Found Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              [
                "Recently Lost Items",
                recentlyLostItems,
                MagnifyingGlassIcon,
                "text-orange-500",
              ],
              [
                "Recently Found Items",
                recentlyFoundItems,
                MapPinIcon,
                "text-green-500",
              ],
            ].map(([title, itemsList, IconComponent, color], i) => {
              const ItemIcon = IconComponent; // Rename to avoid lint warning
              return (
                <div key={i} className="bg-black text-white rounded-lg p-6">
                  <h3 className="text-lg font-medium">{title}</h3>
                  <p className="text-sm text-gray-400">
                    Items reported in the last 48 hours
                  </p>{" "}
                  <div className="mt-4 space-y-4">
                    {itemsList.length > 0 ? (
                      itemsList.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center p-4 bg-gray-900 rounded-lg"
                        >
                          <ItemIcon className={`h-5 w-5 mr-3 ${color}`} />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-400">
                              {item.location} • {item.time}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400 text-sm">
                          No recent {title.toLowerCase()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* My Items Section */}
          <div
            id="my-items"
            className={`mt-8 ${activeTab === "my-items" ? "" : "hidden"}`}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium">My Items</h3>
                <p className="text-sm text-gray-500">
                  Manage all your reported items
                </p>
              </div>{" "}
              <div className="p-6">
                {userItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {[
                            "Item Name",
                            "Status",
                            "Date",
                            "Location",
                            "Actions",
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name || item.title}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                                  item.status === "Missing" ||
                                  item.status === "Lost"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(
                                item.date || item.createdAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {item.location}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                              <Link
                                to={`/item-details/${item.id}`}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => {
                                  // Add delete functionality here
                                  console.log("Delete item:", item.id);
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
                    <div className="mt-6">
                      <Link
                        to="/report-missing"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Report Missing Item
                      </Link>
                    </div>
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

export default Dashboard;
