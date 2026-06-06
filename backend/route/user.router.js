// Kept for reference — the live auth routes are in Server.js
// This file is not currently mounted; the controller handlers
// are available if you want to split auth into its own router later.
const express = require("express");
const { signingup, login } = require("../controller/user.controller.js");

const router = express.Router();

router.post("/signup", signingup);
router.post("/login", login);

module.exports = router;
