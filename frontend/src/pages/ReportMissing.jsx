import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPinIcon, BellIcon } from "@heroicons/react/24/outline";
import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useItems } from "../context/ItemsContext";

/**
 * Report Missing Item page component
 * Allows users to report details about items they lost on campus
 */
const ReportMissing = () => {
  const { addLostItem } = useItems();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    date: "",
    location: "",
    description: "",
    contactPhone: "",
    images: [],
  });
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the image
      setImagePreview(URL.createObjectURL(file));

      // Add to form data
      setFormData((prev) => ({
        ...prev,
        images: [file],
      }));
    }
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Submitting lost item report:", formData);

      // Call the API through the context
      const itemId = await addLostItem(formData);

      alert(
        "Your lost item report has been submitted! We'll notify you if we find a match."
      );

      // Navigate to the item details page or back to the lost items list
      navigate(`/item-details/${itemId}`);
    } catch (err) {
      console.error("Failed to submit report:", err);
      setError("Failed to submit your report. Please try again.");
      alert("There was a problem submitting your report. Please try again.");
    } finally {
      setIsSubmitting(false);
    } // Reset form after submission
    setFormData({
      name: "",
      category: "",
      date: "",
      location: "",
      description: "",
      contactPhone: "",
    });
  };

  // Navigation items for sidebar
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Lost Items", href: "/lost-items", icon: MagnifyingGlassIcon },
    { name: "Report Missing", href: "/report-missing", icon: BellIcon },
    { name: "Submit Found", href: "/submit-found", icon: MapPinIcon },
    { name: "My Items", href: "/my-items", icon: MagnifyingGlassIcon },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center p-4">
          <span className="text-lg font-medium">Dashboard</span>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/report-missing";
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-3 ${
                  isActive
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header with Location and Profile */}
        <header className="bg-white border-b border-gray-200 py-3 px-6">
          <div className="flex justify-between items-center">
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
                <div className="bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
                  <span className="text-sm font-medium">JW</span>
                </div>
                <span>Profile</span>
              </Link>
            </div>
          </div>
        </header>
        {/* Main Form Content */}{" "}
        <main className="flex-1 p-6 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Introduction Text */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <div className="mb-8 text-center">
              <p className="text-gray-600 mt-2">
                Fill out this form with as much detail as possible to help us
                find your lost item.
              </p>
            </div>

            {/* Lost Item Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-black text-white rounded-lg p-8"
            >
              <h3 className="text-xl font-semibold mb-2">
                Missing Item Details
              </h3>
              <p className="text-gray-400 mb-6">
                Please provide all relevant information about your lost item.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Item Name */}{" "}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Item Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Blue Backpack"
                    className="w-full bg-gray-900 border-gray-700 rounded-md p-3 text-white placeholder-gray-500"
                    required
                  />
                </div>
                {/* Item Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium mb-2"
                  >
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border-gray-700 rounded-md p-3 text-white appearance-none"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Books/Notes">Books/Notes</option>
                      <option value="Keys">Keys</option>
                      <option value="ID/Cards">ID/Cards</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg
                        className="h-5 w-5"
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
                    </div>
                  </div>
                </div>
              </div>
              {/* Date and Location Last Seen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {" "}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium mb-2"
                  >
                    Date Last Seen
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border-gray-700 rounded-md p-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium mb-2"
                  >
                    Location Last Seen
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Library, 2nd Floor"
                    className="w-full bg-gray-900 border-gray-700 rounded-md p-3 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>
              {/* Item Description */}
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                >
                  Item Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description (color, brand, distinctive features, contents, etc.)"
                  rows={5}
                  className="w-full bg-gray-900 border-gray-700 rounded-md p-3 text-white placeholder-gray-500"
                  required
                />
                <p className="text-gray-400 text-sm mt-2">
                  The more details you provide, the easier it will be to
                  identify your item.
                </p>
              </div>{" "}
              {/* Item Image Upload */}
              <div className="mb-6">
                <label
                  htmlFor="imageUpload"
                  className="block text-sm font-medium mb-2"
                >
                  Upload Image (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-900 rounded-md tracking-wide cursor-pointer hover:bg-gray-800 transition ease-in-out duration-150">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="mt-2 text-sm text-gray-400">
                      Select an image
                    </span>
                    <input
                      type="file"
                      id="imageUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>

                  {imagePreview && (
                    <div className="relative w-24 h-24">
                      {" "}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        crossOrigin="anonymous"
                        className="h-24 w-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 text-white"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, images: [] }));
                        }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Upload a clear image of your item to help others identify it.
                </p>
              </div>
              {/* Contact Phone (Optional) */}
              <div className="mb-6">
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium mb-2"
                >
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Phone number for notifications"
                  className="w-full bg-gray-900 border-gray-700 rounded-md p-3 text-white placeholder-gray-500"
                />
                <p className="text-gray-400 text-sm mt-2">
                  We'll use this to notify you faster if your item is found.
                </p>
              </div>
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-black py-2 px-6 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportMissing;
