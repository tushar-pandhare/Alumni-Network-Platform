require("dotenv").config(); // ✅ FIX #3: dotenv must be called first

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

// ✅ FIX #4 & #5: Remove duplicate imports — one import per model
const AlumniProfile = require("./Models/ProfileModel.js");
const User = require("./Models/LoginModel.js");
const Event = require("./Models/EventModel.js");
const JobPost = require("./Models/JobPostModel.js");
const MentorProfile = require("./Models/MentorProfiles.js");
const StartupPost = require("./Models/StartUpModel.js");
const Suggestion = require("./Models/SuggestionFeedbackModel.js");
const AlumniStory = require("./Models/AlumniStoryModel.js");
const MentorshipRequest = require("./Models/Mentorship/MentorshipRequestModel.js");
const Donation = require("./Models/DonationModel.js");

// Route modules
const donationRoutes = require("./route/donationRoutes.js");
const mentorshipRoutes = require("./route/MentorshipRoute/mentorship.js");
const signupRoutes = require("./route/SignupLogin/signup.js");
const UserTable = require("./route/SignupLogin/SignUpmodel.js");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// ✅ FIX #2: MongoDB URI from environment variable (not hardcoded)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// Cloudinary configuration — now works because dotenv is loaded above
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ FIX #6: Mount donation routes properly with a prefix
app.use("/donations", donationRoutes);

// Mount other route modules
app.use(mentorshipRoutes);
app.use(signupRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Alumni Network API is running ✅", version: "1.0.0" });
});

// ─── Auth Routes ─────────────────────────────────────────────────────────────

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user", details: err.message });
  }
});

// ✅ FIX #7: Login now returns `fullname` (not `name`) matching the LoginModel schema
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const isRoleMatch = role === user.role;

    if (!isMatch || !isRoleMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.fullname, // ✅ was: user.name — field is actually "fullname"
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ─── Profile Routes ───────────────────────────────────────────────────────────

app.post("/profile", async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await AlumniProfile.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }
    const profile = await AlumniProfile.create(req.body);
    res.status(201).json({ message: "Profile saved", profile });
  } catch (err) {
    console.error("POST /profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.patch("/profile", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const updated = await AlumniProfile.findOneAndUpdate(
      { email },
      { $set: req.body },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Profile not found" });

    res.json({ message: "Profile updated", profile: updated });
  } catch (err) {
    console.error("PATCH /profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email parameter required" });

    const profile = await AlumniProfile.findOne({ email });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── Alumni Directory ─────────────────────────────────────────────────────────

app.get("/alumni-directory", async (req, res) => {
  try {
    const dir_data = await AlumniProfile.find(
      {},
      { name: 1, email: 1, role: 1, passingYear: 1, location: 1, profileImage: 1 }
    );
    res.json(dir_data);
  } catch (error) {
    console.error("GET /alumni-directory error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ─── Mentor / Mentorship Routes ───────────────────────────────────────────────

app.get("/is-mentor", async (req, res) => {
  const { email } = req.query;
  const mentor = await MentorProfile.findOne({ email });
  res.json({ exists: !!mentor });
});

app.post("/mentor/register", async (req, res) => {
  try {
    const { email, name, role, company, expertise, photo, linkedin } = req.body;

    const existingMentor = await MentorProfile.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ error: "Mentor with this email already exists" });
    }

    let expertiseArray = [];
    if (typeof expertise === "string") {
      expertiseArray = expertise.split(",").map((e) => e.trim());
    } else if (Array.isArray(expertise)) {
      expertiseArray = expertise.map((e) => String(e).trim());
    }

    const mentorData = new MentorProfile({
      email, name, role, company,
      expertise: expertiseArray,
      photo, linkedin,
    });

    const savedMentor = await mentorData.save();
    res.status(201).json({ message: "Mentor profile saved", mentor: savedMentor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save mentor profile", details: error.message });
  }
});

app.get("/get-mentors", async (req, res) => {
  try {
    const mentors = await MentorProfile.find();
    res.json(mentors);
  } catch (err) {
    console.error("Error fetching mentors:", err);
    res.status(500).json({ message: "Server error while fetching mentors" });
  }
});

app.post("/send-request", async (req, res) => {
  try {
    const { studentEmail, mentorEmail, message } = req.body;

    if (!studentEmail || !mentorEmail) {
      return res.status(400).json({ message: "studentEmail and mentorEmail are required" });
    }

    const existing = await MentorshipRequest.findOne({
      studentEmail,
      mentorEmail,
      status: "pending",
    });

    if (existing) {
      return res.status(409).json({ message: "You have already sent a pending request to this mentor" });
    }

    const request = new MentorshipRequest({ studentEmail, mentorEmail, message });
    await request.save();

    res.status(201).json({ message: "Mentorship request sent successfully" });
  } catch (error) {
    console.error("Error in /send-request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get-pending-requests", async (req, res) => {
  try {
    const { studentEmail } = req.query;

    if (!studentEmail) {
      return res.status(400).json({ message: "studentEmail is required" });
    }

    const pendingRequests = await MentorshipRequest.find({
      studentEmail,
      status: "pending",
    });

    const pendingMentorEmails = pendingRequests.map((req) => req.mentorEmail);
    res.json({ pendingMentorEmails });
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get-requests-for-mentor", async (req, res) => {
  try {
    const { mentorEmail } = req.query;

    if (!mentorEmail) {
      return res.status(400).json({ message: "mentorEmail is required" });
    }

    const requests = await MentorshipRequest.find({ mentorEmail }).sort({ createdAt: -1 });
    res.status(200).json({ requests });
  } catch (err) {
    console.error("Error fetching mentorship requests:", err);
    res.status(500).json({ message: "Server error while fetching requests" });
  }
});

app.patch("/update-request-status", async (req, res) => {
  try {
    const { requestId, status } = req.body;

    if (!requestId || !["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const updated = await MentorshipRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Status updated", updated });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── Events ───────────────────────────────────────────────────────────────────

app.post("/upload-event", async (req, res) => {
  try {
    const { title, date, time, location, type, description, link } = req.body;
    const savedEvent = await Event.create({ title, date, time, location, type, description, link });
    res.status(201).json({ message: "Event created successfully", event: savedEvent });
  } catch (err) {
    console.error("Error creating event:", err.message);
    res.status(400).json({ error: "Failed to create event", details: err.message });
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err.message);
    res.status(500).json({ error: "Failed to fetch events", details: err.message });
  }
});

// ─── Jobs ─────────────────────────────────────────────────────────────────────

app.post("/job-posting", async (req, res) => {
  try {
    const { title, company, location, jobType, experience, salary, skills, description, applyLink, duration } = req.body;
    const newJob = await JobPost.create({
      title, company, location, jobType, experience,
      salary, skills, description, applyLink,
      duration: parseInt(duration),
    });
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to post job", details: err.message });
  }
});

app.get("/jobs/active", async (req, res) => {
  try {
    const jobs = await JobPost.find();
    const today = new Date();
    const activeJobs = jobs.filter((job) => {
      const expiry = new Date(job.postedDate);
      expiry.setDate(expiry.getDate() + job.duration);
      return today < expiry;
    });
    res.json(activeJobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// ─── Startups ─────────────────────────────────────────────────────────────────

app.post("/startup-zone", async (req, res) => {
  try {
    const { startupName, industry, year } = req.body;
    const savedStartup = await StartupPost.create({ startupName, industry, year });
    res.status(201).json({ message: "Startup Submitted successfully", startup: savedStartup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save Startup Data", details: error.message });
  }
});

app.get("/get-startups", async (req, res) => {
  try {
    const startups = await StartupPost.find({});
    res.json(startups);
  } catch (err) {
    console.error("Error fetching startups:", err);
    res.status(500).json({ message: "Server error while fetching startups" });
  }
});

// ─── Suggestions / Feedback ───────────────────────────────────────────────────

app.post("/post-Suggestions", async (req, res) => {
  try {
    const { title, author, votes, description } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required." });
    }

    await Suggestion.create({ title, author, votes, description });
    res.status(201).json({ message: "Feedback Submitted successfully" });
  } catch (error) {
    console.error("Error submitting suggestion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/get-post-suggestion", async (req, res) => {
  try {
    const data = await Suggestion.find({});
    res.json(data);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ message: "Server error while fetching Suggestions!!" });
  }
});

app.patch("/suggestions/:id/vote", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const suggestion = await Suggestion.findById(id);
    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    if (suggestion.likedBy?.includes(userId)) {
      return res.status(400).json({ message: "Already voted" });
    }

    suggestion.votes += 1;
    suggestion.likedBy = [...(suggestion.likedBy || []), userId];
    await suggestion.save();

    res.status(200).json({ message: "Vote added successfully." });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ─── Alumni Stories ───────────────────────────────────────────────────────────

app.post("/alumni-story", async (req, res) => {
  const { name, email, title, story } = req.body;
  try {
    const existingStory = await AlumniStory.findOne({ email });
    if (existingStory) {
      return res.status(400).json({ error: "Story already submitted with this email." });
    }

    const newStory = new AlumniStory({ name, email, title, story });
    await newStory.save();
    res.status(201).json({ message: "Story submitted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit story." });
  }
});

app.get("/alumni-story/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const existingStory = await AlumniStory.findOne({ email });
    res.json({ submitted: !!existingStory });
  } catch (error) {
    res.status(500).json({ error: "Error checking submission status." });
  }
});

app.get("/alumni-stories", async (req, res) => {
  try {
    const data = await AlumniStory.find({});
    res.json({ stories: data });
  } catch (e) {
    res.status(500).json({ error: "Error in accessing data." });
  }
});

// ─── Donation (inline — direct save route) ───────────────────────────────────

// ✅ FIX #8: DonationModel schema alignment — schema uses `files[]` not `proofUrl/idUrl/date`
// This route now matches the actual DonationModel schema
app.post("/alumni/donate", async (req, res) => {
  const { name, email, amount, message, method, transactionId } = req.body;

  if (!name || !email || !amount || !transactionId || !method) {
    return res.status(400).json({ error: "Missing required fields: name, email, amount, method, transactionId" });
  }

  try {
    const newDonation = new Donation({
      name,
      email,
      amount,
      message,
      method,
      transactionId,
      files: [], // No files via this JSON route; use /donations/donate for file uploads
    });

    await newDonation.save();
    res.status(201).json({ message: "Donation recorded successfully" });
  } catch (err) {
    console.error("Donation error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────

// ✅ FIX #1: Port variable used consistently; log message matches actual port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ App is listening on port ${PORT}`);
});
