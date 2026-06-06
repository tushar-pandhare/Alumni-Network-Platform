require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const helmet = require("helmet");

// ─── Models ───────────────────────────────────────────────────────────────────
const AlumniProfile    = require("./Models/ProfileModel.js");
const User             = require("./Models/LoginModel.js");
const Event            = require("./Models/EventModel.js");
const JobPost          = require("./Models/JobPostModel.js");
const MentorProfile    = require("./Models/MentorProfiles.js");
const StartupPost      = require("./Models/StartUpModel.js");
const Suggestion       = require("./Models/SuggestionFeedbackModel.js");
const AlumniStory      = require("./Models/AlumniStoryModel.js");
const MentorshipRequest = require("./Models/Mentorship/MentorshipRequestModel.js");
const Donation         = require("./Models/DonationModel.js");

// ─── Routes ───────────────────────────────────────────────────────────────────
const donationRoutes   = require("./route/donationRoutes.js");
const mentorshipRoutes = require("./route/MentorshipRoute/mentorship.js");

// ─── Middleware ───────────────────────────────────────────────────────────────
const { generateToken }                   = require("./middleware/auth.js");
const { requestLogger, notFound, globalErrorHandler } = require("./middleware/errorHandler.js");
const { generalLimiter, authLimiter, uploadLimiter, voteLimiter } = require("./middleware/rateLimiter.js");
const {
  validateSignup, validateLogin, validateProfile,
  validateJobPost, validateEvent, validateDonation,
  validateSuggestion, validateMentor,
} = require("./middleware/validate.js");

const app = express();

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // allow Cloudinary image embeds
    contentSecurityPolicy: false,     // managed by frontend build in prod
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:5000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ─── Request Logging ──────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use(generalLimiter);

// ─── MongoDB ──────────────────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

// ─── Cloudinary ───────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Multer (in-memory) ───────────────────────────────────────────────────────
const upload = multer({ storage: multer.memoryStorage() });

// ─── Mounted Routes ───────────────────────────────────────────────────────────
// mentorshipRoutes overrides /get-pending-requests to include statusMap
app.use(mentorshipRoutes);
app.use("/donations", uploadLimiter, donationRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Alumni Network API ✅",
    version: "2.0.0",
    env: process.env.NODE_ENV || "development",
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

app.post("/signup", authLimiter, validateSignup, async (req, res, next) => {
  try {
    const { fullname, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ fullname, email, password: hashedPassword, role });

    // Issue JWT on successful signup
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: newUser._id, name: newUser.fullname, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    next(err);
  }
});

app.post("/login", authLimiter, validateLogin, async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const isRoleMatch = !role || role === user.role; // role check is optional
    if (!isMatch || !isRoleMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Issue JWT on successful login
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.fullname, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  PROFILE ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

app.post("/profile", validateProfile, async (req, res, next) => {
  try {
    const { email } = req.body;
    const existing = await AlumniProfile.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Profile already exists" });
    }
    const profile = await AlumniProfile.create(req.body);
    res.status(201).json({ message: "Profile saved", profile });
  } catch (err) {
    next(err);
  }
});

app.patch("/profile", validateProfile, async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const updated = await AlumniProfile.findOneAndUpdate(
      { email },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Profile not found" });
    res.json({ message: "Profile updated", profile: updated });
  } catch (err) {
    next(err);
  }
});

app.get("/profile", async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email parameter required" });

    const profile = await AlumniProfile.findOne({ email });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ALUMNI DIRECTORY
// ═══════════════════════════════════════════════════════════════════════════════

app.get("/alumni-directory", async (req, res, next) => {
  try {
    const { search, year, location } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { occupation: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }
    if (year) query.passingYear = parseInt(year);
    if (location) query.location = { $regex: location, $options: "i" };

    const dir_data = await AlumniProfile.find(query, {
      name: 1, email: 1, role: 1, passingYear: 1,
      location: 1, profileImage: 1, occupation: 1,
    });
    res.json(dir_data);
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  MENTOR / MENTORSHIP ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

app.get("/is-mentor", async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });
    const mentor = await MentorProfile.findOne({ email });
    res.json({ exists: !!mentor });
  } catch (err) {
    next(err);
  }
});

app.post("/mentor/register", validateMentor, async (req, res, next) => {
  try {
    const { email, name, role, company, expertise, photo, linkedin } = req.body;

    const existingMentor = await MentorProfile.findOne({ email });
    if (existingMentor) {
      return res.status(409).json({ error: "Mentor with this email already exists" });
    }

    const expertiseArray = Array.isArray(expertise)
      ? expertise.map(String)
      : String(expertise).split(",").map((e) => e.trim());

    const savedMentor = await new MentorProfile({
      email, name, role, company, expertise: expertiseArray, photo, linkedin,
    }).save();

    res.status(201).json({ message: "Mentor profile saved", mentor: savedMentor });
  } catch (err) {
    next(err);
  }
});

app.get("/get-mentors", async (req, res, next) => {
  try {
    const mentors = await MentorProfile.find();
    res.json(mentors);
  } catch (err) {
    next(err);
  }
});

app.post("/send-request", async (req, res, next) => {
  try {
    const { studentEmail, mentorEmail, message } = req.body;
    if (!studentEmail || !mentorEmail) {
      return res.status(400).json({ message: "studentEmail and mentorEmail are required" });
    }

    const existing = await MentorshipRequest.findOne({ studentEmail, mentorEmail, status: "pending" });
    if (existing) {
      return res.status(409).json({ message: "You already have a pending request with this mentor" });
    }

    await new MentorshipRequest({ studentEmail, mentorEmail, message }).save();
    res.status(201).json({ message: "Mentorship request sent successfully" });
  } catch (err) {
    next(err);
  }
});

app.get("/get-requests-for-mentor", async (req, res, next) => {
  try {
    const { mentorEmail } = req.query;
    if (!mentorEmail) return res.status(400).json({ message: "mentorEmail is required" });
    const requests = await MentorshipRequest.find({ mentorEmail }).sort({ createdAt: -1 });
    res.status(200).json({ requests });
  } catch (err) {
    next(err);
  }
});

app.patch("/update-request-status", async (req, res, next) => {
  try {
    const { requestId, status } = req.body;
    if (!requestId || !["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const updated = await MentorshipRequest.findByIdAndUpdate(
      requestId, { status }, { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ message: "Status updated", updated });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  EVENTS
// ═══════════════════════════════════════════════════════════════════════════════

app.post("/upload-event", validateEvent, async (req, res, next) => {
  try {
    const { title, date, time, location, type, description, link } = req.body;
    const savedEvent = await Event.create({ title, date, time, location, type, description, link });
    res.status(201).json({ message: "Event created successfully", event: savedEvent });
  } catch (err) {
    next(err);
  }
});

app.get("/events", async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  JOBS
// ═══════════════════════════════════════════════════════════════════════════════

app.post("/job-posting", validateJobPost, async (req, res, next) => {
  try {
    const { title, company, location, jobType, experience, salary, skills, description, applyLink, duration } = req.body;
    const newJob = await JobPost.create({
      title, company, location, jobType, experience,
      salary, skills, description, applyLink, duration: parseInt(duration),
    });
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    next(err);
  }
});

app.get("/jobs/active", async (req, res, next) => {
  try {
    const jobs = await JobPost.find();
    const today = Date.now();
    const activeJobs = jobs.filter((job) => {
      const expiry = new Date(job.postedDate);
      expiry.setDate(expiry.getDate() + job.duration);
      return today < expiry.getTime();
    });
    res.json(activeJobs);
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  STARTUPS
// ═══════════════════════════════════════════════════════════════════════════════

app.post("/startup-zone", async (req, res, next) => {
  try {
    const { startupName, industry, year } = req.body;
    if (!startupName || !industry || !year) {
      return res.status(400).json({ error: "startupName, industry, and year are required" });
    }
    const savedStartup = await StartupPost.create({ startupName, industry, year });
    res.status(201).json({ message: "Startup submitted successfully", startup: savedStartup });
  } catch (err) {
    next(err);
  }
});

app.get("/get-startups", async (req, res, next) => {
  try {
    const startups = await StartupPost.find({}).sort({ createdAt: -1 });
    res.json(startups);
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  SUGGESTIONS / FEEDBACK
// ═══════════════════════════════════════════════════════════════════════════════

app.post("/post-Suggestions", validateSuggestion, async (req, res, next) => {
  try {
    const { title, author, description } = req.body;
    await Suggestion.create({ title, author, votes: 0, description });
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    next(err);
  }
});

app.get("/get-post-suggestion", async (req, res, next) => {
  try {
    const data = await Suggestion.find({}).sort({ votes: -1, createdAt: -1 });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.patch("/suggestions/:id/vote", voteLimiter, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const suggestion = await Suggestion.findById(id);
    if (!suggestion) return res.status(404).json({ message: "Suggestion not found" });

    if (suggestion.likedBy?.includes(userId)) {
      return res.status(400).json({ message: "Already voted" });
    }

    suggestion.votes += 1;
    suggestion.likedBy = [...(suggestion.likedBy || []), userId];
    await suggestion.save();
    res.status(200).json({ message: "Vote added successfully." });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ALUMNI STORIES
// ═══════════════════════════════════════════════════════════════════════════════

app.post("/alumni-story", async (req, res, next) => {
  try {
    const { name, email, title, story } = req.body;
    if (!name || !email || !title || !story) {
      return res.status(400).json({ error: "All fields (name, email, title, story) are required" });
    }
    const existingStory = await AlumniStory.findOne({ email });
    if (existingStory) {
      return res.status(409).json({ error: "Story already submitted with this email." });
    }
    await new AlumniStory({ name, email, title, story }).save();
    res.status(201).json({ message: "Story submitted successfully." });
  } catch (err) {
    next(err);
  }
});

app.get("/alumni-story/:email", async (req, res, next) => {
  try {
    const existingStory = await AlumniStory.findOne({ email: req.params.email });
    res.json({ submitted: !!existingStory });
  } catch (err) {
    next(err);
  }
});

app.get("/alumni-stories", async (req, res, next) => {
  try {
    const data = await AlumniStory.find({}).sort({ createdAt: -1 });
    res.json({ stories: data });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  DIRECT DONATION (JSON — no file upload)
// ═══════════════════════════════════════════════════════════════════════════════

app.post("/alumni/donate", validateDonation, async (req, res, next) => {
  try {
    const { name, email, amount, message, method, transactionId } = req.body;
    await new Donation({ name, email, amount, message, method, transactionId, files: [] }).save();
    res.status(201).json({ message: "Donation recorded successfully" });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ERROR HANDLING (must be last)
// ═══════════════════════════════════════════════════════════════════════════════

app.use(notFound);
app.use(globalErrorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});
