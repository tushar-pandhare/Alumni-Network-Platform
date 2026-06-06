// Converted from broken ES module syntax to CommonJS
// This file is not currently wired to any route — kept for reference.
// The live signup/login logic lives in Server.js with proper validation middleware.
const User = require("../Models/LoginModel");
const bcrypt = require("bcryptjs");

const signingup = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ message: "User Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ fullname, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User Not Found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });
    res.status(200).json({ message: "Login Successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { signingup, login };
