// Test script for user registration functionality
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const { connectDB } = require("../config/db");

// Test user data
const testUser = {
  username: `test_user_${Date.now().toString().slice(-5)}`,
  email: `test_${Date.now().toString().slice(-5)}@example.com`,
  password: "Password123!",
};

// Function to test user registration
async function testUserRegistration() {
  console.log("Starting user registration test...");
  console.log(`\nTest user: ${testUser.username} (${testUser.email})`);

  try {
    // Connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB Connected");

    // Check if test user already exists
    let userExists = await User.findOne({ email: testUser.email });
    if (userExists) {
      console.log(
        `\n❌ Test failed: User with email ${testUser.email} already exists`
      );
      return;
    }

    userExists = await User.findOne({ username: testUser.username });
    if (userExists) {
      console.log(
        `\n❌ Test failed: User with username ${testUser.username} already exists`
      );
      return;
    }

    // Create test user
    console.log("\nCreating test user...");
    const user = await User.create(testUser);

    console.log(`\n✅ Test user created successfully!`);
    console.log("User data:");
    console.log(`- ID: ${user._id}`);
    console.log(`- Username: ${user.username}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- Created At: ${user.createdAt}`);

    // Verify password is hashed
    console.log("\nVerifying password is properly hashed...");

    // We need to get the user with password included since select: false option excludes it
    const userWithPassword = await User.findById(user._id).select("+password");

    if (userWithPassword.password !== testUser.password) {
      console.log("✅ Password is hashed (not stored in plain text)");
    } else {
      console.log("❌ Warning: Password is not hashed!");
    }

    // Cleanup - Remove test user
    console.log("\nCleaning up - removing test user...");
    await User.deleteOne({ _id: user._id });
    console.log("✅ Test user removed");

    console.log("\n✅ User registration test completed successfully!");
    console.log("User information is properly stored in the database.");
  } catch (error) {
    console.error(`\n❌ Test failed: ${error.message}`);
    if (error.name === "ValidationError") {
      console.error("Validation errors:");
      Object.keys(error.errors).forEach((field) => {
        console.error(`- ${field}: ${error.errors[field].message}`);
      });
    }
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log("\nMongoDB connection closed.");
    process.exit();
  }
}

// Run the test
testUserRegistration();
