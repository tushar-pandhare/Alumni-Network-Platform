import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaPlusCircle, FaLink } from "react-icons/fa";
import { useState, useEffect } from "react";
import AlumniNavbar from "../AlumniNavbar";

const inputBase =
  "block w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
const labelBase =
  "absolute left-3 top-2.5 text-slate-500 dark:text-slate-400 text-sm pointer-events-none transition-all duration-200";
const labelActive =
  "text-xs -top-2 left-2 bg-white/80 dark:bg-slate-900/60 px-1";

function FloatingInput({ label, ...props }) {
  const [focus, setFocus] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        className={`${inputBase} peer`}
        onFocus={() => setFocus(true)}
        onBlur={(e) => setFocus(e.target.value !== "" || false)}
      />
      <label
        className={`${labelBase} ${focus || props.value ? labelActive : ""}`}
      >
        {label}
      </label>
    </div>
  );
}

const EventsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    type: "",
    description: "",
    link: "",
  });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        showAlert("Error fetching events", "error");
      }
    };

    fetchEvents();
  }, []);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isPastDate = (inputDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(inputDate);
    return date < today;
  };

  const isValidLocation = (location) => location.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPastDate(formData.date)) {
      showAlert("Please enter a future date for the event", "error");
      return;
    }
    if (!isValidLocation(formData.location)) {
      showAlert("Please enter a valid location", "error");
      return;
    }

    try {
      const res = await fetch("/upload-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert("Event submitted successfully!", "success");
        setEvents((prev) => [...prev, data.event]);
        setFormData({
          title: "",
          date: "",
          time: "",
          location: "",
          type: "",
          description: "",
          link: "",
        });
      } else {
        showAlert(data.error || "Failed to submit event", "error");
      }
    } catch (error) {
      showAlert("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <>
    <AlumniNavbar />
      {/* Alert */}
      {alert && (
        <div
          className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all
            ${alert.type === "success" ? "bg-green-600/95" : "bg-red-600/95"}
          `}
        >
          {alert.message}
        </div>
      )}

      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <FaCalendarAlt className="text-[6rem] text-blue-700 opacity-10 mx-auto" />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-2 py-10 font-sans overflow-x-hidden pt-40">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto mb-14 text-center relative">
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow">
              Alumni Events Calendar
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-normal mb-4">
              Discover and join upcoming alumni events, or create your own!
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Create Event */}
          <aside className="md:col-span-1">
            <div className="backdrop-blur bg-white/80 dark:bg-slate-800/70 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 sticky top-32">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <FaPlusCircle className="text-blue-700" />
                Create New Event
              </h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <FloatingInput
                  label="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength="100"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingInput
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                  <FloatingInput
                    label="Time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    maxLength="50"
                    required
                  />
                </div>
                <FloatingInput
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  maxLength="200"
                  required
                />
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`${inputBase} appearance-none`}
                    required
                  >
                    <option value="">Event Type</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Conference">Conference</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                  <span className="absolute right-3 top-4 text-slate-400 pointer-events-none">
                    ▼
                  </span>
                </div>
                {(formData.type === "Webinar" ||
                  formData.location.toLowerCase() === "virtual") && (
                  <FloatingInput
                    label="Online Event Link"
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    maxLength="500"
                    pattern="https?://.+"
                    required
                  />
                )}
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder=" "
                    className={`${inputBase} h-32 resize-none`}
                    maxLength="1000"
                    required
                  />
                  <label className={`${labelBase} ${formData.description ? labelActive : ""}`}>
                    Event Description
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition"
                >
                  Submit Event
                </button>
              </form>
            </div>
          </aside>

          {/* Upcoming Events */}
          <main className="md:col-span-2">
            <div className="backdrop-blur bg-white/80 dark:bg-slate-800/70 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <FaCalendarAlt className="text-blue-700" />
                Upcoming Events
              </h2>
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <FaClock className="text-blue-700 text-4xl mb-4 opacity-60" />
                  <p className="text-lg text-slate-400 font-medium">
                    No upcoming events found.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-7">
                  {events.map((event, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl p-6 shadow hover:shadow-2xl transition flex flex-col"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-slate-800 rounded-lg flex items-center justify-center shadow">
                          <FaCalendarAlt className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {event.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                            {event.type}
                          </p>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 mb-3">
                        <li className="flex items-center gap-2">
                          <FaClock className="text-blue-600" />
                          <span>
                            {event.date} • {event.time}
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-blue-600" />
                          <span className="break-words">{event.location}</span>
                        </li>
                      </ul>
                      <div className="mb-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300 break-words">
                          {event.description}
                        </p>
                      </div>
                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 mt-auto"
                        >
                          <FaLink /> Join Event
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default EventsCalendar;
    // import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
    // import { useState, useEffect } from "react";
    // import AlumniNavbar from "../AlumniNavbar";

    // const EventsCalendar = () => {
    //   const [events, setEvents] = useState([]);
    //   const [formData, setFormData] = useState({
    //     title: "",
    //     date: "",
    //     time: "",
    //     location: "",
    //     type: "",
    //     description: "",
    //     link: "",
    //   });
    //   const [alert, setAlert] = useState(null);

    //   useEffect(() => {
    //     const fetchEvents = async () => {
    //       try {
    //         const res = await fetch("/events");
    //         const data = await res.json();
    //         setEvents(data);
    //       } catch (err) {
    //         showAlert("Error fetching events", "error");
    //       }
    //     };

    //     fetchEvents();
    //   }, []);

    //   const showAlert = (message, type) => {
    //     setAlert({ message, type });
    //     setTimeout(() => setAlert(null), 5000);
    //   };

    //   const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({ ...prev, [name]: value }));
    //   };

    //   const isPastDate = (inputDate) => {
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);
    //     const date = new Date(inputDate);
    //     return date < today;
    //   };

    //   const isValidLocation = (location) => {
    //     return location.trim().length > 0;
    //   };

    //   const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (isPastDate(formData.date)) {
    //       showAlert("Please enter a future date for the event", "error");
    //       return;
    //     }

    //     if (!isValidLocation(formData.location)) {
    //       showAlert("Please enter a valid location", "error");
    //       return;
    //     }

    //     try {
    //       const res = await fetch("/upload-event", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(formData),
    //       });

    //       const data = await res.json();
    //       if (res.ok) {
    //         showAlert("Event submitted successfully!", "success");
    //         setEvents((prev) => [...prev, data.event]);
    //         setFormData({
    //           title: "",
    //           date: "",
    //           time: "",
    //           location: "",
    //           type: "",
    //           description: "",
    //           link: "",
    //         });
    //       } else {
    //         showAlert(data.error || "Failed to submit event", "error");
    //       }
    //     } catch (error) {
    //       console.error("Submit Error:", error);
    //       showAlert("Something went wrong. Please try again.", "error");
    //     }
    //   };

    //   return (
    //     <>
    //       <AlumniNavbar />
    //       {alert && (
    //         <div
    //           className={`fixed top-20 right-4 p-4 rounded-lg text-white ${
    //             alert.type === "success" ? "bg-green-500" : "bg-red-500"
    //           } transition-opacity duration-300 z-50`}
    //         >
    //           {alert.message}
    //         </div>
    //       )}

    //       <div className="min-h-screen bg-blue-50 overflow-x-hidden">
    //         {/* Hero Section */}
    //         <div className="text-center py-16 bg-blue-600 text-white">
    //           <div className="max-w-4xl mx-auto mt-28 px-4">
    //             <FaCalendarAlt className="text-6xl mb-6 mx-auto" />
    //             <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
    //               Events Calendar
    //             </h1>
    //             <p className="text-lg md:text-xl opacity-95">
    //               Connect with alumni through global events
    //             </p>
    //           </div>
    //         </div>

    //         {/* Main Section */}
    //         <div className="max-w-7xl mx-auto px-4 py-12">
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    //             {/* Upcoming Events */}
    //             <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
    //               <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-blue-800 mb-4">
    //                 Upcoming Events
    //               </h2>
    //               {events.length === 0 ? (
    //                 <div className="text-center text-gray-500 py-10">
    //                   No upcoming events found.
    //                 </div>
    //               ) : (
    //                 events.map((event, index) => (
    //                   <div
    //                     key={index}
    //                     className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 break-words"
    //                   >
    //                     <div className="flex items-center gap-4 mb-4">
    //                       <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
    //                         <FaCalendarAlt className="text-blue-600 text-xl" />
    //                       </div>
    //                       <div>
    //                         <h3 className="text-lg font-semibold text-gray-800 truncate">
    //                           {event.title}
    //                         </h3>
    //                         <p className="text-sm text-gray-500 italic">
    //                           {event.type}
    //                         </p>
    //                       </div>
    //                     </div>
    //                     <ul className="text-sm text-gray-600 space-y-1 mb-3">
    //                       <li className="flex items-center gap-2">
    //                         <FaClock className="text-blue-600" />
    //                         <span>
    //                           {event.date} • {event.time}
    //                         </span>
    //                       </li>
    //                       <li className="flex items-center gap-2">
    //                         <FaMapMarkerAlt className="text-blue-600" />
    //                         <span className="break-words">{event.location}</span>
    //                       </li>
    //                     </ul>
    //                     <div className="mb-3">
    //                       <p className="text-sm text-gray-600 break-words">
    //                         {event.description}
    //                       </p>
    //                     </div>
    //                     {event.link && (
    //                       <a
    //                         href={event.link}
    //                         target="_blank"
    //                         rel="noopener noreferrer"
    //                         className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 break-words"
    //                       >
    //                         Join Event
    //                       </a>
    //                     )}
    //                   </div>
    //                 ))
    //               )}
    //             </div>

    //             {/* Create Event Form */}
    //             <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200 self-start">
    //               <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-blue-800 mb-8">
    //                 Create New Event
    //               </h2>
    //               <form className="space-y-6" onSubmit={handleSubmit}>
    //                 <div className="grid grid-cols-1 gap-6">
    //                   <input
    //                     type="text"
    //                     name="title"
    //                     value={formData.title}
    //                     onChange={handleChange}
    //                     placeholder="Event Title"
    //                     className={inputClass}
    //                     maxLength="100"
    //                     required
    //                   />

    //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    //                     <input
    //                       type="date"
    //                       name="date"
    //                       value={formData.date}
    //                       onChange={handleChange}
    //                       className={inputClass}
    //                       required
    //                     />
    //                     <input
    //                       type="text"
    //                       name="time"
    //                       value={formData.time}
    //                       onChange={handleChange}
    //                       placeholder="Event Time"
    //                       className={inputClass}
    //                       maxLength="50"
    //                       required
    //                     />
    //                   </div>

    //                   <input
    //                     type="text"
    //                     name="location"
    //                     value={formData.location}
    //                     onChange={handleChange}
    //                     placeholder="Location"
    //                     className={inputClass}
    //                     maxLength="200"
    //                     required
    //                   />

    //                   <select
    //                     name="type"
    //                     value={formData.type}
    //                     onChange={handleChange}
    //                     className={selectClass}
    //                     required
    //                   >
    //                     <option value="">Select Event Type</option>
    //                     <option value="Webinar">Webinar</option>
    //                     <option value="Conference">Conference</option>
    //                     <option value="Seminar">Seminar</option>
    //                     <option value="Workshop">Workshop</option>
    //                   </select>

    //                   {(formData.type === "Webinar" ||
    //                     formData.location.toLowerCase() === "virtual") && (
    //                     <input
    //                       type="url"
    //                       name="link"
    //                       value={formData.link}
    //                       onChange={handleChange}
    //                       placeholder="Online Event Link"
    //                       className={inputClass}
    //                       maxLength="500"
    //                       pattern="https?://.+"
    //                       required
    //                     />
    //                   )}

    //                   <textarea
    //                     name="description"
    //                     value={formData.description}
    //                     onChange={handleChange}
    //                     placeholder="Event Description"
    //                     className={`${inputClass} h-36 resize-none`}
    //                     maxLength="1000"
    //                     required
    //                   />

    //                   <button
    //                     type="submit"
    //                     className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
    //                   >
    //                     Submit Event
    //                   </button>
    //                 </div>
    //               </form>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </>
    //   );
    // };

    // const inputClass =
    //   "border border-gray-300 rounded-lg px-5 py-4 text-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full";
    // const selectClass =
    //   "border border-gray-300 rounded-lg px-5 py-4 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full";

    // export default EventsCalendar;
