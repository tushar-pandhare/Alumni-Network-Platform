// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaPaperPlane,
//   FaUserTie,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaHourglassHalf,
//   FaEnvelope,
//   FaUserGraduate,
// } from "react-icons/fa";
// import { auth } from "./pages/firebase";
// import Navbar from "./Navbar";

// const statusStyles = {
//   accepted: "bg-green-100 text-green-700 border border-green-300",
//   rejected: "bg-red-100 text-red-700 border border-red-300",
//   pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
// };

// const statusIcon = {
//   accepted: <FaCheckCircle className="inline-block mr-2 text-green-500" />,
//   rejected: <FaTimesCircle className="inline-block mr-2 text-red-500" />,
//   pending: <FaHourglassHalf className="inline-block mr-2 text-yellow-500" />,
// };

// const StudentMentorshipHub = () => {
//   const [mentors, setMentors] = useState([]);
//   const [studentEmail, setStudentEmail] = useState("");
//   const [sentRequests, setSentRequests] = useState({});
//   const [requestStatusMap, setRequestStatusMap] = useState({});

//   useEffect(() => {
//     if (auth.currentUser) {
//       setStudentEmail(auth.currentUser.email);
//     }
//   }, []);

//   useEffect(() => {
//     if (!studentEmail) return;

//     const fetchData = async () => {
//       const [mentorRes, statusRes] = await Promise.all([
//         axios.get("http://localhost:5000/get-mentors"),
//         axios.get("http://localhost:5000/get-pending-requests", {
//           params: { studentEmail },
//         }),
//       ]);

//       setMentors(mentorRes.data);
//       const { pendingMentorEmails, statusMap } = statusRes.data;
//       const requestMap = {};
//       pendingMentorEmails.forEach((email) => (requestMap[email] = true));

//       setSentRequests(requestMap);
//       setRequestStatusMap(statusMap);
//     };

//     fetchData();
//   }, [studentEmail]);

//   const handleSend = async (mentorEmail) => {
//     try {
//       await axios.post("http://localhost:5000/send-request", {
//         studentEmail,
//         mentorEmail,
//         message: "I’d like to connect for mentorship.",
//       });

//       setSentRequests((prev) => ({ ...prev, [mentorEmail]: true }));
//       setRequestStatusMap((prev) => ({ ...prev, [mentorEmail]: "pending" }));
//       alert("Request sent.");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to send request.");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-blue-50 font-sans">
//         <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 px-4 py-10">
//           {/* Add mt-28 to match EventsPage spacing */}
//           <div className="max-w-6xl w-full mx-auto mt-28">
//             <div className="mb-10 text-center">
//               <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-3 flex items-center justify-center gap-3">
//                 <FaUserGraduate className="text-indigo-300 text-4xl" />
//                 Mentorship Hub
//               </h1>
//               <p className="text-lg text-indigo-200">
//                 Discover mentors and send mentorship requests in style!
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {mentors.map((mentor, idx) => {
//                 const status = requestStatusMap[mentor.email];
//                 return (
//                   <div
//                     key={idx}
//                     className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-indigo-500 hover:scale-[1.02] transition-transform"
//                   >
//                     <div className="flex flex-col items-center mb-4">
//                       <div className="bg-indigo-800/80 rounded-full p-4 mb-2 shadow">
//                         <FaUserTie className="text-indigo-200 text-4xl" />
//                       </div>
//                       <h2 className="text-2xl font-bold text-white mb-1">
//                         {mentor.name}
//                       </h2>
//                       <div className="flex items-center gap-2 mb-1">
//                         <FaEnvelope className="text-indigo-200 text-base" />
//                         <span className="text-indigo-200 text-sm">
//                           {mentor.email}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2 mb-1">
//                         <FaUserTie className="text-indigo-200 text-base" />
//                         <span className="text-indigo-100 text-sm">
//                           {mentor.role} @ {mentor.company}
//                         </span>
//                       </div>
//                       {mentor.specialization && (
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="font-semibold text-indigo-300 text-sm">
//                             Specialization:
//                           </span>
//                           <span className="text-indigo-200 text-sm">
//                             {mentor.specialization}
//                           </span>
//                         </div>
//                       )}
//                       {mentor.experience && (
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="font-semibold text-indigo-300 text-sm">
//                             Experience:
//                           </span>
//                           <span className="text-indigo-200 text-sm">
//                             {mentor.experience} years
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                     <div className="mt-2 w-full flex flex-col items-center">
//                       {status === "accepted" ? (
//                         <div className="flex flex-col items-center">
//                           <div
//                             className={`px-5 py-2 rounded-full font-semibold flex items-center justify-center text-base ${statusStyles[status]}`}
//                           >
//                             {statusIcon[status]}
//                             Request Accepted
//                           </div>
//                           <p className="text-indigo-100 mt-2 text-center">
//                             You can now contact your mentor!
//                           </p>
//                         </div>
//                       ) : status === "rejected" ? (
//                         <div
//                           className={`px-5 py-2 rounded-full font-semibold flex items-center justify-center text-base ${statusStyles[status]}`}
//                         >
//                           {statusIcon[status]}
//                           Request Rejected
//                         </div>
//                       ) : sentRequests[mentor.email] ? (
//                         <div
//                           className={`px-5 py-2 rounded-full font-semibold flex items-center justify-center text-base ${statusStyles["pending"]}`}
//                         >
//                           {statusIcon["pending"]}
//                           Pending Approval
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleSend(mentor.email)}
//                           className="mt-3 px-6 py-2 bg-indigo-700 text-white rounded-full font-bold shadow hover:bg-indigo-800 transition flex items-center justify-center gap-2"
//                         >
//                           <FaPaperPlane /> Send Request
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StudentMentorshipHub;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPaperPlane,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEnvelope,
  FaUserGraduate,
} from "react-icons/fa";
import { auth } from "./pages/firebase";
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
  const [sentRequests, setSentRequests] = useState({});
  const [requestStatusMap, setRequestStatusMap] = useState({});

  useEffect(() => {
    if (auth.currentUser) {
      setStudentEmail(auth.currentUser.email);
    }
  }, []);

  useEffect(() => {
    if (!studentEmail) return;

    const fetchData = async () => {
      const [mentorRes, statusRes] = await Promise.all([
        axios.get("http://localhost:5000/get-mentors"),
        axios.get("http://localhost:5000/get-pending-requests", {
          params: { studentEmail },
        }),
      ]);

      setMentors(mentorRes.data);
      const { pendingMentorEmails, statusMap } = statusRes.data;
      const requestMap = {};
      pendingMentorEmails.forEach((email) => (requestMap[email] = true));

      setSentRequests(requestMap);
      setRequestStatusMap(statusMap);
    };

    fetchData();
  }, [studentEmail]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 font-sans">
        {/* Hero Section */}
        <div className="relative text-center py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-80"></div>
          <div className="relative z-10 max-w-4xl mx-auto mt-28 px-4">
            <FaUserGraduate className="text-6xl mb-6 mx-auto text-indigo-200 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg flex items-center justify-center gap-3">
              Mentorship Hub
            </h1>
            <p className="text-lg md:text-xl opacity-95 font-light text-indigo-100">
              Discover mentors and send mentorship requests in style!
            </p>
          </div>
        </div>
        {/* Mentor Cards */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {mentors.map((mentor, idx) => {
              const status = requestStatusMap[mentor.email];
              return (
                <div
                  key={idx}
                  className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-100 p-8 flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="flex flex-col items-center mb-4">
                    <div className="bg-gradient-to-br from-indigo-700 to-blue-700 rounded-full p-4 mb-2 shadow">
                      <FaUserTie className="text-white text-4xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-indigo-900 mb-1">
                      {mentor.name}
                    </h2>
                    <div className="flex items-center gap-2 mb-1">
                      <FaEnvelope className="text-blue-600 text-base" />
                      <span className="text-indigo-800 text-sm">
                        {mentor.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <FaUserTie className="text-blue-600 text-base" />
                      <span className="text-indigo-700 text-sm">
                        {mentor.role} @ {mentor.company}
                      </span>
                    </div>
                    {mentor.specialization && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-indigo-400 text-sm">
                          Specialization:
                        </span>
                        <span className="text-indigo-700 text-sm">
                          {mentor.specialization}
                        </span>
                      </div>
                    )}
                    {mentor.experience && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-indigo-400 text-sm">
                          Experience:
                        </span>
                        <span className="text-indigo-700 text-sm">
                          {mentor.experience} years
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 w-full flex flex-col items-center">
                    {status === "accepted" ? (
                      <div className="flex flex-col items-center">
                        <div
                          className={`px-5 py-2 rounded-full font-semibold flex items-center justify-center text-base ${statusStyles[status]}`}
                        >
                          {statusIcon[status]}
                          Request Accepted
                        </div>
                        <p className="text-indigo-700 mt-2 text-center">
                          You can now contact your mentor!
                        </p>
                      </div>
                    ) : status === "rejected" ? (
                      <div
                        className={`px-5 py-2 rounded-full font-semibold flex items-center justify-center text-base ${statusStyles[status]}`}
                      >
                        {statusIcon[status]}
                        Request Rejected
                      </div>
                    ) : sentRequests[mentor.email] ? (
                      <div
                        className={`px-5 py-2 rounded-full font-semibold flex items-center justify-center text-base ${statusStyles["pending"]}`}
                      >
                        {statusIcon["pending"]}
                        Pending Approval
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSend(mentor.email)}
                        className="mt-3 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full font-bold shadow hover:scale-105 transition-all flex items-center justify-center gap-2"
                      >
                        <FaPaperPlane /> Send Request
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentMentorshipHub;