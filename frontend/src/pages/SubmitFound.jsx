import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPinIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useItems } from "../context/ItemsContext";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

/**
 * Submit Found Item page component
 * Allows users to submit details about items they found on campus
 */
const SubmitFound = () => {
  const { addFoundItem } = useItems();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    location: "",
    description: "",
    turnInMethod: "office", // Default to office drop-off
    images: [],
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  // Validate and set image
  const validateAndSetImage = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        image: "File size must be less than 5MB",
      }));
      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setFormErrors((prev) => ({
        ...prev,
        image: "Only PNG, JPG formats are supported",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [file],
    }));

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setFormErrors((prev) => ({ ...prev, image: null }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  // Clear image
  const handleClearImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [],
    }));
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
  };

  // Validate the form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Item name is required";
    }
    if (!formData.category) {
      errors.category = "Category is required";
    }
    if (!formData.date) {
      errors.date = "Date is required";
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!formData.turnInMethod) {
      errors.turnInMethod =
        "Please select how you would like to turn in the item";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      const itemId = await addFoundItem(formattedData);
      navigate(`/item-details/${itemId}`);
    } catch (err) {
      console.error("Failed to submit found item:", err);
      setFormErrors((prev) => ({
        ...prev,
        submit:
          err.message || "Failed to submit your report. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation items for sidebar
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Lost Items", href: "/lost-items", icon: MagnifyingGlassIcon },
    { name: "Report Missing", href: "/report-missing", icon: BellIcon },
    {
      name: "Submit Found",
      href: "/submit-found",
      icon: MapPinIcon,
      active: true,
    },
    { name: "My Items", href: "/my-items", icon: UserIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              Submit Found Item
            </h2>
            <p className="text-gray-500 mt-1">
              Thank you for helping return lost items to their owners. Please
              provide details about the item you found.
            </p>
          </div>

          <div className="bg-black text-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Found Item Details</h3>
              <p className="text-gray-400 mb-6">
                Please provide all relevant information about the item you
                found.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Item Name */}
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
                      placeholder="e.g. Silver Watch"
                      className={`w-full bg-gray-900 border ${
                        formErrors.name ? "border-red-500" : "border-gray-700"
                      } rounded-md p-3 text-white placeholder-gray-500`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.name}
                      </p>
                    )}
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
                        className={`w-full bg-gray-900 border ${
                          formErrors.category
                            ? "border-red-500"
                            : "border-gray-700"
                        } rounded-md p-3 text-white appearance-none`}
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
                      {formErrors.category && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Date Found */}
                  <div>
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
                      className={`w-full bg-gray-900 border ${
                        formErrors.date ? "border-red-500" : "border-gray-700"
                      } rounded-md p-3 text-white`}
                    />
                    {formErrors.date && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.date}
                      </p>
                    )}
                  </div>

                  {/* Location Found */}
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
                      className={`w-full bg-gray-900 border ${
                        formErrors.location
                          ? "border-red-500"
                          : "border-gray-700"
                      } rounded-md p-3 text-white placeholder-gray-500`}
                    />
                    {formErrors.location && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
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
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description (color, brand, distinctive features, visible content, etc.)"
                    className={`w-full bg-gray-900 border ${
                      formErrors.description
                        ? "border-red-500"
                        : "border-gray-700"
                    } rounded-md p-3 text-white placeholder-gray-500`}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Upload Image (Optional)
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed ${
                      formErrors.image
                        ? "border-red-500"
                        : isDragging
                        ? "border-white bg-white/10"
                        : "border-gray-700 hover:border-white hover:bg-white/5"
                    } rounded-md transition-all duration-200 group cursor-pointer h-[200px] flex items-center justify-center`}
                  >
                    <div
                      className={`p-6 w-full ${previewImage ? "h-full" : ""}`}
                    >
                      {previewImage ? (
                        <div className="relative h-full flex items-center justify-center">
                          <img
                            src={previewImage}
                            alt="Item preview"
                            className="max-h-full w-auto max-w-full object-contain rounded"
                          />
                          <button
                            type="button"
                            onClick={handleClearImage}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-1.5 text-white transition-colors"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center relative">
                          <ArrowUpTrayIcon className="h-12 w-12 text-gray-500 mx-auto mb-3 group-hover:text-white transition-colors" />
                          <p className="text-gray-400 group-hover:text-white transition-colors">
                            <span className="font-medium">Click to upload</span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-gray-500 text-sm mt-2 group-hover:text-gray-300 transition-colors">
                            PNG, JPG up to 5MB
                          </p>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label="Upload image"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {formErrors.image && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.image}
                    </p>
                  )}
                </div>

                {/* Turn-in Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    How would you like to turn in this item?
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="office"
                        type="radio"
                        name="turnInMethod"
                        value="office"
                        checked={formData.turnInMethod === "office"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="office"
                        className="ml-2 block text-sm text-gray-300"
                      >
                        I will drop it off at the campus lost and found office
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="keep"
                        type="radio"
                        name="turnInMethod"
                        value="keep"
                        checked={formData.turnInMethod === "keep"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="keep"
                        className="ml-2 block text-sm text-gray-300"
                      >
                        I'm holding onto it until the owner is found
                      </label>
                    </div>
                  </div>
                  {formErrors.turnInMethod && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.turnInMethod}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Found Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitFound;
