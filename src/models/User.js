const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },

  fullName: {
    type: String,
    required: [true, "Full Name is required"],
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "Email is required"],
  },

  mobile: {
    type: String,
    unique: true,
    required: [true, "Mobile number is required"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },

  profileCreatedBy: {
    type: String,
    enum: ["myself", "son", "daughter", "relative", "friend"],
    required: true,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  blocked: {
    type: Boolean,
    default: false,
  },

  profileCompleted: {
    type: Boolean,
    default: false,
  },

  // Optional Profile Fields
  age: Number,
  dob: String,
  religion: String,
  caste: String,
  motherTongue: String,
  education: String,
  occupation: String,
  income: String,
  location: String,
  height: String,
  weight: String,
  maritalStatus: String,
  hobbies: [String],
  bio: String,
  profileImage: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
