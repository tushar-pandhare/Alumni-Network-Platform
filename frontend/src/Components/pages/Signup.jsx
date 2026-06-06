import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase.jsx";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("Student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Firebase auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Save role + name to Firestore (for Firebase-side role lookup)
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullname,
        email,
        role,
        createdAt: new Date(),
      });

      // 3. Also register in MongoDB backend (for profile + JWT auth)
      try {
        await fetch("/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullname, email, password, role }),
        });
        // Non-fatal if backend signup fails — Firebase auth is the source of truth
      } catch (_) {}

      // 4. Send to profile setup page so user fills in their details
      //    Do NOT navigate to /login — Firebase already logged them in
      //    Do NOT navigate to /home — profile is empty, all components will fail
      navigate("/profile");

    } catch (err) {
      const friendlyErrors = {
        "auth/email-already-in-use": "This email is already registered. Please log in instead.",
        "auth/invalid-email":        "Please enter a valid email address.",
        "auth/weak-password":        "Password is too weak. Use at least 6 characters.",
        "auth/network-request-failed": "Network error. Please check your connection.",
      };
      setError(friendlyErrors[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-2xl shadow-lg mb-4">
            <FaUserGraduate className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Join the Network</h2>
          <p className="text-indigo-200 text-sm mt-1">Create your alumni platform account</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 mb-5 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-indigo-200 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full px-4 py-3 bg-white/80 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none font-medium"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-indigo-200 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              className="w-full px-4 py-3 bg-white/80 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-indigo-200 mb-1">Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              className="w-full px-4 py-3 bg-white/80 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-indigo-200 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              className="w-full px-4 py-3 bg-white/80 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none font-medium"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-indigo-200 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "Student", label: "Student", icon: <FaUserGraduate /> },
                { value: "Alumni",  label: "Alumni",  icon: <FaUserTie /> },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition border ${
                    role === opt.value
                      ? "bg-indigo-500 border-indigo-400 text-white shadow-lg"
                      : "bg-white/10 border-white/20 text-indigo-100 hover:bg-white/20"
                  }`}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-indigo-200">
          Already have an account?{" "}
          <a href="/login" className="text-white font-semibold hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
