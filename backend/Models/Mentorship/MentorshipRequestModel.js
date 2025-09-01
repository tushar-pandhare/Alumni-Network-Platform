const mongoose = require("mongoose");

const mentorshipRequestSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true,
  },
  mentorEmail: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MentorshipRequest", mentorshipRequestSchema);
