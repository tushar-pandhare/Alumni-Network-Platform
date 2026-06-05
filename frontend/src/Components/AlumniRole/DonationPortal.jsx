import React, { useState, useEffect } from "react";
import {
  FaHandHoldingHeart,
  FaHistory,
  FaGift,
  FaRegCalendarAlt,
  FaChevronDown,
  FaCheckCircle,
  FaUpload,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import AlumniNavbar from "../AlumniNavbar";
import { auth } from "../pages/firebase";
import { onAuthStateChanged } from "firebase/auth";

const FUND_OPTIONS = [
  "Scholarship Fund",
  "Research Initiative",
  "Infrastructure Development",
  "Sports & Cultural",
  "Library Fund",
];

const PAYMENT_METHODS = ["UPI", "Bank Transfer", "Cheque", "Demand Draft"];

const DonationPortal = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    fund: FUND_OPTIONS[0],
    method: PAYMENT_METHODS[0],
    transactionId: "",
    message: "",
  });

  const [proofFile, setProofFile] = useState(null);   // payment screenshot
  const [idFile, setIdFile] = useState(null);          // ID proof (optional)
  const [proofPreview, setProofPreview] = useState(null);
  const [idPreview, setIdPreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Recent donations from DB
  const [recentDonations, setRecentDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(true);

  // Fetch recent donations from DB on mount
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch("/donations/recent");
        if (res.ok) {
          const data = await res.json();
          if (data.donations) {
            setRecentDonations(
              data.donations.map((d) => ({
                donor: d.name,
                amount: d.amount,
                fund: "Alumni Fund",
                date: new Date(d.createdAt).toISOString().split("T")[0],
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch recent donations:", err);
      } finally {
        setLoadingDonations(false);
      }
    };
    fetchRecent();
  }, []);

  // Pre-fill user info from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email || "");
        setUserName(user.displayName || "");
        setForm((prev) => ({
          ...prev,
          email: user.email || "",
          name: user.displayName || "",
        }));

        // Try to get full name from alumni profile
        try {
          const res = await fetch(`/profile?email=${encodeURIComponent(user.email)}`);
          if (res.ok) {
            const profile = await res.json();
            if (profile.name) {
              setForm((prev) => ({ ...prev, name: profile.name }));
            }
          }
        } catch {
          // Profile not found is fine — user can fill name manually
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      setError("File size must be under 5MB.");
      return;
    }

    if (type === "proof") {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    } else {
      setIdFile(file);
      setIdPreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
      const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.CLOUDINARY_UPLOAD_PRESET;
    data.append("upload_preset", uploadPreset);
    data.append("cloud_name", cloudName);
    data.append("folder", "donations");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    if (!result.secure_url) throw new Error("Cloudinary upload failed");
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.email.trim()) return setError("Email is required.");
    if (!form.amount || parseFloat(form.amount) <= 0) return setError("Please enter a valid donation amount.");
    if (!form.transactionId.trim()) return setError("Transaction ID is required.");
    if (!proofFile) return setError("Please upload a payment proof screenshot.");

    setSubmitting(true);
    try {
      // Upload files to Cloudinary
      const fileUrls = [];
      const proofUrl = await uploadToCloudinary(proofFile);
      fileUrls.push(proofUrl);

      if (idFile) {
        const idUrl = await uploadToCloudinary(idFile);
        fileUrls.push(idUrl);
      }

      // Save to MongoDB via backend
      const payload = {
        name: form.name,
        email: form.email,
        amount: parseFloat(form.amount),
        method: form.method,
        transactionId: form.transactionId,
        message: form.message,
        files: fileUrls,
      };

      const res = await fetch("/donations/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to record donation");
      }

      setSubmitted(true);

      // Add to recent list optimistically
      setRecentDonations((prev) => [
        {
          donor: form.name,
          amount: parseFloat(form.amount),
          fund: form.fund,
          date: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Donation error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm((prev) => ({
      ...prev,
      amount: "",
      transactionId: "",
      message: "",
      fund: FUND_OPTIONS[0],
      method: PAYMENT_METHODS[0],
    }));
    setProofFile(null);
    setIdFile(null);
    setProofPreview(null);
    setIdPreview(null);
    setError("");
  };

  return (
    <>
      <AlumniNavbar />
      <div className="relative min-h-screen pb-24 bg-gradient-to-tr from-blue-900 via-indigo-900 to-slate-900 overflow-x-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/10 rounded-full blur-3xl top-[-8rem] left-[-10rem] animate-pulse" />
          <div className="absolute w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-500/10 rounded-full blur-3xl bottom-[-8rem] right-[-10rem] animate-pulse" />
        </div>

        {/* Hero */}
        <div className="relative z-10 max-w-4xl mx-auto pt-32 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-lg rounded-full shadow-lg border border-white/20 mb-6">
            <FaHandHoldingHeart className="text-5xl text-indigo-400 animate-bounce" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
            Give Back to <span className="text-indigo-300">Your Alma Mater</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-4 font-medium">
            Your generosity empowers the next generation of leaders and innovators.
          </p>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 px-4">

          {/* ── Donation Form ─────────────────────────────────── */}
          <div className="backdrop-blur-2xl bg-white/20 border border-white/20 rounded-3xl shadow-2xl p-10 flex flex-col justify-between min-h-[32rem]">
            {submitted ? (
              /* Success State */
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <FaCheckCircle className="text-green-400 text-6xl mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
                <p className="text-indigo-100 mb-6">
                  Your donation of <strong className="text-white">₹{form.amount}</strong> to{" "}
                  <strong className="text-indigo-300">{form.fund}</strong> has been recorded successfully.
                  Our team will verify your payment and reach out if needed.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 text-white font-bold shadow hover:scale-105 transition"
                >
                  Make Another Donation
                </button>
              </div>
            ) : (
              /* Form */
              <>
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-300 to-blue-400 rounded-xl shadow">
                      <FaGift className="text-2xl text-white" />
                    </span>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Make a Contribution</h2>
                  </div>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-indigo-100 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none font-semibold transition"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-indigo-100 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@email.com"
                        className="w-full px-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none font-semibold transition"
                        required
                      />
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-semibold text-indigo-100 mb-1">Donation Amount (₹) *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-lg">₹</span>
                        <input
                          type="number"
                          name="amount"
                          placeholder="Enter amount"
                          value={form.amount}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-lg font-semibold transition"
                          min="1"
                          required
                        />
                      </div>
                      {/* Quick amounts */}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {[500, 1000, 2500, 5000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, amount: amt.toString() }))}
                            className={`px-3 py-1 rounded-full text-sm font-semibold border transition ${
                              form.amount === amt.toString()
                                ? "bg-indigo-500 text-white border-indigo-400"
                                : "bg-white/20 text-indigo-100 border-indigo-300/40 hover:bg-white/30"
                            }`}
                          >
                            ₹{amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fund */}
                    <div>
                      <label className="block text-sm font-semibold text-indigo-100 mb-1">Select Fund *</label>
                      <div className="relative">
                        <select
                          name="fund"
                          value={form.fund}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-lg font-semibold transition appearance-none"
                        >
                          {FUND_OPTIONS.map((f) => <option key={f}>{f}</option>)}
                        </select>
                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 pointer-events-none" />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-semibold text-indigo-100 mb-1">Payment Method *</label>
                      <div className="relative">
                        <select
                          name="method"
                          value={form.method}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-lg font-semibold transition appearance-none"
                        >
                          {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                        </select>
                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 pointer-events-none" />
                      </div>
                    </div>

                    {/* Transaction ID */}
                    <div>
                      <label className="block text-sm font-semibold text-indigo-100 mb-1">Transaction ID / Reference No. *</label>
                      <input
                        type="text"
                        name="transactionId"
                        value={form.transactionId}
                        onChange={handleChange}
                        placeholder="e.g. UPI123456789"
                        className="w-full px-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none font-semibold transition"
                        required
                      />
                    </div>

                    {/* Payment Proof Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-indigo-100 mb-1">
                        Payment Proof Screenshot * <span className="text-indigo-300 font-normal">(max 5MB)</span>
                      </label>
                      <label className="flex items-center gap-3 w-full px-4 py-3 bg-white/70 text-slate-700 rounded-xl cursor-pointer hover:bg-white/80 transition shadow font-semibold">
                        <FaUpload className="text-indigo-500 text-xl" />
                        <span>{proofFile ? proofFile.name : "Upload screenshot..."}</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "proof")}
                        />
                      </label>
                      {proofPreview && (
                        <img src={proofPreview} alt="Proof preview" className="mt-2 h-24 rounded-lg object-cover shadow" />
                      )}
                    </div>

                    {/* ID Proof (optional) */}
                    <div>
                      <label className="block text-sm font-semibold text-indigo-100 mb-1">
                        ID Proof <span className="text-indigo-300 font-normal">(optional)</span>
                      </label>
                      <label className="flex items-center gap-3 w-full px-4 py-3 bg-white/70 text-slate-700 rounded-xl cursor-pointer hover:bg-white/80 transition shadow font-semibold">
                        <FaUpload className="text-indigo-500 text-xl" />
                        <span>{idFile ? idFile.name : "Upload ID proof..."}</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "id")}
                        />
                      </label>
                      {idPreview && (
                        <img src={idPreview} alt="ID preview" className="mt-2 h-24 rounded-lg object-cover shadow" />
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-indigo-100 mb-1">Message (optional)</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Any message for the institution..."
                        className="w-full px-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none font-semibold transition resize-none"
                      />
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-red-200 text-sm">
                        <FaExclamationCircle className="flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 text-white text-lg font-bold shadow-lg hover:from-indigo-600 hover:to-blue-800 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaHandHoldingHeart />
                          Donate Now
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="mt-6 text-center text-indigo-100 text-sm opacity-70">
                  100% of your donation goes directly to your selected fund.
                </div>
              </>
            )}
          </div>

          {/* ── Recent Donations (from DB) ────────────────────── */}
          <div className="backdrop-blur-2xl bg-white/20 border border-white/20 rounded-3xl shadow-2xl p-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-300 rounded-xl shadow">
                <FaHistory className="text-2xl text-white" />
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Recent Contributions</h2>
            </div>

            {recentDonations.length === 0 ? (
              <div className="text-center text-indigo-200 py-12 opacity-60">
                <FaHandHoldingHeart className="text-4xl mx-auto mb-3" />
                <p>Be the first to donate today!</p>
              </div>
            ) : (
              <div className="relative pl-8 before:absolute before:left-3 before:top-8 before:h-[calc(100%-32px)] before:w-1 before:bg-gradient-to-b from-indigo-400/30 to-blue-400/10">
                {recentDonations.map((donation, index) => (
                  <div key={index} className="relative mb-10 group">
                    <div className="absolute left-[-9px] top-2 w-5 h-5 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full ring-4 ring-white/40 shadow" />
                    <div className="ml-6 p-6 bg-white/80 rounded-xl border-l-4 border-indigo-400 group-hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-slate-800">{donation.donor}</h3>
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {donation.fund}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <FaRegCalendarAlt className="text-indigo-400" />
                        {donation.date}
                      </div>
                      <div className="text-2xl font-extrabold text-indigo-500">
                        ₹{donation.amount?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-center text-indigo-100 text-xs opacity-60">
              Thank you to all our generous donors!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationPortal;
