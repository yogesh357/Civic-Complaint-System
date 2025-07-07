
// import { createContext, useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [showUserLogin, setShowUserLogin] = useState(false)
//   const [showAdminLogin, setAdminLogin] = useState(false)
//   const [userType, setUserType] = useState(null);




//   const login = (userData) => {
//     setUser(userData);
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, userType, login, logout, setShowUserLogin, setUser, showUserLogin, setUserType, navigate }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuthContext() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuthContext must be used within an AuthProvider');
//   }
//   return context;
// }

import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState('user'); // 'user' or 'admin'
  const [userType, setUserType] = useState(null);

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      login,
      logout,
      showAuthModal,
      setShowAuthModal,
      authModalType,
      setAuthModalType,
      setUser,
      setUserType,
      navigate
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}