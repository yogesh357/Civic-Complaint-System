// Mock data
const mockComplaints = [
  {
    id: '1',
    category: 'pothole',
    description: 'Large pothole on Main Street causing traffic issues',
    location: {
      latitude: 51.505,
      longitude: -0.09,
      address: 'Main Street, Downtown'
    },
    timestamp: '2023-05-15T10:30:00Z',
    status: 'in-progress',
    image: 'https://example.com/pothole.jpg'
  },
  // Add more mock complaints as needed
];
// src/services/api.js

// Mock function - replace with actual API call
export const updateComplaintStatus = async (complaintId, newStatus) => {
  // In a real app, this would be an API call like:
  // return axios.put(`/api/complaints/${complaintId}`, { status: newStatus });
  
  // Mock implementation:
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: complaintId,
        status: newStatus,
        // Include other complaint fields that would be returned from API
        ...mockComplaints.find(c => c.id === complaintId),
        status: newStatus
      });
    }, 500);
  });
};

 
// Mock API functions
export const fetchComplaints = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockComplaints;
};

export const fetchComplaintById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const complaint = mockComplaints.find(c => c.id === id);
  if (!complaint) throw new Error('Complaint not found');
  return complaint;
};

export const submitComplaint = async (complaint) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newComplaint = {
    ...complaint,
    id: Math.random().toString(36).substr(2, 9),
    status: 'submitted'
  };
  mockComplaints.unshift(newComplaint);
  return newComplaint;
};

export const loginUser = async (credentials) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    token: 'mock-token',
    user: {
      email: credentials.email,
      name: credentials.name || 'User',
      type: credentials.email.endsWith('@city.gov') ? 'department' : 'citizen'
    }
  };
};