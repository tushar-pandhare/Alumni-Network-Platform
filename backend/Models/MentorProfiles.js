const mongoose = require("mongoose");

const mentorProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email : {type : String , unique : true , required: true},
  role: { type: String, required: true },
  company: { type: String, required: true },
  expertise: { type: [String], required: true },
  photo: { type: String },
  linkedin: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MentorProfile = mongoose.model("MentorProfile", mentorProfileSchema);
module.exports = MentorProfile;
