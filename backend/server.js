const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { connectDB } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { initSocketIO } = require("./controllers/notificationController");

// Load environment variables
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoutes");
const statsRoutes = require("./routes/statsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const claimRoutes = require("./routes/claimRoutes");

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 8000;

// Connect to database
connectDB();

// Initialize Socket.io
initSocketIO(io);

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Vite default port
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);

// Configure Helmet with cross-origin resource policy to allow images to be loaded from any origin
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files with proper CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/claims", claimRoutes);

// Base route for API health check
app.get("/api", (req, res) => {
  res.json({ message: "CampusFind API is running" });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
