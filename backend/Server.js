const AlumniProfile = require("./Models/ProfileModel.js");
const User = require("./Models/LoginModel.js");
const Event = require("./Models/EventModel.js");
const JobPost = require("./Models/JobPostModel.js");
const MentorProfile = require("./Models/MentorProfiles.js");
const StartupPost = require("./Models/StartUpModel.js");
const SuggestionModel = require("./Models/SuggestionFeedbackModel.js");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const Suggestion = require("./Models/SuggestionFeedbackModel.js");
const AlumniStory = require("./Models/AlumniStoryModel.js");
const Mentor = require("./Models/MentorProfiles.js");
const MentorshipRequest = require("./Models/Mentorship/MentorshipRequestModel.js")
const donationRoutes = require("./route/donationRoutes.js");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const multer = require("multer")
const mentorshipRoutes = require("./route/MentorshipRoute/mentorship.js");
const signupRoutes = require("./route/SignupLogin/signup.js");
const  UserTable = require("./route/SignupLogin/SignUpmodel.js");
// SignUpmodel

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// 👇 Add these two lines to increase payload size limit

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));



// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/AlumniDB", {
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

// Commented out MySQL connection
/*
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "allumni",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});
*/


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Donation from allumni
app.post("/alumni/donate", async (req, res) => {
  const { name, email, amount, message, method, transactionId, proofUrl, idUrl } = req.body;

  if (!name || !email || !amount || !transactionId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newDonation = new Donation({
      name,
      email,
      amount,
      message,
      method,
      transactionId,
      proofUrl,
      idUrl,
      date: new Date(),
    });

    await newDonation.save();
    res.status(201).json({ message: "Donation recorded successfully" });
  } catch (err) {
    console.error("Donation error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/trying/signup",  async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const userExists = await UserTable.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserTable({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
})


app.get("/", (req, res) => {
  return res.json("Hello from Backend");
});

// Get all mentorship requests (for admin/testing)
// app.get("/get-requests-by-email", async (req, res) => {
//   const { email } = req.query;
//   try {
//     const requests = await MentorshipRequest.find({ mentorEmail: email });
//     if (!requests || requests.length === 0) {
//       return res.status(404).json({ message: `No mentorship request found for email: ${email}` });
//     }
//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

app.use(mentorshipRoutes);
// MongoDB Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    console.log(req.body);
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });
    console.log(newUser);

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
    res
      .status(500)
      .json({ error: "Failed to create user", details: err.message });
  }
});

// Login Route of DB mongo
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    const isMatch2 = role === user.role;

    if (!isMatch || !isMatch2) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// To create a new allumni profile
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

// To update the profile of allumni if needed
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

// To get the profile of user by the email
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

// To create allumni directory
app.get("/alumni-directory", async (req, res) => {
  try {
    const dir_data = await AlumniProfile.find({}, {
      name: 1,
      email: 1,
      role: 1,
      passingYear: 1,
      location: 1,
      profileImage: 1,
    });
    res.json(dir_data);
  } catch (error) {
    console.error("GET /alumni-directory error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Check if the user is mentor or not
app.get('/is-mentor', async (req, res) => {
  const email = req.query.email;
  const mentor = await Mentor.findOne({ email });

  if (mentor) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});

// Upload all the events
app.post("/upload-event", async (req, res) => {
  try {
    const eventData = {
      title: req.body.title,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      type: req.body.type,
      description: req.body.description,
      link: req.body.link,
    };

    const savedEvent = await Event.create(eventData);
    res
      .status(201)
      .json({ message: "Event created successfully", event: savedEvent });
  } catch (err) {
    console.error("Error creating event:", err.message);
    res
      .status(400)
      .json({ error: "Failed to create event", details: err.message });
  }
});

// View Events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    console.log(events);
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch events", details: err.message });
  }
});

// Job Posting
app.post("/job-posting", async (req, res) => {
  try {
    const jobData = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      jobType: req.body.jobType,
      experience: req.body.experience,
      salary: req.body.salary,
      skills: req.body.skills,
      description: req.body.description,
      applyLink: req.body.applyLink,
      duration: parseInt(req.body.duration),
    };

    const newJob = await JobPost.create(jobData);
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to post job", details: err.message });
  }
});

// GET all active jobs (not expired)
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

//Mentorship
app.post("/mentor/register", async (req, res) => {
  try {
    const { email, name, role, company, expertise, photo, linkedin } = req.body;

    // Check for existing mentor with the same email
    const existingMentor = await MentorProfile.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ error: "Mentor with this email already exists" });
    }

    // Convert expertise to array
    let expertiseArray = [];
    if (typeof expertise === "string") {
      expertiseArray = expertise.split(",").map((e) => e.trim());
    } else if (Array.isArray(expertise)) {
      expertiseArray = expertise.map((e) => String(e).trim());
    }

    const mentorData = new MentorProfile({
      email,
      name,
      role,
      company,
      expertise: expertiseArray,
      photo,
      linkedin,
    });

    const savedMentor = await mentorData.save();
    res.status(201).json({ message: "Mentor profile saved", mentor: savedMentor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save mentor profile", details: error.message });
  }
});

// GET: Mentor by email
app.get("/get-mentors", async (req, res) => {
  try {
    const mentors = await MentorProfile.find(); // fetch all mentors
    res.json(mentors); // send as JSON
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
      status: "pending", // Only block if a pending request exists
    });

    if (existing) {
      return res.status(409).json({ message: "You have already sent a pending request to this mentor" });
    }

    const request = new MentorshipRequest({
      studentEmail,
      mentorEmail,
      message,
    });

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

// Startup Posting
app.post("/startup-zone", async (req, res) => {
  try {
    const { startupName, industry, year } = req.body;
    const savedStartup = await StartupPost.create({
      startupName,
      industry,
      year,
    });
    console.log(savedStartup);
    res.status(201).json({
      message: "Startup Submitted successfully",
      startup: savedStartup,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to save Startup Data",
      details: error.message,
    });
  }
});

// getting Startup
app.get("/get-startups", async (req, res) => {
  try {
    const startups = await StartupPost.find({});
    console.log(startups);
    res.json(startups);
  } catch (err) {
    console.error("Error fetching startups:", err);
    res.status(500).json({ message: "Server error while fetching startups" });
  }
});

// Suggestion Posting
app.post("/post-Suggestions", async (req, res) => {
  try {
    const { title, author, votes, description } = req.body;

    if (!title || !author) {
      return res
        .status(400)
        .json({ message: "Title and author are required." });
    }

    await Suggestion.create({ title, author, votes, description });

    console.log("Youur Feedback Submitted successfully");
    res.status(201).json({
      message: "Feedback Submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting suggestion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetching Suggestions
app.get("/get-post-suggestion", async (req, res) => {
  try {
    const data = await Suggestion.find({});
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error("Error fetching suggestions :", err);
    res
      .status(500)
      .json({ message: "Server error while fetching Suggestions!!" });
  }
});

// Increment Vote Count
app.patch("/suggestions/:id/vote", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // 👈 receive userId

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const suggestion = await Suggestion.findById(id);
    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    // Prevent multiple likes
    if (suggestion.likedBy?.includes(userId)) {
      return res.status(400).json({ message: "" });
    }

    suggestion.votes += 1;
    suggestion.likedBy = [...(suggestion.likedBy || []), userId]; // Add to likedBy list

    await suggestion.save();
    res.status(200).json({ message: "Vote added successfully." });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Alumni Story Submission
app.post("/alumni-story", async (req, res) => {
  const { name, email, title, story } = req.body;
  try {
    const existingStory = await AlumniStory.findOne({ email });

    if (existingStory) {
      return res.status(400).json({ error: "Story already submitted with this email." });
    }

    console.log({ name, email, title, story });
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
    if (existingStory) {
      return res.json({ submitted: true });
    } else {
      return res.json({ submitted: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Error checking submission status." });
  }
});

// displaying data
app.get("/alumni-stories", async (req, res) => {
  try {
    const data = await AlumniStory.find({});
    return res.json({ stories: data });
  } catch (e) {
    res.status(500).json({ error: "Error in accessing data." });
  }
});



app.listen(5000, () => {
  console.log("App is listening on port 5000");
});
