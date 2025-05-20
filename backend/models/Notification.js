const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: [
      "item-match",
      "claim-request",
      "claim-approved",
      "new-message",
      "system",
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedItem: {
    type: mongoose.Schema.ObjectId,
    ref: "Item",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
