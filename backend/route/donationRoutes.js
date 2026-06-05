const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const Donation = require("../Models/DonationModel.js");

const router = express.Router();

// Cloudinary uses env vars already configured in Server.js (no need to re-config here)

// Memory storage for file buffering
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

/**
 * POST /donations/donate
 * Accepts multipart/form-data with optional file uploads (proof screenshot + ID proof)
 * OR application/json (when frontend sends Cloudinary URLs already uploaded)
 */
router.post("/donate", upload.array("files", 2), async (req, res) => {
  try {
    const { name, email, amount, method, transactionId, message } = req.body;

    // Validate required fields
    if (!name || !email || !amount || !method || !transactionId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, email, amount, method, transactionId",
      });
    }

    let fileUrls = [];

    // If files were sent as multipart (direct upload from form)
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "donations", resource_type: "auto" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      });
      fileUrls = await Promise.all(uploadPromises);
    }

    // If files were already uploaded to Cloudinary by frontend and URLs passed as JSON
    if (req.body.files && Array.isArray(req.body.files)) {
      fileUrls = req.body.files;
    }

    // Save donation to MongoDB
    const donation = new Donation({
      name,
      email,
      amount: parseFloat(amount),
      method,
      transactionId,
      message: message || "",
      files: fileUrls,
    });

    await donation.save();

    return res.status(201).json({
      success: true,
      message: "Donation submitted and recorded successfully!",
      data: {
        name,
        email,
        amount: parseFloat(amount),
        method,
        transactionId,
        files: fileUrls,
      },
    });
  } catch (error) {
    console.error("Donation route error:", error);
    return res.status(500).json({ success: false, error: "Server error while processing donation" });
  }
});

/**
 * GET /donations/recent
 * Returns the 10 most recent verified donations for display
 */
router.get("/recent", async (req, res) => {
  try {
    const donations = await Donation.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name amount createdAt message");
    res.json({ success: true, donations });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch donations" });
  }
});

module.exports = router;
