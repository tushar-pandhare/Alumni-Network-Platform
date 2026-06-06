import React, { useState, useEffect, useRef } from "react";
import {
  FaHandHoldingHeart, FaHistory, FaGift, FaRegCalendarAlt,
  FaChevronDown, FaUpload, FaCheckCircle, FaTimesCircle,
  FaSpinner, FaRupeeSign, FaShieldAlt, FaMobileAlt, FaCreditCard,
  FaUniversity,
} from "react-icons/fa";
import AlumniNavbar from "../AlumniNavbar";
import { auth } from "../pages/firebase";
import { onAuthStateChanged } from "firebase/auth";

const FUND_OPTIONS = [
  { value: "Scholarship Fund", label: "Scholarship Fund", desc: "Support deserving students" },
  { value: "Research Initiative", label: "Research Initiative", desc: "Fuel groundbreaking research" },
  { value: "Infrastructure Development", label: "Infrastructure Development", desc: "Build better facilities" },
  { value: "Sports & Culture", label: "Sports & Culture", desc: "Nurture talent beyond academics" },
];

const PAYMENT_METHODS = [
  { value: "UPI", label: "UPI", icon: <FaMobileAlt className="text-green-600" /> },
  { value: "Bank Transfer", label: "Bank Transfer", icon: <FaUniversity className="text-blue-600" /> },
  { value: "Card", label: "Debit / Credit Card", icon: <FaCreditCard className="text-purple-600" /> },
];

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const DonationPortal = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    method: "UPI",
    transactionId: "",
    message: "",
    fund: "Scholarship Fund",
  });
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // "success" | "error" | null
  const [errorMsg, setErrorMsg] = useState("");
  const [recentDonations, setRecentDonations] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const fileInputRef = useRef();

  // Prefill name & email from Firebase auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setForm((prev) => ({
          ...prev,
          email: user.email || "",
          name: user.displayName || "",
        }));
        // Try to get full name from profile
        try {
          const res = await fetch(`/profile?email=${encodeURIComponent(user.email)}`);
          if (res.ok) {
            const profile = await res.json();
            if (profile.name) setForm((prev) => ({ ...prev, name: profile.name }));
          }
        } catch (_) {}
      }
    });
    return () => unsub();
  }, []);

  // Fetch recent donations
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch("/donations/recent");
        const data = await res.json();
        if (data.success) setRecentDonations(data.donations);
      } catch (_) {
        setRecentDonations([]);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecent();
  }, [submitStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 2);
    setFiles(selected);
    const previews = selected.map((f) => ({
      name: f.name,
      url: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      type: f.type,
    }));
    setFilePreviews(previews);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = filePreviews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setFilePreviews(newPreviews);
  };

  const handlePresetAmount = (amt) => {
    setForm((prev) => ({ ...prev, amount: String(amt) }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      return "Please enter a valid donation amount.";
    if (!form.method) return "Please select a payment method.";
    if (!form.transactionId.trim())
      return "Transaction ID / UTR number is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      setSubmitStatus("error");
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("amount", form.amount);
      formData.append("method", form.method);
      formData.append("transactionId", form.transactionId);
      formData.append("message", form.message);
      formData.append("fund", form.fund);
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/donations/donate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitStatus("success");
        setForm((prev) => ({
          ...prev,
          amount: "",
          transactionId: "",
          message: "",
          fund: "Scholarship Fund",
          method: "UPI",
        }));
        setFiles([]);
        setFilePreviews([]);
      } else {
        setErrorMsg(data.error || "Submission failed. Please try again.");
        setSubmitStatus("error");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check your connection and try again.");
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AlumniNavbar />
      <div className="relative min-h-screen pb-24 bg-gradient-to-tr from-blue-900 via-indigo-900 to-slate-900 overflow-x-hidden">
        {}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/10 rounded-full blur-3xl top-[-8rem] left-[-10rem] animate-pulse" />
          <div className="absolute w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-500/10 rounded-full blur-3xl bottom-[-8rem] right-[-10rem] animate-pulse" />
        </div>

        {}
        <div className="relative z-10 max-w-4xl mx-auto pt-32 text-center px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-lg rounded-full shadow-lg border border-white/20 mb-6">
            <FaHandHoldingHeart className="text-5xl text-indigo-400 animate-bounce" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
            Give Back to <span className="text-indigo-300">Your Alma Mater</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-4 font-medium">
            Your generosity empowers the next generation of leaders and innovators.
          </p>
          <div className="flex items-center justify-center gap-2 text-indigo-300 text-sm">
            <FaShieldAlt />
            <span>100% secure • Every donation is verified and recorded</span>
          </div>
        </div>

        {}
        <div className="relative z-10 max-w-6xl mx-auto mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 px-4">

          {}
          <div className="backdrop-blur-2xl bg-white/20 border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col">

            {}
            {submitStatus === "success" && (
              <div className="mb-6 flex items-center gap-3 bg-green-500/20 border border-green-400/40 rounded-xl px-5 py-4 text-green-200">
                <FaCheckCircle className="text-green-400 text-xl flex-shrink-0" />
                <div>
                  <p className="font-semibold">Donation submitted successfully!</p>
                  <p className="text-sm opacity-80">Thank you for your contribution. Our team will verify it shortly.</p>
                </div>
              </div>
            )}

            {}
            {submitStatus === "error" && (
              <div className="mb-6 flex items-center gap-3 bg-red-500/20 border border-red-400/40 rounded-xl px-5 py-4 text-red-200">
                <FaTimesCircle className="text-red-400 text-xl flex-shrink-0" />
                <p className="text-sm">{errorMsg}</p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-300 to-blue-400 rounded-xl shadow">
                <FaGift className="text-2xl text-white" />
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Make a Contribution</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 flex-1">
              {}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-indigo-200 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-indigo-200 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none font-medium"
                    required
                  />
                </div>
              </div>

              {}
              <div>
                <label className="block text-xs font-semibold text-indigo-200 mb-2">Quick Amount (₹)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePresetAmount(amt)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition border ${
                        form.amount === String(amt)
                          ? "bg-indigo-500 border-indigo-400 text-white shadow-lg"
                          : "bg-white/20 border-white/30 text-indigo-100 hover:bg-white/30"
                      }`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Or enter custom amount"
                    className="w-full pl-10 pr-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-lg font-semibold"
                    min="1"
                    required
                  />
                </div>
              </div>

              {}
              <div>
                <label className="block text-xs font-semibold text-indigo-200 mb-2">Select Fund *</label>
                <div className="grid grid-cols-2 gap-2">
                  {FUND_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, fund: f.value }))}
                      className={`p-3 rounded-xl text-left text-xs font-semibold transition border ${
                        form.fund === f.value
                          ? "bg-indigo-500/70 border-indigo-400 text-white"
                          : "bg-white/10 border-white/20 text-indigo-100 hover:bg-white/20"
                      }`}
                    >
                      <div className="font-bold">{f.label}</div>
                      <div className="opacity-70 font-normal mt-0.5">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {}
              <div>
                <label className="block text-xs font-semibold text-indigo-200 mb-2">Payment Method *</label>
                <div className="flex gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, method: m.value }))}
                      className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-semibold transition border ${
                        form.method === m.value
                          ? "bg-indigo-500/70 border-indigo-400 text-white"
                          : "bg-white/10 border-white/20 text-indigo-100 hover:bg-white/20"
                      }`}
                    >
                      <span className="text-lg">{m.icon}</span>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {}
              <div>
                <label className="block text-xs font-semibold text-indigo-200 mb-1">
                  Transaction ID / UTR Number *
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={form.transactionId}
                  onChange={handleChange}
                  placeholder="e.g. UPI Ref: 3295871234 or Bank UTR"
                  className="w-full px-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none font-medium"
                  required
                />
              </div>

              {}
              <div>
                <label className="block text-xs font-semibold text-indigo-200 mb-1">Message (optional)</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={2}
                  placeholder="A note for the institution..."
                  className="w-full px-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none font-medium resize-none"
                />
              </div>

              {}
              <div>
                <label className="block text-xs font-semibold text-indigo-200 mb-2">
                  Upload Proof (screenshot / receipt — max 2 files)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-indigo-400/40 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-400 hover:bg-white/10 transition"
                >
                  <FaUpload className="mx-auto text-indigo-400 text-2xl mb-2" />
                  <p className="text-indigo-200 text-sm">
                    {filePreviews.length > 0
                      ? `${filePreviews.length} file(s) selected`
                      : "Click to upload JPG, PNG, WEBP, or PDF"}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {}
                {filePreviews.length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {filePreviews.map((f, i) => (
                      <div key={i} className="relative group">
                        {f.url ? (
                          <img
                            src={f.url}
                            alt={f.name}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-indigo-400/40"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-white/20 flex items-center justify-center text-indigo-200 text-xs font-medium border-2 border-indigo-400/40 p-2 text-center break-all">
                            {f.name}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 text-white text-lg font-bold shadow-lg hover:from-indigo-600 hover:to-blue-800 transition-all duration-150 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
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

            <div className="mt-5 text-center text-indigo-100 text-xs opacity-70">
              100% of your donation goes directly to your selected fund.
            </div>
          </div>

          {}
          <div className="backdrop-blur-2xl bg-white/20 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-300 rounded-xl shadow">
                <FaHistory className="text-2xl text-white" />
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Recent Contributions</h2>
            </div>

            {loadingRecent ? (
              <div className="flex justify-center py-12">
                <FaSpinner className="animate-spin text-indigo-400 text-3xl" />
              </div>
            ) : recentDonations.length === 0 ? (
              <div className="text-center py-12 text-indigo-200 opacity-70">
                <FaHandHoldingHeart className="text-4xl mx-auto mb-4 opacity-50" />
                <p>No donations yet. Be the first to contribute!</p>
              </div>
            ) : (
              <div className="relative pl-8 before:absolute before:left-3 before:top-8 before:h-[calc(100%-32px)] before:w-1 before:bg-gradient-to-b from-indigo-400/30 to-blue-400/10">
                {recentDonations.map((donation, index) => (
                  <div key={index} className="relative mb-8 group">
                    <div className="absolute left-[-9px] top-2 w-5 h-5 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full ring-4 ring-white/40 shadow" />
                    <div className="ml-6 p-5 bg-white/80 rounded-xl border-l-4 border-indigo-400 group-hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-base font-bold text-slate-800">{donation.name}</h3>
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
                          {donation.method}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <FaRegCalendarAlt className="text-indigo-400" />
                        {new Date(donation.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </div>
                      {donation.message && (
                        <p className="text-xs text-slate-500 italic mb-2">"{donation.message}"</p>
                      )}
                      <div className="text-xl font-extrabold text-indigo-600">
                        ₹{parseFloat(donation.amount).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-center text-indigo-100 text-xs opacity-60">
              Thank you for your generous support!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationPortal;
