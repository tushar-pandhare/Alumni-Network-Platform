import React, { useEffect, useState } from "react";
import { auth } from "./pages/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin,
  FaGithub, FaBriefcase, FaGraduationCap, FaCode,
} from "react-icons/fa";

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Use Firebase auth to get email — do NOT rely on localStorage('email')
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/profile?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else if (res.status === 404) {
          setError("Profile not set up yet.");
        } else {
          setError("Failed to load profile.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-300" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center px-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/20 max-w-md w-full">
            <FaUser className="text-5xl text-indigo-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              {error === "Profile not set up yet." ? "Profile Not Created" : "Oops!"}
            </h2>
            <p className="text-indigo-200 mb-6 text-sm">{error}</p>
            {error === "Profile not set up yet." && (
              <a
                href="/profile"
                className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full transition"
              >
                Set Up Profile
              </a>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-indigo-400 shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center border-4 border-indigo-400 shadow-lg">
                  <FaUser className="text-white text-5xl" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-extrabold text-white">{profile.name || "—"}</h1>
              <p className="text-indigo-300 font-medium mt-1">{profile.occupation || "No occupation set"}</p>
              <p className="text-indigo-200 text-sm mt-1 flex items-center gap-1 justify-center sm:justify-start">
                <FaMapMarkerAlt className="text-indigo-400" />
                {profile.location || "Location not specified"}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <InfoCard icon={<FaEnvelope />} label="Email" value={profile.email} />
            <InfoCard icon={<FaPhone />} label="Mobile" value={profile.mobile} />
            <InfoCard icon={<FaGraduationCap />} label="Branch" value={profile.branch} />
            <InfoCard icon={<FaGraduationCap />} label="Passing Year" value={profile.passingYear} />
            <InfoCard icon={<FaBriefcase />} label="Occupation" value={profile.occupation} />

            {profile.linkedin && (
              <LinkCard
                icon={<FaLinkedin />}
                label="LinkedIn"
                href={profile.linkedin}
                color="text-blue-400"
              />
            )}
            {profile.github && (
              <LinkCard
                icon={<FaGithub />}
                label="GitHub"
                href={profile.github}
                color="text-slate-300"
              />
            )}
          </div>

          {/* About */}
          {profile.about && (
            <div className="mt-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-3">About</h3>
              <p className="text-slate-200 leading-relaxed">{profile.about}</p>
            </div>
          )}

          {/* Skills */}
          {profile.skills && (
            <div className="mt-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaCode /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(profile.skills)
                  ? profile.skills
                  : profile.skills.split(",")
                ).map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-700/60 text-indigo-200 text-sm rounded-full border border-indigo-500/40"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Edit Button */}
          <div className="mt-6 text-center">
            <a
              href="/profile"
              className="inline-block bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
            >
              Edit Profile
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 flex items-start gap-3">
    <span className="text-indigo-400 mt-0.5 flex-shrink-0">{icon}</span>
    <div>
      <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">{label}</p>
      <p className="text-white font-medium mt-0.5">{value || "—"}</p>
    </div>
  </div>
);

const LinkCard = ({ icon, label, href, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 flex items-center gap-3 hover:bg-white/20 transition group"
  >
    <span className={`${color} text-xl flex-shrink-0`}>{icon}</span>
    <div>
      <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">{label}</p>
      <p className={`${color} font-medium mt-0.5 group-hover:underline truncate max-w-[180px]`}>{href}</p>
    </div>
  </a>
);

export default ProfileView;
