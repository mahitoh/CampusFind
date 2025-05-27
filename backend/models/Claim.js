const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.ObjectId,
    ref: "Item",
    required: true,
  },
  claimant: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Completed"],
    default: "Pending",
  },
  description: {
    type: String,
    required: [true, "Please describe why you think this item is yours"],
  },
  identifyingInfo: {
    type: String,
    required: [true, "Please provide identifying information about the item"],
  },
  contactInfo: {
    name: String,
    email: String,
    phone: String,
  },
  meetupLocation: String,
  meetupTime: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
ClaimSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Claim", ClaimSchema);
