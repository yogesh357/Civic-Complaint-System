


import React from 'react';
import { useAuthContext } from '../context/AuthContext';

function ComplaintCard({ complaints }) {
    const { navigate } = useAuthContext();

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {complaints.map((complaint) => (
                <div
                    key={complaint.id}
                    onClick={() => navigate(`/track-complaint?id=${complaint.id}`)}
                    
                    className="bg-white rounded-2xl p-5 shadow-even shadow-even-hover transition-shadow duration-200 cursor-pointer"



                >
                    {/* Top Row: Category + Status */}
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                            {complaint.category || 'Uncategorized'}
                        </span>
                        <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(complaint.status)}`}
                        >
                            {complaint.status}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                        {complaint.description || 'No description provided.'}
                    </p>

                    {/* Footer: Location + Time */}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span className="truncate max-w-[60%]">
                            📍 {complaint.location || 'Unknown location'}
                        </span>
                        <span>
                            🕒 {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ComplaintCard;

