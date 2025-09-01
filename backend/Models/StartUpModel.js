const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  startupName: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
 
}, { timestamps: true }); 
const Startup = mongoose.model('Startup', startupSchema);

module.exports = Startup;