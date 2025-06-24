import React, { useState, useRef, useEffect } from "react";
import { CameraIcon, XMarkIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { profileAPI, settingsAPI } from "../services/api";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    major: "Computer Science",
    year: "3rd Year",
    studentId: "CS2024001",
    bio: "Passionate about software development and artificial intelligence.",
    phone: "+1 234 567 8900",
    address: "123 University Ave, Campus Town",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    // Additional fields
    dateOfBirth: "1995-03-15",
    gender: "Male",
    nationality: "American",
    emergencyContact: "+1 234 567 8901",
    emergencyContactName: "Jane Doe",
    emergencyContactRelation: "Parent",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    website: "johndoe.dev",
    interests: ["AI/ML", "Web Development", "Mobile Apps", "Cybersecurity"],
    skills: ["JavaScript", "Python", "React", "Node.js", "MongoDB"],
  });

  const [settingsData, setSettingsData] = useState({
    preferences: {
      theme: "light",
      language: "English",
      notifications: true,
      emailUpdates: true,
      pushNotifications: true,
      soundAlerts: true,
      autoSave: true,
      compactMode: false,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: true,
      showPhone: false,
      showAddress: false,
      allowSearch: true,
      allowContact: true,
      dataSharing: false,
      analytics: true,
    },
    notifications: {
      newItems: true,
      messages: true,
      claims: true,
      reminders: true,
      updates: true,
      marketing: false,
      weeklyDigest: true,
      emailFrequency: "daily",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(profileData);
  const [editedSettings, setEditedSettings] = useState(settingsData);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showExportImport, setShowExportImport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ message: '', type: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);
  const importFileRef = useRef(null);

  // Load profile and settings data from backend on component mount
  useEffect(() => {
    loadProfileAndSettings();
  }, []);

  const loadProfileAndSettings = async () => {
    try {
      setLoading(true);
      
      // Load profile data
      const profileResponse = await profileAPI.getProfile();
      if (profileResponse.success) {
        const backendProfile = profileResponse.data.profile;
        const mergedProfile = { ...profileData, ...backendProfile };
        setProfileData(mergedProfile);
        setEditedData(mergedProfile);
      }
      
      // Load settings data
      const settingsResponse = await settingsAPI.getSettings();
      if (settingsResponse.success) {
        const backendSettings = settingsResponse.data;
        const mergedSettings = { ...settingsData, ...backendSettings };
        setSettingsData(mergedSettings);
        setEditedSettings(mergedSettings);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Using local data.');
      
      // Fallback to localStorage if backend fails
      const savedProfileData = localStorage.getItem('userProfileData');
      const savedSettingsData = localStorage.getItem('userSettingsData');
      
      if (savedProfileData) {
        const parsedProfileData = JSON.parse(savedProfileData);
        setProfileData(parsedProfileData);
        setEditedData(parsedProfileData);
      }
      
      if (savedSettingsData) {
        const parsedSettingsData = JSON.parse(savedSettingsData);
        setSettingsData(parsedSettingsData);
        setEditedSettings(parsedSettingsData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save profile data to backend and localStorage
  const saveProfile = async (data) => {
    try {
      setSaveStatus({ message: 'Saving profile...', type: 'info' });
      
      const response = await profileAPI.updateProfile(data);
      
      if (response.success) {
        setSaveStatus({ message: 'Profile saved successfully!', type: 'success' });
        localStorage.setItem('userProfileData', JSON.stringify(data));
        
        setTimeout(() => {
          setSaveStatus({ message: '', type: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus({ message: 'Failed to save profile. Using local storage.', type: 'error' });
      localStorage.setItem('userProfileData', JSON.stringify(data));
      
      setTimeout(() => {
        setSaveStatus({ message: '', type: '' });
      }, 5000);
    }
  };

  // Save settings data to backend and localStorage
  const saveSettings = async (data) => {
    try {
      setSaveStatus({ message: 'Saving settings...', type: 'info' });
      
      const response = await settingsAPI.updateSettings(data);
      
      if (response.success) {
        setSaveStatus({ message: 'Settings saved successfully!', type: 'success' });
        localStorage.setItem('userSettingsData', JSON.stringify(data));
        
        setTimeout(() => {
          setSaveStatus({ message: '', type: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({ message: 'Failed to save settings. Using local storage.', type: 'error' });
      localStorage.setItem('userSettingsData', JSON.stringify(data));
      
      setTimeout(() => {
        setSaveStatus({ message: '', type: '' });
      }, 5000);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };

  const handleSave = async () => {
    const newProfileData = {
      ...editedData,
      profileImage: imagePreview || profileData.profileImage, // Preserve uploaded image
    };
    
    setProfileData(newProfileData);
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Save to backend
    await saveProfile(newProfileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
    setSelectedImage(null);
    setImagePreview(null);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item),
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profileImage', selectedImage);

      // Here you would typically upload to your backend
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Update profile data with new image
      const newProfileData = {
        ...profileData,
        profileImage: imagePreview,
      };
      setProfileData(newProfileData);
      setEditedData(newProfileData);
      
      // Clear selected image
      setSelectedImage(null);
      setImagePreview(null);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      console.log("Profile image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Export profile data
  const exportProfileData = () => {
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'profile-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import profile data
  const importProfileData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setProfileData(importedData);
          setEditedData(importedData);
          alert('Profile data imported successfully!');
        } catch (error) {
          alert('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Use imagePreview if available, otherwise use profileData.profileImage
  const currentImage = imagePreview || profileData.profileImage;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        {/* Profile Header */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  className="h-24 w-24 rounded-full object-cover"
                  src={currentImage}
                  alt="Profile"
                />
                <button 
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1.5 text-white hover:bg-indigo-700 transition-colors duration-200"
                  title="Change profile picture"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Personal details and preferences
                </p>
              </div>
            </div>
            
            {/* Export/Import buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowExportImport(!showExportImport)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {showExportImport ? 'Hide' : 'Show'} Data Tools
              </button>
            </div>
          </div>

          {/* Save Status Message */}
          {saveStatus.message && (
            <div className={`mt-4 p-4 rounded-md ${
              saveStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
              saveStatus.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {saveStatus.message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-yellow-50 text-yellow-800 border border-yellow-200 p-4 rounded-md">
              {error}
            </div>
          )}

          {/* Export/Import section */}
          {showExportImport && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <button
                  onClick={exportProfileData}
                  className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Export Data
                </button>
                <button
                  onClick={() => importFileRef.current?.click()}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  <ArrowUpTrayIcon className="h-4 w-4 mr-1" />
                  Import Data
                </button>
                <input
                  ref={importFileRef}
                  type="file"
                  accept=".json"
                  onChange={importProfileData}
                  className="hidden"
                />
                <span className="text-sm text-gray-500">
                  Import/Export your profile data
                </span>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'privacy'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Privacy & Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Notifications
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'profile' && (
            <>
              {isEditing ? (
                <form className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={editedData.name}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={editedData.email}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          id="dateOfBirth"
                          value={editedData.dateOfBirth}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                          Gender
                        </label>
                        <select
                          name="gender"
                          id="gender"
                          value={editedData.gender}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                          Nationality
                        </label>
                        <input
                          type="text"
                          name="nationality"
                          id="nationality"
                          value={editedData.nationality}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h4>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                          Major
                        </label>
                        <input
                          type="text"
                          name="major"
                          id="major"
                          value={editedData.major}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                          Year
                        </label>
                        <select
                          name="year"
                          id="year"
                          value={editedData.year}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Graduate">Graduate</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                          Student ID
                        </label>
                        <input
                          type="text"
                          name="studentId"
                          id="studentId"
                          value={editedData.studentId}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={editedData.phone}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={editedData.address}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                      <div>
                        <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContactName"
                          id="emergencyContactName"
                          value={editedData.emergencyContactName}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="emergencyContact"
                          id="emergencyContact"
                          value={editedData.emergencyContact}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="emergencyContactRelation" className="block text-sm font-medium text-gray-700">
                          Relationship
                        </label>
                        <input
                          type="text"
                          name="emergencyContactRelation"
                          id="emergencyContactRelation"
                          value={editedData.emergencyContactRelation}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Social Links</h4>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                      <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                          LinkedIn
                        </label>
                        <input
                          type="text"
                          name="linkedin"
                          id="linkedin"
                          value={editedData.linkedin}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                          GitHub
                        </label>
                        <input
                          type="text"
                          name="github"
                          id="github"
                          value={editedData.github}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                          Website
                        </label>
                        <input
                          type="text"
                          name="website"
                          id="website"
                          value={editedData.website}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interests and Skills */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Interests & Skills</h4>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
                          Interests (comma-separated)
                        </label>
                        <input
                          type="text"
                          name="interests"
                          id="interests"
                          value={editedData.interests.join(', ')}
                          onChange={(e) => handleArrayChange('interests', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                          Skills (comma-separated)
                        </label>
                        <input
                          type="text"
                          name="skills"
                          id="skills"
                          value={editedData.skills.join(', ')}
                          onChange={(e) => handleArrayChange('skills', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={editedData.bio}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Full Name</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.name}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Email</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.email}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Date of Birth</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.dateOfBirth}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Gender</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.gender}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Nationality</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.nationality}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h4>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Major</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.major}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Year</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.year}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Student ID</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.studentId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Phone</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.phone}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Address</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Contact Name</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.emergencyContactName}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Contact Phone</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.emergencyContact}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Relationship</h5>
                        <p className="mt-1 text-sm text-gray-900">{profileData.emergencyContactRelation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Social Links</h4>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">LinkedIn</h5>
                        <p className="mt-1 text-sm text-gray-900">
                          {profileData.linkedin ? (
                            <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                              {profileData.linkedin}
                            </a>
                          ) : 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">GitHub</h5>
                        <p className="mt-1 text-sm text-gray-900">
                          {profileData.github ? (
                            <a href={`https://${profileData.github}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                              {profileData.github}
                            </a>
                          ) : 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Website</h5>
                        <p className="mt-1 text-sm text-gray-900">
                          {profileData.website ? (
                            <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                              {profileData.website}
                            </a>
                          ) : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Interests and Skills */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Interests & Skills</h4>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Interests</h5>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {profileData.interests.map((interest, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Skills</h5>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {profileData.skills.map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Bio</h4>
                    <p className="text-sm text-gray-900">{profileData.bio}</p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Settings Tabs */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                    Theme
                  </label>
                  <select
                    id="theme"
                    value={editedSettings.preferences.theme}
                    onChange={(e) => setEditedSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, theme: e.target.value }
                    }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <select
                    id="language"
                    value={editedSettings.preferences.language}
                    onChange={(e) => setEditedSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, language: e.target.value }
                    }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications about updates</p>
                  </div>
                  <button
                    onClick={() => setEditedSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, notifications: !prev.preferences.notifications }
                    }))}
                    className={`${
                      editedSettings.preferences.notifications ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        editedSettings.preferences.notifications ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Updates</h4>
                    <p className="text-sm text-gray-500">Receive email notifications</p>
                  </div>
                  <button
                    onClick={() => setEditedSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, emailUpdates: !prev.preferences.emailUpdates }
                    }))}
                    className={`${
                      editedSettings.preferences.emailUpdates ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        editedSettings.preferences.emailUpdates ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Auto Save</h4>
                    <p className="text-sm text-gray-500">Automatically save changes</p>
                  </div>
                  <button
                    onClick={() => setEditedSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, autoSave: !prev.preferences.autoSave }
                    }))}
                    className={`${
                      editedSettings.preferences.autoSave ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        editedSettings.preferences.autoSave ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => saveSettings(editedSettings)}
                  className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Privacy & Security</h3>
              
              <div>
                <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700">
                  Profile Visibility
                </label>
                <select
                  id="profileVisibility"
                  value={editedSettings.privacy.profileVisibility}
                  onChange={(e) => setEditedSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, profileVisibility: e.target.value }
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Show Email</h4>
                    <p className="text-sm text-gray-500">Allow others to see your email</p>
                  </div>
                  <button
                    onClick={() => setEditedSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showEmail: !prev.privacy.showEmail }
                    }))}
                    className={`${
                      editedSettings.privacy.showEmail ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        editedSettings.privacy.showEmail ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Show Phone</h4>
                    <p className="text-sm text-gray-500">Allow others to see your phone number</p>
                  </div>
                  <button
                    onClick={() => setEditedSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showPhone: !prev.privacy.showPhone }
                    }))}
                    className={`${
                      editedSettings.privacy.showPhone ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        editedSettings.privacy.showPhone ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Allow Search</h4>
                    <p className="text-sm text-gray-500">Allow others to find your profile</p>
                  </div>
                  <button
                    onClick={() => setEditedSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, allowSearch: !prev.privacy.allowSearch }
                    }))}
                    className={`${
                      editedSettings.privacy.allowSearch ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        editedSettings.privacy.allowSearch ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Data Sharing</h4>
                    <p className="text-sm text-gray-500">Allow data to be shared with third parties</p>
                  </div>
                  <button
                    onClick={() => setEditedSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, dataSharing: !prev.privacy.dataSharing }
                    }))}
                    className={`${
                      editedSettings.privacy.dataSharing ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        editedSettings.privacy.dataSharing ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => saveSettings(editedSettings)}
                  className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Privacy Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">New Items</h4>
                    <p className="text-sm text-gray-500">Notify when new items are posted</p>
                  </div>
                  <button
                    onClick={() => setEditedSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, newItems: !prev.notifications.newItems }
                    }))}
                    className={`${
                      editedSettings.notifications.newItems ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        editedSettings.notifications.newItems ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Messages</h4>
                    <p className="text-sm text-gray-500">Notify when you receive messages</p>
                  </div>
                  <button
                    onClick={() => setEditedSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, messages: !prev.notifications.messages }
                    }))}
                    className={`${
                      editedSettings.notifications.messages ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        editedSettings.notifications.messages ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Claims</h4>
                    <p className="text-sm text-gray-500">Notify when someone claims your item</p>
                  </div>
                  <button
                    onClick={() => setEditedSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, claims: !prev.notifications.claims }
                    }))}
                    className={`${
                      editedSettings.notifications.claims ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        editedSettings.notifications.claims ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Weekly Digest</h4>
                    <p className="text-sm text-gray-500">Receive weekly summary emails</p>
                  </div>
                  <button
                    onClick={() => setEditedSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, weeklyDigest: !prev.notifications.weeklyDigest }
                    }))}
                    className={`${
                      editedSettings.notifications.weeklyDigest ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        editedSettings.notifications.weeklyDigest ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="emailFrequency" className="block text-sm font-medium text-gray-700">
                  Email Frequency
                </label>
                <select
                  id="emailFrequency"
                  value={editedSettings.notifications.emailFrequency}
                  onChange={(e) => setEditedSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, emailFrequency: e.target.value }
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="immediate">Immediate</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="never">Never</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => saveSettings(editedSettings)}
                  className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Notification Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
