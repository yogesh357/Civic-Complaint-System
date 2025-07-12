
import React from 'react';
import { useComplaintContext } from '../context/ComplaintContext';
import { useAuthContext } from '../context/AuthContext';
import ComplaintCard from './ComplaintCard';

const ComplaintList = () => {
  const { loading, complaints } = useComplaintContext();

  const { navigate } = useAuthContext()


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-lg">Loading complaints...</div>
      </div>
    );
  }

  return (
    <div className="complaint-list mt-10 mx-12 mb-10">
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
        <ComplaintCard complaints={complaints} />
      )}
    </div>


  )
};


export default ComplaintList;
