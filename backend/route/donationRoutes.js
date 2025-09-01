const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage for buffering uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/donate", upload.array("files", 2), async (req, res) => {
  try {
    const { name, email, amount, method, transactionId, message } = req.body;
    const fileUploadPromises = [];

    for (const file of req.files) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "donations" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      fileUploadPromises.push(uploadPromise);
    }

    const uploadedUrls = await Promise.all(fileUploadPromises);

    return res.status(200).json({
      success: true,
      message: "Donation submitted successfully!",
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
    console.error("Donation error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
