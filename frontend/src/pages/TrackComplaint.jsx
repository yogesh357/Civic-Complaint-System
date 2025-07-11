import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatusTracker from '../components/StatusTracker';
import { fetchComplaintById, updateComplaintStatus } from '../services/complaintApi';
import { useAuthContext } from '../context/AuthContext';
import { trackComplaint } from '../services/adminApi';

const statusOptions = [
  { value: 'submitted', label: 'Submitted', color: 'bg-gray-300' },
  { value: 'under_review', label: 'Under Review', color: 'bg-blue-300' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-300' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-300' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-300' }
];

const getStatusMeta = (value) => {
  return statusOptions.find((s) => s.value === value) || {
    label: value,
    color: 'bg-gray-300'
  };
};

const TrackComplaint = () => {

  const { userType } = useAuthContext()

  const [searchParams] = useSearchParams();
  const complaintId = searchParams.get('id');
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusForm, setStatusForm] = useState({
    show: false,
    loading: false,
    newStatus: '',
    comment: ''
  });

  useEffect(() => {
    const loadComplaint = async () => {
      try {
        if (!complaintId) throw new Error('No complaint ID provided');
        let response;
        if (userType == "USER") {
          response = await fetchComplaintById(complaintId);
        } else if (userType == "ADMIN") {
          response = await trackComplaint(complaintId)
        }

        const complaintData = response.data;

        if (!complaintData) throw new Error('No complaint data received');

        setComplaint(complaintData);
        setStatusForm((prev) => ({ ...prev, newStatus: complaintData.status }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [complaintId]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setStatusForm((prev) => ({ ...prev, loading: true }));
    try {
      const updatedComplaint = await updateComplaintStatus(complaintId, {
        status: statusForm.newStatus,
        adminComment: statusForm.comment
      });
      toast.success('Status updated successfully!');
      setComplaint(updatedComplaint);
      setStatusForm({ show: false, loading: false, newStatus: updatedComplaint.status, comment: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to update complaint status');
      setStatusForm((prev) => ({ ...prev, loading: false }));
    }
  };

  // UI Rendering

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
          Go Back
        </button>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No complaint found</h2>
        <button
          onClick={() => navigate('/submit-complaint')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
        >
          Submit New Complaint
        </button>
      </div>
    );
  }

  const statusMeta = getStatusMeta(complaint.status);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl mb-10 mt-5">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Track Your Complaint</h1>

      <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 capitalize mr-4">{complaint.category}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMeta.color}`}>
            {statusMeta.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600 font-medium">Description:</p>
            <p className="text-gray-800">{complaint.description}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Location:</p>
            <p className="text-gray-800">
              {complaint.location
                ? complaint.location.split(',').map((part, idx) => (
                  <span key={idx} className="block">
                    {part.trim()}
                  </span>
                ))
                : 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Date Reported:</p>
            <p className="text-gray-800">{new Date(complaint.updatedAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Complaint ID:</p>
            <p className="text-gray-800 font-mono">{complaint.id}</p>
          </div>
        </div>

        {complaint.image ? (
          <div className="mt-4">
            <p className="text-gray-600 font-medium mb-2">Evidence:</p>
            <img
              src={complaint.image}
              alt="Complaint evidence"
              className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200"
            />
          </div>
        ) : (
          <p className="text-sm italic text-gray-500">No image provided.</p>
        )}
      </div>

      {/* user details */}
      {userType === 'ADMIN' && complaint.user && (
        <div className=" text-sm text-gray-600  bg-gray-50 p-6 rounded-lg shadow-sm  mb-8">
          <p><span className="font-bold">Filed by :</span> {complaint.user.name}</p>
          <p><span className="font-bold">Email :</span> {complaint.user.email}</p>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Status Progress</h3>
        <StatusTracker status={complaint.status} />
      </div>



      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Estimated Resolution Time</h3>
        <p className="text-blue-700">Based on similar issues, we expect to resolve this within 7-10 business days</p>
      </div>

      {complaint.adminComment && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Admin Note</h3>
          <p className="text-yellow-700">{complaint.adminComment}</p>
        </div>
      )}

      {/* //:::::::::::: Create Only for admin :::::::::::: */}

      {statusForm.show && (
        <div className="bg-gray-100 p-4 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-3">Update Status</h3>
          <form onSubmit={handleStatusUpdate}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">New Status</label>
              <select
                value={statusForm.newStatus}
                onChange={(e) => setStatusForm((prev) => ({ ...prev, newStatus: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Comment (Optional)</label>
              <textarea
                value={statusForm.comment}
                onChange={(e) => setStatusForm((prev) => ({ ...prev, comment: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
                placeholder="Add any additional notes..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={statusForm.loading}
                className={`px-4 py-2 rounded text-white ${statusForm.loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {statusForm.loading ? 'Updating...' : 'Update Status'}
              </button>
              <button
                type="button"
                onClick={() => setStatusForm((prev) => ({ ...prev, show: false }))}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
        >
          Back to List
        </button>
        {/* <button
          onClick={() => setStatusForm((prev) => ({ ...prev, show: !prev.show }))}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          {statusForm.show
            ? 'Hide Update Form'
            : userType === 'ADMIN'
              ? 'Update Status'
              : null}

        </button> */}
        {userType === 'ADMIN' && (
          <button
            onClick={() => setStatusForm((prev) => ({ ...prev, show: !prev.show }))}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            {statusForm.show ? 'Hide Update Form' : 'Update Status'}
          </button>
        )}

      </div>
    </div>
  );
};

export default TrackComplaint;
