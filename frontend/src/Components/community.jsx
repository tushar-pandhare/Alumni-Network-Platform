import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const demoMembers = [
  {
    name: 'Alice Johnson',
    role: 'UI/UX Designer',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    description: 'Passionate about building intuitive interfaces and vibrant design systems.',
  },
  {
    name: 'Brian Lee',
    role: 'Full Stack Developer',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: 'Loves solving problems with JavaScript, Node.js, and React.',
  },
  {
    name: 'Carla Martinez',
    role: 'ML Engineer',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    description: 'Specializes in predictive models and data analysis pipelines.',
  },
  {
    name: 'David Kim',
    role: 'Backend Developer',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    description: 'APIs, databases, and everything behind the scenes.',
  },
];

const groupImage = "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";

const CommunityPage = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 px-4 md:px-12 lg:px-20 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Our Community</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Meet the passionate people who make our tech community thrive.
        </p>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {demoMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{member.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{member.role}</p>
                <p className="text-sm text-gray-700 mb-4">{member.description}</p>
              </div>
              {/* <img
                src={groupImage}
                alt="Community Group"
                className="w-full h-32 object-cover"
              /> */}
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Together as One</h2>
          <img
            src={groupImage}
            alt="Community Group Main"
            className="mx-auto rounded-xl shadow-lg w-full max-w-5xl object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default CommunityPage;

// import React from 'react';
// import Navbar from './Navbar';
// import { motion } from 'framer-motion';

// const demoMembers = [
//   {
//     name: 'Alice Johnson',
//     role: 'UI/UX Designer',
//     image: 'https://randomuser.me/api/portraits/women/44.jpg',
//     description: 'Passionate about building intuitive interfaces and vibrant design systems.',
//   },
//   {
//     name: 'Brian Lee',
//     role: 'Full Stack Developer',
//     image: 'https://randomuser.me/api/portraits/men/32.jpg',
//     description: 'Loves solving problems with JavaScript, Node.js, and React.',
//   },
//   {
//     name: 'Carla Martinez',
//     role: 'ML Engineer',
//     image: 'https://randomuser.me/api/portraits/women/68.jpg',
//     description: 'Specializes in predictive models and data analysis pipelines.',
//   },
//   {
//     name: 'David Kim',
//     role: 'Backend Developer',
//     image: 'https://randomuser.me/api/portraits/men/75.jpg',
//     description: 'APIs, databases, and everything behind the scenes.',
//   },
// ];

// const groupImage = "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";

// const CommunityPage = () => {
//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 font-sans">
//         {/* Hero Section */}
//         <div className="relative text-center py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-xl overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-80"></div>
//           <div className="relative z-10 max-w-4xl mx-auto mt-28 px-4">
//             <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
//               Our Community
//             </h1>
//             <p className="text-lg md:text-xl opacity-95 font-light text-indigo-100 mb-3">
//               Meet the passionate people who make our tech community thrive.
//             </p>
//           </div>
//         </div>

//         {/* Members Grid */}
//         <div className="max-w-7xl mx-auto px-4 py-12">
//           <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {demoMembers.map((member, index) => (
//               <motion.div
//                 key={index}
//                 className="relative bg-white/70 backdrop-blur-xl p-7 rounded-3xl shadow-2xl border border-indigo-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
//                 whileHover={{ scale: 1.04 }}
//               >
//                 <img
//                   src={member.image}
//                   alt={member.name}
//                   className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-lg mb-4"
//                 />
//                 <h2 className="text-xl font-bold text-indigo-900 mb-1">{member.name}</h2>
//                 <p className="text-sm text-indigo-400 mb-2">{member.role}</p>
//                 <p className="text-sm text-indigo-900 text-center">{member.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* Group Image Section */}
//         <div className="max-w-5xl mx-auto px-4 pb-16">
//           <div className="relative rounded-3xl overflow-hidden shadow-2xl">
//             <img
//               src={groupImage}
//               alt="Community Group"
//               className="w-full max-h-96 object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-800/40 to-purple-800/60"></div>
//             <div className="absolute inset-0 flex flex-col items-center justify-center">
//               <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">
//                 Together as One
//               </h2>
//               <p className="text-lg text-indigo-100 font-light">
//                 Collaboration, support, and growth—this is who we are.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CommunityPage;