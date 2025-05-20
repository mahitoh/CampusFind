#!/usr/bin/env node

/**
 * MongoDB Database Seeder
 *
 * This script populates the MongoDB database with sample data for development purposes.
 *
 * Usage:
 * 1. Make sure MongoDB is running
 * 2. Run: node seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Item = require("./models/Item");
const Notification = require("./models/Notification");
const Claim = require("./models/Claim");

// Sample data
const users = [
  {
    name: "Admin User",
    email: "admin@campusfind.com",
    password: "password123", // Will be hashed
    role: "admin",
    phone: "123-456-7890",
  },
  {
    name: "John Smith",
    email: "john@example.com",
    password: "password123",
    phone: "123-456-7891",
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    phone: "123-456-7892",
  },
];

const itemCategories = [
  "Electronics",
  "Clothing",
  "Books",
  "Accessories",
  "Documents",
  "Other",
];
const itemStatuses = ["lost", "found", "claimed", "returned"];
const campusLocations = [
  "Library",
  "Student Center",
  "Science Building",
  "Engineering Building",
  "Cafeteria",
  "Gymnasium",
  "Auditorium",
  "Parking Lot",
  "Dormitory",
];

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected for seeding...");

    try {
      // Clear existing data
      await User.deleteMany();
      await Item.deleteMany();
      await Notification.deleteMany();
      await Claim.deleteMany();
      console.log("Cleared existing data");

      // Create users
      const createdUsers = [];
      for (const user of users) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const newUser = await User.create({
          ...user,
          password: hashedPassword,
        });

        createdUsers.push(newUser);
        console.log(`Created user: ${newUser.name}`);
      }

      // Create items
      const items = [];
      const currentDate = new Date();

      // Generate 20 random items
      for (let i = 0; i < 20; i++) {
        const randomUser =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomCategory =
          itemCategories[Math.floor(Math.random() * itemCategories.length)];
        const randomStatus =
          itemStatuses[Math.floor(Math.random() * itemStatuses.length)];
        const randomLocation =
          campusLocations[Math.floor(Math.random() * campusLocations.length)];

        // Generate a date within the last 30 days
        const randomDate = new Date(currentDate);
        randomDate.setDate(
          randomDate.getDate() - Math.floor(Math.random() * 30)
        );

        const itemData = {
          title: `${randomCategory} Item ${i + 1}`,
          description: `This is a ${randomStatus} ${randomCategory.toLowerCase()} item found at ${randomLocation}`,
          category: randomCategory,
          status: randomStatus,
          location: randomLocation,
          date: randomDate,
          user: randomUser._id,
          images: [],
        };

        if (randomStatus === "found") {
          itemData.foundDate = randomDate;
          itemData.foundLocation = randomLocation;
        } else if (randomStatus === "lost") {
          itemData.lostDate = randomDate;
          itemData.lostLocation = randomLocation;
        }

        const newItem = await Item.create(itemData);
        items.push(newItem);
        console.log(`Created ${randomStatus} item: ${newItem.title}`);
      }

      // Create notifications
      for (let i = 0; i < 10; i++) {
        const randomUser =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomItem = items[Math.floor(Math.random() * items.length)];

        const notificationTypes = [
          "match",
          "claim",
          "message",
          "status_update",
        ];
        const randomType =
          notificationTypes[
            Math.floor(Math.random() * notificationTypes.length)
          ];

        let message = "";
        switch (randomType) {
          case "match":
            message = `We found a possible match for your ${randomItem.title}!`;
            break;
          case "claim":
            message = `Someone has claimed your ${randomItem.title}!`;
            break;
          case "message":
            message = `You have a new message regarding ${randomItem.title}`;
            break;
          case "status_update":
            message = `The status of ${randomItem.title} has been updated to ${randomItem.status}`;
            break;
        }

        const newNotification = await Notification.create({
          user: randomUser._id,
          type: randomType,
          message,
          item: randomItem._id,
          read: Math.random() > 0.5, // Randomly mark as read or unread
          date: new Date(),
        });

        console.log(`Created notification for ${randomUser.name}: ${message}`);
      }

      // Create claims
      for (let i = 0; i < 5; i++) {
        const foundItems = items.filter((item) => item.status === "found");
        if (foundItems.length === 0) continue;

        const randomFoundItem =
          foundItems[Math.floor(Math.random() * foundItems.length)];
        const itemOwner = await User.findById(randomFoundItem.user);

        // Select a claimer who is not the item owner
        let claimer;
        do {
          claimer =
            createdUsers[Math.floor(Math.random() * createdUsers.length)];
        } while (claimer._id.toString() === itemOwner._id.toString());

        const claimStatuses = ["pending", "approved", "rejected", "completed"];
        const randomStatus =
          claimStatuses[Math.floor(Math.random() * claimStatuses.length)];

        const newClaim = await Claim.create({
          item: randomFoundItem._id,
          claimer: claimer._id,
          owner: itemOwner._id,
          status: randomStatus,
          description: `I lost this ${randomFoundItem.category.toLowerCase()} recently and I believe it's mine.`,
          claimDate: new Date(),
          evidenceProvided: Math.random() > 0.5,
        });

        console.log(
          `Created claim for "${randomFoundItem.title}" by ${claimer.name} (Status: ${randomStatus})`
        );
      }

      console.log("Database successfully seeded! 🌱");
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      mongoose.disconnect();
      console.log("MongoDB disconnected after seeding.");
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
