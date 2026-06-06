import React, { useEffect, useState } from "react";
import AlumniNavbar from "../AlumniNavbar";
import { auth } from "../pages/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  FaUserGraduate, FaEnvelopeOpenText, FaCheckCircle, FaTimesCircle,
  FaHourglassHalf, FaHandshake, FaRocket, FaLinkedin, FaPhoneAlt,
  FaEnvelope, FaVideo, FaTimes, FaComments, FaSearch,
} from "react-icons/fa";

const statusStyles = {
  accepted: "bg-green-100 text-green-700 border border-green-300",
  rejected: "bg-red-100 text-red-700 border border-red-300",
  pending:  "bg-yellow-100 text-yellow-700 border border-yellow-300",
};
const statusIcon = {
  accepted: <FaCheckCircle className="inline-block mr-2 text-green-500" />,
  rejected: <FaTimesCircle className="inline-block mr-2 text-red-500" />,
  pending:  <FaHourglassHalf className="inline-block mr-2 text-yellow-500" />,
};

// ── Accept Modal ──────────────────────────────────────────────────────────────
const AcceptModal = ({ request, onConfirm, onClose }) => {
  const [form, setForm] = useState({
    note: "",
    contactPhone: "",
    contactEmail: "",
    meetingLink: "",
  });
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    await onConfirm(request._id, "accepted", form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes className="text-xl" />
        </button>

        <h2 className="text-xl font-bold text-slate-800 mb-1">Accept Mentorship Request</h2>
        <p className="text-sm text-slate-500 mb-6">
          From: <span className="font-medium text-indigo-700">{request.studentEmail}</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Personal note to student (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Welcome! I'm happy to mentor you. Here's what we can work on..."
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              <FaPhoneAlt className="inline mr-1 text-indigo-400" />
              Contact Phone (optional)
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={form.contactPhone}
              onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              <FaEnvelope className="inline mr-1 text-indigo-400" />
              Preferred Contact Email (optional)
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.contactEmail}
              onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              <FaVideo className="inline mr-1 text-indigo-400" />
              Meeting Link — Google Meet / Calendly / Zoom (optional)
            </label>
            <input
              type="url"
              placeholder="https://cal.com/yourname or https://meet.google.com/..."
              value={form.meetingLink}
              onChange={(e) => setForm((p) => ({ ...p, meetingLink: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Accept & Send Info"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const MentorshipHub = () => {
  const [mentorData, setMentorData] = useState({
    name: "", email: "", role: "", company: "",
    expertise: "", photo: "", linkedin: "",
  });
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAlreadyMentor, setIsAlreadyMentor] = useState(false);
  const [checkingMentorStatus, setCheckingMentorStatus] = useState(true);
  const [requests, setRequests] = useState([]);
  const [acceptModal, setAcceptModal] = useState(null); // request object or null
  const [registering, setRegistering] = useState(false);
  const [registerMsg, setRegisterMsg] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { setCheckingMentorStatus(false); return; }
      const email = user.email;
      setMentorData((prev) => ({ ...prev, email }));

      try {
        const profileRes = await fetch(`/profile?email=${email}`);
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setMentorData((prev) => ({
            ...prev,
            name:      profile.name       || "",
            role:      profile.occupation || "",
            company:   profile.college    || "",
            expertise: Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "",
            photo:     profile.profileImage || "",
            linkedin:  profile.linkedin   || "",
          }));
        }

        const mentorCheckRes = await fetch(`/is-mentor?email=${email}`);
        const mentorStatus = await mentorCheckRes.json();
        setIsAlreadyMentor(mentorStatus.exists);

        if (mentorStatus.exists) {
          const reqRes = await fetch(`/get-requests-for-mentor?mentorEmail=${email}`);
          const reqData = await reqRes.json();
          setRequests(reqData.requests || []);
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setCheckingMentorStatus(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch("/get-mentors")
      .then((r) => r.json())
      .then((data) => setMentors(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const registerMentor = async () => {
    setRegistering(true);
    setRegisterMsg("");
    try {
      const res = await fetch("/mentor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...mentorData,
          expertise: mentorData.expertise.split(",").map((e) => e.trim()),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAlreadyMentor(true);
        setRegisterMsg("success");
        // Also update profile
        fetch("/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: mentorData.email,
            name: mentorData.name,
            occupation: mentorData.role,
            linkedin: mentorData.linkedin,
          }),
        });
      } else {
        setRegisterMsg(data.error || "Registration failed.");
      }
    } catch (err) {
      setRegisterMsg("Network error. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus, mentorResponse = null) => {
    try {
      const res = await fetch("/update-request-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: newStatus, mentorResponse }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r._id === requestId
              ? { ...r, status: newStatus, mentorResponse: mentorResponse || r.mentorResponse }
              : r
          )
        );
        setAcceptModal(null);
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredMentors = mentors.filter((m) => {
    const s = `${m.name} ${m.role} ${m.company} ${m.expertise?.join(", ")}`.toLowerCase();
    return s.includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <AlumniNavbar />
      {acceptModal && (
        <AcceptModal
          request={acceptModal}
          onConfirm={handleUpdateStatus}
          onClose={() => setAcceptModal(null)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-2 py-10 font-sans">

        {/* Hero */}
        <div className="max-w-4xl mx-auto mt-20 mb-14 text-center">
          <FaRocket className="text-6xl mb-6 mx-auto text-blue-400 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Mentorship Hub
          </h1>
          <p className="text-lg text-slate-400">
            Connect with students and share your expertise.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

          {/* Find Mentor panel */}
          <div className="backdrop-blur bg-white/10 rounded-xl shadow-lg border border-slate-700 p-8">
            <h2 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
              <FaSearch className="text-blue-400" /> Find a Mentor
            </h2>
            <input
              type="text"
              placeholder="Search by industry, skills, or company"
              className="w-full p-3 border border-slate-600 rounded-lg bg-slate-800/60 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Become a Mentor panel */}
          <div className="backdrop-blur bg-white/10 rounded-xl shadow-lg border border-slate-700 p-8">
            <h2 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
              <FaHandshake className="text-blue-400" /> Become a Mentor
            </h2>
            {checkingMentorStatus ? (
              <p className="text-slate-400">Checking mentor status...</p>
            ) : isAlreadyMentor ? (
              <p className="text-green-400 font-medium flex items-center gap-2">
                <FaCheckCircle /> You are registered as a mentor.
              </p>
            ) : (
              <div className="space-y-2">
                {[
                  { label: "Your Name", name: "name" },
                  { label: "Your Email", name: "email", readOnly: true },
                  { label: "Your Role / Occupation", name: "role" },
                  { label: "Your Company / College", name: "company" },
                  { label: "Expertise (comma separated)", name: "expertise" },
                  { label: "LinkedIn URL", name: "linkedin" },
                  { label: "Photo URL (optional)", name: "photo" },
                ].map(({ label, name, readOnly = false }) => (
                  <input
                    key={name}
                    name={name}
                    value={mentorData[name]}
                    onChange={(e) =>
                      setMentorData((prev) => ({ ...prev, [name]: e.target.value }))
                    }
                    placeholder={label}
                    readOnly={readOnly}
                    className={`w-full p-3 border border-slate-600 rounded-lg bg-slate-800/60 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                  />
                ))}
                {registerMsg === "success" ? (
                  <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                    <FaCheckCircle /> Mentor registration successful!
                  </p>
                ) : registerMsg ? (
                  <p className="text-red-400 text-sm">{registerMsg}</p>
                ) : null}
                <button
                  onClick={registerMentor}
                  disabled={registering}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold mt-2 transition disabled:opacity-60"
                >
                  {registering ? "Registering..." : "Register as Mentor"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Registered Mentors Grid */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="backdrop-blur bg-white/10 rounded-xl shadow-lg border border-slate-700 p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
              <FaComments className="text-blue-400" /> Registered Mentors
            </h2>
            {filteredMentors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FaEnvelopeOpenText className="text-blue-400 text-4xl mb-4 opacity-60" />
                <p className="text-slate-400 font-medium">No mentors found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredMentors.map((mentor) => (
                  <div
                    key={mentor._id}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow hover:shadow-xl transition flex flex-col items-center text-center"
                  >
                    {mentor.photo ? (
                      <img
                        src={mentor.photo}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-blue-400 shadow"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-3">
                        <FaUserGraduate className="text-white text-2xl" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-white">{mentor.name}</h3>
                    <p className="text-xs text-slate-400 italic mb-1">{mentor.role} at {mentor.company}</p>
                    <p className="text-xs text-slate-300 mb-1">{mentor.email}</p>
                    <div className="flex flex-wrap gap-1 justify-center my-2">
                      {mentor.expertise?.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-indigo-700/60 text-indigo-200 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                    {mentor.linkedin && (
                      <a
                        href={mentor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mt-1"
                      >
                        <FaLinkedin /> LinkedIn
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mentorship Requests (received by this mentor) */}
        {isAlreadyMentor && (
          <div className="max-w-7xl mx-auto mt-14 mb-10">
            <div className="backdrop-blur bg-white/10 rounded-xl shadow-lg border border-slate-700 p-8">
              <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <FaHandshake className="text-blue-400" />
                Mentorship Requests You Received
              </h2>
              {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FaEnvelopeOpenText className="text-blue-400 text-4xl mb-4 opacity-60" />
                  <p className="text-slate-400 font-medium">No mentorship requests yet.</p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {requests.map((r) => (
                    <li
                      key={r._id}
                      className="bg-slate-800 border border-slate-700 rounded-xl shadow p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:shadow-xl transition"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <FaUserGraduate className="text-blue-400 text-2xl mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-base font-medium text-white">
                            Student:{" "}
                            <span className="text-blue-300">{r.studentEmail}</span>
                          </div>
                          {r.message && (
                            <div className="text-xs text-slate-400 mt-1">
                              Message: <span className="text-slate-200 italic">"{r.message}"</span>
                            </div>
                          )}
                          {/* Show what was sent when accepted */}
                          {r.status === "accepted" && r.mentorResponse && (
                            <div className="mt-3 p-3 bg-green-900/30 border border-green-700/40 rounded-lg text-xs space-y-1">
                              <p className="text-green-400 font-semibold mb-1">✅ Info you sent to student:</p>
                              {r.mentorResponse.note && (
                                <p className="text-slate-300">📝 {r.mentorResponse.note}</p>
                              )}
                              {r.mentorResponse.contactPhone && (
                                <p className="text-slate-300">📞 {r.mentorResponse.contactPhone}</p>
                              )}
                              {r.mentorResponse.contactEmail && (
                                <p className="text-slate-300">✉️ {r.mentorResponse.contactEmail}</p>
                              )}
                              {r.mentorResponse.meetingLink && (
                                <a
                                  href={r.mentorResponse.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline flex items-center gap-1"
                                >
                                  <FaVideo /> Meeting link
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div
                          className={`px-4 py-1 rounded-full font-medium flex items-center text-sm ${statusStyles[r.status] || "bg-slate-200 text-slate-800"}`}
                        >
                          {statusIcon[r.status]}
                          {r.status
                            ? r.status.charAt(0).toUpperCase() + r.status.slice(1)
                            : "Unknown"}
                        </div>

                        {r.status === "pending" && (
                          <div className="flex gap-2 mt-1">
                            <button
                              className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition"
                              onClick={() => setAcceptModal(r)}
                            >
                              Accept
                            </button>
                            <button
                              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition"
                              onClick={() => handleUpdateStatus(r._id, "rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MentorshipHub;
