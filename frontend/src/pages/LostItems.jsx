import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, BellIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  FunnelIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

/**
 * Lost Items page component
 * Displays all lost items reported on campus with filtering capabilities
 */
const LostItems = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [displayMode, setDisplayMode] = useState("Grid"); // Grid or List
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Refs for dropdown menus
  const categoryDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }

      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Example lost items data
  const lostItems = [
    {
      id: 1,
      name: 'MacBook Pro 13"',
      location: "University Library, Study Room 4",
      date: "May 15, 2023",
      description:
        "Space gray MacBook Pro with stickers on the cover. Last seen in the library.",
      status: "Missing",
      image: null, // placeholder for image
      category: "Electronics",
    },
    {
      id: 2,
      name: "Hydroflask Water Bottle",
      location: "Science Building, Room 302",
      date: "May 17, 2023",
      description: "Blue 32oz Hydroflask with university logo sticker.",
      status: "Found",
      image: null, // placeholder for image
      category: "Accessories",
    },
    {
      id: 3,
      name: "Student ID Card",
      location: "Student Center",
      date: "May 18, 2023",
      description: "Student ID for James Wilson.",
      status: "Missing",
      image: null, // placeholder for image
      category: "ID/Cards",
    },
    {
      id: 4,
      name: "Gray North Face Backpack",
      location: "Gym Locker Room",
      date: "May 14, 2023",
      description:
        "Gray North Face backpack with laptop, textbooks, and calculator inside.",
      status: "Found",
      image: null, // placeholder for image
      category: "Accessories",
    },
    {
      id: 5,
      name: "AirPods Pro",
      location: "Cafeteria",
      date: "May 10, 2023",
      description: "AirPods Pro in white case with small scratch on the back.",
      status: "Found",
      image: null, // placeholder for image
      category: "Electronics",
    },
    {
      id: 6,
      name: "Psychology Textbook",
      location: "Psychology Building",
      date: "May 12, 2023",
      description:
        "Introduction to Psychology textbook with highlighted notes.",
      status: "Missing",
      image: null, // placeholder for image
      category: "Books/Notes",
    },
  ];

  // Available categories
  const categories = [
    "All Categories",
    "Electronics",
    "Clothing",
    "Accessories",
    "Books/Notes",
    "Keys",
    "ID/Cards",
    "Other",
  ];

  // Status options
  const statuses = ["All Status", "Missing", "Found"];

  // Filter items based on search, category, and status
  const filteredItems = lostItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All Status" ||
      (selectedStatus === "Missing" && item.status === "Missing") ||
      (selectedStatus === "Found" && item.status === "Found");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Toggle display mode between grid and list
  const toggleDisplayMode = (mode) => {
    setDisplayMode(mode);
  };

  // Navigation items for sidebar
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    {
      name: "Lost Items",
      href: "/lost-items",
      icon: MagnifyingGlassIcon,
      active: true,
    },
    { name: "Report Missing", href: "/report-missing", icon: BellIcon },
    { name: "Submit Found", href: "/submit-found", icon: MapPinIcon },
    { name: "My Items", href: "/my-items", icon: UserIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
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
            {" "}
            {/* Page Header */}
            <div className="mb-6">
              <p className="text-gray-600 text-lg">
                Browse all reported lost items on campus.
              </p>
            </div>{" "}
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mb-6">
              {/* Search Bar */}
              <div className="flex-grow relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, description, or location..."
                  className="block w-full pl-10 pr-3 py-2 bg-black text-white rounded-md border-0 focus:ring-2 focus:ring-gray-600 focus:outline-none"
                />
              </div>
              {/* Category Filter */}
              <div className="relative min-w-[150px]" ref={categoryDropdownRef}>
                <button
                  type="button"
                  className="flex justify-between items-center w-full px-4 py-2 bg-black text-white rounded-md"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <div className="flex items-center">
                    <FunnelIcon className="h-5 w-5 mr-2" />
                    <span>{selectedCategory}</span>
                  </div>
                  <svg
                    className={`h-5 w-5 transition-transform ${
                      showCategoryDropdown ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showCategoryDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-black rounded-md shadow-lg overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                      <div className="py-1">
                        <button className="flex items-center w-full text-left px-4 py-2 text-sm bg-gray-800 text-white">
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="font-medium">All Categories</span>
                        </button>
                        {categories.slice(1).map((category) => (
                          <button
                            key={category}
                            className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                              category === selectedCategory
                                ? "text-white bg-gray-800"
                                : "text-gray-200 hover:bg-gray-800"
                            }`}
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowCategoryDropdown(false);
                            }}
                          >
                            {category === selectedCategory && (
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                            <span
                              className={
                                category === selectedCategory
                                  ? "font-medium"
                                  : ""
                              }
                            >
                              {category}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>{" "}
              {/* Status Filter */}
              <div className="relative min-w-[150px]" ref={statusDropdownRef}>
                <button
                  type="button"
                  className="flex justify-between items-center w-full px-4 py-2 bg-black text-white rounded-md"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <span>{selectedStatus}</span>
                  <svg
                    className={`h-5 w-5 transition-transform ${
                      showStatusDropdown ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showStatusDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-black rounded-md shadow-lg overflow-hidden">
                    <div className="max-h-48 overflow-y-auto">
                      <div className="py-1">
                        <button className="flex items-center w-full text-left px-4 py-2 text-sm bg-gray-800 text-white">
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="font-medium">All Status</span>
                        </button>
                        {statuses.slice(1).map((status) => (
                          <button
                            key={status}
                            className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                              status === selectedStatus
                                ? "text-white bg-gray-800"
                                : "text-gray-200 hover:bg-gray-800"
                            }`}
                            onClick={() => {
                              setSelectedStatus(status);
                              setShowStatusDropdown(false);
                            }}
                          >
                            {status === selectedStatus && (
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                            <span
                              className={
                                status === selectedStatus ? "font-medium" : ""
                              }
                            >
                              {status}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>{" "}
              {/* Display Toggle */}
              <div className="rounded-md overflow-hidden flex">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    displayMode === "Grid"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => toggleDisplayMode("Grid")}
                >
                  Grid
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    displayMode === "List"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => toggleDisplayMode("List")}
                >
                  List
                </button>
              </div>
            </div>{" "}
            {/* Item Count */}
            <div className="mb-4 text-gray-500 text-sm">
              Showing {filteredItems.length} items
            </div>{" "}
            {/* Items Grid */}
            <div
              className={`grid ${
                displayMode === "Grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col"
                >
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        item.status === "Missing"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Item Image Placeholder */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Item Image</span>
                  </div>

                  {/* Item Details */}
                  <div className="p-4 bg-black text-white flex-grow flex flex-col">
                    <h3 className="text-lg font-medium mb-1">{item.name}</h3>

                    <div className="flex items-center mt-1.5 text-gray-400">
                      <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm truncate">{item.location}</span>
                    </div>

                    <div className="flex items-center mt-1 text-gray-400">
                      <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm">{item.date}</span>
                    </div>

                    <p className="mt-2 text-sm text-gray-300 line-clamp-2 flex-grow">
                      {item.description}
                    </p>

                    <div className="mt-3 flex justify-end">
                      <Link
                        to={`/item-details/${item.id}`}
                        className="inline-block px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No items found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LostItems;
