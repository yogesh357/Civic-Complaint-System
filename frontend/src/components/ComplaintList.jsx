 
import React from 'react';
import { useComplaintContext } from '../context/ComplaintContext';
import { useAuthContext } from '../context/AuthContext';

const ComplaintList = ({ onSelect }) => {
  const { complaints } = useComplaintContext();

  const { navigate } = useAuthContext()
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      case 'resolved':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="complaint-list mt-10 mx-12">
      {/* <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Recent Complaints </h3> */}

      {complaints.length === 0 ? (
        <div className="text-center flex flex-col items-center justify-center gap-4 text-gray-600 p-10 border-2 border-dashed border-gray-300 rounded-2xl shadow-sm bg-gray-50">
          <div className="text-4xl">🚫</div>
          <p className="text-lg font-medium">No complaints found</p>
          <p className="text-sm text-gray-500">Looks like everything’s calm for now. Want to report something?</p>

          <button
            onClick={() => navigate('/submit-complaint')}
            className="mt-4 px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all shadow-sm"
          >
            ➕ Add Complaint
          </button>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint, index) => (
            <div
              key={index}
              onClick={() => {onSelect?.(complaint);
                navigate(`/track-complaint?id=${complaint.id}`)
              }}
              className="border rounded-2xl p-5 shadow hover:shadow-lg transition cursor-pointer bg-white"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-600 capitalize">{complaint.category}</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(complaint.status)}`}
                >
                  {complaint.status}
                </span>
              </div>

              <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                {complaint.description}
              </p>

              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  📍 {complaint.location }
                </span>
                <span>
                  🕒 {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
