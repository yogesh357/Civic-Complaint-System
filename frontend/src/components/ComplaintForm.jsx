import React, { useState } from 'react';
import { useGeolocation } from '../services/geolocation';

const ComplaintForm = ({ onSubmit }) => {
  const [category, setCategory] = useState('pothole');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [useManualLocation, setUseManualLocation] = useState(false);
  const [manualCoords, setManualCoords] = useState('');
  const { location, error: locationError, isLoading } = useGeolocation();
  
  const categories = [
    'pothole', 'streetlight', 'garbage', 'water', 'sewage', 'road', 'other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let finalLocation = location;
    
    if (useManualLocation && manualCoords) {
      const [lat, lng] = manualCoords.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        finalLocation = { latitude: lat, longitude: lng };
      } else {
        alert('Please enter valid coordinates in "latitude,longitude" format');
        return;
      }
    }

    if (!finalLocation) {
      alert('Please provide a location for your complaint');
      return;
    }

    const complaint = {
      category,
      description,
      location: finalLocation,
      image,
      timestamp: new Date().toISOString()
    };
    onSubmit(complaint);
  };

  return (
    <div className="complaint-form">
      <h2>Report an Issue</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Issue Type</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Please describe the issue in detail..."
          />
        </div>
        
        <div className="form-group">
          <label>Upload Photo (Optional)</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        
        <div className="location-section">
          <h3>Location Information</h3>
          
          {isLoading ? (
            <p>Detecting your location...</p>
          ) : locationError ? (
            <div className="location-error">
              <p className="error-message">⚠️ {locationError}</p>
              <div className="manual-location-fallback">
                <label>
                  <input
                    type="checkbox"
                    checked={useManualLocation}
                    onChange={(e) => setUseManualLocation(e.target.checked)}
                  />
                  Enter location manually
                </label>
                
                {useManualLocation && (
                  <div className="manual-coords-input">
                    <input
                      type="text"
                      value={manualCoords}
                      onChange={(e) => setManualCoords(e.target.value)}
                      placeholder="e.g., 51.505,-0.09"
                      required
                    />
                    <small>Enter latitude,longitude coordinates</small>
                  </div>
                )}
              </div>
            </div>
          ) : location && (
            <div className="location-info">
              <p>Detected location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
              <label>
                <input
                  type="checkbox"
                  checked={useManualLocation}
                  onChange={(e) => setUseManualLocation(e.target.checked)}
                />
                Use different location
              </label>
              {useManualLocation && (
                <div className="manual-coords-input">
                  <input
                    type="text"
                    value={manualCoords}
                    onChange={(e) => setManualCoords(e.target.value)}
                    placeholder="e.g., 51.505,-0.09"
                    required
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;