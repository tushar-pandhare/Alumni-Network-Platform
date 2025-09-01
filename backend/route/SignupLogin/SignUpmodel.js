const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    profilePhoto: { type: String },
    collegeName: { type: String },
    branch: { type: String },
    yearOfPassing: { type: String },
    userType: { type: String, enum: ["student", "alumni"], default: "student" },
    currentOccupation: { type: String },
    city: { type: String },
    linkedIn: { type: String },
    github: { type: String },
    portfolio: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserTable", userSchema);
