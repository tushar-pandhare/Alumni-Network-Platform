
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// const Homepage = () => {
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const fetchUserRole = async () => {

//     fetchUserRole();
//   }, []);

//   if (loading) {
//     return (

//   return (
//     <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">

//       {}
//       <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700 pt-28">

//       {}
//       <section className="py-20 bg-gray-800">

//       {}
//       <section className="py-20 bg-gray-900">

//       {}
//       <section className="py-20 bg-gray-800">

//       {}
//       <section className="py-20 bg-gray-900">

//       {}
//       <footer className="bg-gray-800 text-white">

// // Reusable Components

// const StatCard = ({ icon, number, label }) => (
//   <motion.div

// const FeatureCard = ({ title, description, icon }) => (
//   <motion.div

// const Testimonial = ({ quote, name, role, image }) => (
//   <div className="bg-gray-800 p-8 rounded-xl shadow-md">

// const EventCard = ({ date, title, location, description, image }) => (
//   <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700">

// export default Homepage;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../pages/firebase";
import { db } from "../pages/firebase";
import { FaLinkedin, FaTwitter, FaInstagram, FaUsers, FaCalendarAlt, FaBriefcase, FaHandshake, FaBookOpen } from "react-icons/fa";
import AlumniNavbar from "../AlumniNavbar";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <FaUsers className="text-blue-600 text-3xl mb-4" />,
    title: "Networking",
    desc: "Connect with alumni from diverse fields, industries, and locations.",
    link: "/stories",
    cta: "Find Alumni"
  },
  {
    icon: <FaCalendarAlt className="text-purple-600 text-3xl mb-4" />,
    title: "Events",
    desc: "Stay updated on alumni webinars, meetups, and workshops.",
    link: "/events",
    cta: "Explore Events"
  },
  {
    icon: <FaBriefcase className="text-indigo-600 text-3xl mb-4" />,
    title: "Jobs",
    desc: "Access exclusive job opportunities and internships.",
    link: "/jobs",
    cta: "View Jobs"
  },
  {
    icon: <FaHandshake className="text-green-600 text-3xl mb-4" />,
    title: "Mentorship",
    desc: "Find mentors or offer guidance to students and peers.",
    link: "/mentors",
    cta: "Mentorship Hub"
  },
  {
    icon: <FaBookOpen className="text-pink-600 text-3xl mb-4" />,
    title: "Resources",
    desc: "Unlock resources, guides, and alumni success stories.",
    link: "/resources",
    cta: "Browse Resources"
  },
];

const Homepage = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser ;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          setRole(userData?.role || "guest");
        } else {
          setRole("guest");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // if (loading) {
  //   return (

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white min-h-screen flex flex-col">
      {role === "Alumni" ? <AlumniNavbar /> : <Navbar />}

      {}
      <section className="relative flex flex-col items-center justify-center text-center py-32 px-4">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Welcome to the Alumni Network
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-2xl mx-auto font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          Connect, Collaborate, and Celebrate your journey with a vibrant alumni community.
        </motion.p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <button
            onClick={() => navigate("/alumni")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg text-lg transition-all"
          >
            Explore Alumni Network
          </button>
        </motion.div>
      </section>

      {}
      <section className="max-w-7xl mx-auto w-full px-4 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">What Can You Do Here?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-indigo-100 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
            >
              {f.icon}
              <h3 className="text-xl font-semibold mb-2 text-white">{f.title}</h3>
              <p className="text-indigo-100 mb-5">{f.desc}</p>
              <button
                onClick={() => navigate(f.link)}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-2 px-6 rounded-lg font-medium shadow transition-all"
              >
                {f.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {}
      <footer className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 py-8 mt-auto">
        <div className="flex justify-center space-x-6 mb-3">
          <a href="#" className="text-indigo-300 hover:text-white transition">
            <FaLinkedin size={26} />
          </a>
          <a href="#" className="text-indigo-300 hover:text-white transition">
            <FaTwitter size={26} />
          </a>
          <a href="#" className="text-indigo-300 hover:text-white transition">
            <FaInstagram size={26} />
          </a>
        </div>
        <p className="text-center text-indigo-200 text-sm">
          &copy; {new Date().getFullYear()} Alumni Network. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Homepage;