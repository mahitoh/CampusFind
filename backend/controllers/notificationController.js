const Item = require("../models/Item");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Store online users
let onlineUsers = {};

// Initialize socket.io
exports.initSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle user authentication
    socket.on("authenticate", async (userData) => {
      try {
        // Store user id with socket id
        if (userData && userData.userId) {
          onlineUsers[userData.userId] = socket.id;
          console.log(`User ${userData.userId} authenticated`);

          // Join a room specific to this user
          socket.join(`user-${userData.userId}`);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);

      // Remove user from online users
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
    });

    // Handle item match notification
    socket.on("check-item-match", async (itemData) => {
      try {
        if (!itemData || !itemData.itemId) return;

        const item = await Item.findById(itemData.itemId);
        if (!item) return;

        // If this is a found item, search for matching lost items
        if (item.status === "Found") {
          const possibleMatches = await Item.find({
            status: "Lost",
            category: item.category,
            // Add more matching criteria as needed
          })
            .limit(5)
            .populate("user", "username email");

          if (possibleMatches.length > 0) {
            // Notify the user who posted the found item
            socket.emit("possible-matches", {
              item: item,
              matches: possibleMatches,
            });

            // Notify users who lost items
            possibleMatches.forEach((match) => {
              const lostItemOwnerId = match.user._id.toString();
              const ownerSocketId = onlineUsers[lostItemOwnerId];

              if (ownerSocketId) {
                io.to(ownerSocketId).emit("item-match-notification", {
                  message: "Someone found an item that might be yours!",
                  foundItem: item,
                });
              }
            });
          }
        }

        // If this is a lost item, search for matching found items
        if (item.status === "Lost") {
          const possibleMatches = await Item.find({
            status: "Found",
            category: item.category,
            // Add more matching criteria as needed
          })
            .limit(5)
            .populate("user", "username email");

          if (possibleMatches.length > 0) {
            // Notify the user who reported the lost item
            socket.emit("possible-matches", {
              item: item,
              matches: possibleMatches,
            });
          }
        }
      } catch (error) {
        console.error("Error checking for item matches:", error);
      }
    });
  });
};

// Create a notification in the database
exports.createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .sort("-createdAt")
      .populate("sender", "username")
      .populate("relatedItem", "title images");

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    // Make sure user owns the notification
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "User not authorized to update this notification",
      });
    }

    notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    // Make sure user owns the notification
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "User not authorized to delete this notification",
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// All exports are already defined using 'exports.' syntax
// No additional export statement needed here
