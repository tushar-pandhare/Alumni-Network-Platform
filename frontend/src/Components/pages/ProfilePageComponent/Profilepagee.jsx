import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import { auth } from "../../pages/firebase"; // Verified path

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", branch: "", passingYear: "",
    occupation: "", location: "", linkedin: "", github: "",
    about: "", skills: "", profileImage: null, mobile: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [previewImg, setPreviewImg] = useState(null);

  // Automatically fill name and email from Firebase Auth
  useEffect(() => {
    if (auth.currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: auth.currentUser.displayName || "",
        email: auth.currentUser.email || ""
      }));
    } else {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setFormData((prev) => ({
            ...prev,
            name: user.displayName || "",
            email: user.email || ""
          }));
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      const file = files[0];
      if (file && file.size > MAX_IMAGE_SIZE) {
        setSubmitError("Image size should be less than 2MB.");
        return;
      }
      setFormData({ ...formData, profileImage: file });
      setPreviewImg(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadToCloudinary = async (image) => {
    const data = new FormData();
    data.append("file", image);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.VITE_CLOUDINARY_UPLOAD_PRESET;
    data.append("upload_preset", uploadPreset);
    data.append("cloud_name", cloudName);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });
      const file = await res.json();
      return file.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const mobileRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setSubmitError("Please enter a valid 10-digit mobile number.");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = "";
      if (formData.profileImage) {
        imageUrl = await uploadToCloudinary(formData.profileImage);
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        branch: formData.branch,
        passingYear: formData.passingYear,
        occupation: formData.occupation,
        location: formData.location,
        linkedin: formData.linkedin,
        github: formData.github,
        about: formData.about,
        skills: formData.skills,
        profileImage: imageUrl,
        mobile: formData.mobile,
      };

      await axios.post("http://localhost:5000/profile", payload);
      if (imageUrl) localStorage.setItem("profileImage", imageUrl);
      navigate("/home");
      alert("Profile submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      setSubmitError(error.response?.data?.error || "Submission failed. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center py-12 px-4">
      <motion.div
        className="w-full max-w-2xl rounded-3xl shadow-2xl border border-indigo-200/30 bg-white/10 backdrop-blur-lg p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {previewImg ? (
              <img
                src={previewImg}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-400 shadow-lg"
              />
            ) : (
              <FaUserCircle className="text-indigo-200 text-[7rem] drop-shadow" />
            )}
            <label htmlFor="profileImage" className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow transition">
              <FaCloudUploadAlt />
              <input
                type="file"
                name="profileImage"
                id="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
          <h2 className="text-2xl font-bold text-white mt-4 mb-1 tracking-tight">Create Alumni Profile</h2>
          <p className="text-indigo-100 text-sm">Showcase your journey and connect with the alumni network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="form-label">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="form-label">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="form-input bg-gray-100 text-gray-400 cursor-not-allowed"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="form-label">Branch*</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="e.g., CSE, ECE"
                />
              </div>
              <div>
                <label className="form-label">Passing Year*</label>
                <input
                  type="text"
                  name="passingYear"
                  value={formData.passingYear}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="e.g., 2024"
                />
              </div>
              <div>
                <label className="form-label">Mobile Number*</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">Current Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="form-label">LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="form-label">GitHub</label>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="form-label">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., React, Node.js"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">About You</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="3"
              className="form-input resize-none"
              placeholder="Tell us about your journey, interests, and goals..."
            />
          </div>

          {submitError && <p className="text-red-500 text-center">{submitError}</p>}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <FaCheckCircle /> Create Profile
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      <style>{`
        .form-label {
          display: block;
          font-weight: 500;
          color: #dbeafe;
          margin-bottom: 0.25rem;
        }
        .form-input {
          width: 100%;
          padding: 0.7rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #a5b4fc;
          background: rgba(255,255,255,0.15);
          color: #fff;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .form-input:focus {
          border-color: #6366f1;
          background: rgba(255,255,255,0.25);
        }
        .profile-card {
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;