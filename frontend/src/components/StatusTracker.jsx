import React from 'react';

const statusSteps = [
  { id: 'PENDING', label: 'Pending', description: 'Your complaint has been received' },
  { id: 'UNDER_REVIEW', label: 'Under Review', description: 'Department is assessing the issue' },
  { id: 'IN_PROGRESS', label: 'In Progress', description: 'Work is underway' },
  { id: 'RESOLVED', label: 'Resolved', description: 'Issue has been fixed' },
  { id: 'REJECTED', label: 'Rejected', description: 'Complaint was not approved' }
];

const StatusTracker = ({ status }) => {
  const currentIndex = statusSteps.findIndex(step => step.id === status) || 0;

  return (
    <div className="status-tracker">
      <h2>Current Status: {statusSteps[currentIndex]?.label || 'Unknown'}</h2>
      <div className="timeline">
        {statusSteps.map((step, index) => (
          <div
            key={step.id}
            className={`timeline-step ${index <= currentIndex ? 'completed' : ''}`}
          >
            <div className="step-marker"></div>
            <div className="step-info">
              <h4>{step.label}</h4>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusTracker;