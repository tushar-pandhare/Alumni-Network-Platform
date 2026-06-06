// import React, { useState, useEffect } from 'react';
// import {

// const StartupZone = () => {
//   const [startups, setStartups] = useState([]);

//   // Fetch startups
//   useEffect(() => {

//   // Filter logic
//   useEffect(() => {

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!startupName || !industry || !year) {
//       setErrorMsg('Please fill out all fields');

//     try {
//       const response = await fetch('/startup-zone', {

//       if (!response.ok) throw new Error('Failed to post data');
//       const newStartup = await response.json();

//       // Defensive: ensure newStartup is an object with the required fields
//       if (newStartup && newStartup.startupName && newStartup.industry && newStartup.year) {

//         // Re-apply the current filters to show the new startup if it matches
//         const lowerSearch = searchTerm.toLowerCase();

//         setFormData({ startupName: '', industry: '', year: '' });
//         setErrorMsg('');

//   // Unique industries for dropdown
//   const industryOptions = ['All', ...new Set(startups.map((s) => s.industry))];

//   return (
//     <>

//         <div className="max-w-7xl mx-auto px-4 py-12">
//           {}

//             {errorMsg && (
//               <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{errorMsg}</div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//               <button
//                 type="submit"

//           {}
//           <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">

//             {}
//             <select

//           {}
//           {loading ? (

// export default StartupZone;
// StartupZone.jsx
import React, { useState, useEffect } from 'react';
import {
  FaRocket,
  FaLightbulb,
  FaCalendarAlt,
  FaRegBuilding,
  FaSearch,
} from 'react-icons/fa';
import { GiSpinningBlades } from 'react-icons/gi';
import AlumniNavbar from '../AlumniNavbar';

const inputBase =
  "block w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-slate-900/60 text-slate-900 dark:text-white border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-lg font-semibold transition";

const StartupZone = () => {
  const [startups, setStartups] = useState([]);
  const [filteredStartups, setFilteredStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    startupName: '',
    industry: '',
    year: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await fetch('/get-startups');
        if (!response.ok) throw new Error('Failed to fetch startups');
        const data = await response.json();
        setStartups(data);
        setFilteredStartups(data);
      } catch (error) {
        console.error(error);
        setErrorMsg('Failed to load startups.');
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = startups.filter(
      (s) =>
        s.startupName?.toLowerCase().includes(lowerSearch) &&
        (industryFilter === 'All' || s.industry === industryFilter)
    );
    setFilteredStartups(filtered);
  }, [searchTerm, industryFilter, startups]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { startupName, industry, year } = formData;

    if (!startupName || !industry || !year) {
      setErrorMsg('Please fill out all fields');
      setSuccessMsg('');
      return;
    }

    try {
      const response = await fetch('/startup-zone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupName, industry, year }),
      });

      if (!response.ok) throw new Error('Failed to post data');
      const data = await response.json();

      // FIX: Server returns { message, startup: {...} } — extract the nested object
      const newStartup = data.startup || data;
      if (!newStartup || !newStartup.startupName) {
        throw new Error('Invalid response from server');
      }

      const updated = [...startups, newStartup];
      setStartups(updated);
      setFormData({ startupName: '', industry: '', year: '' });
      setErrorMsg('');
      setSuccessMsg('Startup registered successfully!');
    } catch (error) {
      console.error(error);
      setSuccessMsg('');
      setErrorMsg('Error posting data. Please try again.');
    }
  };

  const industryOptions = ['All', ...new Set(startups.map((s) => s.industry || 'Other'))];

  return (
    <>
      <AlumniNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 px-2 py-10 font-sans relative overflow-x-hidden">
        {}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/10 rounded-full blur-3xl top-[-8rem] left-[-10rem] animate-pulse" />
          <div className="absolute w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-500/10 rounded-full blur-3xl bottom-[-8rem] right-[-10rem] animate-pulse" />
        </div>

        {}
        <div className="relative z-10 max-w-4xl mx-auto pt-32 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-lg rounded-full shadow-lg border border-white/20 mb-6">
            <FaRocket className="text-5xl text-indigo-400 animate-bounce" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Startup Innovation Hub
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 font-medium">
            Launch Your Vision, Grow Your Business
          </p>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto mt-16">
          {}
          <div className="backdrop-blur-2xl bg-white/20 border border-white/20 rounded-3xl shadow-2xl p-10 mb-14 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <GiSpinningBlades className="text-3xl text-indigo-300" />
              Register New Startup
            </h2>

            {errorMsg && (
              <div className="bg-red-200/70 text-red-900 px-4 py-2 rounded mb-4">{errorMsg}</div>
            )}
            {successMsg && (
              <div className="bg-green-200/70 text-green-900 px-4 py-2 rounded mb-4">{successMsg}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  type="text"
                  name="startupName"
                  value={formData.startupName}
                  onChange={handleChange}
                  placeholder="Startup Name"
                  className={inputBase}
                />
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Industry"
                  className={inputBase}
                />
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Founded Year"
                  min="1900"
                  max={new Date().getFullYear()}
                  className={inputBase}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-br from-indigo-500 to-blue-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition hover:scale-105"
              >
                <FaRocket />
                Launch Startup
              </button>
            </form>
          </div>

          {}
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4 max-w-3xl mx-auto">
            <div className="flex items-center w-full md:w-1/2 bg-white/70 shadow-sm px-4 rounded-lg">
              <FaSearch className="text-indigo-300 mr-2" />
              <input
                type="text"
                placeholder="Search startup name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 bg-transparent text-slate-900 placeholder-indigo-300 text-lg focus:outline-none"
              />
            </div>

            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-4 py-3 rounded-lg shadow-sm bg-white/70 text-lg font-semibold"
            >
              {industryOptions.map((ind, i) => (
                <option key={i} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {}
          {loading ? (
            <div className="text-center text-indigo-200 py-10 text-xl">Loading startups...</div>
          ) : filteredStartups.length > 0 ? (
            <div className="backdrop-blur-2xl bg-white/20 border border-white/20 rounded-3xl shadow-2xl p-10 max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-2">
                <FaRegBuilding className="text-2xl text-indigo-300" />
                Registered Startups
              </h3>
              <div className="grid grid-cols-1 gap-8">
                {filteredStartups.map((s, idx) => (
                  <div
                    key={s._id || idx}
                    className="group border-l-4 border-indigo-200 hover:border-indigo-400 transition-all p-8 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow hover:shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-2">{s.startupName || 'Unnamed Startup'}</h4>
                      <div className="flex flex-wrap items-center gap-6 text-indigo-700">
                        <div className="flex items-center gap-2">
                          <FaRegBuilding className="text-indigo-400" />
                          <span>{s.industry || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-indigo-400" />
                          <span>Founded: {s.year || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-8 opacity-80 group-hover:opacity-100 transition">
                      <button className="text-indigo-600 hover:text-indigo-800 px-4 py-2 rounded-md flex items-center gap-2 bg-indigo-100/60 hover:bg-indigo-200/70 font-semibold shadow-md transition">
                        <FaLightbulb />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-indigo-200 py-10 text-lg">No matching startups found.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default StartupZone;
