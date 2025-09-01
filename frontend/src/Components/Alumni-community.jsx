// import React from 'react';
// import AlumniNavbar from './AlumniNavbar';
// import { FaUsers, FaRocket } from 'react-icons/fa'; // Import icons

// const AlumniCommunity = () => {
//   return (
//     <>
//       <AlumniNavbar />
//       <div className='min-h-screen bg-blue-50'>
//         {/* Hero Section */}
//         <div className="text-center py-16 bg-blue-600 text-white">
//           <div className="max-w-4xl mx-auto mt-28 px-4">
//             <FaRocket className="text-6xl mb-6 mx-auto animate-pulse" />
//             <h1 className='text-4xl md:text-5xl font-bold mb-4'>
//               Community
//             </h1>
//             <p className='text-lg md:text-xl opacity-95'>
//               Join our vibrant community and connect with like-minded individuals.
//               Discover new opportunities, share your knowledge, and grow together.
//             </p>
//           </div>
//         </div>

//         <div className='max-w-7xl mx-auto px-4 py-12 text-center space-y-8'>
//           <FaUsers className="text-6xl text-blue-600 mx-auto" />

//           <div className='flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4'>
//             <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-colors duration-300'>
//               Explore Forums
//             </button>
//             <button className='bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-3 px-6 rounded-xl shadow-md transition-colors duration-300 border border-gray-700'>
//               Join Chat
//             </button>
//           </div>

//           <div className="mt-8">
//             <img
//               src="https://miro.medium.com/v2/resize:fit:2000/1*uByFQ3rkPtFrnvZokzOmfw.jpeg"
//               alt="Community Illustration"
//               className="rounded-2xl shadow-lg mx-auto max-w-full"
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AlumniCommunity;
import React from 'react';
import AlumniNavbar from './AlumniNavbar';
import { FaUsers, FaRocket } from 'react-icons/fa';

const AlumniCommunity = () => {
  return (
    <>
      <AlumniNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 px-2 py-10 font-sans relative overflow-x-hidden">
        {/* Decorative Gradients */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/10 rounded-full blur-3xl top-[-8rem] left-[-10rem] animate-pulse" />
          <div className="absolute w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-500/10 rounded-full blur-3xl bottom-[-8rem] right-[-10rem] animate-pulse" />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 max-w-4xl mx-auto pt-32 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-lg rounded-full shadow-lg border border-white/20 mb-6">
            <FaRocket className="text-5xl text-indigo-400 animate-bounce" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
            Alumni Community
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-4 font-medium">
            Join our vibrant community, discover new opportunities, share your knowledge, and grow together.
          </p>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto mt-16 text-center space-y-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full shadow-lg mb-4">
            <FaUsers className="text-5xl text-white" />
          </div>

          {/* Glassmorphism Card for Actions */}
          <div className="mx-auto max-w-2xl backdrop-blur-2xl bg-white/20 border border-white/20 rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row items-center justify-center gap-6">
            <button className="w-full md:w-auto bg-white/80 hover:bg-white text-indigo-700 font-bold py-4 px-8 rounded-xl shadow-lg border border-indigo-200 transition-all duration-150 text-lg">
              Join Chat
            </button>
  
          </div>

          {/* Illustration */}
          <div className="mt-8">
            <img
              src="https://miro.medium.com/v2/resize:fit:2000/1*uByFQ3rkPtFrnvZokzOmfw.jpeg"
              alt="Community Illustration"
              className="rounded-3xl shadow-2xl mx-auto max-w-full border-4 border-white/20"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniCommunity;