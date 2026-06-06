const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
    required: true,
  },
  // FIX: salary and experience are optional — frontend doesn't always provide them
  // Marking them required caused silent 400 errors when left blank
  experience: { type: String, default: "" },
  salary: { type: String, default: "" },
  skills: { type: String, default: "" },
  description: { type: String, required: true },
  applyLink: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
  duration: { type: Number, required: true }, // days the listing stays active
});

const JobPost = mongoose.model("JobPost", jobPostSchema);
module.exports = JobPost;
