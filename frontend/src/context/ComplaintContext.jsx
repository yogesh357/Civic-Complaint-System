
import { createContext, useContext, useState, useEffect } from 'react';
import { getUserComplaint, submitComplaint } from '../services/complaintApi';

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
        const data = await getUserComplaint();
        // setComplaints(data);
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

//////////////



// import { createContext, useContext, useState, useEffect } from 'react';
// import { getUserComplaint, submitComplaint } from '../services/complaintApi';
// import { toast } from 'react-toastify';
// import { useAuthContext } from './AuthContext';
// import { fetchAllComplaints } from '../services/adminApi';

// const ComplaintContext = createContext();

// export function ComplaintProvider({ children }) {
//   const { userType } = useAuthContext();
//   console.log("userType in complaint context", userType)

//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadComplaints = async () => {
//       try {
//         if (userType === 'USER') {
//           const data = await getUserComplaint();
//           setComplaints(Array.isArray(data) ? data : []);
//         } else if (userType === 'ADMIN') {
//           // Optionally: fetch department-level complaints
//           const data = await fetchAllComplaints();
//           console.log("compalint from complaint context:", data)
//           setComplaints(Array.isArray(data) ? data : []);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userType) loadComplaints(); // Only try after we know the role
//   }, [userType]);

//   const addComplaint = async (complaint) => {
//     try {
//       const promise = submitComplaint(complaint); // Start promise early

//       // Show toast while awaiting the submission
//       const response = await toast.promise(promise, {
//         pending: ' Submitting your complaint...',
//         success: ' Complaint added successfully!',
//         error: 'Failed to submit complaint. Try again.',
//       });

//       // Normalize response data
//       const newComplaint = response.data?.data || response.data || response;

//       // Validation check
//       if (!newComplaint?.id) {
//         throw new Error('No ID received in complaint response');
//       }

//       // Add complaint to context/state
//       setComplaints((prev) => [...prev, newComplaint]);

//       return newComplaint;

//     } catch (err) {
//       console.error('Complaint submission error:', err);
//       setError(err.message || 'An unexpected error occurred');
//       throw err; // Rethrow so the form can handle it
//     }
//   };


//   return (
//     <ComplaintContext.Provider value={{
//       complaints,
//       loading,
//       error,
//       addComplaint
//     }}>
//       {children}
//     </ComplaintContext.Provider>
//   );
// }

// export function useComplaintContext() {
//   const context = useContext(ComplaintContext);
//   if (!context) {
//     throw new Error('useComplaintContext must be used within a ComplaintProvider');
//   }
//   return context;
// }


// import { createContext, useContext, useState, useEffect } from 'react';
// import { getUserComplaint, submitComplaint } from '../services/complaintApi';
// import { fetchAllComplaints } from '../services/adminApi';
// import { toast } from 'react-toastify';
// import { useAuthContext } from './AuthContext';

// const ComplaintContext = createContext();

// export function ComplaintProvider({ children }) {
//   const { userType, loadingUser } = useAuthContext();
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadComplaints = async () => {
//       try {
//         if (userType === 'USER') {
//           const data = await getUserComplaint();
//           setComplaints(Array.isArray(data) ? data : []);
//         } else if (userType === 'ADMIN') {
//           const data = await fetchAllComplaints();
//           setComplaints(Array.isArray(data) ? data : []);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!loadingUser && userType) {
//       loadComplaints(); // Only load after auth is done
//     }
//   }, [userType, loadingUser]);

//   const addComplaint = async (complaint) => {
//     try {
//       const promise = submitComplaint(complaint);

//       const response = await toast.promise(promise, {
//         pending: 'Submitting your complaint...',
//         success: 'Complaint added successfully!',
//         error: 'Failed to submit complaint. Try again.',
//       });

//       const newComplaint = response.data?.data || response.data || response;
//       if (!newComplaint?.id) throw new Error('No ID received in complaint response');

//       setComplaints((prev) => [...prev, newComplaint]);
//       return newComplaint;
//     } catch (err) {
//       console.error('Complaint submission error:', err);
//       setError(err.message || 'Unexpected error');
//       throw err;
//     }
//   };

//   return (
//     <ComplaintContext.Provider value={{ complaints, loading, error, addComplaint }}>
//       {children}
//     </ComplaintContext.Provider>
//   );
// }

// export function useComplaintContext() {
//   const context = useContext(ComplaintContext);
//   if (!context) throw new Error('useComplaintContext must be used within a ComplaintProvider');
//   return context;
// }
