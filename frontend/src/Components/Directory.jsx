import { useEffect, useState } from "react";
import { FaSearch, FaRocket } from "react-icons/fa";
import axios from "axios";
import Navbar from "./Navbar";

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get("http://localhost:5000/alumni-directory");
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
      <Navbar />
      <div className="min-h-screen bg-blue-50">
        <div className="text-center py-20 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto mt-28 px-4">
            <FaRocket className="text-5xl sm:text-6xl mb-6 mx-auto animate-pulse" />
            <h1 className="text-4xl font-bold mb-2">Alumni Directory</h1>
            <p className="text-lg opacity-90">Connect with 50,000+ alumni worldwide</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center gap-2 w-full">
                <FaSearch className="text-gray-400 text-xl" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, company, or location..."
                  className="flex-1 p-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 w-full sm:w-auto"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Alumni Cards */}
          {loading ? (
            <p className="text-center text-gray-500">Loading alumni...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAlumni.length > 0 ? (
                filteredAlumni.map((alumnus, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 transition-transform hover:scale-105"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={alumnus.profileImage || "https://via.placeholder.com/150"}
                        alt={alumnus.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {alumnus.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {alumnus.role}  {alumnus.email}
                        </p>
                        <p className="text-sm text-blue-600">
                          {alumnus.passingYear} Batch
                        </p>
                        <p className="text-xs text-gray-500">{alumnus.location}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-3 text-gray-600">
                  No alumni found matching your search.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Directory;
