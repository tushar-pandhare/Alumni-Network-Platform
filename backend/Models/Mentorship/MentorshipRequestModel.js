const mongoose = require("mongoose");

const mentorshipRequestSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  mentorEmail:  { type: String, required: true },
  message:      { type: String, default: "" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  // ✅ NEW: mentor can attach a response note + contact info when accepting
  mentorResponse: {
    note:         { type: String, default: "" },  // personal message to student
    contactPhone: { type: String, default: "" },  // optional phone number
    contactEmail: { type: String, default: "" },  // may differ from mentor login email
    meetingLink:  { type: String, default: "" },  // Google Meet / Calendly / Zoom link
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MentorshipRequest", mentorshipRequestSchema);
