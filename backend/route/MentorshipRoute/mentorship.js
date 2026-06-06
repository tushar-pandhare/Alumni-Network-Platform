const express = require("express");
const router = express.Router();
const MentorshipRequest = require("../../Models/Mentorship/MentorshipRequestModel");

// GET /get-pending-requests
// Returns statusMap AND full request data (including mentorResponse contact info)
// This overrides the simpler version that would be in Server.js
router.get("/get-pending-requests", async (req, res) => {
  try {
    const { studentEmail } = req.query;
    if (!studentEmail) {
      return res.status(400).json({ message: "studentEmail is required" });
    }

    const requests = await MentorshipRequest.find({ studentEmail });

    const pendingMentorEmails = requests
      .filter((r) => r.status === "pending")
      .map((r) => r.mentorEmail);

    // statusMap: { "mentor@email.com": "pending" | "accepted" | "rejected" }
    const statusMap = {};
    requests.forEach((r) => {
      statusMap[r.mentorEmail] = r.status;
    });

    // contactMap: { "mentor@email.com": { note, contactPhone, contactEmail, meetingLink } }
    // Only populated when status is "accepted"
    const contactMap = {};
    requests
      .filter((r) => r.status === "accepted" && r.mentorResponse)
      .forEach((r) => {
        contactMap[r.mentorEmail] = r.mentorResponse;
      });

    res.json({ pendingMentorEmails, statusMap, contactMap });
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /mentorship-request/:id/status
router.patch("/mentorship-request/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const updated = await MentorshipRequest.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Status updated", request: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
