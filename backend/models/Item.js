const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "Electronics",
      "Clothing",
      "Books",
      "Accessories",
      "Documents",
      "Other",
    ],
  },
  status: {
    type: String,
    enum: ["Lost", "Found", "Claimed", "Returned"],
    required: [true, "Status is required"],
  },
  // Admin approval system
  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  approvedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
    maxlength: [200, "Rejection reason cannot be more than 200 characters"],
  },
  location: {
    type: String,
    required: [true, "Location where item was lost/found is required"],
  },
  date: {
    type: Date,
    required: [true, "Date when item was lost/found is required"],
  },
  images: [String],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  contact: {
    name: String,
    email: String,
    phone: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add text index for search functionality
ItemSchema.index({ title: "text", description: "text", location: "text" });

module.exports = mongoose.model("Item", ItemSchema);
