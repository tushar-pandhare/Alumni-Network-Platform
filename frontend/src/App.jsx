// // App.jsx
// import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
// import LandingPage from './Components/LandingPage';
// import LoginPage from './Components/LoginPage';
// import Navbar from './Components/Navbar';
// import EventsPage from './Components/EventsPage';
// import JobsPage from './Components/JobsPage';
// import ErrorPage from './Components/ErrorPage';
// import Homepage from './Components/HomePage/homepage';
// import Signup from './Components/Signup';
// import ProfilePage from './Components/ProfilePage';
// import ProfileView from './Components/ProfileView';

// // Alumni Role Components
// import AlumniDirectory from './Components/AlumniRole/AlumniDirectory';
// import AlumniStories from './Components/AlumniRole/AlumniStories';
// import CulturalArchive from './Components/AlumniRole/CulturalArchive';
// import DonationPortal from './Components/AlumniRole/DonationPortal';
// import EventsCalendar from './Components/AlumniRole/EventsCalendar';
// import FeedbackForum from './Components/AlumniRole/FeedbackForum';
// import JobBoard from './Components/AlumniRole/JobBoard';
// import MentorshipHub from './Components/AlumniRole/MentorshipHub';
// import StartupZone from './Components/AlumniRole/StartupZone';

// // Other Navbars
// import AlumniNavbar from './Components/AlumniNavbar';
// import AdminNavbar from './Components/AdminNavbar';

// const MainLayout = () => (
//   <>
//     <Navbar />
//     <div className="pt-16 min-h-screen bg-gray-900 text-white">
//       <Outlet />
//     </div>
//   </>
// );

// const NoNavbarLayout = () => (
//   <div className="min-h-screen bg-gray-900 text-white">
//     <Outlet />
//   </div>
// );

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <LandingPage />,
//     errorElement: <ErrorPage />
//   },
//   {
//     path: '/login',
//     element: <LoginPage />
//   },
//   {
//     path: '/signup',
//     element: <Signup />
//   },
//   {
//     element: <MainLayout />,
//     children: [
//       { path: '/home', element: <Homepage /> },
//       { path: '/events', element: <EventsPage /> },
//       { path: '/jobs', element: <JobsPage /> },

//       // AlumniRole routes
//       { path: '/alumni-directory', element: <AlumniDirectory /> },
//       { path: '/alumni-stories', element: <AlumniStories /> },
//       { path: '/cultural-archive', element: <CulturalArchive /> },
//       { path: '/donation-portal', element: <DonationPortal /> },
//       { path: '/events-calendar', element: <EventsCalendar /> },
//       { path: '/feedback-forum', element: <FeedbackForum /> },
//       { path: '/job-board', element: <JobBoard /> },
//       { path: '/mentorship-hub', element: <MentorshipHub /> },
//       { path: '/startup-zone', element: <StartupZone /> },

//       // Navbar previews
    

//       // Placeholder community route
//       { path: '/community', element: <div>Community Page</div> },
//     ]
//   },
//   {
//     element: <NoNavbarLayout />,
//     children: [
//       { path: '/profilepage', element: <ProfilePage /> },
//       { path: '/profileview', element: <ProfileView /> },
//       { path: '/admin-navbar', element: <AdminNavbar /> },
//       { path: '/alumni-navbar', element: <AlumniNavbar /> },
//     ]
//   }
// ]);

// const App = () => <RouterProvider router={router} />;

// export default App;
// App.jsximport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



// import LandingPage from './Components/LandingPage';
// import Navbar from './Components/Navbar';
// import EventsPage from './Components/EventsPage';
// import JobsPage from './Components/JobsPage';
// import ErrorPage from './Components/ErrorPage';
// import Homepage from './Components/HomePage/homepage';
// import ProfilePage from './Components/ProfilePage';
// import ProfileView from './Components/ProfileView';

// // Alumni Role Components
// import AlumniDirectory from './Components/AlumniRole/AlumniDirectory';
// import AlumniStories from './Components/AlumniRole/AlumniStories';
// import CulturalArchive from './Components/AlumniRole/CulturalArchive';
// import DonationPortal from './Components/AlumniRole/DonationPortal';
// import EventsCalendar from './Components/AlumniRole/EventsCalendar';
// import FeedbackForum from './Components/AlumniRole/FeedbackForum';
// import JobBoard from './Components/AlumniRole/JobBoard';
// import MentorshipHub from './Components/AlumniRole/MentorshipHub';
// import StartupZone from './Components/AlumniRole/StartupZone';

// // Other Navbars
// import AlumniNavbar from './Components/AlumniNavbar';
// // import community from './Components/community';
// import AdminNavbar from './Components/AdminNavbar';
// import StudentMentorshipHub from './Components/StudentMentorshipHub';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './Components/pages/Login';
// import Signup from './Components/pages/SignUp';
// import Community from './Components/community';
// import TestBackendComponent from './Components/TestBackendComponent';
// import Profilepagee from './Components/ProfilePageComponent/Profilepagee';
// // import Login from './Components/LoginPage';


// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Routes without Navbar */}
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* Routes with Navbar */}
//         <Route
//           path="*"
//           element={
//             <>
//               {/* <Navbar /> */}
//               <div className="min-h-screen bg-gray-900 text-white">
//                 <Routes>

//                   <Route path="/home"
//                    element={<Homepage />}
//                   />

//                   <Route path="/events" element={<EventsPage />} />
//                   <Route path="/jobs" element={<JobsPage />} />
//                   <Route path='/community' element={<Community />} />

//                   <Route path="/alumni-directory" element={<AlumniDirectory />} />
//                   <Route path="/alumni-stories" element={<AlumniStories />} />
//                   <Route path="/cultural-archive" element={<CulturalArchive />} />
//                   <Route path="/donation-portal" element={<DonationPortal />} />
//                   <Route path="/events/manage" element={<EventsCalendar />} />
//                   <Route path="/alumni/feedback-forum" element={<FeedbackForum />} />
//                   <Route path="/jobs/manage" element={<JobBoard />} />
//                   <Route path="/alumni/mentorship-hub" element={<MentorshipHub />} />
//                   <Route path="/alumni/startup-zone" element={<StartupZone />} />
//                   <Route path="/mentorship-hub" element={<StudentMentorshipHub />} />
//                   {/* <Route path="/profilepage" element={<ProfilePage />} /> */}
//                   <Route path="/profile" component={<ProfilePage />} />
//                   <Route path="/profileview" element={<ProfileView />} />
//                   <Route path="/admin-navbar" element={<AdminNavbar />} />
//                   <Route path="/alumni-navbar" element={<AlumniNavbar />} />
//                   <Route path='/alumni-profile-page' element={<Profilepagee />}></Route>

//                   <Route path='/testing' element={<TestBackendComponent />} />
//                   <Route path="*" element={<ErrorPage />} />
//                 </Routes>
//               </div>
//             </>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;



import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './Components/LandingPage';
import Navbar from './Components/Navbar';
import EventsPage from './Components/EventsPage';
import JobsPage from './Components/JobsPage';
import ErrorPage from './Components/ErrorPage';
import Homepage from './Components/HomePage/homepage';
import ProfilePage from './Components/ProfilePage';
import ProfileView from './Components/ProfileView';

// Alumni Role Components
import AlumniDirectory from './Components/AlumniRole/AlumniDirectory';
import AlumniStories from './Components/AlumniRole/AlumniStories';
import CulturalArchive from './Components/AlumniRole/CulturalArchive';
import DonationPortal from './Components/AlumniRole/DonationPortal';
import EventsCalendar from './Components/AlumniRole/EventsCalendar';
import FeedbackForum from './Components/AlumniRole/FeedbackForum';
import JobBoard from './Components/AlumniRole/JobBoard';
import MentorshipHub from './Components/AlumniRole/MentorshipHub';
import StartupZone from './Components/AlumniRole/StartupZone';

// Navbars
import AlumniNavbar from './Components/AlumniNavbar';
import AdminNavbar from './Components/AdminNavbar';

import StudentMentorshipHub from './Components/StudentMentorshipHub';
import Login from './Components/pages/Login';
import Signup from './Components/pages/SignUp';
// import Community from './Components/Alumni-community';
import TestBackendComponent from './Components/TestBackendComponent';
import Profilepagee from './Components/pages/ProfilePageComponent/Profilepagee';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import AlumniCommunity from './Components/Alumni-community';
import Hellocommunity from './Components/community';
import Directory from './Components/Directory';
// import Trying from './Components/pages/Trying';
import TheAlumniStories from './Components/storiesAlumni';
import Trying from './Components/pagesFromAlumni/trialFolder/Trying';
// import Trying from './Components/pagesFromAlumni/trialFolder/tryIng';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                {/* <Navbar /> If you want to show a navbar globally */}
                <div className="min-h-screen bg-gray-900 text-white">
                  <Routes>
                    <Route path="/home" element={<Homepage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/alumni-community" element={<AlumniCommunity />} />
                    <Route path='/community' element={<Hellocommunity />} />
                    <Route path='/directory' element={<Directory />} />
                    <Route path='/stories' element={<TheAlumniStories />} />
                    

                    {/* Alumni Role Routes */}
                    <Route path="/alumni-directory" element={<AlumniDirectory />} />
                    <Route path="/alumni-stories" element={<AlumniStories />} />
                    <Route path="/cultural-archive" element={<CulturalArchive />} />
                    <Route path="/donation-portal" element={<DonationPortal />} />
                    <Route path="/events/manage" element={<EventsCalendar />} />
                    <Route path="/alumni/feedback-forum" element={<FeedbackForum />} />
                    <Route path="/jobs/manage" element={<JobBoard />} />
                    <Route path="/alumni/mentorship-hub" element={<MentorshipHub />} />
                    <Route path="/alumni/startup-zone" element={<StartupZone />} />

                    {/* Profile & Mentorship */}
                    <Route path="/mentors" element={<StudentMentorshipHub />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profileview" element={<ProfileView />} />
                    <Route path="/alumni-profile-page" element={<Profilepagee />} />

                    {/* Navbar Demo Routes */}
                    <Route path="/admin-navbar" element={<AdminNavbar />} />
                    <Route path="/alumni-navbar" element={<AlumniNavbar />} />

                    {/* Test */}
                    <Route path="/testing" element={<TestBackendComponent />} />

                    <Route path="/trying" element={<Trying />} />
                    {/* Fallback */}
                    <Route path="*" element={<ErrorPage />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
    
  );
};
console.log("App component rendered");

export default App;
