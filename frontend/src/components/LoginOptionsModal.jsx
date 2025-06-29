
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const LoginOptionsModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const { setShowUserLOgin } = useAuthContext()

    const handleOptionClick = (path) => {
        onClose(); // Close the modal first
        navigate(path); // Then navigate
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0  bg-black/50 bg-opacity-60  flex items-center justify-center z-50"

            onClick={onClose} // Close when clicking backdrop
        >
            <div
                className="bg-white p-6 rounded-xl shadow-2xl w-80"
                onClick={(e) => e.stopPropagation()} // Prevent closing on content click
            >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    Select Login Option
                </h3>

                <div className="space-y-4">
                    <button
                        onClick={() => {
                            handleOptionClick('/citizen-login');
                        }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Join as Citizen
                    </button>
                    <button
                        onClick={() => handleOptionClick('/officer-login')}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                    >
                        Join as Municipality
                    </button>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginOptionsModal;
