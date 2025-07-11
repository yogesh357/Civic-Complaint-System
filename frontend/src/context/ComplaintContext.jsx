
import { createContext, useContext, useState, useEffect } from 'react';
import { getAllComplaint, getUserComplaint, submitComplaint } from '../services/complaintApi';
import { useAuthContext } from './AuthContext';
import { fetchAllComplaints } from '../services/adminApi';
 
const ComplaintContext = createContext();
 
export function ComplaintProvider({ children }) {

  const { userType } = useAuthContext()

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        let data;
        if (userType === 'USER') {
          data = await getUserComplaint();
          setComplaints(Array.isArray(data) ? data : []);
        } else if (userType === 'ADMIN') { 
          const res = await fetchAllComplaints(); 
          setComplaints(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userType) {
      loadComplaints();
    }
  }, [userType]);


  const addComplaint = async (complaint) => {
    try {
      const newComplaint = await submitComplaint(complaint);
      setComplaints([...complaints, newComplaint]);
      return newComplaint;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <ComplaintContext.Provider value={{ complaints, loading, error, addComplaint }}>
      {children}
    </ComplaintContext.Provider>
  );
}

// 3. Create custom hook for consuming context
export function useComplaintContext() {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaintContext must be used within a ComplaintProvider');
  }
  return context;
}
 