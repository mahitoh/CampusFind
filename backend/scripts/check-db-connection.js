// Script to check MongoDB connection and database status
require("dotenv").config();
const mongoose = require("mongoose");

// Function to connect to MongoDB and check status
async function checkMongoDBConnection() {
  console.log("Attempting to connect to MongoDB...");

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

    // Get database stats
    const dbStats = await mongoose.connection.db.stats();
    console.log("\nDatabase Statistics:");
    console.log(`- Database Name: ${mongoose.connection.db.databaseName}`);
    console.log(`- Collections: ${dbStats.collections}`);
    console.log(`- Documents: ${dbStats.objects}`);
    console.log(
      `- Storage Size: ${(dbStats.storageSize / 1048576).toFixed(2)} MB`
    );

    // List collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("\nAvailable Collections:");

    if (collections.length === 0) {
      console.log("No collections found. Database may be empty.");
    } else {
      collections.forEach((collection) => {
        console.log(`- ${collection.name}`);
      });
    }

    // Check if User collection exists
    const userCollection = collections.find((coll) => coll.name === "users");
    if (userCollection) {
      // Count users
      const usersCount = await mongoose.connection.db
        .collection("users")
        .countDocuments();
      console.log(`\nUsers collection exists with ${usersCount} document(s).`);
    } else {
      console.log(
        "\nUsers collection not found. It will be created when the first user signs up."
      );
    }

    console.log("\n✅ Database is ready to store user information.");
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.log("\nPossible issues:");
    console.log("1. MongoDB service is not running");
    console.log("2. MONGO_URI environment variable is not set or is incorrect");
    console.log("3. Network connectivity issues");
    console.log("\nPlease check these issues and try again.");
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log("\nMongoDB connection closed.");
  }

  // Exit process
  process.exit();
}

// Run the function
checkMongoDBConnection();
