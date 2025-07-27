import React, { useState } from "react";
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "CampusFind",
    siteDescription: "Lost and Found System for Campus",
    contactEmail: "admin@campusfind.com",
    timezone: "America/New_York",

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    notifyOnNewItem: true,
    notifyOnItemClaimed: true,
    notifyOnSystemUpdates: false,

    // Security Settings
    requireEmailVerification: true,
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,

    // Item Management
    autoDeleteDays: 90,
    requireApproval: true,
    maxImagesPerItem: 5,
    allowAnonymousReports: false,

    // System Maintenance
    maintenanceMode: false,
    backupFrequency: "daily",
    logRetentionDays: 30,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const settingSections = [
    {
      id: "general",
      name: "General",
      icon: Cog6ToothIcon,
      description: "Basic site settings and configuration",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: BellIcon,
      description: "Email and push notification preferences",
    },
    {
      id: "security",
      name: "Security",
      icon: ShieldCheckIcon,
      description: "User authentication and security settings",
    },
    {
      id: "items",
      name: "Item Management",
      icon: CircleStackIcon,
      description: "Lost and found item policies",
    },
    {
      id: "users",
      name: "User Management",
      icon: UserGroupIcon,
      description: "User registration and account settings",
    },
    {
      id: "system",
      name: "System",
      icon: GlobeAltIcon,
      description: "System maintenance and backup settings",
    },
  ];

  const handleInputChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setSaveMessage("Error saving settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Name
        </label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => handleInputChange("siteName", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => handleInputChange("siteDescription", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Email
        </label>
        <input
          type="email"
          value={settings.contactEmail}
          onChange={(e) => handleInputChange("contactEmail", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={settings.timezone}
          onChange={(e) => handleInputChange("timezone", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
        </select>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">
              Email Notifications
            </h4>
            <p className="text-sm text-gray-500">
              Send notifications via email
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) =>
              handleInputChange("emailNotifications", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">
              Push Notifications
            </h4>
            <p className="text-sm text-gray-500">
              Send browser push notifications
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.pushNotifications}
            onChange={(e) =>
              handleInputChange("pushNotifications", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">
              New Item Reports
            </h4>
            <p className="text-sm text-gray-500">
              Notify when new items are reported
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifyOnNewItem}
            onChange={(e) =>
              handleInputChange("notifyOnNewItem", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Item Claims</h4>
            <p className="text-sm text-gray-500">
              Notify when items are claimed
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifyOnItemClaimed}
            onChange={(e) =>
              handleInputChange("notifyOnItemClaimed", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">
              System Updates
            </h4>
            <p className="text-sm text-gray-500">
              Notify about system maintenance and updates
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifyOnSystemUpdates}
            onChange={(e) =>
              handleInputChange("notifyOnSystemUpdates", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">
              Email Verification
            </h4>
            <p className="text-sm text-gray-500">
              Require email verification for new accounts
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.requireEmailVerification}
            onChange={(e) =>
              handleInputChange("requireEmailVerification", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Password Length
          </label>
          <input
            type="number"
            min="6"
            max="20"
            value={settings.passwordMinLength}
            onChange={(e) =>
              handleInputChange("passwordMinLength", parseInt(e.target.value))
            }
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            min="15"
            max="120"
            value={settings.sessionTimeout}
            onChange={(e) =>
              handleInputChange("sessionTimeout", parseInt(e.target.value))
            }
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            min="3"
            max="10"
            value={settings.maxLoginAttempts}
            onChange={(e) =>
              handleInputChange("maxLoginAttempts", parseInt(e.target.value))
            }
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderItemSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Auto-delete Items After (days)
        </label>
        <input
          type="number"
          min="30"
          max="365"
          value={settings.autoDeleteDays}
          onChange={(e) =>
            handleInputChange("autoDeleteDays", parseInt(e.target.value))
          }
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Items will be automatically deleted after this period
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-700">
            Require Approval
          </h4>
          <p className="text-sm text-gray-500">
            All new items must be approved by admin
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.requireApproval}
          onChange={(e) =>
            handleInputChange("requireApproval", e.target.checked)
          }
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Images Per Item
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={settings.maxImagesPerItem}
          onChange={(e) =>
            handleInputChange("maxImagesPerItem", parseInt(e.target.value))
          }
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-700">
            Anonymous Reports
          </h4>
          <p className="text-sm text-gray-500">
            Allow users to report items without logging in
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.allowAnonymousReports}
          onChange={(e) =>
            handleInputChange("allowAnonymousReports", e.target.checked)
          }
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">
              Maintenance Mode
            </h4>
            <p className="text-sm text-yellow-700">
              Block user access for maintenance
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={settings.maintenanceMode}
          onChange={(e) =>
            handleInputChange("maintenanceMode", e.target.checked)
          }
          className="h-4 w-4 text-yellow-600 rounded border-gray-300 focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Backup Frequency
        </label>
        <select
          value={settings.backupFrequency}
          onChange={(e) => handleInputChange("backupFrequency", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Log Retention (days)
        </label>
        <input
          type="number"
          min="7"
          max="365"
          value={settings.logRetentionDays}
          onChange={(e) =>
            handleInputChange("logRetentionDays", parseInt(e.target.value))
          }
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          System logs will be kept for this period
        </p>
      </div>
    </div>
  );

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "items":
        return renderItemSettings();
      case "system":
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div>
      <div className="md:flex md:space-x-8">
        {/* Settings Navigation */}
        <div className="md:w-1/4">
          <nav className="space-y-1">
            {settingSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div>{section.name}</div>
                    <div className="text-xs text-gray-500 hidden md:block">
                      {section.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="md:w-3/4 mt-6 md:mt-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {settingSections.find((s) => s.id === activeSection)?.name}{" "}
                Settings
              </h3>
              <p className="text-sm text-gray-500">
                {
                  settingSections.find((s) => s.id === activeSection)
                    ?.description
                }
              </p>
            </div>

            <div className="px-6 py-6">{renderSettingsContent()}</div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              {saveMessage && (
                <div className="flex items-center text-sm">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-green-700">{saveMessage}</span>
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
