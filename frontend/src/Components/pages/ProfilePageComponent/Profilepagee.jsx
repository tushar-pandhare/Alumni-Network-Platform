// import React, { useState, useEffect } from "react";
// import "./ProfilePage.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faEnvelope,
//   faBriefcase,
//   faMapMarker,
//   faLink,
//   faCode,
//   faPhone,
//   faGraduationCap,
//   faCalendar,
//   faUniversity,
//   faGlobe,
//   faPen,
//   faCamera,
// } from "@fortawesome/free-solid-svg-icons";
// import { FaSignOutAlt } from "react-icons/fa";
// import { auth } from "../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";

// const initialFields = {
//   name: "",
//   email: "",
//   college: "",
//   branch: "",
//   passingYear: "",
//   occupation: "",
//   location: "",
//   linkedin: "",
//   github: "",
//   about: "",
//   skills: "",
//   mobile: "",
//   profileImage: "",
// };

// const ProfilePage = () => {
//   const [fields, setFields] = useState(initialFields);
//   const [editMode, setEditMode] = useState(
//     Object.keys(initialFields).reduce(
//       (acc, key) => ({ ...acc, [key]: false }),
//       {}
//     )
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [profileExists, setProfileExists] = useState(false);
//   const [showImageInput, setShowImageInput] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setFields((prev) => ({
//           ...prev,
//           email: user.email || "",
//           name: user.displayName || "",
//         }));

//         try {
//           const res = await fetch(
//             `http://localhost:5000/profile?email=${user.email}`
//           );
//           if (res.ok) {
//             const profile = await res.json();
//             setFields(profile);
//             setProfileExists(true);
//             setEditMode(
//               Object.keys(initialFields).reduce(
//                 (acc, key) => ({ ...acc, [key]: false }),
//                 {}
//               )
//             );
//           } else if (res.status === 404) {
//             setProfileExists(false);
//             setEditMode(
//               Object.keys(initialFields).reduce(
//                 (acc, key) => ({ ...acc, [key]: true }),
//                 {}
//               )
//             );
//           } else {
//             let errorData;
//             try {
//               errorData = await res.json();
//             } catch {
//               errorData = { message: "Invalid response from server" };
//             }
//             setError(errorData.message || "Failed to fetch profile");
//           }
//         } catch (err) {
//           setError("Server error: " + err.message);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleChange = (e, field) => {
//     setFields({ ...fields, [field]: e.target.value });
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const base64Image = reader.result;
//         try {
//           const res = await fetch("http://localhost:5000/profile", {
//             method: profileExists ? "PATCH" : "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ ...fields, profileImage: base64Image }),
//           });

//           if (!res.ok) {
//             alert("Failed to upload image");
//             return;
//           }

//           setFields((prev) => ({ ...prev, profileImage: base64Image }));
//           setProfileExists(true);
//           setShowImageInput(false);
//           alert("Profile image uploaded and saved!");
//         } catch (err) {
//           alert("Error uploading image: " + err.message);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveOrEdit = async (field) => {
//     if (editMode[field]) {
//       const endpoint = "http://localhost:5000/profile";
//       const method = profileExists ? "PATCH" : "POST";

//       try {
//         const res = await fetch(endpoint, {
//           method,
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(fields),
//         });

//         const text = await res.text();
//         let data;
//         try {
//           data = JSON.parse(text);
//         } catch (e) {
//           alert("Failed to save: Invalid JSON response");
//           return;
//         }

//         if (!res.ok) {
//           alert("Failed to save profile: " + (data.message || "Unknown error"));
//           return;
//         }

//         alert("Profile saved successfully!");
//         setEditMode((prev) => ({ ...prev, [field]: false }));
//         setProfileExists(true);
//       } catch (err) {
//         alert("Error saving profile: " + err.message);
//       }
//     } else {
//       setEditMode((prev) => ({ ...prev, [field]: true }));
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       window.location.href = "/login"; // or use navigate("/") if you're using react-router
//     } catch (err) {
//       alert("Error logging out: " + err.message);
//     }
//   };

//   const renderInput = (label, key, type = "text", isTextarea = false, icon) => (
//     <div className="input-group" key={key}>
//       <div className="input-label">
//         <FontAwesomeIcon icon={icon} className="input-icon" />
//         <label>{label}</label>
//       </div>
//       {isTextarea ? (
//         <textarea
//           className="input-field textarea-field"
//           placeholder={`Enter your ${label}`}
//           value={fields[key]}
//           onChange={(e) => handleChange(e, key)}
//           disabled={!editMode[key]}
//         />
//       ) : (
//         <input
//           type={type}
//           className="input-field"
//           placeholder={`Enter your ${label}`}
//           value={fields[key]}
//           onChange={(e) => handleChange(e, key)}
//           disabled={!editMode[key]}
//         />
//       )}
//       <button className="field-button" onClick={() => handleSaveOrEdit(key)}>
//         {editMode[key] ? "Save" : "Edit"}
//         <FontAwesomeIcon icon={faPen} className="button-icon" />
//       </button>
//     </div>
//   );

//   if (loading) return <div>Loading profile...</div>;
//   if (error) return <div className="error-message">{error}</div>;

//   return (
//     <div className="profile-container">
//       <div className="sidebar">
//         <ul>
//           <li className="active">
//             <FontAwesomeIcon icon={faUser} className="sidebar-icon" />
//             <span>Profile</span>
//           </li>
//           <li onClick={logout} className="logout-button">
//             <FaSignOutAlt className="sidebar-icon" />
//             <span>Logout</span>
//           </li>
//         </ul>
//       </div>

//       <div className="profile-main">
//         <div className="profile-header">
//           <div className="profile-image-wrapper">
//             <img
//               src={
//                 fields.profileImage ||
//                 "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
//               }
//               alt="Profile"
//               className="profile-image"
//             />
//             {showImageInput ? (
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="upload-input"
//               />
//             ) : (
//               <button
//                 className="change-image-button"
//                 onClick={() => setShowImageInput(true)}
//               >
//                 <FontAwesomeIcon icon={faCamera} /> Change Image
//               </button>
//             )}
//           </div>

//           <div className="flex items-center justify-center align-middle">
//             <h1 className="text-4xl font-bold text-blue-600">My Profile</h1>
//           </div>
//         </div>

//         <div className="profile-sections">
//           <div className="profile-section">
//             <h2>
//               <FontAwesomeIcon icon={faUser} /> Basic Information
//             </h2>
//             <div className="profile-grid">
//               {renderInput("Full Name", "name", "text", false, faUser)}
//               {renderInput("Email", "email", "email", false, faEnvelope)}
//               {renderInput("Mobile Number", "mobile", "tel", false, faPhone)}
//               {renderInput("Location", "location", "text", false, faMapMarker)}
//             </div>
//           </div>

//           <div className="profile-section">
//             <h2>
//               <FontAwesomeIcon icon={faGraduationCap} /> Education
//             </h2>
//             <div className="profile-grid">
//               {renderInput("College Name", "college", "text", false, faUniversity)}
//               {renderInput("Branch", "branch", "text", false, faCode)}
//               {renderInput("Passing Year", "passingYear", "number", false, faCalendar)}
//             </div>
//           </div>

//           <div className="profile-section">
//             <h2>
//               <FontAwesomeIcon icon={faBriefcase} /> Professional
//             </h2>
//             <div className="profile-grid">
//               {renderInput("Occupation", "occupation", "text", false, faBriefcase)}
//               {renderInput("LinkedIn URL", "linkedin", "url", false, faLink)}
//               {renderInput("GitHub URL", "github", "url", false, faCode)}
//             </div>
//           </div>

//           <div className="profile-section full-width">
//             {renderInput("About Yourself", "about", "text", true, faGlobe)}
//             {renderInput("Skills", "skills", "text", false, faCode)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import { auth } from "../../pages/firebase"; // Make sure this path is correct

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
      // If not immediately available, listen for auth state changes
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
        skills: formData.skills,
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
            {/* Left fields */}
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
                  readOnly // Email is read-only
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
            {/* Right fields */}
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
          {/* About */}
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

      {/* Tailwind styles for premium look */}
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