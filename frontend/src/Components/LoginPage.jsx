  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { motion } from "framer-motion";
  import { FaEnvelope, FaLock, FaUserGraduate } from "react-icons/fa";

  const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "", role: "student" });
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);

    const handleChange = (e) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setUser(data.user);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("role", data.user.role);

        // Navigate based on role
        switch (data.user.role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "alumni":
            navigate("/alumni-home");
            break;
          default:
            navigate("/student-home");
            
        }
      } else {
        setMessage(data.message || "Login failed");
      }

      setFormData({ email: "", password: "", role: "student" });
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
              Welcome Back
            </h1>
            <p className="text-gray-400">Login to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 mb-2 block">Login as</label>
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
                    {/* <option value="admin" className="bg-gray-800 text-white">Admin</option> */}
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
              Login
            </button>
          </form>

          <div className="text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign Up Here
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  export default Login;
