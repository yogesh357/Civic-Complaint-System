 
import { createContext, useContext, useState } from 'react';
 
const AuthContext = createContext();
 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showUserLogin , setShowUserLogin] = useState(false)


  
  const login = (userData) => {
    setUser(userData);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout,setShowUserLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create the custom hook
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}