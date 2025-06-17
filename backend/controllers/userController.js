const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    // Check if user is updating their own profile or if admin
    if (req.params.id !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this user",
      });
    }

    // Don't allow role to be updated via this route
    if (req.body.role) {
      delete req.body.role;
    }

    // Don't allow password to be updated via this route
    if (req.body.password) {
      delete req.body.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    // Only allow admins to delete users
    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete users",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        profile: user.profile,
        preferences: user.preferences,
        privacy: user.privacy,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Update profile fields
    if (req.body.profile) {
      user.profile = { ...user.profile, ...req.body.profile };
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        profile: user.profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user settings
// @route   GET /api/users/settings
// @access  Private
exports.getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        preferences: user.preferences,
        privacy: user.privacy,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user settings
// @route   PUT /api/users/settings
// @access  Private
exports.updateSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Update all settings
    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }
    if (req.body.privacy) {
      user.privacy = { ...user.privacy, ...req.body.privacy };
    }
    if (req.body.notifications) {
      user.notifications = { ...user.notifications, ...req.body.notifications };
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        preferences: user.preferences,
        privacy: user.privacy,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/settings/preferences
// @access  Private
exports.updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    user.preferences = { ...user.preferences, ...req.body };
    await user.save();

    res.status(200).json({
      success: true,
      data: user.preferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user privacy settings
// @route   PUT /api/users/settings/privacy
// @access  Private
exports.updatePrivacy = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    user.privacy = { ...user.privacy, ...req.body };
    await user.save();

    res.status(200).json({
      success: true,
      data: user.privacy,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user notification settings
// @route   PUT /api/users/settings/notifications
// @access  Private
exports.updateNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    user.notifications = { ...user.notifications, ...req.body };
    await user.save();

    res.status(200).json({
      success: true,
      data: user.notifications,
    });
  } catch (error) {
    next(error);
  }
};
