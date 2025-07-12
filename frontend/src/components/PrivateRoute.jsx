// // src/components/PrivateRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuthContext } from '../context/AuthContext';

// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { userType, user } = useAuthContext();

//   if (!user) return <Navigate to="/" />; // Redirect if not logged in

//   if (!allowedRoles.includes(userType)) {
//     return <Navigate to="/" />; // Redirect if user doesn't have the right role
//   }

//   return children;
// };

// export default PrivateRoute;


// import { Navigate, useLocation } from 'react-router-dom';
// import { verifyAccess } from '../utils/auth';
// import ErrorPage from './ErrorPage';
// import { useAuthContext } from '../context/AuthContext';

// const PrivateRoute = ({ children, allowedRoles = [] }) => {
//   const location = useLocation();
//   const { user, setShowAuthModal} = useAuthContext() // Or from your auth context

//   const { granted, error } = verifyAccess(user, allowedRoles);

//   if (!granted) {
//     if (error.type === 'UNAUTHENTICATED') {
//       return <div>
//           not authorized
//       </div>
//     }
//     return <ErrorPage error={error} />;
//   }

//   return children;
// };

// export default PrivateRoute;

///////////


import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { verifyAccess } from '../utils/auth';
import ErrorPage from './ErrorPage';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, setShowAuthModal } = useAuthContext();
  const { granted, error } = verifyAccess(user, allowedRoles);

  // Debugging logs
  console.log('User roles:', user?.roles);
  console.log('Allowed roles:', allowedRoles);
  console.log('Access granted:', granted);
  console.log('Error:', error);

  // Handle showing auth modal for unauthenticated users
  useEffect(() => {
    if (error?.showModal) {
      setShowAuthModal(true);
      localStorage.setItem('redirectPath', location.pathname);
    }
  }, [error, setShowAuthModal, location.pathname]);

  if (!granted) {
    if (user) {
      // User is logged in but doesn't have permission
      return <ErrorPage error={error} />;
    }
    // User is not logged in - return null while auth modal shows
    return null;
  }

  return children;
};

export default PrivateRoute;