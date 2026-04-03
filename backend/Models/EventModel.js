// const { motion } = require("framer-motion/client");

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: String, // or Date if storing actual Date object
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String, // e.g., Conference, Webinar, etc.
    required: true
  },
  link:{
    type :String,
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
