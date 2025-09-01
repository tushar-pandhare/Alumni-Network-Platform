// models/AlumniStory.js
const mongoose = require("mongoose");

const alumniStorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true  , unique : true},
  title: { type: String, required: true },
  story: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const AlumniStory = mongoose.model('AlumniStory', alumniStorySchema);
module.exports = AlumniStory;