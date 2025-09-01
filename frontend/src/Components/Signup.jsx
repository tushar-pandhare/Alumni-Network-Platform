import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaUserGraduate } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify({ name: formData.fullname, role: formData.userType }));
      navigate("/login");
    } else {
      const data = await res.json();
      setMessage(data.error || "Signup failed");
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-blue-900 min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Join Our Network
          </h1>
          <p className="text-gray-400">Start your professional journey with us</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 mb-2 block">Full Name</label>
              <div className="flex items-center bg-gray-700 rounded-lg px-4 py-3">
                <FaUser className="text-gray-400 mr-3" />
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full bg-transparent text-white focus:outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 mb-2 block">Email</label>
              <div className="flex items-center bg-gray-700 rounded-lg px-4 py-3">
                <FaEnvelope className="text-gray-400 mr-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent text-white focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 mb-2 block">Password</label>
              <div className="flex items-center bg-gray-700 rounded-lg px-4 py-3">
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent text-white focus:outline-none"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 mb-2 block">Register as</label>
              <div className="flex items-center bg-gray-700 rounded-lg px-4 py-3">
                <FaUserGraduate className="text-gray-400 mr-3" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-transparent text-white focus:outline-none"
                >
                  <option value="student" className="bg-gray-800 text-white">Student</option>
                  <option value="alumni" className="bg-gray-800 text-white">Alumni</option>
                </select>
              </div>
            </div>
          </div>

          {message && (
            <div className="text-red-400 text-sm text-center">{message}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-semibold transition-colors duration-300"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Login Here
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
