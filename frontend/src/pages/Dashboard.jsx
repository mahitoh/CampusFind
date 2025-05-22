import React, { useEffect } from "react";
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

// Mock data for my items section
const myItems = [
  {
    id: 101,
    name: "Student ID Card",
    status: "Missing",
    date: "May 18, 2023",
    location: "Library",
  },
  {
    id: 102,
    name: "Blue Notebook",
    status: "Missing",
    date: "May 19, 2023",
    location: "Science Building",
  },
  {
    id: 103,
    name: "Calculator",
    status: "Found",
    date: "May 15, 2023",
    location: "Math Department",
  },
];

const Dashboard = ({ activeTab = "dashboard" }) => {
  const location = useLocation();

  // Direct to appropriate section based on activeTab
  useEffect(() => {
    const tabElement = document.getElementById(activeTab);
    if (tabElement) {
      tabElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab]);

  const quickStats = [
    {
      title: "My Reported Items",
      value: 3,
      description: "2 active, 1 found",
      icon: BellIcon,
    },
    {
      title: "My Found Submissions",
      value: 1,
      description: "Pending review",
      icon: MapPinIcon,
    },
    {
      title: "Items Found Today",
      value: 12,
      description: "Campus-wide",
      icon: CheckCircleIcon,
    },
    {
      title: "Items Awaiting Claim",
      value: 48,
      description: "Check if yours is found",
      icon: ExclamationCircleIcon,
    },
  ];

  const recentlyLostItems = [
    {
      id: 1,
      name: "Blue Hydroflask Water Bottle",
      location: "University Center",
      time: "Today, 10:30 AM",
    },
    {
      id: 2,
      name: "MacBook Charger",
      location: "Library, 2nd Floor",
      time: "Yesterday, 6:15 PM",
    },
  ];

  const recentlyFoundItems = [
    {
      id: 1,
      name: "Silver Ring",
      location: "Cafeteria",
      time: "Today, 12:30 PM",
    },
    {
      id: 2,
      name: "Black Umbrella",
      location: "Main Hallway",
      time: "Today, 9:45 AM",
    },
  ];
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Lost Items", href: "/lost-items", icon: MagnifyingGlassIcon },
    { name: "Report Missing", href: "/report-missing", icon: BellIcon },
    { name: "Submit Found", href: "/submit-found", icon: MapPinIcon },
    { name: "My Items", href: "/my-items", icon: MagnifyingGlassIcon },
  ];

  const isActive = (path) => {
    // For /my-items, we need to check if we're either on that path or on the dashboard with activeTab set to my-items
    if (path === "/my-items") {
      return (
        location.pathname === path ||
        (location.pathname === "/dashboard" && activeTab === "my-items")
      );
    }
    return location.pathname === path;
  };
  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center p-4">
          <span className="text-lg font-medium">Dashboard</span>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-3 ${
                  isActive(item.href)
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <button className="flex items-center p-2 text-red-600 w-full">
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </div>{" "}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 py-3 px-6">
          <div className="flex justify-between items-center">
            {" "}
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
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
              </Link>
              <Link
                to="/profile"
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                {" "}
                <div className="bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
                  <span className="text-sm font-medium">JW</span>
                </div>
                <span>Profile</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              {" "}
              <h1 className="text-lg font-normal text-gray-600">
                Welcome back, John! Manage your lost and found items.
              </h1>
            </div>
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
          </div>
          <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              let iconClass = "";

              // Assign specific icon styles based on the card type
              if (index === 0) iconClass = "text-white"; // My Reported Items
              else if (index === 1)
                iconClass = "text-white"; // My Found Submissions
              else if (index === 2)
                iconClass = "text-white"; // Items Found Today
              else if (index === 3) iconClass = "text-white"; // Items Awaiting Claim

              return (
                <div key={index} className="bg-black text-white rounded-lg p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">{stat.title}</h3>
                    <Icon className={`h-5 w-5 ${iconClass}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-semibold mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>{" "}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-black text-white rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-white">
                  Recently Lost Items
                </h3>
                <p className="text-sm text-gray-400">
                  Items reported in the last 48 hours
                </p>
                <div className="mt-4 space-y-4">
                  {recentlyLostItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-4 bg-gray-900 rounded-lg"
                    >
                      <div className="mr-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.location} • {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-black text-white rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-white">
                  Recently Found Items
                </h3>
                <p className="text-sm text-gray-400">
                  Items turned in over the last 48 hours
                </p>
                <div className="mt-4 space-y-4">
                  {recentlyFoundItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-4 bg-gray-900 rounded-lg"
                    >
                      <div className="mr-3">
                        <MapPinIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.location} • {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
              </div>

              <div className="p-6">
                {myItems.length > 0 ? (
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
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {myItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.status === "Missing"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a
                                href="#"
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                View
                              </a>
                              <a
                                href="#"
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </a>
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
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
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
