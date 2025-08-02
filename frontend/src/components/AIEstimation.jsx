// import React, { useState } from 'react'
// import axiosInstance from '../services/axiosInstance'
// import LoopIcon from '@mui/icons-material/Loop';


// /*
// analyse response {
//   "primary_category": "road_issue",
//   "secondary_category": "pothole",
//   "urgency": "medium",
//   "time_estimate": {
//     "value": 4,
//     "unit": "hours"
//   },
//   "resources": {
//     "crew_size": 2,
//     "equipment": ["asphalt (hot or cold mix)", "shovel", "tamping tool", "broom", "safety cones", "truck"],
//     "difficulty": 2
//   },
//   "safety_concerns": "Potential hazard to vehicles and pedestrians; risk of tire or suspension damage and possible trip hazard if located in a pedestrian area.",
//   "priority": "medium",
//   "special_considerations": "Exact pothole size not specified; assuming medium size (1-2m) per standard guidelines. No image provided, so on-site assessment is recommended to confirm size and required materials. Weather and asphalt availability may affect repair scheduling."
// }
// */


// function AIEstimation({ complaintId }) {


//     const [analysis, setAnalysis] = useState("")
//     const [loadingAnalysis, setLoadingAnalysis] = useState(false)



//     const analyseComplaint = async () => {
//         setLoadingAnalysis(true)
//         setAnalysis("")
//         try {
//             const response = await axiosInstance.post(`/api/ai-estimator/${complaintId}`)
//             console.log("analyse response", response.data.analyzeData)
//             setAnalysis(response.data)

//         } catch (error) {
//             console.log("Error in analysing the complaint", error)
//         } finally {
//             setLoadingAnalysis(false)
//         }
//     }

//     return (
//         <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-8">
//             <h3 className="text-lg font-semibold text-blue-800 mb-2">Estimated Resolution Time </h3>
//             <p className="text-blue-700">Based on similar issues, we expect to resolve this within {analysis.time_estimate.value} {analysis.time_estimate.unit} </p>

//             <h3>

//             </h3>
//             <button
//                 onClick={() => {
//                     analyseComplaint()
//                 }}
//                 className='w-full py-3 mt-7 bg-indigo-700 border-black  hover:shadow-xl hover:bg-indigo-800 cursor-pointer text-white text-xl rounded-2xl'>
//                 {
//                     loadingAnalysis ? (
//                         <div >
//                             <LoopIcon className="animate-spin mx-5" />
//                             analysing ....
//                         </div>
//                     ) : ("Analyse Complaint useing AI")
//                 }
//             </button>
//         </div>
//     )
// }

// export default AIEstimation

import React, { useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import LoopIcon from '@mui/icons-material/Loop';

function AIEstimation({ complaintId }) {
    const [analysis, setAnalysis] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [error, setError] = useState(null);

    const analyseComplaint = async () => {
        setLoadingAnalysis(true);
        setAnalysis(null);
        setError(null);
        try {
            const response = await axiosInstance.post(`/api/ai-estimator/${complaintId}`);
            console.log("Full API response:", response);  // Add this line
            const analyzeData = typeof response.data.analyzeData === 'string'
                ? JSON.parse(response.data.analyzeData)
                : response.data.analyzeData;

            console.log("Parsed analysis data:", analyzeData);
            setAnalysis(analyzeData);
        } catch (error) {
            console.error("Error in analysing the complaint", error);
            setError("Failed to analyze complaint. Please try again.");
        } finally {
            setLoadingAnalysis(false);
        }
    };

    // Safe capitalize function
    const capitalize = (str) => {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Safe status color function
    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        switch (status.toLowerCase()) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-red-100 text-red-800';
            case 'critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm mb-10">
            <h3 className="text-2xl font-bold text-indigo-700 mb-6">AI Analysis</h3>

            {analysis ? (
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm text-gray-500 font-semibold">Primary Category</h4>
                            <p className="text-base font-medium text-gray-800">
                                {capitalize(analysis?.primary_category)}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm text-gray-500 font-semibold">Secondary Category</h4>
                            <p className="text-base font-medium text-gray-800">
                                {capitalize(analysis?.secondary_category)}
                            </p>
                        </div>
                    </div>

                    {/* Urgency and Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm text-gray-500 font-semibold">Urgency</h4>
                            <span
                                className={`inline-block px-3 py-1 mt-1 rounded-full text-xs font-semibold ${getStatusColor(
                                    analysis?.urgency
                                )}`}
                            >
                                {capitalize(analysis?.urgency)}
                            </span>
                        </div>
                        <div>
                            <h4 className="text-sm text-gray-500 font-semibold">Priority</h4>
                            <span
                                className={`inline-block px-3 py-1 mt-1 rounded-full text-xs font-semibold ${getStatusColor(
                                    analysis?.priority
                                )}`}
                            >
                                {capitalize(analysis?.priority)}
                            </span>
                        </div>
                    </div>

                    {/* Time Estimate */}
                    {analysis?.time_estimate && (
                        <div>
                            <h4 className="text-sm text-gray-500 font-semibold">Estimated Resolution Time</h4>
                            <p className="text-lg font-semibold text-gray-900">
                                {analysis.time_estimate.value} {analysis.time_estimate.unit}
                            </p>
                        </div>
                    )}

                    {/* Resources */}
                    {analysis?.resources && (
                        <div>
                            <h4 className="text-sm text-gray-500 font-semibold mb-1">Resources Needed</h4>
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Crew Size:</span> {analysis.resources.crew_size || 'N/A'} people
                            </p>

                            {analysis.resources.equipment?.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-700">Equipment:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
                                        {analysis.resources.equipment.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <p className="text-sm text-gray-700 mt-2">
                                <span className="font-medium">Difficulty:</span> {analysis.resources.difficulty || 'N/A'}/5
                            </p>
                        </div>
                    )}

                    {/* Safety Concerns */}
                    {analysis?.safety_concerns && (
                        <div>
                            <h4 className="text-sm text-gray-500 font-semibold">Safety Concerns</h4>
                            <p className="text-sm text-gray-800 mt-1">{analysis.safety_concerns}</p>
                        </div>
                    )}

                    {/* Special Considerations */}
                    {analysis?.special_considerations && (
                        <div>
                            <h4 className="text-sm text-gray-500 font-semibold">Special Considerations</h4>
                            <p className="text-sm text-gray-800 mt-1">{analysis.special_considerations}</p>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-indigo-700 font-medium mb-4">
                    {error ? (
                        <span className="text-red-600 font-semibold">{error}</span>
                    ) : (
                        'Click the button below to analyze this complaint.'
                    )}
                </p>
            )}

            {/* Action Button */}
            <button
                onClick={analyseComplaint}
                disabled={loadingAnalysis}
                className={`w-full py-3 mt-6 flex justify-center items-center text-white text-lg font-semibold rounded-xl transition 
      ${loadingAnalysis ? 'bg-indigo-500 opacity-80 cursor-not-allowed' : 'bg-indigo-700 hover:bg-indigo-800 hover:shadow-lg'}`}
            >
                {loadingAnalysis ? (
                    <>
                        <LoopIcon className="animate-spin mr-2" />
                        Analyzing...
                    </>
                ) : (
                    'Analyze Complaint using AI'
                )}
            </button>
        </div>

    );
}

export default AIEstimation;