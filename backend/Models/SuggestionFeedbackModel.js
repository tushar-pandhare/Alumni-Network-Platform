const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  ImagePath: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likedBy: {
    type: [String], 
    default: [],
  },
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = Suggestion;
