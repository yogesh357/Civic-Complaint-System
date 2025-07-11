import axiosInstance from "./axiosInstance";

export const submitComplaint = async (complaintData) => {
  try {
    
 
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
  const respone = await axiosInstance.get('/api/complaints/')   
  return respone.data.data;
}


// delete complaint 
export const deleteComplaint = async () => {
  return axiosInstance.delete('/api/complaints/:id')
}

// getting all complaints for admin
export const getAllComplaint = async ()=>{
  const res = await axiosInstance.get('/api/admin/complaints')
  return res.data
}



 
