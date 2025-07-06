import axiosInstance from "./axiosInstance";

export const submitComplaint = async (complaintData) => {
  try {
    const requiredFields = ['title', 'description', 'location', 'category'];
    const missingFields = requiredFields.filter(field => !complaintData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    console.log('Submitting complaint:', complaintData);

    const response = await axiosInstance.post('api/complaints/', complaintData);

    return response.data;

  } catch (error) {
    console.error('Complaint submission error:', error);

    if (error.response && error.response.status === 400) {
      const serverMessage = error.response.data?.error ||
        error.response.data?.message ||
        'Invalid complaint data';
      throw new Error(`Validation failed: ${serverMessage}`);
    }

    throw new Error(error.response?.data?.message ||
      error.message ||
      'Failed to submit complaint');
  }
};


// get complaints by complaint id
export const fetchComplaintById = async (complaintId) => {
  return await axiosInstance.get(`/api/complaints/${complaintId}`)
};

export const updateComplaintStatus = async (complaintId, status) => {
  return axiosInstance.patch(`/api/complaints/${complaintId}`, { status })
}

export const getUserComplaint = async () => {
  return await axiosInstance.get('/api/complaints/')
}

// delete complaint 
export const deleteComplaint = async () => {
  return axiosInstance.delete('/api/complaints/:id')
}



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

