#!/usr/bin/env node

/**
 * MongoDB Connection Test
 *
 * This script tests the MongoDB connection using the configuration from your .env file.
 *
 * Usage:
 * node check-mongodb.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

console.log("Testing MongoDB connection...");
console.log(
  `Attempting to connect to: ${
    process.env.MONGO_URI || "No MONGO_URI defined in .env!"
  }`
);

if (!process.env.MONGO_URI) {
  console.error("\n❌ Error: MONGO_URI is not defined in your .env file!");
  console.log("Please make sure you have a .env file with MONGO_URI defined.");
  console.log("Example: MONGO_URI=mongodb://localhost:27017/campusfind");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("\n✅ MongoDB connected successfully!");
    console.log("Database connection details:");
    console.log(`  - Host: ${mongoose.connection.host}`);
    console.log(`  - Database: ${mongoose.connection.db.databaseName}`);
    console.log(
      `  - Connection State: ${
        mongoose.connection.readyState === 1 ? "Connected" : "Not Connected"
      }`
    );

    // Get database stats
    return mongoose.connection.db.stats();
  })
  .then((stats) => {
    console.log("\nDatabase Statistics:");
    console.log(`  - Collections: ${stats.collections}`);
    console.log(`  - Views: ${stats.views}`);
    console.log(`  - Objects: ${stats.objects}`);
    console.log(
      `  - Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`
    );

    console.log(
      "\nAll systems go! Your MongoDB connection is working properly."
    );
  })
  .catch((err) => {
    console.error("\n❌ Error connecting to MongoDB:");
    console.error(err);

    console.log("\nPossible Solutions:");
    console.log("1. Make sure MongoDB is installed and running");
    console.log(
      "2. Check if the connection string in your .env file is correct"
    );
    console.log("3. If using MongoDB Atlas, ensure your IP is whitelisted");
    console.log("4. Check for network connectivity issues");
    console.log(
      "\nFor MongoDB installation instructions, see: docs/mongodb-setup.md"
    );
  })
  .finally(() => {
    // Close connection
    mongoose.disconnect();
  });
