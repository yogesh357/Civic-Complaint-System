import React from 'react';

const ComplaintList = ({ complaints, onSelect }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'orange';
      case 'in-progress': return 'blue';
      case 'resolved': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="complaint-list">
      <h3>Recent Complaints</h3>
      <div className="list-container">
        {complaints.map((complaint, index) => (
          <div 
            key={index} 
            className="complaint-card"
            onClick={() => onSelect(complaint)}
          >
            <div className="card-header">
              <span className="category">{complaint.category}</span>
              <span 
                className="status" 
                style={{ backgroundColor: getStatusColor(complaint.status) }}
              >
                {complaint.status}
              </span>
            </div>
            <p className="description">{complaint.description}</p>
            <div className="card-footer">
              <span className="location">
                {complaint.location.address || `${complaint.location.latitude}, ${complaint.location.longitude}`}
              </span>
              <span className="date">
                {new Date(complaint.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintList;