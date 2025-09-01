
// import React, { useState, useEffect } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../pages/firebase";
// import axios from "axios";
// import { getCurrentUserDetails } from "../pages/getCurrentUserDetails";
// import AlumniNavbar from "../AlumniNavbar";

// const AlumniStoryForm = () => {
//   const [user] = useAuthState(auth);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     title: "",
//     story: "",
//   });

//   const [isNameEditable, setIsNameEditable] = useState(false);
//   const [alreadySubmitted, setAlreadySubmitted] = useState(false);
//   const [stories, setStories] = useState([]);

//   useEffect(() => {
//     const fetchUserDetailsAndStories = async () => {
//       if (!user) return;

//       try {
//         // Fetch profile data using email
//         const res = await axios.get(
//           `http://localhost:5000/profile?email=${user.email}`
//         );
//         const profile = res.data;

//         setFormData((prev) => ({
//           ...prev,
//           name: profile.name || "",
//           email: profile.email || user.email,
//         }));

//         if (!profile.name) {
//           setIsNameEditable(true);
//         }

//         // Check if already submitted
//         const storyRes = await axios.get(
//           `http://localhost:5000/alumni-story/${user.email}`
//         );
//         if (storyRes.data.submitted) setAlreadySubmitted(true);

//         // Fetch all stories
//         const allStoriesRes = await axios.get(
//           "http://localhost:5000/alumni-stories"
//         );
//         if (allStoriesRes.data.stories) setStories(allStoriesRes.data.stories);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };

//     fetchUserDetailsAndStories();
//   }, [user]);

//   // useEffect(() => {
//   //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
//   //     if (user) {
//   //       try {
//   //         // Fetch user profile by email
//   //         const res = await fetch(
//   //           `http://localhost:5000/profile?email=${user.email}`
//   //         );
//   //         if (res.ok) {
//   //           const profile = await res.json();
//   //           if (profile.name) {
//   //             // setAuthor(profile.name);
//   //           }
//   //         }
//   //       } catch (err) {
//   //         console.error("Error fetching profile:", err);
//   //         showAlert("Failed to load profile data", "error");
//   //       }
//   //     }
//   //     setLoadingProfile(false);
//   //   });

//   //   fetchSuggestions();

//   //   return () => unsubscribe();
//   // }, []);
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newStory = {
//       name: formData.name,
//       email: formData.email,
//       title: formData.title,
//       story: formData.story,
//     };

    

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/alumni-story",
//         newStory
//       );
//       if (response.status === 201) {
//         alert("Story submitted successfully!");
//         setStories([newStory, ...stories]);
//         setFormData({ ...formData, title: "", story: "" });
//         setAlreadySubmitted(true);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to submit story. Please try again.");
//     }
//   };
//   const handleChange = (e) => {
//       setFormData((prev) => ({
//         ...prev,
//         [e.target.name]: e.target.value,
//       }));
//     };

//   return (
//     <>
//       <AlumniNavbar />
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-gray-800">
//         <div className="max-w-4xl mx-auto space-y-14 mt-28">
//           <div className="text-center space-y-3">
//             <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//               Share Your Journey
//             </h2>
//             <p className="text-lg text-gray-600">
//               Inspire others with your unique story of growth and success.
//             </p>
//           </div>
//           {/* {console.log(formData.name)}
//           {console.log(formData.email)} */}

//           {alreadySubmitted ? (
//             <div className="mx-auto max-w-xl bg-gradient-to-br from-emerald-100 to-green-50 border border-green-300 rounded-2xl p-6 shadow-md text-center">
//               <div className="flex justify-center mb-3">
//                 <div className="bg-green-500 text-white p-2 rounded-full animate-bounce">
//                   <svg
//                     className="h-6 w-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </div>
//               </div>
//               <h3 className="text-lg font-semibold text-green-800">
//                 Thank you for sharing your story!
//               </h3>
//               <p className="text-green-700 mt-1">
//                 Your experience is now inspiring others in our community. 🎉
//               </p>
//             </div>
//           ) : (
//             <form
//               onSubmit={handleSubmit}
//               className="bg-white rounded-2xl shadow-xl p-8 space-y-6 max-w-2xl mx-auto"
//             >
//               <div className="grid grid-cols-1 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     readOnly={!isNameEditable}
//                     className={`w-full px-4 py-3 rounded-lg border ${
//                       !isNameEditable
//                         ? "bg-gray-100 border-gray-200"
//                         : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     } transition duration-200`}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     readOnly
//                     className="w-full px-4 py-3 rounded-lg border bg-gray-100 border-gray-200"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Story Title
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     placeholder="Example: My Journey from Classroom to CEO"
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Your Story
//                   </label>
//                   <textarea
//                     name="story"
//                     value={formData.story}
//                     onChange={handleChange}
//                     rows="6"
//                     placeholder="Share your experiences, challenges, and achievements..."
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
//               >
//                 Share Your Story →
//               </button>
//             </form>
//           )}

//           <div className="space-y-6">
//             <h3 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4">
//               Featured Alumni Stories
//             </h3>

//             <div className="grid gap-6">
//               {stories.map((story, index) => (
//                 <div
//                   key={index}
//                   className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-200"
//                 >
//                   <div className="flex items-start space-x-4">
//                     <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full">
//                       {story.name[0]}
//                     </div>
//                     <div>
//                       <h4 className="text-xl font-semibold text-gray-800">
//                         {story.title}
//                       </h4>
//                       <p className="text-sm text-gray-500 mb-2">
//                         {story.name} · {story.email}
//                       </p>
//                       <p className="text-gray-700 whitespace-pre-wrap">
//                         {story.story}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AlumniStoryForm;
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../pages/firebase";
import axios from "axios";
import AlumniNavbar from "../AlumniNavbar";
import { FaFeatherAlt } from "react-icons/fa";

const AlumniStoryForm = () => {
  const [user] = useAuthState(auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    story: "",
  });

  const [isNameEditable, setIsNameEditable] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchUserDetailsAndStories = async () => {
      if (!user) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/profile?email=${user.email}`
        );
        const profile = res.data;

        setFormData((prev) => ({
          ...prev,
          name: profile.name || "",
          email: profile.email || user.email,
        }));

        if (!profile.name) {
          setIsNameEditable(true);
        }

        // Check if already submitted
        const storyRes = await axios.get(
          `http://localhost:5000/alumni-story/${user.email}`
        );
        if (storyRes.data.submitted) setAlreadySubmitted(true);

        // Fetch all stories
        const allStoriesRes = await axios.get(
          "http://localhost:5000/alumni-stories"
        );
        if (allStoriesRes.data.stories) setStories(allStoriesRes.data.stories);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchUserDetailsAndStories();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newStory = {
      name: formData.name,
      email: formData.email,
      title: formData.title,
      story: formData.story,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/alumni-story",
        newStory
      );
      if (response.status === 201) {
        alert("Story submitted successfully!");
        setStories([newStory, ...stories]);
        setFormData({ ...formData, title: "", story: "" });
        setAlreadySubmitted(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit story. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <AlumniNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 px-2 py-10 font-sans relative overflow-x-hidden">
        {/* Top Gradient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-72 bg-gradient-to-br from-blue-400/20 to-indigo-500/10 rounded-full blur-3xl z-0 animate-pulse" />
        <div className="max-w-4xl mx-auto space-y-14 mt-24 relative z-10">
          {/* Hero */}
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-full shadow-lg border border-white/20 mb-4">
              <FaFeatherAlt className="text-4xl text-indigo-300 animate-bounce" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight bg-clip-text  bg-gradient-to-r from-indigo-300 via-blue-300 to-white">
              Share Your Journey
            </h2>
            <p className="text-lg text-slate-200">
              Inspire others with your unique story of growth and success.
            </p>
          </div>

          {/* Form or Thank You */}
          {alreadySubmitted ? (
            <div className="mx-auto max-w-xl backdrop-blur-xl bg-gradient-to-br from-emerald-200/60 to-green-100/40 border border-green-300/40 rounded-2xl p-8 shadow-2xl text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-green-500 text-white p-3 rounded-full animate-bounce">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-green-800">
                Thank you for sharing your story!
              </h3>
              <p className="text-green-700 mt-1">
                Your experience is now inspiring others in our community. 🎉
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-2xl shadow-2xl p-10 space-y-8 max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-indigo-100 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!isNameEditable}
                    className={`w-full px-4 py-3 rounded-lg bg-white/70 text-slate-900 border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-lg font-semibold transition ${
                      !isNameEditable
                        ? "bg-gray-100/70 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-indigo-100 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg bg-gray-100/70 text-gray-500 border-0 shadow cursor-not-allowed text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-indigo-100 mb-2">
                    Story Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Example: My Journey from Classroom to CEO"
                    className="w-full px-4 py-3 rounded-lg bg-white/70 text-slate-900 border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-indigo-100 mb-2">
                    Your Story
                  </label>
                  <textarea
                    name="story"
                    value={formData.story}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Share your experiences, challenges, and achievements..."
                    className="w-full px-4 py-3 rounded-lg bg-white/70 text-slate-900 border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-lg font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 via-blue-600 to-blue-700 hover:from-indigo-600 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.025] shadow-lg hover:shadow-xl tracking-wide text-lg"
              >
                Share Your Story →
              </button>
            </form>
          )}

          {/* Featured Stories */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white border-l-4 border-indigo-400 pl-4 drop-shadow">
              Featured Alumni Stories
            </h3>

            <div className="grid gap-8">
              {stories.map((story, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-2xl hover:scale-[1.015] transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-14 w-14 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-blue-600 text-white font-bold text-2xl rounded-full shadow">
                      {story.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900 mb-1">
                        {story.title}
                      </h4>
                      <p className="text-sm text-indigo-700 mb-2">
                        {story.name} · {story.email}
                      </p>
                      <p className="text-slate-800 whitespace-pre-wrap">
                        {story.story}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {stories.length === 0 && (
                <div className="text-center text-indigo-200 text-lg py-8">
                  No stories yet. Be the first to inspire others!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniStoryForm;