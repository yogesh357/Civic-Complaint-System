
// import { useAuthContext } from "../context/AuthContext";

// const ErrorPage = ({ error }) => {
//     const isUnauthorized = error?.type === 'UNAUTHORIZED';
//     const { navigate } = useAuthContext()

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//             <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
//                 <h1 className="text-3xl font-bold text-red-600 mb-4">
//                     {isUnauthorized ? 'Access Denied' : 'Something Went Wrong'}
//                 </h1>
//                 <p className="text-gray-700 mb-6">
//                     {error?.message || 'An unexpected error occurred.'}
//                 </p>
//                 {isUnauthorized && (
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
//                     >
//                         Go Back
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ErrorPage;

import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext";

const ErrorPage = ({ error = {} }) => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const isUnauthorized = error?.type === 'UNAUTHORIZED';
    const isUnauthenticated = error?.type === 'UNAUTHENTICATED';

    // If unauthenticated but somehow reached this page, redirect to home
    if (isUnauthenticated && !user) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">
                    {isUnauthorized ? 'Access Denied' : 'Error'}
                </h1>
                <p className="text-gray-700 mb-6">
                    {error?.message || 'An unexpected error occurred.'}
                </p>
                <div className="flex justify-center gap-4">
                    {isUnauthorized && (
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Go Back
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;