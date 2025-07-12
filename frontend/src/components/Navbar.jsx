
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { FiUser, FiLogOut } from 'react-icons/fi'; // Using react-icons for profile and logout icons

const Navbar = () => {
  const {
    userType,
    user,
    setShowAuthModal,
    setAuthModalType,
    logout,
    navigate
  } = useAuthContext();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center text-slate-800">
      {/* Logo / Brand */}
      <div className="text-2xl font-bold text-indigo-600">
        <Link to="/">ReportHub</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6 text-lg font-medium items-center">
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        {userType === "USER" && (
          <>
            <Link to="/submit-complaint" className="hover:text-indigo-600 transition-colors">
              Report Issue
            </Link>
            <Link to="/my-complaint" className="hover:text-indigo-600 transition-colors">
              Previous Complaints
            </Link>
          </>
        )
        }


        {userType === 'ADMIN' && (
          <>
            <Link to="/department" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <Link className="hover:text-indigo-600 transition-colors" to={'/all-users'}>
              Users Panel
            </Link>
          </>
        )}

        <Link to='/contact-us' className="hover:text-indigo-600 transition-colors"> Contact us </Link>


        {/* Authentication Section */}
        {!user ? (
          <button
            onClick={() => {
              setAuthModalType('user');
              setShowAuthModal(true);
            }}
            className="cursor-pointer px-6 py-2 bg-green-500 hover:bg-green-600 transition text-white rounded-full text-sm"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-1 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <FiUser size={20} />
              </div>
              <span className="hidden md:inline">{user.name}</span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
                <Link
                  to="/my-complaints"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Complaints
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;