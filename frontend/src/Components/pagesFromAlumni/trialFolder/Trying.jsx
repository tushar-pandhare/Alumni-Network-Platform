import React, { useState } from "react";
import { motion } from "framer-motion";

const Trying = () => {
  const [data, setData] = useState({
    name: "", email: "", phone: "", profilePhoto: null,
    collegeName: "", branch: "", yearOfPassing: "",
    userType: "student", currentOccupation: "", city: "",
    linkedIn: "", github: "", portfolio: "",
    password: "", confirmPassword: "",
  });

  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      const file = files[0];
      if (file && file.size > MAX_IMAGE_SIZE) {
        setSubmitError("Image size should be less than 2MB.");
        return;
      }
      setData({ ...data, profilePhoto: file });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    if (data.password !== data.confirmPassword) {
      setSubmitError("Passwords do not match!");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    for (const key in data) {
      if (key !== "confirmPassword") {
        formData.append(key, data[key]);
      }
    }

    try {
      const response = await fetch("http://localhost:5000/trying/signup", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Signup successful!");
      } else {
        setSubmitError(result.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitError("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-white shadow-xl rounded-xl p-8 max-w-4xl w-full"
        whileHover={{ scale: 1.01 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">Create Your Profile</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "name", placeholder: "Enter Your Name" },
            { name: "email", type: "email", placeholder: "Enter Your Email" },
            { name: "phone", placeholder: "Enter Your Phone Number" },
            { name: "collegeName", placeholder: "Enter Your College Name" },
            { name: "branch", placeholder: "Enter Your Branch" },
            { name: "yearOfPassing", placeholder: "Enter Your Year of Passing" },
            { name: "currentOccupation", placeholder: "Current Occupation" },
            { name: "city", placeholder: "City" },
            { name: "linkedIn", placeholder: "LinkedIn URL" },
            { name: "github", placeholder: "GitHub URL" },
            { name: "portfolio", placeholder: "Portfolio URL" },
            { name: "password", type: "password", placeholder: "Create Password" },
            { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
          ].map(({ name, placeholder, type = "text" }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={data[name]}
              onChange={handleChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required={["name", "email", "phone", "collegeName", "branch", "yearOfPassing", "password", "confirmPassword"].includes(name)}
            />
          ))}

          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-600 mb-1 font-medium">User Type</label>
            <select
              name="userType"
              value={data.userType}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-600 mb-1 font-medium">Profile Photo</label>
            <input
              type="file"
              name="profilePhoto"
              onChange={handleChange}
              accept="image/*"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {data.profilePhoto && (
              <p className="mt-1 text-sm text-green-600">{data.profilePhoto.name}</p>
            )}
          </div>

          {submitError && (
            <div className="col-span-1 md:col-span-2">
              <p className="text-red-600 text-center">{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="col-span-1 md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Trying;
