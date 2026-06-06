import { FaComments, FaThumbsUp, FaLightbulb, FaEdit, FaTimes, FaRocket } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AlumniNavbar from '../AlumniNavbar';
import { auth } from "../pages/firebase"; // Adjust path as needed
import { onAuthStateChanged } from "firebase/auth";

// Custom Alert Component
const Alert = ({ message, type = 'error', onClose }) => {
  const backgroundColor = {
    error: '#fee2e2',
    success: '#dcfce7',
    info: '#dbeafe'
  };
  
  const borderColor = {
    error: '#f87171',
    success: '#4ade80',
    info: '#60a5fa'
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px',
      backgroundColor: backgroundColor[type],
      borderLeft: `4px solid ${borderColor[type]}`,
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slideIn 0.3s ease-out',
      zIndex: 1000,
      minWidth: '300px'
    }}>
      <span style={{ color: borderColor[type], fontSize: '20px' }}>
        {type === 'success' ? '✓' : type === 'info' ? 'ℹ' : '⚠'}
      </span>
      <span style={{ color: '#1f2937', fontSize: '14px' }}>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#6b7280',
          cursor: 'pointer',
          marginLeft: 'auto'
        }}
      >
        <FaTimes />
      </button>
      
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

const FeedbackForum = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [author, setAuthor] = useState('');  // renamed from newAuthor for clarity
  const [alert, setAlert] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch suggestions from backend
  const fetchSuggestions = async () => {
    try {
      const response = await axios.get('/get-post-suggestion');
      setSuggestions(response.data);
    } catch (error) {
      showAlert('Error fetching suggestions', 'error');
    }
  };

  // Show alert
  const showAlert = (message, type = 'error') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Fetch logged-in user profile and auto-fill author name
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user profile by email
          const res = await fetch(`/profile?email=${user.email}`);
          if (res.ok) {
            const profile = await res.json();
            if (profile.name) {
              setAuthor(profile.name);
            }
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          showAlert("Failed to load profile data", "error");
        }
      }
      setLoadingProfile(false);
    });

    fetchSuggestions();

    return () => unsubscribe();
  }, []);
  

  // Submit new suggestion
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      showAlert("Title and author are required!", 'error');
      return;
    }

    try {
      await axios.post('/post-Suggestions', {
        title,
        author,
        votes: 0,
        description: desc
      });

      setTitle('');
      setDesc('');
      // Do NOT clear author, since it should remain filled for the user
      fetchSuggestions();
      showAlert('Suggestion submitted successfully!', 'success');
    } catch (error) {
      showAlert('Failed to submit suggestion', 'error');
    }
  };

  // Handle voting on suggestion
  const handleLike = async (id) => {
    const userId = localStorage.getItem("userId") || generateRandomUserId();

    try {
      const response = await axios.patch(`/suggestions/${id}/vote`, {
        userId
      });

      if (response.status === 200) {
        setSuggestions(prev =>
          prev.map(s => s._id === id ? { ...s, votes: s.votes + 1 } : s)
        );
        showAlert('Vote counted successfully!', 'success');
      }
    } catch (err) {
      showAlert(err.response?.data?.message || "Sorry!! You have already voted for this suggestion", 'error');
    }
  };

  const generateRandomUserId = () => {
    const id = "user_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("userId", id);
    return id;
  };

  return (
    <>
      <AlumniNavbar />
      <div className="min-h-screen bg-blue-50">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        {}
        <div className="text-center py-16 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto mt-28 px-4">
            <FaRocket className="text-6xl mb-6 mx-auto animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Feedback Hub</h1>
            <p className="text-lg md:text-xl opacity-95">Your voice matters! Help shape the future of our alumni community.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {}
          <div className="grid lg:grid-cols-2 gap-8">
            {}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-100 p-3 rounded-xl shadow-sm">
                  <FaThumbsUp className="text-3xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-blue-600">
                  Top Suggestions
                </h2>
              </div>

              <div className="space-y-6">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion._id}
                    className="group relative p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all border-l-4 border-blue-500 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {suggestion.title}
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        New
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                      {suggestion.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 font-medium">By {suggestion.author}</p>
                      <div
                        onClick={() => handleLike(suggestion._id)}
                        className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-200 transition"
                      >
                        <FaThumbsUp className="text-blue-600" />
                        <span className="font-medium text-blue-600">{suggestion.votes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-100 p-3 rounded-xl shadow-sm">
                  <FaComments className="text-3xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-blue-600">
                  Suggest an Improvement
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-1  text-gray-600" htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter a title"
                    className="w-full px-4 py-3 text-gray-800 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1  text-gray-600" htmlFor="author">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="author"
                    type="text"
                    placeholder={loadingProfile ? "Loading your name..." : "Your Name"}
                    className="w-full px-4 py-3 text-gray-800 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    // Optional: Uncomment next line to make author read-only
                    // readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1   text-gray-600" htmlFor="desc">
                    Description
                  </label>
                  <textarea
                    id="desc"
                    placeholder="Enter additional details (optional)"
                    className="w-full px-4 py-3 text-gray-800 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                    rows="5"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-3"
                >
                  <FaEdit /> Submit Suggestion
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackForum;

// import { FaComments, FaThumbsUp, FaEdit, FaTimes, FaRocket } from 'react-icons/fa';
// import { useEffect, useState } from 'react';

// // Custom Alert Component
// const Alert = ({ message, type = 'error', onClose }) => {

// const inputBase =

// const FeedbackForum = () => {
//   const [suggestions, setSuggestions] = useState([]);

//   // Fetch suggestions from backend
//   const fetchSuggestions = async () => {

//   // Show alert
//   const showAlert = (message, type = 'error') => {

//   // Fetch logged-in user profile and auto-fill author name
//   useEffect(() => {

//     fetchSuggestions();

//     return () => unsubscribe();
//   }, []);

//   // Submit new suggestion
//   const handleSubmit = async (e) => {

//   // Handle voting on suggestion
//   const handleLike = async (id) => {

//   const generateRandomUserId = () => {
//     const id = "user_" + Math.random().toString(36).substring(2, 15);

//   return (
//     <>

//         <div className="relative z-10 max-w-7xl mx-auto mt-16 grid lg:grid-cols-2 gap-10">
//           {}

//           {}

// export default FeedbackForum;