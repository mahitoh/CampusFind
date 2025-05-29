import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useItems } from "../context/ItemsContext";

/**
 * Submit Found Item page component
 * Allows users to submit details about items they found on campus
 */
const SubmitFound = () => {
  const { addFoundItem } = useItems();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Display error message if present
  React.useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    date: "",
    location: "",
    description: "",
    turnInMethod: "office", // Default to office drop-off
    images: [],
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Categories for found items
  const categories = [
    "Electronics",
    "Clothing",
    "Accessories",
    "Books/Notes",
    "Keys",
    "ID/Cards",
    "Other",
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        images: [file],
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Log for debugging
      console.log("Image preview created:", previewUrl);
    }
  };

  // Clear image
  const handleClearImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [],
    }));
    setPreviewImage(null);
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Submitting found item:", formData);

      // Call the API through the context
      const itemId = await addFoundItem(formData);

      alert(
        "Thank you for submitting a found item! The information has been recorded."
      );

      // Navigate to the item details page
      navigate(`/item-details/${itemId}`);
    } catch (err) {
      console.error("Failed to submit found item:", err);
      setError("Failed to submit your report. Please try again.");
      alert("There was a problem submitting your report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }

    // Reset form after submission
    setFormData({
      name: "",
      category: "",
      date: "",
      location: "",
      description: "",
      turnInMethod: "office",
      images: [],
    });
    setPreviewImage(null);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center p-4">
          <span className="text-lg font-medium">Dashboard</span>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center p-3 text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/lost-items"
            className="flex items-center p-3 text-gray-600 hover:text-gray-800"
          >
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Lost Items</span>
          </Link>

          <Link
            to="/report-missing"
            className="flex items-center p-3 text-gray-600 hover:text-gray-800"
          >
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span>Report Missing</span>
          </Link>

          <Link
            to="/submit-found"
            className="flex items-center p-3 text-blue-600"
          >
            <MapPinIcon className="h-5 w-5 mr-3" />
            <span>Submit Found</span>
          </Link>

          <Link
            to="/my-items"
            className="flex items-center p-3 text-gray-600 hover:text-gray-800"
          >
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>My Items</span>
          </Link>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
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

        {/* Main Form Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {/* Introduction Text */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Found Item Details
              </h2>
              <p className="text-gray-600 mt-2">
                Thank you for helping return lost items to their owners. Please
                provide all relevant information about the item you found.
              </p>
            </div>

            {/* Found Item Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-black text-white rounded-lg p-8"
            >
              <h3 className="text-xl font-semibold mb-6">Found Item Details</h3>
              <p className="text-gray-400 mb-8">
                Please provide all relevant information about the item you
                found.
              </p>

              <div className="space-y-6">
                {/* Item Name */}
                <div>
                  {" "}
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
                    placeholder="e.g. Silver Watch"
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
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
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

                {/* Date and Location (Two Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {" "}
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium mb-2"
                    >
                      Date Found
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
                  </div>{" "}
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium mb-2"
                    >
                      Location Found
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Cafeteria, Table 12"
                      className="w-full bg-gray-900 border-gray-700 rounded-md p-3 text-white placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                {/* Item Description */}
                <div>
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
                    placeholder="Provide a detailed description (color, brand, distinctive features, visible content, etc.)"
                    rows={5}
                    className="w-full bg-gray-900 border-gray-700 rounded-md p-3 text-white placeholder-gray-500"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Please include enough detail to help identify the true
                    owner, but avoid including sensitive information.
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium mb-2"
                  >
                    Upload Image (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
                    {previewImage ? (
                      <div className="space-y-2 text-center">
                        {" "}
                        <img
                          src={previewImage}
                          alt="Preview"
                          crossOrigin="anonymous"
                          className="mx-auto h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="px-3 py-1 text-sm text-red-500 hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-400">
                          <label
                            htmlFor="imageUpload"
                            className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400"
                          >
                            <span>Click to upload</span>
                            <input
                              id="imageUpload"
                              name="imageUpload"
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={handleImageUpload}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-400">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Turn-In Method */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    How would you like to turn in this item?
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="office"
                        name="turnInMethod"
                        type="radio"
                        value="office"
                        checked={formData.turnInMethod === "office"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                      />
                      <label htmlFor="office" className="ml-3 block text-sm">
                        I will drop it off at the campus lost and found office
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="keepUntilClaimed"
                        name="turnInMethod"
                        type="radio"
                        value="keepUntilClaimed"
                        checked={formData.turnInMethod === "keepUntilClaimed"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                      />
                      <label
                        htmlFor="keepUntilClaimed"
                        className="ml-3 block text-sm"
                      >
                        I will keep it until the owner contacts me
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="alreadySubmitted"
                        name="turnInMethod"
                        type="radio"
                        value="alreadySubmitted"
                        checked={formData.turnInMethod === "alreadySubmitted"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                      />
                      <label
                        htmlFor="alreadySubmitted"
                        className="ml-3 block text-sm"
                      >
                        I already submitted it to lost and found
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 text-right">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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

export default SubmitFound;
