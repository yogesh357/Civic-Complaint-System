// import React, { createContext, useState, useEffect } from 'react';
// import { fetchComplaints, submitComplaint } from '../services/api';

// export const ComplaintContext = createContext();

// export const ComplaintProvider = ({ children }) => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     const loadComplaints = async () => {
//       try {
//         const data = await fetchComplaints();
//         setComplaints(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadComplaints();
//   }, []);
  
//   const addComplaint = async (complaint) => {
//     try {
//       const newComplaint = await submitComplaint(complaint);
//       setComplaints([...complaints, newComplaint]);
//       return newComplaint;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };
  
//   return (
//     <ComplaintContext.Provider value={{ complaints, loading, error, addComplaint }}>
//       {children}
//     </ComplaintContext.Provider>
//   );
// };
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchComplaints, submitComplaint } from '../services/api';

// 1. Create context
const ComplaintContext = createContext();

// 2. Create provider component
export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await fetchComplaints();
        setComplaints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadComplaints();
  }, []);

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