const express = require("express");
const router = express.Router();
const MentorshipRequest = require("../../Models/Mentorship/MentorshipRequestModel");

// NOTE: The main /send-request and /get-pending-requests routes live in Server.js
// This file only adds the statusMap-aware version and the mentor-side status route

// GET /get-pending-requests — returns both pendingMentorEmails AND statusMap
// Overrides the simpler version in Server.js (this router is mounted first via app.use(mentorshipRoutes))
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

    res.json({ pendingMentorEmails, statusMap });
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /mentorship-request/:id/status — alternate status update endpoint
router.patch("/mentorship-request/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const updated = await MentorshipRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Status updated", request: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
