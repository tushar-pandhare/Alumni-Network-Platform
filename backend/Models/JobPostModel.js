const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  applyLink: {
    type: String,
    required: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in days
    required: true
  }
});

const JobPost = mongoose.model("JobPost", jobPostSchema);
module.exports = JobPost;
