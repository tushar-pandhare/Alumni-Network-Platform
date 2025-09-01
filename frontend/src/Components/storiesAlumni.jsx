// import React, { useState, useEffect } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "./pages/firebase";
// import axios from "axios";
// // import AlumniNavbar from "./AlumniNavbar";
// import Navbar from "./Navbar";

// const TheAlumniStories = () => {
//   const [user] = useAuthState(auth);
//   const [stories, setStories] = useState([]);

//   useEffect(() => {
//     const fetchStories = async () => {
//       if (!user) return;
//       try {
//         const response = await axios.get("http://localhost:5000/alumni-stories");
//         if (response.data.stories) {
//           setStories(response.data.stories);
//         }
//       } catch (error) {
//         console.error("Error fetching stories:", error);
//       }
//     };

//     fetchStories();
//   }, [user]);

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-gray-800">
//         <div className="max-w-4xl mx-auto mt-28 space-y-12">
//           <div className="text-center space-y-3">
//             <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//               Alumni Success Stories
//             </h2>
//             <p className="text-lg text-gray-600">
//               Get inspired by real journeys from our amazing alumni network.
//             </p>
//           </div>

//           <div className="space-y-6">
//             <h3 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4">
//               Featured Alumni Stories
//             </h3>

//             <div className="grid gap-6">
//               {stories.length === 0 ? (
//                 <p className="text-gray-500">No stories submitted yet.</p>
//               ) : (
//                 stories.map((story, index) => (
//                   <div
//                     key={index}
//                     className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-200"
//                   >
//                     <div className="flex items-start space-x-4">
//                       <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full">
//                         {story.name[0]}
//                       </div>
//                       <div>
//                         <h4 className="text-xl font-semibold text-gray-800">
//                           {story.title}
//                         </h4>
//                         <p className="text-sm text-gray-500 mb-2">
//                           {story.name} · {story.email}
//                         </p>
//                         <p className="text-gray-700 whitespace-pre-wrap">
//                           {story.story}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TheAlumniStories;

import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./pages/firebase";
import axios from "axios";
import Navbar from "./Navbar";
import { FaQuoteLeft } from "react-icons/fa";

const TheAlumniStories = () => {
  const [user] = useAuthState(auth);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      if (!user) return;
      try {
        const response = await axios.get("http://localhost:5000/alumni-stories");
        if (response.data.stories) {
          setStories(response.data.stories);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 font-sans">
        {/* Hero Section */}
        <div className="relative text-center py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-80"></div>
          <div className="relative z-10 max-w-3xl mx-auto mt-28 px-4">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-100 to-purple-200">
              Alumni Success Stories
            </h2>
            <p className="text-lg md:text-xl opacity-95 font-light text-indigo-100 mb-3">
              Get inspired by real journeys from our amazing alumni network.
            </p>
          </div>
        </div>

        {/* Stories Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold text-indigo-900 border-l-4 border-blue-600 pl-4 mb-8">
            Featured Alumni Stories
          </h3>
          <div className="grid gap-10">
            {stories.length === 0 ? (
              <p className="text-indigo-400 text-center">No stories submitted yet.</p>
            ) : (
              stories.map((story, index) => (
                <div
                  key={index}
                  className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="flex items-start gap-5">
                    <div className="h-14 w-14 flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-200 text-blue-700 font-extrabold text-2xl rounded-full shadow">
                      {story.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaQuoteLeft className="text-blue-400 text-lg" />
                        <h4 className="text-xl font-semibold text-indigo-900">{story.title}</h4>
                      </div>
                      <p className="text-sm text-indigo-400 mb-2">
                        {story.name} · {story.email}
                      </p>
                      <p className="text-indigo-900 whitespace-pre-wrap">
                        {story.story}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TheAlumniStories;
