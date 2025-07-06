import React from 'react';
import ComplaintForm from '../components/ComplaintForm';
import { useComplaintContext } from '../context/ComplaintContext';
import { useNavigate } from 'react-router-dom';

const SubmitComplaint = () => {
  const { addComplaint } = useComplaintContext();
  const navigate = useNavigate();
  const [submissionStatus, setSubmissionStatus] = React.useState(null);

  // const handleSubmit = async (complaint) => {
  //   try {
  //     setSubmissionStatus('submitting');
  //     const newComplaint = await addComplaint(complaint);
  //     setSubmissionStatus('success');
  //     setTimeout(() => navigate(`/track-complaint?id=${newComplaint.id}`), 2000);
  //     console.log("submited complaint is :", newComplaint)
  //   } catch (error) {
  //     setSubmissionStatus('error');
  //   }
  // };
  const handleSubmit = async (complaint) => {
    try {
      setSubmissionStatus('submitting');
      const response = await addComplaint(complaint);

      // Ensure we have the ID before navigating
      if (!response?.id) {
        throw new Error('No ID received in response');
      }

      console.log("Submitted complaint:", response);
      setSubmissionStatus('success');
      navigate(`/track-complaint?id=${response.id}`);

    } catch (error) {
      console.error("Submission error:", error);
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