// import React, { useState } from 'react';
// import { useGeolocation } from '../services/geolocation';

// const ComplaintForm = ({ onSubmit }) => {
//   const [category, setCategory] = useState('pothole');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(null);
//   const [useManualLocation, setUseManualLocation] = useState(false);
//   const [manualCoords, setManualCoords] = useState('');
//   const { location, error: locationError, isLoading } = useGeolocation();

//   const categories = [
//     'pothole', 'streetlight', 'garbage', 'water', 'sewage', 'road', 'other'
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     let finalLocation = location;

//     if (useManualLocation && manualCoords) {
//       const [lat, lng] = manualCoords.split(',').map(coord => parseFloat(coord.trim()));
//       if (!isNaN(lat) && !isNaN(lng)) {
//         finalLocation = { latitude: lat, longitude: lng };
//       } else {
//         alert('Please enter valid coordinates in "latitude,longitude" format');
//         return;
//       }
//     }

//     if (!finalLocation) {
//       alert('Please provide a location for your complaint');
//       return;
//     }

//     const complaint = {
//       category,
//       description,
//       location: finalLocation,
//       image,
//       timestamp: new Date().toISOString()
//     };
//     onSubmit(complaint);
//   };

//   return (
//     <div className="mx-auto bg-gray-100  w-full ">
//       <h2 className='text-xl font-bold px-20  mx-auto py-5'>Report an Issue</h2>
//       <form
//         className='px-20 py-10'
//         onSubmit={handleSubmit}>
//         <div className="form-group ">
//           <label>Issue Type</label>
//           <select
//             className='bg-gray-200 mt-5'
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             required
//           >
//             {categories.map(cat => (
//               <option key={cat} value={cat}>{cat}</option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Description</label>
//           <textarea
//             className='bg-gray-200 mt-5'
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//             placeholder="Please describe the issue in detail..."
//           />
//         </div>

//         <div className="form-group">
//           <label>Upload Photo (Optional)</label>
//           <input
//             className='bg-gray-200 mt-5'
//             type="file"
//             accept="image/*"
//             onChange={(e) => setImage(e.target.files[0])}
//           />
//         </div>

//         <div className="location-section">
//           <h3>Location Information</h3>

//           {isLoading ? (
//             <p>Detecting your location...</p>
//           ) : locationError ? (
//             <div className="location-error">
//               <p className="error-message">⚠️ {locationError}</p>
//               <div className="manual-location-fallback">
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={useManualLocation}
//                     onChange={(e) => setUseManualLocation(e.target.checked)}
//                   />
//                   Enter location manually
//                 </label>

//                 {useManualLocation && (
//                   <div className="manual-coords-input">
//                     <input
//                       className='bg-gray-200 mt-5'
//                       type="text"
//                       value={manualCoords}
//                       onChange={(e) => setManualCoords(e.target.value)}
//                       placeholder="e.g., 51.505,-0.09"
//                       required
//                     />
//                     <small>Enter latitude,longitude coordinates</small>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : location && (
//             <div className="location-info">
//               <p>Detected location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
//               <label>
//                 <input
//                   className='mt-5'
//                   type="checkbox"
//                   checked={useManualLocation}
//                   onChange={(e) => setUseManualLocation(e.target.checked)}
//                 />
//                 Use different location
//               </label>
//               {useManualLocation && (
//                 <div className="manual-coords-input">
//                   <input
//                     className='bg-gray-200 mt-5'
//                     type="text"
//                     value={manualCoords}
//                     onChange={(e) => setManualCoords(e.target.value)}
//                     placeholder="e.g., 51.505,-0.09"
//                     required
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <button type="submit" className="submit-btn" disabled={isLoading}>
//           {isLoading ? 'Submitting...' : 'Submit Complaint'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ComplaintForm;
import React, { useState } from 'react';
import { useGeolocation } from '../services/geolocation';
import LocationPicker from './LocationPicker';

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
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 my-10 z-10 shadow-black">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Report an Issue</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Issue Type</label>
          <select
            className="w-full p-2 bg-gray-100 rounded border border-gray-300"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            className="w-full p-2 h-28 bg-gray-100 rounded border border-gray-300 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Please describe the issue in detail..."
          />
        </div>

        {/* Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Upload Photo (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full bg-gray-100 border border-gray-300 rounded p-2"
          />
        </div>

        {/* Location Info */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Location Information</h3>

          {isLoading ? (
            <p className="text-yellow-600">Detecting your location...</p>
          ) : locationError ? (
            <div>
              <p className="text-red-600 font-medium mb-2">⚠️ {locationError}</p>
              <label className="block mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={useManualLocation}
                  onChange={(e) => setUseManualLocation(e.target.checked)}
                />
                Enter location manually
              </label>

              {useManualLocation && (
                <div>
                  {/* <input
                    type="text"
                    value={manualCoords}
                    onChange={(e) => setManualCoords(e.target.value)}
                    placeholder="e.g., 51.505,-0.09"
                    className="w-full p-2 bg-gray-100 rounded border border-gray-300"
                    required
                  />
                  <small className="text-sm text-gray-500">Enter latitude,longitude coordinates</small> */}
                  <LocationPicker/>
                </div>
              )}
            </div>
          ) : location && (
            <div>
              <p className="text-green-700 font-medium mb-2">
                Detected location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>

              <label className="block mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={useManualLocation}
                  onChange={(e) => setUseManualLocation(e.target.checked)}
                />
                Use different location
              </label>

              {useManualLocation && (
                <input
                  type="text"
                  value={manualCoords}
                  onChange={(e) => setManualCoords(e.target.value)}
                  placeholder="e.g., 51.505,-0.09"
                  className="w-full p-2 bg-gray-100 rounded border border-gray-300"
                  required
                />
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded text-white font-semibold ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } transition duration-200`}
        >
          {isLoading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
