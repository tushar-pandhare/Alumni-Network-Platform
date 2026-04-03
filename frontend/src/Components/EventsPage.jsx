import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaSearch,
  FaLaptop,
  FaUsers,
  FaChalkboardTeacher,
  FaBookOpen,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const typeIcons = {
  Webinar: <FaLaptop className="text-white" />,
  Meetup: <FaUsers className="text-white" />,
  Workshop: <FaChalkboardTeacher className="text-white" />,
  Seminar: <FaBookOpen className="text-white" />,
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/events");
        const data = await res.json();
        if (res.ok) {
          setEvents(data);
        } else {
          console.error("Error:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchType = filterType === "All" || event.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 font-sans">
        {/* Hero Section */}
        <div className="relative text-center py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-80"></div>
          <div className="relative z-10 max-w-4xl mx-auto mt-28 px-4">
            <FaCalendarAlt className="text-6xl mb-6 mx-auto text-blue-200 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              Explore Events
            </h1>
            <p className="text-lg md:text-xl opacity-95 font-light text-indigo-100">
              Discover webinars, meetups, and workshops hosted by alumni and students.
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div className="relative w-full md:w-1/2">
              <FaSearch className="absolute top-3 left-3 text-indigo-300" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-indigo-100 bg-white/80 text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full md:w-48 py-3 px-4 border border-indigo-100 bg-white/80 text-gray-800 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="All">All Types</option>
              <option value="Webinar">Webinar</option>
              <option value="Meetup">Meetup</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>

          {/* Events List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEvents.length === 0 ? (
              <div className="text-center text-indigo-400 col-span-full py-10 font-semibold text-xl">
                No events found.
              </div>
            ) : (
              filteredEvents.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="relative bg-white/70 backdrop-blur-xl p-7 rounded-3xl shadow-2xl border border-indigo-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 break-words group"
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      {typeIcons[event.type] || <FaCalendarAlt className="text-white text-2xl" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-indigo-900 truncate group-hover:text-blue-700 transition">{event.title}</h3>
                      <p className="text-sm text-indigo-400 italic">{event.type}</p>
                    </div>
                  </div>
              
                  {/* Event Details */}
                  <ul className="text-sm text-indigo-800 space-y-1 mb-3">
                    <li className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600" />
                      <span>{event.date}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaClock className="text-blue-600" />
                      <span>{event.time}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span>{event.location}</span>
                    </li>
                  </ul>
              
                  {/* Description */}
                  <p className="text-indigo-900 text-sm mb-5">{event.description}</p>
              
                  {/* Join Button */}
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-2 px-5 rounded-xl font-semibold shadow-lg transition-all duration-300"
                    >
                      🔗 Join Event
                    </a>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;
