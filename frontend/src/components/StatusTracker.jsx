import React from 'react';

const statusSteps = [
  { id: 'submitted', label: 'Submitted', description: 'Your complaint has been received' },
  { id: 'reviewed', label: 'Under Review', description: 'Department is assessing the issue' },
  { id: 'assigned', label: 'Assigned', description: 'Team has been assigned to resolve' },
  { id: 'in-progress', label: 'In Progress', description: 'Work is underway' },
  { id: 'resolved', label: 'Resolved', description: 'Issue has been fixed' }
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