import React, { useEffect, useState } from "react";
import AlumniNavbar from "../AlumniNavbar";
import { auth } from "../pages/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  FaUserGraduate,
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaHandshake,
  FaComments,
  FaRocket,
  FaLinkedin
} from "react-icons/fa";

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

const MentorshipHub = () => {
  const [mentorData, setMentorData] = useState({
    name: '', email: '', role: '', company: '',
    expertise: '', photo: '', linkedin: ''
  });
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAlreadyMentor, setIsAlreadyMentor] = useState(false);
  const [checkingMentorStatus, setCheckingMentorStatus] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        setMentorData((prev) => ({ ...prev, email }));

        try {
          const profileRes = await fetch(`/profile?email=${email}`);
          if (profileRes.ok) {
            const profile = await profileRes.json();
            setMentorData((prev) => ({
              ...prev,
              name: profile.name || '',
              role: profile.occupation || '',
              company: profile.college || '',
              expertise: profile.skills || '',
              photo: profile.profileImage || '',
              linkedin: profile.linkedin || '',
            }));
          }

          const mentorCheckRes = await fetch(`/is-mentor?email=${email}`);
          const mentorStatus = await mentorCheckRes.json();
          setIsAlreadyMentor(mentorStatus.exists);

          if (mentorStatus.exists) {
            const reqRes = await fetch(`/get-requests-for-mentor?mentorEmail=${email}`);
            const reqData = await reqRes.json();
            setRequests(reqData.requests);
          }

        } catch (err) {
          console.error('Error:', err);
        } finally {
          setCheckingMentorStatus(false);
        }
      } else {
        setCheckingMentorStatus(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await fetch('/get-mentors');
      const data = await res.json();
      setMentors(data);
    } catch (err) {
      console.error('Error fetching mentors:', err);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMentorData((prev) => ({ ...prev, [name]: value }));
  };

  const registerMentor = async () => {
    try {
      const response = await fetch('/mentor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...mentorData,
          expertise: mentorData.expertise.split(',').map(item => item.trim()),
        })
      });

      if (response.ok) {
        alert('Mentor registration successful!');
        setIsAlreadyMentor(true);

        await fetch('/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: mentorData.email,
            name: mentorData.name,
            occupation: mentorData.role,
            college: mentorData.company,
            linkedin: mentorData.linkedin,
            profileImage: mentorData.photo,
            skills: mentorData.expertise
          })
        });

        setMentorData(prev => ({ ...prev, role: '', company: '', expertise: '', photo: '', linkedin: '' }));
        fetchMentors();
      } else {
        alert('Mentor registration failed.');
      }
    } catch (err) {
      console.error('Error registering mentor:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const res = await fetch("/update-request-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: newStatus })
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r._id === requestId ? { ...r, status: newStatus } : r))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredMentors = mentors.filter((mentor) => {
    const searchStr = `${mentor.name} ${mentor.role} ${mentor.company} ${mentor.expertise?.join(', ')}`.toLowerCase();
    return searchStr.includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <AlumniNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-2 py-10 font-sans">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mt-20 mb-14 text-center">
          <FaRocket className="text-6xl mb-6 mx-auto text-blue-700 opacity-70" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Mentorship Hub
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-normal">
            Connect with industry mentors and alumni to elevate your career journey.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Mentor Search */}
          <div className="backdrop-blur bg-white/70 dark:bg-slate-800/70 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">Find a Mentor</h2>
            <input
              type="text"
              placeholder="Search by industry, skills, or company"
              className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white/90 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mentor Registration */}
          <div className="backdrop-blur bg-white/70 dark:bg-slate-800/70 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">Become a Mentor</h2>
            {checkingMentorStatus ? (
              <p className="text-slate-500">Checking mentor status...</p>
            ) : isAlreadyMentor ? (
              <p className="text-green-700 font-medium flex items-center gap-2">
                <FaCheckCircle /> You are registered as a mentor.
              </p>
            ) : (
              <div className="space-y-2">
                {[{ label: 'Your Name', name: 'name' }, { label: 'Your Email', name: 'email', readOnly: true }, { label: 'Your Role / Occupation', name: 'role' }, { label: 'Your Company / College', name: 'company' }, { label: 'Your Expertise (comma separated)', name: 'expertise' }, { label: 'LinkedIn URL', name: 'linkedin' }, { label: 'Photo URL (optional)', name: 'photo' }].map(({ label, name, readOnly = false }) => (
                  <input
                    key={name}
                    name={name}
                    value={mentorData[name]}
                    onChange={handleInputChange}
                    placeholder={label}
                    readOnly={readOnly}
                    className={`w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white/90 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${readOnly ? 'bg-slate-100/80 dark:bg-slate-700/30 cursor-not-allowed' : ''}`}
                  />
                ))}
                <button
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold mt-2 transition"
                  onClick={registerMentor}
                >
                  Register as Mentor
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mentors List */}
        <div className="max-w-7xl mx-auto mt-20">
          <div className="backdrop-blur bg-white/70 dark:bg-slate-800/70 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <FaComments className="text-blue-700 opacity-60" />
              Registered Mentors
            </h2>
            {filteredMentors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FaEnvelopeOpenText className="text-blue-700 text-4xl mb-4 opacity-60" />
                <p className="text-lg text-slate-400 font-medium">
                  No mentors found.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredMentors.map((mentor) => (
                  <div key={mentor._id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg p-6 shadow hover:shadow-xl transition flex flex-col items-center">
                    {mentor.photo && (
                      <img src={mentor.photo} alt={mentor.name} className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-blue-700 shadow" />
                    )}
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{mentor.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-1">{mentor.role} at {mentor.company}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Email:</strong> {mentor.email}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300"><strong>Expertise:</strong> {mentor.expertise.join(', ')}</p>
                    {mentor.linkedin && (
                      <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-700 hover:text-blue-800 text-xs mt-2">
                        <FaLinkedin /> LinkedIn
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Requests Section */}
        <div className="max-w-7xl mx-auto mt-20 mb-10">
          <div className="backdrop-blur bg-white/70 dark:bg-slate-800/70 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FaHandshake className="text-blue-700 opacity-60" />
              Mentorship Requests You Received
            </h2>
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FaEnvelopeOpenText className="text-blue-700 text-4xl mb-4 opacity-60" />
                <p className="text-lg text-slate-400 font-medium">
                  No mentorship requests yet.
                </p>
              </div>
            ) : (
              <ul className="space-y-5">
                {requests.map((r) => (
                  <li
                    key={r._id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg shadow p-5 flex flex-col md:flex-row md:items-center justify-between hover:shadow-xl transition"
                  >
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                      <FaUserGraduate className="text-blue-700 text-2xl opacity-60" />
                      <div>
                        <div className="text-base font-medium text-slate-900 dark:text-slate-200">
                          Student: <span className="text-blue-800 dark:text-blue-300">{r.studentEmail}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <FaEnvelopeOpenText className="inline-block mr-1" />
                          Message: <span className="text-blue-900 dark:text-blue-200">{r.message}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-4 py-1 rounded-full font-medium flex items-center justify-center text-sm ${statusStyles[r.status] || "bg-slate-200 text-slate-800"}`}>
                        {statusIcon[r.status] || null}
                        {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "Unknown"}
                      </div>
                      {r.status === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <button
                            className="px-4 py-1 rounded bg-green-600 hover:bg-green-700 text-white font-medium transition"
                            onClick={() => handleUpdateStatus(r._id, "accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-medium transition"
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
      </div>
    </>
  );
};

export default MentorshipHub;