import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BellIcon,
  MapPinIcon,
  UserIcon,
  CameraIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContextNew";
import { useItems } from "../context/ItemsContext";

const Profile = () => {
  const { user } = useAuth();
  const { items } = useItems();
  // Calculate user-specific statistics
  const userItems = items?.filter((item) => item.userId === user?.id) || [];
  const reportedItems =
    userItems.filter((item) => item.status === "Missing").length || 0;
  const foundItems =
    userItems.filter((item) => item.status === "Found").length || 0;
  // Initialize profile data from current user or defaults
  const [profileData, setProfileData] = useState({
    name: user?.username || user?.name || "John Williams",
    email: user?.email || "john.williams@university.edu",
    major: user?.major || "Computer Science",
    year: user?.year || "3rd Year",
    studentId: user?.studentId || "CS2024001",
    bio:
      user?.bio ||
      "Passionate about software development and artificial intelligence. Love helping fellow students with their tech problems.",
    phone: user?.phone || "+1 234 567 8900",
    address: user?.address || "123 University Ave, Campus Town",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(profileData);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Update profile data when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.username || user.name || "John Williams",
        email: user.email || "john.williams@university.edu",
        major: user.major || "Computer Science",
        year: user.year || "3rd Year",
        studentId: user.studentId || "CS2024001",
        bio:
          user.bio ||
          "Passionate about software development and artificial intelligence. Love helping fellow students with their tech problems.",
        phone: user.phone || "+1 234 567 8900",
        address: user.address || "123 University Ave, Campus Town",
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };
  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
    // TODO: Here you would typically make an API call to update the user profile
    // await updateUserProfile(editedData);
    console.log("Profile updated:", editedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
    setPreviewImage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      alert("File size must be less than 5MB");
      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      alert("Only PNG, JPG formats are supported");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  // Navigation items for sidebar
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Lost Items", href: "/lost-items", icon: MagnifyingGlassIcon },
    { name: "Report Missing", href: "/report-missing", icon: BellIcon },
    { name: "Submit Found", href: "/submit-found", icon: MapPinIcon },
    { name: "My Items", href: "/my-items", icon: UserIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed">
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
                className="flex items-center p-3 rounded-md text-gray-600 hover:text-gray-800"
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>{" "}
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto ml-64">
        <div className="max-w-2xl mx-auto p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Profile Settings
            </h2>
            <p className="text-gray-500 mt-1">
              Manage your personal information and account settings.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {" "}
            {/* Profile Header */}
            <div className="bg-black text-white p-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {(user?.username || user?.name || profileData.name)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`absolute inset-0 rounded-full border-2 border-dashed ${
                        isDragging
                          ? "border-white bg-white/10"
                          : "border-gray-400 hover:border-white hover:bg-white/5"
                      } transition-all duration-200 group cursor-pointer flex items-center justify-center`}
                    >
                      <div className="text-center">
                        <CameraIcon className="h-6 w-6 text-white mx-auto mb-1 group-hover:text-white transition-colors" />
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          aria-label="Upload profile image"
                        />
                      </div>
                    </div>
                  )}
                </div>{" "}
                <div>
                  <h3 className="text-lg font-semibold">{profileData.name}</h3>
                  <p className="text-gray-300 text-sm">{profileData.email}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {profileData.major} • {profileData.year}
                  </p>
                </div>
              </div>
            </div>{" "}
            {/* Profile Content */}
            <div className="p-4">
              {isEditing ? (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Full Name */}
                    <div>
                      {" "}
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={editedData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={editedData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Major */}
                    <div>
                      <label
                        htmlFor="major"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Major
                      </label>
                      <input
                        type="text"
                        name="major"
                        id="major"
                        value={editedData.major}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Year */}
                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Academic Year
                      </label>
                      <select
                        name="year"
                        id="year"
                        value={editedData.year}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduate">Graduate</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={editedData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Student ID */}
                    <div>
                      <label
                        htmlFor="studentId"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Student ID
                      </label>
                      <input
                        type="text"
                        name="studentId"
                        id="studentId"
                        value={editedData.studentId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-3 bg-gray-50"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Student ID cannot be changed
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={editedData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={editedData.bio}
                      onChange={handleChange}
                      placeholder="Tell us a bit about yourself..."
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Full Name
                      </h4>
                      <p className="text-gray-900">{profileData.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Email
                      </h4>
                      <p className="text-gray-900">{profileData.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Major
                      </h4>
                      <p className="text-gray-900">{profileData.major}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Academic Year
                      </h4>
                      <p className="text-gray-900">{profileData.year}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Student ID
                      </h4>
                      <p className="text-gray-900">{profileData.studentId}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Phone Number
                      </h4>
                      <p className="text-gray-900">{profileData.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Address
                    </h4>
                    <p className="text-gray-900">{profileData.address}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Bio
                    </h4>
                    <p className="text-gray-900">{profileData.bio}</p>
                  </div>

                  {/* Edit Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>{" "}
          {/* Account Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              {" "}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BellIcon className="h-6 w-6 text-orange-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Items Reported
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {reportedItems}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                {" "}
                <div className="flex-shrink-0">
                  <MapPinIcon className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Items Found
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {foundItems}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Profile Views
                  </p>
                  <p className="text-xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
