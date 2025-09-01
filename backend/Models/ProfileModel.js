// const mongoose = require("mongoose");

// const alumniProfileSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   MobileNum: {
//     type: String,
//     required: true
//   },
//   graduationYear: {
//     type: Number,
//     required: true
//   },
//   branch: {
//     type: String,
//     required: true
//   },
//   currentJob: {
//     type: String
//   },
//   about: {
//     type: String
//   },
//   location: {
//     type: String
//   },
//   linkedIn: {
//     type: String
//   },
//   github: {
//     type: String
//   },
//   profileImage: {
//     type: String
//   },
//   skills: {
//     type: [String]
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const AlumniProfile = mongoose.model("AlumniProfile", alumniProfileSchema);
// module.exports = AlumniProfile;
const mongoose = require("mongoose");

const alumniProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    // required: true
  },
  location: {
    type: String
  },
  college: {
    type: String
  },
  branch: {
    type: String
  },
  passingYear: {
    type: Number
  },
  occupation: {
    type: String
  },
  linkedin: {
    type: String
  },
  github: {
    type: String
  },
  about: {
    type: String
  },
  skills: {
    type: String // stored as a comma-separated string (e.g., "React, Node.js, Python")
  },
  profileImage: {
    type: String // optional: add Cloudinary URL here if using
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AlumniProfile = mongoose.model("AlumniProfile", alumniProfileSchema);
module.exports = AlumniProfile;
