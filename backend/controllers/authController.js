const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    console.log("Registration request received:", {
      ...req.body,
      password: req.body.password ? "[REDACTED]" : undefined,
    });

    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide username, email and password",
      });
    }

    // Check if user with this email exists
    let userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`Registration failed: Email ${email} already exists`);
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // Check if username is taken
    userExists = await User.findOne({ username });
    if (userExists) {
      console.log(`Registration failed: Username ${username} already exists`);
      return res.status(400).json({
        success: false,
        error: "Username is already taken",
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    console.log(`User registered successfully: ${username} (${email})`);

    // Create token
    const token = generateToken(user._id);

    // Return success response with user data
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Check for MongoDB validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(", "),
      });
    }

    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    console.log("Login request received:", {
      ...req.body,
      password: req.body.password ? "[REDACTED]" : undefined,
    });

    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }

    // Check for user by email or username (more user-friendly)
    const user = await User.findOne({
      $or: [
        { email: email },
        { username: email }, // Allow login with username as well
      ],
    }).select("+password");

    if (!user) {
      console.log(
        `Login failed: No user found with email or username: ${email}`
      );
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(`Login failed: Invalid password for user: ${user.username}`);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    console.log(
      `User logged in successfully: ${user.username} (${user.email})`
    );

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {},
  });
};
