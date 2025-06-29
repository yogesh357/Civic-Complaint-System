import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import LoginOptionsModal from './LoginOptionsModal';

const Navbar = ({ isAuthenticated }) => {

  const { userType, } = useAuthContext();
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center text-slate-800">
      {/* Logo / Brand */}
      <div className="text-2xl font-bold text-indigo-600">
        <Link to="/">ReportHub</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6 text-lg font-medium items-center">
        <Link
          to="/"
          className="hover:text-indigo-600 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/submit-complaint"
          className="hover:text-indigo-600 transition-colors"
        >
          Report Issue
        </Link>
        <Link
          to="/track-complaint"
          className="hover:text-indigo-600 transition-colors"
        >
          Track Complaint
        </Link>

        {isAuthenticated && userType === 'department' && (
          <Link
            to="/department"
            className="hover:text-indigo-600 transition-colors"
          >
            Dashboard
          </Link>
        )}

        {isAuthenticated ? (
          <button
            className="ml-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          // <button
          //   onClick={() => {
          //     setIsOpen(true);
          //     navigate('/login-options')
          //   }}
          //   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"

          // >
          //   {/* <button
          //   className="ml-4 bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
          //   > */}
          //   Login
          // </button>
          <div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>

            <LoginOptionsModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>

        )}
      </div>
    </nav>
  );
};

export default Navbar;
