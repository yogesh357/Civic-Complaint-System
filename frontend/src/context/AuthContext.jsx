
import { createContext, useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false)
  const [showAdminLogin, setAdminLogin] = useState(false)
  const [userType, setUserType] = useState(null);




  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setShowUserLogin, showUserLogin }}>
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