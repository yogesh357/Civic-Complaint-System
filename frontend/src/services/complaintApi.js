import axiosInstance from "./axiosInstance";


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

export const submitComplaint = async (complaintData) => {
  try {
    // First validate required fields on client side
    const requiredFields = ['title', 'description', 'location', 'category', 'userId'];
    const missingFields = requiredFields.filter(field => !complaintData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Log the outgoing request for debugging
    console.log('Submitting complaint:', complaintData);

    const response = await axiosInstance.post('api/complaints/', complaintData, {
      headers: {
        'Content-Type': 'application/json',
        // Include authorization if needed
        ...(localStorage.getItem('token') && {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
      }
    });

    return response.data;

  } catch (error) {
    console.error('Complaint submission error:', error);

    // Handle 400 Bad Request specifically
    if (error.response && error.response.status === 400) {
      // Extract backend validation messages if available
      const serverMessage = error.response.data?.error ||
        error.response.data?.message ||
        'Invalid complaint data';
      throw new Error(`Validation failed: ${serverMessage}`);
    }

    // Handle other errors
    throw new Error(error.response?.data?.message ||
      error.message ||
      'Failed to submit complaint');
  }
};

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

