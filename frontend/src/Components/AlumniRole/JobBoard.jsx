// import { useEffect, useState } from "react";
// import { FaBriefcase, FaRegNewspaper, FaRocket } from "react-icons/fa";
// import AlumniNavbar from "../AlumniNavbar";

// const JobBoard = () => {
//   const [jobPosts, setJobPosts] = useState([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     company: "",
//     location: "",
//     jobType: "",
//     salary: "",
//     experience: "",
//     skills: "",
//     description: "",
//     applyLink: "",
//     duration: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState("");

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/jobs/active");
//         if (!response.ok) throw new Error("Failed to fetch jobs");
//         const data = await response.json();
//         setJobPosts(data);
//       } catch (err) {
//         console.error("Failed to fetch jobs:", err);
//         setErrorMsg("Failed to load jobs.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newJob = {
//       ...formData,
//       duration: parseInt(formData.duration),
//     };

//     try {
//       const response = await fetch("http://localhost:5000/job-posting", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newJob),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setJobPosts([data.job, ...jobPosts]); // Add to UI
//         setFormData({
//           title: "",
//           company: "",
//           location: "",
//           jobType: "",
//           salary: "",
//           experience: "",
//           skills: "",
//           description: "",
//           applyLink: "",
//           duration: "",
//         });
//       } else {
//         console.error("Failed to post job");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };

//   const activeJobs = jobPosts.filter((job) => {
//     const expiryDate = new Date(job.postedDate);
//     expiryDate.setDate(expiryDate.getDate() + job.duration);
//     return new Date() < expiryDate;
//   });

//   return (
//     <>
//       <AlumniNavbar />
//       <div className="min-h-screen bg-blue-50">
//         {/* Hero Section */}
//         <div className="text-center py-16 bg-blue-600 text-white">
//           <div className="max-w-4xl mx-auto mt-28 px-4">
//             <FaRocket className="text-6xl mb-6 mx-auto animate-pulse" />
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">Job Board</h1>
//             <p className="text-lg md:text-xl opacity-95">
//               Find or share opportunities within the alumni network
//             </p>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 py-12">
//           {/* Post a Job */}
//           <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200 mb-12">
//             <h2 className="text-2xl font-bold flex items-center gap-3 text-blue-800 mb-8">
//               <FaRegNewspaper className="text-blue-600 text-xl" />
//               Post a Job Opening
//             </h2>

//             <form
//               onSubmit={handleSubmit}
//               className="grid grid-cols-1 md:grid-cols-2 gap-6"
//             >
//               <input
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="Job Title"
//                 className={inputClass}
//               />
//               <input
//                 name="company"
//                 value={formData.company}
//                 onChange={handleChange}
//                 placeholder="Company Name"
//                 className={inputClass}
//               />
//               <input
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 placeholder="Location (e.g., Remote)"
//                 className={inputClass}
//               />
//               <select
//                 name="jobType"
//                 value={formData.jobType}
//                 onChange={handleChange}
//                 className={selectClass}
//               >
//                 <option value="">Select Job Type</option>
//                 <option value="Full-time">Full-time</option>
//                 <option value="Part-time">Part-time</option>
//                 <option value="Internship">Internship</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Freelance">Freelance</option>
//               </select>
//               <input
//                 name="salary"
//                 value={formData.salary}
//                 onChange={handleChange}
//                 placeholder="Salary (e.g., ₹6–10 LPA)"
//                 className={inputClass}
//               />
//               <input
//                 name="experience"
//                 value={formData.experience}
//                 onChange={handleChange}
//                 placeholder="Experience (e.g., 1-2 yrs)"
//                 className={inputClass}
//               />
//               <input
//                 name="skills"
//                 value={formData.skills}
//                 onChange={handleChange}
//                 placeholder="Required Skills (comma separated)"
//                 className={`col-span-2 ${inputClass}`}
//               />
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Job Description"
//                 className={`col-span-2 ${inputClass} h-36 resize-none`}
//               />
//               <input
//                 name="applyLink"
//                 value={formData.applyLink}
//                 onChange={handleChange}
//                 placeholder="Application Email or Link"
//                 className={`col-span-2 ${inputClass}`}
//               />
//               <input
//                 name="duration"
//                 type="number"
//                 value={formData.duration}
//                 onChange={handleChange}
//                 placeholder="Show job for (days)"
//                 className={`col-span-2 ${inputClass}`}
//               />
//               <div className="col-span-2 text-right">
//                 <button
//                   type="submit"
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
//                 >
//                   Post Job
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Job Listings */}
//           {loading ? (
//             <div className="text-center text-blue-600 py-10">Loading jobs...</div>
//           ) : activeJobs.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {activeJobs.map((job, index) => (
//                 <div
//                   key={index}
//                   className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
//                 >
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
//                       <FaBriefcase className="text-blue-600 text-xl" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800">
//                         {job.title}
//                       </h3>
//                       <p className="text-sm text-gray-500">{job.company}</p>
//                     </div>
//                   </div>
//                   <ul className="text-sm text-gray-600 space-y-1 mb-3">
//                     <li>
//                       <strong>📍 Location: </strong> {job.location}
//                     </li>
//                     <li>
//                       <strong>💼 Type: </strong> {job.jobType}
//                     </li>
//                     <li>
//                       <strong>🧠 Experience: </strong> {job.experience}
//                     </li>
//                     <li>
//                       <strong>💰 Salary: </strong> {job.salary}
//                     </li>
//                   </ul>
//                   <div className="mb-3">
//                     <p className="text-sm font-medium text-gray-700 mb-1">
//                       🛠 Required Skills: 
//                     </p>
//                     <p className="text-sm text-gray-600">{job.skills}</p>
//                   </div>
//                   <div className="mb-3">
//                     <p className="text-sm font-medium text-gray-700 mb-1">
//                       📝 Description:
//                     </p>
//                     <p className="text-sm text-gray-600 line-clamp-4">
//                       {job.description}
//                     </p>
//                   </div>
//                   <p className="text-xs text-gray-400 mb-4">
//                     🕒 Posted on {new Date(job.postedDate).toDateString()}
//                   </p>
//                   <a
//                     href={job.applyLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
//                   >
//                     Apply Now
//                   </a>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center text-gray-500 py-10">
//               No job postings found.
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default JobBoard;

// // Updated input and select class
// const inputClass =
//   "border border-gray-300 rounded-lg px-5 py-4 text-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
// const selectClass =
//   "border border-gray-300 rounded-lg px-5 py-4 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
import React, { useEffect, useState } from "react";
import AlumniNavbar from "../AlumniNavbar";
import { FaBriefcase, FaRegNewspaper, FaRocket } from "react-icons/fa";

const inputBase =
  "block w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
const selectBase =
  "block w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

const JobBoard = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    salary: "",
    experience: "",
    skills: "",
    description: "",
    applyLink: "",
    duration: "",
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/jobs/active"); // update path as needed
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobPosts(data);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch("/job-posting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
        }),
      });
      if (resp.ok) {
        const { job } = await resp.json();
        setJobPosts((prev) => [job, ...prev]);
        setFormData({
          title: "", company: "", location: "", jobType: "",
          salary: "", experience: "", skills: "",
          description: "", applyLink: "", duration: "",
        });
      } else throw new Error("Post failed");
    } catch {
      console.error("Error posting job");
    }
  };

  const activeJobs = jobPosts.filter((job) => {
    const expiry = new Date(job.postedDate);
    expiry.setDate(expiry.getDate() + job.duration);
    return Date.now() < expiry;
  });

  return (
    <>
      <AlumniNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-2 py-10 font-sans">
        {/* Hero */}
        <section className="max-w-4xl mx-auto mt-20 mb-14 text-center">
          <FaRocket className="text-6xl mb-6 mx-auto text-blue-700 opacity-70 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Job Board
          </h1>
          <p className="text-lg md:text-xl text-slate-300">
            Find or share opportunities within the alumni network
          </p>
        </section>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-10">
          {/* Post a Job */}
          <div className="backdrop-blur bg-white/80 dark:bg-slate-800/70 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-200 mb-6">
              <FaRegNewspaper className="text-blue-700" />
              Post a Job Opening
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Job Title"
                className={inputBase}
                required
              />
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                className={inputBase}
                required
              />
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location (e.g., Remote)"
                className={inputBase}
                required
              />
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className={selectBase}
                required
              >
                <option value="">Job Type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Freelance</option>
              </select>
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Salary (e.g., ₹6–10 LPA)"
                className={inputBase}
              />
              <input
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Experience (e.g., 1‑2 yrs)"
                className={inputBase}
              />
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Required Skills (comma separated)"
                className={`${inputBase} col-span-2`}
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Job Description"
                className={`${inputBase} col-span-2 h-32 resize-none`}
              />
              <input
                name="applyLink"
                value={formData.applyLink}
                onChange={handleChange}
                placeholder="Application Link or Email"
                className={`${inputBase} col-span-2`}
              />
              <input
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Show job for (days)"
                className={`${inputBase} col-span-2`}
              />
              <div className="col-span-2 text-right">
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>

          {/* Job Listings */}
          <div className="mt-10">
            {loading ? (
              <div className="text-center text-white py-10">Loading jobs...</div>
            ) : activeJobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {activeJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow hover:shadow-xl transition flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <FaBriefcase className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {job.title}
                        </h3>
                        <p className="text-xs italic text-slate-500 dark:text-slate-400">
                          {job.company}
                        </p>
                      </div>
                    </div>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 mb-3">
                      <li><strong>📍 Location:</strong> {job.location}</li>
                      <li><strong>💼 Type:</strong> {job.jobType}</li>
                      <li><strong>🧠 Experience:</strong> {job.experience}</li>
                      <li><strong>💰 Salary:</strong> {job.salary}</li>
                    </ul>
                    <div className="mb-3">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                        🛠 Required Skills:
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {job.skills}
                      </p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                        📝 Description:
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4">
                        {job.description}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                      🕒 Posted on {new Date(job.postedDate).toDateString()}
                    </p>
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto bg-blue-700 hover:bg-blue-800 text-white text-center py-2 px-4 rounded-lg font-medium transition"
                    >
                      Apply Now
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-300 py-12">
                <FaRegNewspaper className="text-blue-700 text-4xl mb-4 opacity-60 mx-auto" />
                <p className="text-lg font-medium">No job postings found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobBoard;
