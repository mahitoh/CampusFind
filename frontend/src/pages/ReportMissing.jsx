import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPinIcon,
  BellIcon,
  UserIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useItems } from "../context/ItemsContext";

const ReportMissing = () => {
  const { addLostItem } = useItems();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    location: "",
    description: "",
    contactPhone: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle drag events for image upload
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

    setImagePreview(URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [file],
    }));
    setFormErrors((prev) => ({ ...prev, image: null }));
  };
  const handleImageChange = (e) => {
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
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const formattedData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      await addLostItem(formattedData);

      // Navigate to dashboard with a success state
      navigate("/dashboard", {
        state: {
          message:
            "Report submitted successfully! We'll notify you if we find a match.",
          type: "success",
        },
      });
    } catch (err) {
      console.error("Error submitting report:", err);
      setFormErrors((prev) => ({
        ...prev,
        submit:
          err.message || "Failed to submit your report. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Lost Items", href: "/lost-items", icon: MagnifyingGlassIcon },
    { name: "Report Missing", href: "/report-missing", icon: BellIcon },
    { name: "Submit Found", href: "/submit-found", icon: MapPinIcon },
    { name: "My Items", href: "/my-items", icon: UserIcon },
  ];
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed">
        <div className="flex items-center p-4 border-b">
          <Link to="/">
            <span className="text-lg font-semibold">Dashboard</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1 flex-grow">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/report-missing";
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-3 rounded-md ${
                  isActive
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
            <span className="text-sm font-medium">Log Out</span>
          </Link>
        </div>
      </div>{" "}
      {/* Main Content */}
      <div className="flex-1 overflow-auto ml-64">
        {/* Form Content */}
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            {" "}
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-gray-900">
                Report Missing Item
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Fill out this form with as much detail as possible to help us
                find your lost item.
              </p>
            </div>
            {formErrors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{formErrors.submit}</p>
                  </div>
                </div>
              </div>
            )}{" "}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
                <h2 className="text-lg font-semibold">Missing Item Details</h2>
                <p className="text-red-100 text-xs mt-1">
                  Please provide all relevant information about your lost item.
                </p>
              </div>{" "}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                  {/* Item Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Blue Backpack"
                      className={`w-full border-2 ${
                        formErrors.name
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-red-500"
                      } rounded-lg px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all`}
                    />
                    {formErrors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full border-2 ${
                          formErrors.category
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-red-500"
                        } rounded-lg px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all appearance-none bg-white`}
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
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
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
                    {formErrors.category && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formErrors.category}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                  {/* Date Lost */}
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Date Lost <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full border-2 ${
                        formErrors.date
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-red-500"
                      } rounded-lg px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all`}
                    />
                    {formErrors.date && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formErrors.date}
                      </p>
                    )}
                  </div>

                  {/* Location Lost */}
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Location Last Seen <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Library, Room 204"
                      className={`w-full border-2 ${
                        formErrors.location
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-red-500"
                      } rounded-lg px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all`}
                    />
                    {formErrors.location && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formErrors.location}
                      </p>
                    )}
                  </div>
                </div>{" "}
                {/* Description */}
                <div className="mb-5">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Item Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description (color, brand, distinctive features, etc.)"
                    className={`w-full border-2 ${
                      formErrors.description
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-red-500"
                    } rounded-lg px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all resize-none`}
                  />
                  {formErrors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formErrors.description}
                    </p>
                  )}
                </div>{" "}
                {/* Image Upload */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Image (Optional)
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed ${
                      formErrors.image
                        ? "border-red-300 bg-red-50"
                        : isDragging
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 hover:border-red-400 hover:bg-red-50"
                    } rounded-lg transition-all duration-200 group cursor-pointer`}
                  >
                    <div className="p-6">
                      {imagePreview ? (
                        <div className="relative">                          <img
                            src={imagePreview}
                            alt="Item preview"
                            className="max-h-32 w-auto mx-auto object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleClearImage}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-2 text-white transition-colors shadow-lg"
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
                          <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 group-hover:text-red-500 transition-colors" />
                          <p className="text-gray-600 group-hover:text-red-600 transition-colors">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-gray-500 text-sm mt-2 group-hover:text-gray-600 transition-colors">
                            PNG, JPG up to 5MB
                          </p>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label="Upload image"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {formErrors.image && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formErrors.image}
                    </p>
                  )}
                </div>{" "}                {/* Contact Phone */}
                <div className="mb-6">
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="e.g. +1 234 567 8900"
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
                  />
                </div>
                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all transform hover:scale-[1.02] ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed scale-100"
                        : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportMissing;
