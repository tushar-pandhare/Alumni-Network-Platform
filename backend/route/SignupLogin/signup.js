const express = require("express");
const cloudinary = require("cloudinary").v2;
const MultiUsers = require("./SignUpmodel.js"); 
const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      profilePhoto,
      collegeName,
      branch,
      yearOfPassing,
      userType,
      currentOccupation,
      city,
      linkedIn,
      github,
      portfolio,
      password
    } = req.body;

    // Check if user already exists
    const existingUser = await MultiUsers.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    const newUser = new MultiUsers({
      name,
      email,
      phone,
      profilePhoto,
      collegeName,
      branch,
      yearOfPassing,
      userType,
      currentOccupation,
      city,
      linkedIn,
      github,
      portfolio,
      password
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: savedUser });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;
