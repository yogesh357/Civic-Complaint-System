import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const ClusterAnalysis = ({ complaints }) => {
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
    ],
    hotspots: [
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
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Latitude',
          font: { size: 14 }
        },
        ticks: { color: '#555' }
      },
      y: {
        title: {
          display: true,
          text: 'Longitude',
          font: { size: 14 }
        },
        ticks: { color: '#555' }
      }
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
      },
      legend: {
        labels: {
          font: { size: 12 },
          color: '#333'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2">
        📍 AI-Powered Issue Clustering
      </h3>

      <div className="h-[400px] border rounded-md overflow-hidden p-2 bg-gray-50">
        <Scatter data={data} options={options} />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-700 mb-2">
          🧠 Resource Allocation Recommendations
        </h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Prioritize pothole repairs in the downtown area (Hotspot 1)</li>
          <li>Schedule streetlight maintenance along Main Street</li>
          <li>Deploy additional garbage bins in the park district</li>
        </ul>
      </div>
    </div>
  );
};

export default ClusterAnalysis;
