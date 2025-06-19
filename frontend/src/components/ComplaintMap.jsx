// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default marker icons (ES modules version)
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix leaflet default icon
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: iconRetina,
//   iconUrl: icon,
//   shadowUrl: iconShadow,
// });

// const ComplaintMap = ({ complaints, center, zoom }) => {
//   const getIcon = (category) => {
//     const iconSize = 25;
//     return new L.Icon({
//       iconUrl: getIconUrl(category),
//       iconSize: [iconSize, iconSize],
//     });
//   };

//   const getIconUrl = (category) => {
//     // Implement your custom icon logic here
//     return icon; // Using default icon for all categories for now
//   };

//   return (
//     <div className="complaint-map">
//       <MapContainer 
//         center={center || [51.505, -0.09]} 
//         zoom={zoom || 13} 
//         style={{ height: '100%', width: '100%' }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
        
//         {complaints.map((complaint, index) => (
//           <Marker
//             key={index}
//             position={[complaint.location.latitude, complaint.location.longitude]}
//             icon={getIcon(complaint.category)}
//           >
//             <Popup>
//               <div>
//                 <h4>{complaint.category}</h4>
//                 <p>{complaint.description}</p>
//                 <small>{new Date(complaint.timestamp).toLocaleString()}</small>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

// export default ComplaintMap;

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import marker images
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet default icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: iconShadow,
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ComplaintMap = ({ complaints = [], center, zoom }) => {
  // Custom icons by category
  const categoryIcons = {
    pothole: DefaultIcon,
    streetlight: L.divIcon({
      html: '💡',
      className: 'custom-icon',
      iconSize: [25, 25]
    }),
    garbage: L.divIcon({
      html: '🗑️',
      className: 'custom-icon',
      iconSize: [25, 25]
    }),
    // Add more categories as needed
  };

  return (
    <div className="complaint-map" style={{ height: '500px', width: '100%' }}>
      <MapContainer 
        center={center || [51.505, -0.09]} 
        zoom={zoom || 13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {complaints.map((complaint) => (
          <Marker
            key={complaint.id || `${complaint.location.latitude}-${complaint.location.longitude}`}
            position={[complaint.location.latitude, complaint.location.longitude]}
            icon={categoryIcons[complaint.category] || DefaultIcon}
          >
            <Popup>
              <div>
                <h4 style={{ textTransform: 'capitalize' }}>{complaint.category}</h4>
                <p>{complaint.description}</p>
                {complaint.image && (
                  <img 
                    src={complaint.image} 
                    alt="Complaint evidence" 
                    style={{ maxWidth: '150px', marginTop: '10px' }}
                  />
                )}
                <small>
                  Reported: {new Date(complaint.timestamp).toLocaleString()}
                </small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ComplaintMap;