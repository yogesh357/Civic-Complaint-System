

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
            setUserType(adminRes.data.data.role || 'ADMIN');
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
  //     console.log("user type from auth context", userType)
  //     // If userType already known, just fetch accordingly
  //     if (userType === 'ADMIN') {
  //       const adminRes = await currentAdmin();
  //       if (adminRes?.data?.success) {
  //         setUser(adminRes.data.data);
  //         setUserType('ADMIN');
  //         return;
  //       } else {
  //         setUser(null);
  //         setUserType(null);
  //         return;
  //       }
  //     }

  //     if (userType === 'USER') {
  //       const userRes = await fetchUser();
  //       if (userRes?.success) {
  //         console.log("user data from auth contexx", userRes)
  //         setUser(userRes.user);
  //         setUserType(userRes.user.role?.toUpperCase() || 'USER');
  //         return;
  //       } else {
  //         setUser(null);
  //         setUserType(null);
  //         return;
  //       }
  //     }

  //     // If userType not known, detect by trying admin first
  //     const userRes = await fetchUser();
  //     if (userRes?.success) {
  //       setUser(userRes.user);
  //       setUserType(userRes.user.role?.toUpperCase() || 'USER');
  //       return;
  //     }
  //     const adminRes = await currentAdmin();
  //     if (adminRes?.data?.success) {
  //       setUser(adminRes.data.data);
  //       setUserType('ADMIN');
  //       return;
  //     }
  //     // If both fail
  //     setUser(null);
  //     setUserType(null);
  //   } catch (err) {
  //     setUser(null);
  //     setUserType(null);
  //   }
  // };




  // 

  // const getUser = async () => {
  //   try {
  //     // 1️⃣ If userType is already known, fetch accordingly
  //     if (userType === 'ADMIN') {
  //       try {
  //         const adminRes = await currentAdmin();
  //         if (adminRes?.data?.success) {
  //           setUser(adminRes.data.data);
  //           setUserType('ADMIN');
  //           return;
  //         }
  //       } catch (err) {
  //         console.warn("Admin check failed:", err);
  //       }
  //       setUser(null);
  //       setUserType(null);
  //       return;
  //     }

  //     if (userType === 'USER') {
  //       try {
  //         const userRes = await fetchUser();
  //         if (userRes?.success) {
  //           console.log("user data from auth context", userRes);
  //           setUser(userRes.user);
  //           setUserType(userRes.user.role?.toUpperCase() || 'USER');
  //           return;
  //         }
  //       } catch (err) {
  //         console.warn("User check failed:", err);
  //       }
  //       setUser(null);
  //       setUserType(null);
  //       return;
  //     }

  //     // 2️⃣ If userType is unknown (first load), try admin first
  //     try {
  //       const adminRes = await currentAdmin();
  //       if (adminRes?.data?.success) {
  //         setUser(adminRes.data.data);
  //         setUserType('ADMIN');
  //         return;
  //       }
  //     } catch (err) {
  //       if (err.response?.status !== 401) {
  //         console.error("Unexpected error in currentAdmin:", err);
  //       } else {
  //         console.info("Admin check: not logged in as admin (401).");
  //       }
  //     }


  //     try {
  //       const userRes = await fetchUser();
  //       if (userRes?.success) {
  //         setUser(userRes.user);
  //         setUserType(userRes.user.role?.toUpperCase() || 'USER');
  //         return;
  //       }
  //     } catch (err) {
  //       console.info("Not a user:", err.response?.status);
  //     }

  //     setUser(null);
  //     setUserType(null);
  //   } catch (err) {
  //     console.error("Unexpected error in getUser():", err);
  //     setUser(null);
  //     setUserType(null);
  //   }
  // };






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

