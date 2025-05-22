import React, { useState } from "react";
import {
  BellIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "assignment",
      title: "New Assignment Posted",
      message:
        "Mathematics Assignment 3 has been posted. Due date: March 20, 2024",
      time: "2 hours ago",
      read: false,
      icon: DocumentTextIcon,
    },
    {
      id: 2,
      type: "grade",
      title: "Grade Updated",
      message: "Your Physics Lab Report has been graded. You received an A.",
      time: "1 day ago",
      read: false,
      icon: AcademicCapIcon,
    },
    {
      id: 3,
      type: "exam",
      title: "Exam Schedule",
      message: "Final exam schedule for Spring 2024 has been released.",
      time: "2 days ago",
      read: true,
      icon: CalendarIcon,
    },
    {
      id: 4,
      type: "message",
      title: "New Message",
      message:
        "Professor Smith sent you a message regarding your project submission.",
      time: "3 days ago",
      read: true,
      icon: ChatBubbleLeftRightIcon,
    },
  ]);

  const [showAll, setShowAll] = useState(false);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const getNotificationIcon = (type) => {
    const Icon = notifications.find((n) => n.id === type)?.icon || BellIcon;
    return <Icon className="h-6 w-6" />;
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "assignment":
        return "bg-blue-100 text-blue-800";
      case "grade":
        return "bg-green-100 text-green-800";
      case "exam":
        return "bg-yellow-100 text-yellow-800";
      case "message":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNotifications = showAll
    ? notifications
    : notifications.filter((notification) => !notification.read);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Notifications
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Stay updated with your academic activities
              </p>
            </div>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {showAll ? "Show Unread Only" : "Show All"}
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${
                  !notification.read ? "bg-indigo-50" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 p-2 rounded-full ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No notifications to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
