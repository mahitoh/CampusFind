const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }
  // If no token found
  else if (req.cookies?.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    const user = await User.findById(decoded.id);

    // Check if user still exists
    if (!user) {
      console.log(
        `User with ID ${decoded.id} not found in database but had valid token`
      );
      return res.status(401).json({
        success: false,
        error: "User no longer exists",
      });
    }

    // Set user on request
    req.user = user;
    console.log(`User ${user.username} authenticated successfully`);

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
