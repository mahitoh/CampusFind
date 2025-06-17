import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  UserIcon,
  BellIcon,
  CogIcon,
  ShieldCheckIcon,
  HeartIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Profile from "../components/Profile";
import { settingsAPI } from "../services/api";

const ProfilePage = () => {
  // Settings state with localStorage persistence
  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: "en",
    fontSize: "medium",
    autoSave: true,
    compactMode: false,
    showTutorials: true,
  });
  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showProfile: true,
    twoFactorAuth: false,
    allowSearchIndexing: true,
    showOnlineStatus: true,
    allowFriendRequests: true,
    dataSharing: false,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    itemUpdates: true,
    newMessages: true,
    systemAlerts: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ message: '', type: '' });

  // Load settings from backend on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getSettings();
      
      if (response.success) {
        const { preferences: backendPrefs, privacy: backendPrivacy, notifications: backendNotifs } = response.data;
        
        setPreferences(prev => ({ ...prev, ...backendPrefs }));
        setPrivacy(prev => ({ ...prev, ...backendPrivacy }));
        setNotifications(prev => ({ ...prev, ...backendNotifs }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Failed to load settings. Using local defaults.');
      
      // Fallback to localStorage if backend fails
      const savedPreferences = localStorage.getItem('userPreferences');
      const savedPrivacy = localStorage.getItem('userPrivacy');
      const savedNotifications = localStorage.getItem('userNotifications');

      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
      if (savedPrivacy) {
        setPrivacy(JSON.parse(savedPrivacy));
      }
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } finally {
      setLoading(false);
    }
  };

  // Save settings to backend and localStorage
  const saveSettings = async (type, data) => {
    try {
      setSaveStatus({ message: 'Saving...', type: 'info' });
      
      let response;
      switch (type) {
        case 'preferences':
          response = await settingsAPI.updatePreferences(data);
          break;
        case 'privacy':
          response = await settingsAPI.updatePrivacy(data);
          break;
        case 'notifications':
          response = await settingsAPI.updateNotifications(data);
          break;
        default:
          response = await settingsAPI.updateSettings(data);
      }

      if (response.success) {
        setSaveStatus({ message: 'Settings saved successfully!', type: 'success' });
        
        // Also save to localStorage as backup
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        localStorage.setItem('userPrivacy', JSON.stringify(privacy));
        localStorage.setItem('userNotifications', JSON.stringify(notifications));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus({ message: '', type: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({ message: 'Failed to save settings. Please try again.', type: 'error' });
      
      // Save to localStorage as fallback
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      localStorage.setItem('userPrivacy', JSON.stringify(privacy));
      localStorage.setItem('userNotifications', JSON.stringify(notifications));
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSaveStatus({ message: '', type: '' });
      }, 5000);
    }
  };

  // Handlers
  const handlePrefChange = async (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setPreferences((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      };
      
      // Save to backend
      saveSettings('preferences', updated);
      
      return updated;
    });
  };
  
  const handlePrivacyChange = async (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setPrivacy((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      };
      
      // Save to backend
      saveSettings('privacy', updated);
      
      return updated;
    });
  };
  
  const handleNotifChange = async (e) => {
    const { name, checked } = e.target;
    
    setNotifications((prev) => {
      const updated = {
        ...prev,
        [name]: checked,
      };
      
      // Save to backend
      saveSettings('notifications', updated);
      
      return updated;
    });
  };

  // Reset settings to defaults
  const resetSettings = async (type) => {
    let defaultSettings;
    
    if (type === 'preferences') {
      defaultSettings = {
        darkMode: false,
        language: "en",
        fontSize: "medium",
        autoSave: true,
        compactMode: false,
        showTutorials: true,
      };
      setPreferences(defaultSettings);
      await saveSettings('preferences', defaultSettings);
    } else if (type === 'privacy') {
      defaultSettings = {
        showEmail: false,
        showProfile: true,
        twoFactorAuth: false,
        allowSearchIndexing: true,
        showOnlineStatus: true,
        allowFriendRequests: true,
        dataSharing: false,
      };
      setPrivacy(defaultSettings);
      await saveSettings('privacy', defaultSettings);
    } else if (type === 'notifications') {
      defaultSettings = {
        email: true,
        sms: false,
        push: true,
        itemUpdates: true,
        newMessages: true,
        systemAlerts: true,
        marketingEmails: false,
        weeklyDigest: true,
      };
      setNotifications(defaultSettings);
      await saveSettings('notifications', defaultSettings);
    }
  };

  const profileStats = [
    {
      title: "Items Reported",
      value: "12",
      description: "Lost items reported",
      icon: BellIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Items Found",
      value: "8",
      description: "Items you've found",
      icon: HeartIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Success Rate",
      value: "67%",
      description: "Items recovered",
      icon: ShieldCheckIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const quickActions = [
    {
      title: "Report Missing Item",
      description: "Report a lost item",
      href: "/report-missing",
      icon: BellIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Submit Found Item",
      description: "Submit an item you found",
      href: "/submit-found",
      icon: HeartIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "View My Items",
      description: "Check your reported items",
      href: "/my-items",
      icon: UserIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Save Status Message */}
      {saveStatus.message && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4`}>
          <div className={`p-4 rounded-md ${
            saveStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            saveStatus.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {saveStatus.message}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 p-4 rounded-md">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Statistics
              </h2>
              <div className="space-y-4">
                {profileStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div
                        className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-500">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.href}
                      className="flex items-center p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                      <div
                        className={`p-3 rounded-lg ${action.bgColor} ${action.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {action.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Account Settings
              </h2>
              
              {/* Preferences */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center">
                    <CogIcon className="h-5 w-5 mr-2 text-indigo-500" /> Preferences
                  </h3>
                  <button
                    onClick={() => resetSettings('preferences')}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dark Mode</span>
                    <input
                      type="checkbox"
                      name="darkMode"
                      checked={preferences.darkMode}
                      onChange={handlePrefChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Language</span>
                    <select
                      name="language"
                      value={preferences.language}
                      onChange={handlePrefChange}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Font Size</span>
                    <select
                      name="fontSize"
                      value={preferences.fontSize}
                      onChange={handlePrefChange}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto Save</span>
                    <input
                      type="checkbox"
                      name="autoSave"
                      checked={preferences.autoSave}
                      onChange={handlePrefChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compact Mode</span>
                    <input
                      type="checkbox"
                      name="compactMode"
                      checked={preferences.compactMode}
                      onChange={handlePrefChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Tutorials</span>
                    <input
                      type="checkbox"
                      name="showTutorials"
                      checked={preferences.showTutorials}
                      onChange={handlePrefChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy & Security */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-500" /> Privacy & Security
                  </h3>
                  <button
                    onClick={() => resetSettings('privacy')}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Email on Profile</span>
                    <input
                      type="checkbox"
                      name="showEmail"
                      checked={privacy.showEmail}
                      onChange={handlePrivacyChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Public Profile</span>
                    <input
                      type="checkbox"
                      name="showProfile"
                      checked={privacy.showProfile}
                      onChange={handlePrivacyChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <input
                      type="checkbox"
                      name="twoFactorAuth"
                      checked={privacy.twoFactorAuth}
                      onChange={handlePrivacyChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Allow Search Indexing</span>
                    <input
                      type="checkbox"
                      name="allowSearchIndexing"
                      checked={privacy.allowSearchIndexing}
                      onChange={handlePrivacyChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Online Status</span>
                    <input
                      type="checkbox"
                      name="showOnlineStatus"
                      checked={privacy.showOnlineStatus}
                      onChange={handlePrivacyChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Allow Friend Requests</span>
                    <input
                      type="checkbox"
                      name="allowFriendRequests"
                      checked={privacy.allowFriendRequests}
                      onChange={handlePrivacyChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Sharing</span>
                    <input
                      type="checkbox"
                      name="dataSharing"
                      checked={privacy.dataSharing}
                      onChange={handlePrivacyChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center">
                    <BellIcon className="h-5 w-5 mr-2 text-yellow-500" /> Notifications
                  </h3>
                  <button
                    onClick={() => resetSettings('notifications')}
                    className="text-xs text-yellow-600 hover:text-yellow-800"
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      Email Notifications
                    </span>
                    <input
                      type="checkbox"
                      name="email"
                      checked={notifications.email}
                      onChange={handleNotifChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center">
                      <DevicePhoneMobileIcon className="h-4 w-4 mr-1" />
                      SMS Notifications
                    </span>
                    <input
                      type="checkbox"
                      name="sms"
                      checked={notifications.sms}
                      onChange={handleNotifChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center">
                      <BellIcon className="h-4 w-4 mr-1" />
                      Push Notifications
                    </span>
                    <input
                      type="checkbox"
                      name="push"
                      checked={notifications.push}
                      onChange={handleNotifChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Item Updates</span>
                    <input
                      type="checkbox"
                      name="itemUpdates"
                      checked={notifications.itemUpdates}
                      onChange={handleNotifChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New Messages</span>
                    <input
                      type="checkbox"
                      name="newMessages"
                      checked={notifications.newMessages}
                      onChange={handleNotifChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Alerts</span>
                    <input
                      type="checkbox"
                      name="systemAlerts"
                      checked={notifications.systemAlerts}
                      onChange={handleNotifChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Marketing Emails</span>
                    <input
                      type="checkbox"
                      name="marketingEmails"
                      checked={notifications.marketingEmails}
                      onChange={handleNotifChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Digest</span>
                    <input
                      type="checkbox"
                      name="weeklyDigest"
                      checked={notifications.weeklyDigest}
                      onChange={handleNotifChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Profile Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Profile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 