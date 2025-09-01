import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", branch: "", passingYear: "",
    occupation: "", location: "", linkedin: "", github: "",
    about: "", skills: "", profileImage: null, mobile: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

  const uploadToCloudinary = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "alumni_uploads");
    data.append("cloud_name", "deda1j7ca");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/deda1j7ca/image/upload", {
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
      setSubmitError("Please enter a valid 10-digit mobile number (with optional country code)");
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
        graduationYear: formData.passingYear,
        currentJob: formData.occupation,
        location: formData.location,
        linkedIn: formData.linkedin,
        github: formData.github,
        about: formData.about,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        profileImage: imageUrl,
        MobileNum: formData.mobile
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
    <motion.div
      className="profile-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div className="profile-card" whileHover={{ scale: 1.01 }}>
        <h2 className="form-title">Create Alumni Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            {["name", "email", "branch", "passingYear", "occupation", "location", "linkedin"].map((field) => (
              <div className="input-group" key={field}>
                <label>{field[0].toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={["name", "email", "branch", "passingYear"].includes(field)}
                />
              </div>
            ))}

            <div className="input-group full-width">
              <label>Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
              />
            </div>

            <div className="input-group">
              <label>GitHub</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="input-group full-width">
              <label>About You</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="4"
                placeholder="Share something about yourself..."
              />
            </div>

            <div className="input-group full-width">
              <label>Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, Project Management"
              />
            </div>

            <div className="input-group full-width">
              <div className="file-input">
                <input
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                />
                <label htmlFor="profileImage" className="file-label">
                  Upload Profile Photo
                </label>
                {formData.profileImage && (
                  <span className="file-name">{formData.profileImage.name}</span>
                )}
              </div>
            </div>
          </div>

          {submitError && <p style={{ color: "red", textAlign: "center" }}>{submitError}</p>}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Create Profile"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
