const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  
  // Profile Information
  profile: {
    name: {
      type: String,
      default: "",
    },
    major: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      default: "",
    },
    studentId: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      default: "Prefer not to say",
    },
    nationality: {
      type: String,
      default: "",
    },
    emergencyContact: {
      type: String,
      default: "",
    },
    emergencyContactName: {
      type: String,
      default: "",
    },
    emergencyContactRelation: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    interests: [{
      type: String,
    }],
    skills: [{
      type: String,
    }],
  },

  // User Preferences
  preferences: {
    darkMode: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      enum: ["en", "fr", "es", "de", "zh"],
      default: "en",
    },
    fontSize: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "medium",
    },
    autoSave: {
      type: Boolean,
      default: true,
    },
    compactMode: {
      type: Boolean,
      default: false,
    },
    showTutorials: {
      type: Boolean,
      default: true,
    },
  },

  // Privacy & Security Settings
  privacy: {
    showEmail: {
      type: Boolean,
      default: false,
    },
    showProfile: {
      type: Boolean,
      default: true,
    },
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },
    allowSearchIndexing: {
      type: Boolean,
      default: true,
    },
    showOnlineStatus: {
      type: Boolean,
      default: true,
    },
    allowFriendRequests: {
      type: Boolean,
      default: true,
    },
    dataSharing: {
      type: Boolean,
      default: false,
    },
  },

  // Notification Settings
  notifications: {
    email: {
      type: Boolean,
      default: true,
    },
    sms: {
      type: Boolean,
      default: false,
    },
    push: {
      type: Boolean,
      default: true,
    },
    itemUpdates: {
      type: Boolean,
      default: true,
    },
    newMessages: {
      type: Boolean,
      default: true,
    },
    systemAlerts: {
      type: Boolean,
      default: true,
    },
    marketingEmails: {
      type: Boolean,
      default: false,
    },
    weeklyDigest: {
      type: Boolean,
      default: true,
    },
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
