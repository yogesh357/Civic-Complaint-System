 
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Current Status: <span className="text-blue-600">{statusSteps[currentIndex]?.label || 'Unknown'}</span>
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const statusColor = isCompleted ?
            (step.id === 'REJECTED' ? 'bg-red-500' : 'bg-green-500') : 'bg-gray-300';

          return (
            <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
              {/* Step marker */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${statusColor} flex items-center justify-center z-10`}>
                {isCompleted ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-semibold text-white">{index + 1}</span>
                )}
              </div>

              {/* Step content */}
              <div className={`ml-4 p-4 rounded-lg flex-1 ${isCurrent ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-600'}`}>
                  {step.label}
                  {isCurrent && (
                    <span className="ml-2 px-2 py-1 text-xs font-bold text-blue-800 bg-blue-100 rounded-full">
                      Current
                    </span>
                  )}
                </h4>
                <p className="text-gray-600 mt-1">{step.description}</p>

                {/* Additional status info for current step */}
                {isCurrent && (
                  <div className="mt-2 text-sm text-gray-500">
                    {step.id === 'REJECTED' ? (
                      <span className="text-red-600">Please check your email for details</span>
                    ) : step.id === 'RESOLVED' ? (
                      <span className="text-green-600">Thank you for your patience</span>
                    ) : (
                      <span>Estimated completion: 3-5 business days</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTracker;