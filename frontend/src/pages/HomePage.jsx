

// import React, { useState } from 'react';
// import ComplaintMap from '../components/ComplaintMap';
// import ComplaintList from '../components/ComplaintList';
// import { useComplaintContext } from '../context/ComplaintContext';
// import { useAuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const HomePage = () => {
//   const { complaints, loading, error } = useComplaintContext();
//   const { user, setShowUserLogin, userType } = useAuthContext();
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const navigate = useNavigate();



//   if (loading) return <div className="text-center py-10 text-lg font-medium text-blue-600">Loading complaints...</div>;
//   if (error) return <div className="text-red-600 text-center py-10 font-medium">Error: {error}</div>;

//   return (
//     <div className="px-4 md:px-8 lg:px-16 py-10 space-y-16">

//       {/* Hero Section */}
//       <header className="bg-blue-50 p-8 rounded-2xl shadow-md text-center">
//         <h1 className="text-4xl md:text-5xl font-bold text-blue-700">Welcome to ReportHub</h1>
//         <p className="mt-3 text-lg text-gray-600">Your Voice Matters - Building Better Communities Together</p>

//         {!user ? (
//           <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
//             <button
//               className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition duration-300"
//               onClick={() => {
//                 navigate('/citizen-login');
//                 setShowUserLogin(true)
//               }}
//             >
//               Report an Issue as Citizen
//             </button>
//             <button
//               className="bg-white border border-gray-300 text-gray-800 py-2 px-6 rounded-xl hover:bg-gray-100 transition duration-300"
//               onClick={() => {
//                 navigate('/officer-login');
//                 setShowUserLogin(true)
//               }}
//             >
//               Municipality Dashboard Access
//             </button>
//           </div>
//         ) : (
//           <div className="mt-6 text-lg">
//             {user.role === 'USER' ? (
//               <>
//                 <p className="mb-4 ">Welcome back,
//                   <span className="font-semibold text-blue-700">{user.name}</span>
//                   Ready to report a new issue?
//                 </p>
//                 <button
//                   className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition duration-300"
//                   onClick={() => navigate('/submit-complaint')}
//                 >
//                   Submit New Complaint
//                 </button>
//               </>
//             ) : (
//               <>
//                 <p className="mb-4">Welcome, Municipality Officer <span className="font-semibold text-blue-700">{user.name}</span></p>
//                 <button
//                   className="bg-gray-800 text-white py-2 px-6 rounded-xl hover:bg-gray-900 transition duration-300"
//                   onClick={() => navigate('/department')}
//                 >
//                   Go to Dashboard
//                 </button>
//               </>
//             )}
//           </div>
//         )}
//       </header>
//       {/* Map Section */}
//       {/* <section>
// //         <h2 className="text-2xl font-semibold mb-4">Issues in Your Area</h2>
// //         <div className="h-96 border rounded-xl overflow-hidden shadow-md">
// //           <ComplaintMap
// //             complaints={complaints}
// //             center={
// //               selectedComplaint
// //                 ? [selectedComplaint.location?.latitude || 0, selectedComplaint.location?.longitude || 0]
// //                 : [51.505, -0.09]
// //             }
// //             zoom={selectedComplaint ? 15 : 13}
// //             onMarkerClick={setSelectedComplaint}
// //           />
// //         </div>
// //       </section> */}


//       {/* Recent Complaints */}
//       <section>
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-semibold text-gray-800">Recently Reported Issues</h2>
//           {complaints.length > 5 && (
//             <button
//               className="text-blue-600 font-medium hover:underline"
//               onClick={() => navigate('/complaints')}
//             >
//               View All
//             </button>
//           )}
//         </div>
//         <ComplaintList
//           complaints={complaints.slice(0, 5)}
//           onSelect={setSelectedComplaint}
//           selectedId={selectedComplaint?.id}
//         />
//       </section>

//       {/* How It Works */}
//       <section className="bg-gray-100 p-8 rounded-2xl shadow-md">
//         <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">How ReportHub Works</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {[
//             {
//               number: '1',
//               title: 'Report',
//               desc: 'Citizens report issues with photos and location',
//             },
//             {
//               number: '2',
//               title: 'Analyze',
//               desc: 'Our AI clusters similar issues for efficient resolution',
//             },
//             {
//               number: '3',
//               title: 'Resolve',
//               desc: 'Municipality teams address prioritized complaints',
//             },
//           ].map((step) => (
//             <div key={step.number} className="bg-white p-6 rounded-xl text-center shadow">
//               <div className="text-4xl font-bold text-blue-600 mb-2">{step.number}</div>
//               <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
//               <p className="mt-2 text-gray-600">{step.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       {!user && (
//         <section className="bg-blue-100 p-8 rounded-2xl text-center shadow-md">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Make a Difference?</h2>
//           <p className="text-gray-600 mb-6">Join us today and help improve your community.</p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button
//               className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition duration-300"
//               onClick={() => navigate('/citizen-login')}
//             >
//               Join as Citizen Reporter
//             </button>
//             <button
//               className="bg-white border border-gray-400 text-gray-800 py-2 px-6 rounded-xl hover:bg-gray-100 transition duration-300"
//               onClick={() => navigate('/officer-login')}
//             >
//               Municipality Login
//             </button>
//           </div>
//         </section>
//       )}
//     </div>
//   );
// };

// export default HomePage;




import React, { useState } from 'react';
import ComplaintMap from '../components/ComplaintMap';
import ComplaintList from '../components/ComplaintList';
import { useComplaintContext } from '../context/ComplaintContext';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { complaints, loading, error } = useComplaintContext();
  const { user, setShowAuthModal, setAuthModalType, userType } = useAuthContext();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const navigate = useNavigate();

  if (loading) return <div className="text-center py-10 text-lg font-medium text-blue-600">Loading complaints...</div>;
  if (error) return <div className="text-red-600 text-center py-10 font-medium">Error: {error}</div>;

  return (
    <div className="px-4 md:px-8 lg:px-16 py-10 space-y-16">
      {/* Hero Section */}
      <header className="bg-blue-50 p-8 rounded-2xl shadow-md text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700">Welcome to ReportHub</h1>
        <p className="mt-3 text-lg text-gray-600">Your Voice Matters - Building Better Communities Together</p>

        {!user ? (
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition duration-300"
              onClick={() => {
                setAuthModalType('user');
                setShowAuthModal(true);
              }}
            >
              Report an Issue as Citizen
            </button>
            <button
              className="bg-white border border-gray-300 text-gray-800 py-2 px-6 rounded-xl hover:bg-gray-100 transition duration-300"
              onClick={() => {
                setAuthModalType('admin');
                setShowAuthModal(true);
              }}
            >
              Municipality Dashboard Access
            </button>
          </div>
        ) : (
          <div className="mt-6 text-lg">
            {userType === 'USER' ? (
              <>
                <p className="mb-4">Welcome back, <span className="font-semibold text-blue-700">{user.name}</span></p>
                <button
                  className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition duration-300"
                  onClick={() => navigate('/submit-complaint')}
                >
                  Submit New Complaint
                </button>
              </>
            ) : (
              <>
                <p className="mb-4">Welcome, Municipality Officer <span className="font-semibold text-blue-700">{user.name}</span></p>
                <button
                  className="bg-gray-800 text-white py-2 px-6 rounded-xl hover:bg-gray-900 transition duration-300"
                  onClick={() => navigate('/department')}
                >
                  Go to Dashboard
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Rest of your home page content... */}
    </div>
  );
};

export default HomePage;