import React, { useState, useEffect } from 'react';
import ComplaintMap from './ComplaintMap';
import ComplaintList from './ComplaintList';
import ClusterAnalysis from './ClusterAnalysis';
import { updateComplaintStatus } from '../services/api';

const DepartmentDashboard = ({ complaints: initialComplaints = [] }) => {  // Added default value
  const [complaints, setComplaints] = useState(initialComplaints || []);    // Double safety
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [view, setView] = useState('map');
  const [filter, setFilter] = useState('all');
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState(null);

  // Update local complaints if parent data changes
  useEffect(() => {
    setComplaints(initialComplaints || []);
  }, [initialComplaints]);

  // Safely filter complaints
  const filteredComplaints = (complaints || []).filter(complaint => 
    filter === 'all' || complaint?.status === filter
  );

  const handleStatusChange = async (complaintId, newStatus) => {
    if (!complaintId) return;
    
    setIsUpdating(true);
    try {
      const updatedComplaint = await updateComplaintStatus(complaintId, newStatus);
      
      setComplaints(prev => 
        (prev || []).map(c => c?.id === complaintId ? updatedComplaint : c)
      );
      
      setSelectedComplaint(updatedComplaint);
      setNotification({
        type: 'success',
        message: 'Status updated successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update status. Please try again.'
      });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Auto-close notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Calculate stats safely
  const stats = {
    total: complaints?.length || 0,
    pending: complaints?.filter(c => c?.status === 'pending').length || 0,
    inProgress: complaints?.filter(c => c?.status === 'in-progress').length || 0,
    resolved: complaints?.filter(c => c?.status === 'resolved').length || 0
  };

  return (
    <div className="department-dashboard">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="dashboard-header">
        <div className="header-left">
          <h2>Department Dashboard</h2>
          <div className="stats">
            <span>Total: {stats.total}</span>
            <span>Pending: {stats.pending}</span>
            <span>In Progress: {stats.inProgress}</span>
            <span>Resolved: {stats.resolved}</span>
          </div>
        </div>
        
        <div className="controls">
          <div className="filter-group">
            <label>Filter:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              disabled={isUpdating}
            >
              <option value="all">All Complaints</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div className="view-toggle">
            <button 
              className={view === 'map' ? 'active' : ''}
              onClick={() => setView('map')}
              disabled={isUpdating}
            >
              <i className="fas fa-map"></i> Map
            </button>
            <button 
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
              disabled={isUpdating}
            >
              <i className="fas fa-list"></i> List
            </button>
            <button 
              className={view === 'analysis' ? 'active' : ''}
              onClick={() => setView('analysis')}
              disabled={isUpdating}
            >
              <i className="fas fa-chart-line"></i> Analysis
            </button>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        {view === 'map' && (
          <ComplaintMap 
            complaints={filteredComplaints} 
            center={selectedComplaint ? 
              [selectedComplaint.location?.latitude || 0, 
               selectedComplaint.location?.longitude || 0] : null}
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
      </div>
      
      {selectedComplaint && (
        <div className="complaint-detail">
          <div className="detail-header">
            <h3>Complaint #{selectedComplaint.id || 'N/A'}</h3>
            <button 
              onClick={() => setSelectedComplaint(null)}
              className="close-btn"
            >
              &times;
            </button>
          </div>
          
          <div className="detail-body">
            <div className="detail-section">
              <label>Type:</label>
              <p className="category-badge">{selectedComplaint.category || 'Unknown'}</p>
            </div>
            
            <div className="detail-section">
              <label>Description:</label>
              <p>{selectedComplaint.description || 'No description provided'}</p>
            </div>
            
            <div className="detail-section">
              <label>Location:</label>
              <p>{selectedComplaint.location?.address || 'No address provided'}</p>
              <small>
                {selectedComplaint.location?.latitude?.toFixed(6) || '0'}, 
                {selectedComplaint.location?.longitude?.toFixed(6) || '0'}
              </small>
            </div>
            
            <div className="detail-section">
              <label>Status:</label>
              <select 
                value={selectedComplaint.status || 'pending'}
                onChange={(e) => handleStatusChange(selectedComplaint.id, e.target.value)}
                disabled={isUpdating}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <div className="detail-section">
              <label>Reported:</label>
              <p>
                {selectedComplaint.timestamp ? 
                  new Date(selectedComplaint.timestamp).toLocaleString() : 
                  'Unknown date'}
              </p>
            </div>
            
            {selectedComplaint.image && (
              <div className="detail-section">
                <label>Image:</label>
                <img 
                  src={selectedComplaint.image} 
                  alt="Complaint evidence" 
                  className="complaint-image"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDashboard;