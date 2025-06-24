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
import { useItems } from "../context/ItemsContext";

const LostItems = () => {
  const { items: allItems, loading } = useItems();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [displayMode, setDisplayMode] = useState("Grid");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const categoryDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const lostItems = Array.isArray(allItems)
    ? allItems.filter(
        (item) => item.status === "Missing" || item.status === "Lost"
      )
    : [];

  useEffect(() => {
    console.log("LostItems component:", {
      allItemsLength: allItems?.length || 0,
      lostItemsLength: lostItems?.length || 0,
    });
  }, [allItems, lostItems, loading]);

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

  const statuses = ["All Status", "Missing", "Found"];

  const filteredItems = lostItems.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All Status" ||
      (selectedStatus === "Missing" && item.status === "Missing") ||
      (selectedStatus === "Found" && item.status === "Found");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleDisplayMode = (mode) => setDisplayMode(mode);

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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 flex flex-col">
        <div className="flex items-center p-4 border-b">
          <Link to="/">
            <span className="text-lg font-semibold">Dashboard</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1 flex-grow overflow-y-auto">
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

      {/* Main Content */}
      <div className="ml-64 flex flex-col w-full h-full">
        {/* Sticky Header */}
        <header className="sticky top-0 bg-white z-30 border-b px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-gray-600 text-lg mb-4">
              Browse all reported lost items on campus.
            </p>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, description, or location..."
                  className="w-full pl-10 pr-3 py-2 bg-black text-white rounded-md border-0 focus:ring-2 focus:ring-gray-600"
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
                      showCategoryDropdown ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
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
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {categories.map((category) => (
                        <button
                          key={category}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            category === selectedCategory
                              ? "bg-gray-800 text-white"
                              : "text-gray-200 hover:bg-gray-800"
                          }`}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryDropdown(false);
                          }}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
                      showStatusDropdown ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
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
                    <div className="py-1 max-h-48 overflow-y-auto">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            status === selectedStatus
                              ? "bg-gray-800 text-white"
                              : "text-gray-200 hover:bg-gray-800"
                          }`}
                          onClick={() => {
                            setSelectedStatus(status);
                            setShowStatusDropdown(false);
                          }}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Display Mode Toggle */}
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
            </div>
          </div>
        </header>

        {/* Scrollable Main Section */}
        <main className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4 text-gray-500 text-sm">
              Showing {filteredItems.length} items
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                <p className="mt-2 text-gray-600">Loading items...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200 w-full">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No items found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div
                className={`grid ${
                  displayMode === "Grid"
                    ? "grid-cols-1 md:grid-cols-3 gap-6"
                    : "grid-cols-1 gap-4"
                }`}
              >
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col relative"
                  >
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
                    <div className="h-48 bg-gray-200 flex items-center justify-center w-full">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          crossOrigin="anonymous"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">Item Image</span>
                      )}
                    </div>
                    <div className="p-4 bg-black text-white flex-grow flex flex-col w-full">
                      <h3 className="text-lg font-medium mb-1">{item.name}</h3>
                      <div className="flex items-center mt-1.5 text-gray-400">
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {item.location}
                        </span>
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LostItems;
