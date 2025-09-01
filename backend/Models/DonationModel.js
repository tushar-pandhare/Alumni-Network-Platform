const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    transactionId: { type: String, required: true },
    message: { type: String },
    files: [String], // Cloudinary URLs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", DonationSchema);
