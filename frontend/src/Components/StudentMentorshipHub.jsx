import React, { useEffect, useState } from "react";
import {
  FaPaperPlane,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEnvelope,
  FaUserGraduate,
  FaSearch,
  FaLinkedin,
} from "react-icons/fa";
import { auth } from "./pages/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";

const statusStyles = {
  accepted: "bg-green-100 text-green-700 border border-green-300",
  rejected: "bg-red-100 text-red-700 border border-red-300",
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
};

const statusIcon = {
  accepted: <FaCheckCircle className="inline-block mr-2 text-green-500" />,
  rejected: <FaTimesCircle className="inline-block mr-2 text-red-500" />,
  pending: <FaHourglassHalf className="inline-block mr-2 text-yellow-500" />,
};

const StudentMentorshipHub = () => {
  const [mentors, setMentors] = useState([]);
  const [studentEmail, setStudentEmail] = useState("");
  const [requestStatusMap, setRequestStatusMap] = useState({});
  const [contactMap, setContactMap] = useState({}); // mentorEmail -> { note, contactPhone, contactEmail, meetingLink }
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingTo, setSendingTo] = useState(null);
  const [messageMap, setMessageMap] = useState({});

  // Resolve Firebase user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setStudentEmail(user.email);
    });
    return () => unsubscribe();
  }, []);

  // Fetch mentors + request statuses once we have the student email
  useEffect(() => {
    if (!studentEmail) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Use the MentorshipRoute which returns { pendingMentorEmails, statusMap }
        const [mentorRes, statusRes] = await Promise.all([
          fetch("/get-mentors"),
          fetch(`/get-pending-requests?studentEmail=${encodeURIComponent(studentEmail)}`),
        ]);

        const mentorData = await mentorRes.json();
        setMentors(Array.isArray(mentorData) ? mentorData : []);

        const statusData = await statusRes.json();
        setRequestStatusMap(statusData.statusMap || {});
        setContactMap(statusData.contactMap || {});
      } catch (err) {
        console.error("Error loading mentorship data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentEmail]);

  // FIX: handleSend was missing from the active component
  const handleSend = async (mentorEmail) => {
    const message = messageMap[mentorEmail] || "I'd like to connect for mentorship.";
    setSendingTo(mentorEmail);
    try {
      const res = await fetch("/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentEmail, mentorEmail, message }),
      });

      const data = await res.json();

      if (res.ok) {
        // Optimistically update status to pending
        setRequestStatusMap((prev) => ({ ...prev, [mentorEmail]: "pending" }));
        setMessageMap((prev) => ({ ...prev, [mentorEmail]: "" }));
      } else {
        alert(data.message || "Failed to send request.");
      }
    } catch (err) {
      console.error("Error sending request:", err);
      alert("Network error. Please try again.");
    } finally {
      setSendingTo(null);
    }
  };

  const filteredMentors = mentors.filter((mentor) => {
    const str = `${mentor.name} ${mentor.role} ${mentor.company} ${mentor.expertise?.join(" ")}`.toLowerCase();
    return str.includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 font-sans">
        {/* Hero */}
        <div className="relative text-center py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-90" />
          <div className="relative z-10 max-w-3xl mx-auto mt-10 px-4">
            <FaUserGraduate className="text-6xl mb-6 mx-auto text-indigo-300 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
              Mentorship Hub
            </h1>
            <p className="text-lg md:text-xl text-indigo-200 font-light mb-6">
              Find an experienced mentor and fast-track your career journey.
            </p>
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
              <input
                type="text"
                placeholder="Search by name, skill, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Mentor Cards */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
              <span className="ml-4 text-indigo-200 text-lg">Loading mentors...</span>
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="text-center py-24 text-indigo-300">
              <FaUserGraduate className="text-5xl mb-4 mx-auto opacity-40" />
              <p className="text-xl">No mentors found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMentors.map((mentor) => {
                const status = requestStatusMap[mentor.email];
                const isSending = sendingTo === mentor.email;

                return (
                  <div
                    key={mentor._id}
                    className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 flex flex-col hover:-translate-y-1 hover:shadow-indigo-500/20 transition-all duration-300"
                  >
                    {/* Mentor Avatar */}
                    <div className="flex flex-col items-center mb-5">
                      {mentor.photo ? (
                        <img
                          src={mentor.photo}
                          alt={mentor.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-indigo-400 shadow-lg mb-3"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-3 shadow-lg border-4 border-indigo-400">
                          <FaUserTie className="text-white text-3xl" />
                        </div>
                      )}
                      <h2 className="text-xl font-bold text-white">{mentor.name}</h2>
                      <p className="text-indigo-300 text-sm italic">
                        {mentor.role} @ {mentor.company}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-5 text-sm">
                      <div className="flex items-center gap-2 text-indigo-200">
                        <FaEnvelope className="text-indigo-400 flex-shrink-0" />
                        <span className="truncate">{mentor.email}</span>
                      </div>
                      {mentor.expertise?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {mentor.expertise.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-indigo-700/60 text-indigo-200 text-xs rounded-full border border-indigo-500/40"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      {mentor.linkedin && (
                        <a
                          href={mentor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mt-1 transition"
                        >
                          <FaLinkedin /> LinkedIn Profile
                        </a>
                      )}
                    </div>

                    {/* Action Area */}
                    <div className="mt-auto">
                      {status === "accepted" && (() => {
                        const contact = contactMap[mentor.email] || {};
                        const hasContactInfo = contact.note || contact.contactPhone || contact.contactEmail || contact.meetingLink;
                        return (
                          <div className="flex flex-col gap-2">
                            <div className={`w-full text-center px-4 py-2 rounded-full font-semibold text-sm ${statusStyles.accepted}`}>
                              {statusIcon.accepted} Request Accepted
                            </div>
                            {hasContactInfo ? (
                              <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 text-sm space-y-2 mt-1">
                                <p className="text-green-300 font-semibold text-xs mb-2">🎉 Your mentor shared their contact:</p>
                                {contact.note && (
                                  <p className="text-slate-200 text-xs italic">"{contact.note}"</p>
                                )}
                                {contact.contactPhone && (
                                  <p className="text-indigo-200 text-xs flex items-center gap-2">
                                    📞 <span className="font-medium">{contact.contactPhone}</span>
                                  </p>
                                )}
                                {contact.contactEmail && (
                                  <p className="text-indigo-200 text-xs flex items-center gap-2">
                                    ✉️ <a href={`mailto:${contact.contactEmail}`} className="underline hover:text-white">{contact.contactEmail}</a>
                                  </p>
                                )}
                                {contact.meetingLink && (
                                  <a
                                    href={contact.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs font-medium"
                                  >
                                    🎥 Book a meeting
                                  </a>
                                )}
                              </div>
                            ) : (
                              <p className="text-green-300 text-xs text-center">
                                🎉 You can now contact this mentor directly!
                              </p>
                            )}
                          </div>
                        );
                      })()}

                      {status === "rejected" && (
                        <div className={`w-full text-center px-4 py-2 rounded-full font-semibold text-sm ${statusStyles.rejected}`}>
                          {statusIcon.rejected} Request Rejected
                        </div>
                      )}

                      {status === "pending" && (
                        <div className={`w-full text-center px-4 py-2 rounded-full font-semibold text-sm ${statusStyles.pending}`}>
                          {statusIcon.pending} Pending Approval
                        </div>
                      )}

                      {!status && (
                        <div className="flex flex-col gap-2">
                          <textarea
                            rows={2}
                            placeholder="Optional: add a message..."
                            value={messageMap[mentor.email] || ""}
                            onChange={(e) =>
                              setMessageMap((prev) => ({ ...prev, [mentor.email]: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-indigo-300 border border-indigo-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                          />
                          <button
                            onClick={() => handleSend(mentor.email)}
                            disabled={isSending}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-2 px-4 rounded-full font-bold text-sm shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isSending ? (
                              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></span>
                            ) : (
                              <FaPaperPlane />
                            )}
                            {isSending ? "Sending..." : "Send Request"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentMentorshipHub;
