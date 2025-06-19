import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import StatusTracker from '../components/StatusTracker';
import { fetchComplaintById } from '../services/api';

const TrackComplaint = () => {
  const [searchParams] = useSearchParams();
  const complaintId = searchParams.get('id');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComplaint = async () => {
      try {
        if (!complaintId) throw new Error('No complaint ID provided');
        const data = await fetchComplaintById(complaintId);
        setComplaint(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadComplaint();
  }, [complaintId]);

  if (loading) return <div>Loading complaint details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!complaint) return <div>No complaint found</div>;

  return (
    <div className="track-complaint-page">
      <h1>Track Your Complaint</h1>
      <div className="complaint-details">
        <h2>{complaint.category}</h2>
        <p><strong>Description:</strong> {complaint.description}</p>
        <p><strong>Location:</strong> {complaint.location.address || 'Not specified'}</p>
        <p><strong>Date Reported:</strong> {new Date(complaint.timestamp).toLocaleString()}</p>
      </div>
      
      <StatusTracker status={complaint.status} />
      
      <div className="estimated-resolution">
        <h3>Estimated Resolution Time</h3>
        <p>Based on similar issues, we expect to resolve this within 7-10 business days</p>
      </div>
      
      {complaint.image && (
        <div className="complaint-image">
          <img 
            src={complaint.image} 
            alt="Complaint evidence" 
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          />
        </div>
      )}
    </div>
  );
};

export default TrackComplaint;