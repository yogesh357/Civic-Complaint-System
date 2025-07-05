import React from 'react';
import ComplaintForm from '../components/ComplaintForm';
import { useComplaintContext } from '../context/ComplaintContext';
import { useNavigate } from 'react-router-dom';

const SubmitComplaint = () => {
  const { addComplaint } = useComplaintContext();
  const navigate = useNavigate();
  const [submissionStatus, setSubmissionStatus] = React.useState(null);

  const handleSubmit = async (complaint) => {
    try {
      setSubmissionStatus('submitting');
      const newComplaint = await addComplaint(complaint);
      setSubmissionStatus('success');
      setTimeout(() => navigate(`/track-complaint?id=${newComplaint.id}`), 2000);
    } catch (error) {
      setSubmissionStatus('error');
    }
  };

  return (
    <div className=" ">
      <h1>Report a Civic Issue</h1>

      {submissionStatus === 'submitting' && (
        <div className="status-message">Submitting your complaint...</div>
      )}

      {submissionStatus === 'success' && (
        <div className="status-message success">
          Complaint submitted successfully! Redirecting...
        </div>
      )}

      {submissionStatus === 'error' && (
        <div className="status-message error">
          Failed to submit complaint. Please try again.
        </div>
      )}

      {!submissionStatus || submissionStatus === 'error' ? (
        <ComplaintForm onSubmit={handleSubmit} />
      ) : null}
    </div>
  );
};

export default SubmitComplaint;