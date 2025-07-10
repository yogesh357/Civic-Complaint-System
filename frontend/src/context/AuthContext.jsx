

import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser, logoutUser } from '../services/userApi';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState('user');
  const [userType, setUserType] = useState(null);

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
  };

  const logout = async () => {
    setUser(null);
    setUserType(null);
    const data = await logoutUser();
    if (data.success) toast.success(data.message);
  };



  // const getUser = async () => {
  //   try {
  //     const data = await fetchUser();
  //     if (data.success) {
  //       setUser(data.user);
  //       setUserType(data.user.role?.toUpperCase());

  //     }
  //   } catch (error) {
  //     setUser(null);
  //     setUserType(null); // optional
  //     toast.error(error.message);
  //   }
  // };

  const getUser = async () => {
    try {
      const endpoint = userType === 'ADMIN' ? '/api/admin/is-auth' : '/api/user/is-auth';
      const data = await axiosInstance.get(endpoint);
      if (data.success) {
        setUser(data.user);
        setUserType(data.user.role?.toUpperCase());
      }
    } catch (error) {
      setUser(null);
      setUserType(null);
      toast.error(error?.response?.data?.message || "Authentication error");
    }
  };

  useEffect(() => {
    getUser();
  }, []);


  useEffect(() => {
    if (user) console.log("🔥 AuthContext user updated:", user);
  }, [user]);

  useEffect(() => {
    if (!user || !userType) return;

    if (userType === 'ADMIN') {
      navigate('/department');
    } else if (userType === 'USER') {
      navigate('/');
    }
  }, [userType]);

  return (
    <AuthContext.Provider
      value={{
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
        navigate,
      }}
    >
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

 