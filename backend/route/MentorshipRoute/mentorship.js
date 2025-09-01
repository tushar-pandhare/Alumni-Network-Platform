const express = require("express");
const router = express.Router();
const MentorshipRequest = require("../../Models/Mentorship/MentorshipRequestModel");

// Send request
router.post("/send-request", async (req, res) => {
  const { studentEmail, mentorEmail, message } = req.body;

  const existing = await MentorshipRequest.findOne({ studentEmail, mentorEmail });
  if (existing) {
    return res.status(409).json({ message: "Request already sent." });
  }

  const newRequest = new MentorshipRequest({ studentEmail, mentorEmail, message });
  await newRequest.save();
  res.json({ message: "Request sent." });
});

// Get request status for student
router.get("/get-pending-requests", async (req, res) => {
  const { studentEmail } = req.query;

  const requests = await MentorshipRequest.find({ studentEmail });
  const sentEmails = requests.map((r) => r.mentorEmail);
  const statusMap = {};
  requests.forEach((r) => (statusMap[r.mentorEmail] = r.status));
  res.json({ pendingMentorEmails: sentEmails, statusMap });
});

// Get requests by mentor email
router.get("/get-requests-by-email", async (req, res) => {
  const { email } = req.query;
  const requests = await MentorshipRequest.find({ mentorEmail: email });
  res.json(requests);
});

// Change status (accept/reject)
router.patch("/mentorship-request/:id/status", async (req, res) => {
  const { status } = req.body;
  const updated = await MentorshipRequest.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Request not found" });
  res.json({ message: "Status updated", request: updated });
});

module.exports = router;
