
import React, { useState } from 'react';
import ComplaintMap from '../components/ComplaintMap';
import ComplaintList from '../components/ComplaintList';
import { useComplaintContext } from '../context/ComplaintContext';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {


  const { complaints, loading, error } = useComplaintContext();
  const { user, showUserLogin, showAdminLogin } = useAuthContext();
  const navigate = useNavigate();
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  if (loading) return <div className="text-center py-10 text-lg font-medium">Loading complaints...</div>;
  if (error) return <div className="text-red-600 text-center py-10">Error: {error}</div>;

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8 space-y-12">
      {/* Hero Section */}
      <header className="text-center bg-blue-50 p-6 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-blue-700">Welcome to ReportHub</h1>
        <p className="text-gray-600 mt-2 text-lg">Your Voice Matters - Building Better Communities Together</p>

        {!user ? (
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              onClick={()=>navigate('/citizen-login')}
            >
              Report an Issue as Citizen
            </button>
            <button
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
              onClick={()=>navigate('/officer-login')}
            >
              Municipality Dashboard Access
            </button>
          </div>
        ) : (
          <div className="mt-6 text-lg">

            {user.type === 'citizen' ? (
              <>
                <p className="mb-4">Welcome back, <span className="font-semibold">{user.name}</span>! Ready to report a new issue?</p>
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => navigate('/submit-complaint')}
                >
                  Submit New Complaint
                </button>
              </>
            ) : (
              <>
                <p className="mb-4">Welcome, Municipality Officer <span className="font-semibold">{user.name}</span></p>
                <button
                  className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition"
                  onClick={() => navigate('/department')}
                >
                  Go to Dashboard
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Map Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Issues in Your Area</h2>
        <div className="h-96 border rounded-xl overflow-hidden shadow-md">
          <ComplaintMap
            complaints={complaints}
            center={
              selectedComplaint
                ? [selectedComplaint.location?.latitude || 0, selectedComplaint.location?.longitude || 0]
                : [51.505, -0.09]
            }
            zoom={selectedComplaint ? 15 : 13}
            onMarkerClick={setSelectedComplaint}
          />
        </div>
      </section>

      {/* Recent Complaints */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Recently Reported Issues</h2>
          {complaints.length > 5 && (
            <button
              className="text-blue-600 hover:underline"
              onClick={() => navigate('/complaints')}
            >
              View All
            </button>
          )}
        </div>
        <ComplaintList
          complaints={complaints.slice(0, 5)}
          onSelect={setSelectedComplaint}
          selectedId={selectedComplaint?.id}
        />
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">How ReportHub Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              number: '1',
              title: 'Report',
              desc: 'Citizens report issues with photos and location',
            },
            {
              number: '2',
              title: 'Analyze',
              desc: 'Our AI clusters similar issues for efficient resolution',
            },
            {
              number: '3',
              title: 'Resolve',
              desc: 'Municipality teams address prioritized complaints',
            },
          ].map((step) => (
            <div key={step.number} className="text-center bg-white p-4 rounded-lg shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">{step.number}</div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-600 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="text-center bg-blue-100 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Ready to Make a Difference?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate('/citizen-login')}
            >
              Join as Citizen Reporter
            </button>
            <button
              className="bg-white border border-gray-400 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-100 transition"
              onClick={() => navigate('/officer-login')}
            >
              Municipality Login
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
