
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { doc, getDoc } from "firebase/firestore";
// import { auth } from "../pages/firebase";
// import { db } from "../pages/firebase";
// import {
//   FaUsers,
//   FaBuilding,
//   FaBriefcase,
//   FaCalendarAlt,
//   FaLinkedin,
//   FaTwitter,
//   FaInstagram,
// } from "react-icons/fa";
// import AlumniNavbar from "../AlumniNavbar";
// import Navbar from "../Navbar";

// const Homepage = () => {
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const user = auth.currentUser;
//         if (user) {
//           const userDoc = await getDoc(doc(db, "users", user.uid));
//           const userData = userDoc.data();
//           setRole(userData?.role || "student");
//         } else {
//           setRole("student");
//         }
//       } catch (error) {
//         console.error("Error fetching user role:", error);
//         setRole("student");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-200 bg-gradient-to-br from-gray-900 to-gray-800">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
//       {role === "Alumni" ? <AlumniNavbar /> : <Navbar />}

//       {/* Hero Section */}
//       <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700 pt-28">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="container mx-auto px-4 text-center"
//         >
//           <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg mt-28">Reconnect. Grow. Thrive.</h1>
//           <p className="text-xl mb-8 text-gray-300">
//             Your gateway to lifelong connections and professional growth
//           </p>
//           <div className="flex justify-center gap-4">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               className="bg-white px-8 py-3 rounded-full font-semibold hover:shadow-lg text-gray-900"
//             >
//               Start Networking
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               className="border-2 border-white px-8 py-3 rounded-full font-semibold  hover:bg-white  text-white"
//             >
//               Watch Tour
//             </motion.button>
//           </div>
//         </motion.div>
//       </section>

//       {/* Statistics Section */}
//       <section className="py-20 bg-gray-800">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-extrabold text-center mb-12 text-gray-200">
//             Our Global Impact
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <StatCard
//               icon={<FaUsers className="w-12 h-12 text-indigo-400" />}
//               number="50,000+"
//               label="Active Members"
//             />
//             <StatCard
//               icon={<FaBuilding className="w-12 h-12 text-indigo-400" />}
//               number="120+"
//               label="Countries"
//             />
//             <StatCard
//               icon={<FaBriefcase className="w-12 h-12 text-indigo-400" />}
//               number="8,000+"
//               label="Job Placements"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-gray-900">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-extrabold text-center mb-12 text-gray-200">
//             Why Join Our Network?
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <FeatureCard
//               title="Mentorship Programs"
//               description="Connect with industry leaders and alumni mentors"
//               icon={<FaUsers className="w-8 h-8 text-indigo-400" />}
//             />
//             <FeatureCard
//               title="Career Opportunities"
//               description="Access exclusive job postings and internships"
//               icon={<FaBriefcase className="w-8 h-8 text-indigo-400" />}
//             />
//             <FeatureCard
//               title="Networking Events"
//               description="Attend global meetups and virtual conferences"
//               icon={<FaCalendarAlt className="w-8 h-8 text-indigo-400" />}
//             />
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-20 bg-gray-800">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-extrabold text-center mb-12 text-gray-200">Success Stories</h2>
//           <div className="grid md:grid-cols-2 gap-8">
//             <Testimonial
//               quote="This platform transformed my career trajectory through invaluable connections."
//               name="Sarah Johnson"
//               role="Senior Product Manager @ Google"
//               image="https://randomuser.me/api/portraits/women/44.jpg"
//             />
//             <Testimonial
//               quote="Found my co-founder and built a successful startup through alumni connections."
//               name="Michael Chen"
//               role="CEO @ TechStart Inc."
//               image="https://randomuser.me/api/portraits/men/32.jpg"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Events Section */}
//       <section className="py-20 bg-gray-900">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-extrabold text-center mb-12 text-gray-200">Upcoming Events</h2>
//           <div className="grid md:grid-cols-2 gap-8">
//             <EventCard
//               date="March 15, 2024"
//               title="Global Alumni Summit"
//               location="New York City | Virtual"
//               description="Annual gathering of alumni leaders and industry experts"
//               image="https://images.unsplash.com/photo-1527529482837-4698179dc6ce"
//             />
//             <EventCard
//               date="April 22, 2024"
//               title="Tech Innovation Conference"
//               location="San Francisco"
//               description="Emerging technologies and startup showcase"
//               image="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white">
//         <div className="container mx-auto px-4 py-12">
//           <div className="grid md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <h3 className="text-xl font-extrabold mb-4">AlumniConnect</h3>
//               <p className="mb-4 text-gray-400">
//                 Connecting professionals across generations
//               </p>
//               <div className="flex gap-4">
//                 <FaLinkedin className="w-6 h-6 hover:text-indigo-400 cursor-pointer" />
//                 <FaTwitter className="w-6 h-6 hover:text-indigo-400 cursor-pointer" />
//                 <FaInstagram className="w-6 h-6 hover:text-indigo-400 cursor-pointer" />
//               </div>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li className="hover:text-white cursor-pointer">About Us</li>
//                 <li className="hover:text-white cursor-pointer">Careers</li>
//                 <li className="hover:text-white cursor-pointer">Blog</li>
//                 <li className="hover:text-white cursor-pointer">Contact</li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold mb-4 text-gray-200">Resources</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li className="hover:text-white cursor-pointer">Mentorship Program</li>
//                 <li className="hover:text-white cursor-pointer">Career Services</li>
//                 <li className="hover:text-white cursor-pointer">Event Calendar</li>
//                 <li className="hover:text-white cursor-pointer">Knowledge Base</li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold mb-4 text-gray-200">Newsletter</h4>
//               <div className="flex flex-col gap-4">
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-400 text-gray-300"
//                 />
//                 <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-semibold text-white">
//                   Subscribe
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
//             <p>© 2024 AlumniConnect. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // Reusable Components

// const StatCard = ({ icon, number, label }) => (
//   <motion.div
//     whileHover={{ y: -10 }}
//     className="bg-gray-800 p-8 rounded-xl shadow-lg text-center"
//   >
//     <div className=" text-indigo-400 mb-4 flex justify-center">{icon}</div>
//     <h3 className="text-4xl font-extrabold mb-2 text-white">{number}</h3>
//     <p className="text-gray-400">{label}</p>
//   </motion.div>
// );

// const FeatureCard = ({ title, description, icon }) => (
//   <motion.div
//     whileHover={{ y: -5 }}
//     className="bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
//   >
//     <div className=" text-indigo-400 mb-4">{icon}</div>
//     <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
//     <p className="text-gray-400">{description}</p>
//   </motion.div>
// );

// const Testimonial = ({ quote, name, role, image }) => (
//   <div className="bg-gray-800 p-8 rounded-xl shadow-md">
//     <div className="flex items-center mb-4">
//       <img src={image} alt={name} className="w-16 h-16 rounded-full mr-4" />
//       <div>
//         <h4 className="font-semibold text-white">{name}</h4>
//         <p className="text-gray-400 text-sm">{role}</p>
//       </div>
//     </div>
//     <p className="text-gray-300 italic">"{quote}"</p>
//   </div>
// );

// const EventCard = ({ date, title, location, description, image }) => (
//   <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700">
//     <img src={image} alt={title} className="w-full h-48 object-cover" />
//     <div className="p-6">
//       <span className="text-sm text-gray-400">{date}</span>
//       <h4 className="text-xl font-semibold my-2 text-white">{title}</h4>
//       <p className="text-sm text-gray-400 mb-2">{location}</p>
//       <p className="text-gray-300">{description}</p>
//     </div>
//   </div>
// );

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
  //     // <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-200 bg-gradient-to-br from-blue-900 to-blue-800">
  //     //   Loading...
  //     // </div>
  //   );
  // }

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white min-h-screen flex flex-col">
      {role === "Alumni" ? <AlumniNavbar /> : <Navbar />}

      {/* Hero Section */}
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

      {/* Features */}
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

      {/* Footer */}
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