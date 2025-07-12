

import { createContext, use, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser, logoutUser } from '../services/userApi';
import { toast } from 'react-toastify';
import { adminLogout, currentAdmin, getAllUsers } from '../services/adminApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState('user');
  const [userType, setUserType] = useState(null);

  const [allUsers, setAllUsers] = useState([])

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
  };

  const logout = async () => {
    setUser(null);
    setUserType(null);
    let data;
    if (userType == "USER") {
      data = await logoutUser();
    }
    if (userType == "ADMIN") {
      data = await adminLogout()
    }
    navigate('/')
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

  // const fetchAdmin = async () => {
  //   try {
  //     const { data } = await currentAdmin();
  //     if (data.success) {
  //       setUser(data.data);  // not data.user
  //       setUserType('ADMIN');
  //     }
  //   } catch (err) {
  //     setUser(null);
  //     setUserType(null);
  //   }
  // };


 

  const fetchAllUsers = async () => {
    try {
      const response = await getAllUsers();
      console.log("API response:", response); // Debug log

      if (response?.success && Array.isArray(response.data)) {
        const formattedUsers = response.data.map(user => ({
          id: user._id || user.id,
          name: user.name || 'Unknown',
          email: user.email || 'No email',
          isOnline: false,
          // Include any other fields you need
          ...user // Spread the rest of the user object
        }));

        setAllUsers(formattedUsers);
        console.log("Formatted users:", formattedUsers); // Debug log
        return formattedUsers;
      }
      throw new Error('Invalid users data format');
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      throw error;
    }
  };


  const getUser = async () => {
    try {
      if (userType === 'ADMIN') {
        const adminRes = await currentAdmin();
        if (adminRes?.data?.success) {
          setUser(adminRes.data.data); // data.data is correct for your response
          setUserType('ADMIN');
          return;
        }
      } else if (userType === 'USER') {
        const userRes = await fetchUser();
        if (userRes?.success) {
          setUser(userRes.user);
          setUserType(userRes.user.role?.toUpperCase() || 'USER');
          return;
        }
      } else {
        // If userType is not set yet (e.g., on initial load), try both
        try {
          const adminRes = await currentAdmin();
          if (adminRes?.data?.success) {
            setUser(adminRes.data.data);
            setUserType('ADMIN');
            return;
          }
        } catch (_) {
          // ignore
        }

        try {
          const userRes = await fetchUser();
          if (userRes?.success) {
            setUser(userRes.user);
            setUserType(userRes.user.role?.toUpperCase() || 'USER');
            return;
          }
        } catch (_) {
          // ignore
        }
      }
    } catch (err) {
      // All attempts failed
      setUser(null);
      setUserType(null);
    }
  };

  // const getUser = async () => {
  //   try {
  //     // Clear previous state while loading
  //     setUser(null);
  //     setUserType(null);

  //     // First try user endpoint (most common case)
  //     try {
  //       const userRes = await fetchUser();
  //       if (userRes?.success) {
  //         setUser(userRes.user);
  //         const role = userRes.user.role?.toUpperCase() || 'USER';
  //         setUserType(role);
  //         return;
  //       }
  //     } catch (userError) {
  //       console.debug('User auth failed, trying admin:', userError);
  //     }

  //     // Only try admin if userType was explicitly set to ADMIN
  //     // or if we have no userType yet (initial load)
  //     if (!userType || userType === 'ADMIN') {
  //       try {
  //         const adminRes = await currentAdmin();
  //         if (adminRes?.data?.success) {
  //           setUser(adminRes.data.data);
  //           setUserType('ADMIN');
  //           return;
  //         }
  //       } catch (adminError) {
  //         console.debug('Admin auth failed:', adminError);
  //       }
  //     }

  //     // All attempts failed
  //     throw new Error('Authentication failed');
  //   } catch (err) {
  //     setUser(null);
  //     setUserType(null);
  //     console.error('Authentication error:', err);
  //   }
  // };

  // const getUser = async () => {
  //   try {
  //     let data;
  //     if (userType == "USER") {
  //       data = await fetchUser()
  //     } else if (userType == "ADMIN") {
  //       data = await currentAdmin()
  //     }
  //     console.log("user data from current get user", data)
  //     if (data.success) {
  //       setUser(data)
  //     }
  //   } catch (err) {
  //     setUser(null);
  //     setUserType(null);
  //     console.error('Authentication error:', err);
  //   }
  // }



  useEffect(() => {
    getUser();
    // fetchAdmin()
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      if (userType === 'ADMIN') {
        try {
          await fetchAllUsers();
        } catch (error) {
          console.error('Failed to load users:', error);
        }
      }
    };

    loadUsers();
  }, [userType]); // Only depend on userType




  useEffect(() => {
    if (user) console.log("🔥 AuthContext user updated:", user);
  }, [user]);

  // useEffect(() => {
  //   if (!user || !userType) return;

  //   if (userType === 'ADMIN') {
  //     navigate('/');
  //   } else if (userType === 'USER') {
  //     navigate('/');
  //   }
  // }, [userType]);

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
        allUsers,
        fetchAllUsers
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

