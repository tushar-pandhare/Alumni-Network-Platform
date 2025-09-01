// Models/StudentRequestModel.js
const mongoose = require("mongoose");

const studentRequestSchema = new mongoose.Schema({
  studentName: String,
  email: String,
  year: String,
  department: String,
  interestArea: String,
  question: String,
  requestedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("StudentRequest", studentRequestSchema);
