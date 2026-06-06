// import { useEffect, useState } from "react";
// import { FaSearch, FaRocket } from "react-icons/fa";

// const AlumniDirectory = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchAlumni = async () => {

//   const filteredAlumni = alumniData.filter((alumnus) =>
//     `${alumnus.name} ${alumnus.company} ${alumnus.location}`

//   return (
//     <>

//         <div className="max-w-7xl mx-auto px-4 py-10">
//           <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">

//           {}
//           {loading ? (

// export default AlumniDirectory;
import { useEffect, useState } from "react";
import { FaSearch, FaRocket } from "react-icons/fa";
import AlumniNavbar from "../AlumniNavbar";
import axios from "axios";

const inputBase =
  "block w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

const AlumniDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get("/alumni-directory");
        setAlumniData(res.data);
      } catch (err) {
        console.error("Error fetching alumni directory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  const filteredAlumni = alumniData.filter((alumnus) =>
    `${alumnus.name} ${alumnus.company} ${alumnus.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AlumniNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-2 py-10 font-sans">
        {}
        <section className="max-w-4xl mx-auto mt-20 mb-14 text-center">
          <FaRocket className="text-6xl mb-6 mx-auto text-blue-700 opacity-70 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Alumni Directory
          </h1>
          <p className="text-lg md:text-xl text-slate-300">
            Connect with 50,000+ alumni worldwide
          </p>
        </section>

        <div className="max-w-7xl mx-auto">
          {}
          <div className="backdrop-blur bg-white/80 dark:bg-slate-800/70 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center gap-2 w-full">
                <FaSearch className="text-blue-700 text-xl" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, company, or location..."
                  className={inputBase}
                />
              </div>
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition w-full sm:w-auto"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            </div>
          </div>

          {}
          {loading ? (
            <div className="text-center text-white py-10">Loading alumni...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredAlumni.length > 0 ? (
                filteredAlumni.map((alumnus, index) => (
                  <div
                    key={index}
                    className="bg-white/80 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow hover:shadow-xl transition flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={alumnus.profileImage || "https://via.placeholder.com/150"}
                        alt={alumnus.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-700"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                          {alumnus.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          {alumnus.role} {alumnus.email}
                        </p>
                        <p className="text-sm text-blue-700 font-medium">
                          {alumnus.passingYear} Batch
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{alumnus.location}</p>
                      </div>
                    </div>
                    {}
                  </div>
                ))
              ) : (
                <div className="text-center col-span-3 text-slate-300 py-12">
                  <p className="text-lg font-medium">No alumni found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AlumniDirectory;