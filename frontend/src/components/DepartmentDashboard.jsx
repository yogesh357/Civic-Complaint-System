
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { ErrorBoundary } from 'react-error-boundary';
import ComplaintMap from './ComplaintMap';
import ComplaintList from './ComplaintList';
import ClusterAnalysis from './ClusterAnalysis';
import { updateComplaintStatus } from '../services/complaintApi';


const DepartmentDashboard = ({ complaints: initialComplaints = [] }) => {
  // Initialize state with props only once
  const [complaints, setComplaints] = useState(initialComplaints || []);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [view, setView] = useState('map');
  const [filter, setFilter] = useState('all');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update complaints when props change
  useEffect(() => {
    // Compare lengths and first item to avoid unnecessary updates
    if (initialComplaints.length !== complaints.length ||
      initialComplaints[0]?.id !== complaints[0]?.id) {
      setComplaints(initialComplaints || []);
    }
  }, [initialComplaints]);

  // Filter complaints efficiently
  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint =>
      filter === 'all' || complaint.status === filter
    );
  }, [complaints, filter]);

  // Calculate stats efficiently
  const stats = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  }), [complaints]);

  // Handle status changes
  const handleStatusChange = async (complaintId, newStatus) => {
    if (!complaintId) return;

    setIsUpdating(true);
    setIsLoading(true);

    try {
      const updatedComplaint = await updateComplaintStatus(complaintId, newStatus);

      setComplaints(prev =>
        prev.map(c => c.id === complaintId ? updatedComplaint : c)
      );

      setSelectedComplaint(updatedComplaint);
      toast.success('Status updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
      setIsLoading(false);
    }
  };

  // Error boundary fallback component
  const ErrorFallback = ({ error }) => (
    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
      <h3 className="text-red-800 font-medium">Something went wrong</h3>
      <p className="text-red-600">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
      >
        Reload
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Header Section */}
      <header className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Department Dashboard</h1>
            <div className="flex flex-wrap gap-4 mt-2">
              <StatCard label="Total" value={stats.total} />
              <StatCard label="Pending" value={stats.pending} variant="warning" />
              <StatCard label="In Progress" value={stats.inProgress} variant="info" />
              <StatCard label="Resolved" value={stats.resolved} variant="success" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                disabled={isUpdating}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Complaints</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="flex border rounded-md overflow-hidden">
              <ViewToggleButton
                active={view === 'map'}
                onClick={() => setView('map')}
                icon="map"
                label="Map"
                disabled={isUpdating}
              />
              <ViewToggleButton
                active={view === 'list'}
                onClick={() => setView('list')}
                icon="list"
                label="List"
                disabled={isUpdating}
              />
              <ViewToggleButton
                active={view === 'analysis'}
                onClick={() => setView('analysis')}
                icon="chart-line"
                label="Analysis"
                disabled={isUpdating}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1   gap-6">
        <div className={`lg:col-span-${selectedComplaint ? '2' : '3'}`}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {view === 'map' && (
              <ComplaintMap
                complaints={filteredComplaints}
                center={selectedComplaint?.location}
                onMarkerClick={setSelectedComplaint}
              />
            )}

            {view === 'list' && (
              <ComplaintList
                complaints={filteredComplaints}
                onSelect={setSelectedComplaint}
                selectedId={selectedComplaint?.id}
              />
            )}

            {view === 'analysis' && (
              <ClusterAnalysis complaints={filteredComplaints} />
            )}
          </ErrorBoundary>
        </div>

        {/* Complaint Detail Sidebar */}
        {selectedComplaint && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Complaint #{selectedComplaint.id}
              </h2>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close complaint details"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4">
              <DetailSection label="Type">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${selectedComplaint.category === 'Road'
                  ? 'bg-blue-100 text-blue-800'
                  : selectedComplaint.category === 'Sanitation'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                  {selectedComplaint.category || 'Unknown'}
                </span>
              </DetailSection>

              <DetailSection label="Description">
                <p className="text-gray-700">
                  {selectedComplaint.description || 'No description provided'}
                </p>
              </DetailSection>

              <DetailSection label="Location">
                <p className="text-gray-700">
                  {selectedComplaint.location?.address || 'No address provided'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedComplaint.location?.latitude?.toFixed(6)},
                  {selectedComplaint.location?.longitude?.toFixed(6)}
                </p>
              </DetailSection>

              <DetailSection label="Status">
                <select
                  value={selectedComplaint.status}
                  onChange={(e) => handleStatusChange(selectedComplaint.id, e.target.value)}
                  disabled={isUpdating}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </DetailSection>

              <DetailSection label="Reported">
                <p className="text-gray-700">
                  {selectedComplaint.timestamp
                    ? new Date(selectedComplaint.timestamp).toLocaleString()
                    : 'Unknown date'}
                </p>
              </DetailSection>

              {selectedComplaint.image && (
                <DetailSection label="Image">
                  <img
                    src={selectedComplaint.image}
                    alt="Complaint evidence"
                    className="max-w-full h-auto rounded border border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <p className="text-sm text-gray-500 hidden">Image failed to load</p>
                </DetailSection>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Helper Components
const StatCard = ({ label, value, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800'
  };

  return (
    <div className={`px-3 py-2 rounded-md ${variantClasses[variant]}`}>
      <span className="text-sm font-medium">{label}: </span>
      <span className="font-bold">{value}</span>
    </div>
  );
};

const ViewToggleButton = ({ active, onClick, icon, label, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`px-3 py-2 text-sm font-medium flex items-center gap-1 ${active
        ? 'bg-blue-500 text-white'
        : 'bg-white text-gray-700 hover:bg-gray-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <i className={`fas fa-${icon}`}></i>
      {label}
    </button>
  );
};

const DetailSection = ({ label, children }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="mt-1">
        {children}
      </div>
    </div>
  );
};

export default React.memo(DepartmentDashboard);