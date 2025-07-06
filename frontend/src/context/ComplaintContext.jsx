
// import { createContext, useContext, useState, useEffect } from 'react';
// import { getUserComplaint, submitComplaint } from '../services/complaintApi';

// // 1. Create context
// const ComplaintContext = createContext();

// // 2. Create provider component
// export function ComplaintProvider({ children }) {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadComplaints = async () => {
//       try {
//         const data = await getUserComplaint();
//         // setComplaints(data);
//         setComplaints(Array.isArray(data) ? data : []);
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
// }

// // 3. Create custom hook for consuming context
// export function useComplaintContext() {
//   const context = useContext(ComplaintContext);
//   if (!context) {
//     throw new Error('useComplaintContext must be used within a ComplaintProvider');
//   }
//   return context;
// }

import { createContext, useContext, useState, useEffect } from 'react';
import { getUserComplaint, submitComplaint } from '../services/complaintApi';

const ComplaintContext = createContext();

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await getUserComplaint();
        setComplaints(Array.isArray(data) ? data : []);
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
      // 1. Make API call
      const response = await submitComplaint(complaint);

      // 2. Handle different response structures
      const newComplaint = response.data?.data || response.data || response;

      // 3. Validate we got an ID
      if (!newComplaint?.id) {
        throw new Error('No ID received in complaint response');
      }

      // 4. Update state
      setComplaints(prev => [...prev, newComplaint]);

      // 5. Return the complete complaint
      return newComplaint;

    } catch (err) {
      console.error('Complaint submission error:', err);
      setError(err.message);
      throw err; // Re-throw for form handling
    }
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      loading,
      error,
      addComplaint
    }}>
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaintContext() {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaintContext must be used within a ComplaintProvider');
  }
  return context;
}