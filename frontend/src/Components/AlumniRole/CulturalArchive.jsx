// import { FaHistory, FaPhotoVideo, FaUpload, FaCalendarAlt } from 'react-icons/fa';
// import { useState } from 'react';
// import AlumniNavbar from '../AlumniNavbar';

// const CulturalArchive = () => {
//   const [media] = useState([
//     { type: "photo", url: "https://example.com/photo1.jpg", year: "2010" },
//     { type: "video", url: "https://example.com/video1.mp4", year: "2015" }
//   ]);

//   return (
//     <>
//       <AlumniNavbar />
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
//         <div className="max-w-6xl mx-auto mt-28">
//           {/* Header Section */}
//           <div className="text-center mb-16">
//             <div className="inline-block p-6 rounded-2xl shadow-xl bg-gradient-to-br from-amber-500 to-orange-600">
//               <FaHistory className="text-6xl text-white mx-auto" />
//             </div>
//             <h1 className="text-5xl font-extrabold text-gray-900 mt-8 mb-3">
//               Cultural <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">Heritage Archive</span>
//             </h1>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
//               Preserving our institutional legacy through shared memories and historical milestones
//             </p>
//           </div>

//           {/* Main Content Grid */}
//           <div className="grid lg:grid-cols-2 gap-8 mb-12">
//             {/* Media Gallery Section */}
//             <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
//               <div className="flex items-center gap-3 mb-8">
//                 <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-3 rounded-xl shadow-sm">
//                   <FaPhotoVideo className="text-3xl text-amber-600" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
//                   Media Gallery
//                 </h2>
//               </div>

//               <div className="grid grid-cols-3 gap-4">
//                 {media.map((item, index) => (
//                   <div 
//                     key={index} 
//                     className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     {item.type === 'photo' ? (
//                       <img 
//                         src={item.url} 
//                         alt="" 
//                         className="w-full h-full object-cover transform group-hover:scale-105 transition-transform" 
//                       />
//                     ) : (
//                       <video 
//                         src={item.url} 
//                         className="w-full h-full object-cover transform group-hover:scale-105 transition-transform" 
//                       />
//                     )}
//                     <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
//                       <div className="flex items-center gap-2">
//                         <FaCalendarAlt className="text-amber-300" />
//                         <span className="text-sm font-medium">{item.year}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Timeline Section */}
//             <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
//               <div className="flex items-center gap-3 mb-8">
//                 <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-3 rounded-xl shadow-sm">
//                   <FaHistory className="text-3xl text-orange-600" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
//                   Historical Timeline
//                 </h2>
//               </div>

//               <div className="space-y-6">
//                 <div className="relative pl-8 before:absolute before:left-[9px] before:top-5 before:h-[calc(100%-20px)] before:w-1 before:bg-gradient-to-b from-amber-200 to-orange-200">
//                   <div className="relative mb-8">
//                     <div className="absolute left-0 top-1 w-4 h-4 bg-amber-500 rounded-full ring-4 ring-amber-100"></div>
//                     <div className="ml-6 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500">
//                       <h3 className="text-lg font-bold text-gray-800 mb-1">2005 - Campus Inauguration</h3>
//                       <p className="text-sm text-gray-600">Founding of the main campus building</p>
//                     </div>
//                   </div>
                  
//                   <div className="relative mb-8">
//                     <div className="absolute left-0 top-1 w-4 h-4 bg-orange-500 rounded-full ring-4 ring-orange-100"></div>
//                     <div className="ml-6 p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
//                       <h3 className="text-lg font-bold text-gray-800 mb-1">2012 - First Alumni Meet</h3>
//                       <p className="text-sm text-gray-600">Annual reunion tradition begins</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contribution Section */}
//           <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
//             <div className="flex items-center gap-3 mb-8">
//               <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-3 rounded-xl shadow-sm">
//                 <FaUpload className="text-3xl text-amber-600" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
//                 Contribute to Archive
//               </h2>
//             </div>

//             <form className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Upload Historical Media
//                 </label>
//                 <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl hover:border-amber-500 transition-colors">
//                   <input 
//                     type="file" 
//                     className="absolute opacity-0 w-full h-full cursor-pointer" 
//                   />
//                   <div className="text-center">
//                     <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
//                     <p className="text-gray-500">Drag & drop or click to upload</p>
//                     <p className="text-sm text-gray-400 mt-1">JPEG, PNG, MP4 up to 50MB</p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-br from-amber-600 to-orange-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
//               >
//                 Preserve History
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CulturalArchive;
import { FaHistory, FaPhotoVideo, FaUpload, FaCalendarAlt, FaRocket } from 'react-icons/fa';
import { useState } from 'react';
import AlumniNavbar from '../AlumniNavbar';

const CulturalArchive = () => {
  const [media] = useState([
    { type: "photo", url: "https://t3.ftcdn.net/jpg/04/98/81/32/360_F_498813253_1F67TUXp7RKXETW6ZdavRa3dzwsGNgEd.jpg", year: "2010" },
    { type: "video", url: "", year: "2015" }
  ]);

  return (
    <>
      <AlumniNavbar />
      <div className="min-h-screen bg-blue-50">
        {/* Hero Section */}
        <div className="text-center py-16 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto mt-28 px-4">
            <FaRocket className="text-6xl mb-6 mx-auto animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cultural Heritage Archive</h1>
            <p className="text-lg md:text-xl opacity-95">Preserving our institutional legacy through shared memories and historical milestones</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Media Gallery Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-100 p-3 rounded-xl shadow-sm">
                  <FaPhotoVideo className="text-3xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-black-800 text-blue-600">
                  Media Gallery
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {media.map((item, index) => (
                  <div 
                    key={index} 
                    className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {item.type === 'photo' ? (
                      <img 
                        src={item.url} 
                        alt="" 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform" 
                      />
                    ) : (
                      <video 
                        src={item.url} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform" 
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-300" />
                        <span className="text-sm font-medium">{item.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-100 p-3 rounded-xl shadow-sm">
                  <FaHistory className="text-3xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-black-800 text-blue-600">
                  Historical Timeline
                </h2>
              </div>

              <div className="space-y-6">
                <div className="relative pl-8 before:absolute before:left-[9px] before:top-5 before:h-[calc(100%-20px)] before:w-1 before:bg-blue-200">
                  <div className="relative mb-8">
                    <div className="absolute left-0 top-1 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-100"></div>
                    <div className="ml-6 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">2005 - Campus Inauguration</h3>
                      <p className="text-sm text-gray-600">Founding of the main campus building</p>
                    </div>
                  </div>
                  
                  <div className="relative mb-8">
                    <div className="absolute left-0 top-1 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-100"></div>
                    <div className="ml-6 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">2012 - First Alumni Meet</h3>
                      <p className="text-sm text-gray-600">Annual reunion tradition begins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contribution Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-100 p-3 rounded-xl shadow-sm">
                <FaUpload className="text-3xl text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-black-800 text-blue-600">
                Contribute to Archive
              </h2>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Historical Media
                </label>
                <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 transition-colors">
                  <input 
                    type="file" 
                    className="absolute opacity-0 w-full h-full cursor-pointer" 
                  />
                  <div className="text-center">
                    <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Drag & drop or click to upload</p>
                    <p className="text-sm text-gray-400 mt-1">JPEG, PNG, MP4 up to 50MB</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Preserve History
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CulturalArchive;