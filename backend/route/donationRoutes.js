const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const Donation = require("../Models/DonationModel");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, WEBP, and PDF files are allowed"));
    }
  },
});

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "donations" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// POST /donations/donate — upload proof files + save donation to MongoDB
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

    // Upload each file to Cloudinary (if any)
    let uploadedUrls = [];
    if (req.files && req.files.length > 0) {
      uploadedUrls = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );
    }

    // FIX: Actually save to MongoDB (was missing before)
    const newDonation = new Donation({
      name,
      email,
      amount: parseFloat(amount),
      method,
      transactionId,
      message: message || "",
      files: uploadedUrls,
    });

    await newDonation.save();

    return res.status(201).json({
      success: true,
      message: "Donation submitted and recorded successfully!",
      data: {
        name,
        email,
        amount,
        method,
        transactionId,
        message,
        files: uploadedUrls,
      },
    });
  } catch (error) {
    console.error("Donation route error:", error);
    return res.status(500).json({ success: false, error: "Server error: " + error.message });
  }
});

// GET /donations/recent — fetch recent donations (for the portal display)
router.get("/recent", async (req, res) => {
  try {
    const donations = await Donation.find({})
      .select("name amount method createdAt message")
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, donations });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch donations" });
  }
});

module.exports = router;
