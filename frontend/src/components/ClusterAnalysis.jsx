import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const ClusterAnalysis = ({ complaints }) => {
  // This is a simplified example - in a real app you'd get clustered data from your backend
  const clusterData = {
    clusters: [
      {
        label: 'Potholes',
        data: complaints
          .filter(c => c.category === 'pothole')
          .map(c => ({
            x: c.location.latitude,
            y: c.location.longitude
          })),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Streetlights',
        data: complaints
          .filter(c => c.category === 'streetlight')
          .map(c => ({
            x: c.location.latitude,
            y: c.location.longitude
          })),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      // Add more clusters as needed
    ],
    hotspots: [
      // Areas with high concentration of issues
      { x: 51.505, y: -0.09, radius: 15, label: 'Hotspot 1' }
    ]
  };

  const data = {
    datasets: [
      ...clusterData.clusters,
      {
        label: 'Hotspots',
        data: clusterData.hotspots.map(h => ({ x: h.x, y: h.y })),
        pointRadius: clusterData.hotspots.map(h => h.radius),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      }
    ]
  };

  const options = {
    scales: {
      x: { title: { display: true, text: 'Latitude' } },
      y: { title: { display: true, text: 'Longitude' } }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            if (label === 'Hotspots') {
              const hotspot = clusterData.hotspots[context.dataIndex];
              return `${label}: ${hotspot.label}`;
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="cluster-analysis">
      <h3>AI-Powered Issue Clustering</h3>
      <div className="chart-container">
        <Scatter data={data} options={options} />
      </div>
      
      <div className="insights">
        <h4>Resource Allocation Recommendations</h4>
        <ul>
          <li>Prioritize pothole repairs in the downtown area (Hotspot 1)</li>
          <li>Schedule streetlight maintenance along Main Street</li>
          <li>Deploy additional garbage bins in the park district</li>
        </ul>
      </div>
    </div>
  );
};

export default ClusterAnalysis;