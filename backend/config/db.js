const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB with improved error handling
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of default 30
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Set up listeners for connection issues
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log("Make sure MongoDB is installed and running on your system");
    process.exit(1);
  }
};

module.exports = { connectDB };
