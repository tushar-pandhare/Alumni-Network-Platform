// import React, { useEffect, useState } from "react";
// import { FaBriefcase } from "react-icons/fa";
// import Navbar from "./Navbar";

// const JobsPage = () => {
//   const [jobPosts, setJobPosts] = useState([]);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch("/jobs/active");
//         const data = await response.json();
//         setJobPosts(data);
//       } catch (err) {
//         console.error("Failed to fetch jobs:", err);
//       }
//     };

//     fetchJobs();
//   }, []);

//   const activeJobs = jobPosts.filter((job) => {
//     const expiryDate = new Date(job.postedDate);
//     expiryDate.setDate(expiryDate.getDate() + job.duration);
//     return new Date() < expiryDate;
//   });

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6 py-12">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-16 pt-28">
//             <FaBriefcase className="text-6xl text-indigo-400 mx-auto mb-4 drop-shadow-lg" />
//             <h1 className="text-4xl font-extrabold drop-shadow-lg">Available Jobs</h1>
//             <p className="text-gray-300 mt-2 text-lg">
//               Browse active job opportunities from alumni and recruiters.
//             </p>
//           </div>

//           {/* Job Listings */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {activeJobs.map((job, index) => (
//               <div
//                 key={index}
//                 className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-shadow duration-300"
//               >
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="w-12 h-12 bg-indigo-900 rounded-lg flex items-center justify-center">
//                     <FaBriefcase className="text-indigo-400 text-xl" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-200">
//                       {job.title}
//                     </h3>
//                     <p className="text-sm text-gray-400">{job.company}</p>
//                   </div>
//                 </div>
//                 <ul className="text-sm text-gray-300 space-y-1 mb-3">
//                   <li>
//                     <strong>📍 Location:</strong> {job.location}
//                   </li>
//                   <li>
//                     <strong>💼 Type:</strong> {job.jobType}
//                   </li>
//                   <li>
//                     <strong>🧠 Experience:</strong> {job.experience}
//                   </li>
//                   <li>
//                     <strong>💰 Salary:</strong> {job.salary}
//                   </li>
//                 </ul>
//                 <div className="mb-3">
//                   <p className="text-sm font-medium text-gray-200 mb-1">
//                     🛠 Required Skills:
//                   </p>
//                   <p className="text-sm text-gray-300">{job.skills}</p>
//                 </div>
//                 <div className="mb-3">
//                   <p className="text-sm font-medium text-gray-200 mb-1">
//                     📝 Description:
//                   </p>
//                   <p className="text-sm text-gray-300 line-clamp-4">
//                     {job.description}
//                   </p>
//                 </div>
//                 <p className="text-xs text-gray-500 mb-4">
//                   🕒 Posted on {new Date(job.postedDate).toDateString()}
//                 </p>
//                 <a
//                   href={job.applyLink}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
//                 >
//                   Apply Now
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default JobsPage;
import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaUserTie,
  FaBrain,
  FaMoneyBillWave,
  FaTools,
  FaRegFileAlt,
  FaClock
} from "react-icons/fa";
import Navbar from "./Navbar";

const JobsPage = () => {
  const [jobPosts, setJobPosts] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/jobs/active");
        const data = await response.json();
        setJobPosts(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  const activeJobs = jobPosts.filter((job) => {
    const expiryDate = new Date(job.postedDate);
    expiryDate.setDate(expiryDate.getDate() + job.duration);
    return new Date() < expiryDate;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 font-sans">
        {/* Hero Section */}
        <div className="relative text-center py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-80"></div>
          <div className="relative z-10 max-w-4xl mx-auto mt-28 px-4">
            <FaBriefcase className="text-6xl mb-6 mx-auto text-indigo-200 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              Available Jobs
            </h1>
            <p className="text-lg md:text-xl opacity-95 font-light text-indigo-100">
              Browse active job opportunities from alumni and recruiters.
            </p>
          </div>
        </div>

        {/* Job Listings */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {activeJobs.length === 0 ? (
              <div className="col-span-full text-center text-indigo-400 text-xl font-semibold py-16">
                No active jobs at the moment.
              </div>
            ) : (
              activeJobs.map((job, index) => (
                <div
                  key={index}
                  className="relative bg-white/70 backdrop-blur-xl p-7 rounded-3xl shadow-2xl border border-indigo-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 break-words group flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FaBriefcase className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-indigo-900 truncate group-hover:text-blue-700 transition">{job.title}</h3>
                      <p className="text-sm text-indigo-400">{job.company}</p>
                    </div>
                  </div>
                  {/* Job Details */}
                  <ul className="text-sm text-indigo-800 space-y-2 mb-3">
                    <li className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span className="font-medium text-indigo-900">Location:</span>
                      <span>{job.location}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaUserTie className="text-blue-600" />
                      <span className="font-medium text-indigo-900">Type:</span>
                      <span>{job.jobType}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaBrain className="text-blue-600" />
                      <span className="font-medium text-indigo-900">Experience:</span>
                      <span>{job.experience}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-blue-600" />
                      <span className="font-medium text-indigo-900">Salary:</span>
                      <span>{job.salary}</span>
                    </li>
                  </ul>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FaTools className="text-blue-600" />
                      <span className="font-medium text-indigo-900">Required Skills:</span>
                    </div>
                    <p className="text-sm text-indigo-900">{job.skills}</p>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FaRegFileAlt className="text-blue-600" />
                      <span className="font-medium text-indigo-900">Description:</span>
                    </div>
                    <p className="text-sm text-indigo-900 line-clamp-4">
                      {job.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-indigo-400 mb-4">
                    <FaClock />
                    <span>
                      Posted on {new Date(job.postedDate).toDateString()}
                    </span>
                  </div>
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-block text-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-2 px-5 rounded-xl font-semibold shadow-lg transition-all duration-300"
                  >
                    Apply Now
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobsPage;